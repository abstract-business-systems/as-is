import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface DecisionOption {
  readonly label: string;
  readonly tradeOff: string;
}

export interface PresentingDecisionsInput {
  readonly decisionTitle: string;
  readonly evidence: readonly string[];
  readonly options: readonly DecisionOption[];
  readonly authorityHolder: string;
}

export interface PresentingDecisionsOutput {
  readonly formattedDecisionBrief: string;
  readonly pendingHumanChoice: boolean;
}

export const presentingDecisionsSkill: ReusableSkill<PresentingDecisionsInput, PresentingDecisionsOutput> = {
  name: "presenting-decisions",
  description: "Formats human-centered decision briefs presenting trade-offs and authority boundaries.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: PresentingDecisionsInput): Promise<StepResult<PresentingDecisionsOutput>> {
    if (!input.decisionTitle || !input.options || input.options.length === 0) {
      return {
        status: "blocked",
        error: "Missing decisionTitle or options in presenting-decisions input",
      };
    }

    let brief = `## Decision Brief: ${input.decisionTitle}\n\n`;
    brief += `**Authority Holder:** ${input.authorityHolder}\n\n`;
    brief += `### Evidence\n`;
    for (const ev of input.evidence) {
      brief += `- ${ev}\n`;
    }
    brief += `\n### Options & Trade-Offs\n`;
    for (const opt of input.options) {
      brief += `- **${opt.label}:** ${opt.tradeOff}\n`;
    }

    const data: PresentingDecisionsOutput = {
      formattedDecisionBrief: brief,
      pendingHumanChoice: true,
    };

    return {
      status: "completed",
      data,
      evidence: [`Formatted decision brief for '${input.decisionTitle}' with ${input.options.length} option(s)`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};