import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, open, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { launchComponent, type AdapterLaunchRequest, type ProactivePermissionProfile } from "../../opencode-launch-adapter/adapter.ts";
import {
  answerPermission,
  cleanup,
  confirmCancellation,
  noLeftover,
  observe,
  readDurableRecord,
  recordHandoff,
  requestCancellation,
  validateRoleChain,
  validateTaskEvent,
  type DurableCheckpoint,
  type DurableRecordObservation,
  type JobHandle,
  type RoleChain,
} from "../../subprocess-execution-foundation/supervisor.ts";
import { watchComponentStatus } from "../../component-status-watch/status-watch.ts";
import { readComponentStatus } from "../../component-status-watch/status-watch.ts";

/**
 * Deterministic local backend fixture.
 *
 * The fixture deliberately uses the accepted adapter's normalized launch seam
 * and generic supervisor, but its worker is this file's harmless Bun process.
 * The adapter label in a supervisor checkpoint is therefore boundary evidence,
 * not evidence of an OpenCode invocation or session.
 */

export const MOCK_ADAPTER_ID = "mock-job-adapter" as const;
export const ACCEPTED_ADAPTER_BOUNDARY = "opencode-launch-adapter" as const;
export const MOCK_TASK_REVISION = "mock-supervisor-fixture-v1" as const;
export const REQUIRED_ENVELOPE_KEYS = ["componentPath", "taskRevision", "attempt", "parentContext"] as const;
export const CONTROL_NAMES = [
  "delayed-completion",
  "controlled-failure",
  "permission-awaiting",
  "permission-denied",
  "cancellation",
  "controller-loss",
] as const;

export type MockControl = (typeof CONTROL_NAMES)[number];

export interface MockParentContext {
  componentPath: string;
  role: "orchestrator";
  sessionId: string;
  parentSessionId: string;
}

export interface MockLaunchEnvelope {
  componentPath: string;
  taskRevision: string;
  attempt: number;
  parentContext: MockParentContext;
}

export interface MockHandleFile {
  jobId: string;
  component: string;
  recordPath: string;
  runtimeDir: string;
  workspacePath: string;
  statePath: string;
  attempt: number;
}

export interface MockLaunchInput {
  projectRoot: string;
  stateHome?: string;
  envelope: unknown;
  control: MockControl;
}

export interface MockLaunchResult {
  outcome: string;
  protocol: "host-neutral-execution";
  adapterBoundary: {
    name: typeof ACCEPTED_ADAPTER_BOUNDARY;
    backend: typeof MOCK_ADAPTER_ID;
    openCodeEvidence: false;
  };
  envelope: MockLaunchEnvelope;
  handle: MockHandleFile;
  taskRevision: string;
  roleChain: RoleChain;
  events: string[];
  runtimeMapPath: string;
  record: DurableRecordObservation;
}

export interface MockReconciliation {
  protocol: "component-status-watch";
  componentPath: string;
  taskRevision: string;
  attempt: number | "unavailable";
  classification: "live" | "terminal" | "stale" | "dead" | "orphaned" | "unknown" | "unavailable" | "missing";
  statusClassification: string;
  mapAvailability: string;
  stableIdentityPreserved: true;
  jobId: { value: string; diagnosticOnly: true; lookupKey: false } | "unavailable";
  reason: string;
  status: Record<string, unknown>;
}

interface RuntimeMapEntry extends Record<string, unknown> {
  jobId: string;
  componentPath: string;
  taskRevision: string;
  attempt: number;
  adapter: string;
  backend: typeof MOCK_ADAPTER_ID;
  statePath: string;
  runtimeDir: string;
  runtimeState: string;
  lastObservedAt: string;
}

interface RuntimeMapDocument {
  version: 1;
  entries: Record<string, RuntimeMapEntry>;
}

const CHECKPOINT_BEGIN = "<!-- subprocess-execution-foundation:begin -->";
const CHECKPOINT_END = "<!-- subprocess-execution-foundation:end -->";
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;
const TASK_REVISION = /^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im;
const scriptPath = fileURLToPath(import.meta.url);

function isoNow(): string {
  return new Date().toISOString();
}

