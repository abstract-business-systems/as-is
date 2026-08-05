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
  analysis) printf '%s\\n' '{"traceId":"trace-routing-fixture","sessionId":"opaque-session-routing","eventCount":2,"names":["session.lifecycle","delegation.lifecycle"],"rawContent":false,"privacy":"metadata-only"}' ;;
  expert) printf '%s\\n' '{"finding":"pass","evidence":["as-is role","literal route","backlog inspection","startsWork false","no component-builder delegation"],"safeToCommit":true,"residualRisk":"provider behavior not exercised"}' ;;
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

test("launches literal What's next?, analyzes bounded evidence, and validates it read-only", async () => {
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

    const analysis = output(await run(["--agent", "agents/execution-advisor/agent.md", "--task", "Analyze bounded trace/session metadata for the prior routing run.", "--cwd", root, "--pi", pi, "--no-worktree", "--no-session"], { ...baseEnv, AS_IS_STUB_MODE: "analysis" }));
    const analysisPid = readFileSync(pidFile, "utf8");
    expect(analysisPid).not.toBe(routePid);
    expect(analysis.traceId).toBe(route.traceId);
    expect(analysis.sessionId).toBe(route.sessionReference.sessionId);
    expect(analysis.rawContent).toBe(false);
    expect(analysis.privacy).toBe("metadata-only");
    expect(readFileSync(traceDir, "utf8")).not.toContain("What's next?");

    const expert = output(await run(["--agent", "agents/expert/agent.md", "--task", JSON.stringify({ evidence: analysis, expected: ["as-is", "What's next?", "backlog", "startsWork:false", "no component-builder"] }), "--cwd", root, "--pi", pi, "--caller", "component-builder", "--parent-job-id", "test-routing-parent", "--no-worktree", "--no-session"], { ...baseEnv, AS_IS_STUB_MODE: "expert" }));
    expect(expert.finding).toBe("pass");
    expect(expert.safeToCommit).toBe(true);
    expect(expert.evidence).toEqual(expect.arrayContaining(["as-is role", "literal route", "backlog inspection", "startsWork false", "no component-builder delegation"]));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

const liveIntegrationEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

test.skipIf(!liveIntegrationEnabled)("routes the exact live What's next? request and shows task or backlog context without starting work", async () => {
  const piBin = process.env.PI_BIN ?? Bun.which("pi") ?? "/shared/store/pi/bin/pi";
  const dir = mkdtempSync(join(tmpdir(), "as-is-routing-live-"));
  const registry = join(dir, "jobs.jsonl");
  const traceDir = join(dir, "trace");
  const task = "/as-is What’s next?";
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
    expect(text).toMatch(/(No actionable|none exist|when none exist|active task|blocked task|awaiting-approval)/i);
    expect(text).toMatch(/(backlog|tasks?\.md|task record)/i);
    expect(text).toMatch(/recommendation\s*[—-]\s*not authorization|recommendation,? not authorization/i);
    expect(text).toMatch(/startsWork:\s*false/i);
    expect(text).toContain("whats-next-routing");
    expect(text).toMatch(/agents\/as-is/);
    expect(text).toMatch(/Priority[\s\S]{0,8}High/i);
    expect(text).toMatch(/Dependencies:/i);
    expect(text).toMatch(/Acceptance(?: signal)?(?:\*\*)?:/i);
    expect(text).not.toContain("in-process-authority-alignment");
    expect(text).not.toMatch(/delegate|delegation|component-builder/i);

    const registryLines = readFileSync(registry, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
    expect(registryLines.some((entry: any) => entry.identity === "component-builder")).toBe(false);
    expect(registryLines.every((entry: any) => ["launched", "finished"].includes(entry.event))).toBe(true);
    const traceFiles = Bun.file(join(traceDir, "trace.jsonl"));
    const trace = (await traceFiles.exists()) ? await traceFiles.text() : "";
    expect(trace).not.toContain(task);
    expect(trace).not.toMatch(/prompt|response|sessionContent|rawContent/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
