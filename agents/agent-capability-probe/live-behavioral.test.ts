import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = process.cwd();
const agent = resolve(root, "agents/agent-capability-probe/agent.md");
const launcher = resolve(root, "core/adapters/pi/scripts/spawn-pi-subagent.ts");
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
function events(stdout: string): Event[] {
  return stdout.split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Event]; } catch { return []; }
  });
}
function assistantText(stdout: string): string {
  const message = events(stdout).filter((event) =>
    ["message_end", "turn_end", "agent_end"].includes(event.type) &&
    event.message?.role === "assistant" && Array.isArray(event.message.content),
  ).at(-1);
  if (message) {
    return message.message.content
      .filter((part: Event) => part?.type === "text" && typeof part.text === "string")
      .map((part: Event) => part.text)
      .join("\n");
  }
  const final = events(stdout).at(-1);
  if (final) return JSON.stringify(final);
  throw new Error("Pi produced no parseable event");
}

function makeFixture(): { directory: string; record: string; before: string } {
  const directory = mkdtempSync(join(tmpdir(), "agent-capability-probe-live-"));
  const record = join(directory, "as-is.md");
  // Real .pi copy with a shim extension (round-6 arm pattern): pi's extension
  // loader fails relative imports through a symlinked .pi; a shim importing
  // the repository extension by absolute path is the proven staging pattern.
  mkdirSync(join(directory, ".pi", "extensions"), { recursive: true });
  writeFileSync(join(directory, ".pi", "settings.json"), JSON.stringify({ extensions: ["./extensions/worker-tools.ts"] }));
  writeFileSync(join(directory, ".pi", "extensions", "worker-tools.ts"), `import wt from ${JSON.stringify(join(root, ".pi", "extensions", "worker-tools.ts"))};\nexport * from ${JSON.stringify(join(root, ".pi", "extensions", "worker-tools.ts"))};\nexport default wt;\n`);
  symlinkSync(join(root, "skills"), join(directory, "skills"));
  symlinkSync(join(root, "agents"), join(directory, "agents"));
  symlinkSync(join(root, "tools"), join(directory, "tools"));
  symlinkSync(join(root, "core"), join(directory, "core"));
  writeFileSync(record, "# Probe Fixture\n\nA bounded disposable probe fixture.\n");
  writeFileSync(join(directory, "as-is.json"), JSON.stringify({ configuration: { agents: { defaultModel: "medium", provider: "openrouter", models: { medium: "@preset/abs-medium", large: "@preset/abs-large" } } } }));
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
      "--record", fixture.record, "--caller", "user", "--parent-job-id", "probe-live-parent",
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "90", "--budget-cost-usd", "0.20",
    ], { cwd: root, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => done({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

test("agent-capability-probe contract retains literal-target and one-call anchors", () => {
  const text = contract();
  expect(text).toContain("literal target role");
  expect(text).toContain("exactly once");
  expect(text).toContain("never substitute a role");
  expect(text).toContain("second call");
  expect(text).toContain("read-only");
});

test("agent-capability-probe launcher uses only its declared tools", () => {
  const result = spawnSync(Bun.which("bun") ?? "bun", [
    launcher, "--agent", agent, "--task", "Profile check.", "--cwd", root,
    "--caller", "user", "--parent-job-id", "probe-profile-parent", "--dry-run",
  ], { cwd: root, encoding: "utf8" });
  expect(result.status).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls,call_subagent");
  expect(parsed.worktree).toBe(true);
});

test.skipIf(!liveEnabled)("agent-capability-probe live calls the literal expert target once without mutation", { timeout: 150_000 }, async () => {
  const fixture = makeFixture();
  const repositoryBefore = repositoryStatus();
  try {
    const result = await runLive(
      "The literal target role is expert. Ask that exact role one bounded read-only question: explain one trade-off in choosing a familiar option when context is incomplete. Call the target exactly once, do not substitute another role, and do not edit, delegate implementation, execute actions, or commit.",
      fixture,
    );
    expect([0, 124]).toContain(result.exitCode);
    const outputEvents = events(result.stdout);
    const calls = outputEvents.filter((event) => event.type === "tool_execution_start" && event.toolName === "call_subagent");
    expect(calls).toHaveLength(1);
    const text = assistantText(result.stdout);
    expect(text).toMatch(/expert|succeed|bounded|read[- ]only|trade[- ]off|question/i);
    expect(text).not.toMatch(/commit created|implemented successfully|delegated implementation/i);
    const entries = readFileSync(join(fixture.directory, "jobs.jsonl"), "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line) as Event);
    expect(entries.filter((entry) => entry.event === "launched")).toHaveLength(1);
    expect(entries.find((entry) => entry.event === "launched")).toMatchObject({ identity: "agent-capability-probe" });
    expect(entries.some((entry) => entry.commitSha || entry.committed === true)).toBe(false);
    expect(repositoryStatus()).toBe(repositoryBefore);
    expect(digest(fixture.record)).toBe(fixture.before);
  } finally { rmSync(fixture.directory, { recursive: true, force: true }); }
});
