import { expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyzeProjectSession, correlateJobRegistryWithTraces, createTraceQueryTools, filterTraceEvents, readJobRegistryEvidence, readTraceEvents, readTraceEvidence, summarizeTraceCorrelation } from "./worker-tools-observability.ts";
import { SessionManager } from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";

test("focused observability functionality keeps session summaries bounded and details explicit", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-focused-observability-"));
  const manager = SessionManager.create(cwd, join(cwd, "sessions"));
  const sessionId = manager.getSessionId();
  manager.appendMessage({ role: "user", content: "private prompt and valid read/grep provider/model text", timestamp: Date.now() });
  manager.appendMessage({ role: "assistant", content: [{ type: "text", text: "private response" }], timestamp: Date.now() });

  const summary = await analyzeProjectSession(cwd, sessionId, 20, manager);
  expect(summary.availability).toBe("available");
  expect(JSON.stringify(summary)).not.toContain(cwd);
  expect(JSON.stringify(summary)).not.toContain("sessionFile");
  expect(JSON.stringify(summary)).not.toContain("sessionDir");
  expect(JSON.stringify(summary)).not.toContain("private prompt");
  const full = await analyzeProjectSession(cwd, sessionId, 20, manager, undefined, "full");
  expect(JSON.stringify(full)).not.toContain(cwd);
  expect(JSON.stringify(full)).toContain("private prompt");
  expect(JSON.stringify(full)).toContain("read/grep");
  expect(JSON.stringify(full)).toContain("provider/model");
});

test("focused session analysis does not inspect unrelated session stores", async () => {
  const projectCwd = await mkdtemp(join(tmpdir(), "as-is-focused-project-"));
  const unrelatedCwd = await mkdtemp(join(tmpdir(), "as-is-focused-unrelated-"));
  const unrelatedManager = SessionManager.create(unrelatedCwd, join(unrelatedCwd, "sessions"));
  const unrelatedId = unrelatedManager.getSessionId();
  unrelatedManager.appendMessage({ role: "user", content: "unrelated private prompt", timestamp: Date.now() });
  await expect(analyzeProjectSession(projectCwd, unrelatedId, 20)).resolves.toEqual({
    sessionId: unrelatedId,
    availability: "missing-or-out-of-scope",
  });
});

test("focused trace functionality ignores malformed lines and bounds matching", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-focused-traces-"));
  await writeFile(join(cwd, ".as-is-tracing-placeholder"), "");
  const traceDir = join(cwd, ".as-is");
  await Bun.write(join(traceDir, "tracing.jsonl"), [
    JSON.stringify({ name: "worker.result", timestamp: "2026-01-01T00:00:00Z", traceId: "trace-a", spanId: "span-a", attributes: { "as_is.outcome": "success" } }),
    "not-json",
    JSON.stringify({ name: "other", timestamp: "2026-01-01T00:00:01Z", traceId: "trace-b", spanId: "span-b", attributes: {} }),
  ].join("\n"));
  const events = await readTraceEvents(cwd);
  expect(events).toHaveLength(2);
  const [search] = createTraceQueryTools();
  const result = await search.execute("call", { name: "worker", traceId: "trace-a", limit: 1 }, undefined, undefined, { cwd } as never);
  expect(result.details).toEqual({ count: 1 });
  expect(result.content[0].text).toContain("trace-a");
});

test("trace query projection preserves only opaque session references", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-trace-session-reference-query-"));
  await Bun.write(join(cwd, ".as-is", "tracing.jsonl"), JSON.stringify({
    name: "call_subagent", timestamp: "2026-01-01T00:00:00Z", traceId: "trace-session", spanId: "span-session",
    attributes: {}, sessionReference: { sessionId: "0190abcd-1234-4abc-8def-0123456789ab", store: "/private/store" },
  }));
  const result = await createTraceQueryTools()[0].execute("call", { traceId: "trace-session", limit: 10 }, undefined, undefined, { cwd } as never);
  expect(result.content[0].text).toContain("sessionReference");
  expect(result.content[0].text).toContain("0190abcd-1234-4abc-8def-0123456789ab");
  expect(result.content[0].text).not.toContain("/private/store");
});

