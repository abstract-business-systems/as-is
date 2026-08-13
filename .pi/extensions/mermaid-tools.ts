import type { ExtensionAPI, ToolDefinition } from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { Type } from "../../skills/spawning-pi-subagents/node_modules/typebox";
import {
  renderMermaidBatch,
  rendererConfiguration,
  type MermaidDiagramInput,
} from "../../skills/designing-mermaid-diagrams/rendered-navigation";

const maxResultCharacters = 100_000;
const diagramInput = Type.Object({
  id: Type.String({ minLength: 1, maxLength: 128 }),
  source: Type.String({ minLength: 1, maxLength: 100_000 }),
  expectedHrefs: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 2_048 }), { maxItems: 256 })),
});

const boundedJson = (value: unknown): string => JSON.stringify(value, null, 2).slice(0, maxResultCharacters);

export const renderMermaidBatchTool: ToolDefinition = {
  name: "render_mermaid_batch",
  label: "Render Mermaid batch",
  description: "Render a bounded batch of Mermaid diagram sources in a local browser and optionally verify expected rendered hrefs. The input is diagram source, not a document path.",
  promptSnippet: "Render Mermaid diagram sources in one local browser batch",
  promptGuidelines: [
    "Use render_mermaid_batch with diagram source inputs when rendered Mermaid output or href preservation must be checked.",
    "Do not pass document paths to render_mermaid_batch; document discovery and source extraction belong to the caller.",
  ],
  parameters: Type.Object({
    diagrams: Type.Array(diagramInput, { minItems: 1, maxItems: 64 }),
    requireRenderer: Type.Optional(Type.Boolean()),
  }),
  async execute(_toolCallId, params, signal, _onUpdate, ctx) {
    const diagrams = params.diagrams as MermaidDiagramInput[];
    const result = await renderMermaidBatch(diagrams, rendererConfiguration(process.env, ctx.cwd), signal);
    if (result.status === "unsupported" && params.requireRenderer) {
      throw new Error(`Mermaid renderer is required but unavailable: ${result.error ?? "unknown reason"}`);
    }
    if (result.status === "failed") {
      throw new Error(`Mermaid batch rendering failed: ${boundedJson(result)}`);
    }
    return {
      content: [{ type: "text", text: boundedJson(result) }],
      details: {
        status: result.status,
        diagramCount: result.diagrams.length,
        durationMs: result.durationMs,
      },
    };
  },
};

export default function mermaidTools(pi: ExtensionAPI): void {
  pi.registerTool(renderMermaidBatchTool);
}
