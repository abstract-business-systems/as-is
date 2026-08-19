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
} from "../evidence/worker-tools-observability.ts";
import { boundedLimit } from "../../core/modules/task-control/budget.ts";
import { parseThinkingLevel, resolveThinkingLevel, type ThinkingLevel } from "../../skills/spawning-pi-subagents/scripts/agent-thinking.ts";
import { resolveCanonicalAgent } from "../../core/modules/agent-resolution/agent-resolution.ts";
import { readAsIsJson, resolveConfigurationFromCwdSync } from "../../core/modules/context-resolution/configuration-resolver.ts";
import { resolveLinkedContextTool } from "../context/resolve-linked-context.ts";
import { sessionNameFromTaskName } from "../../skills/spawning-pi-subagents/scripts/session-naming.ts";
import { resolveSessionDirectory } from "../../skills/spawning-pi-subagents/scripts/session-directory.ts";
import {
  emitTrace,
  serializeSessionReference,
  type SessionReference,
  type TraceObservation,
} from "../../core/modules/observability/tracer.ts";

const maxResultCharacters = 100_000;
const defaultReadOnlyTools = ["read", "grep", "find", "ls"];
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

type NestedDelegationContext = {
  traceId: string;
  callId: string;
  runId: string;
  relationshipId: string;
  depth: number;
  childCount: number;
};

const nestedDelegationContexts = new WeakMap<object, NestedDelegationContext>();
const maximumNestedDepth = 8;
const maximumNestedChildren = 16;

export function newNestedDelegationContext(parent?: NestedDelegationContext): NestedDelegationContext {
  return {
    traceId: newId(),
    callId: newId(),
    runId: parent?.runId ?? newId(),
    relationshipId: newId(),
    depth: parent ? parent.depth + 1 : 0,
    childCount: 0,
  };
}

function nestedContextFor(ctx: { sessionManager?: unknown }): NestedDelegationContext | undefined {
  return ctx.sessionManager && typeof ctx.sessionManager === "object"
    ? nestedDelegationContexts.get(ctx.sessionManager)
    : undefined;
}

function unavailableObservation(kind: TraceObservation["kind"], source: TraceObservation["source"] = "agent-tool", unit?: TraceObservation["unit"]): TraceObservation {
  return { kind, source, availability: "unavailable", reason: "not-observed", ...(unit ? { unit } : {}) };
}

function availableObservation(kind: TraceObservation["kind"], value: string | number, source: TraceObservation["source"] = "agent-tool", unit?: TraceObservation["unit"]): TraceObservation {
  return { kind, source, availability: "available", value, ...(unit ? { unit } : {}) };
}

function taskContextObservation(kind: "taskRevision" | "attempt" | "componentIdentity"): TraceObservation {
  const raw = kind === "taskRevision" ? process.env.AS_IS_TASK_REVISION : kind === "attempt" ? process.env.AS_IS_ATTEMPT : process.env.AS_IS_COMPONENT_IDENTITY;
  if (kind === "componentIdentity") return raw ? availableObservation(kind, hash(raw), "task") : unavailableObservation(kind, "task");
  const value = raw === undefined ? undefined : Number(raw);
  return value !== undefined && Number.isSafeInteger(value) && value >= 0
    ? availableObservation(kind, value, "task", "count")
    : unavailableObservation(kind, "task");
}

function errorClass(error: unknown): TraceObservation["value"] {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timed out")) return "timeout";
  if (message.includes("aborted")) return "aborted";
  if (message.includes("model declaration") || message.includes("canonical agent")) return "invalid-target";
  if (message.includes("prompt")) return "prompt-failed";
  return "unknown";
}

function nestedObservations(context: NestedDelegationContext | undefined, callId: string, relationshipId: string, role: string, sessionName: string | undefined, sessionReference: SessionReference | undefined, phase: "admission" | "result", depth: number): TraceObservation[] {
  return [
    taskContextObservation("taskRevision"),
    taskContextObservation("attempt"),
    taskContextObservation("componentIdentity"),
    availableObservation("callId", callId),
    availableObservation("relationshipId", relationshipId),
    availableObservation("workerRole", role),
    sessionName ? availableObservation("sessionName", sessionName, "task") : unavailableObservation("sessionName", "task"),
    sessionReference ? availableObservation("localSessionId", sessionReference.sessionId, "pi-session") : unavailableObservation("localSessionId", "pi-session"),
    availableObservation("phase", phase),
    phase === "admission" ? availableObservation("admission", "admitted") : unavailableObservation("admission"),
    availableObservation("depth", depth, "agent-tool", "count"),
    context ? availableObservation("parentTraceId", context.traceId) : unavailableObservation("parentTraceId"),
    context ? availableObservation("parentCallId", context.callId) : unavailableObservation("parentCallId"),
    context ? availableObservation("childCount", context.childCount, "agent-tool", "count") : unavailableObservation("childCount"),
    unavailableObservation("budgetCostUsd", "task", "usd"),
    unavailableObservation("usageInputTokens", "pi-session", "count"),
    unavailableObservation("usageOutputTokens", "pi-session", "count"),
    unavailableObservation("usageTotalTokens", "pi-session", "count"),
    unavailableObservation("usageCostUsd", "pi-session", "usd"),
  ];
}

