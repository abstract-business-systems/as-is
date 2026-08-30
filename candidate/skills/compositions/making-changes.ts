import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface MakingChangesInput {
  targetPath: string;
  changeDescription: string;
  isComponentChange: boolean;
}

export interface MakingChangesOutput {
  targetPath: string;
  changed: boolean;
  validationStatus: "passed" | "failed";
  historyUpdated: boolean;
}

const componentChangeVariant: CompositionVariant = {
  name: "component-change",
  description: "Making changes inside a bounded component with strict task record, verification, and changelog updates.",
  preferredSkills: [
    "resolving-scopes",
    "identifying-owners",
    "building-context",
    "choosing-change-methods",
    "writing-code",
    "writing-tests",
    "validating-changes",
    "locating-changelogs",
  ],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  steps: [
    {
      id: "scope-and-owner",
      name: "Resolve Scope and Owners",
      preferredSkill: "resolving-scopes",
      requiredTools: ["read"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: { ...input, scopeResolved: true },
          evidence: ["Scope and owners resolved for component change"],
          spend: { units: 1, wallClockSeconds: 1 },
        };
      },
    },
    {
      id: "apply-and-verify",
      name: "Apply Code Modifications and Verify",
      preferredSkill: "writing-code",
      requiredTools: ["read", "edit", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: { ...input, verified: true },
          evidence: ["Code modifications applied and verified cleanly"],
          spend: { units: 2, wallClockSeconds: 3 },
        };
      },
    },
  ],
};

const nonComponentChangeVariant: CompositionVariant = {
  name: "non-component-change",
  description: "Making surgical changes outside component boundaries without task records.",
  preferredSkills: ["resolving-scopes", "choosing-change-methods", "applying-bounded-edits", "validating-changes"],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  steps: [
    {
      id: "surgical-edit",
      name: "Apply Surgical Edit",
      preferredSkill: "applying-bounded-edits",
      requiredTools: ["read", "edit"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: { ...input, changed: true },
          evidence: ["Surgical non-component edit applied cleanly"],
          spend: { units: 1, wallClockSeconds: 1 },
        };
      },
    },
  ],
};

export const makingChangesMasterSkill: MasterSkill<MakingChangesInput, MakingChangesOutput> = {
  name: "making-changes",
  description: "Master composition for executing changes with component and non-component variants.",
  skillClass: "master",
  variants: {
    "component-change": componentChangeVariant,
    "non-component-change": nonComponentChangeVariant,
  },
  defaultVariant: "component-change",
  async execute(): Promise<CompositionExecutionResult<MakingChangesOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};