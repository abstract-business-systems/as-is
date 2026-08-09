import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  createAgentSession,
  createExtensionRuntime,
  SessionManager,
  type ResourceLoader,
  type ToolDefinition,
  type ExtensionAPI,
} from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../skills/spawning-pi-subagents/node_modules/typebox";
import { boundedLimit } from "../../components/budget-control/budget.ts";
import { readAsIsJson } from "../../components/as-is-data/resolver.ts";
import { resolveLocalLinkedContext } from "../../components/linked-context/resolver.ts";
import {
  emitTrace,
  serializeSessionReference,
  type SessionReference,
} from "../../components/observability/tracer.ts";

const maxResultCharacters = 100_000;
const canonicalRoleName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const defaultReadOnlyTools = ["read", "grep", "find", "ls"];
const supportedTargetTools = new Set([
  "read", "write", "edit", "bash", "grep", "find", "ls", "webfetch", "websearch", "resolve_component_context",
  "call_subagent", "git_inspect", "search_traces", "get_trace", "summarize_trace",
  "compare_traces", "analyze_session",
]);
const builtinTools = new Set(["read", "write", "edit", "bash", "grep", "find", "ls", "webfetch", "websearch"]);
const defaultTimeoutMs = 60_000;
const maximumTimeoutMs = 900_000;

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

async function readTraceEvents(cwd: string): Promise<TraceEvent[]> {
  const filePath = join(cwd, ".as-is", "tracing.jsonl");
  const events: TraceEvent[] = [];
  try {
    const lines = (await readFile(filePath, "utf8")).split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
        try {
          const event = JSON.parse(line) as TraceEvent;
          if (event && typeof event.name === "string") events.push(event);
        } catch {
          // Ignore incomplete or malformed best-effort trace lines.
        }
    }
  } catch {
    // A missing optional trace file is an empty result.
  }
  return events.sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

function boundedJson(value: unknown): string {
  return JSON.stringify(value, null, 2).slice(0, maxResultCharacters);
}

function numericUsage(value: unknown): { input: number; output: number; totalTokens: number; totalCost: number } {
  if (!value || typeof value !== "object") return { input: 0, output: 0, totalTokens: 0, totalCost: 0 };
  const usage = value as Record<string, unknown>;
  const cost = usage.cost && typeof usage.cost === "object" ? usage.cost as Record<string, unknown> : {};
  const number = (candidate: unknown): number => typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0 ? candidate : 0;
  return {
    input: number(usage.input),
    output: number(usage.output),
    totalTokens: number(usage.totalTokens),
    totalCost: number(cost.total),
  };
}

function validSessionId(sessionId: string): boolean {
  return typeof sessionId === "string" && sessionId.length <= 128 && !(/[\\/\u0000]/u).test(sessionId) && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(sessionId);
}

type SessionStoreScope = { cwd: string; sessionDir?: string };
type SessionReader = Pick<SessionManager, "getSessionId" | "getCwd" | "getSessionDir" | "getSessionFile" | "getEntries" | "getHeader">;
type SessionDetail = "summary" | "entries" | "messages" | "full";

function inheritedSessionStoreScope(): SessionStoreScope | undefined {
  const sourceCwd = process.env.AS_IS_SESSION_CWD;
  const sessionDir = process.env.AS_IS_SESSION_DIR;
  if (typeof sourceCwd !== "string" || sourceCwd.length === 0) return undefined;
  return {
    cwd: sourceCwd,
    sessionDir: typeof sessionDir === "string" && sessionDir.length > 0 ? sessionDir : undefined,
  };
}

