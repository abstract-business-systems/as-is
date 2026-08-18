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

type TraceObservation = {
  kind: string;
  source?: string;
  availability?: string;
  value?: string | number;
  unit?: string;
  reason?: string;
};

type TraceEvent = {
  schemaVersion?: number;
  name: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  durationMs?: number;
  attributes: Record<string, unknown>;
  observations?: TraceObservation[];
  sessionReference?: unknown;
};

export type TraceQueryFilters = {
  name?: string;
  traceId?: string;
  sessionName?: string;
  localSessionId?: string;
  callId?: string;
  workerRole?: string;
  taskRevision?: number;
  attempt?: number;
  outcome?: string;
  phase?: string;
  from?: string;
  to?: string;
};

type TraceEvidence = { events: TraceEvent[]; malformedLines: number; availability: "available" | "missing" | "inaccessible" };

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

export async function readTraceEvidence(cwd: string): Promise<TraceEvidence> {
  const filePath = join(cwd, ".as-is", "tracing.jsonl");
  const events: TraceEvent[] = [];
  let malformedLines = 0;
  try {
    const lines = (await readFile(filePath, "utf8")).split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line) as Partial<TraceEvent>;
        if (!event || typeof event.name !== "string" || typeof event.timestamp !== "string" || typeof event.traceId !== "string" || typeof event.spanId !== "string") {
          malformedLines += 1;
          continue;
        }
        events.push({
          ...(event.schemaVersion === 1 ? { schemaVersion: 1 } : {}),
          name: event.name,
          timestamp: event.timestamp,
          traceId: event.traceId,
          spanId: event.spanId,
          ...(typeof event.parentSpanId === "string" ? { parentSpanId: event.parentSpanId } : {}),
          ...(typeof event.durationMs === "number" && Number.isFinite(event.durationMs) ? { durationMs: event.durationMs } : {}),
          attributes: event.attributes && typeof event.attributes === "object" && !Array.isArray(event.attributes) ? event.attributes as Record<string, unknown> : {},
          ...(Array.isArray(event.observations) ? { observations: event.observations.filter((observation): observation is TraceObservation => Boolean(observation) && typeof observation === "object" && typeof observation.kind === "string").slice(0, 64) } : {}),
          ...(event.sessionReference !== undefined ? { sessionReference: event.sessionReference } : {}),
        });
      } catch {
        malformedLines += 1;
      }
    }
    return { events: events.sort((left, right) => left.timestamp.localeCompare(right.timestamp)), malformedLines, availability: "available" };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code) : "";
    return { events: [], malformedLines: 0, availability: code === "ENOENT" ? "missing" : "inaccessible" };
  }
}

export async function readTraceEvents(cwd: string): Promise<TraceEvent[]> {
  return (await readTraceEvidence(cwd)).events;
}

const queryValue = (event: TraceEvent, kind: string): string | number | undefined => event.observations?.find((observation) => observation.kind === kind && observation.availability !== "malformed")?.value;
const queryAttribute = (event: TraceEvent, ...keys: string[]): string | number | undefined => {
  for (const key of keys) {
    const value = event.attributes[key];
    if (typeof value === "string" || (typeof value === "number" && Number.isFinite(value))) return value;
  }
  return undefined;
};
const eventSessionId = (event: TraceEvent): string | undefined => {
  const reference = event.sessionReference;
  return reference && typeof reference === "object" && !Array.isArray(reference) && typeof (reference as Record<string, unknown>).sessionId === "string"
    ? (reference as Record<string, string>).sessionId
    : typeof queryValue(event, "localSessionId") === "string" ? queryValue(event, "localSessionId") as string : undefined;
};
const eventField = (event: TraceEvent, field: keyof TraceQueryFilters): string | number | undefined => {
  if (field === "sessionName") return queryValue(event, "sessionName");
  if (field === "localSessionId") return eventSessionId(event);
  if (field === "callId") return queryValue(event, "callId");
  if (field === "workerRole") return queryValue(event, "workerRole") ?? queryAttribute(event, "workerRole", "as_is.role");
  if (field === "taskRevision") return queryValue(event, "taskRevision") ?? queryAttribute(event, "as_is.task_revision");
  if (field === "attempt") return queryValue(event, "attempt");
  if (field === "outcome") return queryValue(event, "outcome") ?? queryAttribute(event, "outcome", "outcomeClass", "as_is.outcome");
  if (field === "phase") return queryValue(event, "phase") ?? queryAttribute(event, "phase");
  return undefined;
};

function validQueryTime(value: unknown): value is string {
  return typeof value === "string" && value.length <= 32 && !Number.isNaN(Date.parse(value));
}

