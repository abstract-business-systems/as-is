import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  cancelComponent,
  cleanupComponent,
  launchComponent,
  type AdapterLaunchRequest,
  type AdapterLaunchResult,
  type ParentContext,
  type ProactivePermissionProfile,
  type ResolvedOpenCodeJobSpecification,
} from "../opencode-launch-adapter/adapter.ts";
import {
  confirmCancellation,
  observe,
  readDurableRecord,
  validateRoleChain,
  type DurableCheckpoint,
  type DurableRecordObservation,
  type JobHandle,
  type RoleChain,
} from "../subprocess-execution-foundation/supervisor.ts";
import { readComponentStatus, watchComponentStatus, type ComponentStatusOptions, type ComponentWatchOptions } from "../component-status-watch/status-watch.ts";

/**
 * The component-local composition boundary.  OpenCode-specific command,
 * session, event, and permission facts stop here; the imported supervisor and
 * status surface receive only their accepted normalized contracts.
 */

export const HOST_INTEGRATION_ID = "opencode-host-integration" as const;
export const OPEN_CODE_MEDIATION_MODE = "supervisor-owned-detached" as const;

export interface OpenCodeLaunchInput {
  projectRoot: string;
  componentPath: string;
  parentContext: ParentContext;
  roleChain: RoleChain;
  stateHome?: string;
  attempt?: number;
  checkInSeconds?: number;
  startDelayMilliseconds?: number;
  opencodeBinary?: string;
  permissionProfile: ProactivePermissionProfile;
}

export interface OpenCodeJobHandle extends JobHandle {
  projectRoot: string;
  stateHome: string;
  taskRevision: string;
  recordRevision: string;
  controllerRoleChain: RoleChain;
  bridgeEventPath: string;
  bridgeSummaryPath: string;
}

export interface RuntimeMapEntry {
  jobId: string;
  componentPath: string;
  taskRevision: string;
  recordRevision: string;
  attempt: number;
  adapter: "opencode";
  runtimeState: "launch-accepted" | "running" | "terminal" | "cancellation" | "cleanup" | "unknown" | "orphaned";
  reconciliationState: "pending" | "live" | "dead" | "unknown" | "orphaned" | "unavailable";
  cleanupState: "pending" | "complete" | "unavailable";
  statePath: string;
  runtimeDir: string;
  bridgeEventPath: string;
  bridgeSummaryPath: string;
  processHandles: {
    supervisorPid: number | null;
    supervisorProcessGroupId: number | null;
    workerPid: number | null;
    workerProcessGroupId: number | null;
  };
  sessionHandles: {
    controllerAsIsSessionId: string;
    controllerOrchestratorSessionId: string;
    controllerImplementerSessionId: string;
    openCode: "unavailable" | "observed-in-private-runtime";
  };
  firstObservedAt: string;
  lastObservedAt: string;
  lastReconciledAt: string;
  blocker: string | null;
}

export interface RuntimeMapFile {
  version: 1;
  updatedAt: string;
  entries: Record<string, RuntimeMapEntry>;
}

export interface RuntimeMapResult {
  path: string;
  availability: "available" | "missing" | "malformed" | "unavailable";
  map: RuntimeMapFile | null;
  reason: string | null;
}

export interface OpenCodeLaunchResult extends Omit<AdapterLaunchResult, "handle"> {
  handle: OpenCodeJobHandle;
  runtimeMap: { path: string; state: RuntimeMapEntry["runtimeState"]; persisted: boolean; blocker: string | null };
}

export class OpenCodeHostIntegrationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "OpenCodeHostIntegrationError";
    this.code = code;
  }
}

interface PrivateState {
  status?: string;
  supervisorPid?: number | null;
  supervisorProcessGroupId?: number | null;
  workerPid?: number | null;
  workerProcessGroupId?: number | null;
}