async function analyzeSessionManager(manager: SessionReader, sessionId: string, limit: number, detail: SessionDetail = "summary", offset = 0, role?: string, toolName?: string): Promise<Record<string, unknown>> {
  const entries = manager.getEntries();
  const roles: Record<string, number> = {};
  const outcomes: Record<string, number> = {};
  const toolNames = new Set<string>();
  const models = new Set<string>();
  const usage = { input: 0, output: 0, totalTokens: 0, totalCost: 0 };
  const observeUsage = (value: unknown) => {
    const measured = numericUsage(value);
    usage.input += measured.input;
    usage.output += measured.output;
    usage.totalTokens += measured.totalTokens;
    usage.totalCost += measured.totalCost;
  };
  for (const entry of entries) {
    if (entry.type === "message") {
      const message = entry.message as Record<string, unknown>;
      const role = typeof message.role === "string" ? message.role : "unknown";
      roles[role] = (roles[role] ?? 0) + 1;
      if (typeof message.provider === "string" && typeof message.model === "string") models.add(`${message.provider}/${message.model}`);
      if (typeof message.toolName === "string") toolNames.add(message.toolName);
      if (message.role === "assistant") {
        const stopReason = typeof message.stopReason === "string" ? message.stopReason : "unspecified";
        outcomes[stopReason] = (outcomes[stopReason] ?? 0) + 1;
      }
      observeUsage(message.usage);
    } else if (entry.type === "model_change") {
      if (typeof entry.provider === "string" && typeof entry.modelId === "string") models.add(`${entry.provider}/${entry.modelId}`);
    }
    if (entry.type === "compaction" || entry.type === "branch_summary") observeUsage(entry.usage);
  }
  const selected = entries.filter((entry) => {
    if (detail === "messages" && entry.type !== "message") return false;
    if (role && (entry.type !== "message" || entry.message.role !== role)) return false;
    if (toolName && (entry.type !== "message" || entry.message.role !== "toolResult" || entry.message.toolName !== toolName)) return false;
    return true;
  }).slice(offset, offset + limit);
  const sample = entries.slice(-Math.min(limit, 50)).map((entry) => {
    const message = entry.type === "message" ? entry.message as Record<string, unknown> : undefined;
    return {
      type: entry.type,
      timestamp: entry.timestamp,
      role: typeof message?.role === "string" ? message.role : undefined,
      toolName: typeof message?.toolName === "string" ? message.toolName : undefined,
      outcome: typeof message?.stopReason === "string" ? message.stopReason : undefined,
    };
  });
  const header = manager.getHeader();
  const messageCount = entries.filter((entry) => entry.type === "message").length;
  const timestamps = entries.map((entry) => entry.timestamp).filter((timestamp): timestamp is string => typeof timestamp === "string");
  return {
    sessionId,
    availability: "available",
    sessionFile: manager.getSessionFile(),
    sessionDir: manager.getSessionDir(),
    cwd: manager.getCwd(),
    entryCount: entries.length,
    messageCount,
    created: header?.timestamp,
    modified: timestamps.at(-1),
    roles,
    outcomes,
    toolNames: [...toolNames].sort(),
    models: [...models].sort(),
    usage,
    sample,
    detail,
    offset,
    ...(detail !== "summary" ? { entries: selected } : {}),
  };
}

