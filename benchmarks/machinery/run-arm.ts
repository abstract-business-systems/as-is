// QR2 machinery: arm runner. Drives one arm through F0-F5 (fixture-spec §4, process-spec §0/§3):
// seed -> manifest freeze -> per-phase sessions (root; F4/F5 two-part) -> deterministic gates
// -> 0-5 rubric -> immutable pre/post trees. Budget: proxy-enforced, per-phase caps + $3.00 arm ceiling.
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { MachineryProxy } from "./proxy.ts";
import { Supervisor, snapshotTree } from "./supervisor.ts";
import { writeSeed } from "./seed.ts";
import { PHASES, writePhaseArtifacts } from "./phases.ts";
import { checkPhase, bindSupervisor } from "./checkers.ts";
import { PHASE_ORDER, PHASE_BUDGETS, ARM_CEILING_USD, type ExecRole } from "./config.ts";

const PI_ENTRY = resolve(import.meta.dir, "pi-runtime/pkg/node_modules/@earendil-works/pi-coding-agent/dist/cli.js");
const ROOT_TASK_PREAMBLE = "Read .harness/task/active.md (your task) and .harness/authorization/ (your authorization). FIXTURE-SPEC.md and HARNESS.md at the workspace root are binding. Begin.";

export function candidateAdapter(instructionPath: string) {
  const instruction = readFileSync(instructionPath, "utf8");
  return {
    arm: "candidate",
    rootSystemPrompt: (_p: string) => instruction,
    childSystemPrompt: (_r: ExecRole, _c: string, _t: unknown) => instruction,
    toolsFor(kind: "root" | ExecRole): string[] {
      const base = ["read", "ls", "find", "grep", "bash", "edit", "write", "delegate", "observe", "checkpoint"];
      if (kind === "root") return [...base, "freeze_manifest"];
      if (kind === "implement") return base;
      return ["read", "ls", "find", "grep", "bash", "delegate", "observe"]; // analyze/validate: read-only intent
    },
  };
}

export function baselineAdapter(surfacePath: string) {
  const agentFile = (r: ExecRole) => {
    const map: Record<string, string> = { implement: "worker", analyze: "expert", validate: "evidence-validator" };
    const p = join(surfacePath, "agents", map[r] ?? "worker", "agent.md");
    try { return readFileSync(p, "utf8"); } catch { return "You are a bounded implementation worker. Perform only the assigned task within your own subtree; return a handoff."; }
  };
  const rootCtx = (() => {
    const parts: string[] = [];
    for (const p of ["AGENTS.md", "agents/AGENTS.md", "as-is.md"]) {
      const f = join(surfacePath, p);
      if (existsSync(f)) parts.push(`# ${p}\n${readFileSync(f, "utf8")}`);
    }
    return parts.join("\n\n");
  })();
  return {
    arm: "baseline",
    rootSystemPrompt: (_p: string) => `${rootCtx}\n\nYou operate the composition root session. Delegation uses the harness delegate/observe tools (see HARNESS.md) with the executor contracts implement/analyze/validate; the delegation configuration is .harness/delegation-config.json.`,
    childSystemPrompt: (r: ExecRole) => `${agentFile(r)}\n\nDelegation uses the harness delegate/observe tools (see HARNESS.md).`,
    toolsFor(kind: "root" | ExecRole): string[] {
      const base = ["read", "ls", "find", "grep", "bash", "edit", "write", "delegate", "observe", "checkpoint"];
      if (kind === "root") return [...base, "freeze_manifest"];
      if (kind === "implement") return base;
      return ["read", "ls", "find", "grep", "bash", "delegate", "observe"];
    },
  };
}

