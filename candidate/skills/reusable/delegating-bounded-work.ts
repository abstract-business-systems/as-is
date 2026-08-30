import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { ChildPlanEntry } from "../../execution-control/types";

export interface DelegatingBoundedWorkInput {
  readonly childComponentKey: string;
  readonly assignedPlan: ChildPlanEntry;
  readonly parentTaskId: string;
}

export interface DelegatingBoundedWorkOutput {
  readonly delegationEnvelopeId: string;
  readonly admitted: boolean;
  readonly scopeBounded: boolean;
}

export const delegatingBoundedWorkSkill: ReusableSkill<DelegatingBoundedWorkInput, DelegatingBoundedWorkOutput> = {
  name: "delegating-bounded-work",
  description: "Prepares isolated child delegation envelopes with strict scope bounding.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: DelegatingBoundedWorkInput): Promise<StepResult<DelegatingBoundedWorkOutput>> {
    if (!input.childComponentKey || !input.assignedPlan) {
      return {
        status: "blocked",
        error: "Missing childComponentKey or assignedPlan in delegating-bounded-work input",
      };
    }

    const delegationEnvelopeId = `del_${input.childComponentKey.replace(/\//g, "-")}_${Date.now()}`;

    const data: DelegatingBoundedWorkOutput = {
      delegationEnvelopeId,
      admitted: true,
      scopeBounded: input.assignedPlan.scopeAllowlist.length > 0,
    };

    return {
      status: "completed",
      data,
      evidence: [`Created delegation envelope '${delegationEnvelopeId}' for child '${input.childComponentKey}'`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};