function validQueryFilters(filters: TraceQueryFilters): boolean {
  if (filters.from !== undefined && !validQueryTime(filters.from)) return false;
  if (filters.to !== undefined && !validQueryTime(filters.to)) return false;
  if (filters.from && filters.to && Date.parse(filters.from) > Date.parse(filters.to)) return false;
  if (filters.taskRevision !== undefined && (!Number.isSafeInteger(filters.taskRevision) || filters.taskRevision < 0)) return false;
  if (filters.attempt !== undefined && (!Number.isSafeInteger(filters.attempt) || filters.attempt < 0)) return false;
  return Object.entries(filters).every(([key, value]) => value === undefined || ["name", "traceId", "sessionName", "localSessionId", "callId", "workerRole", "outcome", "phase", "from", "to", "limit"].includes(key) || key === "taskRevision" || key === "attempt");
}

function matchesTraceEvent(event: TraceEvent, filters: TraceQueryFilters): boolean {
  if (filters.name !== undefined && !event.name.includes(filters.name)) return false;
  if (filters.traceId !== undefined && event.traceId !== filters.traceId) return false;
  for (const field of ["sessionName", "localSessionId", "callId", "workerRole", "outcome", "phase"] as const) {
    if (filters[field] !== undefined && eventField(event, field) !== filters[field]) return false;
  }
  for (const field of ["taskRevision", "attempt"] as const) {
    if (filters[field] !== undefined && eventField(event, field) !== filters[field]) return false;
  }
  const timestamp = Date.parse(event.timestamp);
  if (filters.from && (Number.isNaN(timestamp) || timestamp < Date.parse(filters.from))) return false;
  if (filters.to && (Number.isNaN(timestamp) || timestamp > Date.parse(filters.to))) return false;
  return true;
}

export function filterTraceEvents(events: TraceEvent[], filters: TraceQueryFilters, limit = 100): { availability: string; events: TraceEvent[] } {
  if (!validQueryFilters(filters) || !Number.isInteger(limit) || limit < 1 || limit > 1000) return { availability: "invalid-selector", events: [] };
  return { availability: "available", events: events.filter((event) => matchesTraceEvent(event, filters)).slice(-limit) };
}

