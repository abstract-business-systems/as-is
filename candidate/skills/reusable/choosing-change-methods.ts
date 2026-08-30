import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface ChoosingChangeMethodsInput {
  readonly changeDescription: string;
  readonly isNewFile: boolean;
  readonly isRefactor: boolean;
}

export interface ChoosingChangeMethodsOutput {
  readonly changeMethod: "writing-code" | "applying-bounded-edits" | "drafting-content" | "delegating-bounded-work";
  readonly rationale: string;
}

export const choosingChangeMethodsSkill: ReusableSkill<ChoosingChangeMethodsInput, ChoosingChangeMethodsOutput> = {
  name: "choosing-change-methods",
  description: "Chooses the narrowest appropriate change method for a task.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: ChoosingChangeMethodsInput): Promise<StepResult<ChoosingChangeMethodsOutput>> {
    let changeMethod: "writing-code" | "applying-bounded-edits" | "drafting-content" | "delegating-bounded-work" = "writing-code";
    let rationale = "";

    if (input.isNewFile) {
      changeMethod = "writing-code";
      rationale = "New file creation requires writing-code skill.";
    } else if (input.isRefactor) {
      changeMethod = "applying-bounded-edits";
      rationale = "Refactoring existing code requires surgical applying-bounded-edits skill.";
    } else {
      changeMethod = "writing-code";
      rationale = `Selected '${changeMethod}' as standard change method for '${input.changeDescription}'.`;
    }

    const data: ChoosingChangeMethodsOutput = {
      changeMethod,
      rationale,
    };

    return {
      status: "completed",
      data,
      evidence: [`Selected change method '${changeMethod}': ${rationale}`],
      spend: { units: 1, wallClockSeconds: 1 },
    };
  },
};