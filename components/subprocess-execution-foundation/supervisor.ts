import { createHash, randomUUID } from "node:crypto";
import { appendFile, chmod, mkdir, open, readFile, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { emitTrace, startSpan, type TracerConfig, type SpanLifecycle } from "../observability/tracer.ts";
import { isExhausted } from "../budget-control/budget.ts";

/**
 * A small, host-neutral execution boundary.
 *
 * The only long-lived authority written by this module is the component task
 * record.  `state.json`, logs, and the event stream are private observations
 * used to make a later observation possible; they are deliberately disposable
 * after the durable handoff has been recorded.
 */

export const REQUIRED_ROLE_CHAIN = ["as-is", "orchestrator", "implementer"] as const;
export type RequiredRole = (typeof REQUIRED_ROLE_CHAIN)[number];

export type ExecutionOutcome =
  | "started"
  | "progressed"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled"
  | "unavailable"
  | "rejected";

export type HostStatus =
  | "launching"
  | "waiting"
  | "running"
  | "completed"
  | "failed"
  | "cancelling"
  | "cancelled"
  | "unavailable";

export type DurableTaskStatus =
  | "ready"
  | "active"
  | "blocked"
  | "awaiting-approval"
  | "completed"
  | "failed"
  | "cancelled";

export type UnavailableValue = "unavailable";

export interface RoleLink {
  role: RequiredRole;
  sessionId: string;
  parentSessionId: string | null;
  source: string;
}

export interface RoleChain {
  asIs: RoleLink;
  orchestrator: RoleLink;
  implementer: RoleLink;
}

export interface PermissionScope {
  operation: string;
  capabilityClass: string;
  resourceClass: string;
  failureClass: string;
}

export interface PermissionNeededRequest extends PermissionScope {
  reason: string;
  recordRevision?: string;
}

export interface PermissionNeededEvent {
  event: "permission-needed";
  source: string;
  jobId: string;
  recordRevision: string;
  scope: PermissionScope;
  reason: string;
  fingerprint: string;
  permissionState: "awaiting-user-approval";
}

export interface PermissionEscalationBridge {
  source: string;
  present(event: PermissionNeededEvent): Promise<"approved" | "denied" | "unavailable">;
}

export interface TaskEvent {
  kind: "task";
  source: string;
  sessionId?: string;
  parentSessionId?: string | null;
  target?: string;
  agent?: string;
  [key: string]: unknown;
}

export interface UsageBudget {
  costAllocation: number | UnavailableValue;
  costReserve: number | UnavailableValue;
  costSpent: number | UnavailableValue;
  costSource: string;
  wallClockAllocationSeconds: number | UnavailableValue;
  wallClockReserveSeconds: number | UnavailableValue;
  wallClockSpentSeconds: number | UnavailableValue;
  wallClockSource: string;
}

export interface WorkerSpec {
  role: string;
  command: string[];
  cwd?: string;
  available?: boolean;
}

/**
 * Capability facts must be supplied by the host adapter.  A missing
 * user-event path is a blocker; this module never invents an approval or
 * opens an interactive prompt on the worker's behalf.
 */
export interface HostCapabilities {
  userEventBubbling: boolean;
  source: string;
}

export interface LaunchRequest {
  component: string;
  recordPath: string;
  projectRoot?: string;
  projectKey?: string;
  runId?: string;
  traceId?: string;
  tracer?: TracerConfig;
  recordRevision?: string;
  expectedRecordStatus?: "ready" | "active";
  roleChain: RoleChain;
  worker: WorkerSpec;
  capabilities?: HostCapabilities;
  permissionFingerprint?: string;
  budget: UsageBudget;
  checkInSeconds: number;
  maxRecoveryAttempts?: number;
  retryBackoffSeconds?: number;
  /** A bounded supervisor-side hold used to make the waiting state observable. */
  startDelayMilliseconds?: number;
  /** Set only by recover(); it is not a role or worker replacement. */
  recovery?: {
    attempt: number;
    reason: string;
    dueAt: string;
    previousJobId: string;
  };
}

export interface DurableCheckpoint {
  operation: string;
  event: string;
  jobId: string;
  source: string;
  observedAt: string;
  details: Record<string, unknown>;
}

export interface DurableRecordObservation {
  path: string;
  status: DurableTaskStatus | "unknown";
  updated: string | null;
  events: DurableCheckpoint[];
  raw: string;
}

export interface ProcessHealth {
  source: "host-process";
  supervisorPid: number | null;
  supervisorProcessGroupId: number | null;
  workerPid: number | null;
  processGroupId: number | null;
  supervisorAlive: boolean | "unknown";
  supervisorProcessGroupAlive: boolean | "unknown";
  workerAlive: boolean | "unknown";
  processGroupAlive: boolean | "unknown";
  observedAt: string;
}

export interface BudgetObservation {
  cumulative: UsageBudget;
  attempts: Array<{
    attempt: number;
    jobId: string;
    reason: string;
    wallClockSeconds: number | UnavailableValue;
    cost: number | UnavailableValue;
    costSource: string;
    wallClockSource: string;
    accounted: boolean;
  }>;
}

export interface JobObservation {
  outcome: ExecutionOutcome;
  jobId: string;
  record: DurableRecordObservation;
  host: {
    source: "private-supervisor-state";
    status: HostStatus | "unavailable";
    workerExitCode: number | null;
    launchAccepted: boolean;
    workerProcessGroupId: number | null;
    logs: { stdout: string | null; stderr: string | null };
  };
  health: ProcessHealth;
  budget: BudgetObservation | null;
  stale: StaleObservation;
}

export interface JobHandle {
  jobId: string;
  component: string;
  recordPath: string;
  runtimeDir: string;
  workspacePath: string;
  statePath: string;
  attempt: number;
}

interface PrivateEvent extends DurableCheckpoint {
  source: string;
}

interface AttemptUsage {
  attempt: number;
  jobId: string;
  reason: string;
  wallClockSeconds: number | UnavailableValue;
  cost: number | UnavailableValue;
  costSource: string;
  wallClockSource: string;
  accounted: boolean;
}

interface PrivateState {
  version: 1;
  jobId: string;
  component: string;
  recordPath: string;
  attempt: number;
  attemptReason: string;
  status: HostStatus;
  supervisorPid: number | null;
  workerPid: number | null;
  workerProcessGroupId: number | null;
  supervisorProcessGroupId: number | null;
  approvedWorkspacePath: string;
  approvedWorkspaceMode: string;
  workerExitCode: number | null;
  createdAt: string;
  launchAcceptedAt: string | null;
  workerStartedAt: string | null;
  workerFinishedAt: string | null;
  cancellationRequestedAt: string | null;
  watchdogDeadlineAt: string | null;
  heartbeatAt: string | null;
  logs: { stdout: string; stderr: string };
  events: PrivateEvent[];
  roleChain: RoleChain;
  budget: UsageBudget;
  attempts: AttemptUsage[];
  checkInSeconds: number;
  maxRecoveryAttempts: number;
  retryBackoffSeconds: number;
  recovery: {
    attempts: number;
    nextDueAt: string | null;
    escalation: string | null;
  };
}

export type StaleObservation =
  | { status: "stale"; source: "durable-record"; ageSeconds: number; checkInSeconds: number; updated: string }
  | { status: "fresh"; source: "durable-record"; ageSeconds: number; checkInSeconds: number; updated: string }
  | { status: "unknown"; source: "durable-record"; reason: string };

const CHECKPOINT_BEGIN = "<!-- subprocess-execution-foundation:begin -->";
const CHECKPOINT_END = "<!-- subprocess-execution-foundation:end -->";
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;
const encoder = new TextEncoder();

function isoNow(): string {
  return new Date().toISOString();
}

function monotonicSeconds(): number {
  return Number(process.hrtime.bigint()) / 1_000_000_000;
}

function json(value: unknown): string {
  return JSON.stringify(value);
}

async function atomicWrite(path: string, contents: string): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${randomUUID()}`;
  try {
    await writeFile(temporary, contents, { encoding: "utf8", mode: 0o600 });
    const file = await open(temporary, "r+");
    try {
      await file.sync();
    } finally {
      await file.close();
    }
    await rename(temporary, path);
    // The rename is atomic. Syncing the containing directory makes the
    // checkpoint durable across a host crash where the platform supports it.
    try {
      const directory = await open(dirname(path), "r");
      try {
        await directory.sync();
      } finally {
        await directory.close();
      }
    } catch {
      // Some host filesystems do not permit directory fsync. The file was
      // still atomically renamed and the limitation remains host-local.
    }
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
}

async function atomicJson(path: string, value: unknown): Promise<void> {
  await atomicWrite(path, `${JSON.stringify(value, null, 2)}\n`);
}

function safeProjectKey(value: string): string {
  const digest = createHash("sha256").update(resolve(value)).digest("hex").slice(0, 16);
  return `project-${digest}`;
}

function safeComponentKey(value: string): string {
  return basename(value).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64) || "component";
}

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a finite non-negative number`);
  }
}

function budgetDimensionExhausted(
  allocation: number | UnavailableValue,
  spent: number | UnavailableValue,
  reserve: number | UnavailableValue,
): boolean | "unknown" {
  return isExhausted({ allocation, spent, reserve });
}

function admissionBlocker(budget: UsageBudget): string | null {
  const cost = budgetDimensionExhausted(budget.costAllocation, budget.costSpent, budget.costReserve);
  if (cost === true) return "cost allocation after retained reserve is exhausted";
  const wall = budgetDimensionExhausted(
    budget.wallClockAllocationSeconds,
    budget.wallClockSpentSeconds,
    budget.wallClockReserveSeconds,
  );
  if (wall === true) return "wall-clock allocation after retained reserve is exhausted";
  // Unknown host observations remain unknown. They do not become zero and do
  // not authorize automatic budget enforcement.
  return null;
}