export async function runArm(opts: {
  run: string;
  adapter: ReturnType<typeof candidateAdapter> | ReturnType<typeof baselineAdapter>;
  fixtureSpecPath: string;
  outDir: string;
  deadlineMs?: number;
  phases?: readonly string[];
}): Promise<any> {
  const { run, adapter, outDir } = opts;
  const ws = join(outDir, "workspace");
  const runsDir = join(outDir, "runs");
  mkdirSync(runsDir, { recursive: true });
  writeSeed(ws, opts.fixtureSpecPath);

  const proxy = new MachineryProxy();
  proxy.ledgerPath = join(runsDir, "request-ledger.jsonl");
  const proxyPort = await proxy.start();
  const currentPhase = { v: "F0" };
  const budgetFor = (phase: string) => ({
    phaseRemainingUsd: PHASE_BUDGETS[phase].hardCap - (proxy.spendByPhase.get(phase) ?? 0),
    armRemainingUsd: ARM_CEILING_USD - proxy.spendArm,
  });

  const sv = new Supervisor(ws, runsDir, proxyPort, PI_ENTRY, adapter as any, budgetFor,
    (token: string, tag: any, phase: string) => {
      proxy.registerSession(token, tag, () => budgetFor(phase), (reason) => {
        const s = sv.sessions.get(token);
        if (s && s.endedAt == null) s.status = "budget-denied";
      });
    },
    () => { /* spend recorded by proxy */ },
    run, "F0");
  bindSupervisor(sv);
  await sv.start();

  const phaseResults: any[] = [];
  const armStart = Date.now();
  const phaseList = opts.phases ?? PHASE_ORDER;
  outer: for (const phase of phaseList) {
    currentPhase.v = phase;
    const plan = PHASES[phase];
    const preTree = snapshotTree(ws);
    const preHash = require("node:crypto").createHash("sha256").update(JSON.stringify(preTree)).digest("hex");
    writeFileSync(join(ws, ".harness", "pre-tree-hash.txt"), preHash + "\n");
    const phaseDir = join(runsDir, `phase-${phase}`);
    mkdirSync(phaseDir, { recursive: true });

    const parts: Array<"initial" | "resume"> = plan.stops ? ["initial", "resume"] : ["initial"];
    for (const part of parts) {
      if (part === "resume") {
        writePhaseArtifacts(ws, plan, "resume");
      } else {
        writePhaseArtifacts(ws, plan, "initial");
      }
      const rootTask = part === "resume"
        ? `${plan.stops![0].resumeTask}\n\n${ROOT_TASK_PREAMBLE}`
        : `${plan.task}\n\n${ROOT_TASK_PREAMBLE}`;
      const root = sv.spawnSession({
        component: "composition-root", execRole: "root" as any, task: rootTask,
        modelOverride: null, thinkingOverride: null, phase,
      });
      await sv.waitAll(opts.deadlineMs ?? 40 * 60_000);
      // For two-part phases, the stop must happen before the resume part begins.
    }

    // Run the arm's deterministic test entrypoint (declared in manifest).
    const m = sv.manifest;
    let testEntryResult = { ran: false, pass: false, output: "" };
    if (m?.entrypoint && existsSync(join(ws, m.entrypoint))) {
      const probe = spawnSync("python3", [join(ws, m.entrypoint)], { cwd: ws, encoding: "utf8", timeout: 120_000 });
      testEntryResult = { ran: true, pass: probe.status === 0, output: (probe.stdout ?? "") + (probe.stderr ?? "") };
      writeFileSync(join(phaseDir, "test-entry-output.txt"), testEntryResult.output);
    } else if (m?.entrypoint) {
      // entrypoint declared but path missing — try pytest-style module run
      testEntryResult = { ran: false, pass: false, output: `entrypoint ${m.entrypoint} not found in tree` };
    }

    const postTree = snapshotTree(ws);
    const postHash = require("node:crypto").createHash("sha256").update(JSON.stringify(postTree)).digest("hex");
    const check = checkPhase({
      phase, ws, preTree, postTree, testEntryResult,
      expectedSessions: expectedFor(phase),
      requireOverlap: phase === "F0" ? [["file-sink", "memory-sink"]] : [],
      requireCheckpoints: phase === "F0" ? { by: "delivery-coordinator", count: 2 } : undefined,
      recordAtCheckpoint: phase === "F0" ? [{ role: "delivery-coordinator", mustNameOnly: ["file-sink"] }] : [],
    });
    writeFileSync(join(phaseDir, "pre-tree.json"), JSON.stringify(preTree, null, 1));
    writeFileSync(join(phaseDir, "post-tree.json"), JSON.stringify(postTree, null, 1));
    writeFileSync(join(phaseDir, "check.json"), JSON.stringify(check, null, 1));
    phaseResults.push({ phase, preHash, postHash, ...check, spendUsd: proxy.spendByPhase.get(phase) ?? 0 });
    // Cascade: run all phases regardless; cap exhaustion or hard stop conditions end the arm.
    const budget = budgetFor(phase);
    if (budget.armRemainingUsd <= 0) { phaseResults.push({ phase: "ARM-STOP", reason: "arm-ceiling-exhausted" }); break outer; }
  }

  const result = {
    run, arm: adapter.arm, startedAt: new Date(armStart).toISOString(),
    finishedAt: new Date().toISOString(),
    wallClockMin: Math.round((Date.now() - armStart) / 60_000),
    spendUsd: proxy.spendArm,
    spendByPhase: Object.fromEntries(proxy.spendByPhase),
    costRetrieval: [...proxy.costByToken.values()].map((c) => ({ n: c.n, real: Number(c.real.toFixed(6)), est: Number(c.est.toFixed(6)), tag: c.tag })),
    manifest: sv.manifest,
    checkpoints: sv.checkpoints,
    delegateLog: sv.delegateLog,
    deniedLog: sv.deniedLog,
    phaseResults,
    sessions: [...sv.sessions.values()].map((s) => ({
      tag: s.tag, status: s.status, spendUsd: s.spendUsd, startedAt: s.startedAt, endedAt: s.endedAt,
      parentRole: s.tag.parentRole, level: s.tag.level, resolved: s.resolved,
    })),
  };
  writeFileSync(join(outDir, "arm-result.json"), JSON.stringify(result, null, 1));
  proxy.stop();
  sv.stop();
  return result;
}

function expectedFor(phase: string) {
  switch (phase) {
    case "F0": return [
      { component: "composition-root", level: 0, parent: null },
      { component: "delivery-coordinator", level: 1, parent: "composition-root" },
      { component: "file-sink", level: 2, parent: "delivery-coordinator" },
      { component: "memory-sink", level: 2, parent: "delivery-coordinator" },
    ];
    case "F1": return [
      { component: "composition-root", level: 0, parent: null },
      { component: "routing", level: 1, parent: "composition-root" },
      { component: "predicate-matcher", level: 2, parent: "routing" },
    ];
    case "F2": return [{ component: "composition-root", level: 0, parent: null }, { component: "routing", level: 1, parent: "composition-root" }];
    case "F3": return [
      { component: "composition-root", level: 0, parent: null },
      { component: "routing", level: 1, parent: "composition-root" },
      { component: "delivery-coordinator", level: 1, parent: "composition-root" },
    ];
    case "F4": case "F5": return [
      { component: "composition-root", level: 0, parent: null },
      { component: "delivery-coordinator", level: 1, parent: "composition-root" },
    ];
    default: return [];
  }
}