function json(value: unknown): string {
  return JSON.stringify(value);
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function projectKey(projectRoot: string): string {
  return `project-${createHash("sha256").update(resolve(projectRoot)).digest("hex").slice(0, 16)}`;
}

function runtimeMapPath(projectRoot: string, stateHome = process.env.XDG_STATE_HOME ?? join(homedir(), ".local", "state")): string {
  return join(resolve(stateHome), "as-is", "projects", projectKey(projectRoot), "runtime", "job-map.json");
}

function componentRecordPath(projectRoot: string, componentPath: string): string {
  return join(resolve(projectRoot), componentPath, "as-is.md");
}

function canonicalComponentPath(projectRoot: string, componentPath: string): string {
  if (!componentPath.trim() || isAbsolute(componentPath) || componentPath.includes("\\")) {
    throw new MockProtocolError("malformed-envelope", "componentPath must be a non-empty canonical repository-relative path");
  }
  const root = resolve(projectRoot);
  const candidate = relative(root, resolve(root, componentPath)).split(sep).join("/");
  if (isAbsolute(candidate) || candidate === ".." || candidate.startsWith("../")) {
    throw new MockProtocolError("wrong-component", "componentPath escapes the project root");
  }
  return candidate || ".";
}

function parentComponentPath(componentPath: string): string {
  if (componentPath === ".") return ".";
  return componentPath.split("/").slice(0, -1).join("/") || ".";
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

function configuredWorker(raw: string): string {
  return raw.match(/^  worker:\s*([^\r\n]+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function roleChainFor(envelope: MockLaunchEnvelope): RoleChain {
  const implementerSessionId = `mock-implementer-${createHash("sha256")
    .update(`${envelope.componentPath}/${envelope.taskRevision}/${envelope.attempt}`)
    .digest("hex")
    .slice(0, 16)}`;
  return {
    asIs: { role: "as-is", sessionId: envelope.parentContext.parentSessionId, parentSessionId: null, source: MOCK_ADAPTER_ID },
    orchestrator: {
      role: "orchestrator",
      sessionId: envelope.parentContext.sessionId,
      parentSessionId: envelope.parentContext.parentSessionId,
      source: MOCK_ADAPTER_ID,
    },
    implementer: {
      role: "implementer",
      sessionId: implementerSessionId,
      parentSessionId: envelope.parentContext.sessionId,
      source: MOCK_ADAPTER_ID,
    },
  };
}

function permissionProfile(): ProactivePermissionProfile {
  return {
    source: `${MOCK_ADAPTER_ID}:local-capability-profile`,
    approvedWorkspace: true,
    processGroupControl: true,
    standardInput: "disabled",
    eventPersistence: true,
    watchdog: true,
    userEventBubbling: true,
  };
}

function workerControl(control: MockControl): string {
  return control;
}

function workerCommand(control: MockControl): string[] {
  return [process.execPath, scriptPath, "--worker", workerControl(control)];
}

function parseControl(value: string | undefined): MockControl {
  if (value && (CONTROL_NAMES as readonly string[]).includes(value)) return value as MockControl;
  throw new MockProtocolError("malformed-control", `control must be one of ${CONTROL_NAMES.join(", ")}`);
}

function parseEnvelope(value: unknown): MockLaunchEnvelope {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new MockProtocolError("malformed-envelope", "envelope must be a JSON object");
  }
  const object = value as Record<string, unknown>;
  if (!("parentContext" in object)) {
    throw new MockProtocolError("missing-parent", "parentContext is required");
  }
  const keys = Object.keys(object).sort();
  const expected = [...REQUIRED_ENVELOPE_KEYS].sort();
  if (json(keys) !== json(expected)) {
    throw new MockProtocolError("malformed-envelope", `envelope must contain exactly ${REQUIRED_ENVELOPE_KEYS.join(", ")}`);
  }
  if (typeof object.componentPath !== "string" || typeof object.taskRevision !== "string"
    || !Number.isInteger(object.attempt) || (object.attempt as number) < 1) {
    throw new MockProtocolError("malformed-envelope", "componentPath, taskRevision, and one-based attempt are required");
  }
  const parent = object.parentContext;
  if (parent === null || typeof parent !== "object" || Array.isArray(parent)) {
    throw new MockProtocolError("missing-parent", "parentContext is required");
  }
  const parentObject = parent as Record<string, unknown>;
  const parentKeys = Object.keys(parentObject).sort();
  if (json(parentKeys) !== json(["componentPath", "parentSessionId", "role", "sessionId"])) {
    throw new MockProtocolError("malformed-envelope", "parentContext must contain exactly componentPath, role, sessionId, and parentSessionId");
  }
  if (parentObject.role !== "orchestrator" || typeof parentObject.componentPath !== "string"
    || typeof parentObject.sessionId !== "string" || typeof parentObject.parentSessionId !== "string"
    || !parentObject.componentPath.trim() || !parentObject.sessionId.trim() || !parentObject.parentSessionId.trim()) {
    throw new MockProtocolError("wrong-parent", "parentContext must identify the configured orchestrator and both parent sessions");
  }
  return {
    componentPath: object.componentPath,
    taskRevision: object.taskRevision,
    attempt: object.attempt as number,
    parentContext: {
      componentPath: parentObject.componentPath,
      role: "orchestrator",
      sessionId: parentObject.sessionId,
      parentSessionId: parentObject.parentSessionId,
    },
  };
}

export class MockProtocolError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "MockProtocolError";
    this.code = code;
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
    try {
      const directory = await open(dirname(path), "r");
      try {
        await directory.sync();
      } finally {
        await directory.close();
      }
    } catch {
      // Atomic rename remains the available host-local durability evidence.
    }
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function readRuntimeMap(path: string): Promise<RuntimeMapDocument | null> {
  try {
    const value = JSON.parse(await readFile(path, "utf8")) as Partial<RuntimeMapDocument>;
    if (value.version !== 1 || value.entries === null || typeof value.entries !== "object" || Array.isArray(value.entries)) {
      throw new Error("runtime map has an unsupported shape");
    }
    return { version: 1, entries: value.entries as Record<string, RuntimeMapEntry> };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return null;
    throw new MockProtocolError("runtime-map-unavailable", `runtime map is unavailable: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeRuntimeMap(path: string, document: RuntimeMapDocument): Promise<void> {
  await atomicWrite(path, `${JSON.stringify(document, null, 2)}\n`);
  await chmod(dirname(path), 0o700);
}

async function upsertRuntimeMap(path: string, entry: RuntimeMapEntry): Promise<void> {
  const current = await readRuntimeMap(path) ?? { version: 1 as const, entries: {} };
  current.entries[entry.jobId] = entry;
  await writeRuntimeMap(path, current);
}

async function removeRuntimeMapEntry(path: string, jobId: string): Promise<void> {
  const current = await readRuntimeMap(path);
  if (!current || !(jobId in current.entries)) return;
  delete current.entries[jobId];
  await writeRuntimeMap(path, current);
}

async function appendCheckpoint(
  recordPath: string,
  checkpoint: DurableCheckpoint,
  status?: string,
  updateUpdated = true,
): Promise<void> {
  const lockPath = `${recordPath}.execution-lock`;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      await mkdir(lockPath, { recursive: false, mode: 0o700 });
      try {
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
        next = begin >= 0 && end > begin
          ? `${next.slice(0, end)}${line}\n${next.slice(end)}`
          : `${next.trimEnd()}\n\n## Execution Foundation Checkpoints\n\n${CHECKPOINT_BEGIN}\n${line}\n${CHECKPOINT_END}\n`;
        await atomicWrite(recordPath, next);
      } finally {
        await rm(lockPath, { recursive: true, force: true });
      }
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await sleep(5);
    }
  }
  throw new Error("durable record blocker: mock checkpoint lock timed out");
}

function fixtureCheckpoint(jobId: string, event: string, details: Record<string, unknown>): DurableCheckpoint {
  return { operation: "mock-job", event, jobId, source: MOCK_ADAPTER_ID, observedAt: isoNow(), details };
}

function handleValue(handle: JobHandle): MockHandleFile {
  return {
    jobId: handle.jobId,
    component: handle.component,
    recordPath: handle.recordPath,
    runtimeDir: handle.runtimeDir,
    workspacePath: handle.workspacePath,
    statePath: handle.statePath,
    attempt: handle.attempt,
  };
}

function toHandle(value: MockHandleFile): JobHandle {
  return { ...value };
}

function makeEntry(handle: JobHandle, envelope: MockLaunchEnvelope, runtimeState = "launching"): RuntimeMapEntry {
  return {
    jobId: handle.jobId,
    componentPath: envelope.componentPath,
    taskRevision: envelope.taskRevision,
    attempt: envelope.attempt,
    adapter: MOCK_ADAPTER_ID,
    backend: MOCK_ADAPTER_ID,
    statePath: handle.statePath,
    runtimeDir: handle.runtimeDir,
    runtimeState,
    lastObservedAt: isoNow(),
  };
}

async function rejectEnvelope(projectRoot: string, envelope: unknown, error: MockProtocolError): Promise<never> {
  let recordPath: string | null = null;
  try {
    const value = envelope as Record<string, unknown>;
    if (value && typeof value.componentPath === "string") {
      const componentPath = canonicalComponentPath(projectRoot, value.componentPath);
      recordPath = componentRecordPath(projectRoot, componentPath);
      await stat(recordPath);
    }
  } catch {
    recordPath = null;
  }
  if (recordPath) {
    const record = await readDurableRecord(recordPath);
    if (!["completed", "cancelled"].includes(record.status)) {
      await appendCheckpoint(recordPath, fixtureCheckpoint("mock-rejected", "mock-envelope-rejected", {
        blocker: error.code,
        reason: error.message,
        rejected: true,
        noWorkerSubmitted: true,
        recovery: "correct the envelope or record a new bounded direction; do not substitute a role",
      }), "blocked");
    }
  }
  throw error;
}

function parentFailure(envelope: MockLaunchEnvelope, componentPath: string): string | null {
  if (envelope.parentContext.role !== "orchestrator") return "parentContext role is not orchestrator";
  if (envelope.parentContext.componentPath !== parentComponentPath(componentPath)) {
    return `parentContext names ${envelope.parentContext.componentPath}, expected ${parentComponentPath(componentPath)}`;
  }
  if (envelope.parentContext.sessionId === envelope.parentContext.parentSessionId) {
    return "parentContext session attribution is not distinct";
  }
  return null;
}

async function validateEnvelopeForLaunch(projectRoot: string, value: unknown): Promise<{
  envelope: MockLaunchEnvelope;
  componentPath: string;
  recordPath: string;
  record: DurableRecordObservation;
  chain: RoleChain;
}> {
  let envelope: MockLaunchEnvelope;
  try {
    envelope = parseEnvelope(value);
    const componentPath = canonicalComponentPath(projectRoot, envelope.componentPath);
    const recordPath = componentRecordPath(projectRoot, componentPath);
    const record = await readDurableRecord(recordPath);
    const expectedRevision = taskRevision(record.raw, componentPath);
    if (envelope.taskRevision !== expectedRevision) {
      throw new MockProtocolError("stale-envelope", `taskRevision ${envelope.taskRevision} does not match durable ${expectedRevision}`);
    }
    const parentReason = parentFailure(envelope, componentPath);
    if (parentReason) throw new MockProtocolError("wrong-parent", parentReason);
    if (configuredWorker(record.raw) !== "implementer") {
      throw new MockProtocolError("wrong-configured-role", "durable record does not configure implementer");
    }
    const chain = roleChainFor(envelope);
    validateRoleChain(chain);
    return { envelope, componentPath, recordPath, record, chain };
  } catch (error) {
    if (error instanceof MockProtocolError) throw error;
    throw new MockProtocolError("malformed-envelope", error instanceof Error ? error.message : String(error));
  }
}

async function appendRoleEvent(recordPath: string, handle: JobHandle, envelope: MockLaunchEnvelope, chain: RoleChain, control: MockControl): Promise<void> {
  const taskEvent = {
    kind: "task" as const,
    source: MOCK_ADAPTER_ID,
    sessionId: chain.implementer.sessionId,
    parentSessionId: chain.orchestrator.sessionId,
    target: "implementer",
    agent: "implementer",
  };
  validateTaskEvent(taskEvent, chain);
  await appendCheckpoint(recordPath, fixtureCheckpoint(handle.jobId, "role-attributed", {
    ...taskEvent,
    roleChain: chain,
    envelope,
    attempt: envelope.attempt,
    taskRevision: envelope.taskRevision,
    control,
    configuredWorker: "implementer",
    parentLink: "as-is -> orchestrator -> implementer",
  }));
}

function requestFor(
  projectRoot: string,
  componentPath: string,
  envelope: MockLaunchEnvelope,
  chain: RoleChain,
  control: MockControl,
): AdapterLaunchRequest {
  return {
    projectRoot,
    componentPath,
    parentContext: envelope.parentContext,
    roleChain: chain,
    job: {
      // This is the accepted normalized adapter discriminant. The command is
      // the local mock worker; no OpenCode binary or provider is contacted.
      adapter: "opencode",
      executionMode: "supervisor-owned-detached",
      componentPath,
      workerRole: "implementer",
      command: workerCommand(control),
      permissionProfile: permissionProfile(),
      checkInSeconds: 0.15,
      startDelayMilliseconds: control === "delayed-completion" ? 120 : 0,
    },
    attempt: envelope.attempt,
  };
}

export async function launchMockJob(input: MockLaunchInput): Promise<MockLaunchResult> {
  let validated: Awaited<ReturnType<typeof validateEnvelopeForLaunch>>;
  try {
    validated = await validateEnvelopeForLaunch(input.projectRoot, input.envelope);
  } catch (error) {
    if (error instanceof MockProtocolError) return rejectEnvelope(input.projectRoot, input.envelope, error);
    throw error;
  }
  const { envelope, componentPath, recordPath, record, chain } = validated;
  const mapPath = runtimeMapPath(input.projectRoot, input.stateHome);
  const launched = await launchComponent(requestFor(input.projectRoot, componentPath, envelope, chain, input.control));
  const handle = launched.handle;
  if (launched.outcome !== "started") {
    await upsertRuntimeMap(mapPath, makeEntry(handle, envelope, launched.outcome));
    return {
      outcome: launched.outcome,
      protocol: "host-neutral-execution",
      adapterBoundary: { name: ACCEPTED_ADAPTER_BOUNDARY, backend: MOCK_ADAPTER_ID, openCodeEvidence: false },
      envelope,
      handle: handleValue(handle),
      taskRevision: envelope.taskRevision,
      roleChain: chain,
      events: ["launch-rejected"],
      runtimeMapPath: mapPath,
      record: launched.record,
    };
  }
  await appendRoleEvent(recordPath, handle, envelope, chain, input.control);
  await appendCheckpoint(recordPath, fixtureCheckpoint(handle.jobId, "mock-backend-attached", {
    adapterBoundary: ACCEPTED_ADAPTER_BOUNDARY,
    backend: MOCK_ADAPTER_ID,
    openCodeEvidence: false,
    attempt: envelope.attempt,
    taskRevision: envelope.taskRevision,
    envelope,
    jobId: { value: handle.jobId, diagnosticOnly: true, lookupKey: false },
    lifecycle: "started",
  }));
  await upsertRuntimeMap(mapPath, makeEntry(handle, envelope));
  return {
    outcome: "started",
    protocol: "host-neutral-execution",
    adapterBoundary: { name: ACCEPTED_ADAPTER_BOUNDARY, backend: MOCK_ADAPTER_ID, openCodeEvidence: false },
    envelope,
    handle: handleValue(handle),
    taskRevision: envelope.taskRevision,
    roleChain: chain,
    events: ["launch-requested", "launch-accepted", "adapter-envelope-recorded", "role-attributed", "mock-backend-attached"],
    runtimeMapPath: mapPath,
    record: await readDurableRecord(recordPath),
  };
}

export async function awaitHostTerminal(handleValueInput: MockHandleFile, timeoutMilliseconds = 8_000): Promise<Awaited<ReturnType<typeof observe>>> {
  const handle = toHandle(handleValueInput);
  const deadline = Date.now() + timeoutMilliseconds;
  let current = await observe(handle);
  while (!["completed", "failed", "cancelled", "unavailable"].includes(current.host.status) && Date.now() < deadline) {
    await sleep(25);
    current = await observe(handle);
  }
  if (!["completed", "failed", "cancelled", "unavailable"].includes(current.host.status)) {
    throw new Error(`mock host did not reach terminal observation: ${current.host.status}`);
  }
  return current;
}

export async function completeMockJob(
  handleValueInput: MockHandleFile,
  projectRoot: string,
  stateHome?: string,
  validation = "deterministic mock completion observed through accepted adapter and supervisor",
): Promise<{ record: DurableRecordObservation; cleanup: { cleaned: boolean; reason?: string }; leftovers: Awaited<ReturnType<typeof noLeftover>> }> {
  const handle = toHandle(handleValueInput);
  const observed = await awaitHostTerminal(handle);
  if (observed.host.status !== "completed") throw new Error(`cannot hand off non-successful mock host status ${observed.host.status}`);
  const record = await recordHandoff(handle, {
    validation: [validation],
    result: "deterministic local mock backend completed without OpenCode evidence",
    descendantsTerminal: true,
    failedOrCancelledDescendants: [],
  });
  const cleaned = await cleanup(handle);
  if (cleaned.cleaned) await removeRuntimeMapEntry(runtimeMapPath(projectRoot, stateHome), handle.jobId).catch(() => undefined);
  return { record, cleanup: cleaned, leftovers: await noLeftover(handle) };
}

export async function finalizeMockJob(
  handleValueInput: MockHandleFile,
  projectRoot: string,
  stateHome?: string,
  validation = "deterministic local mock completion reconciled after controller loss",
): Promise<{ record: DurableRecordObservation; cleanup: { cleaned: boolean; reason?: string }; leftovers: Awaited<ReturnType<typeof noLeftover>> }> {
  const handle = toHandle(handleValueInput);
  const record = await recordHandoff(handle, {
    validation: [validation],
    result: "detached local mock backend reached host completion and received explicit durable handoff",
    descendantsTerminal: true,
    failedOrCancelledDescendants: [],
  });
  const cleaned = await cleanup(handle);
  if (cleaned.cleaned) await removeRuntimeMapEntry(runtimeMapPath(projectRoot, stateHome), handle.jobId).catch(() => undefined);
  return { record, cleanup: cleaned, leftovers: await noLeftover(handle) };
}

export async function cleanupMockJob(
  handleValueInput: MockHandleFile,
  projectRoot: string,
  stateHome?: string,
): Promise<{ cleanup: { cleaned: boolean; reason?: string }; leftovers: Awaited<ReturnType<typeof noLeftover>> }> {
  const handle = toHandle(handleValueInput);
  const cleaned = await cleanup(handle);
  if (cleaned.cleaned) await removeRuntimeMapEntry(runtimeMapPath(projectRoot, stateHome), handle.jobId).catch(() => undefined);
  return { cleanup: cleaned, leftovers: await noLeftover(handle) };
}

export async function cancelMockJob(
  handleValueInput: MockHandleFile,
  projectRoot: string,
  stateHome?: string,
  reason = "deterministic fixture cancellation",
): Promise<{ record: DurableRecordObservation; cleanup: { cleaned: boolean; reason?: string }; leftovers: Awaited<ReturnType<typeof noLeftover>> }> {
  const handle = toHandle(handleValueInput);
  await requestCancellation(handle, reason);
  const cancelled = await confirmCancellation(handle, 4_000);
  const cleaned = await cleanup(handle);
  if (cleaned.cleaned) await removeRuntimeMapEntry(runtimeMapPath(projectRoot, stateHome), handle.jobId).catch(() => undefined);
  return { record: cancelled.record, cleanup: cleaned, leftovers: await noLeftover(handle) };
}

export async function exercisePermission(
  handleValueInput: MockHandleFile,
  decision: "awaiting" | "approved" | "denied",
): Promise<{ permission: { outcome: "waiting"; fingerprint: string; record: DurableRecordObservation }; answer?: Awaited<ReturnType<typeof answerPermission>> }> {
  const handle = toHandle(handleValueInput);
  const scope = {
    operation: "fixture-controlled-operation",
    capabilityClass: "mock-permission-boundary",
    resourceClass: "temporary-owned-fixture-state",
    failureClass: "approval-required",
  };
  const fingerprint = createHash("sha256").update(JSON.stringify({
    capabilityClass: scope.capabilityClass,
    operation: scope.operation,
    resourceClass: scope.resourceClass,
    failureClass: scope.failureClass,
  })).digest("hex").slice(0, 24);
  const before = await readDurableRecord(handle.recordPath);
  const recordRevision = before.updated ?? "unavailable";
  // The generic supervisor's permission API intentionally blocks when no host
  // user-event bridge is proven. This fixture supplies the documented durable
  // awaiting boundary itself, without a prompt, then uses the supervisor's
  // scoped answer API for an explicit decision.
  await appendCheckpoint(handle.recordPath, fixtureCheckpoint(handle.jobId, "permission-needed", {
    source: "supervisor-permission-boundary",
    ...scope,
    recordRevision,
    reason: "fixture control requests a durable user decision; no prompt or approval is inferred",
    fingerprint,
    approvalDecision: "awaiting-user-approval",
    permissionState: "awaiting-user-approval",
    hiddenPrompt: false,
    userVisibleEscalationRequired: true,
  }), "awaiting-approval");
  const permission = { outcome: "waiting" as const, fingerprint, record: await readDurableRecord(handle.recordPath) };
  if (decision === "awaiting") return { permission };
  const answer = await answerPermission(handle, permission.fingerprint, decision);
  return { permission, answer };
}

function classificationFromStatus(value: Record<string, unknown>): MockReconciliation["classification"] {
  const runtime = value.runtime as Record<string, unknown> | undefined;
  const map = value.runtimeMap as Record<string, unknown> | undefined;
  const classification = runtime?.classification;
  if (classification === "live" || classification === "terminal" || classification === "stale" || classification === "dead"
    || classification === "orphaned" || classification === "unknown" || classification === "unavailable" || classification === "missing") {
    return classification;
  }
  if (map?.availability !== "available") return "unavailable";
  return "unknown";
}

export async function reconcileMockJob(options: {
  projectRoot: string;
  componentPath: string;
  stateHome?: string;
  attempt?: number;
  now?: Date;
  checkInSeconds?: number;
}): Promise<MockReconciliation> {
  const status = await readComponentStatus(options);
  const identity = status.identity as Record<string, unknown>;
  const runtimeJobId = status.runtimeJobId as Record<string, unknown> | undefined;
  const runtimeMap = status.runtimeMap as Record<string, unknown> | undefined;
  const classification = classificationFromStatus(status);
  return {
    protocol: "component-status-watch",
    componentPath: String(identity?.componentPath ?? "unavailable"),
    taskRevision: String(identity?.taskRevision ?? "unavailable"),
    attempt: typeof identity?.attempt === "number" ? identity.attempt : "unavailable",
    classification,
    statusClassification: String((status.durableState as Record<string, unknown> | undefined)?.classification ?? "unavailable"),
    mapAvailability: String(runtimeMap?.availability ?? "unavailable"),
    stableIdentityPreserved: true,
    jobId: runtimeJobId?.diagnosticOnly === true && runtimeJobId.lookupKey === false
      ? { value: String(runtimeJobId.value), diagnosticOnly: true, lookupKey: false }
      : "unavailable",
    reason: String((status.reconciliation as Record<string, unknown> | undefined)?.reason ?? "runtime observation unavailable"),
    status,
  };
}

export async function watchMockStatus(options: {
  projectRoot: string;
  componentPath: string;
  stateHome?: string;
  attempt?: number;
  count: number;
  intervalMilliseconds: number;
}): Promise<Record<string, unknown>[]> {
  const observations: Record<string, unknown>[] = [];
  for await (const value of watchComponentStatus(options)) observations.push(value);
  return observations;
}

async function readJsonInput(args: string[]): Promise<unknown> {
  const fileIndex = args.indexOf("--envelope-file");
  const inlineIndex = args.indexOf("--envelope-json");
  if (inlineIndex >= 0 && args[inlineIndex + 1]) return JSON.parse(args[inlineIndex + 1]);
  if (fileIndex >= 0 && args[fileIndex + 1]) return JSON.parse(await readFile(args[fileIndex + 1], "utf8"));
  const input = await new Response(Bun.stdin.stream()).text();
  return JSON.parse(input);
}

function arg(args: string[], name: string, required = true): string | undefined {
  const index = args.indexOf(name);
  const value = index >= 0 ? args[index + 1] : undefined;
  if (required && (!value || value.startsWith("--"))) throw new MockProtocolError("malformed-cli", `${name} requires a value`);
  return value;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await atomicWrite(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function readHandleFile(path: string): Promise<MockHandleFile> {
  return JSON.parse(await readFile(path, "utf8")) as MockHandleFile;
}

async function cliMain(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  if (command === "--worker") {
    const control = args[1];
    if (control === "controlled-failure") {
      console.log(json({ protocol: "mock-worker", event: "controlled-failure", exitCode: 17 }));
      process.exit(17);
    }
    const delay = control === "delayed-completion" ? 280 : control === "controller-loss" ? 650 : 10_000;
    console.log(json({ protocol: "mock-worker", event: "started", control, deterministic: true }));
    await sleep(delay);
    console.log(json({ protocol: "mock-worker", event: "completed", control }));
    return;
  }
  if (command === "launch" || command === "controller-loss") {
    const projectRoot = resolve(arg(args, "--project-root") ?? process.cwd());
    const stateHome = arg(args, "--state-home");
    const control = parseControl(arg(args, "--control"));
    const envelope = await readJsonInput(args);
    const result = await launchMockJob({ projectRoot, stateHome, envelope, control });
    const resultFile = arg(args, "--result-file", false);
    if (resultFile) await writeJson(resultFile, { ...result, handle: result.handle });
    console.log(JSON.stringify({ ...result, record: undefined }));
    if (command === "controller-loss") await sleep(30_000);
    return;
  }
  if (command === "status" || command === "watch") {
    const projectRoot = resolve(arg(args, "--project-root") ?? process.cwd());
    const componentPath = arg(args, "--component-path") ?? ".";
    const stateHome = arg(args, "--state-home");
    const attemptValue = arg(args, "--attempt", false);
    const attempt = attemptValue === undefined ? undefined : Number(attemptValue);
    if (command === "status") {
      console.log(JSON.stringify(await reconcileMockJob({ projectRoot, componentPath, stateHome, attempt })));
      return;
    }
    const count = Number(arg(args, "--count") ?? "1");
    const intervalMilliseconds = Number(arg(args, "--interval-ms") ?? "25");
    const values = await watchMockStatus({ projectRoot, componentPath, stateHome, attempt, count, intervalMilliseconds });
    for (const value of values) console.log(JSON.stringify(value));
    return;
  }
  if (command === "permission") {
    const handle = await readHandleFile(arg(args, "--handle-file") as string);
    const decision = (arg(args, "--decision") ?? "awaiting") as "awaiting" | "approved" | "denied";
    console.log(JSON.stringify(await exercisePermission(handle, decision)));
    return;
  }
  if (command === "complete") {
    const handle = await readHandleFile(arg(args, "--handle-file") as string);
    const projectRoot = resolve(arg(args, "--project-root"));
    console.log(JSON.stringify(await completeMockJob(handle, projectRoot, arg(args, "--state-home", false))));
    return;
  }
  if (command === "cancel") {
    const handle = await readHandleFile(arg(args, "--handle-file") as string);
    const projectRoot = resolve(arg(args, "--project-root") ?? dirname(dirname(handle.recordPath)));
    console.log(JSON.stringify(await cancelMockJob(handle, projectRoot, arg(args, "--state-home", false))));
    return;
  }
  throw new MockProtocolError("malformed-cli", "usage: launch|controller-loss|status|watch|permission|complete|cancel");
}

if (import.meta.main && !process.argv.includes("--supervise")) {
  try {
    await cliMain();
  } catch (error) {
    const response = {
      protocol: "host-neutral-execution",
      outcome: "rejected",
      code: error instanceof MockProtocolError ? error.code : "fixture-error",
      reason: error instanceof Error ? error.message : String(error),
      noExternalService: true,
    };
    console.error(JSON.stringify(response));
    process.exitCode = 2;
  }
}
