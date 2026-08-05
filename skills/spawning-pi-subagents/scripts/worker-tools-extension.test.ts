import { describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import { analyzeProjectSession } from "../../../.pi/extensions/worker-tools";

const rootRecord = `---
as-is-version: 2
---
# Root
`;
const taskRecord = (approval: string) => `---
as-is-version: 2
task:
  status: active
  worker: execution-advisor
  updated: 2026-08-11T00:00:00Z
constraints:
  cost:
    allocated: 1.00
    spent: 0.00
    reserve: 0.10
    source: host-reported
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 100
      spent-seconds: 0
      reserve-seconds: 10
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Analyze bounded execution evidence.
---
# Task

## Control Plane

- control-plane: ${approval}
`;

describe("execution evidence session analysis", () => {
  test("returns bounded metadata without session content after durable approval", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    const manager = SessionManager.create(cwd, join(cwd, "sessions"));
    const sessionId = manager.getSessionId();
    const questionId = "q-session-metadata";
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    await writeFile(join(cwd, "tasks.md"), taskRecord(JSON.stringify({ event: "approval", "question-id": questionId, approval: `session-metadata:${sessionId}` })));
    manager.appendMessage({ role: "user", content: "private prompt", timestamp: Date.now() });
    manager.appendMessage({
      role: "assistant",
      content: [{ type: "text", text: "private response" }],
      api: "test",
      provider: "test-provider",
      model: "test-model",
      usage: { input: 3, output: 2, cacheRead: 0, cacheWrite: 0, totalTokens: 5, cost: { input: 0.01, output: 0.02, cacheRead: 0, cacheWrite: 0, total: 0.03 } },
      stopReason: "stop",
      timestamp: Date.now(),
    });

    const result = await analyzeProjectSession(cwd, sessionId, 1, manager, { sessionId, taskPath: ".", questionId });
    const text = JSON.stringify(result);
    expect(result.availability).toBe("available");
    expect(result.entryCount).toBe(2);
    expect(result.messageCount).toBe(2);
    expect(result.usage).toEqual({ input: 3, output: 2, totalTokens: 5, totalCost: 0.03 });
    expect(text).not.toContain("private prompt");
    expect(text).not.toContain("private response");
  });

  test("requires a matching durable approval before session access", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    await writeFile(join(cwd, "tasks.md"), taskRecord(JSON.stringify({ event: "approval", "question-id": "other-question", approval: "session-metadata:unknown-session" })));
    await expect(analyzeProjectSession(cwd, "unknown-session", 20, undefined, { sessionId: "unknown-session", taskPath: ".", questionId: "q-session-metadata" })).resolves.toEqual({
      sessionId: "unknown-session",
      availability: "authorization-required",
    });
  });

  test("rejects path-like and unknown session selectors after authorization", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    await writeFile(join(cwd, "tasks.md"), taskRecord(JSON.stringify({ event: "approval", "question-id": "q-session-metadata", approval: "session-metadata:../private-session" })));
    await expect(analyzeProjectSession(cwd, "../private-session", 20, undefined, { sessionId: "../private-session", taskPath: ".", questionId: "q-session-metadata" })).resolves.toEqual({
      sessionId: "../private-session",
      availability: "invalid-selector",
    });
    await expect(analyzeProjectSession(cwd, "unknown-session", 20, undefined, { sessionId: "unknown-session", taskPath: ".", questionId: "q-session-metadata" })).resolves.toEqual({
      sessionId: "unknown-session",
      availability: "authorization-required",
    });
  });
});