interface BridgeSummary {
  version: 1;
  source: string;
  componentPath: string;
  projectRoot: string;
  eventPath: string;
  summaryPath: string;
  observedAt: string;
  exitCode: number | null;
  eventCount: number;
  sessions: Array<{ sessionId: string; parentSessionId: string | null; agent: string | null }>;
  taskEvents: Array<{
    kind: string;
    observedAt: string;
    eventType: string;
    sessionId: string | null;
    parentSessionId: string | null;
    agent: string | null;
    target: string | null;
    model: string | null;
    tokenCount: number | null;
  }>;
  forbiddenFallbacks: string[];
  mediation: {
    asIsSessionObserved: boolean;
    orchestratorTaskObserved: boolean;
    implementerTaskObserved: boolean;
    parentAttributionObserved: boolean;
    status: "proven" | "blocked";
    blocker: string | null;
  };
  error: string | null;
}

function isoNow(): string {
  return new Date().toISOString();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function integer(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function safeProjectKey(projectRoot: string): string {
  return `project-${createHash("sha256").update(resolve(projectRoot)).digest("hex").slice(0, 16)}`;
}

export function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  if (!projectRoot.trim() || !componentPath.trim() || isAbsolute(componentPath) || componentPath.includes("\\")) {
    throw new OpenCodeHostIntegrationError("wrong-component", "component path must be canonical and repository-relative");
  }
  const root = resolve(projectRoot);
  const candidate = relative(root, resolve(root, componentPath)).split(sep).join("/");
  if (isAbsolute(candidate) || candidate === ".." || candidate.startsWith("../")) {
    throw new OpenCodeHostIntegrationError("wrong-component", "component path escapes the project root");
  }
  return candidate || ".";
}

function stateHomeFor(value: string | undefined): string {
  return resolve(value ?? process.env.XDG_STATE_HOME ?? join(homedir(), ".local", "state"));
}

export function runtimeMapPath(projectRoot: string, stateHome?: string): string {
  return join(stateHomeFor(stateHome), "as-is", "projects", safeProjectKey(projectRoot), "runtime", "job-map.json");
}

function componentRecordPath(projectRoot: string, componentPath: string): string {
  return join(resolve(projectRoot), componentPath, "as-is.md");
}

function explicitTaskRevision(raw: string): string | null {
  const match = raw.match(/^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im);
  return match?.[1] ?? null;
}

/** Keep the revision algorithm identical to the accepted adapter/status seam. */
export function resolveTaskRevision(raw: string, componentPath: string): string {
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
  return `record-${createHash("sha256").update(`${componentPath}\n${definition}`).digest("hex").slice(0, 24)}`;
}

async function atomicJson(path: string, value: unknown): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${randomUUID()}`;
  await atomicText(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, path);
}

async function atomicText(temporary: string, contents: string): Promise<void> {
  await writeFile(temporary, contents, { encoding: "utf8", mode: 0o600 });
  const file = await open(temporary, "r+");
  try {
    await file.sync();
  } finally {
    await file.close();
  }
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
      await Bun.sleep(5);
    }
  }
  throw new OpenCodeHostIntegrationError("runtime-map-lock-timeout", "runtime map update lock timed out");
}

function emptyMap(): RuntimeMapFile {
  return { version: 1, updatedAt: isoNow(), entries: {} };
}

async function readMapFile(path: string): Promise<RuntimeMapResult> {
  try {
    const parsed = asRecord(JSON.parse(await readFile(path, "utf8")));
    const entries = asRecord(parsed?.entries);
    if (!parsed || parsed.version !== 1 || !entries) {
      return { path, availability: "malformed", map: null, reason: "runtime map has an unsupported schema" };
    }
    return { path, availability: "available", map: { version: 1, updatedAt: text(parsed.updatedAt) ?? isoNow(), entries: entries as Record<string, RuntimeMapEntry> }, reason: null };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { path, availability: "missing", map: null, reason: "runtime map is missing" };
    if (error instanceof SyntaxError) return { path, availability: "malformed", map: null, reason: "runtime map is malformed JSON" };
    return { path, availability: "unavailable", map: null, reason: `runtime map is unavailable: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function readRuntimeMap(projectRoot: string, stateHome?: string): Promise<RuntimeMapResult> {
  return readMapFile(runtimeMapPath(projectRoot, stateHome));
}

async function updateMap(path: string, update: (map: RuntimeMapFile) => RuntimeMapFile | Promise<RuntimeMapFile>): Promise<RuntimeMapFile> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await chmod(dirname(path), 0o700);
  return withMapLock(path, async () => {
    const current = await readMapFile(path);
    if (current.availability === "malformed" || current.availability === "unavailable") {
      throw new OpenCodeHostIntegrationError("runtime-map-unavailable", current.reason ?? "runtime map cannot be loaded");
    }
    const next = await update(current.map ?? emptyMap());
    next.updatedAt = isoNow();
    await atomicJson(path, next);
    return next;
  });
}

