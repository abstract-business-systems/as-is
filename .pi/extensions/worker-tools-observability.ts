import type { ExtensionAPI } from "../../core/adapters/pi/node_modules/@earendil-works/pi-coding-agent";

export * from "../../tools/evidence/worker-tools-observability.ts";

// Pi discovers every TypeScript file under `.pi/extensions/`, even when it is
// not listed in settings.json. Keep this compatibility projection inert while
// satisfying Pi's extension entry-point contract.
export default function workerToolsObservability(_pi: ExtensionAPI): void {}
