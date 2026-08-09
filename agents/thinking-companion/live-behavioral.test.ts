import { expect, test } from "bun:test";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = process.cwd();
const launcher = resolve(root, "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const agent = resolve(root, "agents/thinking-companion/agent.md");
const skill = resolve(root, "skills/human-centered-consulting/SKILL.md");
const liveEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

type Event = Record<string, any>;

test("thinking-companion contract references the reusable consulting skill", () => {
  const role = readFileSync(agent, "utf8");
  const procedure = readFileSync(skill, "utf8");
  expect(role).toContain("human-centered-consulting");
  expect(role).toContain("Preserve the person's agency");
  expect(procedure).toContain("## Option Count");
  expect(procedure).toContain("at least three and ideally five");
  expect(procedure).toContain("no more than three");
});

test("thinking-companion launcher exposes a bounded non-authoritative profile", () => {
  const result = spawnSync(Bun.which("bun") ?? "bun", [
    launcher, "--agent", agent, "--task", "Profile check.", "--cwd", root,
    "--caller", "user", "--parent-job-id", "thinking-companion-test-parent", "--dry-run",
  ], { cwd: root, encoding: "utf8" });
  expect(result.status).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.tools).toBe("read,grep,find,ls");
  expect(parsed.worktree).toBe(true);
});

function makeFixture(): { directory: string; record: string } {
  const directory = mkdtempSync(join(tmpdir(), "thinking-companion-live-"));
  const record = join(directory, "as-is.md");
  symlinkSync(join(root, ".pi"), join(directory, ".pi"));
  symlinkSync(join(root, "skills"), join(directory, "skills"));
  writeFileSync(record, `---
as-is-version: 2
config:
  agents:
    defaultModel: medium
    provider: openrouter
    models:
      medium: "@preset/abs-medium"
---
# Thinking Companion Fixture

## Purpose
A disposable read-only consultation fixture.
`);
  return { directory, record };
}

async function runLive(task: string, fixture: { directory: string; record: string }) {
  const registry = join(fixture.directory, "jobs.jsonl");
  const childEnv = { ...process.env, AS_IS_JOBS_REGISTRY: registry, AS_IS_COMPONENT_BUILD_TRACER: "disabled" };
  delete childEnv.AS_IS_IDENTITY;
  delete childEnv.AS_IS_JOB_ID;
  return await new Promise<{ stdout: string; stderr: string; exitCode: number }>((done) => {
    const child = spawn(Bun.which("bun") ?? "bun", [
      launcher, "--agent", agent, "--task", task, "--cwd", fixture.directory,
      "--pi", process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi",
      "--record", fixture.record, "--caller", "user", "--parent-job-id", "thinking-companion-live-parent",
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "60", "--budget-cost-usd", "0.10",
    ], { cwd: root, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => done({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

function assistantText(stdout: string): string {
  const events = stdout.split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Event]; } catch { return []; }
  });
  const message = events.filter((event) =>
    ["message_end", "turn_end", "agent_end"].includes(event.type) &&
    event.message?.role === "assistant" && Array.isArray(event.message.content),
  ).at(-1);
  return message?.message.content
    .filter((part: Event) => part?.type === "text" && typeof part.text === "string")
    .map((part: Event) => part.text).join("\n") ?? "";
}

test.skipIf(!liveEnabled)("thinking-companion gives concise, limitation-aware consultation", async () => {
  const fixture = makeFixture();
  try {
    const result = await runLive(
      "A human asks: Should I choose the first option just because it is familiar? Answer directly and concisely. Explain the relevant trade-off, state that the answer depends on context, and suggest one useful next question. Do not create artifacts, take actions, or decide for the human.",
      fixture,
    );
    expect([0, 124]).toContain(result.exitCode);
    expect(result.stderr).not.toMatch(/secret|token|password/i);
    const text = assistantText(result.stdout);
    expect(text).toMatch(/familiar|trade[- ]off|context|depends|consider|question|next/i);
    expect(text).not.toMatch(/I have decided|you must choose|guaranteed|certainly the best/i);
  } finally { rmSync(fixture.directory, { recursive: true, force: true }); }
});

test.skipIf(!liveEnabled)("thinking-companion limits complex alternatives and preserves agency", async () => {
  const fixture = makeFixture();
  try {
    const result = await runLive(
      "A human asks a complex, underspecified question about choosing among approaches. If you present alternatives, put only the genuinely distinct alternatives in a clearly labeled Options section and label them Option 1, Option 2, or Option 3; give no more than three. Identify an important unknown and say what should be verified before deciding. Do not pretend to be a domain professional or make the decision.",
      fixture,
    );
    expect([0, 124]).toContain(result.exitCode);
    const text = assistantText(result.stdout);
    expect(text).toMatch(/unknown|depends|verify|professional|evidence|context/i);
    expect(text).not.toMatch(/I decide|I have decided|the decision is made/i);
    const optionsSection = text.match(/(?:^|\n)\s*(?:#{1,3}\s*)?options?\s*:?[\s\S]*?(?=\n\s*#{1,3}\s+|\n\s*(?:considerations?|unknowns?|verification|next step)\s*:|$)/i)?.[0] ?? "";
    const options = optionsSection.match(/\bOption\s+[123]\b/gi) ?? [];
    expect(options.length).toBeLessThanOrEqual(3);
  } finally { rmSync(fixture.directory, { recursive: true, force: true }); }
});
