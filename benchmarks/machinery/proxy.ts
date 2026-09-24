// QR2 machinery: local OpenAI-compatible proxy (host-side).
// Sessions (pi processes) point at this proxy; it pins the preset route, tags requests
// with the caller session's actor tag, enforces phase/arm budgets, and captures the real
// per-request usage.cost returned by OpenRouter (with tokens*pricing contingency).
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { MODEL, REASONING, KEY_PATH } from "./config.ts";

function readKey(): string {
  const auth = JSON.parse(require("node:fs").readFileSync(KEY_PATH, "utf8"));
  const found = (o: unknown): string | null => {
    if (o && typeof o === "object") {
      for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
        if (/openrouter/i.test(k) && typeof v === "string" && v.startsWith("sk-or")) return v;
        const r = found(v);
        if (r) return r;
      }
    } else if (typeof o === "string" && o.startsWith("sk-or")) return o;
    return null;
  };
  const k = found(auth);
  if (!k) throw new Error("no openrouter key found in " + KEY_PATH);
  return k;
}

export type RequestRecord = {
  at: string;
  sessionTag: Record<string, unknown>; // actor tag of the caller
  model: string;
  status: number;
  finish: string | null;
  usage: Record<string, unknown> | null;
  costUsd: number | null; // usage.cost from provider (authoritative when present)
  estimateUsd: number; // tokens*pricing fallback
  latencyMs: number;
  denied?: boolean;
  error?: string;
};

export type BudgetView = { phaseRemainingUsd: number; armRemainingUsd: number };

export class MachineryProxy {
  private key = readKey();
  private server = createServer((req, res) => this.handle(req, res));
  port = 0;
  requests: RequestRecord[] = [];
  ledgerPath: string | null = null; // set by run-arm: persistent per-request cost evidence
  spendByPhase = new Map<string, number>();
  spendArm = 0;
  // Per-session cost ledger: real (usage.cost) vs estimate — the session-cost
  // verification evidence for Gate 4.
  costByToken = new Map<string, { real: number; est: number; n: number; tag: Record<string, unknown> }>();
  private sessions = new Map<string, { tag: Record<string, unknown>; budget: () => BudgetView; onDenied: (reason: string) => void }>();

  registerSession(token: string, tag: Record<string, unknown>, budget: () => BudgetView, onDenied: (r: string) => void) {
    this.sessions.set(token, { tag, budget, onDenied });
  }

  async start(): Promise<number> {
    return await new Promise((resolve) => {
      this.server.listen(0, "127.0.0.1", () => {
        this.port = (this.server.address() as any).port;
        resolve(this.port);
      });
    });
  }
  stop() { this.server.close(); }

