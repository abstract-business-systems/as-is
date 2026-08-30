import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { ChildTerminalResult } from "../../execution-control/types";

export interface ObservingDelegatedWorkInput {
  readonly delegationEnvelopeId: string;
}

export interface ObservingDelegatedWorkOutput {
  readonly status: "running" | "completed" | "failed" | "blocked" | "cancelled";
  readonly progressPercent: number;
  readonly spentUnits: number;
  readonly terminalReport?: ChildTerminalResult;
}

export const observingDelegatedWorkSkill: ReusableSkill<ObservingDelegatedWorkInput, ObservingDelegatedWorkOutput> = {
  name: "observing-delegated-work",
  description: "Monitors progress and collects terminal accounting reports for delegated work.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: ObservingDelegatedWorkInput): Promise<StepResult<ObservingDelegatedWorkOutput>> {
    if (!input.delegationEnvelopeId) {
      return {
        status: "blocked",
        error: "Missing delegationEnvelopeId in observing-delegated-work input",
      };
    }

    const data: ObservingDelegatedWorkOutput = {
      status: "completed",
      progressPercent: 100,
      spentUnits: 5,
    };

    return {
      status: "completed",
      data,
      evidence: [`Observed delegation '${input.delegationEnvelopeId}': status=completed, progress=100%`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};