test("bounded trace queries retrieve by multiple correlation fields and summarize retries", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-evidence-correlation-"));
  const events = [1, 2, 3].map((attempt) => ({
    name: "delegation.lifecycle", timestamp: `2026-01-01T00:00:0${attempt}Z`, traceId: `trace-${attempt}`, spanId: `call-${attempt}`, parentSpanId: "parent-call", attributes: {},
    observations: [
      { kind: "sessionName", source: "task", availability: "available", value: "debug-task" },
      { kind: "localSessionId", source: "pi-session", availability: "available", value: "0190abcd-1234-4abc-8def-0123456789ab" },
      { kind: "taskRevision", source: "task", availability: "available", value: 4, unit: "count" },
      { kind: "attempt", source: "task", availability: "available", value: attempt, unit: "count" },
      { kind: "workerRole", source: "launcher", availability: "available", value: "component-builder" },
      { kind: "callId", source: "launcher", availability: "available", value: `call-${attempt}` },
      { kind: "parentCallId", source: "launcher", availability: "available", value: "parent-call" },
      { kind: "relationshipId", source: "launcher", availability: "available", value: "relationship-debug" },
      { kind: "phase", source: "launcher", availability: "available", value: "handoff" },
      { kind: "outcome", source: "launcher", availability: "available", value: attempt === 3 ? "success" : "failure" },
    ],
  }));
  await Bun.write(join(cwd, ".as-is", "tracing.jsonl"), events.map(JSON.stringify).join("\n") + "\nmalformed");
  const loaded = await readTraceEvents(cwd);
  const filtered = filterTraceEvents(loaded, { sessionName: "debug-task", taskRevision: 4, phase: "handoff", from: "2026-01-01T00:00:00Z", to: "2026-01-01T00:00:02Z" }, 10);
  expect(filtered.events).toHaveLength(2);
  expect(filtered.events.map((event) => event.traceId)).toEqual(["trace-1", "trace-2"]);
  const evidence = await readTraceEvidence(cwd);
  const summary = summarizeTraceCorrelation(loaded, evidence.malformedLines);
  expect(summary.availability).toBe("available");
  expect(summary.malformedLines).toBe(1);
  expect(summary.attempts).toEqual([1, 2, 3]);
  expect((summary.retries as unknown[])).toHaveLength(1);
  expect((summary.relationships as unknown[])).toHaveLength(3);
  expect((summary.relationships as Array<{ parent?: string }>)[0].parent).toBe("parent-call");
  const [search] = createTraceQueryTools();
  const result = await search.execute("call", { sessionName: "debug-task", workerRole: "component-builder", attempt: 2, limit: 10 }, undefined, undefined, { cwd } as never);
  expect(result.details).toEqual({ count: 1 });
  expect(result.content[0].text).toContain("trace-2");
  expect(result.content[0].text).toContain("malformedLines");
  expect(result.content[0].text).not.toContain(cwd);
});

test("unavailable trace evidence is explicit and invalid selectors are bounded", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-evidence-unavailable-"));
  const tools = createTraceQueryTools();
  const [search] = tools;
  const missing = await search.execute("call", { traceId: "absent", limit: 10 }, undefined, undefined, { cwd } as never);
  expect(missing.content[0].text).toContain('"availability": "missing"');
  const invalidTool = await search.execute("call", { from: "not-time", limit: 10 }, undefined, undefined, { cwd } as never);
  expect(invalidTool.content[0].text).toContain('"availability": "invalid-selector"');
  const invalid = filterTraceEvents([], { from: "not-time" }, 10);
  expect(invalid).toEqual({ availability: "invalid-selector", events: [] });
  const inaccessibleCwd = await mkdtemp(join(tmpdir(), "as-is-evidence-inaccessible-"));
  await Bun.write(join(inaccessibleCwd, ".as-is"), "not-a-directory");
  for (const tool of [tools[2], tools[3]]) {
    const result = await tool.execute("call", tool.name === "summarize_trace" ? { traceId: "absent" } : { leftTraceId: "left", rightTraceId: "right" }, undefined, undefined, { cwd: inaccessibleCwd } as never);
    expect(result.content[0].text).toContain('"availability": "inaccessible"');
  }
});

