import { join } from "node:path";
import { Type } from "../../core/adapters/pi/node_modules/typebox";
import type { ToolDefinition } from "../../core/adapters/pi/node_modules/@earendil-works/pi-coding-agent";
import { resolveLocalLinkedContext } from "../../core/modules/context-resolution/linked-context-resolver.ts";

function taskRecordNames(): string[] | undefined {
  const raw = process.env.AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES;
  if (!raw) return undefined;
  try {
    const names: unknown = JSON.parse(raw);
    return Array.isArray(names) && names.every((name) => typeof name === "string") ? names : undefined;
  } catch { return undefined; }
}

export const resolveLinkedContextTool: ToolDefinition = {
  name: "resolve_component_context",
  label: "Resolve exposed component context",
  description: "Resolve one file or directory explicitly exposed by the assigned component's as-is.md record.",
  parameters: Type.Object({ reference: Type.String({ minLength: 1 }) }),
  async execute(_toolCallId, params) {
    const projectRoot = process.env.AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT;
    const component = process.env.AS_IS_COMPONENT_CONTEXT_COMPONENT;
    if (!projectRoot || !component) {
      return { content: [{ type: "text", text: JSON.stringify({ complete: false, diagnostics: [{ code: "component-context-unavailable", message: "The host did not supply component context authority." }] }) }] };
    }
    const result = await resolveLocalLinkedContext(projectRoot, join(component, "as-is.md"), params.reference, { taskRecordNames: taskRecordNames() });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2).slice(0, 100_000) }], details: { complete: result.complete, kind: result.kind } };
  },
};
