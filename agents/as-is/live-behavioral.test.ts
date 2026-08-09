import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const launcher = "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts";
const liveEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

type Run = { stdout: string; stderr: string; exitCode: number };

type Event = Record<string, any>;

function repositoryStatus(): string {
  const result = spawnSync("git", ["status", "--porcelain=v1"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || "git status failed");
  return result.stdout;
}

async function runAsIs(task: string, directory: string, caller?: string): Promise<Run> {
  const pi = process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi";
  const args = [
    launcher,
    "--agent", "agents/as-is/agent.md",
    "--task", task,
    "--cwd", root,
    "--pi", pi,
    "--no-worktree",
    "--no-session",
    "--budget-wall-clock-seconds", "45",
    "--budget-cost-usd", "0.10",
    "--caller", caller ?? "user",
    ...(caller ? ["--parent-job-id", "live-as-is-behavior"] : []),
  ];
  const childEnv = {
    ...process.env,
    AS_IS_JOBS_REGISTRY: join(directory, "jobs.jsonl"),
    AS_IS_COMPONENT_BUILD_TRACER: "file",
    AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: join(directory, "trace"),
  };
  delete childEnv.AS_IS_IDENTITY;
  delete childEnv.AS_IS_JOB_ID;
  return await new Promise((resolve) => {
    const child = spawn(Bun.which("bun") ?? "bun", args, {
      cwd: root,
      env: childEnv,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

function behavioralOutput(result: Run): { text: string; events: Event[] } {
  expect([0, 124]).toContain(result.exitCode);
  const events = result.stdout.trim().split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Event]; } catch { return []; }
  });
  const assistant = events.filter((event) =>
    ["message_end", "turn_end", "agent_end"].includes(event.type) &&
    event.message?.role === "assistant" && Array.isArray(event.message.content),
  ).at(-1);
  if (assistant) {
    const text = assistant.message.content
      .filter((part: Event) => part?.type === "text" && typeof part.text === "string")
      .map((part: Event) => part.text)
      .join("\n");
    return { text, events };
  }
  const final = events.at(-1);
  if (final) return { text: JSON.stringify(final), events };
  throw new Error(`Pi produced no parseable JSON events: ${result.stderr}`);
}

function registryEntries(directory: string): Event[] {
  const path = join(directory, "jobs.jsonl");
  try {
    return readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

function expectNoDescendantLaunch(directory: string): void {
  const descendants = registryEntries(directory).filter((entry) =>
    entry.identity && entry.identity !== "as-is",
  );
  expect(descendants).toEqual([]);
}

function expectUnchanged(before: string): void {
  expect(repositoryStatus()).toBe(before);
}

test.skipIf(!liveEnabled)("as-is live direct handling stays recommendation-only and non-mutating", { timeout: 30_000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), "as-is-live-direct-"));
  const before = repositoryStatus();
  try {
    const result = await runAsIs(
      "What's next?",
      directory,
    );
    const response = behavioralOutput(result);
    expect(response.text).toMatch(/recommendation|recommend|next|task|backlog/i);
    expect(response.text).toMatch(/startsWork\s*:?\s*false|do not start|not authorization|recommendation only/i);
    expectNoDescendantLaunch(directory);
    expectUnchanged(before);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test.skipIf(!liveEnabled)("as-is live substantive routing identifies authority without starting work", { timeout: 30_000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), "as-is-live-authority-"));
  const before = repositoryStatus();
  try {
    const result = await runAsIs(
      "/as-is For a substantive cross-component launcher change, identify the best admitted authority and safest next action only. Do not implement, delegate, create a task, edit files, or claim completion.",
      directory,
    );
    const response = behavioralOutput(result);
    expect(response.text).toMatch(/authority|owner|admitted|task record/i);
    expect(response.text).toMatch(/do not|not start|recommendation|incomplete|next action/i);
    expect(response.text).not.toMatch(/implemented successfully|commit created|completed the change/i);
    expectNoDescendantLaunch(directory);
    expectUnchanged(before);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test.skipIf(!liveEnabled)("as-is live self-target request is rejected without a child", { timeout: 30_000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), "as-is-live-self-"));
  const before = repositoryStatus();
  try {
    const result = await runAsIs(
      "/as-is Do not delegate this request to as-is itself. Report the self-target rejection and do not edit, create a task, or start work.",
      directory,
      "as-is",
    );
    const response = behavioralOutput(result);
    expect(response.text).toMatch(/self|reject|cannot|not delegate|direct/i);
    expect(response.text).not.toMatch(/implemented successfully|commit created/i);
    expectNoDescendantLaunch(directory);
    expectUnchanged(before);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
