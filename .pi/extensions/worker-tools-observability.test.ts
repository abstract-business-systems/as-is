import { expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyzeProjectSession, createTraceQueryTools, readTraceEvents } from "./worker-tools-observability.ts";
import { SessionManager } from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";

test("focused observability functionality keeps session summaries bounded and details explicit", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "as-is-focused-observability-"));
  const manager = SessionManager.create(cwd, join(cwd, "sessions"));
  const sessionId = manager.getSessionId();
  manager.appendMessage({ role: "user", content: "private prompt", timestamp: Date.now() });
  manager.appendMessage({ role: "assistant", content: [{ type: "text", text: "private response" }], timestamp: Date.now() });

  const summary = await analyzeProjectSession(cwd, sessionId, 20, manager);
  expect(summary.availability).toBe("available");
  expect(JSON.stringify(summary)).not.toContain("private prompt");
  const full = await analyzeProjectSession(cwd, sessionId, 20, manager, undefined, "full");
  expect(JSON.stringify(full)).toContain("private prompt");
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
  const result = await search.execute("call", { name: "worker", limit: 1 }, undefined, undefined, { cwd } as never);
  expect(result.details).toEqual({ count: 1 });
  expect(result.content[0].text).toContain("trace-a");
});
