import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface DraftingChangelogEntriesInput {
  readonly taskOutcome: string;
  readonly completedCriteria: readonly string[];
  readonly evidenceLinks: readonly string[];
  readonly residualRisk: string;
}

export interface DraftingChangelogEntriesOutput {
  readonly formattedEntry: string;
  readonly isStandardFormat: boolean;
}

export const draftingChangelogEntriesSkill: ReusableSkill<DraftingChangelogEntriesInput, DraftingChangelogEntriesOutput> = {
  name: "drafting-changelog-entries",
  description: "Drafts standard changelog entries with completed criteria, evidence links, and residual risk.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: DraftingChangelogEntriesInput): Promise<StepResult<DraftingChangelogEntriesOutput>> {
    if (!input.taskOutcome) {
      return {
        status: "blocked",
        error: "Missing taskOutcome in drafting-changelog-entries input",
      };
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const formattedEntry = `### [${dateStr}] ${input.taskOutcome}\n\n` +
      `- **Completed Criteria:** ${input.completedCriteria.join(", ") || "none"}\n` +
      `- **Evidence:** ${input.evidenceLinks.join(", ") || "none"}\n` +
      `- **Residual Risk:** ${input.residualRisk || "none"}\n`;

    const data: DraftingChangelogEntriesOutput = {
      formattedEntry,
      isStandardFormat: true,
    };

    return {
      status: "completed",
      data,
      evidence: [`Drafted standard changelog entry for outcome '${input.taskOutcome}'`],
      spend: { units: 1, wallClockSeconds: 1 },
    };
  },
};