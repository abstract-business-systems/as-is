import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  createAgentSession,
  createExtensionRuntime,
  SessionManager,
  type ResourceLoader,
  type ToolDefinition,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { ControlPlane } from "../../components/control-plane/control-plane.ts";
import {
  emitTrace,
  serializeSessionReference,
  type SessionReference,
} from "../../components/observability/tracer.ts";

const rolePaths = {
  worker: "agents/worker/agent.md",
  expert: "agents/expert/agent.md",
} as const;
const maxResultCharacters = 12_000;
const defaultTimeoutMs = 60_000;
const maximumTimeoutMs = 900_000;

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
  return sessionId.length <= 128 && !(/[\\/\u0000]/u).test(sessionId) && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(sessionId);
}

async function analyzeSessionManager(manager: SessionManager, sessionId: string, limit: number): Promise<Record<string, unknown>> {
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
  const sample = entries.slice(-limit).map((entry) => {
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
  };
}

export type SessionAnalysisAuthorization = { sessionId: string; taskPath: string; questionId: string };

export function hasDurableSessionApproval(status: unknown, authorization: SessionAnalysisAuthorization): boolean {
  if (!status || typeof status !== "object") return false;
  const tasks = (status as { tasks?: unknown }).tasks;
  if (!Array.isArray(tasks)) return false;
  const task = tasks.find((candidate): candidate is { path?: unknown; decisions?: unknown } =>
    Boolean(candidate) && typeof candidate === "object" && (candidate as { path?: unknown }).path === authorization.taskPath,
  );
  if (!task || !Array.isArray(task.decisions)) return false;
  return task.decisions.some((decision) => {
    if (!decision || typeof decision !== "object") return false;
    const value = decision as { event?: unknown; "question-id"?: unknown; approval?: unknown };
    return value.event === "approval" && value["question-id"] === authorization.questionId && value.approval === `session-metadata:${authorization.sessionId}`;
  });
}

export async function analyzeProjectSession(cwd: string, sessionId: string, limit = 20, currentManager?: SessionManager, authorization?: SessionAnalysisAuthorization): Promise<Record<string, unknown>> {
  if (!authorization || authorization.sessionId !== sessionId || !hasDurableSessionApproval(new ControlPlane(cwd).status(), authorization)) return { sessionId, availability: "authorization-required" };
  if (!validSessionId(sessionId)) return { sessionId, availability: "invalid-selector" };
  if (currentManager?.getSessionId() === sessionId) return analyzeSessionManager(currentManager, sessionId, limit);
  const sessions = await SessionManager.list(cwd);
  const info = sessions.find((candidate) => candidate.id === sessionId);
  if (!info) return { sessionId, availability: "missing-or-out-of-scope" };
  return analyzeSessionManager(SessionManager.open(info.path), sessionId, limit);
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

const sessionAnalysisTool: ToolDefinition = {
  name: "analyze_session",
  label: "Analyze project session",
  description: "Return bounded metadata and usage for one explicitly identified project-local Pi session; never returns session content.",
  parameters: Type.Object({
    sessionId: Type.String({ minLength: 1, maxLength: 128 }),
    authorization: Type.Object({
      sessionId: Type.String({ minLength: 1, maxLength: 128 }),
      taskPath: Type.String({ minLength: 1, maxLength: 256 }),
      questionId: Type.String({ minLength: 1, maxLength: 128 }),
    }),
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50 })),
  }),
  async execute(_id, params, _signal, _update, ctx) {
    const result = await analyzeProjectSession(ctx.cwd, params.sessionId, params.limit ?? 20, ctx.sessionManager, params.authorization);
    return { content: [{ type: "text", text: boundedJson(result) }], details: { availability: result.availability } };
  },
};

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

function currentSessionReference(ctx: { sessionManager?: { getSessionId?: () => unknown } }): SessionReference | undefined {
  try {
    const sessionId = ctx.sessionManager?.getSessionId?.();
    if (typeof sessionId !== "string") return undefined;
    return serializeSessionReference({
      sessionId,
      store: "project-local",
      availability: "available",
    });
  } catch {
    return undefined;
  }
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
    role: Type.Optional(Type.Union([Type.Literal("worker"), Type.Literal("expert")])),
    task: Type.String({ description: "One bounded read-only question or investigation." }),
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
    const timeoutMs = params.timeoutMs ?? defaultTimeoutMs;
    const roleName = params.role ?? "worker";
    const rolePath = join(cwd, rolePaths[roleName]);
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

    const role = await readFile(rolePath, "utf8");
    const controller = new AbortController();
    const abortFromParent = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abortFromParent, { once: true });

    let worker;
    try {
      const result = await createAgentSession({
        cwd,
        model: ctx.model,
        resourceLoader: createWorkerLoader(role),
        tools: roleName === "expert"
          ? ["read", "grep", "find", "ls", "git_inspect"]
          : ["read", "grep", "find", "ls"],
        sessionManager: SessionManager.inMemory(cwd),
        customTools: roleName === "expert" ? [gitInspectTool] : traceQueryTools,
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
  pi.registerTool(callSubagent);
  pi.registerTool(sessionAnalysisTool);
  for (const tool of traceQueryTools) pi.registerTool(tool);
}
