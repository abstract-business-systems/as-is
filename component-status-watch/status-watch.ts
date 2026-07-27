import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import {
  readDurableRecord,
  type DurableCheckpoint,
  type DurableRecordObservation,
} from "../subprocess-execution-foundation/supervisor.ts";

/**
 * The public, read-only component status boundary.
 *
 * This module deliberately does not call supervisor.observe(): that accepted
 * API appends an observation checkpoint to the task record. A status query is
 * read-only, so it reads the durable record, the documented private runtime
 * map, and (when the map supplies it) the private supervisor state directly.
 * The record remains authoritative whenever the private observations are
 * absent, malformed, stale, or contradictory.
 */

export const STATUS_WATCH_API = "component-status-watch" as const;
export const DEFAULT_WATCH_INTERVAL_MILLISECONDS = 1_000;

export type Unavailable = "unavailable";
export type Availability = "available" | "missing" | "malformed" | "unavailable";
export type ResolutionClassification = "resolved" | "missing" | "ambiguous" | "invalid" | "unavailable";
export type RuntimeClassification =
  | "live"
  | "dead"
  | "missing"
  | "orphaned"
  | "stale"
  | "ambiguous"
  | "unknown"
  | "unavailable"
  | "terminal";

export interface ComponentStatusOptions {
  /** The repository root. Defaults to the process working directory. */
  projectRoot?: string;
  /** Canonical repository-relative path, with `.` for the root component. */
  componentPath: string;
  /** Optional one-based attempt within the current durable task revision. */
  attempt?: number;
  /** Test/host injection for the documented XDG state root. */
  stateHome?: string;
  /** Observation clock injection for deterministic stale checks. */
  now?: Date;
  /** Effective check-in interval when it is not present in private state/map. */
  checkInSeconds?: number;
}

export interface ComponentWatchOptions extends ComponentStatusOptions {
  intervalMilliseconds?: number;
  count?: number;
  signal?: AbortSignal;
}

interface RecordLike {
  [key: string]: unknown;
}

interface EventObservation {
  event: DurableCheckpoint;
  attempt: number | null;
  taskRevision: string | null;
}

interface AttemptCandidate {
  attempt: number;
  source: string;
  eventCount: number;
}

interface RuntimeMapEntry {
  jobId: string | Unavailable;
  componentPath: string | Unavailable;
  taskRevision: string | Unavailable;
  attempt: number | Unavailable;
  adapter: string | Unavailable;
  raw: RecordLike;
}

interface RuntimeMapObservation {
  path: string;
  availability: Availability;
  source: string;
  entries: RuntimeMapEntry[];
  reason: string | Unavailable;
}

type PidValue = number | null | Unavailable;
type AliveValue = boolean | "unknown" | Unavailable;

interface PrivateRuntimeState {
  raw: RecordLike;
  source: string;
}

const UNAVAILABLE: Unavailable = "unavailable";
const REQUIRED_ROLES = ["as-is", "orchestrator", "implementer"] as const;

function asRecord(value: unknown): RecordLike | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as RecordLike
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function integer(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function nonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function valueAt(object: RecordLike | null, ...keys: string[]): unknown {
  if (!object) return undefined;
  for (const key of keys) {
    if (key in object) return object[key];
  }
  return undefined;
}

function stringAt(object: RecordLike | null, ...keys: string[]): string | null {
  return text(valueAt(object, ...keys));
}

function integerAt(object: RecordLike | null, ...keys: string[]): number | null {
  return integer(valueAt(object, ...keys));
}

function isoNow(now = new Date()): string {
  return now.toISOString();
}

function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  if (!projectRoot.trim() || !componentPath.trim()) throw new Error("project root and component path are required");
  if (isAbsolute(componentPath) || componentPath.includes("\\")) {
    throw new Error("component path must be canonical and repository-relative");
  }
  const root = resolve(projectRoot);
  const absolute = resolve(root, componentPath);
  const candidate = relative(root, absolute).split(sep).join("/");
  if (isAbsolute(candidate) || candidate === ".." || candidate.startsWith("../")) {
    throw new Error("component path escapes the project root");
  }
  return candidate || ".";
}

function componentRecordPath(projectRoot: string, componentPath: string): string {
  return join(resolve(projectRoot), componentPath, "as-is.md");
}

function safeProjectKey(projectRoot: string): string {
  return `project-${createHash("sha256").update(resolve(projectRoot)).digest("hex").slice(0, 16)}`;
}

function runtimeMapPath(projectRoot: string, stateHome: string): string {
  return join(resolve(stateHome), "as-is", "projects", safeProjectKey(projectRoot), "runtime", "job-map.json");
}

function explicitTaskRevision(raw: string): string | null {
  const match = raw.match(/^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im);
  return match?.[1] ?? null;
}

/**
 * Keep this calculation aligned with the accepted launch adapter. Version-2
 * records have no mutable front-matter task-revision field, so only their
 * immutable definition before `## Progress` contributes to the fallback.
 */
