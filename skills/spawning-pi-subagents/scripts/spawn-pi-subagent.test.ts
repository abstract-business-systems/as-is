import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { evaluateHandoffEligibility, type HandoffFacts } from "./handoff-eligibility.ts";

const SCRIPT = resolve("skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const AGENT = "agents/as-is/agent.md";

type RunResult = { stdout: string; stderr: string; exitCode: number };

const runLauncher = (args: string[], env: NodeJS.ProcessEnv = process.env, launchCwd = process.cwd()): Promise<RunResult> =>
  new Promise((resolveRun) => {
    const childEnv = { ...env };
    // Tests model a direct host launch unless a caller is explicitly supplied.
    if (!args.includes("--caller")) {
      delete childEnv.AS_IS_IDENTITY;
      delete childEnv.AS_IS_JOB_ID;
    }
    const child = spawn(Bun.which("bun") ?? "bun", [SCRIPT, ...args], {
      cwd: launchCwd,
      env: childEnv,
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

test("project context follows the launching cwd when target cwd is a component", async () => {
  const launchRoot = mkdtempSync(join(tmpdir(), "as-is-launch-root-"));
  const target = join(launchRoot, "component");
  const bundle = join(launchRoot, "bundle");
  mkdirSync(target, { recursive: true });
  mkdirSync(join(bundle, "agents", "fixture"), { recursive: true });
  writeFileSync(join(launchRoot, "as-is.md"), "# Root\n");
  writeFileSync(join(launchRoot, "as-is.json"), JSON.stringify({ configuration: { agents: { defaultModel: "medium", models: { medium: "@preset/abs-medium" } } } }));
  writeFileSync(join(launchRoot, "AGENTS.md"), "launch-root instruction");
  writeFileSync(join(target, "AGENTS.md"), "component instruction");
  writeFileSync(join(bundle, "agents", "fixture", "agent.md"), "---\nname: fixture\nmode: subagent\ntools: read\n---\nFixture agent.");
  const result = await runLauncher([
    "--agent", join(bundle, "agents", "fixture", "agent.md"),
    "--task", "Project context discovery.",
    "--cwd", target,
    "--dry-run",
  ], process.env, launchRoot);
  if (result.exitCode !== 0) throw new Error(`${result.stderr}\n${result.stdout}`);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.model).toBe("@preset/abs-medium");
  rmSync(launchRoot, { recursive: true, force: true });
});

test("caller and parent metadata do not gate launcher dispatch", async () => {
  const result = await runLauncher([
    "--agent", "agents/component-builder/agent.md",
    "--task", "Capability-based implementation launch.",
    "--cwd", process.cwd(),
    "--caller", "untrusted-role",
    "--parent-job-id", "diagnostic-parent",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.identity).toBe("component-builder");
  expect(parsed.caller).toBe("untrusted-role");
  expect(parsed["parent-job-id"]).toBe("diagnostic-parent");
});

test("component-builder launches use its declared tools without identity injection", async () => {
  const result = await runLauncher([
    "--agent", "agents/component-builder/agent.md",
    "--task", "Authorized implementation launch.",
    "--cwd", process.cwd(),
    "--caller", "as-is",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.args).toContain("--no-extensions");
  expect(parsed.args).toContain("--extension");
  expect(parsed.tools).toBe("read,grep,find,ls,bash,edit,write,call_subagent,resolve_component_context");
  expect(parsed.args.join(" ")).toContain("read,grep,find,ls,bash,edit,write,call_subagent,resolve_component_context");
});

test("as-is launches use its declared tools without caller overrides", async () => {
  const result = await runLauncher([
    "--agent", "agents/as-is/agent.md",
    "--task", "Authorized routing launch.",
    "--cwd", process.cwd(),
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls,bash,edit,write,resolve_component_context");
  expect(parsed.args.join(" ")).toContain("read,grep,find,ls,bash,edit,write,resolve_component_context");
});

test("normal component-builder launches forward the bounded in-process gate budget", async () => {
  const result = await runLauncher([
    "--agent", "agents/component-builder/agent.md",
    "--task", "Authorized implementation launch.",
    "--cwd", process.cwd(),
    "--caller", "as-is",
    "--budget-wall-clock-seconds", "900",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.args).toContain(`${process.cwd()}/.pi/extensions/worker-tools.ts`);
  expect(parsed.tools).toBe("read,grep,find,ls,bash,edit,write,call_subagent,resolve_component_context");
  expect(parsed.args).toContain("read,grep,find,ls,bash,edit,write,call_subagent,resolve_component_context");
  expect(parsed.budget["wall-clock-seconds"]).toBe(900);
});

test("evidence validation uses the fixed read-only same-worktree capability profile", async () => {
  const result = await runLauncher([
    "--agent", "agents/evidence-validator/agent.md",
    "--task", "Read-only validation.",
    "--cwd", process.cwd(),
    "--caller", "component-builder",
    "--parent-job-id", "builder-job-test",
    "--tools", "bash,write,edit,webfetch",
    "--skill", "./untrusted-skill",
    "--approve",
    "--no-tools",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls,git_inspect");
  expect(parsed.worktree).toBe(false);
  expect(parsed.sessionPath).toBe(null);
  expect(parsed.args).toContain("--no-extensions");
  expect(parsed.args).toContain("--no-approve");
  expect(parsed.args).not.toContain(`${process.cwd()}/.pi/extensions/worker-tools.ts`);
  expect(parsed.args).not.toContain("bash,write,edit,webfetch");
  expect(parsed.args).not.toContain("--no-tools");
  expect(parsed.skills).toEqual([]);
});

test("ordinary fixture roles use generic declarative dispatch", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-generic-role-test-"));
  try {
    const agent = join(dir, "fixture-agent.md");
    writeFileSync(agent, [
      "---",
      "name: fixture-role",
      "mode: subagent",
      "model: medium",
      "tools: read,grep,call_subagent",
      "skills:",
      "  - skills/context-building",
      "---",
      "Return the bounded fixture report.",
    ].join("\n"));
    const result = await runLauncher([
      "--agent", agent,
      "--task", "Generic fixture dispatch.",
      "--cwd", process.cwd(),
      "--caller", "user",
      "--budget-wall-clock-seconds", "12",
      "--budget-cost-usd", "0.04",
      "--dry-run",
    ]);
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.identity).toBe("fixture-role");
    expect(parsed.tools).toBe("read,grep,call_subagent");
    expect(parsed.args.join(" ")).toContain("read,grep,call_subagent");
    expect(parsed.args).toContain("--skill");
    expect(parsed.skills).toEqual([`${process.cwd()}/skills/context-building`]);
    expect(parsed.sessionPath).toBe("<session-dir>");
    expect(parsed.worktree).toBe(true);
    expect(parsed.budget).toEqual({ "wall-clock-seconds": 12, "cost-usd": 0.04 });
    expect(parsed.args).not.toContain("--no-tools");
    expect(parsed.args.join(" ")).toContain("call_subagent");
    expect(parsed.args).not.toContain("--no-session");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("ordinary fixture roles ignore caller metadata without changing dispatch", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-generic-role-auth-test-"));
  try {
    const agent = join(dir, "fixture-agent.md");
    writeFileSync(agent, ["---", "name: fixture-role", "mode: subagent", "tools: read", "---", "Return ok."].join("\n"));
    const result = await runLauncher([
      "--agent", agent, "--task", "Generic fixture authorization.", "--cwd", process.cwd(), "--caller", "untrusted", "--dry-run",
    ]);
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.identity).toBe("fixture-role");
    expect(parsed.caller).toBe("untrusted");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("execution advisor launches use its frontmatter tool set and skills", async () => {
  const result = await runLauncher([
    "--agent", "agents/execution-advisor/agent.md",
    "--task", "Inspect bounded execution evidence.",
    "--cwd", process.cwd(),
    "--caller", "user",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.identity).toBe("execution-advisor");
  expect(parsed.tools).toBe("read,grep,find,ls,search_traces,get_trace,summarize_trace,compare_traces,analyze_session,resolve_component_context");
  expect(parsed.args).toContain("read,grep,find,ls,search_traces,get_trace,summarize_trace,compare_traces,analyze_session,resolve_component_context");
  expect(parsed.skills).toContain(`${process.cwd()}/skills/exploring-execution-evidence`);
  expect(parsed.skills).toContain(`${process.cwd()}/skills/context-building`);
});

test("rejects caller tool overrides for front-matter-authoritative roles", async () => {
  const result = await runLauncher([
    "--agent", "agents/execution-advisor/agent.md",
    "--task", "Inspect bounded execution evidence.",
    "--cwd", process.cwd(),
    "--caller", "user",
    "--tools", "read,analyze_session",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(1);
  expect(result.stderr).toContain("--tools is not accepted");
});

test("rejects no-tools overrides for front-matter-authoritative roles", async () => {
  const result = await runLauncher([
    "--agent", "agents/execution-advisor/agent.md",
    "--task", "Inspect bounded execution evidence.",
    "--cwd", process.cwd(),
    "--caller", "user",
    "--no-tools",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(1);
  expect(result.stderr).toContain("--no-tools is not accepted");
});

test("rejects unsupported declared tools before launch", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-tools-test-"));
  try {
    const agent = join(dir, "agent.md");
    writeFileSync(agent, ["---", "name: execution-advisor", "mode: subagent", "tools: read,unknown_tool", "---", "Return ok."].join("\n"));
    const result = await runLauncher([
      "--agent", agent, "--task", "Tool declaration test.", "--cwd", process.cwd(), "--caller", "user", "--dry-run",
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("unsupported tools unknown_tool");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("uses an explicit empty tool set when declaration is missing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-tools-missing-test-"));
  try {
    const agent = join(dir, "agent.md");
    writeFileSync(agent, ["---", "name: execution-advisor", "mode: subagent", "---", "Return ok."].join("\n"));
    const result = await runLauncher([
      "--agent", agent, "--task", "Tool declaration test.", "--cwd", process.cwd(), "--caller", "user", "--dry-run",
    ]);
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.tools).toBe(null);
    expect(parsed.args).toContain("--no-tools");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("rejects empty declared tools before launch", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-tools-empty-test-"));
  try {
    const agent = join(dir, "agent.md");
    writeFileSync(agent, ["---", "name: execution-advisor", "mode: subagent", "tools: []", "---", "Return ok."].join("\n"));
    const result = await runLauncher([
      "--agent", agent, "--task", "Tool declaration test.", "--cwd", process.cwd(), "--caller", "user", "--dry-run",
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("tools declaration is empty");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("evidence-validator safety profile is independent of caller metadata", async () => {
  const result = await runLauncher([
    "--agent", "agents/evidence-validator/agent.md",
    "--task", "Capability-based read-only validation.",
    "--cwd", process.cwd(),
    "--caller", "untrusted-role",
    "--dry-run",
  ]);
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls,git_inspect");
  expect(parsed.worktree).toBe(false);
  expect(parsed.sessionPath).toBe(null);
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
  expect(parsed.agent).toContain("as-is/agent.md");
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

test("child commit handoff is explicitly pending parent integration", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-handoff-test-"));
  try {
    const stubPi = join(dir, "pi-commit-stub.sh");
    writeFileSync(stubPi, [
      "#!/usr/bin/env bash",
      "git config user.email test@example.invalid",
      "git config user.name test",
      "printf '\\n// handoff fixture\\n' >> skills/as-is/scripts/orient.ts",
      "git add skills/as-is/scripts/orient.ts",
      "git commit --allow-empty -m 'test: child handoff' >/dev/null",
      "exit 0",
      "",
    ].join("\n"), { mode: 0o755 });
    const registry = join(dir, "jobs.jsonl");
    const result = await runLauncher(
      ["--agent", AGENT, "--task", "Child handoff task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach"],
      { ...process.env, AS_IS_JOBS_REGISTRY: registry },
    );
    expect(result.exitCode).toBe(0);
    const handle = JSON.parse(result.stdout);
    expect(await pidGone(handle.pid, 5000)).toBe(true);
    await new Promise((resolveDone) => setTimeout(resolveDone, 100));
    const finished = readRegistryLines(registry).find(
      (line) => (line as { jobId?: string }).jobId === handle.jobId && (line as { event?: string }).event === "finished",
    ) as { jobId: string; recordPath: string | null; callerCwd: string; worktreePath: string | null; baseSha: string | null; committed: boolean; integrationStatus: string; commitSha: string | null } | undefined;
    expect(finished?.jobId).toBe(handle.jobId);
    expect(finished?.callerCwd).toBe(process.cwd());
    expect(finished?.worktreePath).toContain("worktree");
    expect(finished?.baseSha).toBeTruthy();
    expect(finished?.committed).toBe(true);
    expect(finished?.commitSha).toBeTruthy();
    expect(finished?.integrationStatus).toBe("pending-parent-integration");
    const jobs = await runLauncher(["--jobs"], { ...process.env, AS_IS_JOBS_REGISTRY: registry });
    expect(jobs.stdout).toContain("pending-parent-integration");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

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
    ) as { jobId: string; recordPath: string | null; callerCwd: string; worktreePath: string | null; baseSha: string | null; exitCode: number; budgetStopped: boolean; budgetStopElapsedMs: number | null; wallClockSeconds: number; childPid: number; phaseTimings: Record<string, number> } | undefined;
    expect(finished).toBeDefined();
    expect(finished!.jobId).toBe(handle.jobId);
    expect(finished!.callerCwd).toBe(process.cwd());
    expect(finished!.worktreePath).toContain("worktree");
    expect(finished!.baseSha).toBeTruthy();
    expect(finished!.phaseTimings["child-spawn"]).toBeGreaterThanOrEqual(0);
    expect(finished!.phaseTimings["child-wait"]).toBeGreaterThanOrEqual(0);
    expect(finished!.phaseTimings.total).toBeGreaterThanOrEqual(finished!.phaseTimings["child-wait"]);
    expect(finished!.exitCode).toBe(0);
    expect(finished!.budgetStopped).toBe(false);
    expect(finished!.budgetStopElapsedMs).toBeNull();
    expect(typeof finished!.wallClockSeconds).toBe("number");
    expect(finished!.childPid).toBeGreaterThan(0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("budget stop records the stop boundary and phase timing", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-budget-stop-test-"));
  try {
    const stubPi = writeSleepStub(dir, 30);
    const registry = join(dir, "jobs.jsonl");
    const result = await runLauncher([
      "--agent", AGENT, "--task", "Budget diagnostic task.", "--cwd", process.cwd(),
      "--pi", stubPi, "--budget-wall-clock-seconds", "1", "--detach",
    ], { ...process.env, AS_IS_JOBS_REGISTRY: registry });
    expect(result.exitCode).toBe(0);
    const handle = JSON.parse(result.stdout);
    expect(await pidGone(handle.pid, 9000)).toBe(true);
    const finished = readRegistryLines(registry).find(
      (line) => (line as { jobId?: string }).jobId === handle.jobId && (line as { event?: string }).event === "finished",
    ) as { budgetStopped: boolean; budgetStopElapsedMs: number | null; phaseTimings: Record<string, number> } | undefined;
    expect(finished?.budgetStopped).toBe(true);
    expect(finished?.budgetStopElapsedMs).toBeGreaterThanOrEqual(900);
    expect(finished?.budgetStopElapsedMs).toBeLessThan(4000);
    expect(finished?.phaseTimings["budget-stop"]).toBe(finished?.budgetStopElapsedMs);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 15000);

test("budget stop remains authoritative when a child outlives the deadline", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-late-success-test-"));
  try {
    const stubPi = join(dir, "pi-late-success-stub.sh");
    writeFileSync(stubPi, [
      "#!/usr/bin/env bash",
      "trap '' TERM",
      "end=$((SECONDS + 2))",
      "while [ $SECONDS -lt $end ]; do :; done",
      "printf 'late child marker\\n' >> budget-marker.txt",
      "git add budget-marker.txt",
      "git config user.email test@example.invalid",
      "git config user.name test",
      "git commit --quiet -m 'test: late child result'",
      "exit 0",
      "",
    ].join("\\n"), { mode: 0o755 });
    const registry = join(dir, "jobs.jsonl");
    const result = await runLauncher([
      "--agent", AGENT, "--task", "Late success budget diagnostic.", "--cwd", process.cwd(),
      "--pi", stubPi, "--budget-wall-clock-seconds", "1", "--detach",
    ], { ...process.env, AS_IS_JOBS_REGISTRY: registry });
    expect(result.exitCode).toBe(0);
    const handle = JSON.parse(result.stdout);
    expect(await pidGone(handle.pid, 9000)).toBe(true);
    const finished = readRegistryLines(registry).find(
      (line) => (line as { jobId?: string }).jobId === handle.jobId && (line as { event?: string }).event === "finished",
    ) as { exitCode: number; budgetStopped: boolean; budgetStopElapsedMs: number | null; committed: boolean; integrationStatus: string; phaseTimings: Record<string, number> } | undefined;
    expect(finished?.budgetStopped).toBe(true);
    expect(finished?.budgetStopElapsedMs).toBeGreaterThanOrEqual(900);
    expect(finished?.exitCode).not.toBe(0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 15000);

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

test("handoff eligibility is fail-closed for every completion gate", () => {
  const complete: HandoffFacts = {
    record: { durable: true, status: "completed", validationEvidence: true, expertEvidence: true, resultEvidence: true },
    descendants: { allTerminal: true, failedOrCancelledAccounted: true },
    commit: { sha: "abc", exists: true, scoped: true },
    integration: { status: "integrated", callerHeadAncestry: true },
  };
  expect(evaluateHandoffEligibility(complete)).toEqual({ eligible: true, blockers: [] });
  const cases: Array<[keyof HandoffFacts | "integration", string]> = [
    ["record", "record-not-completed"],
    ["record", "validation-evidence-missing"],
    ["record", "expert-evidence-missing"],
    ["record", "result-evidence-missing"],
    ["descendants", "descendants-not-terminal"],
    ["descendants", "descendants-not-accounted"],
    ["commit", "scoped-commit-missing"],
    ["commit", "commit-out-of-scope"],
    ["integration", "caller-ancestry-unverified"],
  ];
  for (const [part, blocker] of cases) {
    const facts = structuredClone(complete);
    if (part === "record") {
      if (blocker === "record-not-completed") facts.record.status = "pending-parent-integration";
      if (blocker === "validation-evidence-missing") facts.record.validationEvidence = false;
      if (blocker === "expert-evidence-missing") facts.record.expertEvidence = false;
      if (blocker === "result-evidence-missing") facts.record.resultEvidence = false;
    } else if (part === "descendants") {
      if (blocker === "descendants-not-terminal") facts.descendants.allTerminal = false;
      else facts.descendants.failedOrCancelledAccounted = false;
    } else if (part === "commit") {
      if (blocker === "scoped-commit-missing") { facts.commit.sha = null; facts.commit.exists = false; }
      else facts.commit.scoped = false;
    } else {
      facts.integration = { status: "unreachable", callerHeadAncestry: false };
    }
    expect(evaluateHandoffEligibility(facts).eligible).toBe(false);
    expect(evaluateHandoffEligibility(facts).blockers).toContain(blocker);
  }
  const pending = evaluateHandoffEligibility({ ...complete, integration: { status: "pending-parent-integration", callerHeadAncestry: false } });
  expect(pending.eligible).toBe(false);
  expect(pending.blockers).toContain("pending-parent-integration");
});

test("integration status distinguishes an unreachable child commit", () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-unreachable-test-"));
  const git = (args: string[]) => spawnSync("git", args, { cwd: dir, encoding: "utf8" });
  try {
    expect(git(["init", "-q"]).status).toBe(0);
    git(["config", "user.email", "test@example.invalid"]);
    git(["config", "user.name", "test"]);
    writeFileSync(join(dir, "base.txt"), "base\n");
    expect(git(["add", "."]).status).toBe(0);
    expect(git(["commit", "-qm", "base"]).status).toBe(0);
    const unreachableSha = "0".repeat(40);
    expect(spawnSync(Bun.which("bun") ?? "bun", ["-e", `import { integrationStatusFor } from ${JSON.stringify(join(process.cwd(), "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts"))}; console.log(integrationStatusFor(${JSON.stringify(unreachableSha)}, ${JSON.stringify(dir)}));`], { encoding: "utf8" }).stdout.trim()).toBe("unreachable");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("--jobs reports an exit-0 job as incomplete without handoff evidence", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-jobs-test-"));
  try {
    const stubPi = writeSleepStub(dir, 0);
    const registry = join(dir, "jobs.jsonl");
    const env = { ...process.env, AS_IS_JOBS_REGISTRY: registry };
    // A hermetic temp record with a distinctive status so the record-join is
    // provably exercised (proc-status completed, record-status blocked).
    const recordPath = join(dir, "tasks.md");
    writeFileSync(join(dir, "as-is.md"), "# Temp component\n");
    writeFileSync(join(dir, "as-is.json"), JSON.stringify({
      configuration: { records: { filenames: { task: "tasks.md" } } },
      task: { status: "blocked", worker: "component-builder", updated: "2026-07-28T02:30:00Z", constraints: {}, acceptance: ["Fixture."] },
    }));
    writeFileSync(recordPath, "# Temp task\n");
    const launched = await runLauncher(
      ["--agent", AGENT, "--task", "Jobs status task.", "--cwd", process.cwd(), "--pi", stubPi, "--detach", "--record", recordPath],
      env,
    );
    if (launched.exitCode !== 0) throw new Error(`${launched.stderr}\n${launched.stdout}`);
    const handle = JSON.parse(launched.stdout);
    const supervisorDone = await pidGone(handle.pid, 5000);
    expect(supervisorDone).toBe(true);

    const jobs = await runLauncher(["--jobs"], env);
    expect(jobs.exitCode).toBe(0);
    expect(jobs.stdout).toContain(handle.jobId);
    expect(jobs.stdout).toContain("incomplete"); // exit 0 is not sufficient for handoff completion
    expect(jobs.stdout).toContain("blocked");     // record-status joined from the temp record
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// The critical isolation property: a child that runs a destructive git command
// (here `git restore` of a tracked file) must NOT affect the caller's working
// tree, because the child runs in its own pruned worktree. This directly tests
// the incident where a subagent's `git restore` destroyed uncommitted work.
test("detached delegation emits bounded lifecycle spans for success and budget-stop", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-delegation-trace-test-"));
  try {
    const traceFile = join(dir, "trace.jsonl");
    const registry = join(dir, "jobs.jsonl");
    const successStub = writeSleepStub(dir, 0);
    const env = { ...process.env, AS_IS_JOBS_REGISTRY: registry, AS_IS_COMPONENT_BUILD_TRACER: "file", AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: traceFile };
    const success = await runLauncher([
      "--agent", AGENT, "--task", "Lifecycle success.", "--cwd", process.cwd(), "--pi", successStub,
      "--detach", "--no-worktree", "--caller", "as-is", "--parent-job-id", "parent-opaque",
    ], env);
    expect(success.exitCode).toBe(0);
    const successHandle = JSON.parse(success.stdout);
    expect(await pidGone(successHandle.pid, 5000)).toBe(true);
    const failureStub = join(dir, "pi-failure-stub.sh");
    writeFileSync(failureStub, "#!/usr/bin/env bash\nexit 7\n", { mode: 0o755 });
    const failure = await runLauncher([
      "--agent", AGENT, "--task", "Lifecycle failure.", "--cwd", process.cwd(), "--pi", failureStub,
      "--detach", "--no-worktree", "--caller", "as-is",
    ], env);
    const failureHandle = JSON.parse(failure.stdout);
    expect(await pidGone(failureHandle.pid, 5000)).toBe(true);
    const budgetStub = writeSleepStub(dir, 30);
    const budget = await runLauncher([
      "--agent", AGENT, "--task", "Lifecycle budget stop.", "--cwd", process.cwd(), "--pi", budgetStub,
      "--detach", "--no-worktree", "--caller", "as-is", "--budget-wall-clock-seconds", "1",
    ], env);
    const budgetHandle = JSON.parse(budget.stdout);
    expect(await pidGone(budgetHandle.pid, 9000)).toBe(true);
    await new Promise((resolveDone) => setTimeout(resolveDone, 150));
    const events = readFileSync(traceFile, "utf8").trim().split("\n").map((line) => JSON.parse(line));
    const delegations = events.filter((event) => event.name === "delegation.lifecycle");
    const workers = events.filter((event) => event.name === "worker.lifecycle");
    expect(delegations).toHaveLength(3);
    expect(workers).toHaveLength(3);
    for (const worker of workers) {
      const delegation = delegations.find((event) => event.spanId === worker.parentSpanId);
      expect(delegation).toBeDefined();
      expect(worker.traceId).toBe(delegation?.traceId);
      expect(worker.attributes.workerRole).toBe("as-is");
      expect(Object.keys(worker.attributes).sort()).toEqual(["outcome", "outcomeClass", "workerRole"]);
    }
    const successSpan = delegations.find((event) => event.attributes.outcomeClass === "success");
    const failureSpan = delegations.find((event) => event.attributes.outcomeClass === "failure");
    const stoppedSpan = delegations.find((event) => event.attributes.outcomeClass === "budget-stopped");
    expect(successSpan?.attributes.parentJobId).toBe("parent-opaque");
    expect(successSpan?.attributes.handoffClass).toBe("not-committed");
    expect(failureSpan?.attributes.outcomeClass).toBe("failure");
    expect(stoppedSpan?.attributes.outcomeClass).toBe("budget-stopped");
    expect(workers.find((event) => event.attributes.outcomeClass === "success")?.attributes.outcome).toBe("success");
    expect(workers.find((event) => event.attributes.outcomeClass === "failure")?.attributes.outcome).toBe("failure");
    expect(workers.find((event) => event.attributes.outcomeClass === "budget-stopped")?.attributes.outcome).toBe("failure");
    expect(successSpan?.traceId).toBeTruthy();
    expect(successSpan?.parentSpanId).toBeTruthy();
    expect(events.some((event) => event.name === "session.lifecycle")).toBe(true);
    expect(events.some((event) => event.name === "session.lifecycle" && event.attributes.launcherMode === "detach")).toBe(true);
    expect(events.every((event) => !JSON.stringify(event).includes("Lifecycle success") && !JSON.stringify(event).includes("Lifecycle failure") && !JSON.stringify(event).includes("Lifecycle budget"))).toBe(true);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 15000);

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

// The preservation property: a child that exits cleanly (exit 0) WITHOUT
// committing its work must leave the worktree in place for recovery. This
// directly tests the incident where a subagent obeyed "do not commit", exited 0,
// and the supervisor destroyed its uncommitted work on clean-exit cleanup.
test("worktree preservation: uncommitted work on clean exit is preserved", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-preserve-test-"));
  let handle: { worktreePath?: string } | undefined;
  try {
    // A stub pi that creates an untracked file in the worktree (leaving it
    // dirty) and exits 0 without committing.
    const stubPi = join(dir, "pi-dirty-stub.sh");
    writeFileSync(stubPi, [
      "#!/usr/bin/env bash",
      "# Simulate an agent that does work but exits without committing.",
      "mkdir -p skills/as-is/scripts",
      "echo 'unfinished work' > skills/as-is/scripts/scratch.ts",
      "exit 0",
      "",
    ].join("\n"), { mode: 0o755 });

    const registry = join(dir, "jobs.jsonl");
    const result = await runLauncher([
      "--agent", AGENT,
      "--task", "Uncommitted-work stub.",
      "--cwd", process.cwd(),
      "--pi", stubPi,
      "--detach",
    ], { ...process.env, AS_IS_JOBS_REGISTRY: registry });
    expect(result.exitCode).toBe(0);
    handle = JSON.parse(result.stdout) as { worktreePath?: string };
    expect(handle.worktreePath).toBeTruthy();

    const done = await pidGone(handle.pid, 5000);
    expect(done).toBe(true);

    // The worktree must still exist (preserved for recovery), and contain the
    // uncommitted file the stub created.
    expect(existsSync(handle.worktreePath)).toBe(true);
    const scratch = join(handle.worktreePath, "skills/as-is/scripts/scratch.ts");
    expect(existsSync(scratch)).toBe(true);
    expect(readFileSync(scratch, "utf8")).toContain("unfinished work");

    // The completion line must record worktreePreserved with a reason.
    const finished = readRegistryLines(registry).find(
      (line) => (line as { jobId?: string }).jobId === handle.jobId
        && (line as { event?: string }).event === "finished",
    ) as { exitCode: number; committed: boolean; worktreePreserved: boolean; preserveReason?: string } | undefined;
    expect(finished).toBeDefined();
    expect(finished!.exitCode).toBe(0);
    expect(finished!.committed).toBe(false);
    expect(finished!.worktreePreserved).toBe(true);
    expect(finished!.preserveReason).toContain("uncommitted");

    // --jobs must surface the preserved worktree as a recovery candidate.
    const jobs = await runLauncher(["--jobs"], { ...process.env, AS_IS_JOBS_REGISTRY: registry });
    expect(jobs.stdout).toContain(handle.jobId);
    expect(jobs.stdout).toContain("preserved");
    expect(jobs.stdout).toContain(handle.worktreePath);
  } finally {
    // The supervisor intentionally preserves the worktree for this test; clean
    // it up via git so the suite leaves no dangling worktrees.
    if (handle?.worktreePath) {
      try { spawnSync("git", ["worktree", "remove", "--force", handle.worktreePath], { stdio: "ignore" }); } catch { /* best-effort */ }
    }
    rmSync(dir, { recursive: true, force: true });
  }
}, 15000);



test("caller-worktree ancestry distinguishes pending integration from integrated", () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-ancestry-test-"));
  const git = (args: string[]) => spawnSync("git", args, { cwd: dir, encoding: "utf8" });
  try {
    expect(git(["init", "-q"]).status).toBe(0);
    git(["config", "user.email", "test@example.invalid"]); git(["config", "user.name", "test"]);
    writeFileSync(join(dir, "base.txt"), "base\n"); git(["add", "."]); git(["commit", "-qm", "base"]);
    writeFileSync(join(dir, "child.txt"), "child\n"); git(["add", "."]); git(["commit", "-qm", "child"]);
    const childSha = git(["rev-parse", "HEAD"]).stdout.trim();
    const callerSha = git(["rev-parse", "HEAD~1"]).stdout.trim();
    expect(git(["merge-base", "--is-ancestor", childSha, "HEAD"]).status).toBe(0);
    expect(git(["reset", "--hard", callerSha]).status).toBe(0);
    expect(git(["merge-base", "--is-ancestor", childSha, "HEAD"]).status).not.toBe(0);
    expect(git(["cherry-pick", childSha]).status).toBe(0);
    expect(git(["merge-base", "--is-ancestor", childSha, "HEAD"]).status).toBe(0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