function assertRoleLink(link: RoleLink, role: RequiredRole, parentSessionId: string | null): void {
  if (!link || link.role !== role || typeof link.sessionId !== "string" || link.sessionId.length === 0) {
    throw new Error(`role attribution blocker: expected ${role} with a session id`);
  }
  if (link.parentSessionId !== parentSessionId || typeof link.source !== "string" || link.source.length === 0) {
    throw new Error(`role attribution blocker: ${role} has missing or unexpected parent linkage`);
  }
}

export function validateRoleChain(chain: RoleChain): void {
  assertRoleLink(chain.asIs, "as-is", null);
  assertRoleLink(chain.orchestrator, "orchestrator", chain.asIs.sessionId);
  assertRoleLink(chain.implementer, "implementer", chain.orchestrator.sessionId);
}

export function validateTaskEvent(event: TaskEvent, chain: RoleChain): void {
  validateRoleChain(chain);
  if (event.kind !== "task" || typeof event.source !== "string" || event.source.length === 0) {
    throw new Error("delegation blocker: unexpected or unattributed task event");
  }
  if (event.target !== "implementer" || event.agent !== "implementer") {
    throw new Error("delegation blocker: direct, wrong-role, or fallback worker event");
  }
  if (event.sessionId !== chain.implementer.sessionId || event.parentSessionId !== chain.orchestrator.sessionId) {
    throw new Error("delegation blocker: implementer event has missing parent linkage");
  }
}

function validateRequest(request: LaunchRequest): void {
  if (!request.component || !request.recordPath || !request.worker.command?.length) {
    throw new Error("rejected: component, recordPath, and worker command are required");
  }
  if (!request.worker.command.every((argument) => typeof argument === "string" && argument.length > 0)) {
    throw new Error("rejected: worker command arguments must be non-empty strings");
  }
  if (request.worker.role !== "implementer") {
    throw new Error("delegation blocker: configured worker is not implementer");
  }
  validateRoleChain(request.roleChain);
  if (!Number.isFinite(request.checkInSeconds) || request.checkInSeconds <= 0) {
    throw new Error("rejected: checkInSeconds must be positive");
  }
  if (typeof request.budget.costReserve === "number") assertFiniteNonNegative(request.budget.costReserve, "costReserve");
  if (typeof request.budget.wallClockReserveSeconds === "number") {
    assertFiniteNonNegative(request.budget.wallClockReserveSeconds, "wallClockReserveSeconds");
  }
  if (typeof request.budget.costAllocation === "number") assertFiniteNonNegative(request.budget.costAllocation, "costAllocation");
  if (typeof request.budget.wallClockAllocationSeconds === "number") {
    assertFiniteNonNegative(request.budget.wallClockAllocationSeconds, "wallClockAllocationSeconds");
  }
  if (typeof request.budget.costSpent === "number") assertFiniteNonNegative(request.budget.costSpent, "costSpent");
  if (typeof request.budget.wallClockSpentSeconds === "number") {
    assertFiniteNonNegative(request.budget.wallClockSpentSeconds, "wallClockSpentSeconds");
  }
  if (request.startDelayMilliseconds !== undefined) {
    assertFiniteNonNegative(request.startDelayMilliseconds, "startDelayMilliseconds");
  }
  if (request.maxRecoveryAttempts !== undefined
    && (!Number.isInteger(request.maxRecoveryAttempts) || request.maxRecoveryAttempts < 0)) {
    throw new Error("rejected: maxRecoveryAttempts must be a finite non-negative integer");
  }
  if (request.retryBackoffSeconds !== undefined) {
    assertFiniteNonNegative(request.retryBackoffSeconds, "retryBackoffSeconds");
  }
}

function parseRecord(raw: string, path: string): DurableRecordObservation {
  const statusMatch = raw.match(RECORD_STATUS);
  const updatedMatch = raw.match(RECORD_UPDATED);
  const status = statusMatch?.[1] as DurableTaskStatus | undefined;
  const events: DurableCheckpoint[] = [];
  const begin = raw.indexOf(CHECKPOINT_BEGIN);
  const end = raw.indexOf(CHECKPOINT_END);
  if (begin >= 0 && end > begin) {
    const ledger = raw.slice(begin + CHECKPOINT_BEGIN.length, end);
    for (const line of ledger.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const value = JSON.parse(trimmed) as DurableCheckpoint;
        if (value.jobId && value.event && value.operation) events.push(value);
      } catch {
        // A malformed private-looking ledger line is ignored; the record's
        // authoritative status and updated checkpoint remain observable.
      }
    }
  }
  return {
    path,
    status: status ?? "unknown",
    updated: updatedMatch?.[1]?.trim() ?? null,
    events,
    raw,
  };
}

export async function readDurableRecord(recordPath: string): Promise<DurableRecordObservation> {
  return parseRecord(await readFile(recordPath, "utf8"), recordPath);
}

async function checkpointRecord(
  recordPath: string,
  checkpoint: DurableCheckpoint,
  status?: DurableTaskStatus,
  updateUpdated = true,
): Promise<void> {
  const raw = await readFile(recordPath, "utf8");
  let next = raw;
  if (status) {
    if (!RECORD_STATUS.test(next)) throw new Error("durable record blocker: task.status is not parseable");
    next = next.replace(RECORD_STATUS, `  status: ${status}`);
  }
  if (updateUpdated) {
    if (!RECORD_UPDATED.test(next)) throw new Error("durable record blocker: task.updated is not parseable");
    next = next.replace(RECORD_UPDATED, `  updated: ${checkpoint.observedAt}`);
  }
  const line = JSON.stringify(checkpoint);
  const begin = next.indexOf(CHECKPOINT_BEGIN);
  const end = next.indexOf(CHECKPOINT_END);
  if (begin >= 0 && end > begin) {
    next = `${next.slice(0, end)}${line}\n${next.slice(end)}`;
  } else {
    next = `${next.trimEnd()}\n\n## Execution Foundation Checkpoints\n\n${CHECKPOINT_BEGIN}\n${line}\n${CHECKPOINT_END}\n`;
  }
  await atomicWrite(recordPath, next);
}

function makeCheckpoint(jobId: string, operation: string, event: string, details: Record<string, unknown>): DurableCheckpoint {
  return { operation, event, jobId, source: "durable-task-record", observedAt: isoNow(), details };
}

function privateEvent(jobId: string, operation: string, event: string, details: Record<string, unknown>): PrivateEvent {
  return { operation, event, jobId, source: "supervisor", observedAt: isoNow(), details };
}

async function traceSupervisorEvent(
  request: LaunchRequest,
  name: string,
  attributes: Record<string, string | number | boolean | undefined>,
  parentSpanId?: string,
): Promise<void> {
  await emitTrace({
    name,
    traceId: request.traceId ?? request.runId ?? request.component,
    spanId: randomUUID().replaceAll("-", "").slice(0, 16),
    parentSpanId,
    attributes: {
      "as_is.run_id": request.runId,
      "as_is.component_path": request.component,
      "as_is.task_revision": request.recordRevision,
      "as_is.role": request.worker.role,
      ...attributes,
    },
  }, request.projectRoot ?? process.cwd(), request.tracer);
}

function roleChainDetails(chain: RoleChain): Record<string, unknown> {
  return {
    asIs: { ...chain.asIs },
    orchestrator: { ...chain.orchestrator },
    implementer: { ...chain.implementer },
  };
}

function durableAttemptHistory(record: DurableRecordObservation): AttemptUsage[] {
  const attempts: AttemptUsage[] = [];
  for (const event of record.events) {
    if (event.event !== "budget-observed") continue;
    const details = event.details;
    const attempt = details.attempt;
    const jobId = details.jobId;
    if (typeof attempt !== "number" || typeof jobId !== "string") continue;
    if (attempts.some((entry) => entry.jobId === jobId)) continue;
    const wallClockSeconds = details.wallClockSeconds;
    const cost = details.cost;
    attempts.push({
      attempt,
      jobId,
      reason: typeof details.reason === "string" ? details.reason : "durable recovery history",
      wallClockSeconds: typeof wallClockSeconds === "number" || wallClockSeconds === "unavailable" ? wallClockSeconds : "unavailable",
      cost: typeof cost === "number" || cost === "unavailable" ? cost : "unavailable",
      costSource: typeof details.costSource === "string" ? details.costSource : "host:unavailable",
      wallClockSource: typeof details.wallClockSource === "string" ? details.wallClockSource : "host:unavailable",
      accounted: details.accounted === true,
    });
  }
  return attempts;
}

function carryForwardBudget(requestBudget: UsageBudget, record: DurableRecordObservation): UsageBudget {
  const latest = [...record.events].reverse().find((event) => event.event === "budget-observed");
  if (!latest) return requestBudget;
  const details = latest.details;
  const cumulativeCost = details.cumulativeCost;
  const cumulativeWall = details.cumulativeWallClockSeconds;
  return {
    ...requestBudget,
    costSpent: typeof cumulativeCost === "number" || cumulativeCost === "unavailable"
      ? cumulativeCost
      : requestBudget.costSpent,
    costSource: typeof details.cumulativeCostSource === "string"
      ? details.cumulativeCostSource
      : requestBudget.costSource,
    wallClockSpentSeconds: typeof cumulativeWall === "number" || cumulativeWall === "unavailable"
      ? cumulativeWall
      : requestBudget.wallClockSpentSeconds,
    wallClockSource: typeof details.cumulativeWallClockSource === "string"
      ? details.cumulativeWallClockSource
      : requestBudget.wallClockSource,
  };
}

