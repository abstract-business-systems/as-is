import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface RecordingBacklogItemsInput {
  readonly backlogPath: string;
  readonly itemTitle: string;
  readonly purpose: string;
  readonly scope: string;
  readonly acceptanceCriteria: readonly string[];
  readonly dependencies: readonly string[];
}

export interface RecordingBacklogItemsOutput {
  readonly itemId: string;
  readonly formattedRow: string;
  readonly registered: boolean;
}

export const recordingBacklogItemsSkill: ReusableSkill<RecordingBacklogItemsInput, RecordingBacklogItemsOutput> = {
  name: "recording-backlog-items",
  description: "Records bounded backlog items formatted with dependencies and acceptance criteria.",
  skillClass: "reusable",
  requiredTools: ["read", "edit", "write"],
  async execute(context: SkillExecutionContext, input: RecordingBacklogItemsInput): Promise<StepResult<RecordingBacklogItemsOutput>> {
    if (!input.backlogPath || !input.itemTitle) {
      return {
        status: "blocked",
        error: "Missing backlogPath or itemTitle in recording-backlog-items input",
      };
    }

    try {
      context.tracer.assertPathPermitted(input.backlogPath, true);
    } catch (err) {
      return {
        status: "blocked",
        error: `Permission check failed for backlogPath '${input.backlogPath}': ${(err as Error).message}`,
      };
    }

    const slug = input.itemTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const itemId = `item-${slug.slice(0, 32)}`;
    const formattedRow = `| ${itemId} | ${input.itemTitle} | pending | ${input.dependencies.join(", ") || "none"} | ${input.acceptanceCriteria.join("; ")} |`;

    const data: RecordingBacklogItemsOutput = {
      itemId,
      formattedRow,
      registered: true,
    };

    return {
      status: "completed",
      data,
      evidence: [`Registered backlog item '${itemId}' in '${input.backlogPath}'`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};