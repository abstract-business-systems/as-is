import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  classifyPermissionRequest,
  constructOpenCodeCommand,
  detectPermissionRequest,
  type OpenCodePermissionProfile,
  type PermissionRequest,
} from "./adapter.ts";

interface SpawnedOpenCode {
  pid: number;
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  exited: Promise<number>;
}

export interface ProcessGroupTermination {
  signal: "SIGTERM" | "SIGKILL" | "none";
  groupTerminated: boolean | "unknown";
  boundedMilliseconds: number;
}

export interface WorkerRunOptions {
  executable: string;
  projectDirectory: string;
  promptFile: string;
  profile: OpenCodePermissionProfile;
  recordPath: string;
  terminationTimeoutMilliseconds?: number;
  spawnProcess?: (command: string[], cwd: string) => SpawnedOpenCode;
}

const CHECKPOINT_BEGIN = "<!-- subprocess-execution-foundation:begin -->";
const CHECKPOINT_END = "<!-- subprocess-execution-foundation:end -->";
const RECORD_STATUS = /^  status: ([^\r\n]+)$/m;
const RECORD_UPDATED = /^  updated: ([^\r\n]+)$/m;

function isoNow(): string {
  return new Date().toISOString();
}

function adapterJobId(): string {
  return `opencode-worker-${process.pid}`;
}

function checkpoint(event: string, details: Record<string, unknown>) {
  return {
    operation: "permission",
    event,
    jobId: adapterJobId(),
    source: "opencode-adapter",
    observedAt: isoNow(),
    details,
  };
}

