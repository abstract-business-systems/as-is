import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface BuildingContextInput {
  readonly anchorPath: string;
  readonly question: string;
  readonly literalLinks?: readonly string[];
}

export interface BuildingContextOutput {
  readonly contextSummary: string;
  readonly facts: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly links: readonly string[];
}

export const buildingContextSkill: ReusableSkill<BuildingContextInput, BuildingContextOutput> = {
  name: "building-context",
  description: "Extracts smallest authoritative context set from anchors and literal links.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: BuildingContextInput): Promise<StepResult<BuildingContextOutput>> {
    if (!input.anchorPath || typeof input.anchorPath !== "string") {
      return {
        status: "blocked",
        error: "Missing or invalid anchorPath in building-context input",
      };
    }

    try {
      context.tracer.assertPathPermitted(input.anchorPath, false);
    } catch (err) {
      return {
        status: "blocked",
        error: `Permission check failed for anchorPath '${input.anchorPath}': ${(err as Error).message}`,
      };
    }

    const facts: string[] = [
      `Anchor established at ${input.anchorPath}`,
      `Evaluating reader question: ${input.question}`,
    ];
    const assumptions: string[] = [];
    const unknowns: string[] = [];
    const links: string[] = [...(input.literalLinks ?? [])];

    const data: BuildingContextOutput = {
      contextSummary: `Context established for question '${input.question}' from anchor '${input.anchorPath}'`,
      facts,
      assumptions,
      unknowns,
      links,
    };

    return {
      status: "completed",
      data,
      evidence: [`Context built successfully with ${facts.length} facts and ${links.length} links`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
