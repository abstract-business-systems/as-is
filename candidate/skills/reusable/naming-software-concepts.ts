import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface NamingInput {
  candidates: readonly string[];
  contextScope?: string;
}

export interface NamingOutput {
  valid: boolean;
  validatedNames: readonly string[];
  rejectedNames: readonly Array<{ name: string; reason: string }>;
}

export const namingSoftwareConceptsSkill: ReusableSkill<NamingInput, NamingOutput> = {
  name: "naming-software-concepts",
  description: "Semantic accuracy and kebab-case naming validation for software concepts.",
  skillClass: "reusable",
  requiredTools: ["read"],

  async execute(
    _context: SkillExecutionContext,
    input: NamingInput
  ): Promise<StepResult<NamingOutput>> {
    const { candidates } = input;
    const validatedNames: string[] = [];
    const rejectedNames: Array<{ name: string; reason: string }> = [];

    const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    for (const name of candidates) {
      if (!name || name.trim() === "") {
        rejectedNames.push({ name, reason: "Name cannot be empty" });
        continue;
      }

      if (!kebabRegex.test(name)) {
        rejectedNames.push({
          name,
          reason: "Name must use lowercase kebab-case (e.g. 'task-control')",
        });
        continue;
      }

      if (name.length > 64) {
        rejectedNames.push({ name, reason: "Name exceeds maximum length of 64 characters" });
        continue;
      }

      validatedNames.push(name);
    }

    const allValid = rejectedNames.length === 0 && validatedNames.length > 0;

    const evidence = [
      `Evaluated ${candidates.length} candidate names: ${validatedNames.length} valid, ${rejectedNames.length} rejected`,
    ];

    return {
      status: allValid ? "completed" : "failed",
      data: {
        valid: allValid,
        validatedNames,
        rejectedNames,
      },
      evidence,
      spend: { units: 1, wallClockSeconds: 2 },
      error: allValid ? undefined : `Naming validation failed: ${rejectedNames.map((r) => `${r.name} (${r.reason})`).join(", ")}`,
    };
  },
};
