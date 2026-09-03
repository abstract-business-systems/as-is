export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const states = {
  lease: ["authorized", "running", "checkpointing", "paused", "exhausted", "revoked", "closed"],
  checkpoint: ["requested", "writing", "ready", "blocked", "failed", "budget-stopped", "superseded"],
  operation: ["requested", "acknowledged", "checkpointing", "ready", "blocked", "non-cooperative", "timed-out", "failed", "budget-stopped", "rejected", "superseded"],
} as const;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown) => typeof v === "string" && v.length > 0;
const positive = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v > 0;
const nonNegative = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const exact = (object: Record<string, unknown>, allowed: readonly string[]) => Object.keys(object).filter((key) => !allowed.includes(key));
const fail = (...errors: string[]): Result<never> => ({ ok: false, errors });
const validState = (value: unknown, allowed: readonly string[]) => typeof value === "string" && (allowed as readonly string[]).includes(value);

export type LeaseRecord = {
  schemaVersion: number; recordId: string; componentPath: string; taskRevision: string; attempt: number;
  authority: Record<string, unknown>; state: typeof states.lease[number];
  hardWallClockSeconds: number; hardCostUsd: number | "unavailable";
  initialWallClockSeconds: number; initialCostUsd: number | "unavailable";
  cumulativeWallClockSeconds: number; cumulativeCostUsd: number | "unavailable";
  observedElapsedSeconds: number; observedCostUsd: number | "unavailable";
  remainingWallClockSeconds: number; remainingCostUsd: number | "unavailable";
  leaseId: string; issuedAt: string; expiresAt: string; leaseWallClockSeconds: number; leaseCostUsd: number | "unavailable";
  parentLeaseId?: string; sessionRef?: Record<string, unknown>; worktreeRef?: Record<string, unknown>; decisionEvidence: Record<string, unknown>;
};

export const validateLease = (input: unknown): Result<LeaseRecord> => {
  if (!isRecord(input)) return fail("record must be an object");
  const allowed = ["schemaVersion","recordId","componentPath","taskRevision","attempt","authority","state","hardWallClockSeconds","hardCostUsd","initialWallClockSeconds","initialCostUsd","cumulativeWallClockSeconds","cumulativeCostUsd","observedElapsedSeconds","observedCostUsd","remainingWallClockSeconds","remainingCostUsd","leaseId","issuedAt","expiresAt","leaseWallClockSeconds","leaseCostUsd","parentLeaseId","sessionRef","worktreeRef","decisionEvidence"] as const;
  const unknown = exact(input, allowed); if (unknown.length) return fail(`unknown fields: ${unknown.join(",")}`);
  const requiredText = ["recordId","componentPath","taskRevision","leaseId","issuedAt","expiresAt"];
  if (requiredText.some((key) => !text(input[key]))) return fail("required identity or timestamp is invalid");
  if (input.schemaVersion !== 1 || !positive(input.attempt) || !isRecord(input.authority) || !validState(input.state, states.lease) || !isRecord(input.decisionEvidence)) return fail("schema, authority, attempt, state, or evidence is invalid");
  const wall = ["hardWallClockSeconds","initialWallClockSeconds","cumulativeWallClockSeconds","observedElapsedSeconds","remainingWallClockSeconds","leaseWallClockSeconds"];
  if (wall.some((key) => !nonNegative(input[key]))) return fail("wall-clock accounting is invalid");
  if (!positive(input.hardWallClockSeconds) || !positive(input.initialWallClockSeconds) || !positive(input.leaseWallClockSeconds) || input.initialWallClockSeconds > input.hardWallClockSeconds || input.cumulativeWallClockSeconds > input.hardWallClockSeconds || input.leaseWallClockSeconds > input.hardWallClockSeconds || input.remainingWallClockSeconds > input.hardWallClockSeconds) return fail("wall-clock ceiling or allocation is invalid");
  for (const key of ["hardCostUsd","initialCostUsd","cumulativeCostUsd","observedCostUsd","remainingCostUsd","leaseCostUsd"]) if (input[key] !== "unavailable" && !nonNegative(input[key])) return fail("cost accounting is invalid");
  return { ok: true, value: input as LeaseRecord };
};

