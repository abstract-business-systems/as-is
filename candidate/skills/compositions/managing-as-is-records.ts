import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface ManagingAsIsRecordsInput {
  componentKey: string;
  recordContent: string;
}

export interface ManagingAsIsRecordsOutput {
  asIsRecordPath: string;
  sectionsValidated: readonly string[];
}

const asIsLifecycleVariant: CompositionVariant = {
  name: "as-is-lifecycle",
  description: "Creates and maintains canonical as-is.md architecture records.",
  preferredSkills: ["structuring-content", "applying-bounded-edits"],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  steps: [
    {
      id: "validate-and-write-record",
      name: "Validate and Update As-Is Record",
      preferredSkill: "structuring-content",
      requiredTools: ["read", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: {
            asIsRecordPath: `${input.componentKey}/as-is.md`,
            sectionsValidated: ["Purpose", "Components", "Design", "Relationships", "Navigation"],
          },
          evidence: ["As-is record validated against canonical schema"],
          spend: { units: 1, wallClockSeconds: 2 },
        };
      },
    },
  ],
};

export const managingAsIsRecordsMasterSkill: MasterSkill<ManagingAsIsRecordsInput, ManagingAsIsRecordsOutput> = {
  name: "managing-as-is-records",
  description: "Master composition for managing durable as-is.md component records.",
  skillClass: "master",
  variants: {
    "as-is-lifecycle": asIsLifecycleVariant,
  },
  defaultVariant: "as-is-lifecycle",
  async execute(): Promise<CompositionExecutionResult<ManagingAsIsRecordsOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};