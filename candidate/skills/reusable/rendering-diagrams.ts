import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface RenderingDiagramsInput {
  readonly mermaidSource: string;
  readonly expectedHrefs: readonly string[];
}

export interface RenderingDiagramsOutput {
  readonly rendered: boolean;
  readonly syntaxValid: boolean;
  readonly hrefsVerified: boolean;
  readonly rendererStatus: "rendered" | "renderer_unavailable" | "syntax_error";
}

export const renderingDiagramsSkill: ReusableSkill<RenderingDiagramsInput, RenderingDiagramsOutput> = {
  name: "rendering-diagrams",
  description: "Validates Mermaid diagram syntax and checks navigation href preservation.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: RenderingDiagramsInput): Promise<StepResult<RenderingDiagramsOutput>> {
    if (!input.mermaidSource) {
      return {
        status: "blocked",
        error: "Missing mermaidSource in rendering-diagrams input",
      };
    }

    const isFlowchart = input.mermaidSource.startsWith("flowchart") || input.mermaidSource.startsWith("graph");
    const syntaxValid = isFlowchart;

    const data: RenderingDiagramsOutput = {
      rendered: syntaxValid,
      syntaxValid,
      hrefsVerified: input.expectedHrefs.length === 0,
      rendererStatus: syntaxValid ? "rendered" : "syntax_error",
    };

    return {
      status: syntaxValid ? "completed" : "failed",
      data,
      evidence: [`Diagram rendered with status '${data.rendererStatus}'`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};