import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SessionManager,
  type SessionEntry,
  type ToolDefinition,
} from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../skills/spawning-pi-subagents/node_modules/typebox";
import { resolveConfigurationFromCwdSync } from "../../core/modules/context-resolution/configuration-resolver.ts";
import { resolveSessionDirectory } from "../../skills/spawning-pi-subagents/scripts/session-directory.ts";
import { sessionNameFromTaskName } from "../../skills/spawning-pi-subagents/scripts/session-naming.ts";

const maxResultCharacters = 100_000;

type TraceEvent = {
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  attributes: Record<string, unknown>;
  sessionReference?: unknown;
};

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

const maxProjectionDepth = 8;
const maxProjectionArrayLength = 256;
const maxProjectionKeys = 128;
const unsafePathKey = /^(?:path|file|directory|dir|cwd|worktree|component|record|recordPath|taskRecord|taskPath|log|logPath|traceDir|session|sessionFile|sessionDir|store|storeDir|configuredDirectory|workspace|repository|promptPath|resultPath|configPath|extensionPath)$/iu;
const unsafePathValue = /(?:^|[^A-Za-z0-9._~-])(?:[A-Za-z]:[\\/]|[\\/]|\.{1,2}[\\/]|(?:[A-Za-z0-9._~-]+[\\/])+[A-Za-z0-9._~-]+)(?=$|[^A-Za-z0-9._~-])/gu;
const unsafeUriValue = /^[A-Za-z][A-Za-z0-9+.-]*:(?:\/\/|\/)/u;
const safeOpaqueToken = /^[A-Za-z0-9][A-Za-z0-9._+~-]{0,127}$/u;
const safeSlashValues = new Set(["read/grep", "provider/model"]);

function isUnsafeEvidenceString(value: string): boolean {
  if (value.includes("\u0000") || unsafeUriValue.test(value)) return true;
  const matches = value.match(unsafePathValue) ?? [];
  return matches.some((match) => {
    const candidate = match.replace(/^[^A-Za-z0-9._~-]/u, "");
    return !safeSlashValues.has(candidate);
  });
}

function projectEvidenceValue(value: unknown, depth = 0, seen = new WeakSet<object>()): JsonValue | undefined {
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") return isUnsafeEvidenceString(value) ? undefined : value;
  if (depth >= maxProjectionDepth || typeof value !== "object") return undefined;
  if (seen.has(value)) return undefined;
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return value.slice(0, maxProjectionArrayLength).flatMap((item) => {
        const projected = projectEvidenceValue(item, depth + 1, seen);
        return projected === undefined ? [] : [projected];
      });
    }
    const projected: { [key: string]: JsonValue } = {};
    for (const [key, child] of Object.entries(value).slice(0, maxProjectionKeys)) {
      if (unsafePathKey.test(key) || isUnsafeEvidenceString(key)) continue;
      const next = projectEvidenceValue(child, depth + 1, seen);
      if (next !== undefined) projected[key] = next;
    }
    return projected;
  } finally {
    seen.delete(value);
  }
}

function projectOpaqueId(value: string): string | undefined {
  return safeOpaqueToken.test(value) ? value : undefined;
}

function projectEvidenceResult(value: unknown): Record<string, unknown> {
  const projected = projectEvidenceValue(value);
  return projected && typeof projected === "object" && !Array.isArray(projected) ? projected as Record<string, unknown> : { availability: "unavailable" };
}

function boundedJson(value: unknown): string {
  const serialized = JSON.stringify(projectEvidenceValue(value) ?? { availability: "unavailable" }, null, 2);
  if (serialized.length <= maxResultCharacters) return serialized;
  return JSON.stringify({ availability: "truncated", reason: "bounded evidence result exceeded output limit" });
}

type SessionStoreScope = { cwd: string; sessionDir?: string };
type SessionReader = Pick<SessionManager, "getSessionId" | "getSessionName" | "getCwd" | "getSessionDir" | "getEntries" | "getHeader">;
type SessionDetail = "summary" | "entries" | "messages" | "full";

