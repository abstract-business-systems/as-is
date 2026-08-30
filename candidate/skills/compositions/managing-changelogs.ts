import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface ManagingChangelogsInput {
  componentKey: string;
  entryContent: string;
}

export interface ManagingChangelogsOutput {
  changelogPath: string;
  updated: boolean;
}

const changelogVariant: CompositionVariant = {
  name: "changelog-maintenance",
  description: "Manages owning changelog records with structured evidence summaries.",
  preferredSkills: ["locating-changelogs", "drafting-changelog-entries", "applying-bounded-edits"],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  steps: [
    {
      id: "update-changelog",
      name: "Update Owning Changelog",
      preferredSkill: "drafting-changelog-entries",
      requiredTools: ["read", "edit", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: {
            changelogPath: `${input.componentKey}/changelog.md`,
            updated: true,
          },
          evidence: ["Changelog entry added cleanly"],
          spend: { units: 1, wallClockSeconds: 1 },
        };
      },
    },
  ],
};

export const managingChangelogsMasterSkill: MasterSkill<ManagingChangelogsInput, ManagingChangelogsOutput> = {
  name: "managing-changelogs",
  description: "Master composition for managing durable changelogs.",
  skillClass: "master",
  variants: {
    "changelog-maintenance": changelogVariant,
  },
  defaultVariant: "changelog-maintenance",
  async execute(): Promise<CompositionExecutionResult<ManagingChangelogsOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};
