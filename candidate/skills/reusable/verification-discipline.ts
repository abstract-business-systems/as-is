import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface VerificationCheck {
  name: string;
  run: () => Promise<{ passed: boolean; output: string }>;
}

export interface VerificationInput {
  targetComponent: string;
  checks: readonly VerificationCheck[];
  requiredPassingThreshold?: number; // 1.0 for 100%
}

export interface VerificationOutput {
  allPassed: boolean;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failureReasons: readonly string[];
  evidence: readonly string[];
}

export const verificationDisciplineSkill: ReusableSkill<
  VerificationInput,
  VerificationOutput
> = {
  name: "verification-discipline",
  description: "Deterministic check execution, test reporting, and residual risk logging.",
  skillClass: "reusable",
  requiredTools: ["read"],

  async execute(
    context: SkillExecutionContext,
    input: VerificationInput
  ): Promise<StepResult<VerificationOutput>> {
    const { targetComponent, checks, requiredPassingThreshold = 1.0 } = input;

    if (checks.length === 0) {
      return {
        status: "failed",
        error: "Verification discipline requires at least one deterministic check",
      };
    }

    let passedCount = 0;
    const failureReasons: string[] = [];
    const evidence: string[] = [];

    for (const check of checks) {
      try {
        const result = await check.run();
        if (result.passed) {
          passedCount++;
          evidence.push(`Check PASS [${check.name}]: ${result.output}`);
        } else {
          failureReasons.push(`Check FAIL [${check.name}]: ${result.output}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        failureReasons.push(`Check ERROR [${check.name}]: ${msg}`);
      }
    }

    const passRatio = passedCount / checks.length;
    const allPassed = passRatio >= requiredPassingThreshold && failureReasons.length === 0;

    const output: VerificationOutput = {
      allPassed,
      totalChecks: checks.length,
      passedChecks: passedCount,
      failedChecks: checks.length - passedCount,
      failureReasons,
      evidence,
    };

    if (!allPassed) {
      return {
        status: "failed",
        data: output,
        evidence,
        spend: { units: 2, wallClockSeconds: 15 },
        error: `Verification failed: ${failureReasons.join("; ")}`,
      };
    }

    return {
      status: "completed",
      data: output,
      evidence: [
        `Verification completed successfully for ${targetComponent}`,
        ...evidence,
      ],
      spend: { units: 2, wallClockSeconds: 15 },
    };
  },
};