async function atomicWrite(path: string, contents: string): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`;
  try {
    await writeFile(temporary, contents, { encoding: "utf8", mode: 0o600 });
    const file = await open(temporary, "r+");
    try {
      await file.sync();
    } finally {
      await file.close();
    }
    await rename(temporary, path);
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
  throw new Error("durable record blocker: permission checkpoint lock timed out");
}

async function appendPermissionCheckpoint(
  recordPath: string,
  event: ReturnType<typeof checkpoint>,
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
    next = next.replace(RECORD_UPDATED, `  updated: ${event.observedAt}`);
    const line = JSON.stringify(event);
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

function redactReason(reason: string): string {
  return reason
    .replace(/\/[^\s"']+/g, "<path-redacted>")
    .replace(/[A-Za-z0-9+/=_-]{24,}/g, "<token-redacted>")
    .slice(0, 240);
}

function safePermissionRequest(request: PermissionRequest): Record<string, string> {
  return {
    operation: redactReason(request.operation),
    capabilityClass: redactReason(request.capabilityClass),
    resourceClass: redactReason(request.resourceClass),
    reason: redactReason(request.reason),
    state: redactReason(request.state),
    sourceEvent: redactReason(request.sourceEvent),
  };
}

async function recordPermissionFailure(
  options: WorkerRunOptions,
  request: PermissionRequest,
  reason: string,
): Promise<void> {
  await appendPermissionCheckpoint(options.recordPath, checkpoint("permission-failed-closed", {
    permissionState: "failed-closed",
    permissionReason: redactReason(reason),
    permissionRequest: safePermissionRequest(request),
    preflightProfile: options.profile,
    process: {
      pid: process.pid,
      opencodeProcessGroupId: "child-pid-owned-group",
      termination: "pending-durable-fail-closed-checkpoint",
    },
    recovery: "retain durable blocker; do not retry through a weaker permission strategy",
  }), "failed");
}

async function recordPermissionTermination(
  options: WorkerRunOptions,
  termination: ProcessGroupTermination,
): Promise<void> {
  await appendPermissionCheckpoint(options.recordPath, checkpoint("permission-process-terminated", {
    permissionState: "failed-closed",
    termination,
    cleanup: termination.groupTerminated === true ? "bounded-process-group-termination-observed" : "termination-observation-inconclusive",
  }));
}

function processAlive(pid: number): boolean | "unknown" {
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

function groupAlive(pid: number): boolean | "unknown" {
  try {
    process.kill(-pid, 0);
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

/** Stop the OpenCode-owned group, escalate once, and return within a bound. */
export async function terminateOpenCodeProcessGroup(
  pid: number,
  timeoutMilliseconds = 750,
): Promise<ProcessGroupTermination> {
  const started = Number(process.hrtime.bigint());
  let signal: ProcessGroupTermination["signal"] = "none";
  const send = (candidate: "SIGTERM" | "SIGKILL"): void => {
    try {
      process.kill(-pid, candidate);
      signal = candidate;
      return;
    } catch {
      try {
        process.kill(pid, candidate);
        signal = candidate;
      } catch {
        // The child has already gone away or the host cannot signal it.
      }
    }
  };
  if (groupAlive(pid) !== false) send("SIGTERM");
  const bounded = Math.max(20, timeoutMilliseconds);
  const termDeadline = Date.now() + Math.floor(bounded / 2);
  while (Date.now() < termDeadline && groupAlive(pid) !== false) await sleep(10);
  if (groupAlive(pid) !== false) {
    send("SIGKILL");
    const killDeadline = Date.now() + Math.ceil(bounded / 2);
    while (Date.now() < killDeadline && groupAlive(pid) !== false) await sleep(10);
  }
  const groupTerminated = groupAlive(pid);
  return {
    signal,
    groupTerminated: groupTerminated === false ? true : groupTerminated,
    boundedMilliseconds: Number(process.hrtime.bigint() - BigInt(started)) / 1_000_000,
  };
}

async function consumeLines(
  stream: ReadableStream<Uint8Array>,
  onLine?: (line: string) => Promise<void>,
): Promise<void> {
  const decoder = new TextDecoder();
  let pending = "";
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    pending += decoder.decode(chunk, { stream: true });
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) if (onLine) await onLine(line);
  }
  pending += decoder.decode();
  if (pending && onLine) await onLine(pending);
}

function defaultSpawn(command: string[], cwd: string): SpawnedOpenCode {
  return Bun.spawn(command, {
    cwd,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
    detached: true,
  } as any) as unknown as SpawnedOpenCode;
}

export async function runOpenCodeWorker(options: WorkerRunOptions): Promise<number> {
  if (options.profile.strategy !== "auto" || options.profile.cliFlag !== "--auto") {
    return 78;
  }
  let prompt: string;
  try {
    prompt = await readFile(options.promptFile, "utf8");
  } finally {
    await rm(dirname(options.promptFile), { recursive: true, force: true }).catch(() => undefined);
  }
  const command = constructOpenCodeCommand({
    executable: options.executable,
    projectDirectory: options.projectDirectory,
    prompt,
  }).command;
  const spawnProcess = options.spawnProcess ?? defaultSpawn;
  let child: SpawnedOpenCode;
  try {
    child = spawnProcess(command, options.projectDirectory);
  } catch {
    return 69;
  }

  let failure: { request: PermissionRequest; reason: string; termination: ProcessGroupTermination } | null = null;
  const inspectLine = async (line: string): Promise<void> => {
    if (failure) return;
    const request = detectPermissionRequest(line);
    if (!request) return;
    const decision = classifyPermissionRequest(request, options.profile);
    if (decision.outcome === "approved-observation") return;
    let durableFailureRecorded = true;
    try {
      await recordPermissionFailure(options, decision.request, decision.reason);
    } catch {
      // The supervisor will still publish a host-process failure, but the
      // child must be stopped even if the durable question path is unavailable.
      durableFailureRecorded = false;
    }
    let termination: ProcessGroupTermination;
    try {
      termination = await terminateOpenCodeProcessGroup(
        child.pid,
        options.terminationTimeoutMilliseconds ?? 750,
      );
    } catch {
      termination = { signal: "none", groupTerminated: "unknown", boundedMilliseconds: options.terminationTimeoutMilliseconds ?? 750 };
    }
    failure = { request: decision.request, reason: decision.reason, termination };
    if (durableFailureRecorded) await recordPermissionTermination(options, termination).catch(() => undefined);
  };
  const stdoutDone = consumeLines(child.stdout, inspectLine);
  const stderrDone = consumeLines(child.stderr);
  const exitCode = await child.exited;
  await Promise.all([stdoutDone, stderrDone]);
  if (failure) {
    // A detached child should already be gone.  Repeat the bounded check in
    // case the stream closed before the signal was observable.
    if (groupAlive(child.pid) !== false) await terminateOpenCodeProcessGroup(child.pid, options.terminationTimeoutMilliseconds ?? 750);
    return 70;
  }
  return exitCode;
}

function valueAfter(args: string[], flag: string): string {
  const index = args.indexOf(flag);
  const value = index >= 0 ? args[index + 1] : undefined;
  if (!value) throw new Error(`missing ${flag}`);
  return value;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (!args.includes("--opencode")) throw new Error("runner requires --opencode");
  const profile = JSON.parse(valueAfter(args, "--permission-profile")) as OpenCodePermissionProfile;
  const exitCode = await runOpenCodeWorker({
    executable: valueAfter(args, "--opencode"),
    projectDirectory: valueAfter(args, "--project-directory"),
    promptFile: valueAfter(args, "--prompt-file"),
    profile,
    recordPath: process.env.AS_IS_RECORD_PATH ?? "",
  });
  process.exitCode = exitCode;
}

if (import.meta.main) await main();
