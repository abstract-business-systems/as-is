import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, open, readFile, rename, rm, rmdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DelegateComponentSupervisor,
  FileSystemDurableState,
  runtimeJobMapPath,
  type AdapterControlResult,
  type AdapterLaunchAcceptance,
  type AdapterPreflight,
  type CallerIdentity,
  type DelegateAdapter,
  type DelegateComponentRequest,
  type DurableComponentRecord,
  type DurableStateSource,
  type HostAdapterId,
  type JobMapEntry,
  type ResolvedAdapterLaunch,
  type StableIdentity,
  type SupervisorActiveBinding,
} from "../delegation-tool-boundary/delegate-component.ts";
import {
  cleanup as cleanupSupervisor,
  confirmCancellation,
  launch as launchSupervisor,
  noLeftover,
  readDurableRecord,
  requestCancellation,
  type JobHandle,
  type RoleChain,
  type UsageBudget,
} from "../subprocess-execution-foundation/supervisor.ts";
import {
  readComponentStatus,
  watchComponentStatus,
  type ComponentStatusOptions,
  type ComponentWatchOptions,
} from "../component-status-watch/status-watch.ts";

/**
 * Local subprocess host bridge.
 *
 * This is deliberately not an OpenCode adapter.  The durable child record
 * resolves a local command and this module maps that resolution to the
 * already-accepted detached supervisor.  The generic delegate-component
 * boundary remains responsible for request shape, caller/parent verification,
 * child resolution, role enforcement, attempt assignment, JobId assignment,
 * and its durable launch checkpoint.
 */

export const SUBPROCESS_ADAPTER_ID = "subprocess-host-integration" as const;
export const SUBPROCESS_EXECUTION_MODE = "supervisor-owned-detached" as const;
export const SUBPROCESS_PROTOCOL = "host-neutral-subprocess" as const;
export const OPEN_CODE_PAYLOAD_USED = false as const;

type SubprocessAdapterId = typeof SUBPROCESS_ADAPTER_ID;

export interface SubprocessPermissionProfile {
  source: string;
  approvedWorkspace: boolean;
  processGroupControl: boolean;
  standardInput: "disabled" | "interactive";
  eventPersistence: boolean;
  watchdog: boolean;
  userEventBubbling: boolean;
  /** Deterministic fixture controls; never a hidden prompt. */
  state?: "allowed" | "denied" | "awaiting-approval" | "unavailable";
  reason?: string;
}

export interface SubprocessJobSpecification {
  executionMode: typeof SUBPROCESS_EXECUTION_MODE;
  command: string[];
  checkInSeconds: number;
  startDelayMilliseconds?: number;
  available?: boolean;
}

export interface SubprocessSupervisorContext {
  /** Supervisor-owned role context; it is not part of the agent request. */
  roleChain: RoleChain;
  source: string;
}

export interface SubprocessActiveBinding extends SupervisorActiveBinding {
  supervisorContext: SubprocessSupervisorContext;
}

export interface SubprocessHostIntegrationOptions {
  projectRoot: string;
  stateHome?: string;
  source?: DurableStateSource;
  now?: () => Date;
  jobId?: () => string;
}

export interface SubprocessRuntimeIdentityOptions {
  projectRoot: string;
  stateHome?: string;
  componentPath: string;
  taskRevision: string;
  attempt: number;
}

interface RuntimeMapDocument {
  version: 1;
  entries: Record<string, JobMapEntry & Record<string, unknown>>;
}

interface EncodedRuntimeHandle {
  version: 1;
  handle: JobHandle;
}

const scriptPath = fileURLToPath(import.meta.url);
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;
const TASK_REVISION = /^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function nonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function numberOrUnavailable(value: unknown): number | "unavailable" {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : "unavailable";
}

function textAt(value: Record<string, unknown>, key: string): string | null {
  return nonEmptyText(value[key]) ? value[key] : null;
}

function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  if (!nonEmptyText(componentPath) || isAbsolute(componentPath) || componentPath.includes("\\")) {
    throw new Error("component path must be canonical and repository-relative");
  }
  if (componentPath !== "." && componentPath.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error("component path must be canonical and repository-relative");
  }
  const root = resolve(projectRoot);
  const candidate = relative(root, resolve(root, componentPath)).split(sep).join("/");
  if (isAbsolute(candidate) || candidate === ".." || candidate.startsWith("../") || candidate !== componentPath) {
    throw new Error("component path must be canonical and repository-relative");
  }
  return candidate || ".";
}