test("job registry correlation joins nested launches and retries without registry paths", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-job-registry-correlation-"));
  const traceEvents = [
    ["root-job", "root-trace", undefined, 1, "failure"],
    ["child-job", "child-trace", "root-job", 1, "failure"],
    ["retry-job", "retry-trace", "root-job", 2, "success"],
  ].map(([jobId, traceId, parentJobId, attempt, outcome]) => ({
    name: "delegation.lifecycle", timestamp: "2026-01-01T00:00:00Z", traceId: String(traceId), spanId: `span-${jobId}`, attributes: parentJobId ? { parentJobId } : {},
    observations: [
      { kind: "jobId", source: "launcher", availability: "available", value: jobId },
      ...(parentJobId ? [{ kind: "parentCallId", source: "launcher", availability: "available", value: `call-${parentJobId}` }] : []),
      { kind: "sessionName", source: "launcher", availability: "available", value: "nested-task" },
      { kind: "taskRevision", source: "task", availability: "available", value: 7, unit: "count" },
      { kind: "attempt", source: "task", availability: "available", value: attempt, unit: "count" },
      { kind: "outcome", source: "launcher", availability: "available", value: outcome },
    ],
  }));
  const registry = {
    records: [
      { event: "launched", jobId: "root-job", traceId: "root-trace", sessionName: "nested-task", launchedAt: "2026-01-01T00:00:00Z" },
      { event: "launched", jobId: "child-job", parentJobId: "root-job", traceId: "child-trace", sessionName: "nested-task", launchedAt: "2026-01-01T00:00:01Z" },
      { event: "launched", jobId: "retry-job", parentJobId: "root-job", traceId: "retry-trace", sessionName: "nested-task", launchedAt: "2026-01-01T00:00:02Z" },
      { event: "finished", jobId: "root-job", exitCode: 1 },
      { event: "finished", jobId: "child-job", exitCode: 1 },
      { event: "finished", jobId: "retry-job", exitCode: 0 },
    ], malformedLines: 0, availability: "available" as const,
  };
  const summary = correlateJobRegistryWithTraces(traceEvents as never, registry);
  expect(summary.availability).toBe("available");
  expect(summary.nodeCount).toBe(3);
  expect((summary.relationships as unknown[])).toHaveLength(2);
  expect((summary.retries as unknown[])).toHaveLength(1);
  expect(JSON.stringify(summary)).not.toContain(cwd);
  expect(JSON.stringify(summary)).not.toContain("prompt");
});

test("job registry evidence distinguishes malformed, missing, inaccessible, and inconsistent links", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-job-registry-states-"));
  const path = join(cwd, "jobs.jsonl");
  await Bun.write(path, [JSON.stringify({ event: "launched", jobId: "job-a", parentJobId: "missing-parent", traceId: "trace-a" }), "not-json", JSON.stringify({ event: "finished", jobId: "job-a", exitCode: 0 }), JSON.stringify({ event: "finished", jobId: "job-a", exitCode: 1 })].join("\n"));
  const evidence = await readJobRegistryEvidence(path);
  expect(evidence.availability).toBe("available");
  expect(evidence.malformedLines).toBe(1);
  const summary = correlateJobRegistryWithTraces([{ name: "x", timestamp: "2026-01-01T00:00:00Z", traceId: "wrong-trace", spanId: "span", attributes: {}, observations: [{ kind: "jobId", source: "launcher", availability: "available", value: "job-a" }] }] as never, evidence);
  const kinds = (summary.inconsistencies as Array<{ kind: string }>).map((item) => item.kind);
  expect(kinds).toContain("duplicate-job");
  expect(kinds).toContain("registry-trace-mismatch");
  expect(kinds).toContain("missing-parent");
  expect(await readJobRegistryEvidence(join(cwd, "missing.jsonl"))).toMatchObject({ availability: "missing" });
  await mkdir(join(cwd, "directory"));
  expect(await readJobRegistryEvidence(join(cwd, "directory"))).toMatchObject({ availability: "inaccessible" });
});

test("job registry correlation reports cycles and bounded node limits", () => {
  const event = (jobId: string, parentJobId: string, attempt: number) => ({ name: "x", timestamp: "2026-01-01T00:00:00Z", traceId: `trace-${jobId}`, spanId: `span-${jobId}`, attributes: { parentJobId }, observations: [{ kind: "jobId", source: "launcher", availability: "available", value: jobId }, { kind: "attempt", source: "task", availability: "available", value: attempt, unit: "count" }, { kind: "taskRevision", source: "task", availability: "available", value: 1, unit: "count" }, { kind: "sessionName", source: "launcher", availability: "available", value: "cycle-task" }] });
  const records = ["a", "b", "c"].flatMap((jobId, index) => [{ event: "launched", jobId, parentJobId: ["c", "a", "b"][index], sessionName: "cycle-task" as const }]);
  const summary = correlateJobRegistryWithTraces([event("a", "c", 1), event("b", "a", 2), event("c", "b", 3)] as never, { records, malformedLines: 0, availability: "available" }, { maxNodes: 2, maxDepth: 2 });
  const kinds = (summary.inconsistencies as Array<{ kind: string }>).map((item) => item.kind);
  expect(kinds).toContain("node-limit");
  expect(kinds).toContain("cycle-or-depth-limit");
  expect((summary.nodes as unknown[])).toHaveLength(2);
});

