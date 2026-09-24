// QR2 scored-run driver (Gate 4 authorized). Usage: bun run-scored.ts baseline|candidate <outDir>
// Runs ALL phases F0-F5 on a fresh seed. Arm result + surface snapshot hash recorded in arm-result.json.
import { mkdirSync, writeFileSync, existsSync, readFileSync, cpSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { runArm, candidateAdapter, baselineAdapter } from "./run-arm.ts";

const arm = process.argv[2];
const outDir = resolve(process.argv[3] ?? `/tmp/qr2-scored/${arm}`);
if (arm !== "baseline" && arm !== "candidate") throw new Error("arm must be baseline|candidate");
if (existsSync(outDir)) throw new Error(`refusing to overwrite existing scored dir: ${outDir}`);
mkdirSync(outDir, { recursive: true });

// Surface snapshot for the baseline arm: delegation-relevant files at repo state c511642.
const surface = {
  commit: "c511642",
  files: ["AGENTS.md", "agents/AGENTS.md", "as-is.md", "agents/worker/agent.md", "agents/expert/agent.md", "agents/evidence-validator/agent.md", "agents/component-builder/agent.md", "agents/thinking-companion/agent.md"] as string[],
};
let surfaceHash = "";
if (arm === "baseline") {
  const repo = "/home/vc/dev/as-is";
  const snapDir = join(outDir, "surface-snapshot");
  mkdirSync(snapDir, { recursive: true });
  for (const f of surface.files) {
    const src = join(repo, f);
    if (!existsSync(src)) continue;
    const dst = join(snapDir, f);
    mkdirSync(join(dst, ".."), { recursive: true });
    cpSync(src, dst);
  }
  const manifest = surface.files.map((f) => { const p = join(snapDir, f); return `${f}:${existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16) : "MISSING"}`; }).join("\n");
  surfaceHash = createHash("sha256").update(manifest).digest("hex");
  writeFileSync(join(snapDir, "SNAPSHOT.txt"), `source: ${repo} @ ${surface.commit}\n${manifest}\nsurface-hash: ${surfaceHash}\n`);
}

// Optional 4th arg: explicit candidate instruction path (e.g. frozen B2).
const instructionPath = arm === "candidate" && process.argv[4]
  ? resolve(process.argv[4])
  : resolve(import.meta.dir, "../candidate-instruction.md");
const adapter = arm === "candidate"
  ? candidateAdapter(instructionPath)
  : baselineAdapter(join(outDir, "surface-snapshot"));

console.log(`[scored] arm=${arm} out=${outDir} surface=${surfaceHash || "n/a"} starting ${new Date().toISOString()}`);
const result = await runArm({ run: `scored-${Date.now()}`, adapter, fixtureSpecPath: resolve(import.meta.dir, "../fixture/fixture-spec.md"), outDir });
result.surfaceSnapshot = { commit: surface.commit, hash: surfaceHash, files: surface.files };
writeFileSync(join(outDir, "arm-result.json"), JSON.stringify(result, null, 1));
console.log(`[scored] finished: spend $${result.spendUsd.toFixed(4)} wall ${result.wallClockMin}min`);
for (const ph of result.phaseScores ?? []) {
  console.log(`[scored] ${ph.phase}: score ${ph.score.total}/5 (b${ph.score.behavior} bo${ph.score.boundary} r${ph.score.records}) spend $${ph.spendUsd?.toFixed(4)}`);
  for (const gat of ph.result?.gates ?? []) if (!gat.pass) console.log(`   ${gat.hard ? "FAIL(HARD)" : "FAIL      "} ${gat.gate}: ${String(gat.detail).slice(0, 140)}`);
}