function resolveTaskRevision(raw: string, componentPath: string): { value: string; source: string } {
  const explicit = explicitTaskRevision(raw);
  if (explicit) return { value: explicit, source: "durable-component-record" };
  const progress = raw.search(/^## Progress\s*$/im);
  let definition = progress >= 0 ? raw.slice(0, progress) : raw;
  definition = definition
    .replace(/^  status:.*$/gm, "")
    .replace(/^  updated:.*$/gm, "")
    .replace(/^    spent:.*$/gm, "")
    .replace(/^      spent-seconds:.*$/gm, "")
    .replace(/\r\n/g, "\n")
    .trim();
  return {
    value: `record-${createHash("sha256").update(`${componentPath}\n${definition}`).digest("hex").slice(0, 24)}`,
    source: "durable-component-record-definition-hash",
  };
}

function eventDetails(event: DurableCheckpoint): RecordLike {
  return asRecord(event.details) ?? {};
}

function eventAttempt(event: DurableCheckpoint): number | null {
  const details = eventDetails(event);
  const envelope = asRecord(details.envelope);
  return integer(valueAt(details, "attempt")) ?? integerAt(envelope, "attempt");
}

function eventTaskRevision(event: DurableCheckpoint): string | null {
  const details = eventDetails(event);
  const envelope = asRecord(details.envelope);
  return stringAt(details, "taskRevision", "task-revision")
    ?? stringAt(envelope, "taskRevision", "task-revision");
}

function eventObservations(record: DurableRecordObservation): EventObservation[] {
  return record.events.map((event) => ({ event, attempt: eventAttempt(event), taskRevision: eventTaskRevision(event) }));
}

function inferredAttempt(events: EventObservation[]): AttemptCandidate | null {
  if (events.some((entry) => entry.attempt !== null)) return null;
  const lifecycle = events.find((entry) => ["launch-requested", "launch-accepted", "worker-started"].includes(entry.event.event));
  return lifecycle
    ? { attempt: 1, source: "durable-record-first-launch-checkpoint", eventCount: events.length }
    : null;
}

function attemptsForRevision(
  events: EventObservation[],
  taskRevision: string,
): { candidates: AttemptCandidate[]; conflictingRevisions: string[] } {
  const byAttempt = new Map<number, AttemptCandidate>();
  const conflictingRevisions = new Set<string>();
  for (const entry of events) {
    if (entry.taskRevision && entry.taskRevision !== taskRevision) {
      if (entry.attempt !== null) conflictingRevisions.add(entry.taskRevision);
      continue;
    }
    if (entry.attempt === null || entry.attempt < 1) continue;
    const prior = byAttempt.get(entry.attempt);
    byAttempt.set(entry.attempt, {
      attempt: entry.attempt,
      source: prior?.source ?? "durable-task-record-checkpoint",
      eventCount: (prior?.eventCount ?? 0) + 1,
    });
  }
  if (byAttempt.size === 0) {
    const inferred = inferredAttempt(events);
    if (inferred) byAttempt.set(inferred.attempt, inferred);
  }
  return {
    candidates: [...byAttempt.values()].sort((left, right) => left.attempt - right.attempt),
    conflictingRevisions: [...conflictingRevisions],
  };
}

function section(raw: string, title: string): string | null {
  const expression = new RegExp(`^## ${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
  const match = raw.match(expression);
  if (!match || match.index === undefined) return null;
  const start = match.index + match[0].length;
  const rest = raw.slice(start);
  const next = rest.search(/^##\s+/m);
  const value = (next >= 0 ? rest.slice(0, next) : rest).trim();
  return value || null;
}

function sectionList(raw: string, title: string): string[] | Unavailable {
  const value = section(raw, title);
  if (value === null) return UNAVAILABLE;
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, ""));
}

function diagnosticJob(value: unknown, source: string): Record<string, unknown> {
  return {
    value: text(value) ?? UNAVAILABLE,
    source,
    diagnosticOnly: true,
    lookupKey: false,
  };
}

function unavailableRole(): Record<string, unknown> {
  return {
    role: UNAVAILABLE,
    sessionId: UNAVAILABLE,
    parentSessionId: UNAVAILABLE,
    source: UNAVAILABLE,
  };
}

function roleLink(value: unknown, expectedRole: string): Record<string, unknown> {
  const link = asRecord(value);
  return {
    role: stringAt(link, "role") ?? expectedRole,
    sessionId: stringAt(link, "sessionId", "session-id") ?? UNAVAILABLE,
    parentSessionId: stringAt(link, "parentSessionId", "parent-session-id") ?? UNAVAILABLE,
    source: stringAt(link, "source") ?? UNAVAILABLE,
  };
}

function extractRoleChain(events: EventObservation[]): Record<string, unknown> {
  for (const entry of [...events].reverse()) {
    const details = eventDetails(entry.event);
    const chain = asRecord(details.roleChain) ?? asRecord(asRecord(details.envelope)?.roleChain);
    if (!chain) continue;
    const links = {
      asIs: roleLink(chain.asIs, REQUIRED_ROLES[0]),
      orchestrator: roleLink(chain.orchestrator, REQUIRED_ROLES[1]),
      implementer: roleLink(chain.implementer, REQUIRED_ROLES[2]),
    };
    const complete = REQUIRED_ROLES.every((role) => {
      const key = role === "as-is" ? "asIs" : role;
      return (links[key] as RecordLike).role === role
        && (links[key] as RecordLike).sessionId !== UNAVAILABLE;
    });
    return {
      status: complete ? "complete" : "ambiguous",
      source: stringAt(chain, "source") ?? entry.event.source,
      asIs: links.asIs,
      orchestrator: links.orchestrator,
      implementer: links.implementer,
      parentChain: [links.asIs, links.orchestrator, links.implementer],
    };
  }
  return {
    status: "unavailable",
    source: UNAVAILABLE,
    asIs: unavailableRole(),
    orchestrator: unavailableRole(),
    implementer: unavailableRole(),
    parentChain: [unavailableRole(), unavailableRole(), unavailableRole()],
  };
}

function extractAdapter(events: EventObservation[]): Record<string, unknown> {
  for (const entry of [...events].reverse()) {
    const details = eventDetails(entry.event);
    const envelope = asRecord(details.envelope);
    const job = asRecord(valueAt(envelope, "jobSpecification", "job-specification"));
    const adapter = stringAt(details, "adapter") ?? stringAt(envelope, "adapter") ?? stringAt(job, "adapter");
    if (adapter) {
      return {
        name: adapter,
        source: stringAt(details, "adapter") ? entry.event.source : envelope ? "opencode-launch-adapter.envelope" : entry.event.source,
        executionMode: stringAt(job, "executionMode", "execution-mode") ?? UNAVAILABLE,
      };
    }
  }
  return { name: UNAVAILABLE, source: UNAVAILABLE, executionMode: UNAVAILABLE };
}

function extractLastEvent(events: EventObservation[]): Record<string, unknown> {
  const last = events.at(-1)?.event;
  if (!last) return { event: UNAVAILABLE, time: UNAVAILABLE, source: UNAVAILABLE };
  return {
    event: text(last.event) ?? UNAVAILABLE,
    time: text(last.observedAt) ?? UNAVAILABLE,
    source: text(last.source) ?? UNAVAILABLE,
  };
}

function latestLifecycle(
  events: EventObservation[],
  names: string[],
  stateMap: Record<string, string>,
): Record<string, unknown> {
  for (const entry of [...events].reverse()) {
    const name = entry.event.event;
    if (!names.includes(name)) continue;
    const details = eventDetails(entry.event);
    return {
      state: stateMap[name] ?? name,
      event: name,
      time: text(entry.event.observedAt) ?? UNAVAILABLE,
      source: text(entry.event.source) ?? UNAVAILABLE,
      reason: stringAt(details, "reason") ?? UNAVAILABLE,
      dueAt: stringAt(details, "dueAt", "due-at") ?? UNAVAILABLE,
    };
  }
  return { state: UNAVAILABLE, event: UNAVAILABLE, time: UNAVAILABLE, source: UNAVAILABLE, reason: UNAVAILABLE, dueAt: UNAVAILABLE };
}

function extractPermission(events: EventObservation[]): Record<string, unknown> {
  return latestLifecycle(events, ["permission-needed", "permission-approved", "permission-denied", "permission-escalation-unavailable", "permission-escalation-unproven"], {
    "permission-needed": "awaiting-user-approval",
    "permission-approved": "approved",
    "permission-denied": "denied",
    "permission-escalation-unavailable": "unavailable",
    "permission-escalation-unproven": "unavailable",
  });
}

function extractCancellation(events: EventObservation[]): Record<string, unknown> {
  return latestLifecycle(events, ["cancellation-requested", "cancellation-dispatched", "cancellation-confirmed", "cancellation-waiting", "cancellation-escalated", "cancellation-host-unavailable"], {
    "cancellation-requested": "requested",
    "cancellation-dispatched": "dispatched",
    "cancellation-confirmed": "confirmed",
    "cancellation-waiting": "waiting",
    "cancellation-escalated": "escalated",
    "cancellation-host-unavailable": "unavailable",
  });
}

function extractRecovery(events: EventObservation[]): Record<string, unknown> {
  return latestLifecycle(events, ["recovery-blocker", "recovery-scheduled", "recovery-launch-requested", "recovery-escalated", "budget-blocked"], {
    "recovery-blocker": "blocked",
    "recovery-scheduled": "scheduled",
    "recovery-launch-requested": "launched",
    "recovery-escalated": "escalated",
    "budget-blocked": "blocked",
  });
}

function extractCleanup(events: EventObservation[]): Record<string, unknown> {
  return latestLifecycle(events, ["cleanup-complete", "cleanup-deferred", "cleanup-failed"], {
    "cleanup-complete": "complete",
    "cleanup-deferred": "deferred",
    "cleanup-failed": "failed",
  });
}

function extractBlockers(record: DurableRecordObservation, events: EventObservation[]): Record<string, unknown> {
  if (record.status === "unknown") return { status: "unavailable", items: UNAVAILABLE, source: UNAVAILABLE };
  const items: Array<Record<string, unknown>> = [];
  for (const entry of events) {
    const details = eventDetails(entry.event);
    const blocker = stringAt(details, "blocker", "reason");
    if (!blocker && !["blocked", "awaiting-approval"].includes(record.status)) continue;
    if (!blocker && entry.event.event !== "capability-preflight-failed") continue;
    items.push({
      value: blocker ?? entry.event.event,
      event: entry.event.event,
      time: text(entry.event.observedAt) ?? UNAVAILABLE,
      source: text(entry.event.source) ?? UNAVAILABLE,
    });
  }
  const unique = items.filter((item, index) => items.findIndex((candidate) => candidate.value === item.value && candidate.event === item.event) === index);
  return {
    status: unique.length > 0 ? "present" : "none",
    items: unique,
    source: unique.length > 0 ? "durable-task-record" : "durable-task-record",
  };
}

function extractNextAction(raw: string, events: EventObservation[]): Record<string, unknown> {
  const body = section(raw, "Next Action");
  if (body) return { value: body, source: "durable-component-record" };
  for (const entry of [...events].reverse()) {
    const next = stringAt(eventDetails(entry.event), "nextAction", "next-action");
    if (next) return { value: next, source: entry.event.source };
  }
  return { value: UNAVAILABLE, source: UNAVAILABLE };
}

function parseRuntimeMapEntry(value: unknown, key?: string): RuntimeMapEntry | null {
  const raw = asRecord(value);
  if (!raw) return null;
  return {
    jobId: stringAt(raw, "jobId", "job-id") ?? text(key) ?? UNAVAILABLE,
    componentPath: stringAt(raw, "componentPath", "component-path", "component") ?? UNAVAILABLE,
    taskRevision: stringAt(raw, "taskRevision", "task-revision") ?? UNAVAILABLE,
    attempt: integerAt(raw, "attempt") ?? UNAVAILABLE,
    adapter: stringAt(raw, "adapter") ?? UNAVAILABLE,
    raw,
  };
}

function mapEntries(value: unknown): RuntimeMapEntry[] {
  if (Array.isArray(value)) return value.map((entry) => parseRuntimeMapEntry(entry)).filter((entry): entry is RuntimeMapEntry => entry !== null);
  const object = asRecord(value);
  if (!object) return [];
  const nested = valueAt(object, "entries", "jobs", "jobMap", "job-map");
  if (nested && nested !== value) return mapEntries(nested);
  return Object.entries(object)
    .map(([key, entry]) => parseRuntimeMapEntry(entry, key))
    .filter((entry): entry is RuntimeMapEntry => entry !== null);
}

async function loadRuntimeMap(projectRoot: string, stateHome: string): Promise<RuntimeMapObservation> {
  const path = runtimeMapPath(projectRoot, stateHome);
  try {
    const parsed = JSON.parse(await readFile(path, "utf8")) as unknown;
    return { path, availability: "available", source: "supervisor-persisted-runtime-map", entries: mapEntries(parsed), reason: UNAVAILABLE };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return { path, availability: "missing", source: "supervisor-persisted-runtime-map", entries: [], reason: "persisted runtime map is missing" };
    }
    if (error instanceof SyntaxError) {
      return { path, availability: "malformed", source: "supervisor-persisted-runtime-map", entries: [], reason: "persisted runtime map is malformed JSON" };
    }
    return {
      path,
      availability: "unavailable",
      source: "supervisor-persisted-runtime-map",
      entries: [],
      reason: `persisted runtime map is unavailable: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function nestedHandles(entry: RuntimeMapEntry, state: PrivateRuntimeState | null): RecordLike {
  return asRecord(valueAt(state?.raw ?? null, "processHandles", "process-handles"))
    ?? asRecord(valueAt(entry.raw, "processHandles", "process-handles"))
    ?? {};
}

function pidAt(state: PrivateRuntimeState | null, entry: RuntimeMapEntry, ...keys: string[]): PidValue {
  const handles = nestedHandles(entry, state);
  const sources = [state?.raw ?? null, handles, entry.raw];
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (!(key in source)) continue;
      const value = source[key];
      if (value === null) return null;
      const pid = integer(value);
      return pid !== null && pid > 0 ? pid : UNAVAILABLE;
    }
  }
  return UNAVAILABLE;
}

function runtimeStatus(state: PrivateRuntimeState | null, entry: RuntimeMapEntry): string | Unavailable {
  return stringAt(state?.raw ?? null, "status", "runtimeState", "runtime-state")
    ?? stringAt(entry.raw, "runtimeState", "runtime-state", "status")
    ?? UNAVAILABLE;
}

function checkInSeconds(state: PrivateRuntimeState | null, entry: RuntimeMapEntry, requested: number | undefined): number | null {
  return nonNegativeNumber(requested)
    ?? nonNegativeNumber(valueAt(state?.raw ?? null, "checkInSeconds", "check-in-seconds"))
    ?? nonNegativeNumber(valueAt(entry.raw, "checkInSeconds", "check-in-seconds"));
}

async function processAlive(pid: PidValue): Promise<AliveValue> {
  if (pid === UNAVAILABLE) return UNAVAILABLE;
  if (pid === null) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ESRCH") return false;
    if (code === "EPERM") return true;
    return "unknown";
  }
}

