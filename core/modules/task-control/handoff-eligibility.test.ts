import { expect, test } from "bun:test";
import { evaluateHandoffEligibility, type HandoffFacts } from "./handoff-eligibility.ts";

const complete: HandoffFacts = {
  record: { durable: true, status: "completed", validationEvidence: true, expertEvidence: true, resultEvidence: true },
  descendants: { allTerminal: true, failedOrCancelledAccounted: true },
  commit: { sha: "abc123", exists: true, scoped: true },
  integration: { status: "integrated", callerHeadAncestry: true },
};

test("accepts complete handoff facts", () => {
  expect(evaluateHandoffEligibility(complete)).toEqual({ eligible: true, blockers: [] });
});

test("reports every missing completion gate deterministically", () => {
  const facts: HandoffFacts = {
    record: { durable: false, status: "active", validationEvidence: false, expertEvidence: false, resultEvidence: false },
    descendants: { allTerminal: false, failedOrCancelledAccounted: false },
    commit: { sha: null, exists: false, scoped: false },
    integration: { status: "pending-parent-integration", callerHeadAncestry: false },
  };
  expect(evaluateHandoffEligibility(facts)).toEqual({
    eligible: false,
    blockers: [
      "record-not-durable", "record-not-completed", "validation-evidence-missing",
      "expert-evidence-missing", "result-evidence-missing", "descendants-not-terminal",
      "descendants-not-accounted", "scoped-commit-missing", "pending-parent-integration",
    ],
  });
});

test("distinguishes commit, ancestry, and integration blockers", () => {
  expect(evaluateHandoffEligibility({ ...complete, commit: { sha: "abc123", exists: true, scoped: false } }).blockers).toEqual(["commit-out-of-scope"]);
  expect(evaluateHandoffEligibility({ ...complete, integration: { status: "unreachable", callerHeadAncestry: false } }).blockers).toEqual(["caller-ancestry-unverified"]);
  expect(evaluateHandoffEligibility({ ...complete, integration: { status: "not-committed", callerHeadAncestry: true } }).blockers).toEqual(["caller-integration-missing"]);
});
