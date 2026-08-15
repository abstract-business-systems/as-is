import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  createAgentSession,
  createExtensionRuntime,
  resolveCliModel,
  SessionManager,
  type ExtensionContext,
  type ResourceLoader,
  type ToolDefinition,
  type ExtensionAPI,
} from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../skills/spawning-pi-subagents/node_modules/typebox";
import {
  analyzeProjectSession as focusedAnalyzeProjectSession,
  createSessionAnalysisTool as createFocusedSessionAnalysisTool,
  createTraceQueryTools as createFocusedTraceQueryTools,
} from "./worker-tools-observability.ts";
import { boundedLimit } from "../../components/budget-control/budget.ts";
import { parseThinkingLevel, resolveThinkingLevel, type ThinkingLevel } from "../../skills/spawning-pi-subagents/scripts/agent-thinking.ts";
import { resolveCanonicalAgent } from "../../skills/spawning-pi-subagents/scripts/agent-resolution.ts";
import { readAsIsJson, resolveConfigurationFromCwdSync } from "../../components/as-is-data/resolver.ts";
import { resolveLocalLinkedContext } from "../../components/linked-context/resolver.ts";
import {
  emitTrace,
  serializeSessionReference,
  type SessionReference,
} from "../../components/observability/tracer.ts";

const maxResultCharacters = 100_000;
const defaultReadOnlyTools = ["read", "grep", "find", "ls"];
const builtinTools = new Set(["read", "write", "edit", "bash", "grep", "find", "ls", "webfetch", "websearch"]);
const defaultTimeoutMs = 60_000;
const maximumTimeoutMs = 900_000;

function boundedJson(value: unknown): string {
  return JSON.stringify(value, null, 2).slice(0, maxResultCharacters);
}

function taskWallClockRemaining(cwd: string): number | undefined {
  try {
    const task = readAsIsJson(join(cwd, "as-is.json")).task as Record<string, unknown> | undefined;
    const wall = task?.constraints && typeof task.constraints === "object"
      ? (task.constraints as Record<string, unknown>).execution as Record<string, unknown> | undefined
      : undefined;
    const values = wall?.["wall-clock"] as Record<string, unknown> | undefined;
    if (typeof values?.["allocated-seconds"] === "number" && typeof values?.["spent-seconds"] === "number" && typeof values?.["reserve-seconds"] === "number") {
      return Math.max(0, values["allocated-seconds"] - values["spent-seconds"] - values["reserve-seconds"]) * 1000;
    }
  } catch { /* a child may have no local JSON task metadata */ }
  return undefined;
}

type TraceContext = {
  traceId?: string;
  runId?: string;
  parentSessionId?: string;
};

type TraceEvent = {
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  attributes: Record<string, string | number | boolean | undefined>;
  sessionReference?: SessionReference;
};