async function groupAlive(pgid: PidValue): Promise<AliveValue> {
  if (pgid === UNAVAILABLE) return UNAVAILABLE;
  if (pgid === null) return false;
  try {
    process.kill(-pgid, 0);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ESRCH") return false;
    if (code === "EPERM") return true;
    return "unknown";
  }
}

async function loadPrivateState(entry: RuntimeMapEntry): Promise<PrivateRuntimeState | null> {
  const handles = asRecord(valueAt(entry.raw, "processHandles", "process-handles"));
  const statePath = stringAt(entry.raw, "statePath", "state-path") ?? stringAt(handles, "statePath", "state-path");
  const runtimeDir = stringAt(entry.raw, "runtimeDir", "runtime-dir") ?? stringAt(handles, "runtimeDir", "runtime-dir");
  const path = statePath ?? (runtimeDir ? join(runtimeDir, "state.json") : null);
  if (!path) return null;
  try {
    return { raw: asRecord(JSON.parse(await readFile(path, "utf8"))) ?? {}, source: "private-supervisor-state" };
  } catch {
    return null;
  }
}

function staleObservation(
  record: DurableRecordObservation,
  checkIn: number | null,
  now: Date,
): Record<string, unknown> {
  if (record.status !== "active") {
    return { classification: "unknown", source: "durable-record", reason: `task status is ${record.status}, not active`, ageSeconds: UNAVAILABLE, checkInSeconds: checkIn ?? UNAVAILABLE };
  }
  if (!record.updated) return { classification: "unknown", source: "durable-record", reason: "task.updated is missing", ageSeconds: UNAVAILABLE, checkInSeconds: checkIn ?? UNAVAILABLE };
  if (checkIn === null || checkIn <= 0) {
    return { classification: "unknown", source: "durable-record-plus-runtime", reason: "effective check-in interval is unavailable", ageSeconds: UNAVAILABLE, checkInSeconds: UNAVAILABLE };
  }
  const updated = new Date(record.updated);
  if (Number.isNaN(updated.getTime())) {
    return { classification: "unknown", source: "durable-record", reason: "task.updated is malformed", ageSeconds: UNAVAILABLE, checkInSeconds: checkIn };
  }
  const ageSeconds = (now.getTime() - updated.getTime()) / 1000;
  if (!Number.isFinite(ageSeconds) || ageSeconds < 0) {
    return { classification: "unknown", source: "durable-record", reason: "observation clock cannot establish elapsed interval", ageSeconds: UNAVAILABLE, checkInSeconds: checkIn };
  }
  return {
    classification: ageSeconds > checkIn ? "stale" : "fresh",
    source: "durable-record",
    reason: ageSeconds > checkIn ? "durable checkpoint exceeds effective check-in interval" : "durable checkpoint is within effective check-in interval",
    ageSeconds,
    checkInSeconds: checkIn,
    updated: record.updated,
  };
}

