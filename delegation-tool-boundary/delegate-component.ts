import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

/**
 * Host-neutral supervisor-provided delegation boundary.
 *
 * The request is intentionally smaller than the resolved launch input.  The
 * caller states its semantic identity and the child path; this module rereads
 * the records, derives parentage from the active supervisor binding, resolves
 * the configured worker and adapter, and persists the launch checkpoint before
 * returning.  Adapters receive resolved data through an interface and never
 * receive or derive nesting/session semantics.
 */

export const DELEGATE_COMPONENT = "delegate-component" as const;
export const DELEGATION_CHECKPOINT_BEGIN = "<!-- delegate-component:begin -->";
export const DELEGATION_CHECKPOINT_END = "<!-- delegate-component:end -->";
export const JOB_MAP_VERSION = 1 as const;

export type HostAdapterId = "opencode" | "shell" | "ci" | "remote" | (string & {});

export type DelegationFailureCode =
  | "missing-caller"
  | "mismatched-caller"
  | "missing-parent"
  | "wrong-role"
  | "wrong-component"
  | "duplicate-attempt"
  | "permission-denied"
  | "unavailable-supervisor";

export type DelegationOutcome = "started" | "waiting" | "rejected" | "failed" | "unavailable";
export type DelegationStatus =
  | "launch-accepted"
  | "awaiting-approval"
  | "blocked"
  | "unavailable"
  | "cancel-requested"
  | "cancelled"
  | "cleanup-complete";

export interface StableIdentity {
  componentPath: string;
  taskRevision: string;
  attempt: number;
}

export interface CallerIdentity extends StableIdentity {
  role: string;
}

export interface DelegateComponentRequest {
  caller: CallerIdentity;
  child: {
    componentPath: string;
    taskRevision?: string;
    attempt?: number;
  };
}

/**
 * This value is supplied by the supervisor/tool host, not by the agent
 * request.  `job.identity` is the only parent source used by this boundary.
 */
export interface SupervisorActiveBinding {
  repositoryRoot: string;
  active: boolean;
  supervisorAvailable?: boolean;
  toolContextId: string;
  expectedRole: string;
  /** An explicitly bound entrypoint role may differ from task.worker. */
  entrypointRole?: string;
  canDelegate: boolean;
  caller: CallerIdentity;
  job: {
    active: boolean;
    jobId: string;
    identity: CallerIdentity;
  };
}

export interface DurableAuthority {
  parentComponentPath: string;
  canReceive: boolean;
  descendantScope: string;
}

export interface DurableConstraints {
  cost: Record<string, number | string>;
  execution: Record<string, number | string>;
  delegation: Record<string, number | string>;
}

export interface ExecutionResolution {
  adapter: HostAdapterId;
  permissionProfile: Record<string, unknown>;
  jobSpecification: Record<string, unknown>;
  authority?: Partial<DurableAuthority>;
}

export interface DurableCheckpoint {
  operation: typeof DELEGATE_COMPONENT;
  event: string;
  jobId: string;
  source: string;
  observedAt: string;
  details: Record<string, unknown>;
}

export interface DurableComponentRecord {
  componentPath: string;
  recordPath: string;
  raw: string;
  status: string;
  workerRole: string;
  taskRevision: string;
  recordRevision: string;
  parentComponentPath: string;
  constraints: DurableConstraints;
  authority: DurableAuthority;
  execution: ExecutionResolution | null;
  checkpoints: DurableCheckpoint[];
}

export interface DurableStateSource {
  readRecord(componentPath: string): Promise<DurableComponentRecord | null>;
}

export type PreflightState = "allowed" | "denied" | "awaiting-approval" | "unavailable";

export interface AdapterPreflight {
  state: PreflightState;
  reason?: string;
  permissionState?: "awaiting-user-approval" | "denied";
}

export interface AdapterLaunchAcceptance {
  accepted: boolean;
  acceptedAt?: string;
  runtimeHandle?: string;
  reason?: string;
}

export interface AdapterControlResult {
  accepted: boolean;
  reason?: string;
}

export interface ResolvedAdapterLaunch {
  operation: typeof DELEGATE_COMPONENT;
  identity: StableIdentity;
  parent: CallerIdentity;
  recordRevision: string;
  workerRole: string;
  constraints: DurableConstraints;
  authority: DurableAuthority;
  permissionProfile: Record<string, unknown>;
  jobSpecification: Record<string, unknown>;
}

