import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { emitTrace, otlpPayload, serializeSessionReference, startSpan, type TraceEvent } from "./tracer.ts";

describe("universal local tracer", () => {
  test("serializes only an opaque session ID", () => {
    expect(serializeSessionReference({ sessionId: "opaque-session" })).toEqual({ sessionId: "opaque-session" });
    for (const invalid of [
      { sessionId: "a/b" },
      { sessionId: "a\\b" },
      { sessionId: "a\u0000b" },
      { sessionId: "https:thing" },
      { sessionId: "x".repeat(129) },
      { sessionId: "valid", store: "project-local" },
      { sessionId: "valid", content: "raw session" },
      { sessionId: "opaque-€" },
      { sessionId: "opaque session" },
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

  test("projects unsafe event fields and nested path values out of both sinks", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-privacy-"));
    const tokens = {
      absolute: "PRIVACY-ABSOLUTE-/home/private/project",
      relative: "PRIVACY-RELATIVE-../component",
      component: "PRIVACY-COMPONENT-components/example",
      configured: "PRIVACY-CONFIGURED-.as-is/tracing.jsonl",
      worktree: "PRIVACY-WORKTREE-/tmp/worktree",
      session: "PRIVACY-SESSION-/sessions/private.jsonl",
      task: "PRIVACY-TASK-/component/as-is.json",
      log: "PRIVACY-LOG-/tmp/worker.log",
    };
    const event = {
      name: "component-build.worker",
      traceId: tokens.component,
      spanId: "safe-span",
      timestamp: "not-a-timestamp",
      durationMs: Number.POSITIVE_INFINITY,
      attributes: {
        "safe-key": tokens.absolute,
        outcome: "success",
        "path-bearing-key-/tmp/log": "success",
        "as_is.component_path": tokens.component,
        nested: { absolute: tokens.absolute, task: tokens.task, configured: tokens.configured, log: tokens.log },
        nestedArray: [tokens.worktree, tokens.session],
        "as_is.task_revision": 2,
      },
      sessionReference: { sessionId: "opaque-session" },
    } as unknown as TraceEvent;
    await emitTrace(event, cwd, { backend: "file" });
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    const payload = JSON.stringify(otlpPayload(event));
    for (const token of Object.values(tokens)) {
      expect(local).not.toContain(token);
      expect(payload).not.toContain(token);
    }
    expect(local).toContain('"name":"unknown"');
    expect(local).toContain('"outcome":"success"');
    expect(local).toContain('"as_is.task_revision":2');
    expect(payload).toContain('"session.id"');
    expect(JSON.stringify(event)).toContain(tokens.absolute);
  });

  test("projects unlisted event names and invalid timestamps or durations safely", async () => {
    const event = {
      name: "supervisor.watchdog",
      traceId: "trace-safe",
      spanId: "span-safe",
      timestamp: "2026-02-30T25:61:61Z",
      durationMs: 86_400_001,
      attributes: { outcome: "success" },
    } as unknown as TraceEvent;
    const payload = JSON.stringify(otlpPayload(event));
    expect(payload).toContain('"name":"unknown"');
    expect(payload).not.toContain("2026-02-30");
    expect(payload).not.toContain("86400001");
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-duration-"));
    await emitTrace(event, cwd, { backend: "file" });
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(local).not.toContain("2026-02-30");
    expect(local).not.toContain("86400001");
    expect(serializeSessionReference({ sessionId: "session/path" })).toBeUndefined();
    expect(serializeSessionReference({ sessionId: "session id" })).toBeUndefined();
  });

  test("keeps valid bounded values, rejects malformed values, and does not mutate input", async () => {
    const event = {
      name: "worker.result",
      traceId: "trace-safe",
      spanId: "span-safe",
      parentSpanId: "parent-safe",
      timestamp: "2026-08-04T00:00:00.000Z",
      durationMs: 4,
      attributes: {
        outcome: "failure",
        bounded: true,
        duration_ms: 4,
        reason: "error",
        invalidString: "omit-me",
        invalidObject: { secret: "omit-me" },
        invalidArray: ["omit-me"],
        invalidNumber: Number.NaN,
      },
    } as unknown as TraceEvent;
    const before = JSON.stringify(event);
    const payload = JSON.stringify(otlpPayload(event));
    expect(JSON.stringify(event)).toBe(before);
    expect(payload).toContain("failure");
    expect(payload).toContain("error");
    expect(payload).toContain("4");
    expect(payload).not.toContain("omit-me");
    expect(payload).not.toContain("invalidString");
    expect(payload).not.toContain("invalidObject");
  });

  test("isolates disabled and failing sinks", async () => {
    const disabledCwd = await mkdtemp(join(tmpdir(), "as-is-trace-disabled-"));
    await emitTrace({ name: "worker.result", traceId: "trace", spanId: "span", attributes: { outcome: "success" } }, disabledCwd, { backend: "disabled" });
    await expect(readFile(join(disabledCwd, ".as-is", "tracing.jsonl"))).rejects.toBeTruthy();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => { throw new Error("sink down"); }) as typeof fetch;
    try {
      const span = startSpan("failed", { cwd: disabledCwd, emit: async () => { throw new Error("sink down"); } });
      await expect(span.finish("failure", { reason: "error" })).resolves.toBeUndefined();
      await expect(emitTrace({ name: "worker.result", traceId: "trace", spanId: "span", attributes: {} }, disabledCwd, { backend: "jaeger", endpoint: "http://127.0.0.1:1" })).resolves.toBeUndefined();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("preserves only the bounded child-wait phase attribute", async () => {
    const event = { name: "child-wait", traceId: "trace", spanId: "span", attributes: { phase: "child-wait", outcome: "success" } } as unknown as TraceEvent;
    const payload = JSON.stringify(otlpPayload(event));
    expect(payload).toContain('"key":"phase"');
    expect(payload).toContain("child-wait");
    const rejected = { name: "child-wait", traceId: "trace", spanId: "span", attributes: { phase: "spawn", outcome: "success" } } as unknown as TraceEvent;
    const rejectedPayload = JSON.stringify(otlpPayload(rejected));
    expect(rejectedPayload).not.toContain('"key":"phase"');
    expect(rejectedPayload).not.toContain("spawn");
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-phase-"));
    await emitTrace(event, cwd, { backend: "file" });
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(local).toContain('"phase":"child-wait"');
    const rejectedCwd = await mkdtemp(join(tmpdir(), "as-is-trace-phase-rejected-"));
    await emitTrace(rejected, rejectedCwd, { backend: "file" });
    const rejectedLocal = await readFile(join(rejectedCwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(rejectedLocal).not.toContain('"phase"');
    expect(rejectedLocal).not.toContain("spawn");
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
