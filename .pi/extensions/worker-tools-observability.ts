import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SessionManager,
  type SessionEntry,
  type ToolDefinition,
} from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../skills/spawning-pi-subagents/node_modules/typebox";

const maxResultCharacters = 100_000;

type TraceEvent = {
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  attributes: Record<string, string | number | boolean | undefined>;
  sessionReference?: unknown;
};

type SessionStoreScope = { cwd: string; sessionDir?: string };
type SessionReader = Pick<SessionManager, "getSessionId" | "getCwd" | "getSessionDir" | "getSessionFile" | "getEntries" | "getHeader">;
type SessionDetail = "summary" | "entries" | "messages" | "full";

function boundedJson(value: unknown): string {
  return JSON.stringify(value, null, 2).slice(0, maxResultCharacters);
}

export async function readTraceEvents(cwd: string): Promise<TraceEvent[]> {
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

function inheritedSessionStoreScope(): SessionStoreScope | undefined {
  const sourceCwd = process.env.AS_IS_SESSION_CWD;
  const sessionDir = process.env.AS_IS_SESSION_DIR;
  if (typeof sourceCwd !== "string" || sourceCwd.length === 0) return undefined;
  return { cwd: sourceCwd, sessionDir: typeof sessionDir === "string" && sessionDir.length > 0 ? sessionDir : undefined };
}

function validSessionId(sessionId: string): boolean {
  return typeof sessionId === "string" && sessionId.length <= 128 && !(/[\\/\u0000]/u).test(sessionId) && !/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(sessionId);
}

function analyzeSessionManager(manager: SessionReader, sessionId: string, limit: number, detail: SessionDetail, offset: number, role?: string, toolName?: string): Record<string, unknown> {
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
      const messageRole = typeof message.role === "string" ? message.role : "unknown";
      roles[messageRole] = (roles[messageRole] ?? 0) + 1;
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
  const selected = entries.filter((entry: SessionEntry) => {
    if (detail === "messages" && entry.type !== "message") return false;
    if (role && (entry.type !== "message" || entry.message.role !== role)) return false;
    if (toolName && (entry.type !== "message" || entry.message.role !== "toolResult" || entry.message.toolName !== toolName)) return false;
    return true;
  }).slice(offset, offset + limit);
  const sample = entries.slice(-Math.min(limit, 50)).map((entry: SessionEntry) => {
    const message = entry.type === "message" ? entry.message as Record<string, unknown> : undefined;
    return { type: entry.type, timestamp: entry.timestamp, role: typeof message?.role === "string" ? message.role : undefined, toolName: typeof message?.toolName === "string" ? message.toolName : undefined, outcome: typeof message?.stopReason === "string" ? message.stopReason : undefined };
  });
  const header = manager.getHeader();
  const messageCount = entries.filter((entry) => entry.type === "message").length;
  const timestamps = entries.map((entry) => entry.timestamp).filter((timestamp): timestamp is string => typeof timestamp === "string");
  return { sessionId, availability: "available", sessionFile: manager.getSessionFile(), sessionDir: manager.getSessionDir(), cwd: manager.getCwd(), entryCount: entries.length, messageCount, created: header?.timestamp, modified: timestamps.at(-1), roles, outcomes, toolNames: [...toolNames].sort(), models: [...models].sort(), usage, sample, detail, offset, ...(detail !== "summary" ? { entries: selected } : {}) };
}

export async function analyzeProjectSession(cwd: string, sessionId: string, limit = 20, currentManager?: SessionReader, inheritedScope?: SessionStoreScope, detail: SessionDetail = "summary", offset = 0, role?: string, toolName?: string): Promise<Record<string, unknown>> {
  if (!validSessionId(sessionId)) return { sessionId, availability: "invalid-selector" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return { sessionId, availability: "invalid-limit" };
  if (!Number.isInteger(offset) || offset < 0) return { sessionId, availability: "invalid-offset" };
  if (!["summary", "entries", "messages", "full"].includes(detail)) return { sessionId, availability: "invalid-detail" };
  if (currentManager?.getSessionId() === sessionId) return analyzeSessionManager(currentManager, sessionId, limit, detail, offset, role, toolName);
  try {
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
    // Do not search the user's unrelated session stores. An exact ID is not
    // itself authorization to inspect a session outside the explicit scopes
    // supplied by the current host or launcher.
    return { sessionId, availability: "missing-or-out-of-scope" };
  } catch {
    return { sessionId, availability: "inaccessible" };
  }
}

export function createSessionAnalysisTool(sourceManager?: SessionReader): ToolDefinition {
  return {
    name: "analyze_session",
    label: "Analyze project session",
    description: "Inspect one exact readable local Pi session using summary, entries, messages, or full detail with paging and role/tool filters.",
    parameters: Type.Object({ sessionId: Type.String({ minLength: 1, maxLength: 128 }), detail: Type.Optional(Type.Union([Type.Literal("summary"), Type.Literal("entries"), Type.Literal("messages"), Type.Literal("full")])), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000 })), offset: Type.Optional(Type.Integer({ minimum: 0 })), role: Type.Optional(Type.String({ maxLength: 32 })), toolName: Type.Optional(Type.String({ maxLength: 128 })) }),
    async execute(_id, params, _signal, _update, ctx) {
      const result = await analyzeProjectSession(ctx.cwd, params.sessionId, params.limit ?? 20, sourceManager ?? ctx.sessionManager, undefined, params.detail ?? "summary", params.offset ?? 0, params.role, params.toolName);
      return { content: [{ type: "text", text: boundedJson(result) }], details: { availability: result.availability } };
    },
  };
}

