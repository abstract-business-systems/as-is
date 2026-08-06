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
describe("execution evidence session analysis", () => {
  test("returns bounded metadata for a readable session without tracer approval", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    const manager = SessionManager.create(cwd, join(cwd, "sessions"));
    const sessionId = manager.getSessionId();
    await writeFile(join(cwd, "as-is.md"), rootRecord);
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

    const result = await analyzeProjectSession(cwd, sessionId, 1, manager);
    const text = JSON.stringify(result);
    expect(result.availability).toBe("available");
    expect(result.entryCount).toBe(2);
    expect(result.messageCount).toBe(2);
    expect(result.usage).toEqual({ input: 3, output: 2, totalTokens: 5, totalCost: 0.03 });
    expect(text).not.toContain("private prompt");
    expect(text).not.toContain("private response");

    const detail = await analyzeProjectSession(cwd, sessionId, 10, manager, undefined, "full");
    expect(detail.detail).toBe("full");
    expect(JSON.stringify(detail)).toContain("private prompt");
    expect(JSON.stringify(detail)).toContain("private response");
  });

  test("allows any valid readable session ID and keeps unknown sessions bounded", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    await expect(analyzeProjectSession(cwd, "unknown-session", 20)).resolves.toEqual({
      sessionId: "unknown-session",
      availability: "missing-or-out-of-scope",
    });
  });

  test("rejects path-like and invalid bounded selectors", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    await expect(analyzeProjectSession(cwd, "../private-session", 20)).resolves.toEqual({
      sessionId: "../private-session",
      availability: "invalid-selector",
    });
    await expect(analyzeProjectSession(cwd, "valid-session", 0)).resolves.toEqual({
      sessionId: "valid-session",
      availability: "invalid-limit",
    });
  });

  test("uses the inherited readable session store when the child cwd differs", async () => {
    const sourceCwd = await mkdtemp(join(tmpdir(), "as-is-session-source-"));
    const childCwd = await mkdtemp(join(tmpdir(), "as-is-session-child-"));
    const sessionDir = join(sourceCwd, "session-store");
    const manager = SessionManager.create(sourceCwd, sessionDir);
    const sessionId = manager.getSessionId();
    await writeFile(join(sourceCwd, "as-is.md"), rootRecord);
    manager.appendMessage({ role: "user", content: "private prompt", timestamp: Date.now() });
    manager.appendMessage({ role: "assistant", content: [{ type: "text", text: "private response" }], timestamp: Date.now() });

    const previousCwd = process.env.AS_IS_SESSION_CWD;
    const previousDir = process.env.AS_IS_SESSION_DIR;
    process.env.AS_IS_SESSION_CWD = sourceCwd;
    process.env.AS_IS_SESSION_DIR = sessionDir;
    try {
      const result = await analyzeProjectSession(childCwd, sessionId, 1);
      expect(result.availability).toBe("available");
      expect(result.sessionId).toBe(sessionId);
      expect(JSON.stringify(result)).not.toContain("private prompt");
    } finally {
      if (previousCwd === undefined) delete process.env.AS_IS_SESSION_CWD;
      else process.env.AS_IS_SESSION_CWD = previousCwd;
      if (previousDir === undefined) delete process.env.AS_IS_SESSION_DIR;
      else process.env.AS_IS_SESSION_DIR = previousDir;
    }
  });
});