function stateHandles(state: PrivateState | null): RuntimeMapEntry["processHandles"] {
  return {
    supervisorPid: state?.supervisorPid ?? null,
    supervisorProcessGroupId: state?.supervisorProcessGroupId ?? null,
    workerPid: state?.workerPid ?? null,
    workerProcessGroupId: state?.workerProcessGroupId ?? null,
  };
}

async function loadPrivateState(path: string): Promise<PrivateState | null> {
  try {
    return asRecord(JSON.parse(await readFile(path, "utf8"))) as PrivateState | null;
  } catch {
    return null;
  }
}

function openCodeBinary(): string | null {
  return Bun.which("opencode") ?? null;
}

export async function discoverOpenCode(): Promise<{ available: boolean; binary: string | null; version: string | null; source: string }> {
  const binary = openCodeBinary();
  if (!binary) return { available: false, binary: null, version: null, source: "host-command-discovery" };
  try {
    const child = Bun.spawn([binary, "--version"], { stdin: "ignore", stdout: "pipe", stderr: "pipe" } as any);
    const output = await new Response(child.stdout).text();
    const exitCode = await child.exited;
    const version = output.trim().split(/\s+/)[0] ?? null;
    return { available: exitCode === 0 && Boolean(version), binary, version: exitCode === 0 ? version : null, source: "host-command-discovery" };
  } catch {
    return { available: false, binary, version: null, source: "host-command-discovery" };
  }
}

export function resolveOpenCodeJobSpecification(input: OpenCodeLaunchInput, binary = input.opencodeBinary ?? openCodeBinary()): ResolvedOpenCodeJobSpecification {
  const componentPath = canonicalComponentPath(input.projectRoot, input.componentPath);
  const wrapperPath = join(dirname(fileURLToPath(import.meta.url)), "opencode-bridge.ts");
  const selectedBinary = binary ?? "opencode";
  return {
    adapter: "opencode",
    executionMode: OPEN_CODE_MEDIATION_MODE,
    componentPath,
    workerRole: "implementer",
    command: [
      process.execPath,
      wrapperPath,
      "--project-root",
      resolve(input.projectRoot),
      "--component-path",
      componentPath,
      "--state-home",
      stateHomeFor(input.stateHome),
      "--attempt",
      String(input.attempt ?? 1),
      "--opencode-bin",
      selectedBinary,
    ],
    permissionProfile: { ...input.permissionProfile },
    checkInSeconds: input.checkInSeconds ?? 1,
    available: binary !== null,
    startDelayMilliseconds: input.startDelayMilliseconds,
  };
}

function roleDetails(chain: RoleChain): Record<string, unknown> {
  return {
    asIs: { ...chain.asIs },
    orchestrator: { ...chain.orchestrator },
    implementer: { ...chain.implementer },
  };
}

function checkpoint(jobId: string, event: string, details: Record<string, unknown>): DurableCheckpoint {
  return {
    operation: "opencode-host-integration",
    event,
    jobId,
    source: HOST_INTEGRATION_ID,
    observedAt: isoNow(),
    details,
  };
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
      await Bun.sleep(5);
    }
  }
  throw new OpenCodeHostIntegrationError("record-lock-timeout", "component record checkpoint lock timed out");
}

