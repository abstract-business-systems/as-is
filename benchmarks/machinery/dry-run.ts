// QR2 dry-run: machinery validation on the candidate arm — F0 first (Grok-mandated scope
// for the dry exercise: F0 nested delegation/overlap/checkpoints; F4 interruption/recovery;
// F5 decision/mediation). Results are discardable; cost is real (preset) and counted.
import { resolve } from "node:path";
import { runArm, candidateAdapter } from "./run-arm.ts";

const arm = process.argv[2] ?? "candidate";
const phases = (process.argv[3] ?? "F0").split(",");
const adapter = candidateAdapter(resolve(import.meta.dir, "../instructions/candidate-b2.md"));
console.log(`[dry] starting arm=${arm} phases=${phases.join(",")} at ${new Date().toISOString()}`);
const r = await runArm({
  run: `dry-${Date.now()}`,
  adapter,
  fixtureSpecPath: resolve(import.meta.dir, "../fixture/fixture-spec.md"),
  outDir: `/tmp/qr2-dry/${arm}`,
  phases,
  deadlineMs: 30 * 60_000,
});
console.log(`[dry] finished: spend $${r.spendUsd.toFixed(4)} wall ${r.wallClockMin}min`);
for (const p of r.phaseResults) {
  console.log(`[dry] ${p.phase}: score ${p.score?.total ?? "?"}/5 (behavior ${p.score?.behavior} boundary ${p.score?.boundary} records ${p.score?.records}) spend $${(p.spendUsd ?? 0).toFixed(4)}`);
  for (const g of p.gates ?? []) if (!g.pass) console.log(`   FAIL${g.hard ? "(HARD)" : ""} ${g.gate}: ${g.detail.slice(0, 200)}`);
  for (const n of p.notes ?? []) console.log(`   note: ${n.slice(0, 200)}`);
}