function durableClassification(status: string): string {
  if (["completed", "failed", "cancelled"].includes(status)) return "terminal";
  if (status === "unknown") return "unknown";
  return status;
}

function healthUnavailable(kind: string): Record<string, unknown> {
  return {
    kind,
    source: UNAVAILABLE,
    status: UNAVAILABLE,
    pid: UNAVAILABLE,
    processGroupId: UNAVAILABLE,
    alive: UNAVAILABLE,
    processGroupAlive: UNAVAILABLE,
  };
}

async function runtimeHealth(
  entry: RuntimeMapEntry,
  state: PrivateRuntimeState | null,
): Promise<{ supervisor: Record<string, unknown>; worker: Record<string, unknown>; hostStatus: string | Unavailable }> {
  if (!state && entry.raw) {
    const hasHandle = pidAt(null, entry, "supervisorPid", "supervisor-pid") !== UNAVAILABLE
      || pidAt(null, entry, "workerPid", "worker-pid") !== UNAVAILABLE;
    if (!hasHandle && runtimeStatus(null, entry) === UNAVAILABLE) {
      return { supervisor: healthUnavailable("supervisor"), worker: healthUnavailable("worker"), hostStatus: UNAVAILABLE };
    }
  }
  const supervisorPid = pidAt(state, entry, "supervisorPid", "supervisor-pid");
  const supervisorGroup = pidAt(state, entry, "supervisorProcessGroupId", "supervisor-process-group-id");
  const workerPid = pidAt(state, entry, "workerPid", "worker-pid");
  const workerGroup = pidAt(state, entry, "workerProcessGroupId", "worker-process-group-id", "processGroupId", "process-group-id");
  const hostStatus = runtimeStatus(state, entry);
  const workerStatus = stringAt(state?.raw ?? null, "workerStatus", "worker-status")
    ?? stringAt(entry.raw, "workerStatus", "worker-status")
    ?? hostStatus;
  return {
    supervisor: {
      kind: "supervisor",
      source: state?.source ?? "supervisor-persisted-runtime-map",
      status: hostStatus,
      pid: supervisorPid,
      processGroupId: supervisorGroup,
      alive: await processAlive(supervisorPid),
      processGroupAlive: await groupAlive(supervisorGroup),
    },
    worker: {
      kind: "worker",
      source: state?.source ?? "supervisor-persisted-runtime-map",
      status: workerStatus,
      pid: workerPid,
      processGroupId: workerGroup,
      alive: await processAlive(workerPid),
      processGroupAlive: await groupAlive(workerGroup),
    },
    hostStatus,
  };
}

