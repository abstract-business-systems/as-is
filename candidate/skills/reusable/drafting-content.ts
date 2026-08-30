import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface DraftingContentInput {
  readonly topic: string;
  readonly draftPurpose: string;
  readonly proposedContent: string;
}

export interface DraftingContentOutput {
  readonly draftArtifactPath: string;
  readonly isExplicitDraft: boolean;
  readonly openDecisions: readonly string[];
}

export const draftingContentSkill: ReusableSkill<DraftingContentInput, DraftingContentOutput> = {
  name: "drafting-content",
  description: "Drafts bounded proposals without claiming adoption or modifying canonical records.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: DraftingContentInput): Promise<StepResult<DraftingContentOutput>> {
    if (!input.topic || !input.proposedContent) {
      return {
        status: "blocked",
        error: "Missing topic or proposedContent in drafting-content input",
      };
    }

    const slug = input.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);

    const draftArtifactPath = `drafts/${slug}-draft1.md`;

    const data: DraftingContentOutput = {
      draftArtifactPath,
      isExplicitDraft: true,
      openDecisions: [`Open review required for topic '${input.topic}'`],
    };

    return {
      status: "completed",
      data,
      evidence: [`Draft created at '${draftArtifactPath}' for purpose '${input.draftPurpose}'`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};