async function appendCheckpoint(recordPath: string, value: DurableCheckpoint): Promise<void> {
  await withRecordLock(recordPath, async () => {
    const begin = "<!-- subprocess-execution-foundation:begin -->";
    const end = "<!-- subprocess-execution-foundation:end -->";
    const raw = await readFile(recordPath, "utf8");
    const updated = raw.replace(/^  updated: [^\r\n]+$/m, `  updated: ${value.observedAt}`);
    const line = JSON.stringify(value);
    const beginAt = updated.indexOf(begin);
    const endAt = updated.indexOf(end);
    const next = beginAt >= 0 && endAt > beginAt
      ? `${updated.slice(0, endAt)}${line}\n${updated.slice(endAt)}`
      : `${updated.trimEnd()}\n\n## Execution Foundation Checkpoints\n\n${begin}\n${line}\n${end}\n`;
    const temporary = `${recordPath}.tmp-${process.pid}-${randomUUID()}`;
    await atomicText(temporary, next);
    await rename(temporary, recordPath);
    try {
      const directory = await open(dirname(recordPath), "r");
      try {
        await directory.sync();
      } finally {
        await directory.close();
      }
    } catch {
      // Atomic rename remains the strongest capability available on this host.
    }
  });
}

function latestEvent(record: DurableRecordObservation, jobId: string, names: string[]): DurableCheckpoint | null {
  return [...record.events].reverse().find((event) => event.jobId === jobId && names.includes(event.event)) ?? null;
}

async function loadBridgeSummary(handle: OpenCodeJobHandle): Promise<BridgeSummary | null> {
  try {
    return JSON.parse(await readFile(handle.bridgeSummaryPath, "utf8")) as BridgeSummary;
  } catch {
    return null;
  }
}

async function recordBridgeEvidence(handle: OpenCodeJobHandle, summary: BridgeSummary | null): Promise<void> {
  if (!summary) return;
  const record = await readDurableRecord(handle.recordPath);
  if (record.events.some((event) => event.jobId === handle.jobId && ["opencode-mediation-observed", "opencode-mediation-blocked"].includes(event.event))) return;
  const details = {
    adapter: HOST_INTEGRATION_ID,
    source: summary.source,
    componentPath: handle.component,
    taskRevision: handle.taskRevision,
    attempt: handle.attempt,
    actualOpenCodeSessions: summary.sessions,
    actualOpenCodeTaskEvents: summary.taskEvents,
    forbiddenFallbacks: summary.forbiddenFallbacks,
    mediation: summary.mediation,
    exitCode: summary.exitCode,
    eventCount: summary.eventCount,
    error: summary.error,
    controllerRoleChain: roleDetails(handle.controllerRoleChain),
    noCompletionInferredFromProcessExit: true,
  };
  if (summary.mediation.status === "proven") {
    await appendCheckpoint(handle.recordPath, checkpoint(handle.jobId, "opencode-mediation-observed", details));
  } else {
    await appendCheckpoint(handle.recordPath, checkpoint(handle.jobId, "opencode-mediation-blocked", {
      ...details,
      blocker: summary.mediation.blocker ?? "OpenCode session/event mediation is unavailable or unattributed",
      recovery: "retain durable blocker; do not retry, substitute general/explore, or infer completion",
    }));
  }
}

function mapState(record: DurableRecordObservation, state: PrivateState | null, jobId: string): RuntimeMapEntry["runtimeState"] {
  if (latestEvent(record, jobId, ["cleanup-complete"])) return "cleanup";
  if (latestEvent(record, jobId, ["cancellation-requested", "cancellation-dispatched", "cancellation-confirmed", "cancellation-waiting", "cancellation-escalated"]) || ["cancelling", "cancelled"].includes(state?.status ?? "")) return "cancellation";
  if (["completed", "failed", "cancelled", "unavailable"].includes(state?.status ?? "") || ["completed", "failed", "cancelled"].includes(record.status)) return "terminal";
  if (["running", "waiting"].includes(state?.status ?? "")) return "running";
  if (latestEvent(record, jobId, ["launch-accepted", "launch-requested"])) return "launch-accepted";
  return "unknown";
}