function runtimeJobFromEvents(events: EventObservation[], selectedAttempt: number | null): Record<string, unknown> {
  for (const entry of [...events].reverse()) {
    if (selectedAttempt !== null && entry.attempt !== null && entry.attempt !== selectedAttempt) continue;
    const jobId = text(entry.event.jobId);
    if (jobId) return diagnosticJob(jobId, "durable-task-record.runtime-correlation");
  }
  return diagnosticJob(UNAVAILABLE, UNAVAILABLE);
}

async function runtimeProjection(
  map: RuntimeMapObservation,
  projectRoot: string,
  componentPath: string,
  taskRevision: string,
  selectedAttempt: number | null,
  record: DurableRecordObservation,
  events: EventObservation[],
  now: Date,
  requestedCheckIn: number | undefined,
): Promise<Record<string, unknown>> {
  const pathEntries = map.entries.filter((entry) => entry.componentPath === componentPath);
  const orphanedEntries = map.entries.filter((entry) => entry.componentPath !== componentPath
    || entry.taskRevision !== taskRevision
    || (selectedAttempt !== null && entry.attempt !== selectedAttempt));
  const matching = selectedAttempt === null
    ? []
    : pathEntries.filter((entry) => entry.taskRevision === taskRevision && entry.attempt === selectedAttempt);
  const mapStatus = map.availability;
  const baseMap = {
    path: map.path,
    source: map.source,
    availability: mapStatus,
    entriesObserved: map.entries.length,
    matchingEntries: matching.length,
    orphanedEntries: orphanedEntries.length,
    reason: map.reason,
  };
  if (mapStatus !== "available") {
    const health = { supervisor: healthUnavailable("supervisor"), worker: healthUnavailable("worker") };
    return {
      classification: mapStatus === "missing" ? "missing" : "unavailable",
      availability: mapStatus,
      source: map.source,
      runtimeJobId: runtimeJobFromEvents(events, selectedAttempt),
      adapter: { name: UNAVAILABLE, source: UNAVAILABLE, executionMode: UNAVAILABLE },
      hostStatus: UNAVAILABLE,
      supervisor: health.supervisor,
      worker: health.worker,
      lastObservedAt: UNAVAILABLE,
      reconciliation: {
        status: "unavailable",
        source: map.source,
        reason: map.reason,
        stableIdentityPreserved: true,
      },
      map: baseMap,
    };
  }
  if (matching.length === 0) {
    const hasOrphan = orphanedEntries.length > 0;
    const health = { supervisor: healthUnavailable("supervisor"), worker: healthUnavailable("worker") };
    return {
      classification: hasOrphan ? "orphaned" : "missing",
      availability: "missing",
      source: map.source,
      runtimeJobId: runtimeJobFromEvents(events, selectedAttempt),
      adapter: { name: UNAVAILABLE, source: UNAVAILABLE, executionMode: UNAVAILABLE },
      hostStatus: UNAVAILABLE,
      supervisor: health.supervisor,
      worker: health.worker,
      lastObservedAt: UNAVAILABLE,
      reconciliation: {
        status: hasOrphan ? "orphaned" : "missing",
        source: map.source,
        reason: hasOrphan ? "runtime-map entries do not match the durable path/revision/attempt" : "no runtime-map entry matches the durable path/revision/attempt",
        stableIdentityPreserved: true,
      },
      map: baseMap,
    };
  }
  if (matching.length > 1 && matching.some((entry) => entry.adapter !== matching[0].adapter && entry.adapter !== UNAVAILABLE)) {
    return {
      classification: "ambiguous",
      availability: "available",
      source: map.source,
      runtimeJobId: diagnosticJob(UNAVAILABLE, "supervisor-persisted-runtime-map"),
      adapter: { name: UNAVAILABLE, source: "supervisor-persisted-runtime-map", executionMode: UNAVAILABLE },
      hostStatus: UNAVAILABLE,
      supervisor: healthUnavailable("supervisor"),
      worker: healthUnavailable("worker"),
      lastObservedAt: UNAVAILABLE,
      reconciliation: { status: "ambiguous", source: map.source, reason: "conflicting runtime aliases share one stable identity", stableIdentityPreserved: true },
      map: baseMap,
    };
  }
  const selected = [...matching].sort((left, right) => {
    const leftTime = Date.parse(stringAt(left.raw, "lastObservedAt", "last-observed-at") ?? "") || 0;
    const rightTime = Date.parse(stringAt(right.raw, "lastObservedAt", "last-observed-at") ?? "") || 0;
    return rightTime - leftTime;
  })[0];
  const state = await loadPrivateState(selected);
  const health = await runtimeHealth(selected, state);
  const checkIn = checkInSeconds(state, selected, requestedCheckIn);
  const runtimeStale = staleObservation(record, checkIn, now).classification === "stale";
  const stateName = runtimeStatus(state, selected);
  const allKnownDead = health.supervisor.alive === false && health.worker.alive === false
    && health.supervisor.processGroupAlive === false && health.worker.processGroupAlive === false;
  let classification: RuntimeClassification = "unknown";
  if (runtimeStale) classification = "stale";
  else if (!state && stateName === UNAVAILABLE) classification = "unavailable";
  else if (["completed", "failed", "cancelled"].includes(record.status) && allKnownDead) classification = "terminal";
  else if (allKnownDead) classification = "dead";
  else if (["unknown", "unavailable"].includes(stateName)) classification = stateName === "unknown" ? "unknown" : "unavailable";
  else if (health.supervisor.alive === true || health.worker.alive === true) classification = "live";
  else classification = "unknown";
  const mapAdapter = selected.adapter;
  const eventAdapter = extractAdapter(events);
  return {
    classification,
    availability: "available",
    source: map.source,
    runtimeJobId: diagnosticJob(selected.jobId, map.source),
    adapter: mapAdapter !== UNAVAILABLE ? { name: mapAdapter, source: map.source, executionMode: eventAdapter.executionMode } : eventAdapter,
    hostStatus: health.hostStatus,
    supervisor: health.supervisor,
    worker: health.worker,
    lastObservedAt: stringAt(selected.raw, "lastObservedAt", "last-observed-at") ?? UNAVAILABLE,
    reconciliation: {
      status: state ? "reconciled" : "unavailable",
      source: map.source,
      reason: state ? "runtime-map identity matches the durable record and private state was reloaded" : "runtime-map identity matches but private supervisor state is unavailable",
      stableIdentityPreserved: true,
      aliases: matching.length,
    },
    map: baseMap,
    checkInSeconds: checkIn ?? UNAVAILABLE,
    observedAt: isoNow(now),
    orphanedRuntimeEntries: orphanedEntries.length,
    projectRoot: projectRoot,
  };
}