export async function analyzeProjectSession(cwd: string, sessionId: string, limit = 20, currentManager?: SessionReader, inheritedScope?: SessionStoreScope, detail: SessionDetail = "summary", offset = 0, role?: string, toolName?: string): Promise<Record<string, unknown>> {
  if (!validSessionId(sessionId)) return { sessionId, availability: "invalid-selector" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return { sessionId, availability: "invalid-limit" };
  if (!Number.isInteger(offset) || offset < 0) return { sessionId, availability: "invalid-offset" };
  if (!["summary", "entries", "messages", "full"].includes(detail)) return { sessionId, availability: "invalid-detail" };
  if (currentManager?.getSessionId() === sessionId) return analyzeSessionManager(currentManager, sessionId, limit, detail, offset, role, toolName);
  try {
    // A delegated child has its own current session and usually runs in an
    // isolated worktree. The launcher forwards the parent's readable session
    // store scope explicitly; do not mistake the child's session directory or
    // cwd for the parent's project-local store.
    const inherited = inheritedScope ?? inheritedSessionStoreScope();
    const scopes: SessionStoreScope[] = [];
    if (currentManager) scopes.push({ cwd: currentManager.getCwd(), sessionDir: currentManager.getSessionDir() });
    if (inherited) scopes.push(inherited);
    scopes.push({ cwd });
    const seenScopes = new Set<string>();
    for (const scope of scopes) {
      const key = `${scope.cwd}\u0000${scope.sessionDir ?? ""}`;
      if (seenScopes.has(key)) continue;
      seenScopes.add(key);
      const sessions = await SessionManager.list(scope.cwd, scope.sessionDir);
      const info = sessions.find((candidate) => candidate.id === sessionId);
      if (info) return analyzeSessionManager(SessionManager.open(info.path), sessionId, limit, detail, offset, role, toolName);
    }
    // The trace carries only the opaque ID. For local debugging, resolve it
    // across the effective user's default Pi session stores as a final exact-ID
    // lookup rather than requiring a tracer-owned approval or locator index.
    const allSessions = await SessionManager.listAll();
    const info = allSessions.find((candidate) => candidate.id === sessionId);
    if (info) return analyzeSessionManager(SessionManager.open(info.path), sessionId, limit, detail, offset, role, toolName);
    return { sessionId, availability: "missing-or-out-of-scope" };
  } catch {
    return { sessionId, availability: "inaccessible" };
  }
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

function createSessionAnalysisTool(sourceManager?: SessionReader): ToolDefinition {
  return {
    name: "analyze_session",
    label: "Analyze project session",
    description: "Inspect one exact readable local Pi session using summary, entries, messages, or full detail with paging and role/tool filters.",
    parameters: Type.Object({
      sessionId: Type.String({ minLength: 1, maxLength: 128 }),
      detail: Type.Optional(Type.Union([
        Type.Literal("summary"), Type.Literal("entries"), Type.Literal("messages"), Type.Literal("full"),
      ])),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000 })),
      offset: Type.Optional(Type.Integer({ minimum: 0 })),
      role: Type.Optional(Type.String({ maxLength: 32 })),
      toolName: Type.Optional(Type.String({ maxLength: 128 })),
    }),
    async execute(_id, params, _signal, _update, ctx) {
      const result = await analyzeProjectSession(
        ctx.cwd,
        params.sessionId,
        params.limit ?? 20,
        sourceManager ?? ctx.sessionManager,
        undefined,
        params.detail ?? "summary",
        params.offset ?? 0,
        params.role,
        params.toolName,
      );
      return { content: [{ type: "text", text: boundedJson(result) }], details: { availability: result.availability } };
    },
  };
}

const sessionAnalysisTool = createSessionAnalysisTool();