function mapEntryFromHandle(handle: OpenCodeJobHandle, state: PrivateState | null, record: DurableRecordObservation, runtimeState: RuntimeMapEntry["runtimeState"]): RuntimeMapEntry {
  const observedAt = isoNow();
  return {
    jobId: handle.jobId,
    componentPath: handle.component,
    taskRevision: handle.taskRevision,
    recordRevision: handle.recordRevision,
    attempt: handle.attempt,
    adapter: "opencode",
    runtimeState,
    reconciliationState: "pending",
    cleanupState: runtimeState === "cleanup" ? "complete" : "pending",
    statePath: handle.statePath,
    runtimeDir: handle.runtimeDir,
    bridgeEventPath: handle.bridgeEventPath,
    bridgeSummaryPath: handle.bridgeSummaryPath,
    processHandles: stateHandles(state),
    sessionHandles: {
      controllerAsIsSessionId: handle.controllerRoleChain.asIs.sessionId,
      controllerOrchestratorSessionId: handle.controllerRoleChain.orchestrator.sessionId,
      controllerImplementerSessionId: handle.controllerRoleChain.implementer.sessionId,
      openCode: "unavailable",
    },
    firstObservedAt: text(record.events.find((event) => event.jobId === handle.jobId)?.observedAt) ?? observedAt,
    lastObservedAt: observedAt,
    lastReconciledAt: observedAt,
    blocker: null,
  };
}

async function persistEntry(path: string, entry: RuntimeMapEntry): Promise<RuntimeMapFile> {
  return updateMap(path, (map) => ({ ...map, entries: { ...map.entries, [entry.jobId]: entry } }));
}

/**
 * The component-local OpenCode child uses this narrow helper to publish host
 * lifecycle transitions after the parent has created the map entry.  Matching
 * is by stable identity; JobId is only the map key that gets updated.
 */
export async function updateRuntimeMapEntryForBridge(
  projectRoot: string,
  stateHome: string,
  componentPath: string,
  attempt: number,
  patch: Partial<RuntimeMapEntry>,
): Promise<boolean> {
  const path = runtimeMapPath(projectRoot, stateHome);
  let matched = false;
  await updateMap(path, (map) => {
    const entries: Record<string, RuntimeMapEntry> = { ...map.entries };
    for (const [jobId, value] of Object.entries(entries)) {
      if (value.componentPath !== componentPath || value.attempt !== attempt) continue;
      entries[jobId] = {
        ...value,
        ...patch,
        jobId,
        componentPath,
        attempt,
        lastObservedAt: isoNow(),
      };
      matched = true;
    }
    return { ...map, entries };
  });
  return matched;
}

async function persistEntryWithState(
  handle: OpenCodeJobHandle,
  record: DurableRecordObservation,
  state: PrivateState | null,
  reconciliationState: RuntimeMapEntry["reconciliationState"] = "pending",
  blocker: string | null = null,
): Promise<RuntimeMapEntry> {
  const runtimeState = mapState(record, state, handle.jobId);
  const entry = mapEntryFromHandle(handle, state, record, runtimeState);
  entry.reconciliationState = reconciliationState;
  entry.blocker = blocker;
  entry.cleanupState = runtimeState === "cleanup" ? "complete" : entry.cleanupState;
  await persistEntry(runtimeMapPath(handle.projectRoot, handle.stateHome), entry);
  return entry;
}

function openCodeSessionsFromSummary(summary: BridgeSummary | null): RuntimeMapEntry["sessionHandles"]["openCode"] {
  return summary && summary.sessions.length > 0 ? "observed-in-private-runtime" : "unavailable";
}