type TraceEvent = {
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  attributes: Record<string, string | number | boolean | undefined>;
  observations?: TraceObservation[];
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

export type WorkerSessionMetadata = {
  sessionId: string | null;
  sessionName: string | null;
};

export function workerSessionMetadata(worker: { sessionId?: unknown; sessionName?: unknown }): WorkerSessionMetadata {
  const sessionReference = serializeSessionReference({ sessionId: worker.sessionId });
  const sessionName = typeof worker.sessionName === "string" ? sessionNameFromTaskName(worker.sessionName) : undefined;
  return {
    sessionId: sessionReference?.sessionId ?? null,
    sessionName: sessionName?.accepted ? sessionName.name : null,
  };
}

type ProjectAgentConfig = {
  defaultModel?: string;
  defaultThinkingLevel?: ThinkingLevel;
  models: Record<string, string>;
  provider?: string;
  sessionDirectory?: string;
  projectRoot?: string;
};

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const string = (value: unknown): string | undefined => typeof value === "string" ? value : undefined;

function projectAgentConfig(cwd: string): ProjectAgentConfig & { sessionDirectory?: string } {
  try {
    const resolution = resolveConfigurationFromCwdSync(cwd);
    if (!resolution.complete) return { models: {} };
    const configuration = resolution.configuration;
    const agents = object(configuration.agents);
    const models: Record<string, string> = {};
    for (const [name, value] of Object.entries(object(agents.models))) {
      if (typeof value === "string") models[name] = value;
    }
    return {
      defaultModel: string(agents.defaultModel),
      defaultThinkingLevel: parseThinkingLevel(agents.defaultThinkingLevel, "configuration.agents.defaultThinkingLevel"),
      models,
      provider: string(agents.provider),
      sessionDirectory: string(agents.sessionDirectory),
      projectRoot: resolution.root,
    };
  } catch {
    return { models: {} };
  }
}

function sessionDirectoryFor(cwd: string, config: ProjectAgentConfig): string {
  return resolveSessionDirectory(config.sessionDirectory, cwd, config.projectRoot ?? cwd);
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

export function toolsForTarget(role: string, declared: string[]): { tools: string[]; customTools: ToolDefinition[] } {
  if (role === "evidence-validator") return { tools: [...defaultReadOnlyTools, "git_inspect"], customTools: [gitInspectTool] };
  // The Pi SDK applies `tools` as the allowlist for built-in and custom tools.
  // Preserve the canonical role's declaration verbatim so every admitted tool,
  // including repository-owned custom tools, is available to the worker.
  const tools = [...declared];
  const customTools: ToolDefinition[] = [];
  const focusedTraceQueryTools = createFocusedTraceQueryTools();
  if (declared.includes("analyze_session")) customTools.push(createFocusedSessionAnalysisTool());
  if (declared.includes("search_traces")) customTools.push(focusedTraceQueryTools[0]);
  if (declared.includes("get_trace")) customTools.push(focusedTraceQueryTools[1]);
  if (declared.includes("summarize_trace")) customTools.push(focusedTraceQueryTools[2]);
  if (declared.includes("compare_traces")) customTools.push(focusedTraceQueryTools[3]);
  if (declared.includes("call_subagent")) customTools.push(callSubagent);
  if (declared.includes("resolve_component_context")) customTools.push(resolveLinkedContextTool);
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

const callSubagent: ToolDefinition = {
  name: "call_subagent",
  label: "Call read-only worker",
  description: "Ask a bounded read-only worker agent a question without spawning a subprocess.",
  parameters: Type.Object({
    role: Type.String({ description: "Canonical agent role under agents/<role>/agent.md." }),
    task: Type.String({ description: "One bounded request for the selected canonical agent." }),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1_000, maximum: maximumTimeoutMs })),
    taskName: Type.Optional(Type.String({ maxLength: 128 })),
  }),
  async execute(_toolCallId, params, signal, _onUpdate, ctx) {
    const parentContext = nestedContextFor(ctx);
    // Delegation identity is host-owned. Model arguments cannot rewrite the
    // trace namespace or detach a child from its inherited logical run.
    const identity = newNestedDelegationContext(parentContext);
    const { callId, relationshipId, traceId, runId } = identity;
    const depth = identity.depth;
    const spanId = newId();
    const started = Date.now();
    const cwd = ctx.cwd;
    if (depth > maximumNestedDepth) throw new Error("worker call rejected: nested delegation depth limit reached");
    if (parentContext && parentContext.childCount >= maximumNestedChildren) throw new Error("worker call rejected: nested child limit reached");
    if (parentContext) parentContext.childCount += 1;
    const requestedTimeoutMs = params.timeoutMs ?? defaultTimeoutMs;
    const remainingMs = taskWallClockRemaining(cwd);
    const timeoutMs = remainingMs === undefined
      ? Math.min(requestedTimeoutMs, maximumTimeoutMs)
      : boundedLimit(requestedTimeoutMs, remainingMs, maximumTimeoutMs);
    if (timeoutMs < 1_000) throw new Error("worker call rejected: task wall-clock budget is exhausted or below the minimum call timeout");
    const roleName = params.role;
    const config = projectAgentConfig(cwd);
    const sessionName = sessionNameFromTaskName(params.taskName ?? process.env.AS_IS_TASK_NAME).name;
    const sessionReference = currentSessionReference(ctx);
    const callObservations = nestedObservations(parentContext, callId, relationshipId, roleName, sessionName, sessionReference, "admission", depth);

    await recordTrace({
      name: "call_subagent",
      timestamp: new Date().toISOString(),
      traceId,
      spanId,
      sessionReference,
      observations: [availableObservation("runId", runId), ...callObservations],
      attributes: {
        "as_is.run_id": runId,
        "as_is.role": roleName,
        "as_is.call_id": callId,
        "as_is.task_digest": hash(params.task),
      },
    }, cwd);

    const controller = new AbortController();
    const abortFromParent = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abortFromParent, { once: true });

    let target: Awaited<ReturnType<typeof resolveCanonicalTarget>>;
    let worker;
    let workerSessionReference: SessionReference | undefined;
    let workerMetadata: WorkerSessionMetadata = { sessionId: null, sessionName: null };
    let workerManager: ReturnType<typeof SessionManager.create> | undefined;
    try {
      target = await resolveCanonicalTarget(cwd, roleName);
      const profile = toolsForTarget(roleName, target.tools);
      workerManager = SessionManager.create(cwd, sessionDirectoryFor(cwd, config));
      const result = await createAgentSession({
        cwd,
        ...workerSessionOptions(ctx, cwd, target.model, target.thinking, roleName),
        resourceLoader: createWorkerLoader(target.body),
        tools: profile.tools,
        sessionManager: workerManager,
        customTools: profile.customTools,
      });
      worker = result.session;
      worker.setSessionName(sessionName);
      workerMetadata = workerSessionMetadata(worker);
      workerSessionReference = serializeSessionReference({ sessionId: workerMetadata.sessionId });
      nestedDelegationContexts.set(workerManager, { traceId, callId, runId, relationshipId, depth, childCount: 0 });

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
        sessionReference: workerSessionReference,
        durationMs: Date.now() - started,
        observations: [availableObservation("runId", runId), ...nestedObservations(parentContext, callId, relationshipId, roleName, workerMetadata.sessionName, workerSessionReference, "result", depth), availableObservation("outcome", "success"), availableObservation("budgetWallClockMs", timeoutMs, "task", "milliseconds")],
        attributes: {
          "as_is.role": roleName,
          "as_is.call_id": callId,
          "as_is.outcome": "success",
          "as_is.result_digest": hash(report),
        },
      }, cwd);
      return {
        content: [{ type: "text", text: report }],
        details: { callId, traceId, durationMs: Date.now() - started, sessionId: workerMetadata.sessionId, sessionName: workerMetadata.sessionName },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordTrace({
        name: "worker.result",
        timestamp: new Date().toISOString(),
        traceId,
        spanId: newId(),
        parentSpanId: spanId,
        sessionReference: workerSessionReference ?? sessionReference,
        durationMs: Date.now() - started,
        observations: [availableObservation("runId", runId), ...nestedObservations(parentContext, callId, relationshipId, roleName, workerMetadata.sessionName, workerSessionReference ?? sessionReference, "result", depth), availableObservation("outcome", "failure"), availableObservation("budgetWallClockMs", timeoutMs, "task", "milliseconds"), availableObservation("errorClass", errorClass(error))],
        attributes: {
          "as_is.role": roleName,
          "as_is.call_id": callId,
          "as_is.outcome": "failure",
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

export const agentTools = [resolveLinkedContextTool, callSubagent, sessionAnalysisTool, ...createFocusedTraceQueryTools()];