const traceQueryTools: ToolDefinition[] = [
  {
    name: "search_traces",
    label: "Search local traces",
    description: "Search bounded, redacted local trace events by name or trace ID.",
    parameters: Type.Object({
      name: Type.Optional(Type.String()),
      traceId: Type.Optional(Type.String()),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = await readTraceEvents(ctx.cwd);
      const matches = events.filter((event) =>
        (!params.name || event.name.includes(params.name)) &&
        (!params.traceId || event.traceId === params.traceId),
      ).slice(-(params.limit ?? 20));
      return { content: [{ type: "text", text: boundedJson(matches) }], details: { count: matches.length } };
    },
  },
  {
    name: "get_trace",
    label: "Get local trace",
    description: "Get redacted events for one local trace ID.",
    parameters: Type.Object({ traceId: Type.String(), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })) }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId).slice(-(params.limit ?? 100));
      return { content: [{ type: "text", text: boundedJson(events) }], details: { count: events.length } };
    },
  },
  {
    name: "summarize_trace",
    label: "Summarize local trace",
    description: "Summarize event names, outcomes, and durations for one local trace.",
    parameters: Type.Object({ traceId: Type.String() }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId);
      const outcomes: Record<string, number> = {};
      for (const event of events) {
        const outcome = String(event.attributes?.["as_is.outcome"] ?? "unspecified");
        outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
      }
      return { content: [{ type: "text", text: boundedJson({ traceId: params.traceId, eventCount: events.length, names: [...new Set(events.map((event) => event.name))], outcomes }) }], details: { eventCount: events.length } };
    },
  },
  {
    name: "compare_traces",
    label: "Compare local traces",
    description: "Compare bounded event counts and outcomes for two local traces.",
    parameters: Type.Object({ leftTraceId: Type.String(), rightTraceId: Type.String() }),
    async execute(_id, params, _signal, _update, ctx) {
      const events = await readTraceEvents(ctx.cwd);
      const summarize = (traceId: string) => {
        const selected = events.filter((event) => event.traceId === traceId);
        return { traceId, eventCount: selected.length, names: [...new Set(selected.map((event) => event.name))] };
      };
      return { content: [{ type: "text", text: boundedJson({ left: summarize(params.leftTraceId), right: summarize(params.rightTraceId) }) }], details: {} };
    },
  },
];

async function recordTrace(event: TraceEvent, cwd: string): Promise<void> {
  await emitTrace(event, cwd);
}

export function currentSessionReference(ctx: { sessionManager?: { getSessionId?: () => unknown } }): SessionReference | undefined {
  try {
    const sessionId = ctx.sessionManager?.getSessionId?.();
    if (typeof sessionId !== "string") return undefined;
    return serializeSessionReference({ sessionId });
  } catch {
    return undefined;
  }
}

type TargetDefinition = { body: string; tools: string[] };

async function resolveCanonicalTarget(cwd: string, role: string): Promise<TargetDefinition> {
  if (!canonicalRoleName.test(role)) throw new Error(`invalid canonical agent role: ${role}`);
  const agentsDirectory = join(cwd, "agents");
  const entries = await readdir(agentsDirectory, { withFileTypes: true });
  const matches = entries.filter((entry) => entry.isDirectory() && entry.name === role);
  if (matches.length !== 1) throw new Error(`canonical agent role not found: ${role}`);
  const path = join(agentsDirectory, role, "agent.md");
  const raw = await readFile(path, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`canonical agent has no front matter: ${role}`);
  const toolsLine = match[1].match(/^tools:\s*(.*)$/m)?.[1]?.trim() ?? "";
  const tools = toolsLine ? toolsLine.split(",").map((tool) => tool.trim()).filter(Boolean) : [];
  const unsupported = tools.filter((tool) => !supportedTargetTools.has(tool));
  if (unsupported.length > 0) throw new Error(`canonical agent declares unsupported tools: ${unsupported.join(", ")}`);
  return { body: raw, tools: [...new Set(tools)] };
}

function toolsForTarget(role: string, declared: string[]): { tools: string[]; customTools: ToolDefinition[] } {
  if (role === "evidence-validator") return { tools: [...defaultReadOnlyTools, "git_inspect"], customTools: [gitInspectTool] };
  const tools = declared.filter((tool) => builtinTools.has(tool));
  const customTools: ToolDefinition[] = [];
  if (declared.includes("analyze_session")) customTools.push(createSessionAnalysisTool());
  if (declared.includes("search_traces")) customTools.push(traceQueryTools[0]);
  if (declared.includes("get_trace")) customTools.push(traceQueryTools[1]);
  if (declared.includes("summarize_trace")) customTools.push(traceQueryTools[2]);
  if (declared.includes("compare_traces")) customTools.push(traceQueryTools[3]);
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
    role: Type.Optional(Type.String({ description: "Canonical agent role under agents/<role>/agent.md." })),
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
    const roleName = params.role ?? "worker";
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
        model: ctx.model,
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
  for (const tool of traceQueryTools) pi.registerTool(tool);
}
