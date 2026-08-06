import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const launcher = "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts";
const root = process.cwd();
type Run = { stdout: string; stderr: string; exitCode: number };

function makePiStub(dir: string) {
  const path = join(dir, "pi-stub.sh");
  writeFileSync(path, `#!/usr/bin/env bash
printf '%s' "$$" > "$AS_IS_STUB_PID_FILE"
case "$AS_IS_STUB_MODE" in
  route) printf '%s\\n' '{"role":"as-is","request":"What'"'"'s next?","route":"backlog-inspection","backlog":{"available":true,"inspected":true,"itemId":"whats-next-routing","component":"agents/as-is","priority":"High"},"authorization":"recommendation only","startsWork":false,"delegatedTo":null,"traceId":"trace-routing-fixture","sessionReference":{"sessionId":"opaque-session-routing","store":"project-local","availability":"available"}}' ;;

esac
exit 0
`, { mode: 0o755 });
  return path;
}

async function run(args: string[], env: NodeJS.ProcessEnv): Promise<Run> {
  return await new Promise((resolve) => {
    const childEnv = { ...env };
    if (!args.includes("--caller")) { delete childEnv.AS_IS_IDENTITY; delete childEnv.AS_IS_JOB_ID; }
    const child = spawn(Bun.which("bun") ?? "bun", [launcher, ...args], { cwd: root, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

function output(runResult: Run) {
  expect(runResult.exitCode).toBe(0);
  const events = runResult.stdout.trim().split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as Record<string, any>]; } catch { return []; }
  });
  const assistantMessages = events.filter((event) =>
    ["message_end", "turn_end", "agent_end"].includes(event.type) &&
    event.message?.role === "assistant" && Array.isArray(event.message.content),
  );
  const final = assistantMessages.at(-1);
  if (final) {
    const text = final.message.content
      .filter((part: any) => part?.type === "text" && typeof part.text === "string")
      .map((part: any) => part.text)
      .join("\n");
    return { ...final, text, events };
  }
  const jsonObject = events.at(-1);
  if (jsonObject) return { ...jsonObject, events };
  throw new Error(`Pi produced no parseable JSON events (exit=${runResult.exitCode}, stdout=${runResult.stdout.length}): ${runResult.stderr}`);
}

test("launches literal What's next? through the as-is boundary without mutation", async () => {
  const dir = mkdtempSync(join(tmpdir(), "as-is-routing-process-"));
  const pidFile = join(dir, "pids");
  const traceDir = join(dir, "trace.jsonl");
  const pi = makePiStub(dir);
  const baseEnv = { ...process.env, AS_IS_STUB_PID_FILE: pidFile, AS_IS_COMPONENT_BUILD_TRACER: "file", AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: traceDir, AS_IS_TRACE_ID: "trace-routing-fixture" };
  try {
    const route = output(await run(["--agent", "agents/as-is/agent.md", "--task", "What's next?", "--cwd", root, "--pi", pi, "--no-worktree", "--no-session"], { ...baseEnv, AS_IS_STUB_MODE: "route" }));
    const routePid = readFileSync(pidFile, "utf8");
    expect(route.role).toBe("as-is");
    expect(route.request).toBe("What's next?");
    expect(route.route).toBe("backlog-inspection");
    expect(route.backlog.available).toBe(true);
    expect(route.backlog.inspected).toBe(true);
    expect(route.authorization).toContain("recommendation only");
    expect(route.startsWork).toBe(false);
    expect(route.delegatedTo).toBeNull();

    expect(readFileSync(traceDir, "utf8")).not.toContain("What's next?");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

const liveIntegrationEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

test.skipIf(!liveIntegrationEnabled)("routes the exact live What's next? request and shows task or backlog context without starting work", async () => {
  const piBin = process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi";
  const dir = mkdtempSync(join(tmpdir(), "as-is-routing-live-"));
  const registry = join(dir, "jobs.jsonl");
  const traceDir = join(dir, "trace");
  const task = "What's next?";
  try {
    const result = await run([
      "--agent", "agents/as-is/agent.md", "--task", task, "--cwd", root, "--pi", piBin,
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "45",
      "--budget-cost-usd", "0.10",
    ], {
      ...process.env,
      PI_BIN: piBin,
      AS_IS_JOBS_REGISTRY: registry,
      AS_IS_COMPONENT_BUILD_TRACER: "file",
      AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: traceDir,
    });
    const response = output(result) as Record<string, any>;
    const text = response.text as string;
    expect(text).toMatch(/(No actionable|none exist|when none exist|active task|blocked task|awaiting-approval|recommendation|startsWork:\s*false)/i);
    expect(text).toMatch(/(backlog|tasks?\.md|task record|owner|next action|open decision)/i);
    expect(text).toMatch(/recommendation\s*[—-]\s*(?:not authorization|`startsWork:\s*false`)|recommendation,? not authorization|recommendation only/i);
    expect(text).toMatch(/startsWork:\s*false|`startsWork:\s*false`/i);
    expect(text).toMatch(/(?:\*\*Next item:\*\*|\*\*Item:\*\*|\*\*Next action:\*\*|open decision|next safe action|active task)/i);
    if (/\*\*(?:Next item|Item):\*\*/i.test(text)) {
      expect(text).toMatch(/(?:\*\*Owner:\*\*|\*\*Owner\/component:\*\*) `[^`]+`/i);
      expect(text).toMatch(/(?:\*\*Bounded outcome:\*\*|bounded outcome:)/i);
      expect(text).toMatch(/\*\*Dependencies:\*\*|dependencies:/i);
      expect(text).toMatch(/\*\*Acceptance signal:\*\*|acceptance(?: signal)?:/i);
      expect(text).toMatch(/\*\*Rationale:\*\*|rationale:/i);
    }
    expect(text).not.toContain("in-process-authority-alignment");
    const registryLines = readFileSync(registry, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    expect(registryLines.some((entry: any) => entry.identity && entry.identity !== "as-is")).toBe(false);
    expect(registryLines.every((entry: any) => ["launched", "finished"].includes(entry.event))).toBe(true);
    const traceFiles = Bun.file(join(traceDir, "trace.jsonl"));
    const trace = (await traceFiles.exists()) ? await traceFiles.text() : "";
    expect(trace).not.toContain(task);
    expect(trace).not.toMatch(/prompt|response|sessionContent|rawContent/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test.skipIf(!liveIntegrationEnabled)("live direct handling does not launch a child, while substantive work stays on admitted authority", async () => {
  const piBin = process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi";
  const dir = mkdtempSync(join(tmpdir(), "as-is-capability-live-"));
  const registry = join(dir, "jobs.jsonl");
  try {
    const direct = await run([
      "--agent", "agents/as-is/agent.md", "--task", "/as-is Acknowledge this request in one concise sentence.", "--cwd", root, "--pi", piBin,
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "45", "--budget-cost-usd", "0.10",
    ], {
      ...process.env,
      PI_BIN: piBin,
      AS_IS_JOBS_REGISTRY: registry,
    });
    expect(output(direct).text).toMatch(/acknowledge|request|sentence/i);
    const directEntries = readFileSync(registry, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    expect(directEntries.some((entry: any) => entry.identity && entry.identity !== "as-is")).toBe(false);
    expect(directEntries.some((entry: any) => entry.identity === "as-is" && entry.caller === "as-is")).toBe(false);

    const substantive = await run([
      "--agent", "agents/as-is/agent.md", "--task", "/as-is Determine the owning authority for a substantive cross-component routing change.", "--cwd", root, "--pi", piBin,
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "45", "--budget-cost-usd", "0.10",
    ], {
      ...process.env,
      PI_BIN: piBin,
      AS_IS_JOBS_REGISTRY: registry,
    });
    expect([0, 124]).toContain(substantive.exitCode);
    const entries = readFileSync(registry, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    expect(entries.some((entry: any) => entry.identity && entry.identity !== "as-is")).toBe(false);
    expect(entries.some((entry: any) => entry.identity === "as-is" && entry.caller === "as-is" && entry.parentJobId !== null)).toBe(false);
    expect(output(substantive).text).toMatch(/task record|authority|authorization|blocked|incomplete|budget/i);
    expect(output(substantive).text).not.toMatch(/(?:implemented successfully|commit created|completed the change)/i);

    const selfRegistry = join(dir, "self-jobs.jsonl");
    const selfTarget = await run([
      "--agent", "agents/as-is/agent.md", "--task", "/as-is Do not delegate this request to as-is itself; report the self-target rejection.", "--cwd", root, "--pi", piBin,
      "--caller", "as-is", "--parent-job-id", "live-self-target", "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "45", "--budget-cost-usd", "0.10",
    ], {
      ...process.env,
      PI_BIN: piBin,
      AS_IS_JOBS_REGISTRY: selfRegistry,
    });
    expect(selfTarget.exitCode).toBe(0);
    const selfEntries = readFileSync(selfRegistry, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    const rootSelfEntry = selfEntries.find((entry: any) => entry.identity === "as-is" && entry.caller === "as-is");
    expect(rootSelfEntry).toBeDefined();
    expect(selfEntries.some((entry: any) => entry.identity === "as-is" && entry.caller === "as-is" && entry.parentJobId !== "live-self-target")).toBe(false);
    expect(output(selfTarget).text).toMatch(/self|reject|direct|never|not delegate/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
