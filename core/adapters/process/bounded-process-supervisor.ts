import { spawn, type ChildProcess } from "node:child_process";
import { open } from "node:fs/promises";

export type BoundedProcessRequest = {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
  logPath: string | null;
  budgetWallClockSeconds: number | null;
  killGraceSeconds: number;
  startedAtMs: number;
  phaseTimings: Record<string, number>;
};

export const MAX_CAPTURED_STDOUT_BYTES = 4 * 1024 * 1024;

export type BoundedProcessResult = {
  childPid: number;
  exitCode: number;
  budgetStopped: boolean;
  budgetStopElapsedMs: number | null;
  wallClockSeconds: number;
  stdoutText: string;
  stdoutAvailable: boolean;
  stdoutTruncated: boolean;
};

function phaseStarted(): number {
  return Date.now();
}

function phaseEnded(phaseTimings: Record<string, number>, name: string, started: number): void {
  phaseTimings[name] = Date.now() - started;
}

/**
 * Run one child process under a detached process-group boundary. This module
 * owns only process lifetime, group signalling, wall-clock enforcement, and
 * stdio/result observation. Callers retain task, Git, worktree, and handoff
 * interpretation.
 */
export async function runBoundedProcess(request: BoundedProcessRequest): Promise<BoundedProcessResult> {
  const logFilePhase = phaseStarted();
  const logFile = request.logPath
    ? await open(request.logPath, "w")
    : null;
  phaseEnded(request.phaseTimings, "log-setup", logFilePhase);

  const spawnPhase = phaseStarted();
  const child = spawn(request.command, request.args, {
    cwd: request.cwd,
    env: request.env,
    shell: false,
    detached: true,
    stdio: logFile ? ["ignore", "pipe", logFile.fd] : ["ignore", "pipe", "inherit"],
  });
  const childPid = child.pid as number;
  let stdoutAvailable = child.stdout !== null;
  let stdoutTruncated = false;
  let capturedStdoutBytes = 0;
  const capturedStdout: Buffer[] = [];
  let logWrite = Promise.resolve();
  const observeStdout = (chunk: Buffer | string): void => {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    if (capturedStdoutBytes < MAX_CAPTURED_STDOUT_BYTES) {
      const remaining = MAX_CAPTURED_STDOUT_BYTES - capturedStdoutBytes;
      const captured = buffer.subarray(0, remaining);
      if (captured.length > 0) {
        capturedStdout.push(captured);
        capturedStdoutBytes += captured.length;
      }
      if (captured.length < buffer.length) stdoutTruncated = true;
    } else if (buffer.length > 0) {
      stdoutTruncated = true;
    }
    if (logFile) {
      logWrite = logWrite.then(() => logFile.write(buffer)).then(() => undefined).catch(() => undefined);
    } else {
      process.stdout.write(buffer);
    }
  };
  if (child.stdout) {
    child.stdout.on("data", observeStdout);
    child.stdout.once("error", () => { stdoutAvailable = false; });
  }
  phaseEnded(request.phaseTimings, "child-spawn", spawnPhase);

  const signalGroup = (signal: NodeJS.Signals): void => {
    try {
      process.kill(-childPid, signal);
    } catch {
      /* group already gone */
    }
  };

  let budgetStopped = false;
  let budgetStopElapsedMs: number | null = null;
  let budgetTimer: NodeJS.Timeout | undefined;
  let killTimer: NodeJS.Timeout | undefined;
  const clearTimers = (): void => {
    if (budgetTimer) clearTimeout(budgetTimer);
    if (killTimer) clearTimeout(killTimer);
    budgetTimer = undefined;
    killTimer = undefined;
  };

  if (request.budgetWallClockSeconds !== null && request.budgetWallClockSeconds > 0) {
    budgetTimer = setTimeout(() => {
      budgetStopped = true;
      budgetStopElapsedMs = Date.now() - request.startedAtMs;
      request.phaseTimings["budget-stop"] = budgetStopElapsedMs;
      signalGroup("SIGTERM");
      killTimer = setTimeout(() => signalGroup("SIGKILL"), request.killGraceSeconds * 1000);
    }, request.budgetWallClockSeconds * 1000);
  }

  const onTerm = (): void => signalGroup("SIGTERM");
  const onInt = (): void => signalGroup("SIGINT");
  process.once("SIGTERM", onTerm);
  process.once("SIGINT", onInt);

  const waitPhase = phaseStarted();
  const exitCode = await new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
  phaseEnded(request.phaseTimings, "child-wait", waitPhase);

  clearTimers();
  process.removeListener("SIGTERM", onTerm);
  process.removeListener("SIGINT", onInt);
  await logWrite;
  await logFile?.close().catch(() => undefined);

  return {
    childPid,
    exitCode,
    budgetStopped,
    budgetStopElapsedMs,
    wallClockSeconds: (Date.now() - request.startedAtMs) / 1000,
    stdoutText: Buffer.concat(capturedStdout).toString("utf8"),
    stdoutAvailable,
    stdoutTruncated,
  };
}
