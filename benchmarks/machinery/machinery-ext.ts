// QR2 machinery: session extension loaded into EVERY pi session (both arms, all levels).
// Provides the harness facility tools (freeze_manifest, delegate, observe, checkpoint)
// and the file-op telemetry stream (JSONL, append-only, per-session).
//
// Telemetry: pi.on("tool_call")/("tool_result") intercept write/edit (before/after hash +
// content up to TELEMETRY_CONTENT_MAX) and bash (command + exit). Bash-originated tree
// changes are additionally reconciled by the supervisor's post-session tree diff.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { CHILD_SESSION_MS } from "./config.ts";
import { appendFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const SUPERVISOR = process.env.QR2_SUPERVISOR ?? "";
const TOKEN = process.env.QR2_TOKEN ?? "";
const EVENTS = process.env.QR2_EVENTS_FILE ?? "";
const SESSION = JSON.parse(process.env.QR2_SESSION_JSON ?? "{}");
const TELEMETRY_CONTENT_MAX = 256 * 1024;

let seq = 0;
function emit(op: Record<string, unknown>) {
  if (!EVENTS) return;
  seq += 1;
  const rec = JSON.stringify({ seq, at: new Date().toISOString(), session: SESSION.sessionId, ...op });
  try { appendFileSync(EVENTS, rec + "\n"); } catch { /* machinery-owned dir; failures surface in reconciliation */ }
}

function hashFile(p: string): string | null {
  try { return createHash("sha256").update(readFileSync(p)).digest("hex"); } catch { return null; }
}

async function supervisorPost(path: string, body: unknown): Promise<any> {
  const r = await fetch(`${SUPERVISOR}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(j?.error?.message ?? r.status));
  return j;
}

const manifestTool = {
  name: "freeze_manifest",
  label: "Freeze path manifest",
  description:
    "First act of the build: submit the role-based path manifest (every role -> concrete implementation members, authoritative record, owned subtree, reserved child subtrees, test selectors, administrative artifact classes, entrypoint). The harness validates disjoint ownership and freezes it for this run; all later scope checks use it.",
  parameters: Type.Object({
    manifest: Type.Unknown({ description: "The manifest object per the harness manifest schema (see HARNESS.md)." }),
  }),
  async execute(_id: string, params: any) {
    try {
      // Accommodation for runners that double-encode object args as JSON strings (observed: GLM 5.3 Flash).
      let manifest = params.manifest;
      for (let i = 0; typeof manifest === "string" && i < 2; i++) {
        try { manifest = JSON.parse(manifest); } catch { break; }
      }
      const r = await supervisorPost("/freeze-manifest", { manifest });
      return { content: [{ type: "text" as const, text: r.ok ? `Manifest frozen. Stubs planted: ${r.stubs.join(", ")}` : `MANIFEST REJECTED: ${r.errors.join("; ")}` }], details: r };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `MANIFEST ERROR: ${String(e).slice(0, 300)}` }], details: { error: String(e) } };
    }
  },
};

const delegateTool = {
  name: "delegate",
  label: "Delegate child session",
  description:
    "Start a bounded child build/analysis/validation session for a manifest component role. Returns immediately with the session id and the resolved delegation configuration (override -> role -> alias passthrough -> project default). Observe the handoff with observe() before integrating.",
  parameters: Type.Object({
    component: Type.String({ description: "Manifest component role, e.g. delivery-coordinator." }),
    role: Type.String({ description: "Executor contract: implement (write-capable, no commit), analyze (read-only), validate (read-only)." }),
    task: Type.String({ description: "Full assignment for the child session: task, acceptance conditions, consultation requirements, handoff requirements." }),
    model: Type.Optional(Type.String({ description: "Explicit authorized model override." })),
    thinking: Type.Optional(Type.String({ description: "Explicit authorized thinking-level override." })),
  }),
  async execute(_id: string, params: any) {
    emit({ kind: "delegate-start", component: params.component, execRole: params.role, model: params.model ?? null, thinking: params.thinking ?? null });
    try {
      const r = await supervisorPost("/delegate", params);
      if (r.denied) {
        emit({ kind: "delegate-denied", component: params.component, reason: r.reason });
        return { content: [{ type: "text" as const, text: `DELEGATION REFUSED: ${r.reason}` }], details: r };
      }
      emit({ kind: "delegate-started", childSessionId: r.sessionId, component: params.component, resolved: r.resolved });
      return {
        content: [{ type: "text" as const, text: `Child session started: ${r.sessionId} (role=${params.role}, component=${params.component}). Resolved configuration: ${JSON.stringify(r.resolved)}. The child runs concurrently; observe its handoff with observe("${r.sessionId}") before integrating.` }],
        details: r,
      };
    } catch (e: any) {
      emit({ kind: "delegate-error", component: params.component, error: String(e).slice(0, 200) });
      return { content: [{ type: "text" as const, text: `DELEGATION ERROR: ${String(e).slice(0, 300)}` }], details: { error: String(e) } };
    }
  },
};

const observeTool = {
  name: "observe",
  label: "Observe child handoff",
  description:
    "Wait for a delegated child session to finish and return its handoff (handoff file location + presence, session status, resulting tree hash). Observe before integrating; the handoff is the only valid integration input.",
  parameters: Type.Object({
    session_id: Type.String({ description: "The child session id returned by delegate." }),
  }),
  async execute(_id: string, params: any, signal?: AbortSignal) {
    emit({ kind: "observe-start", childSessionId: params.session_id });
    try {
      // Bounded short polls (240s each — under the fetch timeout); loop until terminal status.
      let r: any = { status: "still-running" };
      const deadline = Date.now() + CHILD_SESSION_MS + 90_000;
      while (r.status === "still-running" && Date.now() < deadline) {
        if (signal?.aborted) throw new Error("observe aborted");
        r = await supervisorPost("/observe", { session_id: params.session_id, poll: true });
      }
      emit({ kind: "observe-done", childSessionId: params.session_id, status: r.status, handoffPresent: r.handoffPresent });
      const text = r.status === "ok"
        ? `Child ${params.session_id} finished (status ok). Handoff file: ${r.handoffPath} (${r.handoffPresent ? "present" : "MISSING — report and do not invent its content"}). Child spend: $${Number(r.spendUsd).toFixed(4)}. Read the handoff file and integrate only after reviewing it.`
        : `Child ${params.session_id} ended with status: ${r.status}. Handoff file: ${r.handoffPath} (${r.handoffPresent ? "present" : "MISSING"}). Inspect the workspace for partial artifacts; report honestly.`;
      return { content: [{ type: "text" as const, text }], details: r };
    } catch (e: any) {
      emit({ kind: "observe-error", childSessionId: params.session_id, error: String(e).slice(0, 200) });
      return { content: [{ type: "text" as const, text: `OBSERVE ERROR: ${String(e).slice(0, 300)}` }], details: { error: String(e) } };
    }
  },
};

const checkpointTool = {
  name: "checkpoint",
  label: "Create integration checkpoint",
  description:
    "Create an immutable, harness-recorded checkpoint of the current tree after a completed integration step. Returns the checkpoint id and tree hash. Checkpoints are append-only; they cannot be modified or removed.",
  parameters: Type.Object({
    label: Type.String({ description: "Short label, e.g. integrate-file-sink." }),
  }),
  async execute(_id: string, params: any) {
    emit({ kind: "checkpoint-start", label: params.label });
    try {
      const r = await supervisorPost("/checkpoint", { label: String(params.label).slice(0, 80) });
      emit({ kind: "checkpoint-done", checkpointId: r.checkpointId, treeHash: r.treeHash });
      return { content: [{ type: "text" as const, text: `Checkpoint ${r.checkpointId} recorded (tree hash ${r.treeHash.slice(0, 12)}…).` }], details: r };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `CHECKPOINT ERROR: ${String(e).slice(0, 300)}` }], details: { error: String(e) } };
    }
  },
};

export default async function machineryExt(pi: ExtensionAPI): Promise<void> {
  pi.registerTool(manifestTool);
  pi.registerTool(delegateTool);
  pi.registerTool(observeTool);
  pi.registerTool(checkpointTool);

  // File-op telemetry: intercept write/edit before/after; bash command log.
  const pendingBefore = new Map<string, { path: string; beforeHash: string | null }>();
  pi.on("tool_call", async (event: any) => {
    const name = event.toolName;
    if (name === "write" || name === "edit") {
      const p = String(event.input?.path ?? event.input?.file_path ?? "");
      if (p) {
        pendingBefore.set(event.toolCallId, { path: p, beforeHash: hashFile(p) });
        emit({ kind: "fileop-start", tool: name, path: p, beforeHash: pendingBefore.get(event.toolCallId)?.beforeHash ?? null });
      }
    } else if (name === "bash") {
      emit({ kind: "bash", command: String(event.input?.command ?? "").slice(0, 2000) });
    } else if (name === "delegate" || name === "observe" || name === "freeze_manifest" || name === "checkpoint") {
      emit({ kind: "tool-call", tool: name, args: JSON.stringify(event.input ?? {}).slice(0, 1000) });
    }
  });
  pi.on("tool_result", async (event: any) => {
    const name = event.toolName;
    if (name === "write" || name === "edit") {
      const pend = pendingBefore.get(event.toolCallId);
      pendingBefore.delete(event.toolCallId);
      if (pend) {
        const afterHash = hashFile(pend.path);
        let content: string | undefined;
        try {
          const st = require("node:fs").statSync(pend.path);
          if (st.isFile() && st.size <= TELEMETRY_CONTENT_MAX) content = readFileSync(pend.path, "utf8");
        } catch { /* deleted */ }
        emit({ kind: "fileop", tool: name, path: pend.path, beforeHash: pend.beforeHash, afterHash, content, isError: Boolean(event.isError) });
      }
    } else if (name === "bash") {
      emit({ kind: "bash-result", isError: Boolean(event.isError), summary: JSON.stringify(event.content ?? []).slice(0, 500) });
    }
  });
  mkdirSync(require("node:path").dirname(EVENTS), { recursive: true });
  emit({ kind: "session-start", session: SESSION });
}
