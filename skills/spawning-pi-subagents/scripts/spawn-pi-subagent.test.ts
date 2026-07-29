import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts";
const AGENT = ".agents/agents/as-is.md";

type RunResult = { stdout: string; stderr: string; exitCode: number };

const runLauncher = (args: string[], env: NodeJS.ProcessEnv = process.env): Promise<RunResult> =>
  new Promise((resolveRun) => {
    const child = spawn(Bun.which("bun") ?? "bun", [SCRIPT, ...args], {
      cwd: process.cwd(),
      env,
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

// Poll a pid's liveness. Resolves true once the process is gone.
const pidGone = (pid: number, timeoutMs: number): Promise<boolean> =>
  new Promise((resolveGone) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      try {
        process.kill(pid, 0);
        if (Date.now() >= deadline) resolveGone(false);
        else setTimeout(tick, 100);
      } catch {
        resolveGone(true);
      }
    };
    tick();
  });

const readRegistryLines = (registry: string): unknown[] =>
  readFileSync(registry, "utf8").split("\n").filter((line) => line.trim())
    .map((line) => JSON.parse(line));

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
    const configured = await runLauncher(
      ["--agent", AGENT, "--task", "Registry configured task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach"],
      { ...process.env, AS_IS_JOBS_REGISTRY: registry },
    );
    expect(configured.exitCode).toBe(0);
    const handle = JSON.parse(configured.stdout);
    // The launch line is the first registry line; a completion line may follow.
    const launched = readRegistryLines(registry).find(
      (line) => (line as { event?: string }).event === "launched",
    ) as { jobId: string; pid: number; identity: string; caller: string } | undefined;
    expect(launched).toBeDefined();
    expect(launched!.jobId).toBe(handle.jobId);
    expect(launched!.pid).toBe(handle.pid);
    expect(launched!.identity).toBe("as-is");
    expect(launched!.caller).toBe("user");
    // Wait for the detached supervisor to finish so the stub is not removed
    // before the child runs (which would make the child exit non-zero and
    // preserve its worktree as a recovery candidate).
    await pidGone(handle.pid, 5000);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("detach returns a handle immediately and the supervisor kills the child on budget", async () => {
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
      "--no-registry",
      "--no-worktree",
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

    // The detached supervisor (budget=1s + 5s grace) must exit after killing
    // the child, taking its process group with it.
    const killed = await groupGone(handle.pid, 9000);
    expect(killed).toBe(true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 15000);

test("detach supervisor records a completion line with exit code and wall-clock", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-completion-test-"));
  try {
    const stubPi = writeSleepStub(dir, 0);
    const registry = join(dir, "jobs.jsonl");
    const result = await runLauncher(
      ["--agent", AGENT, "--task", "Completion recording task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach"],
      { ...process.env, AS_IS_JOBS_REGISTRY: registry },
    );
    expect(result.exitCode).toBe(0);
    const handle = JSON.parse(result.stdout);
    // Wait for the detached supervisor to finish and write its completion line.
    const supervisorDone = await pidGone(handle.pid, 5000);
    expect(supervisorDone).toBe(true);
    const finished = readRegistryLines(registry).find(
      (line) => (line as { jobId: string; event?: string }).jobId === handle.jobId
        && (line as { event?: string }).event === "finished",
    ) as { exitCode: number; budgetStopped: boolean; wallClockSeconds: number; childPid: number } | undefined;
    expect(finished).toBeDefined();
    expect(finished!.exitCode).toBe(0);
    expect(finished!.budgetStopped).toBe(false);
    expect(typeof finished!.wallClockSeconds).toBe("number");
    expect(finished!.childPid).toBeGreaterThan(0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("blocking mode enforces the wall-clock budget and returns a budget-stopped result", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-blocking-test-"));
  try {
    const stubPi = writeSleepStub(dir, 30);
    const start = Date.now();
    const result = await runLauncher([
      "--agent", AGENT,
      "--task", "Stub task for blocking budget enforcement.",
      "--cwd", process.cwd(),
      "--pi", stubPi,
      "--budget-wall-clock-seconds", "1",
      "--no-registry",
      "--no-worktree",
    ]);
    const elapsed = Date.now() - start;
    // The blocking launcher returns near the budget, not the stub's 30s sleep.
    expect(elapsed).toBeLessThan(6000);
    expect(result.exitCode).toBe(124);
    expect(result.stderr).toContain("as-is budget-stopped");
    expect(result.stderr).toContain("exit=124");
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 15000);

test("--jobs reports a finished job as completed and joins its task-record status", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-jobs-test-"));
  try {
    const stubPi = writeSleepStub(dir, 0);
    const registry = join(dir, "jobs.jsonl");
    const env = { ...process.env, AS_IS_JOBS_REGISTRY: registry };
    // A hermetic temp record with a distinctive status so the record-join is
    // provably exercised (proc-status completed, record-status blocked).
    const recordPath = join(dir, "component.as-is.md");
    writeFileSync(recordPath, [
      "---",
      "as-is-version: 2",
      "task:",
      "  status: blocked",
      "  worker: component-builder",
      "  updated: 2026-07-28T02:30:00Z",
      "---",
      "# temp component record",
      "",
    ].join("\n"));
    const launched = await runLauncher(
      ["--agent", AGENT, "--task", "Jobs status task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach", "--record", recordPath],
      env,
    );
    expect(launched.exitCode).toBe(0);
    const handle = JSON.parse(launched.stdout);
    const supervisorDone = await pidGone(handle.pid, 5000);
    expect(supervisorDone).toBe(true);

    const jobs = await runLauncher(["--jobs"], env);
    expect(jobs.exitCode).toBe(0);
    expect(jobs.stdout).toContain(handle.jobId);
    expect(jobs.stdout).toContain("completed"); // proc-status from completion line
    expect(jobs.stdout).toContain("blocked");   // record-status joined from the temp record
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// The critical isolation property: a child that runs a destructive git command
// (here `git restore` of a tracked file) must NOT affect the caller's working
// tree, because the child runs in its own pruned worktree. This directly tests
// the incident where a subagent's `git restore` destroyed uncommitted work.
test("worktree isolation: a child git restore does not touch the caller's working tree", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-isolation-test-"));
  try {
    // A stub pi that simulates a destructive `git restore` of a tracked file,
    // then exits cleanly. The caller's copy of that file must be unchanged.
    const stubPi = join(dir, "pi-restore-stub.sh");
    writeFileSync(stubPi, [
      "#!/usr/bin/env bash",
      "# Simulate a subagent reverting a tracked file to HEAD.",
      "git restore -- skills/spawning-pi-subagents/SKILL.md",
      "exit 0",
      "",
    ].join("\n"), { mode: 0o755 });

    // Snapshot the caller's SKILL.md (which has uncommitted edits in this
    // working tree) before launching the child.
    const targetFile = "skills/spawning-pi-subagents/SKILL.md";
    const before = readFileSync(targetFile, "utf8");

    const result = await runLauncher([
      "--agent", AGENT,
      "--task", "Destructive stub.",
      "--cwd", process.cwd(),
      "--pi", stubPi,
      "--detach",
      "--no-registry",
    ]);
    expect(result.exitCode).toBe(0);
    const handle = JSON.parse(result.stdout);
    expect(handle.worktreePath).toBeTruthy();

    // Wait for the detached supervisor to finish (it removes the worktree on
    // the stub's clean exit).
    const done = await pidGone(handle.pid, 5000);
    expect(done).toBe(true);

    // The caller's SKILL.md must be byte-identical: the child's `git restore`
    // ran inside the worktree, not here.
    const after = readFileSync(targetFile, "utf8");
    expect(after).toBe(before);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 15000);
