import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface StructuringContentInput {
  readonly documentPurpose: string;
  readonly sections: readonly string[];
  readonly readerRetrievalGoal: string;
}

export interface StructuringContentOutput {
  readonly outline: readonly string[];
  readonly durablePath: string;
  readonly navigationLinks: readonly string[];
}

export const structuringContentSkill: ReusableSkill<StructuringContentInput, StructuringContentOutput> = {
  name: "structuring-content",
  description: "Structures repository content as a durable, discoverable knowledge-work artifact.",
  skillClass: "reusable",
  requiredTools: ["read", "edit", "write"],
  async execute(context: SkillExecutionContext, input: StructuringContentInput): Promise<StepResult<StructuringContentOutput>> {
    if (!input.documentPurpose) {
      return {
        status: "blocked",
        error: "Missing documentPurpose in structuring-content input",
      };
    }

    const standardSections = ["Purpose", "Requirements", "Design", "Verification", "Navigation"];
    const mergedSections = Array.from(new Set([...standardSections, ...(input.sections ?? [])]));

    const slug = input.documentPurpose
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);

    const durablePath = `${context.componentKey}/${slug}.md`;
    const navigationLinks = mergedSections.map(
      (s) => `#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    );

    const data: StructuringContentOutput = {
      outline: mergedSections,
      durablePath,
      navigationLinks,
    };

    return {
      status: "completed",
      data,
      evidence: [
        `Structured content outline with ${mergedSections.length} sections for '${input.documentPurpose}'`,
      ],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