async function updateEntryFromSummary(handle: OpenCodeJobHandle, entry: RuntimeMapEntry, summary: BridgeSummary | null): Promise<RuntimeMapEntry> {
  if (!summary) return entry;
  const next = {
    ...entry,
    sessionHandles: { ...entry.sessionHandles, openCode: openCodeSessionsFromSummary(summary) },
    blocker: summary.mediation.status === "blocked" ? summary.mediation.blocker : entry.blocker,
    lastObservedAt: isoNow(),
  };
  await persistEntry(runtimeMapPath(handle.projectRoot, handle.stateHome), next);
  return next;
}

/**
 * Submit through the accepted adapter only.  The returned checkpoint is
 * launch-accepted; this function never waits for the OpenCode process or the
 * configured worker to finish.
 */
export async function launchOpenCodeComponent(input: OpenCodeLaunchInput): Promise<OpenCodeLaunchResult> {
  try {
    validateRoleChain(input.roleChain);
  } catch (error) {
    throw new OpenCodeHostIntegrationError("wrong-role-chain", error instanceof Error ? error.message : String(error));
  }
  if (input.roleChain.asIs.role !== "as-is" || input.roleChain.orchestrator.role !== "orchestrator" || input.roleChain.implementer.role !== "implementer") {
    throw new OpenCodeHostIntegrationError("wrong-role-chain", "required mediation is as-is -> orchestrator -> implementer");
  }
  const componentPath = canonicalComponentPath(input.projectRoot, input.componentPath);
  const job = resolveOpenCodeJobSpecification(input);
  const request: AdapterLaunchRequest = {
    projectRoot: resolve(input.projectRoot),
    componentPath,
    parentContext: { ...input.parentContext },
    roleChain: input.roleChain,
    job,
    attempt: input.attempt,
  };
  const launched = await launchComponent(request);
  const stateHome = stateHomeFor(input.stateHome);
  const taskRevision = launched.envelope.taskRevision;
  const handle: OpenCodeJobHandle = {
    ...launched.handle,
    projectRoot: resolve(input.projectRoot),
    stateHome,
    taskRevision,
    recordRevision: launched.envelope.recordRevision,
    controllerRoleChain: input.roleChain,
    bridgeEventPath: join(launched.handle.workspacePath, "opencode-events.jsonl"),
    bridgeSummaryPath: join(launched.handle.workspacePath, "opencode-summary.json"),
  };
  if (launched.outcome !== "started") {
    return {
      outcome: launched.outcome,
      envelope: launched.envelope,
      handle,
      record: launched.record,
      runtimeMap: { path: runtimeMapPath(input.projectRoot, stateHome), state: "unknown", persisted: false, blocker: "launch was not accepted by the adapter/supervisor" },
    };
  }
  let persisted = false;
  let blocker: string | null = null;
  try {
    const state = await loadPrivateState(handle.statePath);
    const record = await readDurableRecord(handle.recordPath);
    const entry = mapEntryFromHandle(handle, state, record, "launch-accepted");
    await persistEntry(runtimeMapPath(handle.projectRoot, stateHome), entry);
    persisted = true;
  } catch (error) {
    blocker = `runtime map launch-accepted update failed: ${error instanceof Error ? error.message : String(error)}`;
    await appendCheckpoint(handle.recordPath, checkpoint(handle.jobId, "runtime-map-blocked", {
      blocker,
      componentPath,
      taskRevision,
      attempt: handle.attempt,
      recovery: "retain durable launch evidence; runtime diagnostics are unavailable and completion is not inferred",
    })).catch(() => undefined);
  }
  return {
    outcome: launched.outcome,
    envelope: launched.envelope,
    handle,
    record: await readDurableRecord(handle.recordPath),
    runtimeMap: { path: runtimeMapPath(handle.projectRoot, stateHome), state: "launch-accepted", persisted, blocker },
  };
}

/**
 * Reload and reconcile every persisted association.  Stable identity is
 * checked against the current durable record before any host observation is
 * retained.  Missing state is unknown/unavailable, never completion.
 */
