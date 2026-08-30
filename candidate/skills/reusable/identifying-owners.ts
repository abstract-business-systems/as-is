import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { ResolvingScopesOutput } from "./resolving-scopes";

export interface IdentifyingOwnersInput {
  readonly scope: ResolvingScopesOutput;
}

export interface IdentifyingOwnersOutput {
  readonly implementationOwner: string;
  readonly taskAuthority: string;
  readonly historyOwner: string;
  readonly validator: string;
}

export const identifyingOwnersSkill: ReusableSkill<IdentifyingOwnersInput, IdentifyingOwnersOutput> = {
  name: "identifying-owners",
  description: "Maps scope to implementation, task authority, history, and validator owners.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: IdentifyingOwnersInput): Promise<StepResult<IdentifyingOwnersOutput>> {
    if (!input.scope) {
      return {
        status: "blocked",
        error: "Missing scope object in identifying-owners input",
      };
    }

    const isRootOrParent = input.scope.scopeType === "root" || input.scope.scopeType === "project";
    const implementationOwner = isRootOrParent ? "implementer" : "worker";
    const taskAuthority = "implementer";
    const historyOwner = input.scope.componentKey ?? "root";
    const validator = "implementer";

    const data: IdentifyingOwnersOutput = {
      implementationOwner,
      taskAuthority,
      historyOwner,
      validator,
    };

    return {
      status: "completed",
      data,
      evidence: [
        `Mapped ownership: implementer=${implementationOwner}, authority=${taskAuthority}, history=${historyOwner}`,
      ],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
