import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

import {
  REQUIRED_ROLE_CHAIN,
  cleanup as cleanupSupervisor,
  launch as launchSupervisor,
  readDurableRecord,
  requestCancellation as requestSupervisorCancellation,
  validateRoleChain,
  type DurableCheckpoint,
  type DurableRecordObservation,
  type ExecutionOutcome,
  type JobHandle,
  type LaunchRequest,
  type RoleChain,
  type UsageBudget,
} from "../subprocess-execution-foundation/supervisor.ts";

/**
 * The OpenCode boundary is deliberately small.  The durable record supplies
 * the component, worker, task definition, and budget.  The caller supplies
 * only the already-resolved host mapping and the parent attribution that
 * authorized this launch.
 */

export const ADAPTER_ID = "opencode-launch-adapter";
export const LAUNCH_MODE = "supervisor-owned-detached" as const;

export interface ParentContext {
  componentPath: string;
  role: "orchestrator";
  sessionId: string;
  parentSessionId: string;
}

export interface ProactivePermissionProfile {
  source: string;
  approvedWorkspace: boolean;
  processGroupControl: boolean;
  standardInput: "disabled" | "interactive";
  eventPersistence: boolean;
  watchdog: boolean;
  userEventBubbling: boolean;
}

export interface ResolvedOpenCodeJobSpecification {
  adapter: "opencode";
  executionMode: typeof LAUNCH_MODE;
  componentPath: string;
  workerRole: string;
  command: string[];
  permissionProfile: ProactivePermissionProfile;
  checkInSeconds: number;
  available?: boolean;
  /** A bounded delay is test/support input, not a worker completion wait. */
  startDelayMilliseconds?: number;
}

export interface RecoveryLaunchContext {
  reason: string;
  dueAt: string;
  previousJobId: string;
}

export interface AdapterLaunchRequest {
  projectRoot: string;
  componentPath: string;
  parentContext: ParentContext;
  roleChain: RoleChain;
  job: ResolvedOpenCodeJobSpecification;
  attempt?: number;
  recovery?: RecoveryLaunchContext;
}

export interface LaunchEnvelope {
  componentPath: string;
  taskRevision: string;
  recordRevision: string;
  attempt: number;
  parentContext: ParentContext;
  jobSpecification: ResolvedOpenCodeJobSpecification;
}

export interface AdapterLaunchResult {
  outcome: ExecutionOutcome;
  envelope: LaunchEnvelope;
  handle: JobHandle;
  record: DurableRecordObservation;
}

export class AdapterLaunchError extends Error {
  readonly code: string;
  readonly recordPath: string;

  constructor(code: string, message: string, recordPath: string) {
    super(message);
    this.name = "AdapterLaunchError";
    this.code = code;
    this.recordPath = recordPath;
  }
}

const CHECKPOINT_BEGIN = "<!-- subprocess-execution-foundation:begin -->";
const CHECKPOINT_END = "<!-- subprocess-execution-foundation:end -->";
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;

function isoNow(): string {
  return new Date().toISOString();
}

function checkpoint(
  jobId: string,
  operation: string,
  event: string,
  details: Record<string, unknown>,
): DurableCheckpoint {
  return {
    operation,
    event,
    jobId,
    source: ADAPTER_ID,
    observedAt: isoNow(),
    details,
  };
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
    try {
      const directory = await open(dirname(path), "r");
      try {
        await directory.sync();
      } finally {
        await directory.close();
      }
    } catch {
      // The record was still atomically renamed; this is host-local evidence.
    }
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function withRecordLock<T>(recordPath: string, action: () => Promise<T>): Promise<T> {
  const lockPath = `${recordPath}.execution-lock`;
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
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 5));
    }
  }
  throw new Error("durable record blocker: component checkpoint lock timed out");
}

