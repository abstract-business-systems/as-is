import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createAgentSession, createExtensionRuntime, ModelRuntime, SessionManager } from "../../core/adapters/pi/node_modules/@earendil-works/pi-coding-agent";
import workerTools, { analyzeProjectSession, currentSessionName, currentSessionReference, newNestedDelegationContext, resolveWorkerThinkingLevel, toolsForTarget, workerSessionMetadata, workerSessionOptions } from "../../.pi/extensions/worker-tools";
import { registerWorkerTools } from "../../core/adapters/pi/extensions/worker-tools.ts";

const rootRecord = "# Root\n";

const testWorkerLoader = {
  getExtensions: () => ({ extensions: [], errors: [], runtime: createExtensionRuntime() }),
  getSkills: () => ({ skills: [], diagnostics: [] }),
  getPrompts: () => ({ prompts: [], diagnostics: [] }),
  getThemes: () => ({ themes: [], diagnostics: [] }),
  getAgentsFiles: () => ({ agentsFiles: [] }),
  getSystemPrompt: () => "worker test",
  getSystemPromptSource: () => undefined,
  getAppendSystemPrompt: () => [],
  getAppendSystemPromptSources: () => [],
  extendResources: () => undefined,
  reload: async () => undefined,
};

function componentContextTool() {
  let registered: { name: string; execute: Function } | undefined;
  workerTools({ registerTool: (tool: { name: string; execute: Function }) => { if (tool.name === "resolve_component_context") registered = tool; } } as never);
  if (!registered) throw new Error("resolve_component_context was not registered");
  return registered;
}
describe("capability-based worker extension", () => {
  test("every discovered project extension exports a Pi factory", async () => {
    const extensions = ["worker-tools.ts", "worker-tools-observability.ts", "mermaid-tools.ts"];
    for (const file of extensions) {
      const module = await import(`../../.pi/extensions/${file}`);
      expect(typeof module.default).toBe("function");
    }
  });

  test("registers host tools through the versioned package boundary", () => {
    const registered: string[] = [];
    registerWorkerTools({ registerTool: (tool: { name: string }) => registered.push(tool.name) }, {
      version: 1,
      getTools: () => [{ name: "example", label: "Example", description: "Example", parameters: {}, execute: async () => ({ content: [] }) } as never],
    });
    expect(registered).toEqual(["example"]);
  });

  test("fails closed for unsupported host services", () => {
    expect(() => registerWorkerTools({ registerTool: () => undefined }, {
      version: 2 as never,
      getTools: () => [],
    })).toThrow("unsupported subagent host services version");
  });

  test("resolves the declared thinking level for in-process workers", () => {
    expect(resolveWorkerThinkingLevel(process.cwd(), "max", "worker")).toBe("max");
  });

  test("uses the target agent model and thinking instead of the caller settings", async () => {
    const modelRuntime = await ModelRuntime.create();
    const callerModel = modelRuntime.getModel("openrouter", "@preset/abs-small");
    if (!callerModel) throw new Error("fixture caller model unavailable");
    const context = { model: callerModel, modelRegistry: { getAll: () => [...modelRuntime.getModels()] } } as never;
    const resolved = workerSessionOptions(context, process.cwd(), "medium", "max", "worker");
    expect(resolved.model).toMatchObject({ provider: "openrouter", id: "@preset/abs-medium" });
    expect(resolved.model).not.toBe(callerModel);
    expect(resolved.thinkingLevel).toBe("max");
    const modelPatternWithThinking = workerSessionOptions(context, process.cwd(), "@preset/abs-medium:high", "max", "worker");
    expect(modelPatternWithThinking.model).toMatchObject({ provider: "openrouter", id: "@preset/abs-medium" });
    expect(modelPatternWithThinking.thinkingLevel).toBe("max");
    const { session } = await createAgentSession({
      cwd: process.cwd(),
      model: resolved.model,
      thinkingLevel: resolved.thinkingLevel,
      modelRuntime,
      resourceLoader: testWorkerLoader,
      sessionManager: SessionManager.inMemory(process.cwd()),
      tools: ["read"],
    });
    expect(session.model).toMatchObject({ provider: "openrouter", id: "@preset/abs-medium" });
    expect(session.thinkingLevel).toBe("max");
    session.dispose();

    const projectDefault = workerSessionOptions(context, process.cwd(), undefined, "high", "worker");
    expect(projectDefault.model).toMatchObject({ provider: "openrouter", id: "@preset/abs-small" });
    expect(projectDefault.model).not.toBe(callerModel);
    expect(projectDefault.thinkingLevel).toBe("high");
  });

  test("rejects invalid in-process thinking declarations", () => {
    expect(() => resolveWorkerThinkingLevel(process.cwd(), "extreme", "worker")).toThrow("max");
  });

  test("exposes bounded in-process worker session metadata separately", () => {
    expect(workerSessionMetadata({ sessionId: "0190-worker", sessionName: "bounded-task" })).toEqual({
      sessionId: "0190-worker",
      sessionName: "bounded-task",
    });
    expect(workerSessionMetadata({ sessionId: 42, sessionName: undefined })).toEqual({
      sessionId: null,
      sessionName: null,
    });
    expect(workerSessionMetadata({ sessionId: "worker/path", sessionName: "system: prompt" })).toEqual({
      sessionId: null,
      sessionName: null,
    });
  });

  test("pairs admission identity with the invoking session and keeps invalid metadata unavailable", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-admission-session-identity-"));
    const manager = SessionManager.create(cwd, join(cwd, "sessions"));
    manager.appendSessionInfo("tracing-trial");
    const context = { sessionManager: manager };
    expect(currentSessionName(context)).toBe("tracing-trial");
    expect(currentSessionReference(context)).toEqual({ sessionId: manager.getSessionId() });
    expect(currentSessionName({ sessionManager: { getSessionName: () => "system: private prompt" } })).toBeUndefined();
    expect(currentSessionReference({ sessionManager: { getSessionId: () => "session/path" } })).toBeUndefined();
    const implementation = await Bun.file(join(process.cwd(), "tools", "agent", "subagent-tools.ts")).text();
    expect(implementation).toContain("nestedObservations(parentContext, callId, relationshipId, roleName, admissionSessionName, sessionReference, \"admission\", depth)");
    expect(implementation).toContain("nestedObservations(parentContext, callId, relationshipId, roleName, workerMetadata.sessionName, workerSessionReference, \"result\", depth)");
  });
  test("preserves every declared worker tool in the SDK allowlist", () => {
    const profile = toolsForTarget("agent-capability-probe", ["read", "grep", "call_subagent", "resolve_component_context"]);
    expect(profile.tools).toEqual(["read", "grep", "call_subagent", "resolve_component_context"]);
    expect(profile.customTools.map((tool) => tool.name)).toEqual(["call_subagent", "resolve_component_context"]);
  });

  test("nested delegation context inherits runs and creates fresh trace lineage", () => {
    const root = newNestedDelegationContext();
    const child = newNestedDelegationContext(root);
    const leaf = newNestedDelegationContext(child);
    expect(child.runId).toBe(root.runId);
    expect(leaf.runId).toBe(root.runId);
    expect(new Set([root.traceId, child.traceId, leaf.traceId]).size).toBe(3);
    expect(child.depth).toBe(root.depth + 1);
    expect(leaf.depth).toBe(child.depth + 1);
  });

  test("nested delegation identities are runtime-owned and result budgets are explicit", async () => {
    const implementation = await Bun.file(join(process.cwd(), "tools", "agent", "subagent-tools.ts")).text();
    expect(implementation).toContain('name: "call_subagent"');
    expect(implementation).toContain("maximumNestedDepth");
    expect(implementation).toContain("maximumNestedChildren");
    expect(implementation).toContain('availableObservation("parentTraceId"');
    expect(implementation).toContain('unavailableObservation("budgetCostUsd"');
    expect(implementation).toContain("traceId: newId()");
    expect(implementation).toContain("runId: parent?.runId ?? newId()");
    expect(implementation).toContain("durationMs: Date.now() - started");
    expect(implementation).not.toContain('traceId: Type.Optional');
    expect(implementation).not.toContain('runId: Type.Optional');
    expect(implementation).not.toContain('availableObservation(\"wallClockMs\", Date.now() - started');
  });

  test("call_subagent requires an explicit target role", async () => {
    let registered: { name: string; parameters: unknown } | undefined;
    workerTools({ registerTool: (tool: { name: string; parameters: unknown }) => { if (tool.name === "call_subagent") registered = tool; } } as never);
    expect(registered).toBeDefined();
    expect(JSON.stringify(registered?.parameters)).toContain("role");
    expect(JSON.stringify(registered?.parameters)).not.toContain("Optional");
  });

  test("canonical target contracts are present and distinct", async () => {
    const cwd = process.cwd();
    const roles = ["as-is", "component-builder", "execution-advisor", "evidence-validator", "expert", "worker"];
    for (const role of roles) {
      const path = join(cwd, "agents", role, "agent.md");
      const text = await Bun.file(path).text();
      expect(text).toContain(`name: ${role}`);
      expect(text).toContain("---");
    }
  });

  test("target selection is canonical and independent of caller metadata", async () => {
    const cwd = process.cwd();
    const worker = await Bun.file(join(cwd, "agents", "worker", "agent.md")).text();
    const expert = await Bun.file(join(cwd, "agents", "expert", "agent.md")).text();
    const extension = await Bun.file(join(cwd, ".pi", "extensions", "worker-tools.ts")).text();
    expect(worker).not.toEqual(expert);
    const implementation = await Bun.file(join(cwd, "tools", "agent", "subagent-tools.ts")).text();
    expect(extension).toContain("agentTools");
    expect(implementation).toContain("resolveCanonicalTarget");
    expect(extension).not.toContain("rolePaths");
    expect(extension).not.toContain("AS_IS_ALLOW_CALL_SUBAGENT");
    expect(JSON.stringify({ role: "worker", caller: "arbitrary", parentJobId: "arbitrary" })).toContain("worker");
    expect(JSON.stringify({ role: "expert", caller: "different", parentJobId: null })).toContain("expert");
  });
  test("resolves only launcher-owned explicitly exposed component context", async () => {
    const root = await mkdtemp(join(tmpdir(), "as-is-component-context-"));
    const component = join(root, "component");
    await mkdir(component);
    await writeFile(join(component, "guide.md"), "# Guide\n\nBounded context.\n");
    await writeFile(join(component, "tasks.md"), "# Task\n");
    await writeFile(join(component, "as-is.md"), "# Component\n\n- [Guide](guide.md)\n- [Task](tasks.md)\n");
    const previousRoot = process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT;
    const previousComponent = process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT;
    const previousRecords = process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES;
    process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT = root;
    process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT = "component";
    process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES = JSON.stringify(["tasks.md"]);
    try {
      const tool = componentContextTool();
      const guide = await tool.execute("call", { reference: "guide.md" });
      expect(JSON.parse(guide.content[0].text)).toMatchObject({ complete: true, kind: "file", content: "# Guide\n\nBounded context.\n" });
      const task = await tool.execute("call", { reference: "tasks.md", projectRoot: root, component: "." });
      expect(JSON.parse(task.content[0].text).diagnostics[0].code).toBe("task-record-denied");
    } finally {
      if (previousRoot === undefined) delete process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT;
      else process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT = previousRoot;
      if (previousComponent === undefined) delete process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT;
      else process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT = previousComponent;
      if (previousRecords === undefined) delete process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES;
      else process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES = previousRecords;
    }
  });

  test("returns bounded metadata for a readable session without tracer approval", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-session-analysis-"));
    const manager = SessionManager.create(cwd, join(cwd, "sessions"));
    manager.appendSessionInfo("bounded-session");
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
    expect(result.sessionName).toBe("bounded-session");
    expect(result.entryCount).toBe(3);
    expect(result.messageCount).toBe(2);
    expect(result.usage).toEqual({ input: 3, output: 2, totalTokens: 5, totalCost: 0.03 });
    expect(text).not.toContain("private prompt");
    expect(text).not.toContain("private response");

    const detail = await analyzeProjectSession(cwd, sessionId, 10, manager, undefined, "full");
    expect(detail.detail).toBe("full");
    expect(JSON.stringify(detail)).toContain("private prompt");
    expect(JSON.stringify(detail)).toContain("private response");
  });

  test("discovers an exact session through the configured private store", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "as-is-configured-session-analysis-"));
    const sessionDir = join(cwd, "private-sessions");
    await writeFile(join(cwd, "as-is.json"), JSON.stringify({ configuration: { agents: { sessionDirectory: sessionDir } } }));
    await writeFile(join(cwd, "as-is.md"), rootRecord);
    const manager = SessionManager.create(cwd, sessionDir);
    const sessionId = manager.getSessionId();
    manager.appendSessionInfo("configured-task");
    manager.appendMessage({ role: "user", content: "private prompt", timestamp: Date.now() });
    manager.appendMessage({ role: "assistant", content: [{ type: "text", text: "private response" }], timestamp: Date.now() });
    await Bun.sleep(10);
    const result = await analyzeProjectSession(cwd, sessionId, 10);
    expect(result.availability).toBe("available");
    expect(result.sessionId).toBe(sessionId);
    expect(result.sessionName).toBe("configured-task");
    expect(JSON.stringify(result)).not.toContain("private prompt");
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
