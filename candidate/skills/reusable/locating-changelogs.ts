import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { ResolvingScopesOutput } from "./resolving-scopes";

export interface LocatingChangelogsInput {
  readonly scope: ResolvingScopesOutput;
  readonly taskContractRequiresHistory: boolean;
}

export interface LocatingChangelogsOutput {
  readonly changelogPath?: string;
  readonly historyRequired: boolean;
  readonly rationale: string;
}

export const locatingChangelogsSkill: ReusableSkill<LocatingChangelogsInput, LocatingChangelogsOutput> = {
  name: "locating-changelogs",
  description: "Locates owning changelog path or explains history exemption.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: LocatingChangelogsInput): Promise<StepResult<LocatingChangelogsOutput>> {
    if (!input.scope) {
      return {
        status: "blocked",
        error: "Missing scope object in locating-changelogs input",
      };
    }

    if (!input.taskContractRequiresHistory) {
      return {
        status: "completed",
        data: {
          historyRequired: false,
          rationale: "Task contract does not require durable history recording for this scope.",
        },
        evidence: ["No changelog required by task contract"],
        spend: { units: 1, wallClockSeconds: 1 },
      };
    }

    let changelogPath = "changelog.md";
    if (input.scope.componentKey && input.scope.componentKey !== "root") {
      changelogPath = `${input.scope.componentKey}/changelog.md`;
    }

    return {
      status: "completed",
      data: {
        changelogPath,
        historyRequired: true,
        rationale: `Owning changelog identified at '${changelogPath}' for component '${input.scope.componentKey ?? "root"}'`,
      },
      evidence: [`Owning changelog resolved to ${changelogPath}`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