function parentComponentPath(componentPath: string): string {
  if (componentPath === ".") return ".";
  return componentPath.split("/").slice(0, -1).join("/") || ".";
}

function recordPath(projectRoot: string, componentPath: string): string {
  return join(resolve(projectRoot), componentPath, "as-is.md");
}

function recordRevision(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function taskRevision(raw: string, componentPath: string): string {
  const explicit = raw.match(TASK_REVISION)?.[1];
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
  return `record-${createHash("sha256").update(`${componentPath}\n${definition}`).digest("hex").slice(0, 24)}`;
}

function updatedValue(raw: string): string | null {
  return raw.match(RECORD_UPDATED)?.[1]?.trim() ?? null;
}

function statusValue(raw: string): string | null {
  return raw.match(RECORD_STATUS)?.[1]?.trim() ?? null;
}

function permissionProfile(value: Record<string, unknown>): SubprocessPermissionProfile {
  return {
    source: textAt(value, "source") ?? "",
    approvedWorkspace: value.approvedWorkspace === true,
    processGroupControl: value.processGroupControl === true,
    standardInput: value.standardInput === "disabled" ? "disabled" : "interactive",
    eventPersistence: value.eventPersistence === true,
    watchdog: value.watchdog === true,
    userEventBubbling: value.userEventBubbling === true,
    state: value.state === "allowed" || value.state === "denied" || value.state === "awaiting-approval" || value.state === "unavailable"
      ? value.state
      : undefined,
    reason: textAt(value, "reason") ?? undefined,
  };
}

function jobSpecification(value: Record<string, unknown>): SubprocessJobSpecification {
  const command = Array.isArray(value.command) && value.command.every((part) => typeof part === "string" && part.length > 0)
    ? [...value.command] as string[]
    : [];
  return {
    executionMode: value.executionMode as typeof SUBPROCESS_EXECUTION_MODE,
    command,
    checkInSeconds: typeof value.checkInSeconds === "number" ? value.checkInSeconds : Number.NaN,
    startDelayMilliseconds: value.startDelayMilliseconds === undefined ? undefined : Number(value.startDelayMilliseconds),
    available: value.available === undefined ? undefined : value.available === true,
  };
}

function roleContextFailure(input: ResolvedAdapterLaunch, roleChain: RoleChain | undefined): string | null {
  if (!roleChain) return "active supervisor role context is unavailable";
  if (roleChain.orchestrator.role !== "orchestrator" || roleChain.implementer.role !== "implementer") {
    return "active supervisor role context does not identify orchestrator -> implementer";
  }
  if (input.parent.role !== "orchestrator") return "derived parent is not the configured orchestrator role";
  if (input.parent.componentPath !== parentComponentPath(input.identity.componentPath)) {
    return "derived parent component does not own the resolved child component";
  }
  if (roleChain.orchestrator.parentSessionId !== roleChain.asIs.sessionId
    || roleChain.implementer.parentSessionId !== roleChain.orchestrator.sessionId) {
    return "active supervisor role context has broken parent linkage";
  }
  return null;
}

function commandFailure(spec: SubprocessJobSpecification, input: ResolvedAdapterLaunch): string | null {
  if (spec.executionMode !== SUBPROCESS_EXECUTION_MODE) return "foreground or unsupported execution fallback is not permitted";
  if (input.workerRole !== "implementer") return "resolved child worker is not implementer";
  if (spec.command.length === 0) return "durable subprocess command is missing";
  if (!spec.command.every((part) => nonEmptyText(part))) return "durable subprocess command is malformed";
  const executable = spec.command[0].split(/[\\/]/).at(-1)?.toLowerCase();
  if (executable === "opencode" || executable === "opencode.exe") {
    return "OpenCode CLI and direct host fallback are not supported by this subprocess bridge";
  }
  if (!Number.isFinite(spec.checkInSeconds) || spec.checkInSeconds <= 0) return "check-in deadline must be positive";
  if (spec.startDelayMilliseconds !== undefined
    && (!Number.isFinite(spec.startDelayMilliseconds) || spec.startDelayMilliseconds < 0)) {
    return "launch delay must be finite and non-negative";
  }
  return null;
}

function profileFailure(profile: SubprocessPermissionProfile): AdapterPreflight {
  if (profile.state === "denied") return { state: "denied", reason: profile.reason ?? "durable subprocess permission profile denied the launch", permissionState: "denied" };
  if (profile.state === "awaiting-approval") return {
    state: "awaiting-approval",
    reason: profile.reason ?? "durable subprocess permission profile requires approval",
    permissionState: "awaiting-user-approval",
  };
  if (profile.state === "unavailable") return { state: "unavailable", reason: profile.reason ?? "durable subprocess permission profile is unavailable" };
  const failures: string[] = [];
  if (!profile.source.trim()) failures.push("permission profile source is missing");
  if (!profile.approvedWorkspace) failures.push("approved workspace capability is not enabled");
  if (!profile.processGroupControl) failures.push("process-group control capability is not enabled");
  if (profile.standardInput !== "disabled") failures.push("standard input is not proactively disabled");
  if (!profile.eventPersistence) failures.push("event persistence capability is not enabled");
  if (!profile.watchdog) failures.push("watchdog deadline capability is not enabled");
  if (!profile.userEventBubbling) failures.push("user-event bubbling capability is not proven");
  return failures.length === 0
    ? { state: "allowed" }
    : { state: "denied", reason: failures.join("; "), permissionState: "denied" };
}

function budgetFrom(record: DurableComponentRecord): UsageBudget {
  return {
    costAllocation: numberOrUnavailable(record.constraints.cost.allocated),
    costReserve: numberOrUnavailable(record.constraints.cost.reserve),
    costSpent: numberOrUnavailable(record.constraints.cost.spent),
    costSource: "durable-component-record",
    wallClockAllocationSeconds: numberOrUnavailable(record.constraints.execution.allocatedSeconds),
    wallClockReserveSeconds: numberOrUnavailable(record.constraints.execution.reserveSeconds),
    wallClockSpentSeconds: numberOrUnavailable(record.constraints.execution.spentSeconds),
    wallClockSource: "durable-component-record",
  };
}

function encodedHandle(handle: JobHandle): string {
  const value: EncodedRuntimeHandle = { version: 1, handle };
  return JSON.stringify(value);
}

function decodeHandle(value: unknown): JobHandle | null {
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value) as Partial<EncodedRuntimeHandle>;
    const handle = parsed.handle;
    if (parsed.version !== 1 || !isObject(handle)
      || !nonEmptyText(handle.jobId) || !nonEmptyText(handle.component)
      || !nonEmptyText(handle.recordPath) || !nonEmptyText(handle.runtimeDir)
      || !nonEmptyText(handle.workspacePath) || !nonEmptyText(handle.statePath)
      || !Number.isInteger(handle.attempt) || handle.attempt < 1) return null;
    return handle as JobHandle;
  } catch {
    return null;
  }
}

