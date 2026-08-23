import { describe, expect, test } from "bun:test";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, readdir, stat, utimes, writeFile } from "node:fs/promises";
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

  test("inherits repository tracing configuration and applies a nested component override", async () => {
    const root = await mkdtemp(join(tmpdir(), "as-is-trace-config-cascade-"));
    const component = join(root, "component");
    await mkdir(component, { recursive: true });
    await writeFile(join(root, "as-is.json"), JSON.stringify({ configuration: { observability: { tracing: { backend: "file", enabled: true, "local-directory": ".as-is/root.jsonl" } } } }));
    await writeFile(join(component, "as-is.json"), JSON.stringify({ configuration: { observability: { tracing: { "local-directory": ".as-is/component.jsonl" } } } }));
    await emitTrace({ name: "reference", traceId: "trace", spanId: "span", attributes: {} }, component);
    await expect(readFile(join(component, ".as-is/component.jsonl"), "utf8")).resolves.toContain('"name":"reference"');
    await expect(readFile(join(component, ".as-is/root.jsonl"), "utf8")).rejects.toBeTruthy();
  });

  test("allowlists nested call events and structured lineage observations", async () => {
    const payload = JSON.stringify(otlpPayload({
      name: "call_subagent",
      traceId: "trace-nested",
      spanId: "span-nested",
      attributes: {},
      observations: [
        { kind: "runId", source: "agent-tool", availability: "available", value: "run-nested" },
        { kind: "parentTraceId", source: "agent-tool", availability: "available", value: "trace-parent" },
        { kind: "depth", source: "agent-tool", availability: "available", value: 2, unit: "count" },
        { kind: "admission", source: "agent-tool", availability: "available", value: "admitted" },
        { kind: "errorClass", source: "agent-tool", availability: "unavailable", reason: "not-observed" },
      ],
    }));
    expect(payload).toContain('"name":"call_subagent"');
    expect(payload).toContain("observation.parentTraceId.value");
    expect(payload).toContain("observation.admission.value");
    expect(payload).not.toContain("private");
  });

  test("projects budget limits with their semantic units and preserves unavailable cost safely", () => {
    const event = {
      name: "worker.result",
      traceId: "trace-budget-units",
      spanId: "span-budget-units",
      attributes: {},
      observations: [
        { kind: "budgetWallClockMs", source: "task", availability: "available", value: 900, unit: "milliseconds" },
        { kind: "budgetCostUsd", source: "task", availability: "available", value: 0.2, unit: "usd" },
        { kind: "usageCostUsd", source: "pi-session", availability: "unavailable", reason: "source-unavailable", unit: "usd" },
      ],
    } as unknown as TraceEvent;
    const local = JSON.stringify((() => {
      const payload = otlpPayload(event);
      return payload;
    })());
    expect(local).toContain('"observation.budgetWallClockMs.unit"');
    expect(local).toContain('"stringValue":"milliseconds"');
    expect(local).toContain('"observation.budgetCostUsd.unit"');
    expect(local).toContain('"stringValue":"usd"');
    expect(local).toContain('"observation.usageCostUsd.availability"');
    expect(local).toContain('"stringValue":"unavailable"');
    expect(JSON.stringify(otlpPayload({
      name: "worker.result", traceId: "trace-unavailable-unit", spanId: "span-unavailable-unit", attributes: {}, observations: [
        { kind: "budgetWallClockMs", source: "task", availability: "unavailable", reason: "not-observed", unit: "count" },
      ],
    } as unknown as TraceEvent))).toContain('"stringValue":"milliseconds"');
  });

  test("converts invalid known observations to value-free malformed evidence", () => {
    const payload = JSON.stringify(otlpPayload({
      name: "worker.lifecycle", traceId: "trace-malformed-marker", spanId: "span-malformed-marker", attributes: {},
      observations: [
        { kind: "budgetWallClockMs", source: "task", availability: "available", value: 10, unit: "count" },
        { kind: "usageCostUsd", source: "pi-session", availability: "available", value: -1, unit: "usd" },
        { kind: "phase", source: "launcher", availability: "unavailable", reason: "not-observed", value: "leak" },
        { kind: "not-allowlisted", source: "task", availability: "available", value: "secret" },
      ],
    } as unknown as TraceEvent));
    expect(payload).toContain('"observation.budgetWallClockMs.availability"');
    expect(payload).toContain('"observation.budgetWallClockMs.reason"');
    expect(payload).toContain('"stringValue":"invalid-value"');
    expect(payload).not.toContain('"value":10');
    expect(payload).not.toContain('"value":-1');
    expect(payload).not.toContain("secret");
    expect(payload).not.toContain("leak");
  });

  test("projects bounded execution observations and explicit unavailable measurements", async () => {
    const event = {
      name: "worker.lifecycle",
      traceId: "trace-observations",
      spanId: "span-observations",
      attributes: {},
      observations: [
        { kind: "taskRevision", source: "task", availability: "available", value: 3, unit: "count" },
        { kind: "attempt", source: "task", availability: "available", value: 2, unit: "count" },
        { kind: "sessionName", source: "task", availability: "available", value: "debug-task" },
        { kind: "localSessionId", source: "pi-session", availability: "available", value: "0190abcd-1234-4abc-8def-0123456789ab" },
        { kind: "phase", source: "launcher", availability: "available", value: "wait" },
        { kind: "outcome", source: "launcher", availability: "available", value: "budget-stopped" },
        { kind: "usageCostUsd", source: "pi-session", availability: "unavailable", reason: "source-unavailable", unit: "usd" },
        { kind: "usageInputTokens", source: "pi-session", availability: "available", value: 42, unit: "count" },
        { kind: "componentIdentity", source: "task", availability: "available", value: "component-debug" },
      ],
    } as unknown as TraceEvent;
    const payload = JSON.stringify(otlpPayload(event));
    expect(payload).toContain('"key":"as_is.schema_version"');
    expect(payload).toContain('"key":"observation.taskRevision.value"');
    expect(payload).toContain('"key":"observation.usageCostUsd.availability"');
    expect(payload).toContain('"stringValue":"unavailable"');
    expect(payload).not.toContain("prompt");
    expect(payload).not.toContain("provider/model");
  });

  test("drops malformed observations without affecting the event", () => {
    const payload = JSON.stringify(otlpPayload({
      name: "worker.lifecycle", traceId: "trace", spanId: "span", attributes: {},
      observations: [
        { kind: "phase", source: "launcher", availability: "available", value: "spawn" },
        { kind: "outcome", source: "launcher", availability: "available", value: "not-authorized" },
        { kind: "usageCostUsd", source: "pi-session", availability: "available", value: -1, unit: "usd" },
        { kind: "sessionName", source: "task", availability: "available", value: "../private" },
      ],
    } as unknown as TraceEvent));
    expect(payload).toContain('"name":"worker.lifecycle"');
    expect(payload).not.toContain("not-authorized");
    expect(payload).not.toContain("private");
    expect(payload).not.toContain('"value":-1');
  });

  test("records delegated flow relationships, retries, outcomes, and local observations", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-flow-"));
    const sessionId = "0190abcd-1234-4abc-8def-0123456789ab";
    const outcomes = ["success", "failure", "cancelled", "blocked", "timed-out", "budget-stopped", "unavailable"];
    for (const [attempt, outcome] of outcomes.entries()) {
      await emitTrace({
        name: "delegation.lifecycle",
        traceId: `trace-attempt-${attempt + 1}`,
        spanId: `call-${attempt + 1}`,
        parentSpanId: "parent-call",
        durationMs: attempt + 1,
        attributes: {},
        sessionReference: { sessionId },
        observations: [
          { kind: "taskRevision", source: "task", availability: "available", value: 4, unit: "count" },
          { kind: "attempt", source: "task", availability: "available", value: attempt + 1, unit: "count" },
          { kind: "componentIdentity", source: "task", availability: "available", value: "observability" },
          { kind: "workerRole", source: "launcher", availability: "available", value: "component-builder" },
          { kind: "sessionName", source: "task", availability: "available", value: "trace-task" },
          { kind: "localSessionId", source: "pi-session", availability: "available", value: sessionId },
          { kind: "jobId", source: "launcher", availability: "available", value: `job-${attempt + 1}` },
          { kind: "callId", source: "launcher", availability: "available", value: `call-${attempt + 1}` },
          { kind: "parentCallId", source: "launcher", availability: "available", value: "parent-call" },
          { kind: "relationshipId", source: "launcher", availability: "available", value: `relationship-${attempt + 1}` },
          { kind: "phase", source: "launcher", availability: "available", value: "handoff" },
          { kind: "outcome", source: "launcher", availability: "available", value: outcome },
          { kind: "wallClockMs", source: "tracer", availability: "available", value: 120 + attempt, unit: "milliseconds" },
        ],
      }, cwd, { backend: "file" });
    }
    const lines = (await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8")).trim().split("\n");
    expect(lines).toHaveLength(outcomes.length);
    const records = lines.map((line) => JSON.parse(line) as TraceEvent);
    expect(records.every((record) => record.schemaVersion === 1)).toBe(true);
    expect(records.map((record) => record.observations?.find((observation) => observation.kind === "outcome")?.value)).toEqual(outcomes);
    expect(records.map((record) => record.observations?.find((observation) => observation.kind === "attempt")?.value)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(records[0].observations?.some((observation) => observation.kind === "relationshipId")).toBe(true);
    expect(records[0].observations?.find((observation) => observation.kind === "wallClockMs")?.unit).toBe("milliseconds");
    expect(records[0].sessionReference).toEqual({ sessionId });
  });

  test("keeps malformed and unavailable measurements bounded in both sinks", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-measurements-"));
    const event: TraceEvent = {
      name: "worker.lifecycle",
      traceId: "trace-measurements",
      spanId: "span-measurements",
      attributes: {},
      observations: [
        { kind: "usageOutputTokens", source: "pi-session", availability: "unavailable", reason: "not-observed", unit: "count" },
        { kind: "usageTotalTokens", source: "pi-session", availability: "available", value: 100, unit: "count" },
        { kind: "usageCostUsd", source: "pi-session", availability: "available", value: 1.25, unit: "usd" },
        { kind: "wallClockMs", source: "tracer", availability: "available", value: 250, unit: "milliseconds" },
        { kind: "usageCostUsd", source: "pi-session", availability: "available", value: Number.POSITIVE_INFINITY, unit: "usd" } as unknown as TraceEvent["observations"][number],
        { kind: "usageInputTokens", source: "pi-session", availability: "available", value: 5.5, unit: "count" } as unknown as TraceEvent["observations"][number],
      ],
    };
    await emitTrace(event, cwd, { backend: "file" });
    const local = await readFile(join(cwd, ".as-is", "tracing.jsonl"), "utf8");
    const external = JSON.stringify(otlpPayload(event));
    for (const output of [local, external]) {
      expect(output).toContain("usageOutputTokens");
      expect(output).toContain("not-observed");
      expect(output).toContain("usageCostUsd");
      expect(output).not.toContain("Infinity");
      expect(output).not.toContain('"value":5.5');
    }
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

  test("posts the bounded OTLP payload and isolates unsuccessful responses", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-http-"));
    const requests: Array<{ method?: string; url?: string; headers: Record<string, string | string[] | undefined>; body: string }> = [];
    const server = createServer((request, response) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      request.on("end", () => {
        requests.push({ method: request.method, url: request.url, headers: request.headers, body: Buffer.concat(chunks).toString("utf8") });
        response.statusCode = request.url === "/unavailable" ? 503 : 200;
        response.end();
      });
    });
    await new Promise<void>((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("stub address unavailable");
    try {
      await emitTrace({ name: "reference", traceId: "trace", spanId: "span", attributes: { outcome: "success", "as_is.component_path": "/private/path", reason: "error" }, sessionReference: { sessionId: "opaque-session" } }, cwd, { backend: "jaeger", endpoint: `http://127.0.0.1:${address.port}/traces` });
      await emitTrace({ name: "reference", traceId: "trace", spanId: "span-invalid", attributes: { outcome: "success", "as_is.component_path": "CONTENT-SENTINEL-/private/content" }, sessionReference: { sessionId: "session/path" } }, cwd, { backend: "jaeger", endpoint: `http://127.0.0.1:${address.port}/traces` });
      await emitTrace({ name: "reference", traceId: "trace", spanId: "span-2", attributes: { outcome: "success" } }, cwd, { backend: "jaeger", endpoint: `http://127.0.0.1:${address.port}/unavailable` });
      expect(requests).toHaveLength(3);
      expect(requests[0].method).toBe("POST");
      expect(requests[0].url).toBe("/traces");
      expect(requests[0].headers["content-type"]).toBe("application/json");
      expect(requests[0].body).toContain('"service.name"');
      expect(requests[0].body).toContain('"session.id"');
      expect(requests[0].body).toContain("opaque-session");
      expect(requests[0].body).not.toContain("/private/path");
      expect(requests[0].body).not.toContain("CONTENT-SENTINEL");
      expect(requests[1].body).not.toContain("session/path");
      expect(requests[1].body).not.toContain("CONTENT-SENTINEL");
    } finally {
      await new Promise<void>((resolveServer, reject) => server.close((error) => error ? reject(error) : resolveServer()));
    }
  });

  test("bounds delayed OTLP export and isolates refused endpoints", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-http-timeout-"));
    const server = createServer((_request, response) => setTimeout(() => response.end(), 1_500));
    await new Promise<void>((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("stub address unavailable");
    try {
      const started = Date.now();
      await expect(emitTrace({ name: "reference", traceId: "trace", spanId: "span", attributes: {} }, cwd, { backend: "jaeger", endpoint: `http://127.0.0.1:${address.port}/slow` })).resolves.toBeUndefined();
      expect(Date.now() - started).toBeLessThan(1_400);
    } finally {
      await new Promise<void>((resolveServer, reject) => server.close((error) => error ? reject(error) : resolveServer()));
    }
    await expect(emitTrace({ name: "reference", traceId: "trace", spanId: "refused", attributes: {} }, cwd, { backend: "jaeger", endpoint: "http://127.0.0.1:1/refused" })).resolves.toBeUndefined();
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
    expect(span.attributes).toHaveLength(3);
    expect(span.kind).toBe(1);
    expect(span.startTimeUnixNano).toBe("1785801600000000000");
    expect(span.endTimeUnixNano).toBe("1785801600004000000");
  });

  test("admits a record that exactly reaches the configured byte limit", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-exact-limit-"));
    const directory = join(cwd, "traces");
    await mkdir(directory);
    const event = { name: "worker.result", traceId: "exact", spanId: "exact", attributes: { outcome: "success" as const } };
    const probe = join(directory, "trace.jsonl");
    await emitTrace(event, cwd, { backend: "file", directory, maxFileBytes: 1_000 });
    const size = (await stat(probe)).size;
    await writeFile(probe, "");
    await emitTrace(event, cwd, { backend: "file", directory, maxFileBytes: size });
    expect((await stat(probe)).size).toBe(size);
  });

  test("rotates complete active segments and preserves configured path forms", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-rotation-"));
    const directory = join(cwd, "trace-dir");
    await mkdir(directory);
    const config = { backend: "file" as const, directory, maxFileBytes: 260, maxFiles: 3, retentionDays: 7 };
    const event = (id: string) => ({ name: "worker.result", traceId: id, spanId: id, attributes: { outcome: "success" as const } });
    await emitTrace(event("one"), cwd, config);
    const active = join(directory, "trace.jsonl");
    const first = await readFile(active);
    await emitTrace(event("two"), cwd, config);
    await emitTrace(event("three"), cwd, config);
    const files = (await readdir(directory)).sort();
    expect(files).toContain("trace.jsonl");
    expect(files.some((file) => /^trace\.\d{6}\.jsonl$/u.test(file))).toBe(true);
    for (const file of files) expect((await stat(join(directory, file))).size).toBeLessThanOrEqual(260);
    expect((await readFile(active, "utf8"))).toContain('"traceId":"three"');
    expect((await readFile(join(directory, files.find((file) => file.startsWith("trace.") && file !== "trace.jsonl")!), "utf8"))).toContain('"traceId":"one"');
    expect(first.length).toBeGreaterThan(0);

    const configuredFile = join(cwd, "custom.jsonl");
    await emitTrace(event("custom"), cwd, { ...config, directory: configuredFile });
    expect(await readFile(configuredFile, "utf8")).toContain('"traceId":"custom"');
  });

  test("bounds managed segments, preserves unrelated files, and drops oversized records", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-retention-"));
    const directory = join(cwd, "traces");
    await mkdir(directory);
    const unrelated = join(directory, "keep.txt");
    await writeFile(unrelated, "keep");
    const config = { backend: "file" as const, directory, maxFileBytes: 220, maxFiles: 2, retentionDays: 7 };
    const event = (id: string) => ({ name: "worker.result", traceId: id, spanId: id, attributes: { outcome: "success" as const } });
    for (const id of ["a", "b", "c", "d", "e", "f"]) await emitTrace(event(id), cwd, config);
    const files = await readdir(directory);
    expect(files).toContain("keep.txt");
    expect(files.filter((file) => file === "trace.jsonl" || /^trace\.\d{6}\.jsonl$/u.test(file))).toHaveLength(2);
    const before = await readFile(join(directory, "trace.jsonl"));
    await emitTrace({ name: "worker.result", traceId: "oversized", spanId: "oversized", attributes: { outcome: "success", reason: "error" }, sessionReference: { sessionId: "x" } }, cwd, { ...config, maxFileBytes: 20 });
    expect(await readFile(join(directory, "trace.jsonl"))).toEqual(before);
  });

  test("removes only expired managed segments on emission and falls back from invalid limits", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-age-"));
    const directory = join(cwd, "traces");
    await mkdir(directory);
    const config = { backend: "file" as const, directory, maxFileBytes: 260, maxFiles: 3, retentionDays: 1 };
    const event = (id: string) => ({ name: "worker.result", traceId: id, spanId: id, attributes: { outcome: "success" as const } });
    await emitTrace(event("old"), cwd, config);
    const active = join(directory, "trace.jsonl");
    const old = new Date(Date.now() - 2 * 86400000);
    await utimes(active, old, old);
    await writeFile(join(directory, "unrelated.jsonl"), "unrelated");
    await emitTrace(event("fresh"), cwd, { ...config, maxFiles: 0, maxFileBytes: -1, retentionDays: -1 });
    expect(await readFile(active, "utf8")).toContain('"traceId":"fresh"');
    expect(await readFile(join(directory, "unrelated.jsonl"), "utf8")).toBe("unrelated");
  });

  test("retention filesystem failures remain non-blocking", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-failure-"));
    const directory = join(cwd, "traces");
    await mkdir(directory);
    const blockingParent = join(cwd, "not-a-directory");
    await writeFile(blockingParent, "blocking");
    await expect(emitTrace({ name: "worker.result", traceId: "failure", spanId: "failure", attributes: { outcome: "success" } }, cwd, { backend: "file", directory: join(blockingParent, "traces"), maxFileBytes: 120, maxFiles: 2 })).resolves.toBeUndefined();
  });
});
