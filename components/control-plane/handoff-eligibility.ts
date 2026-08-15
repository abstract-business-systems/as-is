export type IntegrationStatus =
  | "not-committed"
  | "pending-parent-integration"
  | "integrated"
  | "unreachable";

export type HandoffFacts = {
  record: {
    durable: boolean;
    status: string | null;
    validationEvidence: boolean;
    expertEvidence: boolean;
    resultEvidence: boolean;
  };
  descendants: {
    allTerminal: boolean;
    failedOrCancelledAccounted: boolean;
  };
  commit: {
    sha: string | null;
    exists: boolean;
    scoped: boolean;
  };
  integration: {
    status: IntegrationStatus;
    callerHeadAncestry: boolean;
  };
};

export type HandoffDecision = {
  eligible: boolean;
  blockers: readonly string[];
};

/**
 * Parent-side completion gate. This is deliberately pure: adapters collect
 * Git and durable-record observations, while this function makes the same
 * decision for every caller and fails closed for missing evidence.
 */
export const evaluateHandoffEligibility = (facts: HandoffFacts): HandoffDecision => {
  const blockers: string[] = [];
  if (!facts.record.durable) blockers.push("record-not-durable");
  if (facts.record.status !== "completed") blockers.push("record-not-completed");
  if (!facts.record.validationEvidence) blockers.push("validation-evidence-missing");
  if (!facts.record.expertEvidence) blockers.push("expert-evidence-missing");
  if (!facts.record.resultEvidence) blockers.push("result-evidence-missing");
  if (!facts.descendants.allTerminal) blockers.push("descendants-not-terminal");
  if (!facts.descendants.failedOrCancelledAccounted) blockers.push("descendants-not-accounted");
  if (!facts.commit.sha || !facts.commit.exists) blockers.push("scoped-commit-missing");
  else if (!facts.commit.scoped) blockers.push("commit-out-of-scope");
  if (facts.integration.status === "pending-parent-integration") blockers.push("pending-parent-integration");
  else if (facts.integration.status === "unreachable" || !facts.integration.callerHeadAncestry) blockers.push("caller-ancestry-unverified");
  else if (facts.integration.status !== "integrated") blockers.push("caller-integration-missing");
  return { eligible: blockers.length === 0, blockers };
};
