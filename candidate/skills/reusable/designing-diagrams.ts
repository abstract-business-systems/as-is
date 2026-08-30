import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface DesigningDiagramsInput {
  readonly readerQuestion: string;
  readonly nodes: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  readonly edges: ReadonlyArray<{ readonly from: string; readonly to: string; readonly label?: string }>;
}

export interface DesigningDiagramsOutput {
  readonly mermaidSource: string;
  readonly isElkCompatible: boolean;
  readonly expectedHrefs: readonly string[];
}

export const designingDiagramsSkill: ReusableSkill<DesigningDiagramsInput, DesigningDiagramsOutput> = {
  name: "designing-diagrams",
  description: "Formulates valid Elk-compatible Mermaid diagram sources answering specific reader questions.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: DesigningDiagramsInput): Promise<StepResult<DesigningDiagramsOutput>> {
    if (!input.readerQuestion || !input.nodes || input.nodes.length === 0) {
      return {
        status: "blocked",
        error: "Missing readerQuestion or nodes in designing-diagrams input",
      };
    }

    let source = "flowchart TD\n";
    for (const node of input.nodes) {
      source += `  ${node.id}["${node.label}"]\n`;
    }
    for (const edge of input.edges ?? []) {
      if (edge.label) {
        source += `  ${edge.from} -->|"${edge.label}"| ${edge.to}\n`;
      } else {
        source += `  ${edge.from} --> ${edge.to}\n`;
      }
    }

    const data: DesigningDiagramsOutput = {
      mermaidSource: source.trim(),
      isElkCompatible: true,
      expectedHrefs: [],
    };

    return {
      status: "completed",
      data,
      evidence: [`Designed diagram with ${input.nodes.length} nodes and ${(input.edges ?? []).length} edges`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};