const leaseTransitions: Record<string, readonly string[]> = { authorized: ["running"], running: ["checkpointing","exhausted","revoked"], checkpointing: ["paused","exhausted","revoked"], paused: ["running","closed"], exhausted: ["closed"], revoked: ["closed"], closed: [] };
export const transitionLease = (from: LeaseRecord, to: LeaseRecord["state"]): Result<LeaseRecord["state"]> => leaseTransitions[from.state].includes(to) ? { ok: true, value: to } : fail(`invalid lease transition: ${from.state}->${to}`);

export type CheckpointRecord = Record<string, unknown> & { schemaVersion: number; checkpointId: string; recordId: string; leaseId: string; taskRevision: string; attempt: number; createdAt: string; state: typeof states.checkpoint[number]; progress: string; validation: unknown; blockers: unknown; changedArtifacts: string[]; nextAction: string; accounting: Record<string, unknown> };
const checkpointFields = ["schemaVersion","checkpointId","recordId","leaseId","taskRevision","attempt","createdAt","state","progress","validation","blockers","changedArtifacts","nextAction","accounting","sessionRef","worktreeRef","failure","supersedes"] as const;
export const validateCheckpoint = (input: unknown): Result<CheckpointRecord> => {
  if (!isRecord(input)) return fail("checkpoint must be an object");
  const unknown = exact(input, checkpointFields); if (unknown.length) return fail(`unknown fields: ${unknown.join(",")}`);
  if (input.schemaVersion !== 1 || ["checkpointId","recordId","leaseId","taskRevision","createdAt","progress","nextAction"].some((key) => !text(input[key])) || !positive(input.attempt) || !validState(input.state, states.checkpoint) || !Array.isArray(input.changedArtifacts) || input.changedArtifacts.some((v) => !text(v)) || !isRecord(input.accounting)) return fail("checkpoint fields are invalid");
  if (input.state === "failed" && !isRecord(input.failure)) return fail("failed checkpoint requires failure");
  return { ok: true, value: input as CheckpointRecord };
};
const checkpointTransitions: Record<string, readonly string[]> = { requested: ["writing"], writing: ["ready","failed","budget-stopped"], ready: ["blocked","superseded"], blocked: ["superseded"], failed: ["superseded"], "budget-stopped": ["superseded"], superseded: [] };
export const transitionCheckpoint = (from: CheckpointRecord, to: CheckpointRecord["state"]): Result<CheckpointRecord["state"]> => checkpointTransitions[from.state].includes(to) ? { ok: true, value: to } : fail(`invalid checkpoint transition: ${from.state}->${to}`);

export type OperationRecord = Record<string, unknown> & { schemaVersion: number; operationId: string; operation: "checkpoint"; recordId: string; leaseId: string; taskRevision: string; attempt: number; state: typeof states.operation[number]; actor: string; createdAt: string };
const operationFields = ["schemaVersion","operationId","operation","recordId","leaseId","taskRevision","attempt","authority","requestedAt","deadlineAt","reasonClass","requiredEvidence","responseDeadlineAt","state","actor","createdAt","accounting","checkpointRef","sessionRef","worktreeRef","failure"] as const;
export const validateOperation = (input: unknown): Result<OperationRecord> => {
  if (!isRecord(input)) return fail("operation must be an object");
  const unknown = exact(input, operationFields); if (unknown.length) return fail(`unknown fields: ${unknown.join(",")}`);
  if (input.schemaVersion !== 1 || !text(input.operationId) || input.operation !== "checkpoint" || ["recordId","leaseId","taskRevision","actor","createdAt"].some((key) => !text(input[key])) || !positive(input.attempt) || !validState(input.state, states.operation)) return fail("operation fields are invalid");
  if (!text(input.requestedAt) || !text(input.deadlineAt) || !text(input.reasonClass) || !isRecord(input.authority) || !Array.isArray(input.requiredEvidence)) return fail("operation admission fields are invalid");
  return { ok: true, value: input as OperationRecord };
};
const operationTransitions: Record<string, readonly string[]> = { requested: ["acknowledged","rejected","timed-out","non-cooperative","failed","budget-stopped"], acknowledged: ["checkpointing","timed-out","non-cooperative","failed","budget-stopped"], checkpointing: ["ready","blocked","failed","budget-stopped"], ready: ["superseded"], blocked: ["superseded"], "non-cooperative": [], "timed-out": [], failed: [], "budget-stopped": [], rejected: [], superseded: [] };
export const transitionOperation = (from: OperationRecord, to: OperationRecord["state"]): Result<OperationRecord["state"]> => operationTransitions[from.state].includes(to) ? { ok: true, value: to } : fail(`invalid operation transition: ${from.state}->${to}`);
