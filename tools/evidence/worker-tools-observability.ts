import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  SessionManager,
  type SessionEntry,
  type ToolDefinition,
} from "../../core/adapters/pi/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../core/adapters/pi/node_modules/typebox";
import { resolveConfigurationFromCwdSync } from "../../core/modules/context-resolution/configuration-resolver.ts";
import { resolveSessionDirectory } from "../../core/adapters/pi/scripts/session-directory.ts";
import { sessionNameFromTaskName } from "../../core/adapters/pi/scripts/session-naming.ts";

const maxResultCharacters = 100_000;
const maxRegistryBytes = 1_000_000;
const maxRegistryLines = 5_000;
const maxRegistryRecords = 1_000;
const maxCorrelationNodes = 512;
const maxCorrelationDepth = 32;

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
  parentCallId?: string;
  relationshipId?: string;
  runId?: string;
  parentTraceId?: string;
  workerRole?: string;
  taskRevision?: number;
  attempt?: number;
  outcome?: string;
  phase?: string;
  from?: string;
  to?: string;
};

type TraceEvidence = { events: TraceEvent[]; malformedLines: number; availability: "available" | "missing" | "inaccessible" };

type RegistryAvailability = "available" | "missing" | "malformed" | "inaccessible";

type PublicRegistryRecord = {
  event: "launched" | "finished";
  jobId: string;
  parentJobId?: string;
  traceId?: string;
  sessionName?: string;
  localSessionId?: string;
  launchedAt?: string;
  finishedAt?: string;
  outcome?: "success" | "failure" | "budget-stopped";
};

