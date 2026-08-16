import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runBoundedProcess } from "./bounded-process-supervisor.ts";

test("bounded process boundary captures detached output and returns before no-budget child completion", async () => {
  const directory = await mkdtemp(join(tmpdir(), "as-is-bounded-process-"));
  try {
    const logPath = join(directory, "child.log");
    const phaseTimings: Record<string, number> = {};
    const startedAt = Date.now();
    const resultPromise = runBoundedProcess({
      command: process.execPath,
      args: ["-e", "console.log('bounded-process'); await Bun.sleep(30);"],
      cwd: directory,
      env: process.env,
      logPath,
      budgetWallClockSeconds: null,
      killGraceSeconds: 1,
      startedAtMs: startedAt,
      phaseTimings,
    });
    const result = await resultPromise;
    expect(result.exitCode).toBe(0);
    expect(result.budgetStopped).toBe(false);
    expect(result.childPid).toBeGreaterThan(0);
    expect(phaseTimings["child-spawn"]).toBeGreaterThanOrEqual(0);
    expect(phaseTimings["child-wait"]).toBeGreaterThanOrEqual(0);
    expect(result.stdoutAvailable).toBe(true);
    expect(result.stdoutTruncated).toBe(false);
    expect(result.stdoutText).toContain("bounded-process");
    expect(await readFile(logPath, "utf8")).toContain("bounded-process");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("bounded process boundary caps captured stdout without changing log output", async () => {
  const directory = await mkdtemp(join(tmpdir(), "as-is-bounded-process-capture-"));
  try {
    const phaseTimings: Record<string, number> = {};
    const result = await runBoundedProcess({
      command: process.execPath,
      args: ["-e", "process.stdout.write('x'.repeat(5 * 1024 * 1024));"],
      cwd: directory,
      env: process.env,
      logPath: null,
      budgetWallClockSeconds: null,
      killGraceSeconds: 1,
      startedAtMs: Date.now(),
      phaseTimings,
    });
    expect(result.exitCode).toBe(0);
    expect(result.stdoutAvailable).toBe(true);
    expect(result.stdoutText.length).toBe(4 * 1024 * 1024);
    expect(result.stdoutTruncated).toBe(true);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("bounded process boundary owns the wall-clock stop without task interpretation", async () => {
  const directory = await mkdtemp(join(tmpdir(), "as-is-bounded-process-budget-"));
  try {
    const phaseTimings: Record<string, number> = {};
    const result = await runBoundedProcess({
      command: process.execPath,
      args: ["-e", "await Bun.sleep(5000);"],
      cwd: directory,
      env: process.env,
      logPath: null,
      budgetWallClockSeconds: 0.05,
      killGraceSeconds: 0.1,
      startedAtMs: Date.now(),
      phaseTimings,
    });
    expect(result.budgetStopped).toBe(true);
    expect(result.budgetStopElapsedMs).toBeGreaterThanOrEqual(40);
    expect(result.exitCode).not.toBe(0);
    expect(result.stdoutAvailable).toBe(true);
    expect(result.stdoutTruncated).toBe(false);
    expect(phaseTimings["budget-stop"]).toBe(result.budgetStopElapsedMs);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