function failedInputStatus(
  projectRoot: string,
  requestedPath: string,
  reason: string,
  now: Date,
): Record<string, unknown> {
  const role = {
    status: "unavailable",
    source: UNAVAILABLE,
    asIs: unavailableRole(),
    orchestrator: unavailableRole(),
    implementer: unavailableRole(),
    parentChain: [unavailableRole(), unavailableRole(), unavailableRole()],
  };
  const unavailableLifecycle = { state: UNAVAILABLE, event: UNAVAILABLE, time: UNAVAILABLE, source: UNAVAILABLE, reason: UNAVAILABLE, dueAt: UNAVAILABLE };
  return {
    api: STATUS_WATCH_API,
    operation: "status",
    observedAt: isoNow(now),
    request: { projectRoot: resolve(projectRoot), componentPath: requestedPath, attempt: UNAVAILABLE },
    resolution: { status: "invalid", reason },
    identity: { componentPath: UNAVAILABLE, taskRevision: UNAVAILABLE, attempt: UNAVAILABLE, key: UNAVAILABLE, source: UNAVAILABLE },
    componentPath: UNAVAILABLE,
    taskRevision: UNAVAILABLE,
    attempt: UNAVAILABLE,
    runtimeJobId: diagnosticJob(UNAVAILABLE, UNAVAILABLE),
    roleChain: role,
    adapter: { name: UNAVAILABLE, source: UNAVAILABLE, executionMode: UNAVAILABLE },
    supervisor: healthUnavailable("supervisor"),
    worker: healthUnavailable("worker"),
    lastEvent: { event: UNAVAILABLE, time: UNAVAILABLE, source: UNAVAILABLE },
    durableState: { status: UNAVAILABLE, classification: "unavailable", updated: UNAVAILABLE, source: UNAVAILABLE, result: UNAVAILABLE, validation: UNAVAILABLE },
    stale: { classification: "unavailable", source: UNAVAILABLE, reason, ageSeconds: UNAVAILABLE, checkInSeconds: UNAVAILABLE },
    permission: unavailableLifecycle,
    cancellation: unavailableLifecycle,
    recovery: unavailableLifecycle,
    cleanup: unavailableLifecycle,
    blockers: { status: "unavailable", items: UNAVAILABLE, source: UNAVAILABLE },
    nextSafeAction: { value: UNAVAILABLE, source: UNAVAILABLE },
    runtime: { classification: "unavailable", availability: "unavailable", source: UNAVAILABLE, reason, reconciliation: { status: "unavailable", source: UNAVAILABLE, reason, stableIdentityPreserved: true } },
    runtimeMap: { availability: "unavailable", source: UNAVAILABLE, path: UNAVAILABLE },
    descendants: { status: "unavailable", failedOrCancelled: UNAVAILABLE, source: UNAVAILABLE },
  };
}