function newId(): string {
  return randomUUID().replaceAll("-", "");
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

const gitInspectionOperations = {
  status: ["status", "--short"],
  diff: ["diff", "--no-ext-diff", "--"],
  diffCheck: ["diff", "--check", "--no-ext-diff", "--"],
  head: ["log", "-1", "--oneline", "--decorate"],
} as const;

async function runGitInspection(cwd: string, operation: keyof typeof gitInspectionOperations): Promise<string> {
  const proc = Bun.spawn(["git", "-C", cwd, ...gitInspectionOperations[operation]], {
    cwd,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const code = await proc.exited;
  if (code !== 0) throw new Error(`git inspection failed (${code}): ${stderr.trim()}`);
  return stdout.slice(0, 100_000);
}

const sessionAnalysisTool = createFocusedSessionAnalysisTool();

const gitInspectTool: ToolDefinition = {
  name: "git_inspect",
  label: "Git inspection",
  description: "Read-only bounded Git evidence: status, scoped diff, diff check, or HEAD summary.",
  parameters: Type.Object({
    operation: Type.Union([
      Type.Literal("status"), Type.Literal("diff"), Type.Literal("diffCheck"), Type.Literal("head"),
    ]),
  }),
  async execute(_id, params, _signal, _update, ctx) {
    return { content: [{ type: "text", text: await runGitInspection(ctx.cwd, params.operation) }], details: {} };
  },
};

async function recordTrace(event: TraceEvent, cwd: string): Promise<void> {
  await emitTrace(event, cwd);
}

export const analyzeProjectSession = focusedAnalyzeProjectSession;

export function currentSessionReference(ctx: { sessionManager?: { getSessionId?: () => unknown } }): SessionReference | undefined {
  try {
    const sessionId = ctx.sessionManager?.getSessionId?.();
    if (typeof sessionId !== "string") return undefined;
    return serializeSessionReference({ sessionId });
  } catch {
    return undefined;
  }
}

type ProjectAgentConfig = {
  defaultModel?: string;
  defaultThinkingLevel?: ThinkingLevel;
  models: Record<string, string>;
  provider?: string;
};

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const string = (value: unknown): string | undefined => typeof value === "string" ? value : undefined;

function projectAgentConfig(cwd: string): ProjectAgentConfig {
  try {
    const resolution = resolveConfigurationFromCwdSync(cwd);
    if (!resolution.complete) return { models: {} };
    const agents = object(resolution.configuration.agents);
    const models: Record<string, string> = {};
    for (const [name, value] of Object.entries(object(agents.models))) {
      if (typeof value === "string") models[name] = value;
    }
    return {
      defaultModel: string(agents.defaultModel),
      defaultThinkingLevel: parseThinkingLevel(agents.defaultThinkingLevel, "configuration.agents.defaultThinkingLevel"),
      models,
      provider: string(agents.provider),
    };
  } catch {
    return { models: {} };
  }
}

function workerThinkingLevel(config: ProjectAgentConfig, agentThinking: unknown, role: string): ThinkingLevel | undefined {
  return resolveThinkingLevel({
    agent: agentThinking,
    projectDefault: config.defaultThinkingLevel,
  }, `${role} thinking`);
}

export function resolveWorkerThinkingLevel(cwd: string, agentThinking: unknown, role: string): ThinkingLevel | undefined {
  return workerThinkingLevel(projectAgentConfig(cwd), agentThinking, role);
}

export function workerSessionOptions(
  ctx: Pick<ExtensionContext, "model" | "modelRegistry">,
  cwd: string,
  agentModel: unknown,
  agentThinking: unknown,
  role: string,
): { model?: NonNullable<ExtensionContext["model"]>; thinkingLevel?: ThinkingLevel } {
  const config = projectAgentConfig(cwd);
  // The target declaration or project default selects the child model; the
  // caller model is never inherited when either is configured.
  const selectedModel = typeof agentModel === "string" ? agentModel : config.defaultModel;
  const modelName = selectedModel ? config.models[selectedModel] ?? selectedModel : undefined;
  const thinkingLevel = workerThinkingLevel(config, agentThinking, role);
  if (!modelName) return thinkingLevel ? { thinkingLevel } : {};

  const resolved = resolveCliModel({
    cliProvider: config.provider,
    cliModel: modelName,
    cliThinking: thinkingLevel,
    modelRuntime: {
      getModels: () => ctx.modelRegistry.getAll(),
      hasConfiguredAuth: () => false,
    } as Parameters<typeof resolveCliModel>[0]["modelRuntime"],
  });
  if (resolved.error || !resolved.model) {
    throw new Error(`${role} model declaration could not be resolved: ${resolved.error ?? modelName}`);
  }
  return thinkingLevel ? { model: resolved.model, thinkingLevel } : { model: resolved.model };
}

async function resolveCanonicalTarget(cwd: string, role: string) {
  return resolveCanonicalAgent(cwd, role);
}

function toolsForTarget(role: string, declared: string[]): { tools: string[]; customTools: ToolDefinition[] } {
  if (role === "evidence-validator") return { tools: [...defaultReadOnlyTools, "git_inspect"], customTools: [gitInspectTool] };
  const tools = declared.filter((tool) => builtinTools.has(tool));
  const customTools: ToolDefinition[] = [];
  const focusedTraceQueryTools = createFocusedTraceQueryTools();
  if (declared.includes("analyze_session")) customTools.push(createFocusedSessionAnalysisTool());
  if (declared.includes("search_traces")) customTools.push(focusedTraceQueryTools[0]);
  if (declared.includes("get_trace")) customTools.push(focusedTraceQueryTools[1]);
  if (declared.includes("summarize_trace")) customTools.push(focusedTraceQueryTools[2]);
  if (declared.includes("compare_traces")) customTools.push(focusedTraceQueryTools[3]);
  if (declared.includes("call_subagent")) customTools.push(callSubagent);
  if (declared.includes("resolve_component_context")) customTools.push(componentContextTool);
  return { tools, customTools };
}

function createWorkerLoader(role: string): ResourceLoader {
  return {
    getExtensions: () => ({ extensions: [], errors: [], runtime: createExtensionRuntime() }),
    getSkills: () => ({ skills: [], diagnostics: [] }),
    getPrompts: () => ({ prompts: [], diagnostics: [] }),
    getThemes: () => ({ themes: [], diagnostics: [] }),
    getAgentsFiles: () => ({ agentsFiles: [] }),
    getSystemPrompt: () => role,
    getSystemPromptSource: () => undefined,
    getAppendSystemPrompt: () => [],
    getAppendSystemPromptSources: () => [],
    extendResources: () => undefined,
    reload: async () => undefined,
  };
}

function componentTaskRecordNames(): string[] | undefined {
  const raw = process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES;
  if (!raw) return undefined;
  try {
    const names: unknown = JSON.parse(raw);
    return Array.isArray(names) && names.every((name) => typeof name === "string") ? names : undefined;
  } catch { return undefined; }
}

function extractWorkerText(session: { messages: Array<{ role?: string; content?: unknown }> }): string {
  const messages = [...session.messages].reverse();
  for (const message of messages) {
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    const text = message.content
      .filter((part): part is { type: "text"; text: string } =>
        typeof part === "object" && part !== null && (part as { type?: string }).type === "text" &&
        typeof (part as { text?: unknown }).text === "string",
      )
      .map((part) => part.text)
      .join("\n")
      .trim();
    if (text) return text.slice(0, maxResultCharacters);
  }
  return "Worker completed without a text report.";
}

const componentContextTool: ToolDefinition = {
  name: "resolve_component_context",
  label: "Resolve exposed component context",
  description: "Resolve one file or directory explicitly exposed by the assigned component's as-is.md record.",
  parameters: Type.Object({ reference: Type.String({ minLength: 1 }) }),
  async execute(_toolCallId, params) {
    const projectRoot = process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT;
    const component = process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT;
    if (!projectRoot || !component) {
      return { content: [{ type: "text", text: JSON.stringify({ complete: false, diagnostics: [{ code: "component-context-unavailable", message: "The host did not supply component context authority." }] }) }] };
    }
    const result = await resolveLocalLinkedContext(projectRoot, join(component, "as-is.md"), params.reference, { taskRecordNames: componentTaskRecordNames() });
    return { content: [{ type: "text", text: boundedJson(result) }], details: { complete: result.complete, kind: result.kind } };
  },
};

const callSubagent: ToolDefinition = {
  name: "call_subagent",
  label: "Call read-only worker",
  description: "Ask a bounded read-only worker agent a question without spawning a subprocess.",
  parameters: Type.Object({
    role: Type.String({ description: "Canonical agent role under agents/<role>/agent.md." }),
    task: Type.String({ description: "One bounded request for the selected canonical agent." }),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1_000, maximum: maximumTimeoutMs })),
    traceId: Type.Optional(Type.String()),
    runId: Type.Optional(Type.String()),
  }),
  async execute(_toolCallId, params, signal, _onUpdate, ctx) {
    const callId = newId();
    const traceId = params.traceId ?? newId();
    const spanId = newId();
    const started = Date.now();
    const cwd = ctx.cwd;
    const requestedTimeoutMs = params.timeoutMs ?? defaultTimeoutMs;
    const remainingMs = taskWallClockRemaining(cwd);
    const timeoutMs = remainingMs === undefined
      ? Math.min(requestedTimeoutMs, maximumTimeoutMs)
      : boundedLimit(requestedTimeoutMs, remainingMs, maximumTimeoutMs);
    if (timeoutMs < 1_000) throw new Error("worker call rejected: task wall-clock budget is exhausted or below the minimum call timeout");
    const roleName = params.role;
    const target = await resolveCanonicalTarget(cwd, roleName);
    const sessionReference = currentSessionReference(ctx);

    await recordTrace({
      name: "call_subagent",
      timestamp: new Date().toISOString(),
      traceId,
      spanId,
      sessionReference,
      attributes: {
        "as_is.run_id": params.runId,
        "as_is.role": roleName,
        "as_is.call_id": callId,
        "as_is.task_digest": hash(params.task),
      },
    }, cwd);

    const controller = new AbortController();
    const abortFromParent = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abortFromParent, { once: true });

    let worker;
    try {
      const profile = toolsForTarget(roleName, target.tools);
      const result = await createAgentSession({
        cwd,
        ...workerSessionOptions(ctx, cwd, target.model, target.thinking, roleName),
        resourceLoader: createWorkerLoader(target.body),
        tools: profile.tools,
        sessionManager: SessionManager.inMemory(cwd),
        customTools: profile.customTools,
      });
      worker = result.session;

      const prompt = `Bounded worker request (call ${callId}):\n\n${params.task}\n\nReturn only the worker report format from your role contract.`;
      await Promise.race([
        worker.prompt(prompt),
        new Promise<never>((_, reject) => {
          const timer = setTimeout(() => {
            void worker.abort();
            reject(new Error(`Worker timed out after ${timeoutMs}ms`));
          }, timeoutMs);
          timer.unref?.();
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer);
            void worker.abort();
            reject(new Error("Worker call aborted"));
          }, { once: true });
        }),
      ]);
      const report = extractWorkerText(worker);
      await recordTrace({
        name: "worker.result",
        timestamp: new Date().toISOString(),
        traceId,
        spanId: newId(),
        parentSpanId: spanId,
        sessionReference,
        attributes: {
          "as_is.role": roleName,
          "as_is.call_id": callId,
          "as_is.outcome": "success",
          "as_is.duration_ms": Date.now() - started,
          "as_is.result_digest": hash(report),
        },
      }, cwd);
      return { content: [{ type: "text", text: report }], details: { callId, traceId, durationMs: Date.now() - started } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordTrace({
        name: "worker.result",
        timestamp: new Date().toISOString(),
        traceId,
        spanId: newId(),
        parentSpanId: spanId,
        sessionReference,
        attributes: {
          "as_is.role": roleName,
          "as_is.call_id": callId,
          "as_is.outcome": "failure",
          "as_is.duration_ms": Date.now() - started,
          "as_is.error_type": error instanceof Error ? error.name : "unknown",
        },
      }, cwd);
      throw new Error(`${roleName} subagent failed: ${message}`);
    } finally {
      signal?.removeEventListener("abort", abortFromParent);
      worker?.dispose();
    }
  },
};

export default function workerTools(pi: ExtensionAPI): void {
  // Registration is declarative. Pi's active tool set controls whether the
  // caller can invoke `call_subagent`; no process-global authorization flag or
  // caller/target identity check is used here.
  pi.registerTool(componentContextTool);
  pi.registerTool(callSubagent);
  pi.registerTool(sessionAnalysisTool);
  for (const tool of createFocusedTraceQueryTools()) pi.registerTool(tool);
}