test("job registry query tool keeps explicit source selection bounded", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-job-registry-tool-"));
  const registryPath = join(cwd, "jobs.jsonl");
  await Bun.write(registryPath, JSON.stringify({ event: "launched", jobId: "job-tool", traceId: "trace-tool" }));
  await Bun.write(join(cwd, ".as-is", "tracing.jsonl"), JSON.stringify({ name: "x", timestamp: "2026-01-01T00:00:00Z", traceId: "trace-tool", spanId: "span", attributes: {}, observations: [{ kind: "jobId", source: "launcher", availability: "available", value: "job-tool" }] }));
  const tool = createTraceQueryTools().find((candidate) => candidate.name === "correlate_job_registry")!;
  const result = await tool.execute("call", { registryPath, maxNodes: 10, maxDepth: 4 }, undefined, undefined, { cwd } as never);
  expect(result.content[0].text).toContain("job-tool");
  expect(result.content[0].text).not.toContain(registryPath);
});

test("evidence results omit direct and nested filesystem metadata", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-evidence-privacy-"));
  const tokens = [cwd, "/tmp/evidence-absolute", "core/modules/task-control/as-is.md", ".as-is/tracing.jsonl", "worktree/session/task-record.log"];
  await Bun.write(join(cwd, ".as-is", "tracing.jsonl"), [
    JSON.stringify({ name: "worker.result", timestamp: "2026-01-01T00:00:00Z", traceId: "trace-safe", spanId: "span-safe", attributes: { safe: "retained", secret: "PRIVATE-SECRET", prompt: "PRIVATE-PROMPT", path: tokens[0], nested: { worktree: tokens[1], value: "kept" } }, observations: [{ kind: "sessionName", source: "task", availability: "available", value: "debug-task" }], sessionReference: { sessionDir: tokens[2] }, cwd: tokens[3] }),
    JSON.stringify({ name: "malformed", timestamp: 42, traceId: "trace-bad", spanId: "span-bad", attributes: { path: tokens[4] } }),
  ].join("\n"));
  const tools = createTraceQueryTools();
  const outputs = await Promise.all(tools.map((tool) => tool.execute("call", tool.name === "compare_traces" ? { leftTraceId: "trace-safe", rightTraceId: "trace-safe" } : { traceId: "trace-safe", limit: 10 }, undefined, undefined, { cwd } as never)));
  const serialized = outputs.map((output) => JSON.stringify(output));
  for (const token of tokens) expect(serialized.join("\n")).not.toContain(token);
  expect(serialized.join("\n")).toContain("retained");
  expect(serialized.join("\n")).not.toContain("PRIVATE-SECRET");
  expect(serialized.join("\n")).not.toContain("PRIVATE-PROMPT");
  expect(serialized.join("\n")).not.toContain("docs/private.md");
  expect(serialized.join("\n")).not.toContain("designs/internal.md");
  await expect(readTraceEvents(cwd)).resolves.toHaveLength(1);
  const sessionManager = SessionManager.create(cwd, join(cwd, "session-store"));
  const evidenceSessionId = sessionManager.getSessionId();
  sessionManager.appendMessage({ role: "user", content: "prefix=/tmp/private.log and see:core/modules/task-control/as-is.md", timestamp: Date.now() });
  const sessionResult = await analyzeProjectSession(cwd, evidenceSessionId, 20, sessionManager, undefined, "full");
  const sessionSerialized = JSON.stringify(sessionResult);
  expect(sessionSerialized).not.toContain("/tmp/private.log");
  expect(sessionSerialized).not.toContain("core/modules/task-control/as-is.md");
  const oversized = await analyzeProjectSession(cwd, evidenceSessionId, 1000, sessionManager, undefined, "full");
  const oversizedText = JSON.stringify(oversized);
  expect(oversizedText.length).toBeLessThan(1000);
  expect(oversizedText).toContain("available");
});
