import { readFileSync } from "node:fs";

const skill = readFileSync(new URL("./SKILL.md", import.meta.url), "utf8");
const required = [
  "## Scope modes",
  "whole-project mode",
  "directory-scoped mode",
  "## Candidate identification",
  "Do not convert every directory",
  "distinct responsibility or capability",
  "stable ownership, authority, security, lifecycle, failure, or recovery boundary",
  "## Reviewable setup plan",
  "Human confirmation is required",
  "accept, merge, rename, reject, or defer",
  "## Record creation and navigation",
  "# <component-name> - as-is",
  "as-is.md#design",
  "synthetic parent node",
  "key or complex flow",
  "critical or host-constrained planned diagram",
  "render-surface constraint",
  "intended shape",
  "density budget",
  "grouping and routing direction",
  "no numeric dimensions are invented without host authority",
  "canonical architecture instruction exactly once",
  "## Validation",
  "git diff --check",
  "before/after path comparison",
  "## Boundaries and recovery",
  "does not select, authorize, start, delegate, observe, recover, or cancel agents",
];
for (const phrase of required) {
  if (!skill.includes(phrase)) throw new Error(`missing required phrase: ${phrase}`);
}
console.log("integrate-as-is-documentation content validation passed");