export function summarizeTraceCorrelation(events: TraceEvent[], malformedLines = 0, availability?: TraceEvidence["availability"]): Record<string, unknown> {
  const calls = events.map((event) => ({ callId: queryValue(event, "callId"), parentCallId: queryValue(event, "parentCallId"), parentSpanId: event.parentSpanId, relationshipId: queryValue(event, "relationshipId"), traceId: event.traceId })).filter((call) => call.callId || call.parentCallId || call.parentSpanId || call.relationshipId);
  const relationships = calls.map((call) => {
    const child = call.callId ?? call.traceId;
    const parent = call.parentCallId ?? call.parentSpanId;
    return parent ? { parent, child, ...(call.relationshipId !== undefined ? { relationshipId: call.relationshipId } : {}), availability: "available" } : { child, availability: "unavailable", reason: "parent-not-observed" };
  }).slice(0, 256);
  const attempts = [...new Set(events.map((event) => eventField(event, "attempt")).filter((value): value is number => typeof value === "number"))].sort((left, right) => left - right);
  const retries = new Map<string, { sessionName?: string | number; taskRevision?: string | number; attempts: number[]; traceIds: string[] }>();
  for (const event of events) {
    const sessionName = eventField(event, "sessionName");
    const taskRevision = eventField(event, "taskRevision");
    const attempt = eventField(event, "attempt");
    if (typeof attempt !== "number") continue;
    const key = `${String(sessionName ?? "unavailable")}\u0000${String(taskRevision ?? "unavailable")}`;
    const group = retries.get(key) ?? { sessionName, taskRevision, attempts: [], traceIds: [] };
    if (!group.attempts.includes(attempt)) group.attempts.push(attempt);
    if (!group.traceIds.includes(event.traceId)) group.traceIds.push(event.traceId);
    retries.set(key, group);
  }
  return { availability: availability && availability !== "available" ? availability : events.length > 0 ? "available" : malformedLines > 0 ? "malformed" : "unavailable", eventCount: events.length, malformedLines, traceIds: [...new Set(events.map((event) => event.traceId))], calls, relationships, attempts, retries: [...retries.values()].filter((group) => group.attempts.length > 1) };
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

const traceQueryParameters = Type.Object({
  name: Type.Optional(Type.String({ maxLength: 128 })),
  traceId: Type.Optional(Type.String({ maxLength: 128 })),
  sessionName: Type.Optional(Type.String({ maxLength: 128 })),
  localSessionId: Type.Optional(Type.String({ maxLength: 128 })),
  callId: Type.Optional(Type.String({ maxLength: 128 })),
  workerRole: Type.Optional(Type.String({ maxLength: 64 })),
  taskRevision: Type.Optional(Type.Integer({ minimum: 0, maximum: 2_147_483_647 })),
  attempt: Type.Optional(Type.Integer({ minimum: 0, maximum: 2_147_483_647 })),
  outcome: Type.Optional(Type.String({ maxLength: 64 })),
  phase: Type.Optional(Type.String({ maxLength: 64 })),
  from: Type.Optional(Type.String({ maxLength: 32 })),
  to: Type.Optional(Type.String({ maxLength: 32 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
});

const privateTraceKey = /(?:secret|token|password|credential|prompt|response|tool|content|exception|error|payload)/iu;

function projectTraceQueryEvent(event: TraceEvent): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(event.attributes)) {
    if (privateTraceKey.test(key)) continue;
    const projected = projectEvidenceValue(value);
    if (projected !== undefined) attributes[key] = projected;
  }
  return {
    ...(event.schemaVersion === 1 ? { schemaVersion: 1 } : {}),
    name: event.name,
    timestamp: event.timestamp,
    traceId: event.traceId,
    spanId: event.spanId,
    ...(event.parentSpanId ? { parentSpanId: event.parentSpanId } : {}),
    ...(event.durationMs !== undefined ? { durationMs: event.durationMs } : {}),
    attributes,
    ...(event.observations ? { observations: event.observations.map((observation) => ({ kind: observation.kind, source: observation.source, availability: observation.availability, ...(observation.value !== undefined ? { value: observation.value } : {}), ...(observation.unit ? { unit: observation.unit } : {}), ...(observation.reason ? { reason: observation.reason } : {}) })) } : {}),
  };
}

function queryOutput(evidence: TraceEvidence, events: TraceEvent[], availability = evidence.availability): string {
  return boundedJson({ availability, malformedLines: evidence.malformedLines, events: events.map(projectTraceQueryEvent) });
}

export function createTraceQueryTools(): ToolDefinition[] {
  return [
    {
      name: "search_traces",
      label: "Search local traces",
      description: "Search bounded, redacted local trace events by correlation, worker, outcome, phase, or time range.",
      parameters: traceQueryParameters,
      async execute(_id, params, _signal, _update, ctx) {
        const evidence = await readTraceEvidence(ctx.cwd);
        const result = filterTraceEvents(evidence.events, params, params.limit ?? 20);
        return { content: [{ type: "text", text: queryOutput(evidence, result.events, result.availability === "invalid-selector" ? result.availability : evidence.availability) }], details: { count: result.events.length } };
      },
    },
    {
      name: "get_trace",
      label: "Get local trace",
      description: "Get bounded redacted events for one exact local trace ID, with optional correlation filters.",
      parameters: Type.Intersect([Type.Object({ traceId: Type.String({ maxLength: 128 }) }), traceQueryParameters]),
      async execute(_id, params, _signal, _update, ctx) {
        const evidence = await readTraceEvidence(ctx.cwd);
        const result = filterTraceEvents(evidence.events, params, params.limit ?? 100);
        const selected = result.events.filter((event) => event.traceId === params.traceId);
        return { content: [{ type: "text", text: queryOutput(evidence, selected, result.availability === "invalid-selector" ? result.availability : evidence.availability) }], details: { count: selected.length } };
      },
    },
    {
      name: "summarize_trace",
      label: "Summarize local trace",
      description: "Summarize bounded event names, outcomes, durations, calls, parent-child relationships, and retries for one trace.",
      parameters: Type.Object({ traceId: Type.String({ maxLength: 128 }) }),
      async execute(_id, params, _signal, _update, ctx) {
        const evidence = await readTraceEvidence(ctx.cwd);
        const events = evidence.events.filter((event) => event.traceId === params.traceId);
        const outcomes: Record<string, number> = {};
        for (const event of events) {
          const outcome = String(eventField(event, "outcome") ?? "unavailable");
          outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
        }
        return { content: [{ type: "text", text: boundedJson({ ...summarizeTraceCorrelation(events, evidence.malformedLines, evidence.availability), traceId: params.traceId, names: [...new Set(events.map((event) => event.name))], outcomes, durationsMs: events.flatMap((event) => typeof event.durationMs === "number" ? [event.durationMs] : []) }) }], details: { eventCount: events.length } };
      },
    },
    {
      name: "compare_traces",
      label: "Compare local traces",
      description: "Compare bounded event counts and correlation names for two exact local trace IDs.",
      parameters: Type.Object({ leftTraceId: Type.String({ maxLength: 128 }), rightTraceId: Type.String({ maxLength: 128 }) }),
      async execute(_id, params, _signal, _update, ctx) {
        const evidence = await readTraceEvidence(ctx.cwd);
        const summarize = (traceId: string) => summarizeTraceCorrelation(evidence.events.filter((event) => event.traceId === traceId), evidence.malformedLines, evidence.availability);
        return { content: [{ type: "text", text: boundedJson({ left: { traceId: params.leftTraceId, ...summarize(params.leftTraceId) }, right: { traceId: params.rightTraceId, ...summarize(params.rightTraceId) } }) }], details: {} };
      },
    },
  ];
}