export async function reconcileOpenCodeRuntimeMap(projectRoot: string, stateHome?: string): Promise<RuntimeMapResult> {
  const path = runtimeMapPath(projectRoot, stateHome);
  const loaded = await readMapFile(path);
  if (loaded.availability !== "available" || !loaded.map) return loaded;
  const next = await updateMap(path, async (map) => {
    const entries: Record<string, RuntimeMapEntry> = {};
    for (const [jobId, rawValue] of Object.entries(map.entries)) {
      const value = rawValue as RuntimeMapEntry;
      const entry = { ...value, lastReconciledAt: isoNow(), lastObservedAt: isoNow() };
      let componentPath: string;
      try {
        componentPath = canonicalComponentPath(projectRoot, entry.componentPath);
      } catch {
        entries[jobId] = { ...entry, runtimeState: "orphaned", reconciliationState: "orphaned", blocker: "runtime-map component path is not canonical" };
        continue;
      }
      let record: DurableRecordObservation;
      try {
        record = await readDurableRecord(componentRecordPath(projectRoot, componentPath));
      } catch {
        entries[jobId] = { ...entry, runtimeState: "unknown", reconciliationState: "unavailable", blocker: "durable component record is unavailable; completion is not inferred" };
        continue;
      }
      const currentRevision = resolveTaskRevision(record.raw, componentPath);
      if (currentRevision !== entry.taskRevision || !Number.isInteger(entry.attempt) || entry.attempt < 1) {
        entries[jobId] = {
          ...entry,
          runtimeState: "orphaned",
          reconciliationState: "orphaned",
          blocker: "runtime-map identity does not match the current durable component revision/attempt",
        };
        continue;
      }
      const state = await loadPrivateState(entry.statePath);
      let summary: BridgeSummary | null = null;
      try {
        summary = JSON.parse(await readFile(entry.bridgeSummaryPath, "utf8")) as BridgeSummary;
      } catch {
        summary = null;
      }
      const handles = stateHandles(state);
      const health = await handleHealth(handles);
      const allDead = Object.values(health).every((value) => value === false);
      const anyLive = Object.values(health).some((value) => value === true);
      let runtimeState = entry.runtimeState;
      if (latestEvent(record, entry.jobId, ["cleanup-complete"])) runtimeState = "cleanup";
      else if (latestEvent(record, entry.jobId, ["cancellation-requested", "cancellation-dispatched", "cancellation-confirmed", "cancellation-waiting", "cancellation-escalated"]) || ["cancelling", "cancelled"].includes(state?.status ?? "")) runtimeState = "cancellation";
      else if (state && ["completed", "failed", "cancelled", "unavailable"].includes(state.status ?? "")) runtimeState = "terminal";
      else if (state && ["running", "waiting"].includes(state.status ?? "")) runtimeState = "running";
      else if (!state) runtimeState = "unknown";
      else runtimeState = "unknown";
      entries[jobId] = {
        ...entry,
        componentPath,
        processHandles: handles,
        sessionHandles: summary && summary.sessions.length > 0
          ? { ...entry.sessionHandles, openCode: "observed-in-private-runtime" }
          : entry.sessionHandles,
        runtimeState,
        reconciliationState: !state
          ? (runtimeState === "cleanup" || ["completed", "failed", "cancelled"].includes(record.status)) && allDead ? "dead" : "unknown"
          : anyLive ? "live" : allDead ? "dead" : "unknown",
        cleanupState: runtimeState === "cleanup" ? "complete" : entry.cleanupState,
        blocker: !state ? "private supervisor state is unavailable; durable record remains authoritative" : null,
      };
    }
    return { ...map, entries };
  });
  return { path, availability: "available", map: next, reason: null };
}