/** Resolve and read one component observation without modifying any state. */
export async function readComponentStatus(options: ComponentStatusOptions): Promise<Record<string, unknown>> {
  const projectRoot = resolve(options.projectRoot ?? process.cwd());
  const now = options.now ?? new Date();
  let componentPath: string;
  try {
    componentPath = canonicalComponentPath(projectRoot, options.componentPath);
  } catch (error) {
    return failedInputStatus(projectRoot, options.componentPath, error instanceof Error ? error.message : String(error), now);
  }
  const recordPath = componentRecordPath(projectRoot, componentPath);
  let record: DurableRecordObservation;
  try {
    record = await readDurableRecord(recordPath);
  } catch (error) {
    const reason = `durable component record is unavailable: ${error instanceof Error ? error.message : String(error)}`;
    const missing = failedInputStatus(projectRoot, componentPath, reason, now);
    missing.resolution = { status: "missing", reason };
    missing.identity = { componentPath, taskRevision: UNAVAILABLE, attempt: UNAVAILABLE, key: UNAVAILABLE, source: "canonical-component-path" };
    missing.componentPath = componentPath;
    missing.request = { projectRoot, componentPath, attempt: options.attempt ?? UNAVAILABLE };
    missing.durableState = { status: UNAVAILABLE, classification: "missing", updated: UNAVAILABLE, source: "durable-component-record", result: UNAVAILABLE, validation: UNAVAILABLE };
    missing.runtimeMap = { availability: "unavailable", source: UNAVAILABLE, path: UNAVAILABLE };
    return missing;
  }

  const revision = resolveTaskRevision(record.raw, componentPath);
  const events = eventObservations(record);
  const attemptSet = attemptsForRevision(events, revision.value);
  const explicitAttempt = options.attempt;
  let resolution: { status: ResolutionClassification; reason: string };
  let selectedAttempt: AttemptCandidate | null = null;
  if (explicitAttempt !== undefined && (!Number.isInteger(explicitAttempt) || explicitAttempt < 1)) {
    resolution = { status: "invalid", reason: "attempt must be a one-based integer" };
  } else if (attemptSet.conflictingRevisions.length > 0) {
    resolution = { status: "ambiguous", reason: "durable checkpoints contain conflicting task revisions" };
  } else if (explicitAttempt !== undefined) {
    selectedAttempt = attemptSet.candidates.find((candidate) => candidate.attempt === explicitAttempt) ?? null;
    resolution = selectedAttempt
      ? { status: "resolved", reason: "explicit attempt resolved from durable checkpoints" }
      : { status: "missing", reason: `attempt ${explicitAttempt} is not durably recorded for the current task revision` };
  } else if (attemptSet.candidates.length > 0) {
    selectedAttempt = attemptSet.candidates.at(-1) ?? null;
    resolution = { status: "resolved", reason: "latest durable attempt selected for the current task revision" };
  } else {
    resolution = { status: "missing", reason: "no durable attempt is recorded for the current task revision" };
  }
  const selectedNumber = selectedAttempt?.attempt ?? null;
  const stateHome = options.stateHome ?? process.env.XDG_STATE_HOME ?? join(homedir(), ".local", "state");
  const map = await loadRuntimeMap(projectRoot, stateHome);
  const runtime = await runtimeProjection(map, projectRoot, componentPath, revision.value, selectedNumber, record, events, now, options.checkInSeconds);
  const selectedStateCheckIn = nonNegativeNumber(runtime.checkInSeconds) ?? nonNegativeNumber(options.checkInSeconds);
  const finalStale = staleObservation(record, selectedStateCheckIn, now);
  const roleChain = extractRoleChain(events);
  const adapter = extractAdapter(events);
  const result = section(record.raw, "Result") ?? UNAVAILABLE;
  const validation = sectionList(record.raw, "Validation");
  const runtimeJobId = runtime.runtimeJobId ?? runtimeJobFromEvents(events, selectedNumber);
  const identityAttempt: number | Unavailable = selectedAttempt?.attempt ?? UNAVAILABLE;
  const identityKey = selectedAttempt ? `${componentPath}/${revision.value}/${selectedAttempt.attempt}` : UNAVAILABLE;
  const durableState = {
    status: record.status,
    classification: durableClassification(record.status),
    updated: record.updated ?? UNAVAILABLE,
    source: "durable-component-record",
    result,
    validation,
    checkpointCount: record.events.length,
  };
  const response: Record<string, unknown> = {
    api: STATUS_WATCH_API,
    operation: "status",
    observedAt: isoNow(now),
    request: { projectRoot, componentPath, attempt: explicitAttempt ?? UNAVAILABLE },
    resolution,
    identity: {
      componentPath,
      taskRevision: revision.value,
      attempt: identityAttempt,
      key: identityKey,
      source: revision.source,
      stable: true,
    },
    componentPath,
    taskRevision: revision.value,
    attempt: identityAttempt,
    runtimeJobId,
    roleChain,
    parentChain: roleChain,
    adapter,
    supervisor: runtime.supervisor ?? healthUnavailable("supervisor"),
    worker: runtime.worker ?? healthUnavailable("worker"),
    lastEvent: extractLastEvent(events),
    durableState,
    stale: finalStale,
    permission: extractPermission(events),
    cancellation: extractCancellation(events),
    recovery: extractRecovery(events),
    cleanup: extractCleanup(events),
    blockers: extractBlockers(record, events),
    nextSafeAction: extractNextAction(record.raw, events),
    result,
    validation,
    runtime,
    runtimeMap: runtime.map ?? { availability: map.availability, source: map.source, path: map.path },
    reconciliation: runtime.reconciliation ?? { status: "unavailable", source: map.source, reason: map.reason, stableIdentityPreserved: true },
    descendants: { status: UNAVAILABLE, failedOrCancelled: UNAVAILABLE, source: "durable-component-record" },
    record: {
      path: record.path,
      status: record.status,
      updated: record.updated ?? UNAVAILABLE,
      source: "durable-component-record",
    },
  };
  return response;
}