async function atomicWrite(path: string, contents: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
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
    await chmod(path, 0o600).catch(() => undefined);
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function readRuntimeMap(path: string): Promise<RuntimeMapDocument> {
  const parsed = JSON.parse(await readFile(path, "utf8")) as Partial<RuntimeMapDocument>;
  if (parsed.version !== 1 || !isObject(parsed.entries)) throw new Error("diagnostic runtime map is malformed");
  return { version: 1, entries: parsed.entries as RuntimeMapDocument["entries"] };
}

async function withMapLock<T>(path: string, action: () => Promise<T>): Promise<T> {
  const lock = `${path}.lock`;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      await mkdir(lock, { recursive: false, mode: 0o700 });
      try {
        return await action();
      } finally {
        await rm(lock, { recursive: true, force: true });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 2));
    }
  }
  throw new Error("diagnostic runtime map lock timed out");
}

async function updateRuntimeMap(path: string, action: (document: RuntimeMapDocument) => void): Promise<void> {
  await withMapLock(path, async () => {
    const document = await readRuntimeMap(path);
    action(document);
    await atomicWrite(path, `${JSON.stringify(document, null, 2)}\n`);
  });
}

async function appendWrongRoleCheckpoint(projectRoot: string, componentPath: string, reason: string): Promise<void> {
  const path = recordPath(projectRoot, componentPath);
  const lockPath = `${path}.subprocess-host-lock`;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      await mkdir(lockPath, { recursive: false, mode: 0o700 });
      try {
        const raw = await readFile(path, "utf8");
        const checkpoint = JSON.stringify({
          operation: "delegate-component",
          event: "delegation-rejected",
          jobId: "unassigned",
          source: SUBPROCESS_ADAPTER_ID,
          observedAt: new Date().toISOString(),
          details: { blocker: "wrong-role", reason, fallback: "not-permitted", noWorkerSubmitted: true },
        });
        const begin = raw.indexOf("<!-- delegate-component:begin -->");
        const end = raw.indexOf("<!-- delegate-component:end -->");
        const next = begin >= 0 && end > begin
          ? `${raw.slice(0, end)}${checkpoint}\n${raw.slice(end)}`
          : `${raw.trimEnd()}\n\n## Delegate Component Checkpoints\n\n<!-- delegate-component:begin -->\n${checkpoint}\n<!-- delegate-component:end -->\n`;
        await atomicWrite(path, next);
      } finally {
        await rm(lockPath, { recursive: true, force: true });
      }
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") return;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 2));
    }
  }
}