export type JobRegistryEvidence = {
  records: PublicRegistryRecord[];
  malformedLines: number;
  availability: RegistryAvailability;
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
const traceObservationKinds = new Set(["taskRevision", "attempt", "componentIdentity", "workerRole", "sessionName", "localSessionId", "jobId", "callId", "parentCallId", "relationshipId", "phase", "outcome", "wallClockMs", "usageInputTokens", "usageOutputTokens", "usageTotalTokens", "usageCostUsd", "runId", "parentTraceId", "depth", "childCount", "admission", "errorClass", "budgetWallClockMs", "budgetCostUsd"]);
const traceObservationSources = new Set(["task", "launcher", "tracer", "pi-session", "provider-adapter", "agent-tool"]);
const traceObservationAvailabilities = new Set(["available", "absent", "malformed", "unavailable"]);
const traceObservationReasons = new Set(["not-supplied", "not-observed", "invalid-value", "source-unavailable"]);
const traceNumericKinds = new Set(["taskRevision", "attempt", "wallClockMs", "usageInputTokens", "usageOutputTokens", "usageTotalTokens", "usageCostUsd", "depth", "childCount", "budgetWallClockMs", "budgetCostUsd"]);
const traceIntegerKinds = new Set(["taskRevision", "attempt", "wallClockMs", "usageInputTokens", "usageOutputTokens", "usageTotalTokens", "depth", "childCount", "budgetWallClockMs"]);
const traceExpectedUnits: Record<string, string> = { wallClockMs: "milliseconds", budgetWallClockMs: "milliseconds", usageCostUsd: "usd", budgetCostUsd: "usd" };
const traceValueDomains: Record<string, Set<string>> = {
  phase: new Set(["setup", "log", "spawn", "wait", "handoff", "task", "worker", "delegation", "admission", "result"]),
  outcome: new Set(["success", "failure", "cancelled", "blocked", "timed-out", "budget-stopped", "unavailable"]),
  admission: new Set(["admitted", "rejected"]),
  errorClass: new Set(["invalid-target", "timeout", "aborted", "session-create", "prompt-failed", "budget-stopped", "admission-rejected", "unknown"]),
};

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

const queryValue = (event: TraceEvent, kind: string): string | number | undefined => event.observations?.find((observation) => observation.kind === kind && observation.availability === "available")?.value;
const hasObservation = (event: TraceEvent, kind: string): boolean => event.observations?.some((observation) => observation.kind === kind) === true;
const eventJobId = (event: TraceEvent): string | undefined => {
  const value = queryValue(event, "jobId");
  return typeof value === "string" ? projectOpaqueId(value) : undefined;
};
const eventParentJobId = (event: TraceEvent): string | undefined => {
  const parentCallId = queryValue(event, "parentCallId");
  return typeof parentCallId === "string" && parentCallId.startsWith("call-") ? projectOpaqueId(parentCallId.slice(5)) : undefined;
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
  if (field === "parentCallId") return queryValue(event, "parentCallId");
  if (field === "relationshipId") return queryValue(event, "relationshipId");
  if (field === "runId") return queryValue(event, "runId");
  if (field === "parentTraceId") return queryValue(event, "parentTraceId");
  if (field === "workerRole") return queryValue(event, "workerRole");
  if (field === "taskRevision") return queryValue(event, "taskRevision");
  if (field === "attempt") return queryValue(event, "attempt");
  if (field === "outcome") return queryValue(event, "outcome");
  if (field === "phase") return queryValue(event, "phase");
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
  return Object.entries(filters).every(([key, value]) => value === undefined || ["name", "traceId", "sessionName", "localSessionId", "callId", "parentCallId", "relationshipId", "runId", "parentTraceId", "workerRole", "outcome", "phase", "from", "to", "limit"].includes(key) || key === "taskRevision" || key === "attempt");
}

function matchesTraceEvent(event: TraceEvent, filters: TraceQueryFilters): boolean {
  if (filters.name !== undefined && !event.name.includes(filters.name)) return false;
  if (filters.traceId !== undefined && event.traceId !== filters.traceId) return false;
  for (const field of ["sessionName", "localSessionId", "callId", "parentCallId", "relationshipId", "runId", "parentTraceId", "workerRole", "outcome", "phase"] as const) {
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

function registryString(value: unknown): string | undefined {
  return typeof value === "string" && projectOpaqueId(value) ? value : undefined;
}

function registryTimestamp(value: unknown): string | undefined {
  return typeof value === "string" && validQueryTime(value) ? value : undefined;
}

function registryOutcome(value: unknown): PublicRegistryRecord["outcome"] {
  return value === "success" || value === "failure" || value === "budget-stopped" ? value : undefined;
}

function normalizeRegistryRecord(value: unknown): PublicRegistryRecord | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (input.event !== "launched" && input.event !== "finished") return undefined;
  const jobId = registryString(input.jobId);
  if (!jobId) return undefined;
  const parentJobId = input.event === "launched" ? registryString(input.parentJobId) : undefined;
  const traceId = registryString(input.traceId);
  const sessionName = registryString(input.sessionName);
  const localSessionId = registryString(input.localSessionId);
  const launchedAt = registryTimestamp(input.launchedAt);
  const finishedAt = registryTimestamp(input.finishedAt);
  const outcome = input.event === "finished"
    ? input.budgetStopped === true ? "budget-stopped" : typeof input.exitCode === "number" && input.exitCode === 0 ? "success" : "failure"
    : undefined;
  return { event: input.event, jobId, ...(parentJobId ? { parentJobId } : {}), ...(traceId ? { traceId } : {}), ...(sessionName ? { sessionName } : {}), ...(localSessionId ? { localSessionId } : {}), ...(launchedAt ? { launchedAt } : {}), ...(finishedAt ? { finishedAt } : {}), ...(outcome ? { outcome } : {}) };
}

export async function readJobRegistryEvidence(registryPath: string): Promise<JobRegistryEvidence> {
  if (typeof registryPath !== "string" || registryPath.length === 0 || registryPath.length > 4096) return { records: [], malformedLines: 0, availability: "inaccessible" };
  try {
    const metadata = await stat(registryPath);
    if (!metadata.isFile()) return { records: [], malformedLines: 0, availability: "inaccessible" };
    const file = Bun.file(registryPath);
    if (!await file.exists()) return { records: [], malformedLines: 0, availability: "missing" };
    if (file.size > maxRegistryBytes) return { records: [], malformedLines: 1, availability: "malformed" };
    const lines = (await file.text()).split("\n");
    const records: PublicRegistryRecord[] = [];
    let malformedLines = lines.length > maxRegistryLines ? 1 : 0;
    for (const line of lines.slice(0, maxRegistryLines)) {
      if (!line.trim()) continue;
      try {
        const record = normalizeRegistryRecord(JSON.parse(line));
        if (!record || records.length >= maxRegistryRecords) malformedLines += 1;
        else records.push(record);
      } catch {
        malformedLines += 1;
      }
    }
    return { records, malformedLines, availability: records.length > 0 ? "available" : malformedLines > 0 ? "malformed" : "missing" };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code) : "";
    return { records: [], malformedLines: 0, availability: code === "ENOENT" ? "missing" : "inaccessible" };
  }
}

export function correlateJobRegistryWithTraces(events: TraceEvent[], registry: JobRegistryEvidence, limits: { maxNodes?: number; maxDepth?: number; traceMalformedLines?: number } = {}): Record<string, unknown> {
  const maxNodes = Number.isInteger(limits.maxNodes) && limits.maxNodes! > 0 && limits.maxNodes! <= maxCorrelationNodes ? limits.maxNodes! : maxCorrelationNodes;
  const maxDepth = Number.isInteger(limits.maxDepth) && limits.maxDepth! > 0 && limits.maxDepth! <= maxCorrelationDepth ? limits.maxDepth! : maxCorrelationDepth;
  const launches = new Map<string, PublicRegistryRecord>();
  const finishes = new Map<string, PublicRegistryRecord>();
  const inconsistencies: Array<Record<string, unknown>> = [];
  for (const record of registry.records) {
    const target = record.event === "launched" ? launches : finishes;
    if (target.has(record.jobId)) {
      inconsistencies.push({ kind: "duplicate-job", jobId: record.jobId, event: record.event });
      continue;
    }
    target.set(record.jobId, record);
  }
  const traceByJob = new Map<string, { traceIds: string[]; parentJobIds: string[]; outcomes: string[] }>();
  for (const event of events) {
    const jobId = eventJobId(event);
    if (!jobId) continue;
    const current = traceByJob.get(jobId) ?? { traceIds: [], parentJobIds: [], outcomes: [] };
    const traceId = projectOpaqueId(event.traceId);
    if (traceId && !current.traceIds.includes(traceId)) current.traceIds.push(traceId);
    const parentJobId = eventParentJobId(event);
    if (parentJobId && !current.parentJobIds.includes(parentJobId)) current.parentJobIds.push(parentJobId);
    const outcome = eventField(event, "outcome");
    if (typeof outcome === "string" && !current.outcomes.includes(outcome)) current.outcomes.push(outcome);
    traceByJob.set(jobId, current);
  }
  const allJobs = [...new Set([...launches.keys(), ...finishes.keys(), ...traceByJob.keys()])].sort();
  const nodes: Array<Record<string, unknown>> = [];
  for (const jobId of allJobs.slice(0, maxNodes)) {
    const launch = launches.get(jobId);
    const finish = finishes.get(jobId);
    const trace = traceByJob.get(jobId);
    const traceIds = [...new Set([...(launch?.traceId ? [projectOpaqueId(launch.traceId)] : []), ...(trace?.traceIds ?? [])].filter((value): value is string => Boolean(value)))];
    if (launch?.traceId && trace && !trace.traceIds.includes(launch.traceId)) inconsistencies.push({ kind: "registry-trace-mismatch", jobId });
    if (launch?.parentJobId === jobId || trace?.parentJobIds.includes(jobId)) inconsistencies.push({ kind: "cycle-or-self-parent", jobId });
    const outcomes = [...new Set([...(finish?.outcome ? [finish.outcome] : []), ...(trace?.outcomes ?? [])])];
    if (outcomes.length > 1) inconsistencies.push({ kind: "conflicting-outcome", jobId });
    if (launch && !trace) inconsistencies.push({ kind: "missing-trace", jobId });
    const attempts = events.filter((event) => eventJobId(event) === jobId).map((event) => eventField(event, "attempt")).filter((value): value is number => typeof value === "number");
    nodes.push({ jobId, ...(launch?.parentJobId ? { parentJobId: launch.parentJobId } : {}), ...(traceIds.length ? { traceIds } : {}), ...(attempts.length ? { attempts: [...new Set(attempts)].sort((left, right) => left - right) } : {}), ...(launch?.sessionName ? { sessionName: launch.sessionName } : {}), ...(launch?.localSessionId ? { localSessionId: launch.localSessionId } : {}), ...(launch?.launchedAt ? { launchedAt: launch.launchedAt } : {}), ...(finish?.finishedAt ? { finishedAt: finish.finishedAt } : {}), outcome: outcomes[0] ?? "unavailable", ...(trace ? {} : { availability: "unavailable" }) });
  }
  if (allJobs.length > maxNodes) inconsistencies.push({ kind: "node-limit" });
  const nodeIds = new Set(nodes.map((node) => node.jobId));
  const parentOf = new Map(nodes.map((node) => [String(node.jobId), typeof node.parentJobId === "string" ? node.parentJobId : undefined]));
  for (const node of nodes) {
    const seen = new Set<string>();
    let current: string | undefined = String(node.jobId);
    let depth = 0;
    while (current && depth <= maxDepth) {
      if (seen.has(current)) {
        inconsistencies.push({ kind: "cycle-or-depth-limit", jobId: node.jobId });
        break;
      }
      seen.add(current);
      current = parentOf.get(current);
      depth += 1;
    }
    if (depth > maxDepth) inconsistencies.push({ kind: "cycle-or-depth-limit", jobId: node.jobId });
  }
  const relationships: Array<Record<string, unknown>> = [];
  for (const node of nodes) {
    const parentJobId = node.parentJobId;
    if (typeof parentJobId !== "string") continue;
    if (!nodeIds.has(parentJobId)) {
      inconsistencies.push({ kind: "missing-parent", jobId: node.jobId, parentJobId });
      relationships.push({ parentJobId, childJobId: node.jobId, availability: "unavailable", reason: "missing-parent" });
    } else {
      relationships.push({ parentJobId, childJobId: node.jobId, availability: "available" });
    }
  }
  const retryGroups = new Map<string, { jobIds: string[]; traceIds: string[]; attempts: number[]; outcomes: string[] }>();
  for (const node of nodes) {
    const job = String(node.jobId);
    const attempts = Array.isArray(node.attempts) ? node.attempts.filter((value): value is number => typeof value === "number") : [];
    if (attempts.length === 0) continue;
    const sessionName = typeof node.sessionName === "string" ? node.sessionName : "unavailable";
    const event = events.find((candidate) => eventJobId(candidate) === job);
    const revision = event ? eventField(event, "taskRevision") ?? "unavailable" : "unavailable";
    const key = `${sessionName}\u0000${String(revision)}`;
    const group = retryGroups.get(key) ?? { jobIds: [], traceIds: [], attempts: [], outcomes: [] };
    if (!group.jobIds.includes(job)) group.jobIds.push(job);
    for (const attempt of attempts) if (!group.attempts.includes(attempt)) group.attempts.push(attempt);
    for (const traceId of (traceByJob.get(job)?.traceIds ?? [])) if (!group.traceIds.includes(traceId)) group.traceIds.push(traceId);
    const outcome = typeof node.outcome === "string" ? node.outcome : "unavailable";
    if (!group.outcomes.includes(outcome)) group.outcomes.push(outcome);
    retryGroups.set(key, group);
  }
  const retries = [...retryGroups.values()].filter((group) => group.jobIds.length > 1).map((group) => ({ ...group, attempts: group.attempts.sort((left, right) => left - right) }));
  const traceMalformedLines = Number.isInteger(limits.traceMalformedLines) && limits.traceMalformedLines! >= 0 ? limits.traceMalformedLines! : 0;
  return {
    availability: registry.availability === "available" && events.length === 0 && traceMalformedLines > 0 ? "malformed" : registry.availability === "available" && (events.length > 0 || registry.records.length > 0) ? "available" : registry.availability,
    registryAvailability: registry.availability,
    traceAvailability: events.length > 0 ? "available" : traceMalformedLines > 0 ? "malformed" : "missing",
    malformedRegistryLines: registry.malformedLines,
    traceMalformedLines,
    eventCount: events.length,
    nodeCount: nodes.length,
    nodes,
    relationships,
    retries,
    inconsistencies: inconsistencies.slice(0, 256),
    limits: { maxNodes, maxDepth },
  };
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
  parentCallId: Type.Optional(Type.String({ maxLength: 128 })),
  relationshipId: Type.Optional(Type.String({ maxLength: 128 })),
  runId: Type.Optional(Type.String({ maxLength: 128 })),
  parentTraceId: Type.Optional(Type.String({ maxLength: 128 })),
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

function projectTraceSessionReference(value: unknown): { sessionId: string } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const sessionId = (value as Record<string, unknown>).sessionId;
  return typeof sessionId === "string" && projectOpaqueId(sessionId) ? { sessionId } : undefined;
}

function projectTraceObservation(observation: TraceObservation): Record<string, unknown> | undefined {
  if (!traceObservationKinds.has(observation.kind) || !traceObservationSources.has(observation.source ?? "") || !traceObservationAvailabilities.has(observation.availability ?? "")) return undefined;
  const availability = observation.availability!;
  const expectedUnit = traceExpectedUnits[observation.kind] ?? (traceNumericKinds.has(observation.kind) ? "count" : undefined);
  const reason = observation.reason;
  if (reason !== undefined && !traceObservationReasons.has(reason)) return undefined;
  const result: Record<string, unknown> = { kind: observation.kind, source: observation.source, availability };
  if (expectedUnit !== undefined) result.unit = expectedUnit;
  if (availability !== "available") {
    result.reason = reason ?? (availability === "malformed" ? "invalid-value" : "not-observed");
    return result;
  }
  if (observation.value === undefined) return { kind: observation.kind, source: observation.source, availability: "malformed", reason: "invalid-value", ...(expectedUnit ? { unit: expectedUnit } : {}) };
  if (typeof observation.value === "number") {
    if (!Number.isFinite(observation.value) || observation.value < 0 || observation.value > Number.MAX_SAFE_INTEGER || (traceIntegerKinds.has(observation.kind) && !Number.isSafeInteger(observation.value))) return { kind: observation.kind, source: observation.source, availability: "malformed", reason: "invalid-value", ...(expectedUnit ? { unit: expectedUnit } : {}) };
  } else if (typeof observation.value !== "string" || !safeOpaqueToken.test(observation.value)) return { kind: observation.kind, source: observation.source, availability: "malformed", reason: "invalid-value", ...(expectedUnit ? { unit: expectedUnit } : {}) };
  if (expectedUnit !== undefined && observation.unit !== expectedUnit) return { kind: observation.kind, source: observation.source, availability: "malformed", reason: "invalid-value", unit: expectedUnit };
  if (traceValueDomains[observation.kind] !== undefined && (typeof observation.value !== "string" || !traceValueDomains[observation.kind].has(observation.value))) return { kind: observation.kind, source: observation.source, availability: "malformed", reason: "invalid-value" };
  result.value = observation.value;
  if (expectedUnit === undefined && observation.unit !== undefined && ["count", "milliseconds", "usd"].includes(observation.unit)) result.unit = observation.unit;
  return result;
}

function projectTraceQueryEvent(event: TraceEvent): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};
  const sessionReference = projectTraceSessionReference(event.sessionReference);
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
    ...(sessionReference ? { sessionReference } : {}),
    attributes,
    ...(event.observations ? { observations: event.observations.map(projectTraceObservation).filter((observation): observation is Record<string, unknown> => observation !== undefined).slice(0, 64) } : {}),
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
    {
      name: "correlate_job_registry",
      label: "Correlate job registry and traces",
      description: "Join bounded trace observations with one explicitly selected public job registry source without exposing registry paths or private records.",
      parameters: Type.Object({ registryPath: Type.String({ minLength: 1, maxLength: 4096 }), maxNodes: Type.Optional(Type.Integer({ minimum: 1, maximum: maxCorrelationNodes })), maxDepth: Type.Optional(Type.Integer({ minimum: 1, maximum: maxCorrelationDepth })) }),
      async execute(_id, params, _signal, _update, ctx) {
        const [traceEvidence, registryEvidence] = await Promise.all([readTraceEvidence(ctx.cwd), readJobRegistryEvidence(params.registryPath)]);
        const result = correlateJobRegistryWithTraces(traceEvidence.events, registryEvidence, { maxNodes: params.maxNodes, maxDepth: params.maxDepth, traceMalformedLines: traceEvidence.malformedLines });
        const output = result;
        return { content: [{ type: "text", text: boundedJson(output) }], details: { availability: output.availability, nodeCount: output.nodeCount } };
      },
    },
  ];
}
