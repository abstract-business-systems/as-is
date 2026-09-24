// QR2 machinery smoke test: exercises the full session path with the real preset at
// minimal cost — manifest freeze, delegation, child session, telemetry, handoff, checkpoint,
// per-session cost attribution through the proxy. NOT scored; discardable.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { MachineryProxy } from "./proxy.ts";
import { Supervisor, snapshotTree } from "./supervisor.ts";
import { writeSeed } from "./seed.ts";
import { candidateAdapter } from "./run-arm.ts";
import { bindSupervisor } from "./checkers.ts";

const OUT = "/tmp/qr2-smoke";
const ws = join(OUT, "workspace");
const runsDir = join(OUT, "runs");
mkdirSync(runsDir, { recursive: true });
writeSeed(ws, resolve(import.meta.dir, "../fixture/fixture-spec.md"));

const proxy = new MachineryProxy();
const proxyPort = await proxy.start();
const budgetFor = () => ({ phaseRemainingUsd: 0.5, armRemainingUsd: 0.5 });

const adapter = candidateAdapter(resolve(import.meta.dir, "../instructions/candidate-b2.md"));
// Smoke override: the full instruction is long; keep it but the task below is trivial.
const sv = new Supervisor(ws, runsDir, proxyPort,
  join(import.meta.dir, "pi-runtime/pkg/node_modules/@earendil-works/pi-coding-agent/dist/cli.js"),
  adapter as any, budgetFor,
  (token: string, tag: any, phase: string) => {
    proxy.registerSession(token, tag, () => budgetFor(phase), () => {});
  },
  () => {}, "smoke", "SMOKE");
bindSupervisor(sv);
await sv.start();

const rootTask = `SMOKE TASK (machinery verification, not the benchmark):
1. Call freeze_manifest with a valid manifest covering ALL required roles listed in HARNESS.md (subtrees disjoint, every role with level, parent, subtree, record, impl, tests, children), PLUS one extra child role:
   - helper: level 1, parent "composition-root", subtree "src/helper", record "src/helper/record.md", impl ["src/helper/util.py"], tests [], children []
   (add helper to composition-root's children; admin artifact classes and entrypoint per HARNESS.md; entrypoint: "src/root/main.py")
2. Delegate a child: delegate(component "helper", role "implement", task "Create src/helper/util.py containing a function add(a,b) returning a+b. Then write your handoff to .harness/handoffs/<your-session-id>.md with the fields from FIXTURE-SPEC section 5 (you may keep them brief).")
3. Observe the child with observe(session_id). Read its handoff file.
4. Create one checkpoint labeled "smoke-checkpoint".
5. Write src/root/main.py with a main() that prints "ok", and your own handoff to .harness/handoffs/<your-session-id>.md.
Finish promptly once done.`;

const root = sv.spawnSession({ component: "composition-root", execRole: "root" as any, task: rootTask, modelOverride: null, thinkingOverride: null, phase: "SMOKE" });
const t0 = Date.now();
await sv.waitAll(8 * 60_000);

console.log("=== sessions ===");
for (const s of sv.sessions.values()) {
  console.log(s.tag.sessionId, "status:", s.status, "level:", s.tag.level, "parent:", s.tag.parentRole, "spend proxy-attributed:", s.spendUsd, "wallSec:", s.endedAt ? Math.round((s.endedAt - s.startedAt) / 1000) : "?");
}
console.log("=== manifest ===", sv.manifest ? "frozen, roles: " + Object.keys(sv.manifest.roles).join(",") : "NOT FROZEN");
console.log("=== stubs planted ===", Object.keys(sv.stubHashes).join(",") || "none");
console.log("=== checkpoints ===", sv.checkpoints.map((c) => c.id).join(",") || "none");
console.log("=== delegate log ===", sv.delegateLog.map((d) => `${d.parentSessionId}->${d.childSessionId} (${d.execRole}, resolved=${JSON.stringify(d.resolved)})`).join(" | ") || "none");
console.log("=== handoff files ===", existsSync(join(ws, ".harness", "handoffs")) ? readdirSync(join(ws, ".harness", "handoffs")).join(",") : "none");
console.log("=== tree ===", Object.keys(snapshotTree(ws)).filter((p) => !p.startsWith(".harness")).join(", "));
console.log("=== proxy cost by token ===");
for (const c of proxy.costByToken.values()) console.log(" ", c.tag.sessionId, "requests:", c.n, "real: $" + c.real.toFixed(6), "est: $" + c.est.toFixed(6));
console.log("=== root events sample ===");
console.log(sv.readEvents(root).slice(0, 12).map((e) => `${e.seq}:${e.kind}`).join(" "));
const utilPath = join(ws, "src/helper/util.py");
console.log("=== child wrote util.py ===", existsSync(utilPath) ? readFileSync(utilPath, "utf8").slice(0, 120) : "MISSING");
const handoffs = existsSync(join(ws, ".harness", "handoffs")) ? readdirSync(join(ws, ".harness", "handoffs")) : [];
let handoffOk = false;
for (const h of handoffs) {
  const c = readFileSync(join(ws, ".harness", "handoffs", h), "utf8");
  if (c.length > 50) handoffOk = true;
}
console.log("=== handoff content present ===", handoffOk);
console.log("wall:", Math.round((Date.now() - t0) / 1000) + "s", "arm spend: $" + proxy.spendArm.toFixed(4));
proxy.stop(); sv.stop();