export async function readTraceEvents(cwd: string): Promise<TraceEvent[]> {
  const filePath = join(cwd, ".as-is", "tracing.jsonl");
  const events: TraceEvent[] = [];
  try {
    const lines = (await readFile(filePath, "utf8")).split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line) as Partial<TraceEvent>;
        if (event && typeof event.name === "string" && typeof event.timestamp === "string" && typeof event.traceId === "string" && typeof event.spanId === "string") events.push({
          name: event.name,
          timestamp: event.timestamp,
          traceId: event.traceId,
          spanId: event.spanId,
          ...(typeof event.parentSpanId === "string" ? { parentSpanId: event.parentSpanId } : {}),
          attributes: event.attributes && typeof event.attributes === "object" && !Array.isArray(event.attributes) ? event.attributes as Record<string, unknown> : {},
          ...(event.sessionReference !== undefined ? { sessionReference: event.sessionReference } : {}),
        });
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

function configuredSessionStoreScope(cwd: string): SessionStoreScope | undefined {
  try {
    const resolution = resolveConfigurationFromCwdSync(cwd);
    if (!resolution.complete) return undefined;
    const agents = resolution.configuration.agents;
    if (!agents || typeof agents !== "object" || Array.isArray(agents)) return undefined;
    const configured = (agents as Record<string, unknown>).sessionDirectory;
    if (typeof configured !== "string") return undefined;
    return { cwd, sessionDir: resolveSessionDirectory(configured, cwd, resolution.root ?? cwd) };
  } catch {
    return undefined;
  }
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
  const sessionName = manager.getSessionName();
  const safeSessionName = typeof sessionName === "string" ? sessionNameFromTaskName(sessionName).name : undefined;
  const messageCount = entries.filter((entry) => entry.type === "message").length;
  const timestamps = entries.map((entry) => entry.timestamp).filter((timestamp): timestamp is string => typeof timestamp === "string");
  const projected = projectEvidenceResult({ sessionId: projectOpaqueId(sessionId), ...(safeSessionName ? { sessionName: safeSessionName } : {}), availability: "available", entryCount: entries.length, messageCount, created: header?.timestamp, modified: timestamps.at(-1), roles, outcomes, toolNames: [...toolNames].sort(), models: [...models].sort(), usage, sample, detail, offset, ...(detail !== "summary" ? { entries: selected } : {}) });
  if (!projected.sessionId) delete projected.sessionId;
  return projected;
}

export async function analyzeProjectSession(cwd: string, sessionId: string, limit = 20, currentManager?: SessionReader, inheritedScope?: SessionStoreScope, detail: SessionDetail = "summary", offset = 0, role?: string, toolName?: string): Promise<Record<string, unknown>> {
  const safeSessionId = projectOpaqueId(sessionId);
  const selector = safeSessionId ? { sessionId: safeSessionId } : {};
  if (!validSessionId(sessionId)) return { ...selector, availability: "invalid-selector" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return { ...selector, availability: "invalid-limit" };
  if (!Number.isInteger(offset) || offset < 0) return { ...selector, availability: "invalid-offset" };
  if (!["summary", "entries", "messages", "full"].includes(detail)) return { ...selector, availability: "invalid-detail" };
  if (currentManager?.getSessionId() === sessionId) return analyzeSessionManager(currentManager, sessionId, limit, detail, offset, role, toolName);
  try {
    const inherited = inheritedScope ?? inheritedSessionStoreScope();
    const scopes: SessionStoreScope[] = [];
    if (currentManager) scopes.push({ cwd: currentManager.getCwd(), sessionDir: currentManager.getSessionDir() });
    if (inherited) scopes.push(inherited);
    const configured = configuredSessionStoreScope(cwd);
    if (configured) scopes.push(configured);
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
    return { ...selector, availability: "missing-or-out-of-scope" };
  } catch {
    return { ...selector, availability: "inaccessible" };
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
