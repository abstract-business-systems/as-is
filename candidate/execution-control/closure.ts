/**
 * Fail-Closed Parent Closure Evaluator
 * Candidate realization for the Agentic Development System.
 */

import type {
  PlanEnvelope,
  ChildTerminalResult,
  ParentClosureOutcome,
  ParentClosureStatus,
  ChildClosureDisposition,
  ChildSpendRecord,
} from "./types";

export class ParentClosureEvaluator {
  /**
   * Evaluates the parent closure eligibility and terminal outcome
   * based on the plan envelope and the terminal child results.
   */
  public evaluate(
    plan: PlanEnvelope,
    childResults: readonly ChildTerminalResult[]
  ): ParentClosureOutcome {
    const childMap = new Map<string, ChildTerminalResult>();
    for (const res of childResults) {
      childMap.set(res.childId, res);
    }

    const unaccountedChildren: string[] = [];
    const missingEvidence: string[] = [];
    const childDispositions: Record<string, ChildClosureDisposition> = {};

    let hasFailedChild = false;
    let hasCancelledChild = false;
    let hasNonTerminalChild = false;
    let allCompletedAndValidated = true;

    let totalUnitsUsed = 0;
    let totalWallClockSeconds = 0;

    for (const expectedChild of plan.children) {
      const result = childMap.get(expectedChild.id);

      if (!result) {
        unaccountedChildren.push(expectedChild.id);
        allCompletedAndValidated = false;
        hasNonTerminalChild = true;
        childDispositions[expectedChild.id] = {
          status: "ready",
          eligible: false,
          reasons: ["Child result is missing from terminal accounting report"],
        };
        continue;
      }

      totalUnitsUsed += result.recordedSpend.unitsUsed;
      totalWallClockSeconds += result.recordedSpend.wallClockSeconds;

      const reasons: string[] = [];
      let isEligible = false;

      switch (result.taskStatus) {
        case "failed":
          hasFailedChild = true;
          allCompletedAndValidated = false;
          reasons.push("Child task terminated with 'failed' status");
          break;

        case "cancelled":
          hasCancelledChild = true;
          allCompletedAndValidated = false;
          reasons.push("Child task terminated with 'cancelled' status");
          break;

        case "active":
        case "ready":
        case "blocked":
        case "awaiting-approval":
          hasNonTerminalChild = true;
          allCompletedAndValidated = false;
          reasons.push(`Child task is in non-terminal status '${result.taskStatus}'`);
          break;

        case "completed":
          // Validate child validation evidence
          if (!result.validationEvidence || !result.validationEvidence.passed) {
            allCompletedAndValidated = false;
            reasons.push("Child validation evidence is missing or marked failed");
            missingEvidence.push(
              `Child '${expectedChild.id}' validation failed: ${result.validationEvidence?.details.join("; ") ?? "no details"}`
            );
          }

          // Validate child integration evidence
          if (!result.integrationEvidence) {
            allCompletedAndValidated = false;
            reasons.push("Child integration evidence is missing");
            missingEvidence.push(`Child '${expectedChild.id}' has no integration evidence record`);
          } else {
            const intEv = result.integrationEvidence;
            if (!intEv.verified) {
              allCompletedAndValidated = false;
              reasons.push("Child integration evidence is not verified");
              missingEvidence.push(`Child '${expectedChild.id}' integration not verified`);
            }
            if (!intEv.cleanScope) {
              allCompletedAndValidated = false;
              reasons.push("Child integration modified paths outside admitted scope");
              missingEvidence.push(`Child '${expectedChild.id}' has dirty scope violations`);
            }
            if (!intEv.protectedInputsUnmodified) {
              allCompletedAndValidated = false;
              reasons.push("Child integration modified protected input files");
              missingEvidence.push(`Child '${expectedChild.id}' altered protected inputs`);
            }
          }

          if (reasons.length === 0) {
            isEligible = true;
          }
          break;
      }

      childDispositions[expectedChild.id] = {
        status: result.taskStatus,
        eligible: isEligible,
        reasons,
      };
    }

    const totalSpend: ChildSpendRecord = {
      unitsUsed: totalUnitsUsed,
      wallClockSeconds: totalWallClockSeconds,
    };

    // Determine parent outcome status
    let status: ParentClosureStatus;
    let isTerminal = false;
    let canCommit = false;
    let summary: string;

    if (hasFailedChild) {
      status = "failed";
      isTerminal = true;
      canCommit = false;
      summary = `Parent task failed: one or more child tasks failed [${Object.entries(childDispositions)
        .filter(([_, d]) => d.status === "failed")
        .map(([id]) => id)
        .join(", ")}]`;
    } else if (hasCancelledChild) {
      status = "cancelled";
      isTerminal = true;
      canCommit = false;
      summary = `Parent task cancelled: one or more child tasks were cancelled [${Object.entries(childDispositions)
        .filter(([_, d]) => d.status === "cancelled")
        .map(([id]) => id)
        .join(", ")}]`;
    } else if (unaccountedChildren.length > 0 || hasNonTerminalChild || missingEvidence.length > 0) {
      status = "ineligible";
      isTerminal = false;
      canCommit = false;
      summary = `Parent task is not eligible for closure: pending child tasks or missing verification evidence (${
        unaccountedChildren.length > 0
          ? `unaccounted: ${unaccountedChildren.join(", ")}`
          : missingEvidence.join("; ")
      })`;
    } else if (allCompletedAndValidated) {
      status = "eligible";
      isTerminal = true;
      canCommit = true;
      summary = `Parent task is eligible for closure: all ${plan.children.length} child tasks completed, verified, and integrated successfully.`;
    } else {
      status = "ineligible";
      isTerminal = false;
      canCommit = false;
      summary = "Parent task closure conditions not satisfied.";
    }

    return {
      status,
      isTerminal,
      canCommit,
      summary,
      childDispositions,
      missingEvidence,
      unaccountedChildren,
      totalSpend,
    };
  }
}