async function patchAcceptedMapEntry(
  projectRoot: string,
  stateHome: string | undefined,
  input: ResolvedAdapterLaunch,
  handle: JobHandle,
): Promise<void> {
  const mapPath = runtimeJobMapPath(projectRoot, stateHome);
  const raw = await readFile(handle.recordPath, "utf8");
  const revision = recordRevision(raw);
  await updateRuntimeMap(mapPath, (document) => {
    const matches = Object.values(document.entries).filter((entry) =>
      entry.componentPath === input.identity.componentPath
      && entry.taskRevision === input.identity.taskRevision
      && entry.attempt === input.identity.attempt
      && entry.runtimeState === "launching");
    if (matches.length !== 1) throw new Error("diagnostic runtime map has no unique launching identity");
    const entry = matches[0];
    entry.recordRevision = revision;
    entry.runtimeHandle = encodedHandle(handle);
    entry.statePath = handle.statePath;
    entry.runtimeDir = handle.runtimeDir;
    entry.lastObservedAt = new Date().toISOString();
  });
}

async function removeRuntimeMapEntry(projectRoot: string, stateHome: string | undefined, identity: StableIdentity): Promise<void> {
  const mapPath = runtimeJobMapPath(projectRoot, stateHome);
  let empty = false;
  try {
    await updateRuntimeMap(mapPath, (document) => {
      for (const [jobId, entry] of Object.entries(document.entries)) {
        if (entry.componentPath === identity.componentPath
          && entry.taskRevision === identity.taskRevision
          && entry.attempt === identity.attempt) delete document.entries[jobId];
      }
      empty = Object.keys(document.entries).length === 0;
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  if (!empty) return;
  await rm(mapPath, { force: true });
  // Remove only empty private runtime-map directories.  Never remove a shared
  // state root or another project's entries.
  for (const path of [dirname(mapPath), dirname(dirname(mapPath)), dirname(dirname(dirname(mapPath)))]) {
    await rmdir(path).catch(() => undefined);
  }
}

function runtimeStateFromObservation(observation: Record<string, unknown>): string {
  const durable = isObject(observation.durableState) ? observation.durableState : {};
  const runtime = isObject(observation.runtime) ? observation.runtime : {};
  const durableStatus = textAt(durable, "status");
  const hostStatus = textAt(runtime, "hostStatus") ?? textAt(runtime, "status");
  if (durableStatus === "completed" && hostStatus === "completed") return "terminal";
  if (durableStatus === "failed" && hostStatus === "failed") return "terminal";
  if (durableStatus === "cancelled" && (hostStatus === "cancelled" || hostStatus === "cancelling")) return "cancelled";
  if (hostStatus === "running" || hostStatus === "waiting" || hostStatus === "launching") return hostStatus;
  return textAt(runtime, "classification") ?? "unknown";
}

/**
 * The accepted generic boundary optimistically protects its own checkpoint
 * with `recordRevision`.  The detached supervisor necessarily appends its
 * launch checkpoint first, so this source supplies an empty optimistic token
 * for this composed adapter; the supervisor still rereads and validates the
 * durable `task.updated` value, and the adapter patches the private map with
 * the post-supervisor record hash before the generic boundary continues.
 */
export class SubprocessCheckpointSource implements DurableStateSource {
  private readonly delegate: FileSystemDurableState;

  constructor(projectRoot: string) {
    this.delegate = new FileSystemDurableState(projectRoot);
  }

  async readRecord(componentPath: string): Promise<DurableComponentRecord | null> {
    const record = await this.delegate.readRecord(componentPath);
    return record ? { ...record, recordRevision: "" } : null;
  }
}

export class DetachedSubprocessAdapter implements DelegateAdapter {
  readonly id: HostAdapterId = SUBPROCESS_ADAPTER_ID;
  private readonly projectRoot: string;
  private readonly stateHome?: string;
  private readonly roleChain?: RoleChain;

  constructor(options: { projectRoot: string; stateHome?: string; roleChain?: RoleChain }) {
    this.projectRoot = resolve(options.projectRoot);
    this.stateHome = options.stateHome;
    this.roleChain = options.roleChain;
  }

  async preflight(input: ResolvedAdapterLaunch): Promise<AdapterPreflight> {
    const contextFailure = roleContextFailure(input, this.roleChain);
    if (contextFailure) return { state: "unavailable", reason: contextFailure };
    if (input.identity.attempt !== 1) {
      return { state: "unavailable", reason: "this fresh subprocess seam only accepts supervisor-assigned initial attempt 1" };
    }
    if (!isObject(input.jobSpecification)) return { state: "unavailable", reason: "durable subprocess job specification is unavailable" };
    const spec = jobSpecification(input.jobSpecification);
    const commandBlocker = commandFailure(spec, input);
    if (commandBlocker) return { state: "unavailable", reason: commandBlocker };
    const profile = permissionProfile(input.permissionProfile);
    const permission = profileFailure(profile);
    if (permission.state !== "allowed") return permission;
    if (spec.available === false) return { state: "unavailable", reason: "configured implementer subprocess is unavailable" };
    return { state: "allowed" };
  }

  async launch(input: ResolvedAdapterLaunch): Promise<AdapterLaunchAcceptance> {
    const preflight = await this.preflight(input);
    if (preflight.state !== "allowed") return { accepted: false, reason: preflight.reason };
    if (!this.roleChain) return { accepted: false, reason: "active supervisor role context is unavailable" };
    const canonical = canonicalComponentPath(this.projectRoot, input.identity.componentPath);
    const path = recordPath(this.projectRoot, canonical);
    const raw = await readFile(path, "utf8");
    if (recordRevision(raw) !== input.recordRevision && input.recordRevision !== "") {
      return { accepted: false, reason: "durable child record changed before subprocess launch" };
    }
    if (taskRevision(raw, canonical) !== input.identity.taskRevision) {
      return { accepted: false, reason: "durable child task revision changed before subprocess launch" };
    }
    const status = statusValue(raw);
    if (status !== "ready" && status !== "active") return { accepted: false, reason: `durable child status ${status ?? "unavailable"} is not launchable` };
    const spec = jobSpecification(input.jobSpecification);
    const profile = permissionProfile(input.permissionProfile);
    const updated = updatedValue(raw);
    const supervisorRequest = {
      component: canonical,
      recordPath: path,
      projectRoot: this.projectRoot,
      // The generic source supplies a hash for its optimistic boundary; the
      // accepted supervisor validates the durable task.updated timestamp.
      recordRevision: updated ?? "unprovided",
      expectedRecordStatus: status === "active" ? "active" as const : "ready" as const,
      roleChain: this.roleChain,
      worker: { role: input.workerRole, command: [...spec.command], available: spec.available },
      capabilities: { userEventBubbling: profile.userEventBubbling, source: profile.source },
      budget: budgetFrom((await new FileSystemDurableState(this.projectRoot).readRecord(canonical)) as DurableComponentRecord),
      checkInSeconds: spec.checkInSeconds,
      startDelayMilliseconds: spec.startDelayMilliseconds,
    };
    const result = await launchSupervisor(supervisorRequest);
    if (result.outcome !== "started") return { accepted: false, reason: `detached supervisor returned ${result.outcome}` };
    // The generic boundary has already assigned its JobId and inserted the
    // launching map entry before invoking this adapter.  Make that entry
    // usable after controller loss without making it task authority.
    await patchAcceptedMapEntry(this.projectRoot, this.stateHome, input, result.handle);
    return {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      runtimeHandle: encodedHandle(result.handle),
    };
  }

  async cancel(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult> {
    const handle = decodeHandle(input.runtimeHandle);
    if (!handle) return { accepted: false, reason: "persisted subprocess runtime handle is missing or malformed" };
    try {
      await requestCancellation(handle, "subprocess host cancellation requested by the verified parent");
      const observed = await confirmCancellation(handle, 4_000);
      return observed.host.status === "cancelled"
        ? { accepted: true }
        : { accepted: false, reason: `subprocess cancellation remains ${observed.host.status}` };
    } catch (error) {
      return { accepted: false, reason: `subprocess cancellation unavailable: ${errorMessage(error)}` };
    }
  }

  async cleanup(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult> {
    const handle = decodeHandle(input.runtimeHandle);
    if (!handle) return { accepted: false, reason: "persisted subprocess runtime handle is missing or malformed" };
    try {
      const cleaned = await cleanupSupervisor(handle);
      return cleaned.cleaned ? { accepted: true } : { accepted: false, reason: cleaned.reason };
    } catch (error) {
      return { accepted: false, reason: `subprocess cleanup unavailable: ${errorMessage(error)}` };
    }
  }
}

function contextFrom(binding: SupervisorActiveBinding | undefined): RoleChain | undefined {
  if (!isObject(binding)) return undefined;
  const context = binding.supervisorContext;
  if (!isObject(context) || !isObject(context.roleChain)) return undefined;
  return context.roleChain as unknown as RoleChain;
}

function delegateOptions(
  options: SubprocessHostIntegrationOptions,
  roleChain: RoleChain | undefined,
): DelegateComponentSupervisor {
  const adapter = new DetachedSubprocessAdapter({ projectRoot: options.projectRoot, stateHome: options.stateHome, roleChain });
  return new DelegateComponentSupervisor({
    projectRoot: options.projectRoot,
    stateHome: options.stateHome,
    source: options.source ?? new SubprocessCheckpointSource(options.projectRoot),
    adapters: [adapter],
    now: options.now,
    jobId: options.jobId,
  });
}

export class SubprocessHostIntegration {
  readonly projectRoot: string;
  readonly stateHome?: string;
  private readonly options: SubprocessHostIntegrationOptions;

  constructor(options: SubprocessHostIntegrationOptions) {
    this.projectRoot = resolve(options.projectRoot);
    this.stateHome = options.stateHome;
    this.options = { ...options, projectRoot: this.projectRoot };
  }

  async invoke(request: unknown, binding?: SubprocessActiveBinding): Promise<Awaited<ReturnType<DelegateComponentSupervisor["invoke"]>>> {
    const supervisor = delegateOptions(this.options, contextFrom(binding));
    const result = await supervisor.invoke(request, binding);
    // The accepted generic boundary exposes only a generic unavailable result
    // for an adapter preflight that cannot attribute a non-implementer child.
    // Normalize that one adapter-local observation to the contract's explicit
    // wrong-role class and preserve the durable rejection without launching.
    if (result.blocker?.code === "unavailable-supervisor"
      && result.blocker.reason.includes("resolved child worker is not implementer")
      && typeof result.componentPath === "string") {
      await appendWrongRoleCheckpoint(this.projectRoot, result.componentPath, result.blocker.reason);
      result.outcome = "rejected";
      result.blocker.code = "wrong-role";
    }
    return result;
  }

  async status(options: Omit<ComponentStatusOptions, "projectRoot" | "stateHome"> = { componentPath: "." }): Promise<Record<string, unknown>> {
    return readComponentStatus({ ...options, projectRoot: this.projectRoot, ...(this.stateHome ? { stateHome: this.stateHome } : {}) });
  }

  watch(options: Omit<ComponentWatchOptions, "projectRoot" | "stateHome">): AsyncGenerator<Record<string, unknown>> {
    return watchComponentStatus({ ...options, projectRoot: this.projectRoot, ...(this.stateHome ? { stateHome: this.stateHome } : {}) });
  }

  async reconcile(options: Omit<ComponentStatusOptions, "projectRoot" | "stateHome">): Promise<Record<string, unknown>> {
    const observation = await this.status(options);
    const identity = isObject(observation.identity) ? observation.identity : null;
    if (identity && typeof identity.componentPath === "string" && typeof identity.taskRevision === "string"
      && typeof identity.attempt === "number") {
      await updateRuntimeMap(runtimeJobMapPath(this.projectRoot, this.stateHome), (document) => {
        for (const entry of Object.values(document.entries)) {
          if (entry.componentPath === identity.componentPath && entry.taskRevision === identity.taskRevision && entry.attempt === identity.attempt) {
            entry.runtimeState = runtimeStateFromObservation(observation);
            entry.lastObservedAt = new Date().toISOString();
          }
        }
      }).catch(() => undefined);
    }
    return this.status(options);
  }

  async cancel(options: Omit<ComponentStatusOptions, "projectRoot" | "stateHome">): Promise<Awaited<ReturnType<DelegateComponentSupervisor["cancel"]>>> {
    const supervisor = delegateOptions(this.options, undefined);
    const result = await supervisor.cancel({ ...options, projectRoot: this.projectRoot, stateHome: this.stateHome });
    if (result.status === "cleanup-complete" && typeof result.componentPath === "string" && typeof result.taskRevision === "string" && typeof result.attempt === "number") {
      await removeRuntimeMapEntry(this.projectRoot, this.stateHome, { componentPath: result.componentPath, taskRevision: result.taskRevision, attempt: result.attempt });
    }
    return result;
  }

  async cleanup(options: Omit<ComponentStatusOptions, "projectRoot" | "stateHome">): Promise<Awaited<ReturnType<DelegateComponentSupervisor["cleanup"]>>> {
    const supervisor = delegateOptions(this.options, undefined);
    const result = await supervisor.cleanup({ ...options, projectRoot: this.projectRoot, stateHome: this.stateHome });
    if (result.status === "cleanup-complete" && typeof result.componentPath === "string" && typeof result.taskRevision === "string" && typeof result.attempt === "number") {
      await removeRuntimeMapEntry(this.projectRoot, this.stateHome, { componentPath: result.componentPath, taskRevision: result.taskRevision, attempt: result.attempt });
    }
    return result;
  }
}

/** Recover a full supervisor handle from private map data without using JobId as lookup identity. */
export async function readSubprocessRuntimeHandle(options: SubprocessRuntimeIdentityOptions): Promise<JobHandle | null> {
  const path = runtimeJobMapPath(options.projectRoot, options.stateHome);
  try {
    const map = await readRuntimeMap(path);
    const entry = Object.values(map.entries).find((candidate) =>
      candidate.componentPath === options.componentPath
      && candidate.taskRevision === options.taskRevision
      && candidate.attempt === options.attempt);
    return decodeHandle(entry?.runtimeHandle);
  } catch {
    return null;
  }
}

export async function subprocessNoLeftover(handle: JobHandle): Promise<Awaited<ReturnType<typeof noLeftover>>> {
  return noLeftover(handle);
}

function cliValue(args: string[], name: string): string {
  const index = args.indexOf(name);
  const value = index >= 0 ? args[index + 1] : undefined;
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

async function cliControllerLoss(args: string[]): Promise<void> {
  const projectRoot = resolve(cliValue(args, "--project-root"));
  const stateHome = cliValue(args, "--state-home");
  const request = JSON.parse(await readFile(cliValue(args, "--request-file"), "utf8")) as DelegateComponentRequest;
  const binding = JSON.parse(await readFile(cliValue(args, "--binding-file"), "utf8")) as SubprocessActiveBinding;
  const resultFile = cliValue(args, "--result-file");
  const result = await new SubprocessHostIntegration({ projectRoot, stateHome, jobId: () => `controller-job-${randomUUID()}` }).invoke(request, binding);
  await atomicWrite(resultFile, `${JSON.stringify({ ...result, openCodePayloadUsed: OPEN_CODE_PAYLOAD_USED })}\n`);
  await new Promise<void>((resolvePromise) => setTimeout(resolvePromise, 30_000));
}

if (import.meta.main && process.argv[2] === "controller-loss") {
  await cliControllerLoss(process.argv.slice(3));
}
