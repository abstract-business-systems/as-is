import { createHash, randomUUID } from "node:crypto";
import { chmod, mkdir, mkdtemp, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AdapterLaunchError,
  cleanupComponent,
  launchComponent,
  type AdapterLaunchRequest,
  type AdapterLaunchResult,
  type ParentContext,
  type ProactivePermissionProfile,
} from "../opencode-launch-adapter/adapter.ts";
import type { RoleChain } from "../subprocess-execution-foundation/supervisor.ts";

/**
 * OpenCode's documented auto mode is intentionally version gated.  The
 * adapter does not infer a compatibility alias from source or from a failed
 * help probe.
 */
export const VERIFIED_OPENCODE_VERSION = "1.17.18" as const;
export const DOCUMENTED_AUTO_FLAG = "--auto" as const;
export const ADAPTER_ID = "opencode-adapter";

export interface CommandObservation {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut?: boolean;
}

export interface OpenCodeCapability {
  status: "supported" | "unsupported" | "failed";
  executable: string;
  version: string | null;
  versionExitCode: number | null;
  helpExitCode: number | null;
  helpAdvertisesAuto: boolean;
  helpDocumentsExplicitDeny: boolean;
  strategy: "auto" | "reject";
  reason: string;
}

export interface OpenCodePermissionProfile {
  strategy: "auto";
  cliFlag: typeof DOCUMENTED_AUTO_FLAG;
  opencodeVersion: typeof VERIFIED_OPENCODE_VERSION;
  autoApproval: "non-denied-only";
  explicitDenyPolicy: "preserved-by-opencode";
  explicitDenyRules: readonly string[];
  unexpectedRequestPolicy: "fail-closed";
}

export interface OpenCodeCommandInput {
  executable: string;
  projectDirectory: string;
  prompt: string;
}

export interface OpenCodeCommandConstruction {
  command: string[];
  observableCommand: string[];
}

export interface PermissionRequest {
  operation: string;
  capabilityClass: string;
  resourceClass: string;
  reason: string;
  state: string;
  sourceEvent: string;
}

export type PermissionDecision =
  | { outcome: "approved-observation"; reason: string }
  | { outcome: "fail-closed"; reason: string; request: PermissionRequest };

export interface OpenCodeLaunchInput {
  projectRoot: string;
  componentPath: string;
  parentContext: ParentContext;
  roleChain: RoleChain;
  prompt: string;
  explicitDenyRules?: readonly string[];
  executable?: string;
  runnerPath?: string;
  checkInSeconds?: number;
  startDelayMilliseconds?: number;
  available?: boolean;
  attempt?: number;
  recovery?: AdapterLaunchRequest["recovery"];
  /** Injected only by deterministic tests; production always probes the CLI. */
  capabilityProbe?: {
    version: CommandObservation;
    help: CommandObservation;
  };
}

export interface OpenCodeLaunchResult extends AdapterLaunchResult {
  capability: OpenCodeCapability;
  commandObservation: string[];
}

const CHECKPOINT_BEGIN = "<!-- subprocess-execution-foundation:begin -->";
const CHECKPOINT_END = "<!-- subprocess-execution-foundation:end -->";
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;

