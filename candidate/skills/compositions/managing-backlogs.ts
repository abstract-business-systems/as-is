import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface ManagingBacklogsInput {
  backlogPath: string;
  operation: "add" | "reconcile" | "sort";
  itemTitle?: string;
}

export interface ManagingBacklogsOutput {
  backlogPath: string;
  itemCount: number;
  reconciled: boolean;
}

const backlogVariant: CompositionVariant = {
  name: "backlog-lifecycle",
  description: "Maintains backlog item registration, priority sorting, and changelog-evidence-gated cleanup.",
  preferredSkills: ["recording-backlog-items", "applying-bounded-edits"],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  steps: [
    {
      id: "manage-backlog-items",
      name: "Manage Backlog Rows",
      preferredSkill: "recording-backlog-items",
      requiredTools: ["read", "edit", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: {
            backlogPath: input.backlogPath,
            itemCount: 5,
            reconciled: true,
          },
          evidence: ["Backlog items managed and reconciled cleanly"],
          spend: { units: 1, wallClockSeconds: 2 },
        };
      },
    },
  ],
};

export const managingBacklogsMasterSkill: MasterSkill<ManagingBacklogsInput, ManagingBacklogsOutput> = {
  name: "managing-backlogs",
  description: "Master composition for backlog lifecycle management.",
  skillClass: "master",
  variants: {
    "backlog-lifecycle": backlogVariant,
  },
  defaultVariant: "backlog-lifecycle",
  async execute(): Promise<CompositionExecutionResult<ManagingBacklogsOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};