import type { ExtensionAPI } from "../../skills/spawning-pi-subagents/node_modules/@earendil-works/pi-coding-agent";
import { agentTools } from "../../tools/agent/subagent-tools.ts";

export * from "../../tools/agent/subagent-tools.ts";

export default function workerTools(pi: ExtensionAPI): void {
  // Registration is declarative. Pi's active tool set controls admission; the
  // implementation owner does not become a process-global authority.
  for (const tool of agentTools) pi.registerTool(tool);
}