async function appendCheckpoint(
  recordPath: string,
  value: DurableCheckpoint,
  options: { status?: string; updateUpdated?: boolean } = {},
): Promise<void> {
  await withRecordLock(recordPath, async () => {
    const raw = await readFile(recordPath, "utf8");
    let next = raw;
    if (options.status) {
      if (!RECORD_STATUS.test(next)) throw new Error("durable record blocker: task.status is not parseable");
      next = next.replace(RECORD_STATUS, `  status: ${options.status}`);
    }
    if (options.updateUpdated !== false) {
      if (!RECORD_UPDATED.test(next)) throw new Error("durable record blocker: task.updated is not parseable");
      next = next.replace(RECORD_UPDATED, `  updated: ${value.observedAt}`);
    }
    const line = JSON.stringify(value);
    const begin = next.indexOf(CHECKPOINT_BEGIN);
    const end = next.indexOf(CHECKPOINT_END);
    if (begin >= 0 && end > begin) {
      next = `${next.slice(0, end)}${line}\n${next.slice(end)}`;
    } else {
      next = `${next.trimEnd()}\n\n## Execution Foundation Checkpoints\n\n${CHECKPOINT_BEGIN}\n${line}\n${CHECKPOINT_END}\n`;
    }
    await atomicWrite(recordPath, next);
  });
}

function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  if (!projectRoot.trim() || !componentPath.trim()) throw new Error("component and project root are required");
  const root = resolve(projectRoot);
  const absolute = resolve(root, componentPath);
  const candidate = relative(root, absolute).split(sep).join("/");
  if (isAbsolute(candidate) || candidate === ".." || candidate.startsWith("../")) {
    throw new Error("component path escapes the project root");
  }
  return candidate || ".";
}

function componentRecordPath(projectRoot: string, componentPath: string): string {
  return join(resolve(projectRoot, componentPath), "as-is.md");
}