function isoNow(): string {
  return new Date().toISOString();
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function checkpoint(jobId: string, event: string, details: Record<string, unknown>) {
  return {
    operation: "launch",
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
      // Atomic rename remains the available host-local durability evidence.
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
  throw new Error("durable record blocker: OpenCode adapter checkpoint lock timed out");
}

async function appendCheckpoint(
  recordPath: string,
  value: ReturnType<typeof checkpoint>,
  status?: string,
): Promise<void> {
  await withRecordLock(recordPath, async () => {
    const raw = await readFile(recordPath, "utf8");
    let next = raw;
    if (status) {
      if (!RECORD_STATUS.test(next)) throw new Error("durable record blocker: task.status is not parseable");
      next = next.replace(RECORD_STATUS, `  status: ${status}`);
    }
    if (!RECORD_UPDATED.test(next)) throw new Error("durable record blocker: task.updated is not parseable");
    next = next.replace(RECORD_UPDATED, `  updated: ${value.observedAt}`);
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

function parseVersion(output: string): string | null {
  const match = output.match(/(?:^|\s)(\d+\.\d+\.\d+)(?:\s|$)/m);
  return match?.[1] ?? null;
}

function hasDocumentedAuto(help: string): boolean {
  return /(^|\s)--auto\b/m.test(help);
}

function documentsExplicitDeny(help: string): boolean {
  return /explicitly denied|explicit deny/i.test(help);
}

/**
 * Convert fresh version/help observations into a conservative capability.
 * Exact version and the documented surface are both required.  In particular,
 * hidden `--yolo` aliases are never considered by this function.
 */
export function detectOpenCodeCapability(
  executable: string,
  observations: { version: CommandObservation; help: CommandObservation },
): OpenCodeCapability {
  const version = parseVersion(observations.version.stdout);
  const versionSucceeded = observations.version.exitCode === 0 && !observations.version.timedOut;
  const helpSucceeded = observations.help.exitCode === 0 && !observations.help.timedOut;
  const helpAdvertisesAuto = hasDocumentedAuto(observations.help.stdout);
  const helpDocumentsExplicitDeny = documentsExplicitDeny(observations.help.stdout);
  const base = {
    executable,
    version,
    versionExitCode: observations.version.exitCode,
    helpExitCode: observations.help.exitCode,
    helpAdvertisesAuto,
    helpDocumentsExplicitDeny,
  };
  if (!versionSucceeded || !helpSucceeded) {
    return {
      ...base,
      status: "failed",
      strategy: "reject",
      reason: "OpenCode version/help capability probe failed or timed out",
    };
  }
  if (version !== VERIFIED_OPENCODE_VERSION) {
    return {
      ...base,
      status: "unsupported",
      strategy: "reject",
      reason: `OpenCode version ${version ?? "unknown"} is not the verified ${VERIFIED_OPENCODE_VERSION}`,
    };
  }
  if (!helpAdvertisesAuto || !helpDocumentsExplicitDeny) {
    return {
      ...base,
      status: "unsupported",
      strategy: "reject",
      reason: "OpenCode help does not prove documented --auto and explicit-deny semantics",
    };
  }
  return {
    ...base,
    status: "supported",
    strategy: "auto",
    reason: "verified OpenCode version and documented --auto capability",
  };
}

async function executeBounded(command: string[], timeoutMilliseconds: number): Promise<CommandObservation> {
  let child: ReturnType<typeof Bun.spawn>;
  try {
    child = Bun.spawn(command, { stdin: "ignore", stdout: "pipe", stderr: "pipe" } as any);
  } catch (error) {
    return { exitCode: null, stdout: "", stderr: error instanceof Error ? error.message : String(error) };
  }
  const read = async (stream: unknown): Promise<string> => {
    if (!stream) return "";
    return new Response(stream as BodyInit).text();
  };
  const stdout = read(child.stdout);
  const stderr = read(child.stderr);
  const timeout = new Promise<null>((resolvePromise) => setTimeout(() => resolvePromise(null), timeoutMilliseconds));
  const firstExit = await Promise.race([child.exited, timeout]);
  const timedOut = firstExit === null;
  let exitCode: number | null = firstExit;
  if (timedOut) {
    try {
      process.kill(child.pid, "SIGTERM");
    } catch {
      // The process may already have exited.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
    try {
      process.kill(child.pid, "SIGKILL");
    } catch {
      // The process may already have exited.
    }
    const boundedExit = await Promise.race([
      child.exited,
      new Promise<null>((resolvePromise) => setTimeout(() => resolvePromise(null), 100)),
    ]);
    exitCode = boundedExit;
  }
  return {
    exitCode,
    stdout: await stdout,
    stderr: await stderr,
    timedOut,
  };
}

export async function preflightOpenCode(
  executable = "opencode",
  injected?: { version: CommandObservation; help: CommandObservation },
): Promise<OpenCodeCapability> {
  const observations = injected ?? await (async () => {
    // yargs writes the help surface to stderr on this installed CLI even with
    // a successful exit.  The capability probe deliberately observes both
    // ordinary output channels, without treating either as a permission grant.
    const version = executeBounded([executable, "--version"], 2_000);
    const help = executeBounded([executable, "run", "--help"], 2_000);
    return Promise.all([version, help]).then(([versionObservation, helpObservation]) => ({
      version: versionObservation,
      help: { ...helpObservation, stdout: `${helpObservation.stdout}\n${helpObservation.stderr}` },
    }));
  })();
  return detectOpenCodeCapability(executable, observations);
}

export function createPermissionProfile(explicitDenyRules: readonly string[] = []): OpenCodePermissionProfile {
  const rules = explicitDenyRules
    .map((rule) => rule.trim())
    .filter(Boolean);
  return {
    strategy: "auto",
    cliFlag: DOCUMENTED_AUTO_FLAG,
    opencodeVersion: VERIFIED_OPENCODE_VERSION,
    autoApproval: "non-denied-only",
    explicitDenyPolicy: "preserved-by-opencode",
    explicitDenyRules: [...rules],
    unexpectedRequestPolicy: "fail-closed",
  };
}

export function constructOpenCodeCommand(input: OpenCodeCommandInput): OpenCodeCommandConstruction {
  if (!input.executable.trim()) throw new Error("OpenCode executable is required");
  if (!input.projectDirectory.trim()) throw new Error("OpenCode project directory is required");
  if (!input.prompt.trim()) throw new Error("OpenCode prompt is required");
  const command = [
    input.executable,
    "run",
    DOCUMENTED_AUTO_FLAG,
    "--format",
    "json",
    "--dir",
    input.projectDirectory,
    input.prompt,
  ];
  return {
    command,
    observableCommand: [...command.slice(0, -1), "<prompt-redacted>"],
  };
}

function wildcardMatches(rule: string, value: string): boolean {
  const expression = new RegExp(`^${rule.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`, "i");
  return expression.test(value);
}

function deniedByProfile(request: PermissionRequest, profile: OpenCodePermissionProfile): boolean {
  const values = [
    request.operation,
    request.capabilityClass,
    request.resourceClass,
    `${request.capabilityClass}.${request.operation}`,
    `${request.resourceClass}.${request.operation}`,
  ].map((value) => value.trim()).filter(Boolean);
  return profile.explicitDenyRules.some((rule) => values.some((value) => wildcardMatches(rule, value)));
}

export function classifyPermissionRequest(
  request: PermissionRequest,
  profile: OpenCodePermissionProfile,
): PermissionDecision {
  if (deniedByProfile(request, profile)) {
    return {
      outcome: "fail-closed",
      reason: "permission request matches an explicit deny rule; --auto does not override deny",
      request,
    };
  }
  const terminalApproved = /^(approved|auto-approved|allowed|granted|once|allow)$/i.test(request.state);
  if (terminalApproved) return { outcome: "approved-observation", reason: "OpenCode reported an approval under --auto" };
  return {
    outcome: "fail-closed",
    reason: "permission request was not preflight-approved; terminating the OpenCode process group",
    request,
  };
}

function eventType(value: Record<string, unknown>): string {
  return [value.type, value.event, value.name].find((candidate) => typeof candidate === "string") as string ?? "unknown";
}

function permissionPayload(value: Record<string, unknown>): Record<string, unknown> {
  for (const candidate of [value.properties, value.data, value.payload, value.permission]) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) return candidate as Record<string, unknown>;
  }
  return value;
}

/** Parse only machine-readable permission request events; ordinary JSON output is ignored. */
export function detectPermissionRequest(line: string): PermissionRequest | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const value = parsed as Record<string, unknown>;
  const sourceEvent = eventType(value);
  const lowerType = sourceEvent.toLowerCase();
  const payload = permissionPayload(value);
  const rawState = safeString(payload.state || payload.status || payload.permissionState || value.state || value.status);
  const isRequest = /permission[._-]?(asked|request|needed|prompt)/i.test(lowerType)
    || (/permission/i.test(lowerType) && /^(pending|asked|requested|awaiting|waiting|rejected|denied|blocked)$/i.test(rawState));
  if (!isRequest) return null;
  return {
    operation: safeString(payload.operation || payload.action || payload.permission || value.operation || value.action) || "unknown",
    capabilityClass: safeString(payload.capabilityClass || payload.capability || payload.permission || value.capabilityClass) || "unknown",
    resourceClass: safeString(payload.resourceClass || payload.resource || payload.pattern || value.resourceClass) || "unknown",
    reason: safeString(payload.reason || payload.message || payload.description || value.reason) || "OpenCode reported a permission request",
    state: rawState || "unknown",
    sourceEvent,
  };
}

function genericPermissionProfile(source: string): ProactivePermissionProfile {
  return {
    source,
    approvedWorkspace: true,
    processGroupControl: true,
    standardInput: "disabled",
    eventPersistence: true,
    watchdog: true,
    userEventBubbling: true,
  };
}

function recordPathFor(input: Pick<OpenCodeLaunchInput, "projectRoot" | "componentPath">): string {
  return join(resolve(input.projectRoot, input.componentPath), "as-is.md");
}

async function createPromptFile(prompt: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "as-is-opencode-prompt-"));
  await chmod(directory, 0o700);
  const path = join(directory, "prompt.txt");
  await writeFile(path, prompt, { encoding: "utf8", mode: 0o600 });
  return path;
}

async function rejectCapability(recordPath: string, capability: OpenCodeCapability): Promise<never> {
  await appendCheckpoint(recordPath, checkpoint("opencode-capability-preflight", "opencode-capability-preflight-failed", {
    capability: {
      status: capability.status,
      executable: capability.executable,
      version: capability.version,
      versionExitCode: capability.versionExitCode,
      helpExitCode: capability.helpExitCode,
      helpAdvertisesAuto: capability.helpAdvertisesAuto,
      helpDocumentsExplicitDeny: capability.helpDocumentsExplicitDeny,
      strategy: capability.strategy,
    },
    reason: capability.reason,
    safeFallback: "reject; no hidden alias or non-auto permission bypass is selected",
  }), "blocked");
  throw new AdapterLaunchError("opencode-capability-preflight-failed", capability.reason, recordPath);
}

/**
 * Preflight and submit one OpenCode worker through the accepted detached
 * launch seam.  The worker is a component-local monitor; the supervisor still
 * owns the detached lifecycle, process group, watchdog, and cleanup.
 */
export async function launchOpenCode(input: OpenCodeLaunchInput): Promise<OpenCodeLaunchResult> {
  const recordPath = recordPathFor(input);
  const executable = input.executable ?? "opencode";
  const capability = await preflightOpenCode(executable, input.capabilityProbe);
  if (capability.status !== "supported") return rejectCapability(recordPath, capability);

  const permissionProfile = createPermissionProfile(input.explicitDenyRules);
  const commandObservation = constructOpenCodeCommand({
    executable,
    projectDirectory: resolve(input.projectRoot),
    prompt: input.prompt,
  }).observableCommand;
  const promptFile = await createPromptFile(input.prompt);
  const runnerPath = input.runnerPath ?? fileURLToPath(new URL("./runner.ts", import.meta.url));
  const runnerCommand = [
    process.execPath,
    runnerPath,
    "--opencode",
    executable,
    "--project-directory",
    resolve(input.projectRoot),
    "--prompt-file",
    promptFile,
    "--permission-profile",
    JSON.stringify(permissionProfile),
  ];
  try {
    await appendCheckpoint(recordPath, checkpoint("opencode-capability-preflight", "opencode-capability-preflight-passed", {
      capability: {
        status: capability.status,
        executable: capability.executable,
        version: capability.version,
        versionExitCode: capability.versionExitCode,
        helpExitCode: capability.helpExitCode,
        helpAdvertisesAuto: capability.helpAdvertisesAuto,
        helpDocumentsExplicitDeny: capability.helpDocumentsExplicitDeny,
        strategy: capability.strategy,
      },
      permissionProfile,
      command: commandObservation,
      prompt: "redacted; supplied through a disposable private prompt file",
      preflight: "completed before supervisor submission",
    }));
    const launched = await launchComponent({
      projectRoot: input.projectRoot,
      componentPath: input.componentPath,
      parentContext: input.parentContext,
      roleChain: input.roleChain,
      attempt: input.attempt,
      recovery: input.recovery,
      job: {
        adapter: "opencode",
        executionMode: "supervisor-owned-detached",
        componentPath: input.componentPath,
        workerRole: "implementer",
        command: runnerCommand,
        permissionProfile: genericPermissionProfile(`${ADAPTER_ID}/supervisor`),
        checkInSeconds: input.checkInSeconds ?? 1,
        startDelayMilliseconds: input.startDelayMilliseconds,
        available: input.available,
      },
    });
    if (launched.outcome !== "started") await rm(promptFile, { recursive: true, force: true });
    return { ...launched, capability, commandObservation };
  } catch (error) {
    await rm(promptFile, { recursive: true, force: true });
    throw error;
  }
}

export { AdapterLaunchError, cleanupComponent };
