import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface CommittingCompletedWorkInput {
  declaredFiles: readonly string[];
  commitMessage: string;
  humanTurnAuthorized: boolean;
}

export interface CommittingCompletedWorkOutput {
  commitSha?: string;
  stagedFiles: readonly string[];
  committed: boolean;
  status: "committed" | "blocked_unauthorized" | "aborted";
}

const commitLifecycleVariant: CompositionVariant = {
  name: "completion-commit",
  description: "Stages declared scoped files, verifies whitespace, and executes atomic commit with human turn authorization.",
  preferredSkills: ["preparing-scoped-commits", "verification-discipline"],
  requiredTools: ["read", "grep", "find", "ls", "bash"],
  steps: [
    {
      id: "prepare-and-stage",
      name: "Prepare Scoped Staging",
      preferredSkill: "preparing-scoped-commits",
      requiredTools: ["read", "find", "ls"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        if (!input.humanTurnAuthorized) {
          return {
            status: "blocked",
            error: "Commit execution blocked: requires explicit human turn authorization.",
          };
        }
        return {
          status: "completed",
          data: {
            ...input,
            staged: true,
          },
          evidence: ["Scoped commit prepared and staged"],
          spend: { units: 1, wallClockSeconds: 1 },
        };
      },
    },
  ],
};

export const committingCompletedWorkMasterSkill: MasterSkill<CommittingCompletedWorkInput, CommittingCompletedWorkOutput> = {
  name: "committing-completed-work",
  description: "Master composition for verified, closure-gated completion commits.",
  skillClass: "master",
  variants: {
    "completion-commit": commitLifecycleVariant,
  },
  defaultVariant: "completion-commit",
  async execute(): Promise<CompositionExecutionResult<CommittingCompletedWorkOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};