function configuredWorker(raw: string): string {
  const match = raw.match(/^  worker:\s*([^\r\n]+)$/m);
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function explicitTaskRevision(raw: string): string | null {
  const match = raw.match(/^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im);
  return match?.[1] ?? null;
}

/**
 * Version 2 records do not add a mutable front-matter task-revision field.
 * Until a future protocol revision does so, the immutable task-definition
 * portion of this durable record is the revision source.  Checkpoints and
 * status changes are intentionally excluded, so the value remains stable for
 * retries and later observation.
 */
function resolveTaskRevision(raw: string, componentPath: string): string {
  const explicit = explicitTaskRevision(raw);
  if (explicit) return explicit;
  const progress = raw.search(/^## Progress\s*$/im);
  let definition = progress >= 0 ? raw.slice(0, progress) : raw;
  definition = definition
    .replace(/^  status:.*$/gm, "")
    .replace(/^  updated:.*$/gm, "")
    .replace(/^    spent:.*$/gm, "")
    .replace(/^      spent-seconds:.*$/gm, "")
    .replace(/\r\n/g, "\n")
    .trim();
  const digest = createHash("sha256").update(`${componentPath}\n${definition}`).digest("hex").slice(0, 24);
  return `record-${digest}`;
}

function numberField(raw: string, expression: RegExp): number | "unavailable" {
  const match = raw.match(expression);
  if (!match) return "unavailable";
  const value = Number(match[1]);
  return Number.isFinite(value) && value >= 0 ? value : "unavailable";
}

function resolveBudget(raw: string): UsageBudget {
  return {
    costAllocation: numberField(raw, /^    allocated:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    costReserve: numberField(raw, /^    reserve:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    costSpent: numberField(raw, /^    spent:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    costSource: "durable-component-record",
    wallClockAllocationSeconds: numberField(raw, /^      allocated-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    wallClockReserveSeconds: numberField(raw, /^      reserve-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    wallClockSpentSeconds: numberField(raw, /^      spent-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    wallClockSource: "durable-component-record",
  };
}

function parentComponentPath(componentPath: string): string {
  if (componentPath === ".") return ".";
  const parent = componentPath.split("/").slice(0, -1).join("/");
  return parent || ".";
}

function validateParentContext(
  context: ParentContext | undefined,
  chain: RoleChain,
  componentPath: string,
): string | null {
  if (!context) return "parent context is missing";
  if (!chain?.asIs || !chain.orchestrator || !chain.implementer) return "parent role chain is missing";
  if (context.role !== "orchestrator") return "parent context is not the configured orchestrator role";
  if (context.componentPath !== parentComponentPath(componentPath)) {
    return "parent context names the wrong component";
  }
  if (typeof context.sessionId !== "string" || typeof context.parentSessionId !== "string"
    || !context.sessionId.trim() || !context.parentSessionId.trim()) {
    return "parent context is missing session attribution";
  }
  if (context.sessionId !== chain.orchestrator.sessionId || context.parentSessionId !== chain.asIs.sessionId) {
    return "parent context is not linked as as-is -> orchestrator";
  }
  return null;
}

function validatePermissionProfile(profile: ProactivePermissionProfile | undefined): string[] {
  if (!profile) return ["proactive permission profile is missing"];
  const failures: string[] = [];
  if (typeof profile.source !== "string" || !profile.source.trim()) failures.push("permission profile source is missing");
  if (profile.approvedWorkspace !== true) failures.push("approved workspace capability is not enabled");
  if (profile.processGroupControl !== true) failures.push("process-group control capability is not enabled");
  if (profile.standardInput !== "disabled") failures.push("standard input is not proactively disabled");
  if (profile.eventPersistence !== true) failures.push("event persistence capability is not enabled");
  if (profile.watchdog !== true) failures.push("watchdog deadline capability is not enabled");
  if (profile.userEventBubbling !== true) failures.push("user-event bubbling capability is not proven");
  return failures;
}

function looksLikeTopLevelOpenCodeCli(command: string[]): boolean {
  const executable = basename(command[0] ?? "").toLowerCase();
  return executable === "opencode" || executable === "opencode.exe";
}

function validateJobSpecification(
  job: ResolvedOpenCodeJobSpecification | undefined,
  componentPath: string,
  worker: string,
): string | null {
  if (!job) return "resolved adapter/job specification is missing";
  if (job.adapter !== "opencode") return "resolved adapter is not OpenCode";
  if (job.executionMode !== LAUNCH_MODE) return "foreground or unsupported execution fallback is not permitted";
  if (job.componentPath !== componentPath) return "resolved job specification names the wrong component";
  if (job.workerRole !== worker) return "resolved job specification names the wrong worker role";
  if (!Array.isArray(job.command) || job.command.length === 0 || !job.command.every((part) => typeof part === "string" && part.length > 0)) {
    return "resolved worker command is missing or malformed";
  }
  if (looksLikeTopLevelOpenCodeCli(job.command)) return "top-level OpenCode CLI worker fallback is not supported";
  if (!Number.isFinite(job.checkInSeconds) || job.checkInSeconds <= 0) return "check-in deadline must be positive";
  if (job.startDelayMilliseconds !== undefined
    && (!Number.isFinite(job.startDelayMilliseconds) || job.startDelayMilliseconds < 0)) {
    return "launch delay must be finite and non-negative";
  }
  return null;
}

function eventAttempt(event: DurableCheckpoint): number | null {
  const directAttempt = event.details.attempt;
  const envelope = event.details.envelope;
  const nestedAttempt = envelope && typeof envelope === "object" && "attempt" in envelope
    ? (envelope as { attempt?: unknown }).attempt
    : null;
  const attempt = directAttempt ?? nestedAttempt;
  return typeof attempt === "number" && Number.isInteger(attempt) ? attempt : null;
}

function eventTaskRevision(event: DurableCheckpoint): string | null {
  const direct = event.details.taskRevision;
  if (typeof direct === "string") return direct;
  const envelope = event.details.envelope;
  if (envelope && typeof envelope === "object" && "taskRevision" in envelope) {
    const value = (envelope as { taskRevision?: unknown }).taskRevision;
    return typeof value === "string" ? value : null;
  }
  return null;
}

function conflictingAttempt(
  record: DurableRecordObservation,
  taskRevision: string,
  attempt: number,
): string | null {
  for (const event of record.events) {
    if (eventAttempt(event) !== attempt) continue;
    const priorRevision = eventTaskRevision(event);
    if (priorRevision && priorRevision === taskRevision) return `duplicate attempt ${attempt} is already durably recorded`;
    if (priorRevision && priorRevision !== taskRevision) return `attempt ${attempt} conflicts with durable task revision ${priorRevision}`;
    if (["budget-observed", "worker-started", "host-completed"].includes(event.event)) {
      return `attempt ${attempt} has an existing supervisor observation without adapter authority`;
    }
  }
  return null;
}

function recoveryAuthorization(
  record: DurableRecordObservation,
  recovery: RecoveryLaunchContext | undefined,
  attempt: number,
): string | null {
  if (attempt === 1) return recovery ? "initial attempt cannot carry recovery context" : null;
  if (!recovery) return "recovery context is required for an attempt after one";
  if (!recovery.reason.trim() || !recovery.previousJobId.trim()) return "recovery context is incomplete";
  const scheduled = record.events.find((event) => event.event === "recovery-scheduled"
    && event.jobId === recovery.previousJobId
    && event.details.attempt === attempt
    && event.details.previousJobId === recovery.previousJobId
    && event.details.dueAt === recovery.dueAt);
  return scheduled ? null : "duplicate or unauthorized recovery attempt";
}

async function durableReject(
  recordPath: string,
  code: string,
  reason: string,
  details: Record<string, unknown> = {},
): Promise<never> {
  const record = await readDurableRecord(recordPath);
  if (!["completed", "cancelled"].includes(record.status)) {
    await appendCheckpoint(recordPath, checkpoint("adapter-rejected", "launch", "adapter-rejected", {
      blocker: code,
      reason,
      ...details,
      noWorkerSubmitted: true,
      recovery: "retain durable blocker; do not substitute a role or foreground fallback",
    }), { status: "blocked" });
  }
  throw new AdapterLaunchError(code, reason, recordPath);
}

function envelopeDetails(envelope: LaunchEnvelope): Record<string, unknown> {
  return {
    adapter: ADAPTER_ID,
    envelope,
    runtimeCorrelation: {
      componentPath: envelope.componentPath,
      taskRevision: envelope.taskRevision,
      attempt: envelope.attempt,
      jobId: "diagnostic-only",
    },
    cancellationOwner: "subprocess-execution-foundation/supervisor",
    cleanupOwner: "subprocess-execution-foundation/supervisor",
    returnCondition: "durable supervisor launch checkpoint before worker completion",
  };
}

/**
 * Resolve and submit exactly one configured implementer attempt.  This
 * function has no wait for worker completion: the generic supervisor owns the
 * detached process group and returns once its launch checkpoint is durable.
 */
export async function launchComponent(input: AdapterLaunchRequest): Promise<AdapterLaunchResult> {
  let componentPath: string;
  try {
    componentPath = canonicalComponentPath(input.projectRoot, input.componentPath);
  } catch (error) {
    throw new AdapterLaunchError("wrong-component", error instanceof Error ? error.message : String(error), "unresolved");
  }
  const recordPath = componentRecordPath(input.projectRoot, componentPath);
  let record: DurableRecordObservation;
  try {
    record = await readDurableRecord(recordPath);
  } catch (error) {
    throw new AdapterLaunchError("missing-record", `component record is unavailable: ${error instanceof Error ? error.message : String(error)}`, recordPath);
  }

  const worker = configuredWorker(record.raw);
  const attempt = input.attempt ?? 1;
  if (!Number.isInteger(attempt) || attempt < 1) {
    return durableReject(recordPath, "invalid-attempt", "attempt must be a one-based integer", { attempt });
  }
  if (worker !== "implementer") {
    return durableReject(recordPath, "wrong-configured-role", `configured worker ${worker || "<missing>"} is not implementer`, { worker });
  }

  const parentFailure = validateParentContext(input.parentContext, input.roleChain, componentPath);
  if (parentFailure) return durableReject(recordPath, "invalid-parent", parentFailure);
  try {
    validateRoleChain(input.roleChain);
  } catch (error) {
    return durableReject(recordPath, "wrong-role-chain", error instanceof Error ? error.message : String(error));
  }
  if (input.roleChain.asIs.role !== REQUIRED_ROLE_CHAIN[0]
    || input.roleChain.orchestrator.role !== REQUIRED_ROLE_CHAIN[1]
    || input.roleChain.implementer.role !== REQUIRED_ROLE_CHAIN[2]) {
    return durableReject(recordPath, "wrong-role-chain", "required role mediation is as-is -> orchestrator -> implementer");
  }

  const jobFailure = validateJobSpecification(input.job, componentPath, worker);
  if (jobFailure) return durableReject(recordPath, "invalid-job-specification", jobFailure);
  const permissionFailures = validatePermissionProfile(input.job.permissionProfile);
  if (permissionFailures.length > 0) {
    return durableReject(recordPath, "permission-preflight-failed", permissionFailures.join("; "), {
      source: input.job.permissionProfile?.source ?? "unavailable",
      permissionProfile: input.job.permissionProfile ?? null,
    });
  }
  if (input.job.available === false) {
    return durableReject(recordPath, "configured-worker-unavailable", "configured implementer is unavailable; no replacement is permitted");
  }

  const taskRevision = resolveTaskRevision(record.raw, componentPath);
  const attemptConflict = conflictingAttempt(record, taskRevision, attempt);
  if (attemptConflict) return durableReject(recordPath, "duplicate-conflicting-attempt", attemptConflict, { attempt, taskRevision });
  const recoveryFailure = recoveryAuthorization(record, input.recovery, attempt);
  if (recoveryFailure) return durableReject(recordPath, "duplicate-conflicting-attempt", recoveryFailure, { attempt, taskRevision });

  const recordRevision = record.updated;
  if (!recordRevision) return durableReject(recordPath, "missing-record-revision", "durable record has no task.updated revision");
  const expectedStatus = attempt === 1 ? "ready" : "active";
  if (record.status !== expectedStatus) {
    return durableReject(recordPath, "invalid-record-status", `record status ${record.status} cannot launch attempt ${attempt}; expected ${expectedStatus}`, {
      attempt,
      expectedStatus,
    });
  }

  // This is the adapter's proactive check.  It happens before the generic
  // supervisor is submitted; the supervisor repeats its host-neutral checks
  // with the same resolved capability facts.
  const envelope: LaunchEnvelope = {
    componentPath,
    taskRevision,
    recordRevision,
    attempt,
    parentContext: { ...input.parentContext },
    jobSpecification: {
      ...input.job,
      componentPath,
      workerRole: worker,
      command: [...input.job.command],
      permissionProfile: { ...input.job.permissionProfile },
    },
  };

  const supervisorRequest: LaunchRequest = {
    component: componentPath,
    recordPath,
    projectRoot: resolve(input.projectRoot),
    recordRevision,
    expectedRecordStatus: expectedStatus,
    roleChain: input.roleChain,
    worker: {
      role: worker,
      command: [...input.job.command],
      available: input.job.available,
    },
    capabilities: {
      userEventBubbling: input.job.permissionProfile.userEventBubbling,
      source: input.job.permissionProfile.source,
    },
    budget: resolveBudget(record.raw),
    checkInSeconds: input.job.checkInSeconds,
    startDelayMilliseconds: input.job.startDelayMilliseconds,
    ...(input.recovery ? {
      recovery: {
        attempt,
        reason: input.recovery.reason,
        dueAt: input.recovery.dueAt,
        previousJobId: input.recovery.previousJobId,
      },
    } : {}),
  };

  let launched: Awaited<ReturnType<typeof launchSupervisor>>;
  try {
    launched = await launchSupervisor(supervisorRequest);
  } catch (error) {
    return durableReject(recordPath, "supervisor-rejected", error instanceof Error ? error.message : String(error), {
      attempt,
      taskRevision,
    });
  }
  if (launched.outcome !== "started") {
    return {
      outcome: launched.outcome,
      envelope,
      handle: launched.handle,
      record: launched.record,
    };
  }

  // The supervisor has already durably written launch-accepted.  Persist the
  // adapter envelope afterward, under the same record lock, without changing
  // task identity.  The generated JobId remains only a diagnostic correlation
  // value in this checkpoint and in the private supervisor handle.
  await appendCheckpoint(
    recordPath,
    checkpoint(launched.handle.jobId, "launch", "adapter-envelope-recorded", envelopeDetails(envelope)),
  );
  return {
    outcome: "started",
    envelope,
    handle: launched.handle,
    record: await readDurableRecord(recordPath),
  };
}

/** Cancellation and cleanup remain explicit delegations to the supervisor. */
export async function cancelComponent(handle: JobHandle, reason: string) {
  return requestSupervisorCancellation(handle, reason);
}

export async function cleanupComponent(handle: JobHandle) {
  return cleanupSupervisor(handle);
}
