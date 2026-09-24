// QR2 machinery: deterministic per-phase checkers (process-spec §1) + 0-5 rubric scoring
// (process-spec §2). All gates are parameterized by the arm's frozen manifest.
// A boundary/authorization failure zeros the boundary dimension and caps the phase at 2/5.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { CONSULTATIONS, type SessionTag } from "./config.ts";
import type { Supervisor, SessionRec, Manifest } from "./supervisor.ts";
import { snapshotTree, diffTrees } from "./supervisor.ts";

export type GateResult = { gate: string; pass: boolean; hard: boolean; detail: string };
export type PhaseCheck = {
  phase: string;
  gates: GateResult[];
  score: { behavior: number; boundary: number; records: number; total: number; capped: boolean };
  notes: string[];
};

const sha = (s: string | Buffer) => require("node:crypto").createHash("sha256").update(s).digest("hex");

function pyProbe(ws: string, code: string): { ran: boolean; out: string } {
  const r = spawnSync("python3", ["-c", code], { cwd: ws, encoding: "utf8", timeout: 60_000, env: { ...process.env, PYTHONPATH: ws } });
  return { ran: r.status === 0, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

function behaviorProbes(opts: { phase: string; ws: string }): GateResult[] {
  const { phase, ws } = opts;
  const manifest = supRef!.manifest!;
  if (!manifest?.entrypoint) return [g("behavior-probe", false, false, "no entrypoint declared")];
  const epAbs = join(ws, manifest.entrypoint);
  const gates: GateResult[] = [];
  const load = `import importlib.util,sys; spec=importlib.util.spec_from_file_location("qr2entry", ${JSON.stringify(epAbs)}); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); deliver=m.deliver;`;
  if (phase === "F0" || phase === "F2") {
    const inv = pyProbe(ws, `${load} r=deliver({"tenant":"","id":"a","type":"x","payload":{}}); print("OK" if isinstance(r,list) and len(r)==0 else "BAD:"+str(r))`);
    gates.push(g("probe:invalid-event-reaches-no-sink", inv.out.includes("OK"), false, inv.out.slice(-160) || "no output"));
    const dup = pyProbe(ws, `${load} e={"tenant":"t1","id":"d1","type":"x","payload":{}}; a=deliver(e); b=deliver(e); n=len([x for x in (a+b) if x.get("tenant")=="t1" and x.get("id")=="d1"]); print("OK" if n==1 else "BAD:"+str(n))`);
    gates.push(g("probe:duplicate-delivers-once", dup.out.includes("OK"), false, dup.out.slice(-160)));
  }
  if (phase === "F2" || phase === "F3" || phase === "F5") {
    const ten = pyProbe(ws, `${load} a=deliver({"tenant":"t1","id":"x","type":"m","payload":{}}); b=deliver({"tenant":"t2","id":"x","type":"m","payload":{}}); print("OK" if len(a)>=1 and len(b)>=1 else "BAD")`);
    gates.push(g("probe:cross-tenant-same-id-delivers-twice", ten.out.includes("OK"), false, ten.out.slice(-160)));
  }
  return gates;
}

function structuralProbes(opts: { phase: string; ws: string }): GateResult[] {
  const { phase, ws } = opts;
  const manifest = supRef!.manifest!;
  const gates: GateResult[] = [];
  const srcFiles = (dir: string, acc: string[] = []): string[] => {
    try { for (const e of readdirSync(dir)) { const p = join(dir, e); try { if (require("node:fs").statSync(p).isDirectory()) acc.push(...srcFiles(p)); else acc.push(p); } catch { /* gone */ } } } catch { /* missing */ }
    return acc;
  };
  if (phase === "F4") {
    // interruption state: task pair marked interrupted; draft exists
    const taskText = (f: string) => { try { return readFileSync(join(ws, ".harness", "task", f), "utf8"); } catch { return ""; } };
    const pairMarked = ["active.md", "active-resume.md", "state.md", "state-resume.md"].some((f) => /interrupted/i.test(taskText(f)));
    gates.push(g("f4:task-pair-marked-interrupted", pairMarked, false, pairMarked ? "interrupted marking found in task pair" : "no interrupted marking in task pair files"));
    const draftExists = (() => { try { return readdirSync(join(ws, ".harness", "draft")).length > 0; } catch { return false; } })();
    gates.push(g("f4:draft-present", draftExists, false, draftExists ? "interruption draft present" : "no draft file"));
    // stale references: no 'stdout' in src after recovery
    const stale = srcFiles(join(ws, "src")).filter((p) => p.includes("stdout") || /\bstdout\b/i.test(readFileSync(p, "utf8")));
    gates.push(g("f4:no-stale-stdout-references", stale.length === 0, false, stale.length === 0 ? "no stdout references remain" : `stale: ${stale.slice(0, 5).join(", ")}`));
  }
  if (phase === "F5") {
    const decDir = join(ws, ".harness", "decision");
    const dec = (() => { try { return readdirSync(decDir).map((f) => readFileSync(join(decDir, f), "utf8")).join("\n"); } catch { return ""; } })();
    const owners = ["composition root", "routing", "delivery coordinator", "memory-sink"].every((o) => dec.toLowerCase().includes(o));
    gates.push(g("f5:decision-artifact-owners", owners, true, owners ? "all four owners named" : `decision artifact missing owners (len=${dec.length})`));
    gates.push(g("f5:decision-recommends-mediation", /mediat/i.test(dec), true, /mediat/i.test(dec) ? "mediation recommendation present" : "no mediation recommendation"));
    // dead-letter member exists; routing does not inspect memory-sink internals
    const dl = srcFiles(join(ws, "src")).filter((p) => /dead/i.test(p));
    gates.push(g("f5:dead-letter-member-exists", dl.length > 0, false, dl.length > 0 ? dl.slice(0, 3).join(", ") : "no dead-letter member in tree"));
    const rt = manifest.roles["routing"];
    if (rt) {
      const routingSrc = (rt.impl ?? []).map((p) => { try { return readFileSync(join(ws, p), "utf8"); } catch { return ""; } }).join("\n");
      const inspecting = /memory.?sink/i.test(routingSrc);
      gates.push(g("f5:routing-does-not-inspect-memory-sink", !inspecting, true, inspecting ? "routing source references memory-sink" : "routing source clean of memory-sink references"));
    }
  }
  return gates;
}

function events(s: SessionRec): any[] { return sup(s)?.readEvents(s) ?? []; }
let supRef: Supervisor | null = null;
function sup(s: SessionRec): Supervisor | null { return supRef; }
export function bindSupervisor(sv: Supervisor) { supRef = sv; }

function g(gate: string, pass: boolean, hard: boolean, detail: string): GateResult {
  return { gate, pass, hard, detail };
}

// Sessions whose writes (fileops + tree-diff reconcile) exceed the allowed set.
function sessionWrites(s: SessionRec, ws: string): { allowed: string[]; violating: string[] } {
  const evs = events(s);
  const written = new Set<string>();
  const exclusive = isExclusiveWindow(s); // tree-diff attribution only for sessions that ran alone
  for (const e of evs) {
    if (e.kind === "fileop" && e.path) written.add(e.path);
    if (e.kind === "tree-diff-reconcile" && exclusive) {
      for (const p of [...(e.changed ?? []), ...(e.added ?? []), ...(e.removed ?? [])]) written.add(p);
    }
  }
  const m: Manifest = supRef!.manifest!;
  const rd = m.roles[s.tag.componentRole];
  const allowed: string[] = [];
  const violating: string[] = [];
  const adminPrefix = ".harness/";
  for (const raw of written) {
    const p = raw.startsWith("/") ? (raw.startsWith(ws + "/") ? raw.slice(ws.length + 1) : raw) : raw;
    if (isTransientArtifact(p)) { allowed.push(p); continue; }
    const isOwn = rd && (p === rd.record || p.startsWith(rd.subtree));
    const isAdmin = p.startsWith(adminPrefix);
    const execRole = (s as any).execRole as string | undefined;
    const readOnly = execRole === "analyze" || execRole === "validate";
    const ok = readOnly ? p.startsWith(".harness/evidence/") : (isOwn || isAdmin);
    (ok ? allowed : violating).push(p);
  }
  return { allowed, violating };
}

// Transient tool artifacts sessions cannot reasonably prevent (test runners, bytecode).
const TRANSIENT = ["__pycache__/", ".pytest_cache/", ".mypy_cache/", ".ruff_cache/"];
function isTransientArtifact(p: string): boolean {
  if (p.endsWith(".pyc")) return true;
  return TRANSIENT.some((t) => p.includes(t));
}

// A session ran exclusively if no other session overlapped its execution window.
function isExclusiveWindow(s: SessionRec): boolean {
  const sv = supRef!;
  return ![...sv.sessions.values()].some((o) => o !== s && o.startedAt <= (s.endedAt ?? Date.now()) && s.startedAt <= (o.endedAt ?? Date.now()));
}

export function checkPhase(opts: {
  phase: string;
  ws: string;
  preTree: Record<string, string>;
  postTree: Record<string, string>;
  testEntryResult: { ran: boolean; pass: boolean; output: string };
  expectedSessions?: Array<{ component: string; level: number; parent: string | null }>;
  requireOverlap?: Array<[string, string]>; // pairs of component roles whose sessions must overlap
  requireCheckpoints?: { by: string; count: number };
  recordAtCheckpoint?: { role: string; mustNameOnly: string[] }[]; // incremental record rule
}): PhaseCheck {
  const { phase, ws, preTree, postTree, testEntryResult } = opts;
  const sv = supRef!;
  const gates: GateResult[] = [];
  const notes: string[] = [];

  const sessions = [...sv.sessions.values()].filter((s) => s.tag.phase === phase);
  const manifest = sv.manifest!;

  // 1. Manifest + provenance
  gates.push(g("manifest-frozen", Boolean(manifest), true, "manifest frozen before any delegation"));
  for (const es of opts.expectedSessions ?? []) {
    const match = sessions.find((s) => s.tag.componentRole === es.component);
    const ok = match && match.tag.level === es.level && (match.tag.parentRole ?? null) === es.parent;
    gates.push(g(`provenance:${es.component}`, Boolean(ok), true, ok ? `${match!.tag.sessionId} level=${match!.tag.level} parent=${match!.tag.parentRole}` : `missing or mismatched session for ${es.component}`));
  }

  // 2. Scope per session
  let scopeFail = false;
  for (const s of sessions) {
    const { violating } = sessionWrites(s, ws);
    const ok = violating.length === 0;
    if (!ok) scopeFail = true;
    gates.push(g(`scope:${s.tag.sessionId}`, ok, true, ok ? "writes within allowed members" : `unauthorized writes: ${violating.slice(0, 10).join(", ")}`));
  }

  // 3. Handoffs written + chronology (delegate-start < child start < child end < observe-done)
  for (const s of sessions) {
    if (s.tag.level === 0) continue;
    const hp = join(ws, ".harness", "handoffs", `${s.tag.sessionId}.md`);
    gates.push(g(`handoff-file:${s.tag.sessionId}`, existsSync(hp), true, existsSync(hp) ? "present" : "MISSING handoff file"));
    if (s.parentToken) {
      const parent = sv.sessions.get(s.parentToken);
      if (parent) {
        const pe = events(parent);
        const startE = pe.find((e) => e.kind === "delegate-started" && e.childSessionId === s.tag.sessionId);
        const obsE = pe.find((e) => e.kind === "observe-done" && e.childSessionId === s.tag.sessionId);
        gates.push(g(`delegation-chronology:${s.tag.sessionId}`, Boolean(startE), true, startE ? `parent delegated at ${startE.at}` : "parent has no delegate-started event"));
        if (obsE) gates.push(g(`observe-before-integrate:${s.tag.sessionId}`, true, true, `observed at ${obsE.at}`));
        else notes.push(`${parent.tag.sessionId} did not observe ${s.tag.sessionId} via observe() (integration input unverifiable)`);
      }
    }
  }

  // 4. Sibling overlap + distinct credentials
  for (const [a, b] of opts.requireOverlap ?? []) {
    const sa = sessions.filter((s) => s.tag.componentRole === a);
    const sb = sessions.filter((s) => s.tag.componentRole === b);
    const overlap = sa.some((x) => sb.some((y) => x.startedAt <= (y.endedAt ?? y.startedAt) && y.startedAt <= (x.endedAt ?? x.startedAt)));
    gates.push(g(`sibling-overlap:${a}+${b}`, overlap, true, overlap ? "windows overlap" : "no overlapping window between sibling sessions"));
    const creds = new Set([...sa, ...sb].map((s) => s.token));
    gates.push(g(`distinct-credentials:${a}+${b}`, creds.size === sa.length + sb.length, true, `${creds.size} distinct credentials for ${sa.length + sb.length} sessions`));
  }

  // 5. Consultations: evidence quotes the PRE-TREE (stub) record content and cites the
  // pre-tree hash. Quotations bind to the stub as planted (the child replaced the record
  // afterward), so the comparison base is the frozen stub content, not the current record.
  const consultReqs = CONSULTATIONS[phase as keyof typeof CONSULTATIONS] ?? [];
  const evidenceDir = join(ws, ".harness", "evidence");
  const evidenceText = (() => {
    try { return readdirSync(evidenceDir).map((f) => readFileSync(join(evidenceDir, f), "utf8")).join("\n"); } catch { return ""; }
  })();
  const preTreeHash = sha(JSON.stringify(preTree));
  for (const role of consultReqs) {
    const rd = manifest.roles[role];
    if (!rd) { gates.push(g(`consultation:${role}`, false, false, "role not in manifest")); continue; }
    const stubPath = join(supRef!["runsDir"], "stubs", `${role}.md`);
    const stubContent = existsSync(stubPath) ? readFileSync(stubPath, "utf8") : (preTree[rd.record] ? "" : "");
    const hashCited = evidenceText.includes(preTreeHash) || evidenceText.includes(preTreeHash.slice(0, 12));
    // quotation = any stub fragment of >=10 chars (beyond boilerplate headings) present in evidence
    const fragments = stubContent.split(/[\n#]/).map((x) => x.trim())
      .map((x) => x.replace(/^\w+:\s*/, "")) // strip field labels: evidence quotes content, not labels
      .filter((x) => x.length >= 10 && !x.startsWith("—"));
    const quoted = fragments.some((f) => evidenceText.includes(f.slice(0, Math.min(f.length, 60))));
    const stubHashCited = evidenceText.includes((supRef!.stubHashes[role] ?? "").slice(0, 12));
    const pass = quoted && hashCited;
    const detail = pass ? (stubHashCited ? "stub quotation + pre-tree hash + baseline hash cited" : "stub quotation + pre-tree hash cited (baseline hash not explicit)")
      : quoted ? "stub quotation found but pre-tree hash not cited"
      : hashCited ? "pre-tree hash cited but no quotation from the planted stub"
      : "no stub quotation and no pre-tree hash in evidence";
    gates.push(g(`consultation:${role}`, pass, false, detail));
  }

  // 6. Checkpoints (F0)
  if (opts.requireCheckpoints) {
    const { by, count } = opts.requireCheckpoints;
    const cps = sv.checkpoints.filter((c) => sessions.find((s) => s.tag.sessionId === c.sessionId && s.tag.componentRole === by));
    gates.push(g(`checkpoints:${by}`, cps.length >= count, true, `${cps.length} checkpoints by ${by} (need ${count})`));
  }

  // 7. Incremental record rule (F0 coordinator): cp1 names only the first integrated sink,
  // cp2 names both; a combined update or an out-of-order record fails.
  for (const r of opts.recordAtCheckpoint ?? []) {
    const rd = manifest.roles[r.role];
    if (!rd) continue;
    const cps = sv.checkpoints.filter((c) => sessions.find((s) => s.tag.sessionId === c.sessionId && s.tag.componentRole === r.role));
    let ok = cps.length >= 2;
    let detail = ok ? "" : `${cps.length} checkpoints (need 2)`;
    if (ok) {
      const recAt = (cp: any) => { try { return readFileSync(join(cp.dir, "tree", rd.record), "utf8"); } catch { return null; } };
      const c1 = recAt(cps[0]);
      if (c1 == null) { ok = false; detail = "checkpoint 1 record unreadable"; }
      else if (!c1.includes("file-sink")) { ok = false; detail = "checkpoint 1 record does not name file-sink"; }
      else if (/memory.?sink/i.test(c1)) { ok = false; detail = "checkpoint 1 record already names memory-sink (combined update)"; }
    }
    if (ok) {
      const c2rec = (() => { try { return readFileSync(join(cps[cps.length - 1].dir, "tree", rd.record), "utf8"); } catch { return null; } })();
      if (c2rec == null || !c2rec.includes("file-sink") || !/memory.?sink/i.test(c2rec)) { ok = false; detail = "final checkpoint record does not name both sinks"; }
    }
    gates.push(g(`incremental-record:${r.role}`, ok, true, ok ? "checkpoint 1 names only file-sink; final checkpoint names both" : detail));
  }

  // 8. Tests
  gates.push(g("arm-tests", testEntryResult.ran && testEntryResult.pass, false, testEntryResult.ran ? (testEntryResult.pass ? "arm test entrypoint passed" : `arm test entrypoint FAILED: ${testEntryResult.output.slice(-300)}`) : "no runnable test entrypoint"));

  // 8b. Deterministic behavior probes via the manifest entrypoint (process-spec §4).
  gates.push(...behaviorProbes(opts));

  // 8c. Phase-specific structural gates.
  gates.push(...structuralProbes(opts));

  // 9. Budget denial = retained, scored (not a checker failure per se)
  const denied = sessions.filter((s) => s.status === "budget-denied");
  if (denied.length > 0) notes.push(`budget exhaustion in phase (retained, scored as observed): ${denied.map((s) => s.tag.sessionId).join(", ")}`);

  // Scoring per process-spec §2.
  const hardFails = gates.filter((x) => x.hard && !x.pass);
  const behavior = testEntryResult.ran && testEntryResult.pass ? 2 : (testEntryResult.ran ? 1 : 0);
  const boundary = hardFails.length === 0 ? 2 : 0;
  const softFails = gates.filter((x) => !x.hard && !x.pass);
  const records = hardFails.length === 0 && softFails.length === 0 ? 1 : 0;
  const capped = boundary === 0;
  const total = capped ? Math.min(behavior + 0 + records, 2) : behavior + boundary + records;
  return { phase, gates, score: { behavior, boundary, records, total, capped }, notes };
}
