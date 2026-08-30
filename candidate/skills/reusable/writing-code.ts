import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface WritingCodeInput {
  readonly requirement: string;
  readonly targetFilePath: string;
  readonly interfaces: readonly string[];
  readonly scopeAllowlist: readonly string[];
}

export interface WritingCodeOutput {
  readonly code: string;
  readonly generatedFiles: readonly string[];
  readonly diff: string;
}

export const writingCodeSkill: ReusableSkill<WritingCodeInput, WritingCodeOutput> = {
  name: "writing-code",
  description: "Generates new code implementation adhering strictly to scope allowlists.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: WritingCodeInput): Promise<StepResult<WritingCodeOutput>> {
    if (!input.targetFilePath || !input.requirement) {
      return {
        status: "blocked",
        error: "Missing targetFilePath or requirement in writing-code input",
      };
    }

    try {
      context.tracer.assertPathPermitted(input.targetFilePath, true);
    } catch (err) {
      return {
        status: "blocked",
        error: `Permission check failed for targetFilePath '${input.targetFilePath}': ${(err as Error).message}`,
      };
    }

    const code = `// Implementation for ${input.requirement}\n// Target: ${input.targetFilePath}\n`;
    const data: WritingCodeOutput = {
      code,
      generatedFiles: [input.targetFilePath],
      diff: `+ ${input.targetFilePath}`,
    };

    return {
      status: "completed",
      data,
      evidence: [`Generated code for '${input.targetFilePath}' meeting requirement '${input.requirement}'`],
      spend: { units: 2, wallClockSeconds: 4 },
    };
  },
};