import type { ExtensionAPI } from "../../core/adapters/pi/node_modules/@earendil-works/pi-coding-agent";
import { registerWorkerTools } from "../../core/adapters/pi/extensions/worker-tools.ts";
import { agentTools } from "../../tools/agent/subagent-tools.ts";

export * from "../../tools/agent/subagent-tools.ts";

export default function workerTools(pi: ExtensionAPI): void {
  // The repository adapter supplies semantic tools; the package owns only the
  // versioned registration boundary. Pi's active tool set still controls
  // admission, and the adapter is intentionally static and visible.
  registerWorkerTools(pi, { version: 1, getTools: () => agentTools });
}
