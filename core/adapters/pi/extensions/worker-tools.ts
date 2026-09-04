import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";

export const SUBAGENT_HOST_SERVICES_VERSION = 1 as const;

export type SubagentHostServices = {
  version: typeof SUBAGENT_HOST_SERVICES_VERSION;
  getTools: () => readonly ToolDefinition[];
};

function validateTools(tools: readonly ToolDefinition[]): void {
  const names = new Set<string>();
  for (const tool of tools) {
    if (!tool || typeof tool.name !== "string" || tool.name.length === 0) {
      throw new Error("subagent host services returned a tool without a name");
    }
    if (names.has(tool.name)) throw new Error(`subagent host services returned duplicate tool: ${tool.name}`);
    names.add(tool.name);
  }
}

/**
 * Register repository-supplied worker tools through the package-owned Pi
 * boundary. The package owns registration mechanics; the host owns tool
 * semantics, admission, and authority.
 */
export function registerWorkerTools(pi: Pick<ExtensionAPI, "registerTool">, services: SubagentHostServices): void {
  if (services.version !== SUBAGENT_HOST_SERVICES_VERSION) {
    throw new Error(`unsupported subagent host services version: ${String(services.version)}`);
  }
  const tools = services.getTools();
  validateTools(tools);
  for (const tool of tools) pi.registerTool(tool);
}
