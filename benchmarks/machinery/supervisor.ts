// QR2 machinery: supervisor (host-side). Owns the session registry, nested delegation
// (spawn/observe with distinct credentials and actor tags), manifest freeze + stub
// planting, immutable checkpoints, tree snapshots/diffs, and the write-log aggregation.
import type { Server } from "node:http";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  cpSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, relative, sep } from "node:path";
import {
  REQUIRED_ROLES, EXEC_ROLES, CHILD_SESSION_MS, ROOT_SESSION_MS, sha256, TELEMETRY_CONTENT_MAX,
  type SessionTag, type ExecRole, MODEL,
} from "./config.ts";

const MODEL_CARD_PRESET = {
  id: "@preset/abs-medium", name: "ABS Medium", reasoning: true,
  thinkingLevelMap: { off: "none", minimal: null, low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" },
  contextWindow: 1050000,
  cost: { input: 0.2, output: 1.2, cacheRead: 0.02, cacheWrite: 0.25 },
};
const MODEL_CARD_GLM_FLASH = {
  id: "z-ai/glm-5.3-flash", name: "Z.ai: GLM 5.3 Flash", reasoning: true,
  thinkingLevelMap: { off: "none", minimal: null, low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" },
  contextWindow: 1310720,
  cost: { input: 0.15, output: 0.5, cacheRead: 0.05, cacheWrite: 0.25 },
};
const STANDARD_THINKING_MAP = { off: "none", minimal: null, low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" };

// Derive a model card for any OpenRouter model id from the public /models list.
// Built-in cards take precedence (preset identity, experimentally verified runners).
export function modelCardFor(id: string): any {
  if (id === "@preset/abs-medium") return MODEL_CARD_PRESET;
  if (id === "z-ai/glm-5.3-flash") return MODEL_CARD_GLM_FLASH;
  const r = spawnSync("python3", ["-c",
    "import json,urllib.request;ms=json.loads(urllib.request.urlopen('https://openrouter.ai/api/v1/models',timeout=60).read())['data'];"
    + `m=[x for x in ms if x['id']==${JSON.stringify(id)}];`
    + "print(json.dumps(m[0])) if m else print('NOT_FOUND')"],
    { encoding: "utf8", timeout: 90_000 });
  if (r.status !== 0 || !r.stdout || r.stdout.trim() === "NOT_FOUND") {
    throw new Error(`no model card for runner model ${id} (built-in cards: @preset/abs-medium, z-ai/glm-5.3-flash; OpenRouter lookup failed: ${String(r.stderr).slice(0, 200)})`);
  }
  const m = JSON.parse(r.stdout);
  const sp: string[] = m.supported_parameters ?? [];
  if (!sp.includes("tools")) throw new Error(`runner model ${id} does not support tool calling on OpenRouter`);
  const p = m.pricing ?? {};
  const perM = (v: any) => (v == null ? null : Number(v) * 1e6);
  return {
    id, name: m.name ?? id,
    reasoning: sp.includes("reasoning"),
    thinkingLevelMap: STANDARD_THINKING_MAP,
    contextWindow: Number(m.context_length ?? 131072),
    cost: { input: perM(p.prompt) ?? 0, output: perM(p.completion) ?? 0, cacheRead: perM(p.input_cache_read) ?? 0, cacheWrite: perM(p.input_cache_write) ?? 0 },
  };
}
export const ABS_MODEL_ENTRY = modelCardFor(MODEL);

export type ArmAdapter = {
  arm: string;
  childSystemPrompt(execRole: ExecRole, component: string, tag: SessionTag): string;
  rootSystemPrompt(phase: string): string;
  toolsFor(kind: "root" | ExecRole): string[];
};

export type SessionRec = {
  tag: SessionTag;
  token: string;
  proc: ReturnType<typeof import("node:child_process").spawn> | null;
  eventsFile: string;
  cfgDir: string;
  startedAt: number;
  endedAt: number | null;
  status: "running" | "ok" | "timeout" | "failed" | "budget-denied";
  spendUsd: number;
  exitCode: number | null;
  parentToken: string | null; // delegating session's credential
  snapshotBefore: Record<string, string> | null; // path -> sha256
  resolved: unknown;
  stdoutTail?: string; stderrTail?: string;
  retried?: boolean;
};

export type Manifest = {
  roles: Record<string, {
    level: number; parent: string | null; subtree: string; record: string;
    impl: string[]; tests: string[]; children: string[];
  }>;
  admin: Record<string, string>;
  entrypoint: string;
};

export function snapshotTree(ws: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      if (e === "__pycache__" || e === ".git" || e === ".pytest_cache" || e.endsWith(".pyc")) continue; // bytecode/test-runner noise
      const p = join(dir, e);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      const rel = relative(ws, p).split(sep).join("/");
      out[rel] = createHash("sha256").update(readFileSync(p)).digest("hex");
    }
  };
  walk(ws);
  return out;
}

export function diffTrees(before: Record<string, string>, after: Record<string, string>) {
  const changed: string[] = [], added: string[] = [], removed: string[] = [];
  for (const [p, h] of Object.entries(after)) {
    if (!(p in before)) added.push(p);
    else if (before[p] !== h) changed.push(p);
  }
  for (const p of Object.keys(before)) if (!(p in after)) removed.push(p);
  return { changed, added, removed };
}

export class Supervisor {
  private server: Server;
  port = 0;
  sessions = new Map<string, SessionRec>();
  byId = new Map<string, SessionRec>();
  manifest: Manifest | null = null;
  stubHashes: Record<string, string> = {};
  checkpoints: Array<{ id: string; label: string; sessionId: string; at: string; treeHash: string; dir: string }> = [];
  delegateLog: Array<{ at: string; parentSessionId: string; component: string; execRole: string; childSessionId: string; resolved: unknown }> = [];
  deniedLog: Array<{ at: string; sessionId: string; reason: string }> = [];
  private waiters = new Map<string, Array<(r: any) => void>>();

  constructor(
    private ws: string,
    private runsDir: string,
    private proxyPort: number,
    private piEntry: string,
    private adapter: ArmAdapter,
    private budgetFor: (phase: string) => { phaseRemainingUsd: number; armRemainingUsd: number },
    private registerProxySession: (token: string, tag: SessionTag, phase: string) => void,
    private onSpend: (delta: number) => void,
    private run: string,
    private phase: string,
  ) {
    this.server = createServer((req, res) => this.route(req, res));
  }
  async start(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.server.listen(0, "127.0.0.1", () => { this.port = (this.server.address() as any).port; resolve(); });
    });
  }
  stop() { this.server.close(); }

  private auth(req: IncomingMessage): SessionRec | null {
    const token = String(req.headers.authorization ?? "").replace(/^Bearer\s+/i, "").trim();
    return this.sessions.get(token) ?? null;
  }
  private json(req: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
      let b = ""; req.on("data", (c) => (b += c));
      req.on("end", () => { try { resolve(JSON.parse(b)); } catch { resolve({}); } });
    });
  }
  private send(res: ServerResponse, code: number, body: unknown) {
    res.writeHead(code, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }

  private async route(req: IncomingMessage, res: ServerResponse) {
    const url = req.url ?? "";
    const sess = this.auth(req);
    try {
      if (url === "/freeze-manifest" && req.method === "POST") {
        if (!sess) return this.send(res, 401, { error: { message: "unknown session" } });
        if (sess.tag.level !== 0) return this.send(res, 403, { error: { message: "only the level-0 session freezes the manifest" } });
        if (this.manifest) return this.send(res, 409, { error: { message: "manifest already frozen" } });
        const body = await this.json(req);
        const errors = this.validateManifest(body.manifest);
        if (errors.length > 0) return this.send(res, 200, { ok: false, errors, stubs: [] });
        this.manifest = body.manifest;
        writeFileSync(join(this.ws, ".harness", "manifest.json"), JSON.stringify(this.manifest, null, 1));
        const stubs = this.plantStubs();
        this.send(res, 200, { ok: true, errors: [], stubs });
        return;
      }
      if (url === "/delegate" && req.method === "POST") {
        if (!sess) return this.send(res, 401, { error: { message: "unknown session" } });
        const body = await this.json(req);
        if (!this.manifest) return this.send(res, 200, { denied: true, reason: "manifest not frozen — freeze_manifest first" });
        if (!EXEC_ROLES.includes(body.role)) return this.send(res, 200, { denied: true, reason: `unknown exec role ${body.role}` });
        const comp = String(body.component ?? "");
        const roleDef = this.manifest.roles[comp];
        if (!roleDef) return this.send(res, 200, { denied: true, reason: `unknown component ${comp}` });
        if (roleDef.parent !== sess.tag.componentRole) return this.send(res, 200, { denied: true, reason: `${comp} is not a declared child of ${sess.tag.componentRole}` });
        const bv = this.budgetFor(this.phase);
        if (bv.phaseRemainingUsd <= 0 || bv.armRemainingUsd <= 0) {
          this.deniedLog.push({ at: new Date().toISOString(), sessionId: sess.tag.sessionId, reason: "budget" });
          return this.send(res, 200, { denied: true, reason: "phase-or-arm-budget-exhausted" });
        }
        const child = this.spawnSession({
          parent: sess, component: comp, execRole: body.role as ExecRole,
          task: String(body.task ?? ""), modelOverride: body.model ?? null, thinkingOverride: body.thinking ?? null,
        });
        this.send(res, 200, { sessionId: child.tag.sessionId, handoffPath: this.handoffPath(child), resolved: child.resolved, credentialRef: `cred-${child.tag.sessionId}` });
        return;
      }
      if (url === "/observe" && req.method === "POST") {
        if (!sess) return this.send(res, 401, { error: { message: "unknown session" } });
        const body = await this.json(req);
        const child = this.byId.get(String(body.session_id ?? ""));
        if (!child) return this.send(res, 200, { status: "unknown-session" });
        if (child.parentToken !== sess.token) return this.send(res, 200, { status: "not-your-child" });
        if (child.endedAt == null) {
          const holdMs = body.poll ? 240_000 : CHILD_SESSION_MS + 90_000;
          await new Promise<void>((resolve) => {
            const w = (r: any) => { resolve(); };
            if (!this.waiters.has(child.tag.sessionId)) this.waiters.set(child.tag.sessionId, []);
            this.waiters.get(child.tag.sessionId)!.push(w);
            // Bound the hold: poll requests return "still-running" before the client fetch timeout.
            const t = setTimeout(() => resolve(), holdMs);
            void t;
          });
        }
        if (body.poll && child.endedAt == null) {
          this.send(res, 200, { status: "still-running", handoffPath: this.handoffPath(child), handoffPresent: false });
          return;
        }
        this.send(res, 200, {
          status: child.status, handoffPath: this.handoffPath(child),
          handoffPresent: existsSync(this.handoffPath(child)),
          spendUsd: child.spendUsd, treeHashAfter: child.snapshotBefore ? null : null,
        });
        return;
      }
      if (url === "/checkpoint" && req.method === "POST") {
        if (!sess) return this.send(res, 401, { error: { message: "unknown session" } });
        const body = await this.json(req);
        const id = `ck-${this.checkpoints.length + 1}-${Math.random().toString(36).slice(2, 6)}`;
        const dir = join(this.runsDir, "checkpoints", id);
        mkdirSync(dir, { recursive: true });
        cpSync(this.ws, join(dir, "tree"), { recursive: true });
        const treeHash = sha256(JSON.stringify(snapshotTree(this.ws)));
        this.checkpoints.push({ id, label: String(body.label ?? ""), sessionId: sess.tag.sessionId, at: new Date().toISOString(), treeHash, dir });
        this.send(res, 200, { checkpointId: id, treeHash });
        return;
      }
      this.send(res, 404, { error: { message: "no route" } });
    } catch (e: any) {
      this.send(res, 500, { error: { message: String(e).slice(0, 300) } });
    }
  }

  handoffPath(s: SessionRec): string { return join(this.ws, ".harness", "handoffs", `${s.tag.sessionId}.md`); }

  validateManifest(m: any): string[] {
    const errors: string[] = [];
    if (!m || typeof m !== "object") return ["manifest is not an object"];
    if (!m.roles || typeof m.roles !== "object") return ["roles missing"];
    for (const r of REQUIRED_ROLES) {
      if (!m.roles[r]) errors.push(`missing role ${r}`);
    }
    if (Object.keys(errors).length > 0) return errors;
    const seen = new Map<string, string>();
    for (const [name, rd] of Object.entries(m.roles) as [string, any][]) {
      for (const k of ["level", "parent", "subtree", "record", "impl", "tests", "children"]) {
        if (rd[k] === undefined) errors.push(`${name}.${k} missing`);
      }
      if (rd.record && !String(rd.record).startsWith(rd.subtree)) errors.push(`${name}: record outside own subtree`);
      const owner = seen.get(rd.subtree);
      if (owner) errors.push(`subtree collision: ${name} and ${owner} share ${rd.subtree}`);
      seen.set(rd.subtree, name);
      for (const p of [...(rd.impl ?? []), ...(rd.tests ?? [])]) {
        if (!String(p).startsWith(rd.subtree)) errors.push(`${name}: member ${p} outside own subtree`);
      }
      if (m.roles[rd.parent] && !m.roles[rd.parent].children?.includes(name)) errors.push(`${name}: parent ${rd.parent} does not declare it as child`);
      for (const c of rd.children ?? []) {
        if (!m.roles[c]) errors.push(`${name}: reserved child ${c} has no manifest role`);
        if (m.roles[c] && m.roles[c].parent !== name) errors.push(`${name}: child ${c} does not declare ${name} as parent`);
      }
    }
    if (!m.entrypoint || typeof m.entrypoint !== "string") errors.push("entrypoint missing");
    if (!m.admin || !m.admin.evidence) errors.push("admin.evidence missing");
    return errors;
  }

  plantStubs(): string[] {
    const planted: string[] = [];
    this.stubHashes = {};
    const stubDir = join(this.runsDir, "stubs");
    mkdirSync(stubDir, { recursive: true });
    for (const [name, rd] of Object.entries(this.manifest!.roles)) {
      const p = join(this.ws, rd.record);
      if (existsSync(p)) { this.stubHashes[name] = sha256(readFileSync(p)); continue; }
      mkdirSync(join(p, ".."), { recursive: true });
      const stub = [
        `# ${name} — component record (harness stub)`,
        "",
        "Purpose: (stub planted before this component's build session; the owning session replaces this stub with the real record.)",
        "Components: none yet",
        "Design: none yet",
        "Lineage: planted by harness at manifest freeze",
        "Links: none yet",
        "",
      ].join("\n");
      writeFileSync(p, stub);
      writeFileSync(join(stubDir, `${name}.md`), stub); // frozen stub content for consultation checking
      this.stubHashes[name] = sha256(stub);
      planted.push(name);
    }
    writeFileSync(join(this.ws, ".harness", "stub-hashes.json"), JSON.stringify(this.stubHashes, null, 1));
    return planted;
  }

  resolveDelegation(execRole: ExecRole, modelOverride: string | null, thinkingOverride: string | null) {
    let cfg = { defaultModel: MODEL, defaultThinkingLevel: "high", models: {}, roles: {} };
    const cfgPath = join(this.ws, ".harness", "delegation-config.json");
    try { cfg = JSON.parse(readFileSync(cfgPath, "utf8")); } catch { /* defaults above */ }
    const rc = cfg.roles?.[execRole] ?? {};
    const alias = (v: string | null | undefined) => (v == null ? null : (cfg.models?.[v] ?? v)); // alias passthrough: models[selected] ?? selected
    const chainModel = modelOverride ? { value: modelOverride, source: "authorized-override" }
      : rc.model ? { value: alias(rc.model), source: `role:${execRole}.model` }
      : { value: alias(cfg.defaultModel), source: "project-default" };
    const chainThinking = thinkingOverride ? { value: thinkingOverride, source: "authorized-override" }
      : rc.thinking ? { value: rc.thinking, source: `role:${execRole}.thinking` }
      : { value: cfg.defaultThinkingLevel, source: "project-default" };
    return {
      model: chainModel, thinking: chainThinking,
      provider: cfg.provider ?? "openrouter",
      execRole,
      roleContract: rc.mode ?? (execRole === "implement" ? "write-subtree-no-commit" : "read-only"),
    };
  }

  spawnSession(opts: {
    parent?: SessionRec; component: string; execRole: ExecRole | "root";
    task: string; modelOverride: string | null; thinkingOverride: string | null;
    phase?: string;
  }): SessionRec {
    const parentTag = opts.parent?.tag ?? null;
    // Children inherit the delegating session's phase (budget + provenance attribution).
    const phase = opts.phase ?? parentTag?.phase ?? this.phase;
    const n = this.sessions.size + 1;
    const tag: SessionTag = {
      run: this.run, arm: this.adapter.arm, phase,
      sessionId: `${this.run}-${phase}-s${n}-${opts.component}`,
      componentRole: opts.component,
      parentRole: parentTag ? parentTag.componentRole : null,
      level: parentTag ? parentTag.level + 1 : 0,
    };
    const token = `sess-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const cfgDir = join(this.runsDir, "session-cfg", tag.sessionId);
    mkdirSync(cfgDir, { recursive: true });
    mkdirSync(join(this.runsDir, "events"), { recursive: true });
    const eventsFile = join(this.runsDir, "events", `${tag.sessionId}.jsonl`);
    writeFileSync(join(cfgDir, "models.json"), JSON.stringify({
      providers: { openrouter: { baseUrl: `http://127.0.0.1:${this.proxyPort}/v1`, headers: {}, models: [ABS_MODEL_ENTRY] } },
    }, null, 1));
    writeFileSync(join(cfgDir, "auth.json"), JSON.stringify({ openrouter: { type: "api_key", key: token } }));
    const isRoot = opts.execRole === "root";
    const exts = [join(import.meta.dir, "machinery-ext.ts")];
    writeFileSync(join(cfgDir, "settings.json"), JSON.stringify({ extensions: exts }, null, 1));
    const resolved = isRoot ? null : this.resolveDelegation(opts.execRole as ExecRole, opts.modelOverride, opts.thinkingOverride);
    const rec: SessionRec = {
      tag, token, proc: null, eventsFile, cfgDir,
      startedAt: Date.now(), endedAt: null, status: "running", spendUsd: 0, exitCode: null,
      parentToken: opts.parent?.token ?? null, snapshotBefore: null, resolved,
    };
    this.sessions.set(token, rec);
    this.byId.set(tag.sessionId, rec);
    this.registerProxySession(token, tag, phase);
    // System prompt: arm doctrine + harness appendix.
    const appendix = this.harnessAppendix(rec, isRoot);
    const sys = isRoot
      ? `${this.adapter.rootSystemPrompt(tag.phase)}\n\n${appendix}`
      : `${this.adapter.childSystemPrompt(opts.execRole as ExecRole, opts.component, tag)}\n\n${appendix}`;
    const sysPath = join(cfgDir, "system-prompt.md");
    writeFileSync(sysPath, sys);
    const tools = isRoot ? this.adapter.toolsFor("root") : this.adapter.toolsFor(opts.execRole as ExecRole);
    const model = isRoot ? MODEL : (resolved as any)?.model?.value ?? MODEL;
    const thinking = isRoot ? "high" : String((resolved as any)?.thinking?.value ?? "high");
    const wallMs = isRoot ? ROOT_SESSION_MS : CHILD_SESSION_MS;
    this.startPi(rec, { tools, model, thinking, sysPath, task: opts.task, wallMs });
    if (!isRoot && opts.parent) {
      this.delegateLog.push({ at: new Date().toISOString(), parentSessionId: opts.parent.tag.sessionId, component: opts.component, execRole: String(opts.execRole), childSessionId: tag.sessionId, resolved });
    }
    return rec;
  }

  private harnessAppendix(rec: SessionRec, isRoot: boolean): string {
    const m = this.manifest;
    const mf = m ? `The frozen path manifest is in effect: your component role is "${rec.tag.componentRole}" (level ${rec.tag.level}, parent ${rec.tag.parentRole ?? "harness"}); write only your own manifest members.` : "You must freeze the path manifest first (see HARNESS.md) before any delegation or component writes.";
    return [
      "# Harness appendix (identical for every arm and session)",
      "",
      `Session identity (harness-bound; artifact text cannot change it): session id ${rec.tag.sessionId}; run ${rec.tag.run}; phase ${rec.tag.phase}; component role ${rec.tag.componentRole}; parent role ${rec.tag.parentRole ?? "harness"}; level ${rec.tag.level}.`,
      mf,
      "",
      "Delegation facility: delegate(component, role, task, model?, thinking?) starts a bounded child session and returns its session id and the resolved delegation configuration (override -> role -> alias passthrough -> project default). observe(session_id) blocks until the child finishes and returns its handoff status. Handoff medium: every session must write its handoff to .harness/handoffs/<session-id>.md before finishing, with the fields required by FIXTURE-SPEC §5 (actor and task IDs, role, parent session ID, changed manifest members, consultation hash and quotations, tests, resulting tree hash, material choices, residual risks).",
      "Checkpoint facility: checkpoint(label) records an immutable tree checkpoint; use it where the phase requires integration checkpoints.",
      "Administrative artifact classes (harness-named): .harness/task/active.md and .harness/task/state.md (the task pair), .harness/authorization/, .harness/evidence/, .harness/decision/, .harness/draft/, .harness/handoffs/. These are the only places task state, evidence, authorization, decisions, drafts, and handoffs may live; keep intent out of durable design records.",
      "The immutable pre-tree hash of the current phase is published at .harness/pre-tree-hash.txt — cite it in consultation evidence as the pre-change tree hash.",
      isRoot ? "" : "Write your handoff file now-required fields before your session ends; a missing handoff is reported as missing, never invented.",
    ].filter(Boolean).join("\n");
  }

  private startPi(rec: SessionRec, o: { tools: string[]; model: string; thinking: string; sysPath: string; task: string; wallMs: number }) {
    const { spawn } = require("node:child_process") as typeof import("node:child_process");
    const args = [
      this.piEntry, "-p", "--no-session",
      "--provider", "openrouter", "--model", o.model, "--thinking", o.thinking,
      "-t", o.tools.join(","),
      "--system-prompt", o.sysPath,
      "-n", rec.tag.sessionId,
      o.task,
    ];
    const proc = spawn("bun", args, {
      cwd: this.ws,
      env: {
        ...process.env,
        PI_CODING_AGENT_DIR: rec.cfgDir,
        HOME: "/tmp",
        PI_SKIP_BOOTSTRAP: "1", PI_SKIP_VERSION_CHECK: "1", PI_OFFLINE: "1",
        OPENROUTER_API_KEY: "qr2-local",
        QR2_SUPERVISOR: `http://127.0.0.1:${this.port}`,
        QR2_TOKEN: rec.token,
        QR2_EVENTS_FILE: rec.eventsFile,
        QR2_SESSION_JSON: JSON.stringify(rec.tag),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    rec.proc = proc;
    let out = "", err = "";
    proc.stdout!.on("data", (c: Buffer) => { out += c; });
    proc.stderr!.on("data", (c: Buffer) => { err += c.slice(0, 2000); });
    const timer = setTimeout(() => {
      if (rec.endedAt == null) { try { proc.kill("SIGKILL"); } catch { /* gone */ } }
    }, o.wallMs);
    proc.on("exit", (code) => {
      clearTimeout(timer);
      rec.endedAt = Date.now();
      rec.exitCode = code;
      rec.status = rec.status === "budget-denied" ? "budget-denied" : (code === 0 ? "ok" : "failed");
      // Post-session tree diff: reconcile bash-originated changes into the write log.
      try {
        const after = snapshotTree(this.ws);
        const d = rec.snapshotBefore ? diffTrees(rec.snapshotBefore, after) : null;
        if (d) {
          const ev = JSON.stringify({ seq: 999999, at: new Date().toISOString(), session: rec.tag.sessionId, kind: "tree-diff-reconcile", changed: d.changed.slice(0, 500), added: d.added.slice(0, 500), removed: d.removed.slice(0, 500) });
          require("node:fs").appendFileSync(rec.eventsFile, ev + "\n");
        }
      } catch { /* snapshot unavailable */ }
      rec.stdoutTail = out.slice(-16000);
      rec.stderrTail = err.slice(-4000);
      // Persist session logs for diagnosis and packets.
      try {
        mkdirSync(join(this.runsDir, "session-logs"), { recursive: true });
        writeFileSync(join(this.runsDir, "session-logs", `${rec.tag.sessionId}.log`), `# exit=${code} status=${rec.status}\n## stdout tail\n${rec.stdoutTail}\n## stderr tail\n${rec.stderrTail}\n`);
      } catch { /* best-effort */ }
      // Retry once on transient fast-fail: failed quickly with no writes and no delegations.
      if (rec.status === "failed" && !rec.retried && (rec.endedAt - rec.startedAt) < 90_000) {
        const did = this.readEvents(rec).some((e) => e.kind === "fileop" || e.kind === "delegate-started");
        if (!did) {
          rec.retried = true;
          rec.status = "running"; rec.endedAt = null; rec.exitCode = null;
          this.deniedLog.push({ at: new Date().toISOString(), sessionId: rec.tag.sessionId, reason: `fast-fail retry: ${String(err).slice(0, 120)}` });
          this.startPi(rec, o);
          return;
        }
      }
      for (const w of this.waiters.get(rec.tag.sessionId) ?? []) w(rec);
      this.waiters.delete(rec.tag.sessionId);
    });
    // Snapshot the tree as the session sees it at start (for per-session diffs).
    try { rec.snapshotBefore = snapshotTree(this.ws); } catch { /* empty ws */ }
  }

  async waitAll(timeoutMs: number): Promise<void> {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      const running = [...this.sessions.values()].filter((s) => s.endedAt == null);
      if (running.length === 0) return;
      await new Promise((r) => setTimeout(r, 500));
    }
    for (const s of this.sessions.values()) if (s.endedAt == null) { try { s.proc?.kill("SIGKILL"); } catch { /* gone */ } }
  }

  readEvents(s: SessionRec): any[] {
    try {
      return readFileSync(s.eventsFile, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return { kind: "unparsable", line: l.slice(0, 200) }; } });
    } catch { return []; }
  }
}
