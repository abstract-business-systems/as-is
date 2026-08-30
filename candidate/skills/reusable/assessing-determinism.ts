import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { RunningTestsOutput } from "./running-tests";

export interface AssessingDeterminismInput {
  readonly executionRuns: readonly RunningTestsOutput[];
}

export interface AssessingDeterminismOutput {
  readonly isDeterministic: boolean;
  readonly varianceScore: number;
  readonly flakyTestNames: readonly string[];
}

export const assessingDeterminismSkill: ReusableSkill<AssessingDeterminismInput, AssessingDeterminismOutput> = {
  name: "assessing-determinism",
  description: "Assesses execution determinism and test pass-rate variance across repeated runs.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: AssessingDeterminismInput): Promise<StepResult<AssessingDeterminismOutput>> {
    if (!input.executionRuns || input.executionRuns.length === 0) {
      return {
        status: "blocked",
        error: "No execution runs provided in assessing-determinism input",
      };
    }

    const allPassed = input.executionRuns.every((r) => r.passed);
    const passCount = input.executionRuns.filter((r) => r.passed).length;
    const varianceScore = 1.0 - (passCount / input.executionRuns.length);

    const data: AssessingDeterminismOutput = {
      isDeterministic: allPassed,
      varianceScore,
      flakyTestNames: allPassed ? [] : ["flaky-run-detected"],
    };

    return {
      status: "completed",
      data,
      evidence: [
        `Assessed determinism across ${input.executionRuns.length} run(s): isDeterministic=${allPassed}, variance=${varianceScore}`,
      ],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};