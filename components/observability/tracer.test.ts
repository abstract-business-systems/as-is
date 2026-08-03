import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { emitTrace, otlpPayload, serializeSessionReference, startSpan, type TraceEvent } from "./tracer";

describe("universal local tracer", () => {
  test("serializes only the exact bounded session-reference contract", () => {
    const reference = { sessionId: "opaque-€", store: "project-local", revision: "r1", eventStart: 2, eventEnd: 3, messageCount: 4, toolCallCount: 5, inputBytes: 6, outputBytes: 7, availability: "available" };
    expect(serializeSessionReference(reference)).toEqual(reference);
    for (const invalid of [
      { ...reference, extra: true }, { ...reference, sessionId: "a/b" }, { ...reference, sessionId: "a\\\\b" }, { ...reference, sessionId: "a\u0000b" }, { ...reference, revision: "https:thing" },
      { ...reference, sessionId: "x".repeat(129) }, { ...reference, messageCount: 1.5 }, { ...reference, eventEnd: 1 },
      { ...reference, availability: "gone" }, { ...reference, inputBytes: 1_000_000_001 },
    ]) expect(serializeSessionReference(invalid)).toBeUndefined();
    expect(serializeSessionReference({ sessionId: "s", store: "host-local", availability: "missing" })).toEqual({ sessionId: "s", store: "host-local", availability: "missing" });
    expect(serializeSessionReference({ sessionId: "0", store: "project-local", availability: "available" })?.sessionId).toBe("0");
  });

  test("keeps valid session references bounded and excludes invalid references from sinks", () => {
    const valid = { sessionId: "s", store: "project-local" as const, availability: "available" as const };
    const payload = otlpPayload({ name: "reference", traceId: "t", spanId: "s", attributes: { generic: "kept" }, sessionReference: valid });
    expect(JSON.stringify(payload)).toContain('"session.reference"');
    const invalid = otlpPayload({ name: "reference", traceId: "t", spanId: "s", attributes: {}, sessionReference: { ...valid, sessionId: "prompt/raw" } });
    expect(JSON.stringify(invalid)).not.toContain("prompt/raw");
  });
  test("covers producer-boundary success and failure relationships without content or references leaking", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-session-"));
    const reference = { sessionId: "parent-session", store: "project-local" as const, availability: "available" as const };
    const forbidden = "raw prompt response tool argument tool result /absolute/path https://example.test Bearer secret";
    const events = [
      { name: "call_subagent", traceId: "trace", spanId: "delegate", parentSpanId: "parent", attributes: { outcome: "success" as const }, sessionReference: reference, rawPayloads: [{ class: "prompt" as const, content: forbidden }] },
      { name: "worker.result", traceId: "trace", spanId: "worker-success", parentSpanId: "delegate", attributes: { outcome: "success" as const }, sessionReference: reference, rawPayloads: [{ class: "response" as const, content: forbidden }] },
      { name: "worker.result", traceId: "trace", spanId: "worker-failure", parentSpanId: "delegate", attributes: { outcome: "failure" as const }, sessionReference: reference, rawPayloads: [{ class: "tool-result" as const, content: forbidden }] },
    ];
    for (const event of events) {
      await emitTrace(event, cwd, { backend: "file", captureMode: "metadata" });
      const otlp = JSON.stringify(otlpPayload(event));
      expect(otlp).toContain('"session.reference"');
      expect(otlp).toContain(event.parentSpanId!);
      expect(otlp).not.toContain(forbidden);
    }
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(local).toContain('"name":"call_subagent"');
    expect(local).toContain('"name":"worker.result"');
    expect(local).toContain('"sessionId":"parent-session"');
    expect(local).not.toContain(forbidden);
    const missing = { ...events[1], sessionReference: undefined };
    const invalid = { ...events[2], sessionReference: { ...reference, sessionId: "/invalid/path" } };
    for (const event of [missing, invalid]) {
      const text = JSON.stringify(otlpPayload(event));
      expect(text).not.toContain("session.reference");
      await expect(emitTrace(event, cwd, { backend: "file", captureMode: "metadata" })).resolves.toBeUndefined();
    }
    const after = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    expect(after).toContain('"spanId":"worker-success"');
    expect(after).toContain('"spanId":"worker-failure"');
    const finalLines = after.trim().split("\n").slice(-2).join("\n");
    expect(finalLines).not.toContain('"sessionReference"');
  });
  test("retains every declared payload class exactly in local-full mode", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-raw-"));
    const payloads = (["prompt", "response", "tool-argument", "tool-result", "stdout", "stderr", "exception", "secret", "personal"] as const).map(className => ({ class: className, content: `${className}-raw Bearer token alice@example.com` }));
    await emitTrace({ name: "payloads", traceId: "t", spanId: "s", attributes: {}, rawPayloads: payloads }, cwd, { backend: "file", captureMode: "local-full" });
    const text = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    for (const payload of payloads) expect(text).toContain(payload.content);
  });

  test("filters, redacts, and bounds only explicitly enabled export payloads", () => {
    const event = { name: "export", traceId: "t", spanId: "s", attributes: {}, rawPayloads: (["prompt", "response", "tool-argument", "tool-result", "stdout", "stderr", "exception", "secret", "personal"] as const).map(className => ({ class: className, content: `${className}-raw Bearer token alice@example.com` })) };
    const suppressed = JSON.stringify(otlpPayload(event));
    expect(suppressed).not.toContain("prompt-raw");
    const exported = JSON.stringify(otlpPayload(event, { captureMode: "export-bounded", exportRawPayloads: true, maxPayloadBytes: 12 }));
    const exportedSpan = otlpPayload(event, { captureMode: "export-bounded", exportRawPayloads: true, maxPayloadBytes: 12 }).resourceSpans[0].scopeSpans[0].spans[0];
    for (const className of ["prompt", "response", "tool-argument", "tool-result", "stdout", "stderr", "exception"]) {
      expect(exported).toContain(`payload.${className}`);
      const attribute = exportedSpan.attributes.find(({ key }) => key === `payload.${className}`);
      expect(attribute && "stringValue" in attribute.value ? new TextEncoder().encode(attribute.value.stringValue).byteLength : 0).toBeLessThanOrEqual(12);
    }
    expect(exported).not.toContain("payload.secret");
    expect(exported).not.toContain("alice@example.com");
    expect(exported).not.toContain("Bearer token");
    const unicode = otlpPayload({ ...event, rawPayloads: [{ class: "prompt", content: "€payload" }] }, { captureMode: "export-bounded", exportRawPayloads: true, maxPayloadBytes: 1 }).resourceSpans[0].scopeSpans[0].spans[0].attributes.find(({ key }) => key === "payload.prompt");
    expect(unicode && "stringValue" in unicode.value ? new TextEncoder().encode(unicode.value.stringValue).byteLength : 0).toBeLessThanOrEqual(1);
  });
  test("writes to the base as-is configured file for any runtime event", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-"));
    await writeFile(join(cwd, "as-is.md"), `config:\n  observability:\n    tracing:\n      backend: file\n      enabled: true\n      local-directory: .as-is/tracing.jsonl\n`);
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