export function createTraceQueryTools(): ToolDefinition[] {
  return [
    { name: "search_traces", label: "Search local traces", description: "Search bounded, redacted local trace events by name or trace ID.", parameters: Type.Object({ name: Type.Optional(Type.String()), traceId: Type.Optional(Type.String()), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })) }), async execute(_id, params, _signal, _update, ctx) { const events = (await readTraceEvents(ctx.cwd)).filter((event) => (!params.name || event.name.includes(params.name)) && (!params.traceId || event.traceId === params.traceId)).slice(-(params.limit ?? 20)); return { content: [{ type: "text", text: boundedJson(events) }], details: { count: events.length } }; } },
    { name: "get_trace", label: "Get local trace", description: "Get redacted events for one local trace ID.", parameters: Type.Object({ traceId: Type.String(), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })) }), async execute(_id, params, _signal, _update, ctx) { const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId).slice(-(params.limit ?? 100)); return { content: [{ type: "text", text: boundedJson(events) }], details: { count: events.length } }; } },
    { name: "summarize_trace", label: "Summarize local trace", description: "Summarize event names, outcomes, and durations for one local trace.", parameters: Type.Object({ traceId: Type.String() }), async execute(_id, params, _signal, _update, ctx) { const events = (await readTraceEvents(ctx.cwd)).filter((event) => event.traceId === params.traceId); const outcomes: Record<string, number> = {}; for (const event of events) { const outcome = String(event.attributes?.["as_is.outcome"] ?? "unspecified"); outcomes[outcome] = (outcomes[outcome] ?? 0) + 1; } return { content: [{ type: "text", text: boundedJson({ traceId: params.traceId, eventCount: events.length, names: [...new Set(events.map((event) => event.name))], outcomes }) }], details: { eventCount: events.length } }; } },
    { name: "compare_traces", label: "Compare local traces", description: "Compare bounded event counts and outcomes for two local traces.", parameters: Type.Object({ leftTraceId: Type.String(), rightTraceId: Type.String() }), async execute(_id, params, _signal, _update, ctx) { const events = await readTraceEvents(ctx.cwd); const summarize = (traceId: string) => { const selected = events.filter((event) => event.traceId === traceId); return { traceId, eventCount: selected.length, names: [...new Set(selected.map((event) => event.name))] }; }; return { content: [{ type: "text", text: boundedJson({ left: summarize(params.leftTraceId), right: summarize(params.rightTraceId) }) }], details: {} }; } },
  ];
}
