import { expect, test } from "bun:test";
import { transitionCheckpoint, transitionLease, transitionOperation, validateCheckpoint, validateLease, validateOperation } from "./adaptive-session-budgeting";

const lease = { schemaVersion: 1, recordId: "r", componentPath: "skills/x", taskRevision: "1", attempt: 1, authority: { id: "parent", authorizedAt: "2026-01-01T00:00:00Z" }, state: "authorized", hardWallClockSeconds: 300, hardCostUsd: "unavailable", initialWallClockSeconds: 120, initialCostUsd: "unavailable", cumulativeWallClockSeconds: 120, cumulativeCostUsd: "unavailable", observedElapsedSeconds: 0, observedCostUsd: "unavailable", remainingWallClockSeconds: 180, remainingCostUsd: "unavailable", leaseId: "l1", issuedAt: "2026-01-01T00:00:00Z", expiresAt: "2026-01-01T00:02:00Z", leaseWallClockSeconds: 120, leaseCostUsd: "unavailable", decisionEvidence: { reasonClass: "initial" } } as const;
const checkpoint = { schemaVersion: 1, checkpointId: "c1", recordId: "r", leaseId: "l1", taskRevision: "1", attempt: 1, createdAt: "2026-01-01T00:01:00Z", state: "requested", progress: "started", validation: [], blockers: [], changedArtifacts: ["skills/x/file.ts"], nextAction: "continue", accounting: {} } as const;
const operation = { schemaVersion: 1, operationId: "o1", operation: "checkpoint", recordId: "r", leaseId: "l1", taskRevision: "1", attempt: 1, authority: { id: "parent", revision: 1 }, requestedAt: "2026-01-01T00:01:00Z", deadlineAt: "2026-01-01T00:01:30Z", reasonClass: "soft-threshold", requiredEvidence: ["task-status"], state: "requested", actor: "parent", createdAt: "2026-01-01T00:01:00Z" } as const;

test("validates records and permits only documented transitions", () => {
  expect(validateLease(lease).ok).toBe(true);
  expect(validateCheckpoint(checkpoint).ok).toBe(true);
  expect(validateOperation(operation).ok).toBe(true);
  expect(transitionLease(lease as never, "running").ok).toBe(true);
  expect(transitionLease(lease as never, "closed").ok).toBe(false);
  expect(transitionCheckpoint(checkpoint as never, "writing").ok).toBe(true);
  expect(transitionOperation(operation as never, "acknowledged").ok).toBe(true);
});

test("rejects unknown fields and unsafe records", () => {
  expect(validateLease({ ...lease, extra: true }).ok).toBe(false);
  expect(validateLease({ ...lease, cumulativeWallClockSeconds: 301 }).ok).toBe(false);
  expect(validateCheckpoint({ ...checkpoint, state: "failed" }).ok).toBe(false);
  expect(validateOperation({ ...operation, operation: "resume" }).ok).toBe(false);
});
