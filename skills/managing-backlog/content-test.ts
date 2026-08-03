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
];
for (const phrase of required) {
  if (!skill.includes(phrase)) throw new Error(`missing required phrase: ${phrase}`);
}
if (!skill.includes("planning-only") || !skill.includes("does not contain active status")) {
  throw new Error("planning-only boundary is missing");
}
console.log("managing-backlog content validation passed");
