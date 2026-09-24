// QR2 machinery configuration. Host-side constants shared by all modules.
// Frozen by Gate 3: arm ceiling $3.00 (human-approved at Gate 2b); per-phase caps per fixture-spec §7.
// Runner model: overridable for separate model-sensitivity experiments (never pooled with preset runs).
export const MODEL = process.env.QR2_RUNNER_MODEL ?? "@preset/abs-medium";
export const REASONING = "high";
export const ARM_CEILING_USD = 3.0;
export const CUMULATIVE_CAP_USD = 2.98;

export const PHASE_BUDGETS: Record<string, { expected: number; hardCap: number }> = {
  F0: { expected: 0.62, hardCap: 0.76 },
  F1: { expected: 0.3, hardCap: 0.38 },
  F2: { expected: 0.14, hardCap: 0.18 },
  F3: { expected: 0.42, hardCap: 0.52 },
  F4: { expected: 0.42, hardCap: 0.52 },
  F5: { expected: 0.5, hardCap: 0.62 },
};
export const PHASE_ORDER = ["F0", "F1", "F2", "F3", "F4", "F5"] as const;
export type PhaseId = (typeof PHASE_ORDER)[number];

// Session wall clocks (self-limits inside supervisor hard timers).
export const ROOT_SESSION_MS = 25 * 60_000;
export const CHILD_SESSION_MS = 12 * 60_000;
export const OBSERVE_POLL_MS = 400;

// File-op telemetry content capture ceiling (per op; full capture up to this size).
export const TELEMETRY_CONTENT_MAX = 256 * 1024;

export const SESSION_TIMEOUT_MARGIN_MS = 60_000;

export const REQUIRED_ROLES = [
  "composition-root",
  "routing",
  "predicate-matcher",
  "delivery-coordinator",
  "file-sink",
  "memory-sink",
  "stdout-sink",
  "dead-letter-sink",
] as const;

export const EXEC_ROLES = ["implement", "analyze", "validate"] as const;
export type ExecRole = (typeof EXEC_ROLES)[number];

// Consultation requirements per fixture-spec §3.
export const CONSULTATIONS: Record<PhaseId, string[]> = {
  F0: ["composition-root", "delivery-coordinator", "file-sink", "memory-sink"],
  F1: ["routing", "predicate-matcher"],
  F2: ["routing"],
  F3: ["composition-root", "routing", "delivery-coordinator"],
  F4: ["composition-root", "delivery-coordinator", "stdout-sink"],
  F5: ["composition-root", "routing", "delivery-coordinator", "memory-sink", "dead-letter-sink"],
};
// F5 splits: parent chain (root/routing/coordinator) vs dead-letter child.
export const F5_PARENT_CONSULTS = ["composition-root", "routing", "delivery-coordinator"];
export const F5_DEADLETTER_CONSULTS = ["dead-letter-sink"];

// Phase attribution for sessions: which phase a session belongs to.
export type SessionTag = {
  run: string;
  arm: string;
  phase: string;
  sessionId: string;
  componentRole: string;
  parentRole: string | null;
  level: number;
};

export const KEY_PATH = "/home/vc/.pi/agent/auth.json";

export function sha256(s: string | Buffer): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("node:crypto").createHash("sha256").update(s).digest("hex");
}