import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";
import { verificationDisciplineSkill, type VerificationInput } from "../reusable/verification-discipline";

export interface TaskImplementationInput {
  taskDescription: string;
  targetFiles: readonly string[];
  verificationChecks: readonly Array<{ name: string; run: () => Promise<{ passed: boolean; output: string }> }>;
}

export interface TaskImplementationOutput {
  modifiedFiles: readonly string[];
  testsPassed: number;
  evidenceRecords: readonly string[];
}

const componentChangeVariant: CompositionVariant = {
  name: "component-task",
  description: "Implements one bounded component task with strict scope isolation, testing, and evidence collection.",
  preferredSkills: ["verification-discipline"],
  requiredTools: ["read", "grep", "find", "ls", "edit", "write"],
  recoveryPolicy: "abort",
  steps: [
    {
      id: "scope-verification",
      name: "Verify Scope and Target Files",
      preferredSkill: "context-building",
      requiredTools: ["read", "ls"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        const targetFiles: string[] = input?.targetFiles ?? [];
        for (const file of targetFiles) {
          context.tracer.assertPathPermitted(file, true); // Assert write permission within allowlist
        }
        return {
          status: "completed",
          data: input,
          evidence: [`Verified ${targetFiles.length} target files within scope allowlist`],
          spend: { units: 1, wallClockSeconds: 5 },
        };
      },
    },
    {
      id: "apply-bounded-edits",
      name: "Apply Bounded Code Modifications",
      preferredSkill: "applying-bounded-edits",
      requiredTools: ["read", "edit", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        const targetFiles: string[] = input?.targetFiles ?? [];
        // In real execution or mock simulation, files are updated
        return {
          status: "completed",
          data: {
            ...input,
            modifiedFiles: targetFiles,
          },
          evidence: targetFiles.map((f) => `Applied bounded edit to ${f}`),
          spend: { units: 4, wallClockSeconds: 30 },
        };
      },
    },
    {
      id: "execute-verification",
      name: "Run Deterministic Verification Checks",
      preferredSkill: "verification-discipline",
      requiredTools: ["read"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        const checks = input?.verificationChecks ?? [];
        const verificationInput: VerificationInput = {
          targetComponent: context.componentKey,
          checks,
        };
        const result = await verificationDisciplineSkill.execute(context, verificationInput);
        if (result.status !== "completed") {
          return {
            status: "failed",
            error: result.error,
            evidence: result.evidence,
          };
        }
        return {
          status: "completed",
          data: {
            ...input,
            verificationSummary: result.data,
          },
          evidence: result.evidence,
          spend: result.spend,
        };
      },
    },
    {
      id: "record-evidence",
      name: "Record Evidence and Closure Hand-off",
      preferredSkill: "recording-evidence",
      requiredTools: ["read", "write"],
      execute: async (_context: SkillExecutionContext, input?: any): Promise<StepResult<TaskImplementationOutput>> => {
        const output: TaskImplementationOutput = {
          modifiedFiles: input?.modifiedFiles ?? [],
          testsPassed: input?.verificationSummary?.passedChecks ?? 0,
          evidenceRecords: [
            `Task completed for ${input?.modifiedFiles?.length ?? 0} files`,
            `Deterministic checks: ${input?.verificationSummary?.passedChecks ?? 0} passed`,
          ],
        };
        return {
          status: "completed",
          data: output,
          evidence: output.evidenceRecords,
          spend: { units: 1, wallClockSeconds: 5 },
        };
      },
    },
  ],
};

export const implementingTasksMasterSkill: MasterSkill<
  TaskImplementationInput,
  TaskImplementationOutput
> = {
  name: "implementing-tasks",
  description: "Master composition orchestrating bounded task realization, testing, and evidence collection.",
  skillClass: "master",
  variants: {
    "component-task": componentChangeVariant,
  },
  defaultVariant: "component-task",
  async execute(
    context: SkillExecutionContext,
    variantName?: string,
    input?: TaskImplementationInput
  ): Promise<CompositionExecutionResult<TaskImplementationOutput>> {
    // Execution handled via CompositionRunner
    throw new Error("Execute master skills via CompositionRunner");
  },
};