async function handleHealth(handles: RuntimeMapEntry["processHandles"]): Promise<Record<string, boolean | "unknown">> {
  const values: Array<{ pid: number | null; group: boolean }> = [
    { pid: handles.supervisorPid, group: false },
    { pid: handles.supervisorProcessGroupId, group: true },
    { pid: handles.workerPid, group: false },
    { pid: handles.workerProcessGroupId, group: true },
  ];
  const health: Array<boolean | "unknown"> = [];
  for (const value of values) {
    if (value.pid === null || !Number.isInteger(value.pid) || value.pid <= 0) {
      health.push(false);
      continue;
    }
    try {
      process.kill(value.group ? -value.pid : value.pid, 0);
      health.push(true);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      health.push(code === "ESRCH" ? false : code === "EPERM" ? true : "unknown");
    }
  }
  return {
    supervisorAlive: health[0],
    supervisorProcessGroupAlive: health[1],
    workerAlive: health[2],
    workerProcessGroupAlive: health[3],
  };
}

async function syncRuntimeMap(handle: OpenCodeJobHandle, observedRecord?: DurableRecordObservation): Promise<RuntimeMapEntry> {
  const record = observedRecord ?? await readDurableRecord(handle.recordPath);
  const state = await loadPrivateState(handle.statePath);
  const summary = await loadBridgeSummary(handle);
  await recordBridgeEvidence(handle, summary);
  const latestRecord = await readDurableRecord(handle.recordPath);
  const entry = await persistEntryWithState(handle, latestRecord, state);
  return updateEntryFromSummary(handle, entry, summary);
}

export interface OpenCodeObservation {
  supervisor: Awaited<ReturnType<typeof observe>>;
  status: Record<string, unknown>;
  runtimeMap: RuntimeMapEntry | null;
}

/** Observe the host job, then join the read-only path/attempt status surface. */
export async function observeOpenCodeJob(handle: OpenCodeJobHandle): Promise<OpenCodeObservation> {
  const supervisor = await observe(handle);
  const entry = await syncRuntimeMap(handle, supervisor.record).catch(() => null);
  const status = await readComponentStatus({
    projectRoot: handle.projectRoot,
    componentPath: handle.component,
    attempt: handle.attempt,
    stateHome: handle.stateHome,
  });
  return { supervisor, status, runtimeMap: entry };
}

/** The component-path status API remains read-only and never requires JobId. */
export function readOpenCodeStatus(options: ComponentStatusOptions): Promise<Record<string, unknown>> {
  return readComponentStatus(options);
}

/** Repeated polling delegates to the accepted component-status-watch generator. */
export function watchOpenCodeStatus(options: ComponentWatchOptions): AsyncGenerator<Record<string, unknown>> {
  return watchComponentStatus(options);
}

export async function cancelOpenCodeJob(handle: OpenCodeJobHandle, reason: string): Promise<Awaited<ReturnType<typeof cancelComponent>>> {
  const result = await cancelComponent(handle, reason);
  await syncRuntimeMap(handle).catch(() => undefined);
  return result;
}

export async function confirmOpenCodeCancellation(handle: OpenCodeJobHandle, timeoutMilliseconds = 3_000): Promise<Awaited<ReturnType<typeof confirmCancellation>>> {
  const result = await confirmCancellation(handle, timeoutMilliseconds);
  await syncRuntimeMap(handle).catch(() => undefined);
  return result;
}

export async function cleanupOpenCodeJob(handle: OpenCodeJobHandle): Promise<{ cleaned: boolean; reason?: string; runtimeMap: RuntimeMapEntry | null }> {
  const result = await cleanupComponent(handle);
  let entry: RuntimeMapEntry | null = null;
  try {
    const record = await readDurableRecord(handle.recordPath);
    const state = await loadPrivateState(handle.statePath);
    entry = await persistEntryWithState(handle, record, state);
    if (result.cleaned) {
      entry = {
        ...entry,
        runtimeState: "cleanup",
        cleanupState: "complete",
        reconciliationState: "dead",
        lastObservedAt: isoNow(),
        lastReconciledAt: isoNow(),
      };
      await persistEntry(runtimeMapPath(handle.projectRoot, handle.stateHome), entry);
    }
  } catch {
    // Cleanup's durable record remains authoritative if runtime-map cleanup
    // observation is unavailable; callers receive the supervisor result.
  }
  return { ...result, runtimeMap: entry };
}
