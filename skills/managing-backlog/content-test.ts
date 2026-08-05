import { readFileSync } from "node:fs";

const skill = readFileSync(new URL("./SKILL.md", import.meta.url), "utf8");
const required = [
  "## Completion Reconciliation",
  "Selected item identity and ownership",
  "Acceptance",
  "Terminal task",
  "Descendant closure",
  "Changelog handoff",
  "Durable scoped handoff",
  "Task management performs this reconciliation",
  "leave the\nbacklog item in place",
  "must not invent status",
  "| `description` |",
  "| `acceptance` |",
  "| `notes` |",
  "`user preference` is attributable to the user",
  "`system preference` is a model-reasoned planning input",
  "weight` is deliberately not stored",
  "project-level sequence is decided by the system",
  "dependency-aware",
  "changing `user preference`",
  "explicit reprioritization request",
  "## Cleanup Of Implemented Items",
  "owning `changelog.md`",
  "cleanupCompletedBacklogs",
  "Do not infer completion",
];
for (const phrase of required) {
  if (!skill.includes(phrase)) throw new Error(`missing required phrase: ${phrase}`);
}
if (!skill.includes("planning-only") || !skill.includes("does not contain active status")) {
  throw new Error("planning-only boundary is missing");
}
if (!skill.includes("must not be silently\nreinterpreted as task authority") ||
    !skill.includes("may decline or\ndelay the requested order")) {
  throw new Error("priority and sequence authority boundary is missing");
}
console.log("managing-backlog content validation passed");
