import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { emitTrace, otlpPayload, startSpan, type TraceEvent } from "./tracer";

describe("universal local tracer", () => {
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
    await emitTrace({
      name: "control-plane.delegate",
      traceId: "trace-1",
      spanId: "span-1",
      attributes: { outcome: "success", secret: undefined },
    }, cwd);
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
    expect(events.map(({ traceId, spanId, parentSpanId }) => ({ traceId, spanId, parentSpanId }))).toEqual([
      { traceId: "trace", spanId: "child", parentSpanId: "parent" },
      { traceId: "trace", spanId: "parent", parentSpanId: undefined },
    ]);
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
    const payload = otlpPayload({
      name: "worker.result",
      traceId: "trace-1",
      spanId: "span-1",
      durationMs: 4,
      timestamp: "2026-08-04T00:00:00.000Z",
      attributes: { outcome: "success", duration_ms: 4 },
    });
    const span = payload.resourceSpans[0].scopeSpans[0].spans[0];
    expect(span.name).toBe("worker.result");
    expect(span.attributes).toHaveLength(2);
    expect(span.kind).toBe(1);
    expect(span.startTimeUnixNano).toBe("1785801600000000000");
    expect(span.endTimeUnixNano).toBe("1785801600004000000");
  });
});
