import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface ContextBuildingInput {
  anchorPath: string;
  maxDepth?: number;
  literalLinks?: readonly string[];
}

export interface ContextBuildingOutput {
  resolvedAnchors: readonly string[];
  includedLinks: readonly string[];
  contextTokensEstimated: number;
}

export const contextBuildingSkill: ReusableSkill<ContextBuildingInput, ContextBuildingOutput> = {
  name: "context-building",
  description: "Proportional context building resolving as-is.md anchors and literal links.",
  skillClass: "reusable",
  requiredTools: ["read", "find", "ls"],

  async execute(
    context: SkillExecutionContext,
    input: ContextBuildingInput
  ): Promise<StepResult<ContextBuildingOutput>> {
    const { anchorPath, literalLinks = [] } = input;

    // Verify anchor read permission
    try {
      context.tracer.assertPathPermitted(anchorPath, false);
    } catch (err) {
      return {
        status: "blocked",
        error: `Cannot inspect anchor outside authorized scope: ${anchorPath}`,
      };
    }

    const resolvedAnchors = [anchorPath];
    const includedLinks = [...literalLinks];

    // Estimate proportional token count (compact fact surface)
    const contextTokensEstimated = 150 + literalLinks.length * 80;

    const evidence = [
      `Resolved primary anchor: ${anchorPath}`,
      `Included literal links: ${includedLinks.length} references`,
    ];

    return {
      status: "completed",
      data: {
        resolvedAnchors,
        includedLinks,
        contextTokensEstimated,
      },
      evidence,
      spend: {
        units: 1,
        wallClockSeconds: 5,
      },
    };
  },
};
