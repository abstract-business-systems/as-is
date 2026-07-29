import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts";
const AGENT = ".agents/agents/as-is.md";

type RunResult = { stdout: string; stderr: string; exitCode: number };

const runLauncher = (args: string[]): Promise<RunResult> =>
  new Promise((resolveRun) => {
    const child = spawn(Bun.which("bun") ?? "bun", [SCRIPT, ...args], {
      cwd: process.cwd(),
      env: process.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolveRun({ stdout, stderr, exitCode: code ?? 1 }));
  });

const writeSleepStub = (dir: string, seconds: number): string => {
  const path = join(dir, "pi-stub.sh");
  writeFileSync(path, `#!/usr/bin/env bash\nsleep ${seconds}\nexit 0\n`, { mode: 0o755 });
  return path;
};

// Poll a process-group's liveness (-pgid). Resolves true once the group is
// gone (no such process), false on timeout.
const groupGone = (pgid: number, timeoutMs: number): Promise<boolean> =>
  new Promise((resolveGone) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      try {
        process.kill(-pgid, 0);
        if (Date.now() >= deadline) resolveGone(false);
        else setTimeout(tick, 200);
      } catch {
        resolveGone(true);
      }
    };
    tick();
  });

test("detach dry-run reports the detach flag and forwarded budget", async () => {
  const result = await runLauncher([
    "--agent", AGENT,
    "--task", "Inspect the root task record.",
    "--cwd", process.cwd(),
    "--record", "./as-is.md",
    "--budget-wall-clock-seconds", "120",
    "--budget-cost-usd", "0.3",
    "--detach",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.detach).toBe(true);
  expect(parsed.budget["wall-clock-seconds"]).toBe(120);
  expect(parsed.budget["cost-usd"]).toBe(0.3);
  expect(parsed.command).toBeTruthy();
  expect(parsed.agent).toContain("as-is.md");
});

test("detach appends a handle to the configured registry", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-registry-test-"));
  try {
    const stubPi = writeSleepStub(dir, 0);
    const registry = join(dir, "jobs.jsonl");
    const configured = await new Promise<RunResult>((resolveRun) => {
      const child = spawn(Bun.which("bun") ?? "bun", [SCRIPT, "--agent", AGENT, "--task", "Registry configured task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach"], { cwd: process.cwd(), env: { ...process.env, AS_IS_JOBS_REGISTRY: registry }, stdio: ["ignore", "pipe", "pipe"] });
      let stdout = ""; let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("close", (code) => resolveRun({ stdout, stderr, exitCode: code ?? 1 }));
    });
    expect(configured.exitCode).toBe(0);
    const line = readFileSync(registry, "utf8").trim();
    const registered = JSON.parse(line);
    expect(registered.jobId).toBe(JSON.parse(configured.stdout).jobId);
    expect(registered.pid).toBe(JSON.parse(configured.stdout).pid);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("detach returns a handle immediately and the detached supervisor kills the child on budget", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-detach-test-"));
  try {
    const stubPi = writeSleepStub(dir, 30);
    const start = Date.now();
    const result = await runLauncher([
      "--agent", AGENT,
      "--task", "Stub task for detached budget enforcement.",
      "--cwd", process.cwd(),
      "--pi", stubPi,
      "--record", "./as-is.md",
      "--budget-wall-clock-seconds", "1",
      "--budget-cost-usd", "0.1",
      "--detach",
    ]);
    const elapsed = Date.now() - start;

    // The launcher must return promptly — far below the stub's 30s sleep.
    expect(result.exitCode).toBe(0);
    expect(elapsed).toBeLessThan(5000);
    expect(result.stdout.trim()).not.toBe("");

    const handle = JSON.parse(result.stdout);
    expect(handle.jobId).toMatch(/^j-/);
    expect(typeof handle.pid).toBe("number");
    expect(handle.pid).toBeGreaterThan(0);
    expect(handle.logPath).toContain("as-is-child-");
    expect(handle.recordPath).toBe("./as-is.md");
    expect(handle.budgetWallClockSeconds).toBe(1);
    expect(handle.budgetCostUsd).toBe(0.1);
    expect(existsSync(handle.logPath)).toBe(true);

    // The detached supervisor (budget=1s + 5s grace) must kill the child group.
    // Allow budget + grace + polling slack.
    const killed = await groupGone(handle.pid, 9000);
    expect(killed).toBe(true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 15000);
