import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { emitTrace, otlpPayload, serializeSessionReference, startSpan, type TraceEvent } from "./tracer";

describe("universal local tracer", () => {
  test("serializes only an opaque session ID", () => {
    expect(serializeSessionReference({ sessionId: "opaque-€" })).toEqual({ sessionId: "opaque-€" });
    for (const invalid of [
      { sessionId: "a/b" },
      { sessionId: "a\\b" },
      { sessionId: "a\u0000b" },
      { sessionId: "https:thing" },
      { sessionId: "x".repeat(129) },
      { sessionId: "valid", store: "project-local" },
      { sessionId: "valid", content: "raw session" },
    ]) expect(serializeSessionReference(invalid)).toBeUndefined();
  });

  test("exports only session.id and never session-store metadata or content", () => {
    const event = {
      name: "reference",
      traceId: "t",
      spanId: "s",
      attributes: { generic: "kept" },
      sessionReference: { sessionId: "opaque-session" },
    };
    const text = JSON.stringify(otlpPayload(event));
    expect(text).toContain('"session.id"');
    expect(text).toContain("opaque-session");
    for (const forbidden of ["session.reference", "project-local", "revision", "eventStart", "messageCount", "raw prompt", "tool result"]) {
      expect(text).not.toContain(forbidden);
    }
  });

  test("traces subprocess delegation relationships without session payloads", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-session-"));
    const reference = { sessionId: "parent-session" };
    const events = [
      { name: "subprocess.launch", traceId: "trace", spanId: "launch", attributes: { outcome: "success" as const }, sessionReference: reference },
      { name: "worker.lifecycle", traceId: "trace", spanId: "worker", parentSpanId: "launch", attributes: { outcome: "success" as const }, sessionReference: reference },
      { name: "subprocess.exit", traceId: "trace", spanId: "exit", parentSpanId: "launch", attributes: { outcome: "success" as const }, sessionReference: reference },
      { name: "subprocess.handoff", traceId: "trace", spanId: "handoff", parentSpanId: "launch", attributes: { outcome: "success" as const }, sessionReference: reference },
    ];
    for (const event of events) await emitTrace(event, cwd, { backend: "file" });
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    for (const event of events) expect(local).toContain(`"name":"${event.name}"`);
    expect(local).toContain('"sessionId":"parent-session"');
    expect(local).not.toContain("raw prompt");
  });

  test("appends without modifying existing trace bytes", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-append-"));
    const path = join(cwd, ".as-is", "tracing.jsonl");
    await emitTrace({ name: "first", traceId: "trace-1", spanId: "span-1", attributes: {} }, cwd, { backend: "file" });
    const before = await readFile(path);
    await emitTrace({ name: "second", traceId: "trace-2", spanId: "span-2", attributes: {} }, cwd, { backend: "file" });
    const after = await readFile(path);
    expect(after.subarray(0, before.length)).toEqual(before);
    expect(after.toString()).toContain('"name":"second"');
  });

  test("reads tracing configuration only from the JSON companion", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-json-authority-"));
    await writeFile(join(cwd, "as-is.md"), "---\nconfig:\n  observability:\n    tracing:\n      enabled: false\n---\n# Context\n");
    await writeFile(join(cwd, "as-is.json"), JSON.stringify({ configuration: { observability: { tracing: { backend: "file", enabled: true, "local-directory": ".as-is/json-authority.jsonl" } } } }));
    await emitTrace({ name: "json-authority", traceId: "trace", spanId: "span", attributes: {} }, cwd);
    await expect(readFile(join(cwd, ".as-is", "json-authority.jsonl"), "utf8")).resolves.toContain('"name":"json-authority"');
  });

  test("writes to the configured file for any runtime event", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-"));
    await writeFile(join(cwd, "as-is.json"), JSON.stringify({ configuration: { observability: { tracing: { backend: "file", enabled: true, "local-directory": ".as-is/tracing.jsonl" } } } }));
    await emitTrace({ name: "control-plane.delegate", traceId: "trace-1", spanId: "span-1", attributes: { outcome: "success", secret: undefined } }, cwd);
    const lines = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(lines).toContain('"name":"control-plane.delegate"');
    expect(lines).not.toContain("secret");
  });

  test("tracks parent and child relationships, duration, and success", async () => {
    const events: TraceEvent[] = [];
    let clock = 1000;
    const emit = async (event: TraceEvent) => { events.push(event); };
    const parent = startSpan("parent", { cwd: ".", traceId: "trace", spanId: "parent", now: () => clock, emit });
    clock = 1012;
    const child = startSpan("child", { cwd: ".", traceId: parent.traceId, spanId: "child", parentSpanId: parent.spanId, now: () => clock, emit });
    clock = 1020;
    await child.finish("success");
    clock = 1035;
    await parent.finish("success", { bounded: true });
    expect(events.map(({ traceId, spanId, parentSpanId }) => ({ traceId, spanId, parentSpanId }))).toEqual([{ traceId: "trace", spanId: "child", parentSpanId: "parent" }, { traceId: "trace", spanId: "parent", parentSpanId: undefined }]);
    expect(events.map(({ durationMs, attributes }) => [durationMs, attributes.outcome])).toEqual([[8, "success"], [35, "success"]]);
    expect(events[1].attributes.bounded).toBe(true);
  });

  test("records failure and isolates telemetry failures", async () => {
    let clock = 10;
    const span = startSpan("failed", { cwd: ".", now: () => clock, emit: async () => { throw new Error("sink down"); } });
    clock = 17;
    await expect(span.finish("failure", { reason: "error" })).resolves.toBeUndefined();
    await expect(span.finish("success")).resolves.toBeUndefined();
  });

  test("creates an OTLP-compatible span payload", () => {
    const payload = otlpPayload({ name: "worker.result", traceId: "trace-1", spanId: "span-1", durationMs: 4, timestamp: "2026-08-04T00:00:00.000Z", attributes: { outcome: "success", duration_ms: 4 } });
    const span = payload.resourceSpans[0].scopeSpans[0].spans[0];
    expect(span.name).toBe("worker.result");
    expect(span.attributes).toHaveLength(2);
    expect(span.kind).toBe(1);
    expect(span.startTimeUnixNano).toBe("1785801600000000000");
    expect(span.endTimeUnixNano).toBe("1785801600004000000");
  });
});