function initialState(
  request: LaunchRequest,
  jobId: string,
  runtimeDir: string,
  workspacePath: string,
  priorAttempts: AttemptUsage[] = [],
): PrivateState {
  const attempt = request.recovery?.attempt ?? 1;
  return {
    version: 1,
    jobId,
    component: request.component,
    recordPath: request.recordPath,
    attempt,
    attemptReason: request.recovery?.reason ?? "initial launch",
    status: "launching",
    supervisorPid: null,
    workerPid: null,
    workerProcessGroupId: null,
    supervisorProcessGroupId: null,
    approvedWorkspacePath: workspacePath,
    approvedWorkspaceMode: "0700",
    workerExitCode: null,
    createdAt: isoNow(),
    launchAcceptedAt: null,
    workerStartedAt: null,
    workerFinishedAt: null,
    cancellationRequestedAt: null,
    watchdogDeadlineAt: null,
    heartbeatAt: null,
    logs: { stdout: join(runtimeDir, "stdout.log"), stderr: join(runtimeDir, "stderr.log") },
    events: [],
    roleChain: request.roleChain,
    budget: request.budget,
    attempts: priorAttempts,
    checkInSeconds: request.checkInSeconds,
    maxRecoveryAttempts: request.maxRecoveryAttempts ?? 2,
    retryBackoffSeconds: request.retryBackoffSeconds ?? 1,
    recovery: { attempts: Math.max(0, attempt - 1), nextDueAt: null, escalation: null },
  };
}

async function loadState(statePath: string): Promise<PrivateState> {
  return JSON.parse(await readFile(statePath, "utf8")) as PrivateState;
}

