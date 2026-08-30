import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface ChoosingNamesInput {
  readonly conceptDescription: string;
  readonly parentContextPath: string;
  readonly candidateAlternatives: readonly string[];
}

export interface ChoosingNamesOutput {
  readonly selectedName: string;
  readonly semanticRationale: string;
  readonly isKebabCase: boolean;
  readonly referenceReplacements?: ReadonlyArray<{
    readonly file: string;
    readonly oldText: string;
    readonly newText: string;
  }>;
}

const KEBAB_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const choosingNamesSkill: ReusableSkill<ChoosingNamesInput, ChoosingNamesOutput> = {
  name: "choosing-names",
  description: "Selects semantically accurate kebab-case names matching conventions.",
  skillClass: "reusable",
  requiredTools: ["read", "edit"],
  async execute(context: SkillExecutionContext, input: ChoosingNamesInput): Promise<StepResult<ChoosingNamesOutput>> {
    if (!input.candidateAlternatives || input.candidateAlternatives.length === 0) {
      return {
        status: "blocked",
        error: "No candidate alternatives provided in choosing-names input",
      };
    }

    const validCandidates = input.candidateAlternatives.filter((c) => KEBAB_REGEX.test(c));

    if (validCandidates.length === 0) {
      return {
        status: "failed",
        error: "None of the candidate alternatives are valid lowercase kebab-case",
      };
    }

    // Sort by segment count (narrowest / most specific name first)
    const sorted = [...validCandidates].sort((a, b) => {
      const segA = a.split("-").length;
      const segB = b.split("-").length;
      return segA - segB;
    });

    const selectedName = sorted[0];

    const data: ChoosingNamesOutput = {
      selectedName,
      semanticRationale: `Selected '${selectedName}' as the narrowest valid kebab-case name for '${input.conceptDescription}' under '${input.parentContextPath}'`,
      isKebabCase: true,
    };

    return {
      status: "completed",
      data,
      evidence: [`Selected name '${selectedName}' from ${input.candidateAlternatives.length} candidate(s)`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