  private async handle(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST" || !req.url?.endsWith("/chat/completions")) {
      res.writeHead(404).end('{"error":{"message":"not found"}}');
      return;
    }
    let body = "";
    req.on("data", (c: Buffer) => (body += c));
    req.on("end", async () => {
      const auth = String(req.headers.authorization ?? "");
      const token = auth.replace(/^Bearer\s+/i, "").trim();
      const sess = this.sessions.get(token);
      const t0 = Date.now();
      if (!sess) {
        res.writeHead(401).end(JSON.stringify({ error: { message: "unknown session token", type: "qr2_auth" } }));
        return;
      }
      let wantsStream = false;
      try { wantsStream = Boolean(JSON.parse(body)?.stream); } catch { /* non-stream */ }
      const bv = sess.budget();
      if (bv.phaseRemainingUsd <= 0 || bv.armRemainingUsd <= 0) {
        // Budget exhausted: deny. Scored cap-exhaustion stop.
        sess.onDenied("phase-or-arm-budget-exhausted");
        this.requests.push({ at: new Date().toISOString(), sessionTag: sess.tag, model: MODEL, status: 402, finish: null, usage: {}, costUsd: null, estimateUsd: 0, latencyMs: Date.now() - t0, denied: true, error: "budget exhausted" });
        res.writeHead(402).end(JSON.stringify({ error: { message: "QR2 budget exhausted for this phase/arm", type: "qr2_budget" } }));
        return;
      }
      try {
        const upstreamBody = JSON.stringify({
          model: MODEL,
          messages: JSON.parse(body).messages ?? [],
          tools: (() => { try { const t = JSON.parse(body).tools; return Array.isArray(t) && t.length > 0 ? t : undefined; } catch { return undefined; } })(),
          reasoning: { effort: REASONING },
          usage: { include: true },
        });
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            authorization: `Bearer ${this.key}`,
            "content-type": "application/json",
            "x-session-id": String((sess.tag as any).sessionId ?? ""),
            "x-session-affinity": String((sess.tag as any).sessionId ?? ""),
          },
          body: upstreamBody,
        });
        const j: any = await r.json().catch(() => ({}));
        if (!r.ok) {
          this.requests.push({ at: new Date().toISOString(), sessionTag: sess.tag, model: MODEL, status: r.status, finish: null, usage: j?.usage ?? {}, costUsd: j?.usage?.cost ?? null, estimateUsd: 0, latencyMs: Date.now() - t0, error: String(JSON.stringify(j?.error ?? j)).slice(0, 300) });
          res.writeHead(502).end(JSON.stringify({ error: { message: String(JSON.stringify(j?.error ?? j)).slice(0, 400), type: "qr2_upstream" } }));
          return;
        }
        const usage = j?.usage ?? {};
        const inTok = Number(usage.prompt_tokens ?? 0);
        const outTok = Number(usage.completion_tokens ?? 0);
        const costReal = typeof usage.cost === "number" ? usage.cost : null;
        const costEst = (inTok * 0.2 + outTok * 1.2) / 1e6;
        const rec: RequestRecord = {
          at: new Date().toISOString(), sessionTag: sess.tag, model: String(j?.model ?? MODEL),
          status: r.status, finish: j?.choices?.[0]?.finish_reason ?? null,
          usage, costUsd: costReal, estimateUsd: costEst, latencyMs: Date.now() - t0,
        };
        this.requests.push(rec);
        if (this.ledgerPath) { try { require("node:fs").appendFileSync(this.ledgerPath, JSON.stringify(rec) + "\n"); } catch { /* best-effort */ } }
        const spent = costReal ?? costEst;
        const ph = String((sess.tag as any).phase ?? "?");
        this.spendByPhase.set(ph, (this.spendByPhase.get(ph) ?? 0) + spent);
        this.spendArm += spent;
        const ck = this.costByToken.get(token) ?? { real: 0, est: 0, n: 0, tag: sess.tag };
        ck.real += costReal ?? 0; ck.est += costEst; ck.n += 1;
        this.costByToken.set(token, ck);
        // Synthesize the OpenAI wire response (SSE if requested).
        const choice = j?.choices?.[0]?.message ?? {};
        const msg: any = { role: "assistant", content: typeof choice.content === "string" ? choice.content : (choice.content == null ? "" : JSON.stringify(choice.content)) };
        if (Array.isArray(choice.tool_calls) && choice.tool_calls.length > 0) msg.tool_calls = choice.tool_calls;
        const finish = Array.isArray(choice.tool_calls) && choice.tool_calls.length > 0 ? "tool_calls" : (j?.choices?.[0]?.finish_reason ?? "stop");
        if (!wantsStream) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ id: "qr2", object: "chat.completion", created: Math.floor(Date.now() / 1000), model: j?.model ?? MODEL, choices: [{ index: 0, message: msg, finish_reason: finish }], usage: { prompt_tokens: Number(usage.prompt_tokens ?? 0), completion_tokens: Number(usage.completion_tokens ?? 0), total_tokens: Number(usage.total_tokens ?? 0) } }));
          return;
        }
        res.writeHead(200, { "content-type": "text/event-stream" });
        const chunkBase = { id: "qr2", object: "chat.completion.chunk", created: Math.floor(Date.now() / 1000), model: j?.model ?? MODEL };
        res.write(`data: ${JSON.stringify({ ...chunkBase, choices: [{ index: 0, delta: { role: "assistant", content: msg.content, ...(msg.tool_calls ? { tool_calls: msg.tool_calls } : {}) }, finish_reason: null }] })}\n\n`);
        res.write(`data: ${JSON.stringify({ ...chunkBase, choices: [{ index: 0, delta: {}, finish_reason: finish }], usage: { prompt_tokens: Number(usage.prompt_tokens ?? 0), completion_tokens: Number(usage.completion_tokens ?? 0) } })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (e: any) {
        this.requests.push({ at: new Date().toISOString(), sessionTag: sess.tag, model: MODEL, status: 0, finish: null, usage: {}, costUsd: null, estimateUsd: 0, latencyMs: Date.now() - t0, error: String(e).slice(0, 200) });
        res.writeHead(502).end(JSON.stringify({ error: { message: String(e).slice(0, 300), type: "qr2_proxy" } }));
      }
    });
  }
}