export interface DelegateAdapter {
  readonly id: HostAdapterId;
  preflight(input: ResolvedAdapterLaunch): Promise<AdapterPreflight>;
  launch(input: ResolvedAdapterLaunch): Promise<AdapterLaunchAcceptance>;
  cancel(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult>;
  cleanup(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult>;
}

export interface DiagnosticHandle {
  jobId?: string;
  source?: string;
  diagnosticOnly: true;
  lookupKey: false;
}

export interface DelegationResult {
  outcome: DelegationOutcome;
  status: DelegationStatus;
  componentPath: string | "unavailable";
  taskRevision: string | "unavailable";
  attempt: number | "unavailable";
  stableIdentity: StableIdentity | "unavailable";
  parent: CallerIdentity | "unavailable";
  workerRole: string | "unavailable";
  launch: {
    checkpoint: string;
    adapter: HostAdapterId | "unavailable";
    acceptedAt: string | "unavailable";
  };
  handle: DiagnosticHandle;
  blocker?: {
    code: DelegationFailureCode;
    reason: string;
    fallback: "not-permitted";
    permissionState?: "awaiting-user-approval" | "denied";
  };
  nextAction?: string;
}

export interface JobMapEntry {
  jobId: string;
  componentPath: string;
  taskRevision: string;
  attempt: number;
  recordRevision: string;
  adapter: HostAdapterId;
  runtimeState: string;
  acceptedAt: string | null;
  runtimeHandle?: string;
  updatedAt: string;
}

export interface JobMapDocument {
  version: typeof JOB_MAP_VERSION;
  entries: Record<string, JobMapEntry>;
}

export interface DelegationStatusObservation {
  componentPath: string;
  taskRevision: string | "unavailable";
  attempt: number | "unavailable";
  stableIdentity: StableIdentity | "unavailable";
  status: string;
  durable: {
    recordStatus: string | "unavailable";
    recordRevision: string | "unavailable";
    lastCheckpoint: string | "unavailable";
  };
  runtime: {
    state: string | "unavailable";
    adapter: HostAdapterId | "unavailable";
    jobId: DiagnosticHandle | "unavailable";
    map: "available" | "missing" | "malformed" | "unavailable";
  };
  nextAction: string;
}

export interface DelegationStatusOptions {
  projectRoot: string;
  componentPath: string;
  taskRevision?: string;
  attempt?: number;
  stateHome?: string;
}

export interface DelegationControlOptions extends DelegationStatusOptions {
  adapter?: DelegateAdapter;
}

export interface DelegateComponentSupervisorOptions {
  projectRoot: string;
  stateHome?: string;
  source?: DurableStateSource;
  adapters: DelegateAdapter[] | ReadonlyMap<string, DelegateAdapter>;
  now?: () => Date;
  jobId?: () => string;
}

interface JobMapRead {
  document: JobMapDocument | null;
  availability: "available" | "missing" | "malformed";
}

interface ParsedRequest {
  caller: CallerIdentity;
  child: DelegateComponentRequest["child"];
}

const TOOL_SOURCE = DELEGATE_COMPONENT;
const UNAVAILABLE = "unavailable" as const;

function json(value: unknown): string {
  return JSON.stringify(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOneBasedAttempt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return json(Object.keys(value).sort()) === json([...keys].sort());
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

function isDescendant(parent: string, child: string): boolean {
  return parent !== child && (parent === "." || child.startsWith(`${parent}/`));
}

function identityEqual(left: StableIdentity | undefined, right: StableIdentity | undefined): boolean {
  return Boolean(left && right)
    && left!.componentPath === right!.componentPath
    && left!.taskRevision === right!.taskRevision
    && left!.attempt === right!.attempt;
}

function callerEqual(left: CallerIdentity | undefined, right: CallerIdentity | undefined): boolean {
  return Boolean(left && right)
    && identityEqual(left, right)
    && left!.role === right!.role;
}

function identityShape(value: unknown): value is CallerIdentity {
  return isObject(value)
    && exactKeys(value, ["role", "componentPath", "taskRevision", "attempt"])
    && nonEmptyText(value.role)
    && nonEmptyText(value.componentPath)
    && nonEmptyText(value.taskRevision)
    && isOneBasedAttempt(value.attempt);
}

function parseRequest(value: unknown): { request: ParsedRequest } | { code: DelegationFailureCode; reason: string } {
  if (!isObject(value) || !("caller" in value)) {
    return { code: "missing-caller", reason: "semantic caller identity is required" };
  }
  if (!exactKeys(value, ["caller", "child"])) {
    return { code: "mismatched-caller", reason: "request contains an unsupported parent, session, or free-form claim" };
  }
  if (!identityShape(value.caller)) {
    return { code: "missing-caller", reason: "caller must contain role, componentPath, taskRevision, and one-based attempt" };
  }
  if (!isObject(value.child) || !("componentPath" in value.child)) {
    return { code: "wrong-component", reason: "child componentPath is required" };
  }
  const child = value.child;
  const childKeys = Object.keys(child);
  if (!childKeys.every((key) => ["componentPath", "taskRevision", "attempt"].includes(key))) {
    return { code: "wrong-component", reason: "child envelope contains unsupported free-form scope" };
  }
  if (!nonEmptyText(child.componentPath)) {
    return { code: "wrong-component", reason: "child componentPath must be non-empty" };
  }
  if (child.taskRevision !== undefined && !nonEmptyText(child.taskRevision)) {
    return { code: "wrong-component", reason: "child taskRevision must be a non-empty expected value" };
  }
  if (child.attempt !== undefined && !isOneBasedAttempt(child.attempt)) {
    return { code: "duplicate-attempt", reason: "child attempt must be a one-based expected value" };
  }
  return {
    request: {
      caller: { ...value.caller, attempt: value.caller.attempt } as CallerIdentity,
      child: {
        componentPath: child.componentPath,
        ...(child.taskRevision === undefined ? {} : { taskRevision: child.taskRevision }),
        ...(child.attempt === undefined ? {} : { attempt: child.attempt }),
      },
    },
  };
}

function recordStatus(raw: string): string {
  return raw.match(/^  status: ([^\r\n]+)$/m)?.[1]?.trim() ?? "unknown";
}

function configuredWorker(raw: string): string {
  return raw.match(/^  worker:[ \t]*([^\r\n]+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function explicitTaskRevision(raw: string): string | null {
  return raw.match(/^## Task Revision\s*\r?\n+\s*`?([A-Za-z0-9._:-]+)`?\s*$/im)?.[1] ?? null;
}

function immutableDefinition(raw: string): string {
  const progress = raw.search(/^## Progress\s*$/im);
  return (progress >= 0 ? raw.slice(0, progress) : raw)
    .replace(/^  status:.*$/gm, "")
    .replace(/^  updated:.*$/gm, "")
    .replace(/^    spent:.*$/gm, "")
    .replace(/^      spent-seconds:.*$/gm, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function taskRevision(raw: string, componentPath: string): string {
  return explicitTaskRevision(raw)
    ?? `record-${createHash("sha256").update(`${componentPath}\n${immutableDefinition(raw)}`).digest("hex").slice(0, 24)}`;
}

function recordRevision(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function numberField(raw: string, expression: RegExp): number | "unavailable" {
  const match = raw.match(expression);
  if (!match) return UNAVAILABLE;
  const value = Number(match[1]);
  return Number.isFinite(value) && value >= 0 ? value : UNAVAILABLE;
}

function constraintsFrom(raw: string): DurableConstraints {
  return {
    cost: {
      allocated: numberField(raw, /^    allocated:\s*([0-9]+(?:\.[0-9]+)?)$/m),
      spent: numberField(raw, /^    spent:\s*([0-9]+(?:\.[0-9]+)?)$/m),
      reserve: numberField(raw, /^    reserve:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    },
    execution: {
      allocatedSeconds: numberField(raw, /^      allocated-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
      spentSeconds: numberField(raw, /^      spent-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
      reserveSeconds: numberField(raw, /^      reserve-seconds:\s*([0-9]+(?:\.[0-9]+)?)$/m),
    },
    delegation: {
      maximumDepth: numberField(raw, /^    maximum-depth:\s*([0-9]+)$/m),
      maximumChildren: numberField(raw, /^    maximum-children:\s*([0-9]+)$/m),
    },
  };
}

function section(raw: string, title: string): string | null {
  const expression = new RegExp(`^## ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*$`, "im");
  const match = raw.match(expression);
  if (!match || match.index === undefined) return null;
  const rest = raw.slice(match.index + match[0].length);
  const next = rest.search(/^##\s+/m);
  return (next >= 0 ? rest.slice(0, next) : rest).trim() || null;
}

function jsonSection(raw: string, title: string): Record<string, unknown> | null {
  const value = section(raw, title);
  if (!value) return null;
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? value;
  try {
    const parsed: unknown = JSON.parse(fenced.trim());
    return isObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function objectField(value: unknown): Record<string, unknown> | null {
  return isObject(value) ? value : null;
}

function executionFrom(raw: string): ExecutionResolution | null {
  const value = jsonSection(raw, "Execution Resolution");
  if (!value || !nonEmptyText(value.adapter)) return null;
  const permissionProfile = objectField(value.permissionProfile);
  const jobSpecification = objectField(value.jobSpecification);
  if (!permissionProfile || !jobSpecification) return null;
  const authority = objectField(value.authority);
  return {
    adapter: value.adapter as HostAdapterId,
    permissionProfile,
    jobSpecification,
    authority: authority
      ? {
        ...(nonEmptyText(authority.parentComponentPath) ? { parentComponentPath: authority.parentComponentPath } : {}),
        ...(typeof authority.canReceive === "boolean" ? { canReceive: authority.canReceive } : {}),
        ...(nonEmptyText(authority.descendantScope) ? { descendantScope: authority.descendantScope } : {}),
      }
      : undefined,
  };
}

function authorityFrom(componentPath: string, execution: ExecutionResolution | null): DurableAuthority {
  return {
    parentComponentPath: execution?.authority?.parentComponentPath ?? parentComponentPath(componentPath),
    canReceive: execution?.authority?.canReceive ?? true,
    descendantScope: execution?.authority?.descendantScope ?? componentPath,
  };
}

function parseCheckpointLines(raw: string): DurableCheckpoint[] {
  const begin = raw.indexOf(DELEGATION_CHECKPOINT_BEGIN);
  const end = raw.indexOf(DELEGATION_CHECKPOINT_END);
  if (begin < 0 || end <= begin) return [];
  const content = raw.slice(begin + DELEGATION_CHECKPOINT_BEGIN.length, end);
  const checkpoints: DurableCheckpoint[] = [];
  for (const line of content.split("\n")) {
    try {
      const value = JSON.parse(line.trim()) as Partial<DurableCheckpoint>;
      if (value.operation === DELEGATE_COMPONENT && nonEmptyText(value.event)
        && nonEmptyText(value.jobId) && nonEmptyText(value.source) && nonEmptyText(value.observedAt)
        && isObject(value.details)) {
        checkpoints.push(value as DurableCheckpoint);
      }
    } catch {
      // A malformed private-looking line does not replace the durable record.
    }
  }
  return checkpoints;
}

function defaultStateHome(stateHome?: string): string {
  return resolve(stateHome ?? process.env.XDG_STATE_HOME ?? join(homedir(), ".local", "state"));
}

function projectKey(projectRoot: string): string {
  return `project-${createHash("sha256").update(resolve(projectRoot)).digest("hex").slice(0, 16)}`;
}

export function runtimeJobMapPath(projectRoot: string, stateHome?: string): string {
  return join(defaultStateHome(stateHome), "as-is", "projects", projectKey(projectRoot), "runtime", "job-map.json");
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

async function readJobMap(path: string): Promise<JobMapRead> {
  try {
    const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
    if (!isObject(parsed) || parsed.version !== JOB_MAP_VERSION || !isObject(parsed.entries)) {
      return { document: null, availability: "malformed" };
    }
    const entries: Record<string, JobMapEntry> = {};
    for (const [jobId, raw] of Object.entries(parsed.entries)) {
      if (!isObject(raw) || raw.jobId !== jobId || !nonEmptyText(raw.componentPath)
        || !nonEmptyText(raw.taskRevision) || !isOneBasedAttempt(raw.attempt)
        || !nonEmptyText(raw.recordRevision) || !nonEmptyText(raw.adapter)
        || !nonEmptyText(raw.runtimeState)) {
        return { document: null, availability: "malformed" };
      }
      entries[jobId] = raw as unknown as JobMapEntry;
    }
    return { document: { version: JOB_MAP_VERSION, entries }, availability: "available" };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { document: null, availability: "missing" };
    return { document: null, availability: "malformed" };
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
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 2));
    }
  }
  throw new Error("job-map lock timed out");
}

async function updateJobMap(path: string, update: (document: JobMapDocument) => void): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await withMapLock(path, async () => {
    const current = await readJobMap(path);
    if (current.availability === "malformed") throw new Error("job-map is malformed");
    const document = current.document ?? { version: JOB_MAP_VERSION, entries: {} };
    update(document);
    await atomicWrite(path, `${JSON.stringify(document, null, 2)}\n`);
  });
}

async function withRecordLock<T>(recordPath: string, action: () => Promise<T>): Promise<T> {
  const lock = `${recordPath}.delegate-component-lock`;
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
  throw new Error("durable delegate-component record lock timed out");
}

async function appendCheckpoint(
  record: DurableComponentRecord,
  checkpoint: DurableCheckpoint,
  status?: string,
  expectedRevision?: string,
): Promise<void> {
  await withRecordLock(record.recordPath, async () => {
    const current = await readFile(record.recordPath, "utf8");
    if (expectedRevision && recordRevision(current) !== expectedRevision) {
      throw new Error("durable child record changed before launch checkpoint");
    }
    let next = current;
    if (status) {
      if (!/^  status: [^\r\n]+$/m.test(next)) throw new Error("durable child status is not parseable");
      next = next.replace(/^  status: [^\r\n]+$/m, `  status: ${status}`);
    }
    if (!/^  updated: [^\r\n]+$/m.test(next)) throw new Error("durable child updated timestamp is not parseable");
    next = next.replace(/^  updated: [^\r\n]+$/m, `  updated: ${checkpoint.observedAt}`);
    const line = JSON.stringify(checkpoint);
    const begin = next.indexOf(DELEGATION_CHECKPOINT_BEGIN);
    const end = next.indexOf(DELEGATION_CHECKPOINT_END);
    next = begin >= 0 && end > begin
      ? `${next.slice(0, end)}${line}\n${next.slice(end)}`
      : `${next.trimEnd()}\n\n## Delegate Component Checkpoints\n\n${DELEGATION_CHECKPOINT_BEGIN}\n${line}\n${DELEGATION_CHECKPOINT_END}\n`;
    await atomicWrite(record.recordPath, next);
  });
}

function checkpoint(
  event: string,
  jobId: string,
  now: Date,
  details: Record<string, unknown>,
): DurableCheckpoint {
  return {
    operation: DELEGATE_COMPONENT,
    event,
    jobId,
    source: TOOL_SOURCE,
    observedAt: now.toISOString(),
    details,
  };
}

function stableDetails(identity: StableIdentity): Record<string, unknown> {
  return {
    componentPath: identity.componentPath,
    taskRevision: identity.taskRevision,
    attempt: identity.attempt,
  };
}

function mapEntriesForIdentity(document: JobMapDocument | null, identity: StableIdentity): JobMapEntry[] {
  if (!document) return [];
  return Object.values(document.entries).filter((entry) =>
    entry.componentPath === identity.componentPath
    && entry.taskRevision === identity.taskRevision
    && entry.attempt === identity.attempt);
}

function checkpointAttempt(value: DurableCheckpoint): number | null {
  return isOneBasedAttempt(value.details.attempt) ? value.details.attempt : null;
}

function checkpointTaskRevision(value: DurableCheckpoint): string | null {
  return nonEmptyText(value.details.taskRevision) ? value.details.taskRevision : null;
}

function resultBase(
  outcome: DelegationOutcome,
  status: DelegationStatus,
  componentPath: string | "unavailable" = UNAVAILABLE,
  taskRevision: string | "unavailable" = UNAVAILABLE,
  attempt: number | "unavailable" = UNAVAILABLE,
  parent: CallerIdentity | "unavailable" = UNAVAILABLE,
  workerRole: string | "unavailable" = UNAVAILABLE,
  adapter: HostAdapterId | "unavailable" = UNAVAILABLE,
): DelegationResult {
  const stableIdentity = componentPath !== UNAVAILABLE && taskRevision !== UNAVAILABLE && attempt !== UNAVAILABLE
    ? { componentPath, taskRevision, attempt }
    : UNAVAILABLE;
  return {
    outcome,
    status,
    componentPath,
    taskRevision,
    attempt,
    stableIdentity,
    parent,
    workerRole,
    launch: { checkpoint: "not-created", adapter, acceptedAt: UNAVAILABLE },
    handle: { diagnosticOnly: true, lookupKey: false },
  };
}

function failureResult(
  code: DelegationFailureCode,
  reason: string,
  options: {
    outcome?: DelegationOutcome;
    status?: DelegationStatus;
    componentPath?: string;
    taskRevision?: string;
    attempt?: number;
    parent?: CallerIdentity;
    workerRole?: string;
    adapter?: HostAdapterId;
    permissionState?: "awaiting-user-approval" | "denied";
    nextAction?: string;
  } = {},
): DelegationResult {
  const result = resultBase(
    options.outcome ?? (code === "unavailable-supervisor" ? "unavailable" : "rejected"),
    options.status ?? (code === "unavailable-supervisor" ? "unavailable" : "blocked"),
    options.componentPath ?? UNAVAILABLE,
    options.taskRevision ?? UNAVAILABLE,
    options.attempt ?? UNAVAILABLE,
    options.parent ?? UNAVAILABLE,
    options.workerRole ?? UNAVAILABLE,
    options.adapter ?? UNAVAILABLE,
  );
  result.blocker = { code, reason, fallback: "not-permitted", ...(options.permissionState ? { permissionState: options.permissionState } : {}) };
  if (options.nextAction) result.nextAction = options.nextAction;
  return result;
}

function getAdapter(
  adapters: DelegateComponentSupervisorOptions["adapters"],
  id: string,
): DelegateAdapter | undefined {
  if (adapters instanceof Map) return adapters.get(id);
  return adapters.find((adapter) => adapter.id === id);
}

export class FileSystemDurableState implements DurableStateSource {
  readonly projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = resolve(projectRoot);
  }

  async readRecord(componentPath: string): Promise<DurableComponentRecord | null> {
    const canonical = canonicalComponentPath(this.projectRoot, componentPath);
    const recordPath = join(this.projectRoot, canonical, "as-is.md");
    let raw: string;
    try {
      raw = await readFile(recordPath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
    const execution = executionFrom(raw);
    return {
      componentPath: canonical,
      recordPath,
      raw,
      status: recordStatus(raw),
      workerRole: configuredWorker(raw),
      taskRevision: taskRevision(raw, canonical),
      recordRevision: recordRevision(raw),
      parentComponentPath: parentComponentPath(canonical),
      constraints: constraintsFrom(raw),
      authority: authorityFrom(canonical, execution),
      execution,
      checkpoints: parseCheckpointLines(raw),
    };
  }
}

export class DelegateComponentSupervisor {
  readonly projectRoot: string;
  readonly stateHome: string;
  readonly source: DurableStateSource;
  private readonly adapters: DelegateComponentSupervisorOptions["adapters"];
  private readonly now: () => Date;
  private readonly jobIdFactory: () => string;

  constructor(options: DelegateComponentSupervisorOptions) {
    this.projectRoot = resolve(options.projectRoot);
    this.stateHome = defaultStateHome(options.stateHome);
    this.source = options.source ?? new FileSystemDurableState(this.projectRoot);
    this.adapters = options.adapters;
    this.now = options.now ?? (() => new Date());
    this.jobIdFactory = options.jobId ?? (() => `job-${randomUUID()}`);
  }

  async invoke(value: unknown, binding?: SupervisorActiveBinding): Promise<DelegationResult> {
    const parsed = parseRequest(value);
    if ("code" in parsed) return failureResult(parsed.code, parsed.reason);
    const request = parsed.request;
    if (!binding) return failureResult("missing-caller", "no active supervisor-issued caller binding is available");
    if (!binding.active || binding.supervisorAvailable === false || !nonEmptyText(binding.toolContextId)) {
      return failureResult("unavailable-supervisor", "the supervisor/tool context is unavailable");
    }
    if (!nonEmptyText(binding.repositoryRoot) || resolve(binding.repositoryRoot) !== this.projectRoot) {
      return failureResult("unavailable-supervisor", "the active binding belongs to another repository context");
    }
    if (!callerEqual(request.caller, binding.caller)) {
      return failureResult("mismatched-caller", "caller identity does not match the active supervisor binding");
    }
    if (!nonEmptyText(binding.expectedRole) || request.caller.role !== binding.expectedRole) {
      return failureResult("wrong-role", "caller role is not the role explicitly bound for this invocation");
    }
    if (!binding.job || !binding.job.active || !nonEmptyText(binding.job.jobId)
      || !callerEqual(binding.job.identity, binding.caller)) {
      return failureResult("missing-parent", "active supervisor job context cannot establish the verified parent");
    }

    let callerRecord: DurableComponentRecord | null;
    try {
      callerRecord = await this.source.readRecord(binding.caller.componentPath);
    } catch (error) {
      return failureResult("unavailable-supervisor", `caller record could not be reread: ${errorMessage(error)}`);
    }
    if (!callerRecord || callerRecord.componentPath !== request.caller.componentPath
      || callerRecord.taskRevision !== request.caller.taskRevision
      || callerRecord.status !== "active") {
      return failureResult("mismatched-caller", "fresh durable caller record does not match the active binding");
    }
    if (binding.entrypointRole !== request.caller.role && callerRecord.workerRole !== request.caller.role) {
      return failureResult("wrong-role", "caller role is not the configured durable worker role");
    }
    if (!binding.canDelegate) {
      return failureResult("permission-denied", "active supervisor context does not authorize delegation", {
        parent: binding.job.identity,
        nextAction: "retain the durable denial and obtain an explicit authorized context",
      });
    }
    const maximumChildren = callerRecord.constraints.delegation.maximumChildren;
    if (typeof maximumChildren === "number" && maximumChildren <= 0) {
      return failureResult("permission-denied", "fresh durable caller record does not permit child delegation", {
        parent: binding.job.identity,
        nextAction: "retain the durable authority boundary and do not create a child",
      });
    }

    let childPath: string;
    try {
      childPath = canonicalComponentPath(this.projectRoot, request.child.componentPath);
    } catch (error) {
      return failureResult("wrong-component", errorMessage(error), { parent: binding.job.identity });
    }
    if (!isDescendant(binding.job.identity.componentPath, childPath)) {
      return failureResult("wrong-component", "child component is outside the verified parent descendant scope", {
        componentPath: childPath,
        parent: binding.job.identity,
      });
    }

    let child: DurableComponentRecord | null;
    try {
      child = await this.source.readRecord(childPath);
    } catch (error) {
      return failureResult("unavailable-supervisor", `child record could not be resolved: ${errorMessage(error)}`, {
        componentPath: childPath,
        parent: binding.job.identity,
      });
    }
    if (!child || child.authority.parentComponentPath !== binding.job.identity.componentPath
      || child.authority.descendantScope !== childPath || !child.authority.canReceive) {
      return failureResult("wrong-component", "child record or durable parent authority is missing or mismatched", {
        componentPath: childPath,
        parent: binding.job.identity,
      });
    }
    if (request.child.taskRevision !== undefined && request.child.taskRevision !== child.taskRevision) {
      return failureResult("wrong-component", "child task revision is stale or mismatched", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
      });
    }
    if (!child.workerRole) {
      await this.recordChildRejection(child, "wrong-role", "child record has no configured worker role");
      return failureResult("wrong-role", "child record has no configured worker role", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
      });
    }
    if (!child.execution) {
      await this.recordChildRejection(child, "unavailable-supervisor", "child adapter, permission profile, or job specification is unavailable");
      return failureResult("unavailable-supervisor", "child adapter, permission profile, or job specification is unavailable", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
      });
    }
    if (child.status !== "ready" && child.status !== "active") {
      return failureResult("wrong-component", `child durable status ${child.status} is not launchable`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
      });
    }
    const adapter = getAdapter(this.adapters, child.execution.adapter);
    if (!adapter || adapter.id !== child.execution.adapter) {
      await this.recordChildRejection(child, "unavailable-supervisor", "configured adapter is unavailable");
      return failureResult("unavailable-supervisor", "configured adapter is unavailable", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: child.execution.adapter,
      });
    }

    const mapPath = runtimeJobMapPath(this.projectRoot, this.stateHome);
    let map: JobMapRead;
    try {
      map = await readJobMap(mapPath);
    } catch (error) {
      return failureResult("unavailable-supervisor", `diagnostic JobId map is unavailable: ${errorMessage(error)}`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    if (map.availability === "malformed") {
      return failureResult("unavailable-supervisor", "diagnostic JobId map is malformed", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    const attemptResult = resolveAttempt(child, map.document, request.child.attempt);
    if (typeof attemptResult === "string") {
      return failureResult("duplicate-attempt", attemptResult, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        ...(request.child.attempt === undefined ? {} : { attempt: request.child.attempt }),
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    const identity: StableIdentity = {
      componentPath: childPath,
      taskRevision: child.taskRevision,
      attempt: attemptResult,
    };
    const resolved: ResolvedAdapterLaunch = {
      operation: DELEGATE_COMPONENT,
      identity,
      parent: binding.job.identity,
      recordRevision: child.recordRevision,
      workerRole: child.workerRole,
      constraints: child.constraints,
      authority: child.authority,
      permissionProfile: child.execution.permissionProfile,
      jobSpecification: child.execution.jobSpecification,
    };

    let preflight: AdapterPreflight;
    try {
      preflight = await adapter.preflight(resolved);
    } catch (error) {
      await this.recordChildRejection(child, "unavailable-supervisor", `adapter preflight failed: ${errorMessage(error)}`);
      return failureResult("unavailable-supervisor", `adapter preflight failed: ${errorMessage(error)}`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    if (preflight.state === "denied") {
      await this.recordPermission(child, "permission-denied", preflight.reason ?? "adapter permission preflight denied", "blocked");
      return failureResult("permission-denied", preflight.reason ?? "adapter permission preflight denied", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
        permissionState: "denied",
        nextAction: "retain the durable denial; do not retry through a weaker profile",
      });
    }
    if (preflight.state === "awaiting-approval") {
      await this.recordPermission(child, "awaiting-approval", preflight.reason ?? "adapter requires explicit approval", "awaiting-approval");
      return failureResult("permission-denied", preflight.reason ?? "adapter requires explicit approval", {
        outcome: "waiting",
        status: "awaiting-approval",
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
        permissionState: "awaiting-user-approval",
        nextAction: "await a durable approval decision before submitting the configured worker",
      });
    }
    if (preflight.state !== "allowed") {
      await this.recordChildRejection(child, "unavailable-supervisor", preflight.reason ?? "adapter capability preflight is unavailable");
      return failureResult("unavailable-supervisor", preflight.reason ?? "adapter capability preflight is unavailable", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }

    const jobId = this.jobIdFactory();
    if (!nonEmptyText(jobId)) {
      return failureResult("unavailable-supervisor", "supervisor could not assign a runtime JobId", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    const now = this.now();
    try {
      await updateJobMap(mapPath, (document) => {
        document.entries[jobId] = {
          jobId,
          componentPath: identity.componentPath,
          taskRevision: identity.taskRevision,
          attempt: identity.attempt,
          recordRevision: child!.recordRevision,
          adapter: adapter.id,
          runtimeState: "launching",
          acceptedAt: null,
          updatedAt: now.toISOString(),
        };
      });
    } catch (error) {
      return failureResult("unavailable-supervisor", `diagnostic JobId map could not be persisted: ${errorMessage(error)}`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }

    let accepted: AdapterLaunchAcceptance;
    try {
      accepted = await adapter.launch(resolved);
    } catch (error) {
      await this.markLaunchFailed(mapPath, jobId, identity, adapter, errorMessage(error));
      return failureResult("unavailable-supervisor", `adapter launch failed: ${errorMessage(error)}`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }
    if (!accepted.accepted) {
      await this.markLaunchFailed(mapPath, jobId, identity, adapter, accepted.reason ?? "adapter rejected launch");
      return failureResult("unavailable-supervisor", accepted.reason ?? "adapter rejected launch", {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }

    const acceptedAt = accepted.acceptedAt ?? this.now().toISOString();
    try {
      await appendCheckpoint(child, checkpoint("launch-accepted", jobId, this.now(), {
        ...stableDetails(identity),
        recordRevision: child.recordRevision,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
        runtime: { jobId, source: "delegate-component.job-map", diagnosticOnly: true, lookupKey: false },
        checkpoint: "durable-launch-accepted",
      }), "active", child.recordRevision);
      await updateJobMap(mapPath, (document) => {
        const entry = document.entries[jobId];
        if (!entry) throw new Error("launch JobId map entry disappeared before acceptance");
        entry.runtimeState = "launch-accepted";
        entry.acceptedAt = acceptedAt;
        entry.updatedAt = this.now().toISOString();
        if (accepted.runtimeHandle) entry.runtimeHandle = accepted.runtimeHandle;
      });
    } catch (error) {
      await adapter.cancel({ identity, jobId, runtimeHandle: accepted.runtimeHandle }).catch(() => undefined);
      await adapter.cleanup({ identity, jobId, runtimeHandle: accepted.runtimeHandle }).catch(() => undefined);
      await this.markLaunchFailed(mapPath, jobId, identity, adapter, `durable launch checkpoint failed: ${errorMessage(error)}`);
      return failureResult("unavailable-supervisor", `durable launch checkpoint failed: ${errorMessage(error)}`, {
        componentPath: childPath,
        taskRevision: child.taskRevision,
        attempt: attemptResult,
        parent: binding.job.identity,
        workerRole: child.workerRole,
        adapter: adapter.id,
      });
    }

    const result = resultBase("started", "launch-accepted", childPath, child.taskRevision, attemptResult, binding.job.identity, child.workerRole, adapter.id);
    result.launch = { checkpoint: "durable-launch-accepted", adapter: adapter.id, acceptedAt };
    result.handle = {
      jobId,
      source: "delegate-component.job-map",
      diagnosticOnly: true,
      lookupKey: false,
    };
    result.nextAction = "observe the child by componentPath/taskRevision/attempt; do not use JobId as task identity";
    return result;
  }

  async status(options: Omit<DelegationStatusOptions, "stateHome" | "projectRoot">): Promise<DelegationStatusObservation> {
    return readDelegationStatus({ ...options, projectRoot: this.projectRoot, stateHome: this.stateHome }, this.source);
  }

  async cancel(options: Omit<DelegationControlOptions, "stateHome" | "projectRoot">): Promise<DelegationResult> {
    return cancelDelegation({ ...options, projectRoot: this.projectRoot, stateHome: this.stateHome }, this.source, this.adapters, this.now);
  }

  async cleanup(options: Omit<DelegationControlOptions, "stateHome" | "projectRoot">): Promise<DelegationResult> {
    return cleanupDelegation({ ...options, projectRoot: this.projectRoot, stateHome: this.stateHome }, this.source, this.adapters, this.now);
  }

  private async recordChildRejection(record: DurableComponentRecord, code: DelegationFailureCode, reason: string): Promise<void> {
    if (["completed", "cancelled"].includes(record.status)) return;
    try {
      await appendCheckpoint(record, checkpoint("delegation-rejected", "unassigned", this.now(), {
        blocker: code,
        reason,
        fallback: "not-permitted",
        noWorkerSubmitted: true,
      }), "blocked");
    } catch {
      // The normalized failure remains the caller-visible result; a concurrent
      // or malformed record cannot be repaired by a host fallback.
    }
  }

  private async recordPermission(
    record: DurableComponentRecord,
    event: "permission-denied" | "awaiting-approval",
    reason: string,
    status: "blocked" | "awaiting-approval",
  ): Promise<void> {
    try {
      await appendCheckpoint(record, checkpoint(event, "unassigned", this.now(), {
        permissionState: status === "awaiting-approval" ? "awaiting-user-approval" : "denied",
        reason,
        operation: DELEGATE_COMPONENT,
        fallback: "not-permitted",
      }), status);
    } catch {
      // No prompt or weaker retry is allowed when durable evidence cannot be written.
    }
  }

  private async markLaunchFailed(
    mapPath: string,
    jobId: string,
    identity: StableIdentity,
    adapter: DelegateAdapter,
    reason: string,
  ): Promise<void> {
    try {
      await updateJobMap(mapPath, (document) => {
        const entry = document.entries[jobId];
        if (entry) {
          entry.runtimeState = "failed";
          entry.updatedAt = this.now().toISOString();
        } else {
          document.entries[jobId] = {
            jobId,
            componentPath: identity.componentPath,
            taskRevision: identity.taskRevision,
            attempt: identity.attempt,
            recordRevision: "unavailable",
            adapter: adapter.id,
            runtimeState: "failed",
            acceptedAt: null,
            updatedAt: this.now().toISOString(),
          };
        }
      });
    } catch {
      // A missing diagnostic map is unavailable runtime evidence, not success.
    }
    void reason;
  }
}

/** One-shot machine-callable form used by a host tool bridge. */
export async function delegateComponent(
  request: unknown,
  binding: SupervisorActiveBinding | undefined,
  options: DelegateComponentSupervisorOptions,
): Promise<DelegationResult> {
  return new DelegateComponentSupervisor(options).invoke(request, binding);
}

function resolveAttempt(
  record: DurableComponentRecord,
  map: JobMapDocument | null,
  requested: number | undefined,
): number | string {
  const conflictingActiveRuntime = Object.values(map?.entries ?? {}).find((entry) =>
    entry.componentPath === record.componentPath
    && ["launching", "launch-accepted", "cancel-requested"].includes(entry.runtimeState)
    && entry.taskRevision !== record.taskRevision);
  if (conflictingActiveRuntime) {
    return `component has an active attempt for conflicting task revision ${conflictingActiveRuntime.taskRevision}`;
  }
  const activeRuntime = Object.values(map?.entries ?? {}).some((entry) =>
    entry.componentPath === record.componentPath
    && entry.taskRevision === record.taskRevision
    && ["launching", "launch-accepted", "cancel-requested", "cancelled"].includes(entry.runtimeState)
    && entry.runtimeState !== "cancelled");
  const activeDurable = record.checkpoints.reduce((active, event) => {
    if (checkpointTaskRevision(event) !== record.taskRevision) return active;
    if (["launch-accepted", "launch-requested"].includes(event.event)) return true;
    if (["cancellation-confirmed", "cleanup-complete", "launch-failed"].includes(event.event)) return false;
    return active;
  }, false);
  if (activeRuntime || activeDurable) {
    return "component already has an active attempt; do not start a parallel or substituted worker";
  }
  const attempts = new Set<number>();
  for (const event of record.checkpoints) {
    if (checkpointTaskRevision(event) === record.taskRevision && checkpointAttempt(event) !== null) {
      attempts.add(checkpointAttempt(event)!);
    }
  }
  for (const entry of map ? Object.values(map.entries) : []) {
    if (entry.componentPath === record.componentPath && entry.taskRevision === record.taskRevision) attempts.add(entry.attempt);
  }
  const next = attempts.size > 0 ? Math.max(...attempts) + 1 : 1;
  if (requested === undefined) return next;
  if (requested !== next) {
    return `attempt ${requested} is already active or is not the next valid one-based attempt (expected ${next})`;
  }
  return requested;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function latestCheckpoint(record: DurableComponentRecord, attempt: number | undefined): DurableCheckpoint | undefined {
  return [...record.checkpoints].reverse().find((event) => attempt === undefined || checkpointAttempt(event) === attempt);
}

export async function readDelegationStatus(
  options: DelegationStatusOptions,
  source?: DurableStateSource,
): Promise<DelegationStatusObservation> {
  const root = resolve(options.projectRoot);
  let componentPath: string;
  try {
    componentPath = canonicalComponentPath(root, options.componentPath);
  } catch {
    return {
      componentPath: options.componentPath,
      taskRevision: UNAVAILABLE,
      attempt: UNAVAILABLE,
      stableIdentity: UNAVAILABLE,
      status: "unavailable",
      durable: { recordStatus: UNAVAILABLE, recordRevision: UNAVAILABLE, lastCheckpoint: UNAVAILABLE },
      runtime: { state: UNAVAILABLE, adapter: UNAVAILABLE, jobId: UNAVAILABLE, map: "unavailable" },
      nextAction: "provide a canonical repository-relative component path",
    };
  }
  const durableSource = source ?? new FileSystemDurableState(root);
  const record = await durableSource.readRecord(componentPath).catch(() => null);
  const taskRev = options.taskRevision ?? record?.taskRevision;
  const mapRead = await readJobMap(runtimeJobMapPath(root, options.stateHome));
  const candidates = record && taskRev
    ? record.checkpoints.map((event) => ({ event, attempt: checkpointAttempt(event) }))
      .filter((entry) => checkpointTaskRevision(entry.event) === taskRev && entry.attempt !== null)
      .map((entry) => entry.attempt!)
    : [];
  if (mapRead.document && taskRev) {
    for (const entry of Object.values(mapRead.document.entries)) {
      if (entry.componentPath === componentPath && entry.taskRevision === taskRev) candidates.push(entry.attempt);
    }
  }
  const uniqueAttempts = [...new Set(candidates)].sort((left, right) => left - right);
  const attempt = options.attempt ?? (uniqueAttempts.length === 1 ? uniqueAttempts[0] : undefined);
  const identity = record && taskRev && attempt !== undefined
    ? { componentPath, taskRevision: taskRev, attempt }
    : UNAVAILABLE;
  const event = record ? latestCheckpoint(record, attempt) : undefined;
  const entry = identity !== UNAVAILABLE && mapRead.document
    ? Object.values(mapRead.document.entries).find((value) => identityEqual(value, identity))
    : undefined;
  const runtimeMap = mapRead.availability;
  const jobId: DiagnosticHandle | "unavailable" = entry
    ? { jobId: entry.jobId, source: "delegate-component.job-map", diagnosticOnly: true, lookupKey: false }
    : UNAVAILABLE;
  return {
    componentPath,
    taskRevision: taskRev ?? UNAVAILABLE,
    attempt: attempt ?? UNAVAILABLE,
    stableIdentity: identity,
    status: event?.event ?? record?.status ?? "unavailable",
    durable: {
      recordStatus: record?.status ?? UNAVAILABLE,
      recordRevision: record?.recordRevision ?? UNAVAILABLE,
      lastCheckpoint: event?.event ?? UNAVAILABLE,
    },
    runtime: {
      state: entry?.runtimeState ?? UNAVAILABLE,
      adapter: entry?.adapter ?? UNAVAILABLE,
      jobId,
      map: runtimeMap,
    },
    nextAction: entry?.runtimeState === "launch-accepted"
      ? "continue path-based observation; JobId is diagnostic-only"
      : "reread the durable record and retain unavailable runtime observations as non-success",
  };
}

/** Stable-identity lookup name for host status/control-plane integrations. */
export async function lookupDelegationStatus(options: DelegationStatusOptions): Promise<DelegationStatusObservation> {
  return readDelegationStatus(options);
}

async function controlIdentity(
  options: DelegationControlOptions,
  source: DurableStateSource,
): Promise<{ identity: StableIdentity; record: DurableComponentRecord; entry: JobMapEntry } | DelegationResult> {
  const root = resolve(options.projectRoot);
  let componentPath: string;
  try {
    componentPath = canonicalComponentPath(root, options.componentPath);
  } catch (error) {
    return failureResult("wrong-component", errorMessage(error));
  }
  const record = await source.readRecord(componentPath).catch(() => null);
  if (!record) return failureResult("wrong-component", "durable component record is missing", { componentPath });
  const taskRevision = options.taskRevision ?? record.taskRevision;
  const attempt = options.attempt;
  if (!taskRevision || !isOneBasedAttempt(attempt) || taskRevision !== record.taskRevision) {
    return failureResult("wrong-component", "stable component path/task revision/attempt identity is incomplete or stale", { componentPath, taskRevision });
  }
  const mapRead = await readJobMap(runtimeJobMapPath(root, options.stateHome));
  const entry = mapRead.document
    ? Object.values(mapRead.document.entries).find((candidate) =>
      candidate.componentPath === componentPath && candidate.taskRevision === taskRevision && candidate.attempt === attempt)
    : undefined;
  if (!entry) return failureResult("unavailable-supervisor", "runtime JobId map has no diagnostic entry for the stable identity", {
    componentPath,
    taskRevision,
    attempt,
  });
  return { identity: { componentPath, taskRevision, attempt }, record, entry };
}

export async function cancelDelegation(
  options: DelegationControlOptions,
  source: DurableStateSource,
  adapters: DelegateComponentSupervisorOptions["adapters"],
  now: () => Date = () => new Date(),
): Promise<DelegationResult> {
  const resolved = await controlIdentity(options, source);
  if ("outcome" in resolved) return resolved;
  const adapter = options.adapter ?? getAdapter(adapters, resolved.entry.adapter);
  if (!adapter) return failureResult("unavailable-supervisor", "configured adapter is unavailable for cancellation", {
    ...resolved.identity,
  });
  const cancellationJobId = resolved.entry.jobId;
  const cancellationCheckpoint = {
    operation: DELEGATE_COMPONENT,
    event: "cancellation-requested",
    jobId: cancellationJobId,
    source: TOOL_SOURCE,
    observedAt: now().toISOString(),
    details: { ...stableDetails(resolved.identity), runtime: { jobId: cancellationJobId, diagnosticOnly: true, lookupKey: false } },
  } satisfies DurableCheckpoint;
  try {
    await appendCheckpoint(resolved.record, cancellationCheckpoint, "active");
    const control = await adapter.cancel({ identity: resolved.identity, jobId: cancellationJobId, runtimeHandle: resolved.entry.runtimeHandle });
    if (!control.accepted) {
      return failureResult("unavailable-supervisor", control.reason ?? "adapter could not confirm cancellation", {
        ...resolved.identity,
        workerRole: resolved.record.workerRole,
        adapter: adapter.id,
      });
    }
    await appendCheckpoint(resolved.record, {
      ...cancellationCheckpoint,
      event: "cancellation-confirmed",
      observedAt: now().toISOString(),
    }, "cancelled");
    await updateJobMap(runtimeJobMapPath(options.projectRoot, options.stateHome), (document) => {
      const entry = document.entries[cancellationJobId];
      if (entry) {
        entry.runtimeState = "cancelled";
        entry.updatedAt = now().toISOString();
      }
    });
    await adapter.cleanup({ identity: resolved.identity, jobId: cancellationJobId, runtimeHandle: resolved.entry.runtimeHandle });
    await updateJobMap(runtimeJobMapPath(options.projectRoot, options.stateHome), (document) => {
      const entry = document.entries[cancellationJobId];
      if (entry) {
        entry.runtimeState = "cleanup-complete";
        entry.updatedAt = now().toISOString();
      }
    });
    const result = resultBase("cancelled", "cleanup-complete", resolved.identity.componentPath, resolved.identity.taskRevision, resolved.identity.attempt, UNAVAILABLE, resolved.record.workerRole, adapter.id);
    result.handle = { jobId: cancellationJobId, source: "delegate-component.job-map", diagnosticOnly: true, lookupKey: false };
    result.launch = { checkpoint: "cancellation-confirmed", adapter: adapter.id, acceptedAt: "unavailable" };
    result.nextAction = "retain the durable cancellation and cleanup evidence; do not reuse this attempt";
    return result;
  } catch (error) {
    return failureResult("unavailable-supervisor", `cancellation or cleanup could not be durably confirmed: ${errorMessage(error)}`, {
      ...resolved.identity,
      workerRole: resolved.record.workerRole,
      adapter: adapter.id,
    });
  }
}

export async function cleanupDelegation(
  options: DelegationControlOptions,
  source: DurableStateSource,
  adapters: DelegateComponentSupervisorOptions["adapters"],
  now: () => Date = () => new Date(),
): Promise<DelegationResult> {
  const resolved = await controlIdentity(options, source);
  if ("outcome" in resolved) return resolved;
  const adapter = options.adapter ?? getAdapter(adapters, resolved.entry.adapter);
  if (!adapter) return failureResult("unavailable-supervisor", "configured adapter is unavailable for cleanup", {
    ...resolved.identity,
  });
  try {
    const cleaned = await adapter.cleanup({ identity: resolved.identity, jobId: resolved.entry.jobId, runtimeHandle: resolved.entry.runtimeHandle });
    if (!cleaned.accepted) return failureResult("unavailable-supervisor", cleaned.reason ?? "adapter cleanup was not confirmed", {
      ...resolved.identity,
    });
    await appendCheckpoint(resolved.record, {
      operation: DELEGATE_COMPONENT,
      event: "cleanup-complete",
      jobId: resolved.entry.jobId,
      source: TOOL_SOURCE,
      observedAt: now().toISOString(),
      details: { ...stableDetails(resolved.identity), runtime: { jobId: resolved.entry.jobId, diagnosticOnly: true, lookupKey: false } },
    }, resolved.record.status === "cancelled" ? "cancelled" : undefined);
    await updateJobMap(runtimeJobMapPath(options.projectRoot, options.stateHome), (document) => {
      const entry = document.entries[resolved.entry.jobId];
      if (entry) {
        entry.runtimeState = "cleanup-complete";
        entry.updatedAt = now().toISOString();
      }
    });
    const result = resultBase("started", "cleanup-complete", resolved.identity.componentPath, resolved.identity.taskRevision, resolved.identity.attempt, UNAVAILABLE, resolved.record.workerRole, adapter.id);
    result.handle = { jobId: resolved.entry.jobId, source: "delegate-component.job-map", diagnosticOnly: true, lookupKey: false };
    result.launch = { checkpoint: "cleanup-complete", adapter: adapter.id, acceptedAt: "unavailable" };
    result.nextAction = "retain path-based durable status; the private adapter runtime is clean";
    return result;
  } catch (error) {
    return failureResult("unavailable-supervisor", `cleanup could not be durably confirmed: ${errorMessage(error)}`, {
      ...resolved.identity,
      workerRole: resolved.record.workerRole,
      adapter: adapter.id,
    });
  }
}
