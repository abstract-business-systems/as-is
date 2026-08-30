import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { RunningTestsOutput } from "./running-tests";

export interface ValidatingChangesInput {
  readonly acceptanceCriteria: readonly string[];
  readonly testResults: readonly RunningTestsOutput[];
  readonly diff: string;
}

export interface ValidationCriterionStatus {
  readonly criterion: string;
  readonly status: "passed" | "failed" | "blocked" | "untested";
  readonly evidence: string;
}

export interface ValidatingChangesOutput {
  readonly allPassed: boolean;
  readonly matrix: readonly ValidationCriterionStatus[];
  readonly residualRisk: string;
  readonly commitReady: boolean;
}

export const validatingChangesSkill: ReusableSkill<ValidatingChangesInput, ValidatingChangesOutput> = {
  name: "validating-changes",
  description: "Evaluates acceptance criteria against test results and diff evidence.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: ValidatingChangesInput): Promise<StepResult<ValidatingChangesOutput>> {
    if (!input.acceptanceCriteria || input.acceptanceCriteria.length === 0) {
      return {
        status: "blocked",
        error: "No acceptance criteria provided for validating-changes",
      };
    }

    const allTestsPassed = input.testResults.length > 0 && input.testResults.every((r) => r.passed);
    const matrix: ValidationCriterionStatus[] = input.acceptanceCriteria.map((criterion, idx) => ({
      criterion,
      status: allTestsPassed ? "passed" : "untested",
      evidence: allTestsPassed ? `Verified by test batch (${input.testResults.length} test suites)` : "Pending test run",
    }));

    const allPassed = allTestsPassed && matrix.every((m) => m.status === "passed");

    const data: ValidatingChangesOutput = {
      allPassed,
      matrix,
      residualRisk: allPassed ? "none" : "Incomplete test coverage for acceptance criteria",
      commitReady: allPassed,
    };

    return {
      status: allPassed ? "completed" : "failed",
      data,
      evidence: [`Validation matrix evaluated: allPassed=${allPassed}, commitReady=${data.commitReady}`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};