/**
 * Re-read the same canonical path/attempt at each interval. Every yielded
 * value is a complete independent status observation; an absent or unchanged
 * observation is never interpreted as completion.
 */
export async function* watchComponentStatus(options: ComponentWatchOptions): AsyncGenerator<Record<string, unknown>> {
  const interval = options.intervalMilliseconds ?? DEFAULT_WATCH_INTERVAL_MILLISECONDS;
  if (!Number.isInteger(interval) || interval <= 0) throw new Error("intervalMilliseconds must be a positive integer");
  if (options.count !== undefined && (!Number.isInteger(options.count) || options.count < 0)) {
    throw new Error("count must be a non-negative integer");
  }
  let sequence = 0;
  while (options.count === undefined || sequence < options.count) {
    if (options.signal?.aborted) return;
    const observation = await readComponentStatus(options);
    yield {
      ...observation,
      watch: {
        sequence,
        intervalMilliseconds: interval,
        repeatedLookup: true,
        completionInferredFromPolling: false,
      },
    };
    sequence += 1;
    if (options.count !== undefined && sequence >= options.count) return;
    await new Promise<void>((resolvePromise) => {
      const timer = setTimeout(resolvePromise, interval);
      options.signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        resolvePromise();
      }, { once: true });
    });
  }
}

interface ParsedCli {
  operation: "status" | "watch";
  options: ComponentWatchOptions;
}

function cliValue(args: string[], index: number, name: string): { value: string; next: number } {
  const argument = args[index];
  if (argument.includes("=")) return { value: argument.slice(argument.indexOf("=") + 1), next: index + 1 };
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return { value, next: index + 2 };
}

function positiveInteger(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function parseCli(args: string[]): ParsedCli {
  const operation = args.shift();
  if (operation !== "status" && operation !== "watch") throw new Error("usage: status|watch [options] <canonical-component-path>");
  let projectRoot = process.cwd();
  let attempt: number | undefined;
  let intervalMilliseconds: number | undefined;
  let count: number | undefined;
  let componentPath: string | undefined;
  while (args.length > 0) {
    const argument = args[0];
    if (argument === "--project-root" || argument.startsWith("--project-root=")) {
      const parsed = cliValue(args, 0, "--project-root");
      projectRoot = parsed.value;
      args.splice(0, parsed.next);
    } else if (argument === "--attempt" || argument.startsWith("--attempt=")) {
      const parsed = cliValue(args, 0, "--attempt");
      attempt = positiveInteger(parsed.value, "attempt");
      args.splice(0, parsed.next);
    } else if (argument === "--interval-ms" || argument.startsWith("--interval-ms=")) {
      const parsed = cliValue(args, 0, "--interval-ms");
      intervalMilliseconds = positiveInteger(parsed.value, "interval-ms");
      args.splice(0, parsed.next);
    } else if (argument === "--count" || argument.startsWith("--count=")) {
      const parsed = cliValue(args, 0, "--count");
      count = Number(parsed.value);
      if (!Number.isInteger(count) || count < 0) throw new Error("count must be a non-negative integer");
      args.splice(0, parsed.next);
    } else if (argument.startsWith("--")) {
      throw new Error(`unknown option ${argument}`);
    } else if (!componentPath) {
      componentPath = argument;
      args.shift();
    } else if (attempt === undefined) {
      attempt = positiveInteger(argument, "attempt");
      args.shift();
    } else {
      throw new Error("only one component path and one attempt are accepted");
    }
  }
  if (!componentPath) throw new Error("canonical component path is required");
  return {
    operation,
    options: { projectRoot, componentPath, attempt, intervalMilliseconds, count },
  };
}

async function main(): Promise<void> {
  try {
    const parsed = parseCli(process.argv.slice(2));
    if (parsed.operation === "status") {
      process.stdout.write(`${JSON.stringify(await readComponentStatus(parsed.options))}\n`);
      return;
    }
    for await (const observation of watchComponentStatus(parsed.options)) {
      process.stdout.write(`${JSON.stringify(observation)}\n`);
    }
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ api: STATUS_WATCH_API, operation: "error", error: error instanceof Error ? error.message : String(error) })}\n`);
    process.exitCode = 2;
  }
}

if (import.meta.main && ["status", "watch"].includes(process.argv[2] ?? "")) await main();
