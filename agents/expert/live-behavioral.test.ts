import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = process.cwd();
const agent = resolve(root, "agents/expert/agent.md");
const launcher = resolve(root, "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const liveEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

type Event = Record<string, any>;
type Run = { stdout: string; stderr: string; exitCode: number };

function contract(): string { return readFileSync(agent, "utf8"); }
function digest(path: string): string { return createHash("sha256").update(readFileSync(path)).digest("hex"); }
function repositoryStatus(): string {
  const result = spawnSync("git", ["status", "--porcelain=v1"], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || "git status failed");
  return result.stdout;
}

function assistantText(stdout: string): string {
  const events = stdout.split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Event]; } catch { return []; }
  });
  const message = events.filter((event) =>
    ["message_end", "turn_end", "agent_end"].includes(event.type) &&
    event.message?.role === "assistant" && Array.isArray(event.message.content),
  ).at(-1);
  if (message) {
    return message.message.content
      .filter((part: Event) => part?.type === "text" && typeof part.text === "string")
      .map((part: Event) => part.text)
      .join("\n");
  }
  const final = events.at(-1);
  if (final) return JSON.stringify(final);
  throw new Error("Pi produced no parseable event");
}

function makeFixture(): { directory: string; record: string; before: string } {
  const directory = mkdtempSync(join(tmpdir(), "expert-live-"));
  const record = join(directory, "as-is.md");
  // Real .pi copy with a shim extension (round-6 arm pattern): pi's loader
  // resolves relative extension imports through the symlink path and fails on
  // the node_modules boundary; an absolute shim import avoids that entirely.
  mkdirSync(join(directory, ".pi", "extensions"), { recursive: true });
  writeFileSync(join(directory, ".pi", "settings.json"), JSON.stringify({ extensions: ["./extensions/worker-tools.ts"] }));
  writeFileSync(join(directory, ".pi", "extensions", "worker-tools.ts"), `import wt from ${JSON.stringify(join(root, ".pi", "extensions", "worker-tools.ts"))};\nexport * from ${JSON.stringify(join(root, ".pi", "extensions", "worker-tools.ts"))};\nexport default wt;\n`);
  symlinkSync(join(root, "skills"), join(directory, "skills"));
  symlinkSync(join(root, "tools"), join(directory, "tools"));
  symlinkSync(join(root, "core"), join(directory, "core"));
  writeFileSync(record, "# Expert Fixture\n\nA bounded read-only consultation fixture.\n");
  writeFileSync(join(directory, "as-is.json"), JSON.stringify({ configuration: { agents: { defaultModel: "large", provider: "openrouter", models: { large: "@preset/abs-large" } } } }));
  return { directory, record, before: digest(record) };
}

async function runLive(task: string, fixture: { directory: string; record: string }): Promise<Run> {
  const childEnv = { ...process.env, AS_IS_JOBS_REGISTRY: join(fixture.directory, "jobs.jsonl"), AS_IS_COMPONENT_BUILD_TRACER: "disabled" };
  delete childEnv.AS_IS_IDENTITY;
  delete childEnv.AS_IS_JOB_ID;
  return await new Promise((done) => {
    const child = spawn(Bun.which("bun") ?? "bun", [
      launcher, "--agent", agent, "--task", task, "--cwd", fixture.directory,
      "--pi", process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi",
      "--record", fixture.record, "--caller", "user", "--parent-job-id", "expert-live-parent",
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "60", "--budget-cost-usd", "0.10",
    ], { cwd: root, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => done({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

test("expert contract retains the exact advisory read-only boundary", () => {
  const text = contract();
  expect(text).toContain("advisory and read-only");
  expect(text).toContain("consulting-humans");
  expect(text).toContain("Do not edit");
  expect(text).toContain("Do not");
});

test("expert launcher uses the declared bounded profile", () => {
  const result = spawnSync(Bun.which("bun") ?? "bun", [
    launcher, "--agent", agent, "--task", "Profile check.", "--cwd", root,
    "--caller", "user", "--parent-job-id", "expert-profile-parent", "--dry-run",
  ], { cwd: root, encoding: "utf8" });
  expect(result.status).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls,resolve_component_context");
  expect(parsed.worktree).toBe(true);
});

test.skipIf(!liveEnabled)("expert live consultation is bounded, advisory, and non-mutating", { timeout: 120_000 }, async () => {
  const fixture = makeFixture();
  const repositoryBefore = repositoryStatus();
  try {
    const result = await runLive(
      "Provide one concise, bounded second perspective on whether a familiar option should be chosen without more context. Separate observation from uncertainty and recommendation. Do not decide for the human, edit files, delegate, execute actions, or commit.",
      fixture,
    );
    expect([0, 124]).toContain(result.exitCode);
    const text = assistantText(result.stdout);
    expect(text).toMatch(/advis|read[- ]only|context|uncertain|recommend|perspective/i);
    expect(text).not.toMatch(/I have decided|you must choose|commit created|implemented successfully/i);
    const entries = readFileSync(join(fixture.directory, "jobs.jsonl"), "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line) as Event);
    expect(entries.filter((entry) => entry.event === "launched")).toHaveLength(1);
    expect(entries.find((entry) => entry.event === "launched")).toMatchObject({ identity: "expert" });
    expect(entries.some((entry) => entry.commitSha || entry.committed === true)).toBe(false);
    expect(repositoryStatus()).toBe(repositoryBefore);
    expect(digest(fixture.record)).toBe(fixture.before);
  } finally { rmSync(fixture.directory, { recursive: true, force: true }); }
});