async function processAlive(pid: number | null): Promise<boolean | "unknown"> {
  if (!pid || pid <= 0) return false;
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

async function groupAlive(pgid: number | null): Promise<boolean | "unknown"> {
  if (!pgid || pgid <= 0) return false;
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

async function sleep(milliseconds: number): Promise<void> {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function hostStatusFromState(state: PrivateState): HostStatus {
  return state.status;
}

function outcomeFor(record: DurableRecordObservation, state: PrivateState | null): ExecutionOutcome {
  if (!state) return "unavailable";
  if (state.status === "unavailable") return "unavailable";
  if (record.status === "completed" && state.status === "completed") return "completed";
  if (record.status === "cancelled" && state.status === "cancelled") return "cancelled";
  if (state.status === "failed") return "failed";
  if (state.status === "cancelling") return "progressed";
  if (state.status === "waiting") return "waiting";
  if (state.status === "completed") return "progressed";
  return state.status === "launching" ? "started" : "progressed";
}

export function classifyStale(record: DurableRecordObservation, checkInSeconds: number, now = new Date()): StaleObservation {
  if (record.status !== "active") {
    return { status: "unknown", source: "durable-record", reason: `task status is ${record.status}, not active` };
  }
  if (!record.updated) return { status: "unknown", source: "durable-record", reason: "task.updated is missing" };
  const updated = new Date(record.updated);
  if (Number.isNaN(updated.getTime())) {
    return { status: "unknown", source: "durable-record", reason: "task.updated is malformed" };
  }
  const ageSeconds = (now.getTime() - updated.getTime()) / 1000;
  if (!Number.isFinite(ageSeconds) || ageSeconds < 0) {
    return { status: "unknown", source: "durable-record", reason: "observation clock cannot establish elapsed interval" };
  }
  return ageSeconds > checkInSeconds
    ? { status: "stale", source: "durable-record", ageSeconds, checkInSeconds, updated: record.updated }
    : { status: "fresh", source: "durable-record", ageSeconds, checkInSeconds, updated: record.updated };
}

function makeRuntimeDir(request: LaunchRequest, runId: string, jobId: string): string {
  const projectRoot = request.projectRoot ?? process.cwd();
  const projectKey = request.projectKey ?? safeProjectKey(projectRoot);
  return join(tmpdir(), "as-is", projectKey, runId, safeComponentKey(request.component), jobId);
}

async function commandAvailable(command: string): Promise<boolean> {
  if (command.includes("/")) {
    try {
      const info = await stat(command);
      return info.isFile() && (info.mode & 0o111) !== 0;
    } catch {
      return false;
    }
  }
  return Boolean(Bun.which(command));
}

async function verifyApprovedDirectory(path: string): Promise<{ mode: string; owner: string }> {
  await mkdir(path, { recursive: true, mode: 0o700 });
  await chmod(path, 0o700);
  const info = await stat(path);
  const mode = (info.mode & 0o777).toString(8).padStart(4, "0");
  if (mode !== "0700") throw new Error(`approved workspace has mode ${mode}, expected 0700`);
  const getuid = (process as typeof process & { getuid?: () => number }).getuid;
  if (getuid && info.uid !== getuid()) {
    throw new Error("approved workspace is not owned by the supervisor user");
  }
  return { mode, owner: getuid ? `uid:${getuid()}` : "supervisor-user-unreported" };
}

interface CapabilityPreflightResult {
  ok: boolean;
  failures: string[];
  workspace: { mode: string; owner: string };
  details: Record<string, unknown>;
}

async function capabilityPreflight(
  request: LaunchRequest,
  runtimeDir: string,
  workspacePath: string,
): Promise<CapabilityPreflightResult> {
  const failures: string[] = [];
  let workspace = { mode: "unknown", owner: "unknown" };
  try {
    workspace = await verifyApprovedDirectory(workspacePath);
  } catch (error) {
    failures.push(`approved workspace: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    const runtimeInfo = await stat(runtimeDir);
    const runtimeMode = (runtimeInfo.mode & 0o777).toString(8).padStart(4, "0");
    if (runtimeMode !== "0700") failures.push(`private runtime has mode ${runtimeMode}, expected 0700`);
  } catch (error) {
    failures.push(`private runtime: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    const recordInfo = await stat(request.recordPath);
    if (!recordInfo.isFile()) failures.push("durable record path is not a regular file");
    await readFile(request.recordPath, "utf8");
  } catch (error) {
    failures.push(`durable record/checkpoint path is unavailable: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (process.platform === "win32" || !(await commandAvailable("setsid"))) {
    failures.push("host does not provide a POSIX setsid process-group control");
  }
  if (!(await commandAvailable(request.worker.command[0] ?? ""))) {
    failures.push("configured worker command is not available on the host");
  }
  if (request.capabilities?.userEventBubbling !== true || !request.capabilities?.source.trim()) {
    failures.push("user-event bubbling capability is not proven by a host adapter");
  }
  const details: Record<string, unknown> = {
    source: "host-capability-preflight",
    processGroupControl: "setsid",
    standardInput: "disabled",
    hiddenInteractivePrompt: false,
    eventPersistence: "durable task record plus private source-labelled events",
    watchdog: "durable heartbeat/check-in and bounded supervisor lifetime",
    workspace: {
      class: "supervisor-owned-approved-private-workspace",
      mode: workspace.mode,
      owner: workspace.owner,
      association: { component: request.component, attempt: request.recovery?.attempt ?? 1 },
    },
    userEventBubbling: request.capabilities?.userEventBubbling === true,
    userEventSource: request.capabilities?.source ?? "unproven",
  };
  return { ok: failures.length === 0, failures, workspace, details };
}

async function withRecordLock<T>(recordPath: string, action: () => Promise<T>): Promise<T> {
  const lockPath = `${recordPath}.execution-lock`;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      await mkdir(lockPath, { recursive: false, mode: 0o700 });
      try {
        return await action();
      } finally {
        await rm(lockPath, { recursive: true, force: true });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await sleep(5);
    }
  }
  throw new Error("durable record blocker: component checkpoint lock timed out");
}

async function writeRecordCheckpoint(
  recordPath: string,
  checkpoint: DurableCheckpoint,
  status?: DurableTaskStatus,
): Promise<void> {
  await withRecordLock(recordPath, () => checkpointRecord(recordPath, checkpoint, status));
}

async function writeRecordObservation(recordPath: string, checkpoint: DurableCheckpoint): Promise<void> {
  // Observation is read-only with respect to task freshness. It is durable
  // audit evidence, but must not refresh task.updated and hide stale work.
  await withRecordLock(recordPath, () => checkpointRecord(recordPath, checkpoint, undefined, false));
}

async function withPrivateStateLock<T>(statePath: string, action: () => Promise<T>): Promise<T> {
  const lockPath = `${statePath}.lock`;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      await mkdir(lockPath, { recursive: false, mode: 0o700 });
      try {
        return await action();
      } finally {
        await rm(lockPath, { recursive: true, force: true });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await sleep(5);
    }
  }
  throw new Error("private supervisor state lock timed out");
}

async function appendPrivateEvent(statePath: string, event: PrivateEvent, patch: Partial<PrivateState> = {}): Promise<PrivateState> {
  return withPrivateStateLock(statePath, async () => {
    const state = await loadState(statePath);
    const next: PrivateState = { ...state, ...patch, events: [...state.events, event] };
    await atomicJson(statePath, next);
    return next;
  });
}

function stateHandle(state: PrivateState, runtimeDir: string, statePath: string): JobHandle {
  return {
    jobId: state.jobId,
    component: state.component,
    recordPath: state.recordPath,
    runtimeDir,
    workspacePath: state.approvedWorkspacePath,
    statePath,
    attempt: state.attempt,
  };
}

async function consumeOutput(
  stream: ReadableStream<Uint8Array>,
  path: string,
  statePath: string,
  jobId: string,
  source: "worker.stdout" | "worker.stderr",
): Promise<number> {
  const decoder = new TextDecoder();
  let pending = "";
  let count = 0;
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    pending += decoder.decode(chunk, { stream: true });
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) {
      const rendered = `[${isoNow()}] [${source}] ${line}\n`;
      await appendFile(path, rendered, { encoding: "utf8", mode: 0o600 });
      const event = privateEvent(jobId, "observe", "worker-log", { source, line });
      await appendPrivateEvent(statePath, event);
      count += 1;
    }
  }
  pending += decoder.decode();
  if (pending) {
    await appendFile(path, `[${isoNow()}] [${source}] ${pending}\n`, { encoding: "utf8", mode: 0o600 });
    await appendPrivateEvent(statePath, privateEvent(jobId, "observe", "worker-log", { source, line: pending }));
    count += 1;
  }
  return count;
}

async function hasDurableCancellationRequest(recordPath: string, jobId: string): Promise<boolean> {
  const record = await readDurableRecord(recordPath);
  return record.events.some((event) => event.jobId === jobId && event.event === "cancellation-requested");
}

function watchdogDuration(request: LaunchRequest): { seconds: number; source: string } {
  if (typeof request.budget.wallClockAllocationSeconds === "number") {
    const spent = typeof request.budget.wallClockSpentSeconds === "number"
      ? request.budget.wallClockSpentSeconds
      : 0;
    const reserve = typeof request.budget.wallClockReserveSeconds === "number"
      ? request.budget.wallClockReserveSeconds
      : 0;
    return {
      seconds: Math.max(0.1, request.budget.wallClockAllocationSeconds - spent - reserve),
      source: "host:durable-task-wall-clock-allocation",
    };
  }
  return { seconds: Math.max(1, request.checkInSeconds * 2), source: "host:bounded-check-in-fallback" };
}

async function runSupervisor(configPath: string): Promise<void> {
  const config = JSON.parse(await readFile(configPath, "utf8")) as {
    request: LaunchRequest;
    handle: JobHandle;
  };
  const request = config.request;
  const handle = config.handle;
  const state = await loadState(handle.statePath);
  const startedMonotonic = monotonicSeconds();
  let current = await appendPrivateEvent(
    handle.statePath,
    privateEvent(handle.jobId, "launch", "launch-accepted", {
      roleChain: roleChainDetails(request.roleChain),
      source: "supervisor",
      returnCondition: "durable launch checkpoint",
      workspace: {
        class: "supervisor-owned-approved-private-workspace",
        mode: "0700",
        association: request.component,
      },
    }),
    {
      supervisorPid: process.pid,
      supervisorProcessGroupId: process.pid,
      status: "waiting",
      launchAcceptedAt: isoNow(),
    },
  );
  await traceSupervisorEvent(request, "control-plane.delegate", {
    "as_is.job_id": handle.jobId,
    "as_is.attempt": state.attempt,
    "as_is.outcome": "accepted",
  });
  await writeRecordCheckpoint(
    request.recordPath,
    makeCheckpoint(handle.jobId, "launch", "launch-accepted", {
      roleChain: roleChainDetails(request.roleChain),
      supervisorPid: process.pid,
      supervisorProcessGroupId: process.pid,
      workerRole: request.worker.role,
      processGroupOwnership: "supervisor owns setsid worker group",
      workspace: {
        class: "supervisor-owned-approved-private-workspace",
        mode: current.approvedWorkspaceMode,
        association: request.component,
      },
    }),
    "active",
  );

  await traceSupervisorEvent(request, "task-record.checkpoint", {
    "as_is.job_id": handle.jobId,
    "as_is.checkpoint": "launch-accepted",
  });

  const watchdog = watchdogDuration(request);
  const watchdogDeadlineAt = new Date(Date.now() + watchdog.seconds * 1000).toISOString();
  let watchdogTriggered = false;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  const stopTimers = (): void => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    if (watchdogTimer) clearTimeout(watchdogTimer);
    heartbeatTimer = null;
    watchdogTimer = null;
  };
  await traceSupervisorEvent(request, "supervisor.watchdog", {
    "as_is.job_id": handle.jobId,
    "as_is.deadline_seconds": watchdog.seconds,
  });
  current = await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "observe", "watchdog-configured", {
    source: "supervisor-watchdog",
    deadlineAt: watchdogDeadlineAt,
    deadlineSeconds: watchdog.seconds,
    deadlineSource: watchdog.source,
    heartbeatIntervalSeconds: Math.min(request.checkInSeconds / 2, watchdog.seconds / 2),
  }), { watchdogDeadlineAt });
  await writeRecordCheckpoint(request.recordPath, makeCheckpoint(handle.jobId, "observe", "watchdog-configured", {
    source: "supervisor-watchdog",
    deadlineAt: watchdogDeadlineAt,
    deadlineSeconds: watchdog.seconds,
    deadlineSource: watchdog.source,
    heartbeatIntervalSeconds: Math.min(request.checkInSeconds / 2, watchdog.seconds / 2),
  }));
  const heartbeatMilliseconds = Math.max(25, Math.min(1000, request.checkInSeconds * 500));
  heartbeatTimer = setInterval(() => {
    void appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "observe", "heartbeat", {
      source: "supervisor-watchdog",
      observedAt: isoNow(),
      deadlineAt: watchdogDeadlineAt,
    }), { heartbeatAt: isoNow() }).then(() => writeRecordCheckpoint(
      request.recordPath,
      makeCheckpoint(handle.jobId, "observe", "heartbeat", {
        source: "supervisor-watchdog",
        deadlineAt: watchdogDeadlineAt,
        observationClock: "host:utc-plus-monotonic-supervisor",
      }),
    )).catch(() => undefined);
  }, heartbeatMilliseconds);
  watchdogTimer = setTimeout(() => {
    watchdogTriggered = true;
    void appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "observe", "watchdog-deadline-exceeded", {
      source: "supervisor-watchdog",
      deadlineAt: watchdogDeadlineAt,
      termination: "SIGTERM owned worker process group",
    })).then(() => writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "observe", "watchdog-deadline-exceeded", {
      source: "supervisor-watchdog",
      deadlineAt: watchdogDeadlineAt,
      termination: "SIGTERM owned worker process group",
      recovery: "classify failed/stale durable evidence before bounded recovery",
    }), "failed")).then(async () => {
      const latest = await loadState(handle.statePath).catch(() => null);
      if (latest?.workerProcessGroupId) {
        try {
          process.kill(-latest.workerProcessGroupId, "SIGTERM");
        } catch {
          // Later host observation records an unknown or terminated group.
        }
      }
    }).catch(() => undefined);
  }, watchdog.seconds * 1000);

  await unlink(configPath).catch(() => undefined);
  const delayMilliseconds = request.startDelayMilliseconds ?? 0;
  if (delayMilliseconds > 0) {
    await writeRecordCheckpoint(
      request.recordPath,
      makeCheckpoint(handle.jobId, "observe", "waiting", {
        source: "private-supervisor-state",
        delayMilliseconds: request.startDelayMilliseconds,
        returnCondition: "worker remains unstarted while the bounded launch wait is due",
      }),
    );
    const delayDeadline = Date.now() + delayMilliseconds;
    while (Date.now() < delayDeadline) {
      if (await hasDurableCancellationRequest(request.recordPath, handle.jobId)) {
        stopTimers();
        await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "cancel", "cancellation-confirmed", {
          source: "supervisor",
          termination: "worker was not started",
          partialWorkPreserved: true,
        }), { status: "cancelled" });
        await writeRecordCheckpoint(request.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-confirmed", {
          source: "supervisor",
          termination: "worker was not started",
          partialWorkPreserved: true,
        }), "cancelled");
        return;
      }
      if (watchdogTriggered) {
        stopTimers();
        await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "observe", "failure", {
          source: "supervisor-watchdog",
          reason: "watchdog deadline elapsed before worker start",
        }), { status: "failed", workerFinishedAt: isoNow(), workerExitCode: null });
        await writeRecordCheckpoint(request.recordPath, makeCheckpoint(handle.jobId, "observe", "failure", {
          source: "supervisor-watchdog",
          reason: "watchdog deadline elapsed before worker start",
        }), "failed");
        return;
      }
      await sleep(Math.min(25, Math.max(1, delayDeadline - Date.now())));
    }
  }
  if (await hasDurableCancellationRequest(request.recordPath, handle.jobId)) {
    stopTimers();
    await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "cancel", "cancellation-confirmed", {
      source: "supervisor",
      termination: "worker was not started",
      partialWorkPreserved: true,
    }), { status: "cancelled" });
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-confirmed", {
      source: "supervisor",
      termination: "worker was not started",
      partialWorkPreserved: true,
    }), "cancelled");
    return;
  }
  let worker: ReturnType<typeof Bun.spawn>;
  try {
    // `setsid` is the process-group boundary.  It is intentionally not a
    // systemd fallback: this supervisor owns and addresses the group itself.
    worker = Bun.spawn(["setsid", ...request.worker.command], {
      cwd: current.approvedWorkspacePath,
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ...process.env,
        AS_IS_ROLE_CHAIN: REQUIRED_ROLE_CHAIN.join(" -> "),
        AS_IS_WORKER_ROLE: request.worker.role,
        AS_IS_PARENT_SESSION_ID: request.roleChain.orchestrator.sessionId,
        AS_IS_NO_INTERACTIVE_PROMPT: "1",
        AS_IS_APPROVED_WORKSPACE: current.approvedWorkspacePath,
        AS_IS_COMPONENT: request.component,
        AS_IS_RECORD_PATH: request.recordPath,
      },
    } as any);
  } catch (error) {
    stopTimers();
    const reason = error instanceof Error ? error.message : String(error);
    await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "launch", "unavailable", { source: "host-process", reason }), {
      status: "unavailable",
    });
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(handle.jobId, "launch", "unavailable", { source: "host-process", reason }), "blocked");
    return;
  }

  const workerPid = worker.pid;
  current = await appendPrivateEvent(
    handle.statePath,
    privateEvent(handle.jobId, "launch", "worker-started", {
      workerPid,
      processGroupId: workerPid,
      source: "host-process",
      role: request.worker.role,
      roleChain: roleChainDetails(request.roleChain),
      approvedWorkspace: current.approvedWorkspacePath,
    }),
    {
      status: "running",
      workerPid,
      workerProcessGroupId: workerPid,
      workerStartedAt: isoNow(),
    },
  );
  await traceSupervisorEvent(request, "component-build.worker", {
    "as_is.job_id": handle.jobId,
    "as_is.attempt": state.attempt,
    "as_is.worker_pid": workerPid,
    "as_is.outcome": "started",
  });
  await writeRecordCheckpoint(
    request.recordPath,
    makeCheckpoint(handle.jobId, "observe", "worker-started", {
      workerPid,
      processGroupId: workerPid,
      source: "host-process",
      role: request.worker.role,
      roleChain: roleChainDetails(request.roleChain),
      approvedWorkspace: current.approvedWorkspacePath,
    }),
  );

  const stdout = consumeOutput(worker.stdout as ReadableStream<Uint8Array>, current.logs.stdout, handle.statePath, handle.jobId, "worker.stdout");
  const stderr = consumeOutput(worker.stderr as ReadableStream<Uint8Array>, current.logs.stderr, handle.statePath, handle.jobId, "worker.stderr");
  const exitCode = await worker.exited;
  stopTimers();
  const [stdoutLines, stderrLines] = await Promise.all([stdout, stderr]);
  const wallClockSeconds = monotonicSeconds() - startedMonotonic;
  const latestRecord = await readDurableRecord(request.recordPath);
  const wasCancelled = (await loadState(handle.statePath)).cancellationRequestedAt !== null
    || latestRecord.events.some((event) => event.jobId === handle.jobId && event.event === "cancellation-requested");
  const status: HostStatus = wasCancelled ? "cancelled" : !watchdogTriggered && exitCode === 0 ? "completed" : "failed";
  const attemptUsage: AttemptUsage = {
    attempt: state.attempt,
    jobId: handle.jobId,
    reason: state.attemptReason,
    wallClockSeconds,
    cost: "unavailable",
    costSource: "host:supervisor-cost-not-reported",
    wallClockSource: "host:monotonic-supervisor-lifetime",
    accounted: true,
  };
  const beforeBudget = await loadState(handle.statePath);
  const alreadyAccounted = beforeBudget.attempts.some((attempt) => attempt.jobId === handle.jobId && attempt.accounted);
  const cumulativeWall = typeof beforeBudget.budget.wallClockSpentSeconds === "number"
    ? beforeBudget.budget.wallClockSpentSeconds + wallClockSeconds
    : "unavailable";
  // The supervisor has no provider billing surface. Once this attempt is
  // observed, cumulative cost is unavailable rather than a copied or guessed
  // prior value.
  const cumulativeCost: number | UnavailableValue = "unavailable";
  current = await appendPrivateEvent(
    handle.statePath,
    privateEvent(handle.jobId, "observe", "worker-exited", {
      source: "host-process",
      exitCode,
      stdoutLines,
      stderrLines,
      attempt: state.attempt,
      reason: state.attemptReason,
      jobId: handle.jobId,
      accounted: true,
      wallClockSeconds,
      wallClockSource: "host:monotonic-supervisor-lifetime",
      cost: "unavailable",
      costSource: "host:supervisor-cost-not-reported",
    }),
    {
      status,
      workerExitCode: exitCode,
      workerFinishedAt: isoNow(),
      attempts: alreadyAccounted ? beforeBudget.attempts : [...beforeBudget.attempts, attemptUsage],
      budget: {
        ...beforeBudget.budget,
        costSpent: cumulativeCost,
        costSource: "host:supervisor-cost-not-reported",
        wallClockSpentSeconds: cumulativeWall,
        wallClockSource: "host:monotonic-supervisor-lifetime",
      },
    },
  );
  await traceSupervisorEvent(request, "component-build.completed", {
    "as_is.job_id": handle.jobId,
    "as_is.attempt": state.attempt,
    "as_is.exit_code": exitCode,
    "as_is.outcome": status,
    "as_is.wall_clock_seconds": wallClockSeconds,
  });
  await writeRecordCheckpoint(
    request.recordPath,
    makeCheckpoint(handle.jobId, "observe", status === "failed" ? "failure" : status === "cancelled" ? "cancellation-confirmed" : "host-completed", {
      source: watchdogTriggered ? "supervisor-watchdog" : "host-process",
      exitCode,
      hostStatus: status,
      ...(watchdogTriggered ? { reason: "watchdog deadline exceeded" } : {}),
      wallClockSeconds,
      wallClockSource: "host:monotonic-supervisor-lifetime",
      cost: "unavailable",
      costSource: "host:supervisor-cost-not-reported",
      cumulativeWallClockSeconds: cumulativeWall,
      note: "host observation does not replace durable validation or handoff",
    }),
    status === "cancelled" ? "cancelled" : status === "failed" ? "failed" : undefined,
  );
  await writeRecordCheckpoint(
    request.recordPath,
    makeCheckpoint(handle.jobId, "observe", "budget-observed", {
      attempt: state.attempt,
      jobId: handle.jobId,
      reason: state.attemptReason,
      wallClockSeconds,
      wallClockSource: "host:monotonic-supervisor-lifetime",
      cost: "unavailable",
      costSource: "host:supervisor-cost-not-reported",
      accounted: true,
      cumulativeCost: cumulativeCost,
      cumulativeCostSource: typeof cumulativeCost === "number" ? beforeBudget.budget.costSource : "host:supervisor-cost-not-reported",
      cumulativeWallClockSeconds: cumulativeWall,
      cumulativeWallClockSource: "host:monotonic-supervisor-lifetime",
      reserveCost: beforeBudget.budget.costReserve,
      reserveWallClockSeconds: beforeBudget.budget.wallClockReserveSeconds,
      noDoubleCounting: true,
    }),
  );
  // Keep the final local variable live until all durable writes have happened;
  // cleanup is a separate, later operation.
  void current;
}

async function spawnDetachedSupervisor(request: LaunchRequest, handle: JobHandle, configPath: string): Promise<{ pid: number }> {
  const supervisorScript = fileURLToPath(import.meta.url);
  let processHandle: ReturnType<typeof Bun.spawn>;
  try {
    processHandle = Bun.spawn(["setsid", process.execPath, supervisorScript, "--supervise", configPath], {
      cwd: request.projectRoot ?? process.cwd(),
      stdin: "ignore",
      stdout: "ignore",
      stderr: "ignore",
      detached: true,
    } as any);
  } catch (error) {
    throw new Error(`unavailable detached supervisor: ${error instanceof Error ? error.message : String(error)}`);
  }
  return { pid: processHandle.pid };
}

async function waitForLaunchCheckpoint(handle: JobHandle, timeoutMilliseconds: number): Promise<DurableRecordObservation> {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    const record = await readDurableRecord(handle.recordPath);
    if (record.events.some((event) => event.jobId === handle.jobId && ["launch-accepted", "unavailable"].includes(event.event))) return record;
    await sleep(10);
  }
  return readDurableRecord(handle.recordPath);
}

export async function launch(request: LaunchRequest, timeoutMilliseconds = 3000): Promise<{ outcome: ExecutionOutcome; handle: JobHandle; record: DurableRecordObservation }> {
  validateRequest(request);
  const record = await readDurableRecord(request.recordPath);
  const expected = request.expectedRecordStatus ?? (request.recovery ? "active" : "ready");
  if (record.status !== expected) {
    throw new Error(`rejected: durable record status is ${record.status}; expected ${expected}`);
  }
  if (request.recordRevision && request.recordRevision !== "unprovided" && request.recordRevision !== record.updated) {
    throw new Error("rejected: durable record revision is newer or does not match the launch request");
  }
  if (request.permissionFingerprint) {
    const approved = [...record.events].reverse().find((event) =>
      event.event === "permission-approved"
      && event.details.fingerprint === request.permissionFingerprint
      && event.details.permissionState === "approved",
    );
    if (!approved) throw new Error("rejected: scoped permission approval is not durable for this launch");
  }
  if (request.recovery) {
    if (new Date(request.recovery.dueAt).getTime() > Date.now()) throw new Error("waiting: recovery backoff is not due");
    const prior = record.events.find((event) => event.jobId === request.recovery?.previousJobId && event.event === "recovery-scheduled");
    if (!prior) throw new Error("rejected: recovery authorization is not durable");
  }
  const effectiveRequest: LaunchRequest = {
    ...request,
    budget: carryForwardBudget(request.budget, record),
  };
  const jobId = randomUUID();
  const runId = request.runId ?? randomUUID();
  const runtimeDir = makeRuntimeDir(effectiveRequest, runId, jobId);
  const workspacePath = join(runtimeDir, "workspace");
  const statePath = join(runtimeDir, "state.json");
  const handle: JobHandle = {
    jobId,
    component: request.component,
    recordPath: request.recordPath,
    runtimeDir,
    workspacePath,
    statePath,
    attempt: request.recovery?.attempt ?? 1,
  };
  const operation = request.recovery ? "recover" : "launch";
  if (request.worker.available === false) {
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "worker-unavailable", {
      source: "configured-worker-discovery",
      worker: request.worker.role,
      reason: "configured implementer is unavailable",
      replacement: "not permitted without explicit recorded direction",
    }), "blocked");
    return { outcome: "unavailable", handle, record: await readDurableRecord(request.recordPath) };
  }
  const budgetBlocker = admissionBlocker(effectiveRequest.budget);
  if (budgetBlocker) {
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "budget-blocked", {
      source: "durable-record",
      reason: budgetBlocker,
      cumulativeCost: effectiveRequest.budget.costSpent,
      cumulativeWallClockSeconds: effectiveRequest.budget.wallClockSpentSeconds,
      retainedReserve: {
        cost: effectiveRequest.budget.costReserve,
        wallClockSeconds: effectiveRequest.budget.wallClockReserveSeconds,
      },
      configuredWorker: "implementer",
    }), "blocked");
    return { outcome: "rejected", handle, record: await readDurableRecord(request.recordPath) };
  }
  await mkdir(runtimeDir, { recursive: true, mode: 0o700 });
  await chmod(runtimeDir, 0o700);
  const preflight = await capabilityPreflight(effectiveRequest, runtimeDir, workspacePath);
  if (!preflight.ok) {
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "capability-preflight-failed", {
      source: "host-capability-preflight",
      failures: preflight.failures,
      ...preflight.details,
      blocker: "worker-loss/capability",
      configuredWorker: "implementer",
      recovery: "retain durable blocker and stop; no role substitution or retry loop",
    }), "blocked");
    await rm(runtimeDir, { recursive: true, force: true });
    return { outcome: "unavailable", handle, record: await readDurableRecord(request.recordPath) };
  }
  await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "capability-preflight-passed", {
    ...preflight.details,
    capabilities: effectiveRequest.capabilities,
  }));
  const state = initialState(effectiveRequest, jobId, runtimeDir, workspacePath, durableAttemptHistory(record));
  await atomicJson(statePath, state);
  await writeRecordCheckpoint(
    request.recordPath,
    makeCheckpoint(jobId, operation, request.recovery ? "recovery-launch-requested" : "launch-requested", {
      configuredWorker: "implementer",
      roleChain: [...REQUIRED_ROLE_CHAIN],
      recordRevision: request.recordRevision ?? record.updated ?? "unprovided",
      returnCondition: "launch-accepted durable checkpoint",
      privateRuntime: "disposable host observation only",
      preflight: preflight.details,
      ...(request.recovery ? { recovery: request.recovery } : {}),
    }),
    "active",
  );
  const configPath = join(runtimeDir, "config.json");
  await atomicJson(configPath, { request: effectiveRequest, handle });
  let supervisorPid: number;
  try {
    supervisorPid = (await spawnDetachedSupervisor(effectiveRequest, handle, configPath)).pid;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    await appendPrivateEvent(statePath, privateEvent(jobId, operation, "unavailable", { source: "host-process", reason }), { status: "unavailable" });
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "unavailable", { source: "host-process", reason }), "blocked");
    return { outcome: "unavailable", handle, record: await readDurableRecord(request.recordPath) };
  }
  await appendPrivateEvent(statePath, privateEvent(jobId, operation, "supervisor-started", {
    source: "host-process",
    supervisorPid,
    supervisorProcessGroupId: supervisorPid,
    roleChain: roleChainDetails(request.roleChain),
  }), { supervisorPid, supervisorProcessGroupId: supervisorPid });
  const childWaitSpan: SpanLifecycle = startSpan("child-wait", {
    cwd: effectiveRequest.projectRoot ?? process.cwd(),
    traceId: effectiveRequest.traceId ?? runId,
    config: effectiveRequest.tracer,
    emit: async (event, cwd, config) => {
      await emitTrace(event, cwd, config);
    },
  });
  let launchRecord: DurableRecordObservation;
  try {
    launchRecord = await waitForLaunchCheckpoint(handle, timeoutMilliseconds);
  } catch (error) {
    await childWaitSpan.finish("failure", { phase: "child-wait" });
    throw error;
  }
  const accepted = launchRecord.events.some((event) => event.jobId === jobId && event.event === "launch-accepted");
  const unavailable = launchRecord.events.some((event) => event.jobId === jobId && event.event === "unavailable");
  await childWaitSpan.finish(accepted ? "success" : "failure", { phase: "child-wait" });
  if (!accepted && !unavailable) {
    await writeRecordCheckpoint(request.recordPath, makeCheckpoint(jobId, operation, "unavailable", {
      source: "host-process",
      reason: "supervisor did not publish launch checkpoint before control-plane deadline",
    }), "blocked");
    return { outcome: "unavailable", handle, record: await readDurableRecord(request.recordPath) };
  }
  return { outcome: unavailable ? "unavailable" : "started", handle, record: launchRecord };
}

export async function observe(handle: JobHandle): Promise<JobObservation> {
  const record = await readDurableRecord(handle.recordPath);
  let state: PrivateState | null = null;
  try {
    state = await loadState(handle.statePath);
  } catch {
    state = null;
  }
  const health: ProcessHealth = {
    source: "host-process",
    supervisorPid: state?.supervisorPid ?? null,
    supervisorProcessGroupId: state?.supervisorProcessGroupId ?? null,
    workerPid: state?.workerPid ?? null,
    processGroupId: state?.workerProcessGroupId ?? null,
    supervisorAlive: await processAlive(state?.supervisorPid ?? null),
    supervisorProcessGroupAlive: await groupAlive(state?.supervisorProcessGroupId ?? null),
    workerAlive: await processAlive(state?.workerPid ?? null),
    processGroupAlive: await groupAlive(state?.workerProcessGroupId ?? null),
    observedAt: isoNow(),
  };
  const stale = state ? classifyStale(record, state.checkInSeconds) : { status: "unknown", source: "durable-record", reason: "private state unavailable" } as const;
  if (state) {
    await writeRecordObservation(handle.recordPath, makeCheckpoint(handle.jobId, "observe", "observation", {
      durableStatus: record.status,
      hostStatus: state.status,
      health,
      stale,
      source: "durable-record-plus-host-process",
    }));
  }
  const budget = state
    ? { cumulative: state.budget, attempts: state.attempts }
    : null;
  return {
    outcome: outcomeFor(record, state),
    jobId: handle.jobId,
    record,
    host: {
      source: "private-supervisor-state",
      status: state ? hostStatusFromState(state) : "unavailable",
      workerExitCode: state?.workerExitCode ?? null,
      launchAccepted: Boolean(record.events.find((event) => event.jobId === handle.jobId && event.event === "launch-accepted")),
      workerProcessGroupId: state?.workerProcessGroupId ?? null,
      logs: state ? { stdout: state.logs.stdout, stderr: state.logs.stderr } : { stdout: null, stderr: null },
    },
    health,
    budget,
    stale,
  };
}

function permissionFingerprint(scope: PermissionScope): string {
  const normalized = {
    capabilityClass: scope.capabilityClass.trim().toLowerCase(),
    operation: scope.operation.trim().toLowerCase(),
    resourceClass: scope.resourceClass.trim().toLowerCase(),
    failureClass: scope.failureClass.trim().toLowerCase(),
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex").slice(0, 24);
}

function assertPermissionScope(scope: PermissionScope): void {
  for (const [name, value] of Object.entries(scope)) {
    if (!value.trim()) throw new Error(`rejected: permission ${name} is required`);
  }
}

export interface PermissionResult {
  outcome: "waiting" | "approved" | "denied" | "unavailable";
  fingerprint: string;
  record: DurableRecordObservation;
  reason?: string;
}

/**
 * Persist the permission request before invoking the host's user-event path.
 * The bridge is deliberately explicit: without one, this operation records a
 * capability blocker instead of simulating a prompt or approval.
 */
export async function recordPermissionNeeded(
  handle: JobHandle,
  request: PermissionNeededRequest,
  bridge?: PermissionEscalationBridge,
): Promise<PermissionResult> {
  assertPermissionScope(request);
  if (!request.reason.trim()) throw new Error("rejected: permission reason is required");
  const before = await readDurableRecord(handle.recordPath);
  if (before.status === "completed" || before.status === "cancelled") {
    throw new Error(`rejected: task is already ${before.status}`);
  }
  if (request.recordRevision && request.recordRevision !== "unprovided" && request.recordRevision !== before.updated) {
    throw new Error("rejected: permission request record revision is stale");
  }
  const scope: PermissionScope = {
    operation: request.operation,
    capabilityClass: request.capabilityClass,
    resourceClass: request.resourceClass,
    failureClass: request.failureClass,
  };
  const fingerprint = permissionFingerprint(scope);
  const recordRevision = before.updated ?? "unavailable";
  const event: PermissionNeededEvent = {
    event: "permission-needed",
    source: "supervisor-permission-boundary",
    jobId: handle.jobId,
    recordRevision,
    scope,
    reason: request.reason,
    fingerprint,
    permissionState: "awaiting-user-approval",
  };
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "question", "permission-needed", {
    source: event.source,
    operation: scope.operation,
    capabilityClass: scope.capabilityClass,
    resourceClass: scope.resourceClass,
    failureClass: scope.failureClass,
    recordRevision,
    reason: request.reason,
    fingerprint,
    approvalDecision: "awaiting-user-approval",
    permissionState: "awaiting-user-approval",
    hiddenPrompt: false,
    userVisibleEscalationRequired: true,
  }), "awaiting-approval");
  if (!bridge || !bridge.source.trim()) {
    const reason = "user-visible permission-event bubbling is unproven";
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "question", "permission-escalation-unproven", {
      source: "host-capability-preflight",
      fingerprint,
      reason,
      blocker: "worker-loss/capability",
      nextAction: "obtain a supported user-event bridge; do not simulate approval or retry",
    }), "blocked");
    return { outcome: "unavailable", fingerprint, record: await readDurableRecord(handle.recordPath), reason };
  }
  let decision: "approved" | "denied" | "unavailable";
  try {
    decision = await bridge.present(event);
  } catch (error) {
    const reason = `permission escalation failed: ${error instanceof Error ? error.message : String(error)}`;
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "question", "permission-escalation-unavailable", {
      source: bridge.source,
      fingerprint,
      reason,
      blocker: "worker-loss/capability",
    }), "blocked");
    return { outcome: "unavailable", fingerprint, record: await readDurableRecord(handle.recordPath), reason };
  }
  if (decision === "unavailable") {
    const reason = "permission bridge returned unavailable; no approval was inferred";
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "question", "permission-escalation-unavailable", {
      source: bridge.source,
      fingerprint,
      reason,
      blocker: "worker-loss/capability",
    }), "blocked");
    return { outcome: "unavailable", fingerprint, record: await readDurableRecord(handle.recordPath), reason };
  }
  return answerPermission(handle, fingerprint, decision);
}

export async function answerPermission(
  handle: JobHandle,
  fingerprint: string,
  decision: "approved" | "denied",
): Promise<PermissionResult> {
  const record = await readDurableRecord(handle.recordPath);
  const needed = [...record.events].reverse().find((event) => event.jobId === handle.jobId && event.event === "permission-needed");
  if (!needed || needed.details.fingerprint !== fingerprint) {
    throw new Error("rejected: permission answer is not scoped to the current durable request");
  }
  if (record.status !== "awaiting-approval") {
    throw new Error(`rejected: permission request is not awaiting approval (${record.status})`);
  }
  const permissionState = decision === "approved" ? "approved" : "denied";
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "question", `permission-${decision}`, {
    source: "durable-user-decision",
    fingerprint,
    permissionState,
    scopedTo: {
      recordRevision: needed.details.recordRevision,
      operation: needed.details.operation,
      capabilityClass: needed.details.capabilityClass,
      resourceClass: needed.details.resourceClass,
      failureClass: needed.details.failureClass,
    },
    automaticRetry: false,
  }), decision === "denied" ? "blocked" : "awaiting-approval");
  return {
    outcome: decision,
    fingerprint,
    record: await readDurableRecord(handle.recordPath),
  };
}

export async function resumeAfterApproval(
  handle: JobHandle,
  request: LaunchRequest,
): Promise<{ outcome: ExecutionOutcome; handle: JobHandle; record: DurableRecordObservation }> {
  const record = await readDurableRecord(handle.recordPath);
  const approval = [...record.events].reverse().find((event) => event.jobId === handle.jobId && event.event === "permission-approved");
  const fingerprint = approval?.details.fingerprint;
  if (record.status !== "awaiting-approval" || typeof fingerprint !== "string") {
    throw new Error("rejected: no scoped durable permission approval is available to resume");
  }
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "resume", "permission-resume-authorized", {
    source: "durable-user-decision",
    fingerprint,
    permissionState: "approved",
    rereadRecord: true,
  }), "active");
  return launch({
    ...request,
    expectedRecordStatus: "active",
    permissionFingerprint: fingerprint,
    recordRevision: "unprovided",
  });
}

export async function requestCancellation(handle: JobHandle, reason: string): Promise<JobObservation> {
  if (!reason.trim()) throw new Error("rejected: cancellation reason is required");
  const before = await readDurableRecord(handle.recordPath);
  if (before.status === "completed" || before.status === "cancelled") throw new Error(`rejected: task is already ${before.status}`);
  const requestedAt = isoNow();
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-requested", {
    reason,
    source: "durable-orchestrator-request",
    returnCondition: "durable cancellation request before host signal",
  }));
  let state = await loadState(handle.statePath).catch(() => null);
  if (!state) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-host-unavailable", {
      source: "private-supervisor-state",
      reason: "private state is unavailable; durable cancellation remains authoritative",
      recovery: "retain durable partial/audit evidence and observe later",
    }));
    return observe(handle);
  }
  state = await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "cancel", "cancellation-requested", { reason, source: "durable-record" }), {
    status: "cancelling",
    cancellationRequestedAt: requestedAt,
  });
  const group = state.workerProcessGroupId;
  let signalSent = false;
  if (group && (await groupAlive(group)) === true) {
    try {
      process.kill(-group, "SIGTERM");
      signalSent = true;
    } catch (error) {
      const signalError = error instanceof Error ? error.message : String(error);
      await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-signal-unavailable", { source: "host-process", signalError }));
    }
  }
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-dispatched", {
    source: "host-process",
    processGroupId: group,
    signal: signalSent ? "SIGTERM" : "not-sent",
  }));
  return observe(handle);
}

export async function confirmCancellation(handle: JobHandle, timeoutMilliseconds = 3000): Promise<JobObservation> {
  const deadline = Date.now() + timeoutMilliseconds;
  let escalated = false;
  while (Date.now() < deadline) {
    const state = await loadState(handle.statePath).catch(() => null);
    if (!state) {
      await sleep(25);
      continue;
    }
    const alive = await groupAlive(state?.workerProcessGroupId ?? null);
    const supervisorAlive = await processAlive(state?.supervisorPid ?? null);
    const supervisorGroupAlive = await groupAlive(state?.supervisorProcessGroupId ?? null);
    if (alive === false && supervisorAlive === false && supervisorGroupAlive === false) {
      await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-confirmed", {
        source: "host-process",
        processGroupId: state?.workerProcessGroupId ?? null,
        supervisorPid: state?.supervisorPid ?? null,
        supervisorProcessGroupId: state?.supervisorProcessGroupId ?? null,
        termination: "confirmed process group absent",
        partialWorkPreserved: true,
      }), "cancelled");
      if (state && state.status !== "cancelled") {
        await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "cancel", "cancellation-confirmed", { source: "host-process" }), { status: "cancelled" });
      }
      return observe(handle);
    }
    if (alive === true && !escalated && Date.now() + 250 >= deadline) {
      await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-escalated", {
        source: "host-process",
        processGroupId: state?.workerProcessGroupId ?? null,
        signal: "SIGKILL",
      }));
      if (state?.workerProcessGroupId) {
        try {
          process.kill(-state.workerProcessGroupId, "SIGKILL");
        } catch {
          // The next observation records unknown/unavailable if the host races
          // process-group disappearance.
        }
      }
      escalated = true;
    }
    await sleep(25);
  }
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cancel", "cancellation-waiting", {
    source: "host-process",
    reason: "process-group termination not yet confirmed",
    recovery: "retain private runtime for later observation",
  }));
  return observe(handle);
}

export async function classifyAndRecordStale(handle: JobHandle, now = new Date()): Promise<StaleObservation> {
  const state = await loadState(handle.statePath);
  const record = await readDurableRecord(handle.recordPath);
  const stale = classifyStale(record, state.checkInSeconds, now);
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "observe", "stale-classification", {
    source: "durable-record",
    stale,
    checkpoint: record.updated,
    checkInSeconds: state.checkInSeconds,
    observationClock: now.toISOString(),
  }));
  return stale;
}

export interface RecoveryResult {
  outcome: "waiting" | "rejected" | "unavailable";
  attempt: number;
  dueAt: string | null;
  delaySeconds: number | null;
  request?: LaunchRequest;
  reason: string;
}

function recoveryBlockerFingerprint(reason: string, blocker?: PermissionScope): string {
  const normalized = blocker
    ? {
        capabilityClass: blocker.capabilityClass.trim().toLowerCase(),
        operation: blocker.operation.trim().toLowerCase(),
        resourceClass: blocker.resourceClass.trim().toLowerCase(),
        failureClass: blocker.failureClass.trim().toLowerCase(),
      }
    : { reason: reason.trim().toLowerCase().replace(/\s+/g, " ") };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex").slice(0, 24);
}

export async function scheduleRecovery(
  handle: JobHandle,
  reason: string,
  options: { now?: Date; maxRecoveryAttempts?: number; retryBackoffSeconds?: number; blocker?: PermissionScope } = {},
): Promise<RecoveryResult> {
  if (!reason.trim()) throw new Error("rejected: recovery reason is required");
  const state = await loadState(handle.statePath);
  const record = await readDurableRecord(handle.recordPath);
  if (record.status === "completed" || record.status === "cancelled") {
    return { outcome: "rejected", attempt: state.recovery.attempts + 1, dueAt: null, delaySeconds: null, reason: `task is terminal: ${record.status}` };
  }
  const max = options.maxRecoveryAttempts ?? state.maxRecoveryAttempts;
  const nextAttempt = state.recovery.attempts + 1;
  const fingerprint = recoveryBlockerFingerprint(reason, options.blocker);
  const repeated = record.events.some((event) =>
    event.jobId === handle.jobId
    && event.event === "recovery-blocker"
    && event.details.fingerprint === fingerprint,
  );
  if (repeated) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "recover", "recovery-escalated", {
      source: "durable-record",
      reason: "repeated blocker fingerprint suppressed automatic retry",
      fingerprint,
      repeatedBlocker: true,
      nextAction: "surface blocker for explicit direction; do not retry automatically",
      configuredWorker: "implementer",
    }), "blocked");
    await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "recover", "recovery-escalated", {
      source: "durable-record",
      fingerprint,
      repeatedBlocker: true,
    }), {
      status: "unavailable",
      recovery: { ...state.recovery, escalation: "repeated blocker fingerprint" },
    });
    return {
      outcome: "rejected",
      attempt: nextAttempt,
      dueAt: null,
      delaySeconds: null,
      reason: "repeated blocker fingerprint suppressed automatic retry",
    };
  }
  if (nextAttempt > max) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "recover", "recovery-escalated", {
      source: "durable-record",
      reason,
      maxRecoveryAttempts: max,
      attempted: state.recovery.attempts,
      replacement: "not permitted without explicit recorded direction",
    }), "blocked");
    await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "recover", "recovery-escalated", { reason, maxRecoveryAttempts: max }), {
      status: "unavailable",
      recovery: { ...state.recovery, escalation: "max recovery attempts exhausted" },
    });
    return { outcome: "rejected", attempt: nextAttempt, dueAt: null, delaySeconds: null, reason: "max recovery attempts exhausted" };
  }
  const costExhausted = budgetDimensionExhausted(
    state.budget.costAllocation,
    state.budget.costSpent,
    state.budget.costReserve,
  );
  const wallExhausted = budgetDimensionExhausted(
    state.budget.wallClockAllocationSeconds,
    state.budget.wallClockSpentSeconds,
    state.budget.wallClockReserveSeconds,
  );
  if (costExhausted === true || wallExhausted === true) {
    const reasonText = costExhausted === true
      ? "cost allocation after retained reserve is exhausted"
      : "wall-clock allocation after retained reserve is exhausted";
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "recover", "budget-blocked", {
      source: "durable-record",
      reason: reasonText,
      cumulativeCost: state.budget.costSpent,
      cumulativeWallClockSeconds: state.budget.wallClockSpentSeconds,
      reserveCost: state.budget.costReserve,
      reserveWallClockSeconds: state.budget.wallClockReserveSeconds,
    }), "blocked");
    return { outcome: "rejected", attempt: nextAttempt, dueAt: null, delaySeconds: null, reason: reasonText };
  }
  const delaySeconds = (options.retryBackoffSeconds ?? state.retryBackoffSeconds) * 2 ** (nextAttempt - 1);
  const now = options.now ?? new Date();
  const dueAt = new Date(now.getTime() + delaySeconds * 1000).toISOString();
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "recover", "recovery-blocker", {
    source: "durable-record",
    fingerprint,
    capability: options.blocker?.capabilityClass ?? "unclassified",
    operation: options.blocker?.operation ?? "recovery",
    resourceClass: options.blocker?.resourceClass ?? "durable-task",
    failureClass: options.blocker?.failureClass ?? "recovery-failure",
    reason,
  }));
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "recover", "recovery-scheduled", {
    source: "durable-record",
    reason,
    attempt: nextAttempt,
    delaySeconds,
    dueAt,
    maxRecoveryAttempts: max,
    cumulativeCost: state.budget.costSpent,
    cumulativeWallClockSeconds: state.budget.wallClockSpentSeconds,
    retainedReserve: { cost: state.budget.costReserve, wallClockSeconds: state.budget.wallClockReserveSeconds },
    configuredWorker: "implementer",
    blockerFingerprint: fingerprint,
  }));
  await appendPrivateEvent(handle.statePath, privateEvent(handle.jobId, "recover", "recovery-scheduled", { reason, attempt: nextAttempt, delaySeconds, dueAt }), {
    recovery: { ...state.recovery, attempts: nextAttempt, nextDueAt: dueAt },
  });
  return { outcome: "waiting", attempt: nextAttempt, dueAt, delaySeconds, reason };
}

export async function recover(
  handle: JobHandle,
  request: LaunchRequest,
  reason: string,
  options: { now?: Date; maxRecoveryAttempts?: number; retryBackoffSeconds?: number; blocker?: PermissionScope } = {},
): Promise<RecoveryResult> {
  const scheduled = await scheduleRecovery(handle, reason, options);
  await emitTrace({
    name: scheduled.outcome === "waiting" ? "recovery.scheduled" : "recovery.escalated",
    traceId: request.traceId ?? request.runId ?? request.component,
    spanId: randomUUID().replaceAll("-", "").slice(0, 16),
    attributes: {
      "as_is.run_id": request.runId,
      "as_is.component_path": request.component,
      "as_is.job_id": handle.jobId,
      "as_is.attempt": scheduled.attempt,
      "as_is.reason_digest": createHash("sha256").update(reason).digest("hex").slice(0, 16),
      "as_is.outcome": scheduled.outcome,
    },
  }, request.projectRoot ?? process.cwd(), request.tracer);
  if (scheduled.outcome !== "waiting" || !scheduled.dueAt) return scheduled;
  if (new Date(scheduled.dueAt).getTime() > Date.now()) return scheduled;
  const authorizedRequest: LaunchRequest = {
    ...request,
    expectedRecordStatus: "active",
    recovery: {
      attempt: scheduled.attempt,
      reason,
      dueAt: scheduled.dueAt,
      previousJobId: handle.jobId,
    },
  };
  const launched = await launch(authorizedRequest);
  return {
    ...scheduled,
    outcome: launched.outcome === "unavailable" ? "unavailable" : "waiting",
    request: authorizedRequest,
  };
}

export async function recordHandoff(
  handle: JobHandle,
  evidence: { validation: string[]; result: string; descendantsTerminal: boolean; failedOrCancelledDescendants: string[] },
): Promise<DurableRecordObservation> {
  if (evidence.validation.length === 0 || !evidence.result.trim()) {
    throw new Error("rejected: validation evidence and result are required");
  }
  if (!evidence.descendantsTerminal) throw new Error("rejected: descendants are not terminal");
  const record = await readDurableRecord(handle.recordPath);
  if (record.status === "completed") throw new Error("rejected: task is already completed");
  const state = await loadState(handle.statePath);
  if (state.status !== "completed") {
    throw new Error("rejected: host completion is not observed; process exit alone cannot create a handoff");
  }
  await traceSupervisorEvent({
    component: handle.component,
    recordPath: handle.recordPath,
    projectRoot: dirname(handle.recordPath),
    runId: undefined,
    traceId: undefined,
    roleChain: state.roleChain,
    worker: { role: state.roleChain.implementer.role, command: [] },
    budget: state.budget,
    checkInSeconds: state.checkInSeconds,
  }, "validation.handoff", {
    "as_is.job_id": handle.jobId,
    "as_is.outcome": "accepted",
    "as_is.validation_count": evidence.validation.length,
    "as_is.failed_descendant_count": evidence.failedOrCancelledDescendants.length,
  });
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "handoff", "handoff-evidence", {
    source: "implementer-durable-record",
    validation: evidence.validation,
    result: evidence.result,
    descendantsTerminal: true,
    failedOrCancelledDescendants: evidence.failedOrCancelledDescendants,
    privateRuntimeMayBeRemoved: true,
  }), "completed");
  return readDurableRecord(handle.recordPath);
}

export async function cleanup(handle: JobHandle): Promise<{ cleaned: boolean; reason?: string }> {
  const record = await readDurableRecord(handle.recordPath);
  let state: PrivateState;
  try {
    state = await loadState(handle.statePath);
  } catch {
    const alreadyRecorded = record.events.some((event) => event.jobId === handle.jobId && event.event === "cleanup-complete");
    return alreadyRecorded
      ? { cleaned: true }
      : { cleaned: false, reason: "private state is unavailable without durable cleanup evidence" };
  }
  const group = await groupAlive(state.workerProcessGroupId);
  if (group !== false) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cleanup", "cleanup-deferred", {
      source: "host-process",
      reason: "process-group termination is not confirmed",
      processGroupId: state.workerProcessGroupId,
      processGroupAlive: group,
    }));
    return { cleaned: false, reason: "process group still owned or health unavailable" };
  }
  const supervisor = await processAlive(state.supervisorPid);
  if (supervisor !== false) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cleanup", "cleanup-deferred", {
      source: "host-process",
      reason: "supervisor termination is not confirmed",
      supervisorPid: state.supervisorPid,
      supervisorAlive: supervisor,
    }));
    return { cleaned: false, reason: "supervisor still owned or health unavailable" };
  }
  const supervisorGroup = await groupAlive(state.supervisorProcessGroupId);
  if (supervisorGroup !== false) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cleanup", "cleanup-deferred", {
      source: "host-process",
      reason: "supervisor process-group termination is not confirmed",
      supervisorProcessGroupId: state.supervisorProcessGroupId,
      supervisorProcessGroupAlive: supervisorGroup,
    }));
    return { cleaned: false, reason: "supervisor process group still owned or health unavailable" };
  }
  const terminalHost = ["completed", "failed", "cancelled", "unavailable"].includes(state.status);
  const terminalRecord = ["completed", "failed", "cancelled", "blocked"].includes(record.status);
  const hasHandoff = record.events.some((event) => event.jobId === handle.jobId && event.event === "handoff-evidence");
  if (!terminalHost || (!terminalRecord && !hasHandoff)) {
    return { cleaned: false, reason: "durable failure/cancellation/handoff evidence is not complete" };
  }
  await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cleanup", "cleanup-complete", {
    source: "host-process",
    processGroupId: state.workerProcessGroupId,
    processGroupAlive: false,
    supervisorPid: state.supervisorPid,
    supervisorAlive: false,
    supervisorProcessGroupId: state.supervisorProcessGroupId,
    supervisorProcessGroupAlive: false,
    retainedEvidence: "durable task record",
    removed: ["private state", "source-labelled logs", "private config"],
  }));
  try {
    await rm(handle.runtimeDir, { recursive: true, force: true });
  } catch (error) {
    await writeRecordCheckpoint(handle.recordPath, makeCheckpoint(handle.jobId, "cleanup", "cleanup-failed", {
      source: "host-filesystem",
      reason: error instanceof Error ? error.message : String(error),
      durableEvidenceRetained: true,
    }));
    return { cleaned: false, reason: "private runtime removal failed" };
  }
  // The record remains authoritative.  A missing private state on a later
  // observation is reported as unavailable, never as implicit success.
  return { cleaned: true };
}

export async function noLeftover(handle: JobHandle): Promise<{
  processGroupAlive: boolean | "unknown";
  supervisorAlive: boolean | "unknown";
  supervisorProcessGroupAlive: boolean | "unknown";
  runtimeExists: boolean;
}> {
  let state: PrivateState | null = null;
  try {
    state = await loadState(handle.statePath);
  } catch {
    state = null;
  }
  let processGroupAlive: boolean | "unknown" = state ? await groupAlive(state.workerProcessGroupId) : "unknown";
  let supervisorAlive: boolean | "unknown" = state
    ? await processAlive(state.supervisorPid)
    : "unknown";
  let supervisorProcessGroupAlive: boolean | "unknown" = state
    ? await groupAlive(state.supervisorProcessGroupId)
    : "unknown";
  let runtimeExists = true;
  try {
    await readFile(handle.statePath);
  } catch {
    runtimeExists = false;
  }
  if (!state && !runtimeExists) {
    const record = await readDurableRecord(handle.recordPath);
    const cleanup = [...record.events].reverse().find((event) => event.jobId === handle.jobId && event.event === "cleanup-complete");
    const supervisorPid = cleanup?.details.supervisorPid;
    const processGroupId = cleanup?.details.processGroupId;
    if (cleanup && (typeof processGroupId === "number" || processGroupId === null)) {
      processGroupAlive = await groupAlive(processGroupId);
    }
    if (typeof supervisorPid === "number") supervisorAlive = await processAlive(supervisorPid);
    const supervisorProcessGroupId = cleanup?.details.supervisorProcessGroupId;
    if (typeof supervisorProcessGroupId === "number" || supervisorProcessGroupId === null) {
      supervisorProcessGroupAlive = await groupAlive(supervisorProcessGroupId);
    }
  }
  return { processGroupAlive, supervisorAlive, supervisorProcessGroupAlive, runtimeExists };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args[0] === "--supervise" && args[1]) {
    await runSupervisor(args[1]);
    return;
  }
  throw new Error("supervisor.ts is a library; --supervise is an internal mode");
}

// Keep syntax/build checks and library imports side-effect free. The detached
// child is the only supported executable path and always carries --supervise.
if (import.meta.main && process.argv.includes("--supervise")) {
  await main();
}
