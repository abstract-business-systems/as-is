// This is an as-is repository dogfood validator, not a portable skill conformance suite.
// Its repository-wide navigation assertions implement this repository's approved adoption policy.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { validateAsIsDiagramsAndNavigation } from "./scripts/validate-as-is-diagrams-and-navigation";
import { dirname, join, relative, sep } from "node:path";

type BunFile = {
  text(): Promise<string>;
  exists(): Promise<boolean>;
};

const bun = (globalThis as typeof globalThis & { Bun: { file(path: URL): BunFile } }).Bun;
const file = (relativePath: string) => bun.file(new URL(relativePath, import.meta.url));
const [skill, record, skillsRecord, backlog, examples, vocabulary, mermaidSkill, mermaidRecord, integrationSkill, integrationRecord, setupSkill, setupRecord] = await Promise.all([
  file("./SKILL.md").text(),
  file("./as-is.md").text(),
  file("../as-is.md").text(),
  file("./backlog.md").text(),
  file("./diagram-examples.md").text(),
  file("../../docs/architecture-vocabulary.md").text(),
  file("../designing-mermaid-diagrams/SKILL.md").text(),
  file("../designing-mermaid-diagrams/as-is.md").text(),
  file("../integrate-as-is-documentation/SKILL.md").text(),
  file("../integrate-as-is-documentation/as-is.md").text(),
  file("../as-is-setup/SKILL.md").text(),
  file("../as-is-setup/as-is.md").text(),
]);
const legacyContainerExample = file("./container-diagram-example.md");

const requiredSkillPhrases = [
  "## Scope And Authority",
  "configured task record",
  "configured backlog records own unstarted proposals",
  "The record's durable inputs are authoritative",
  "## Record Model",
  "Every record has at least one reader-oriented diagram",
  "Links are direct, resolving repository-relative context needed to understand or operate within the component or its immediate children",
  "omit duplicate navigation, changelogs, and other historical-summary artifacts",
  "Apply the target project's record-placement and history conventions rather than imposing a file or section placement rule.",
  "A `Components` table is the required Markdown fallback for each immediate child target rendered as a linked structural-container node",
  "the intentional diagram-link and Markdown-fallback pair is not a duplicated `## Links` catalog",
  "Source and test files are omitted by default",
  "Omit `## Links` when no qualifying direct context exists; never retain an empty Links section or add a placeholder statement.",
  "## Diagram And Navigation Model",
  "## Flow View Rules",
  "Structural views",
  "Temporal views",
  "Durable flow threshold",
  "Balanced versus progression layout",
  "Direction semantics",
  "Failure and recovery disclosure",
  "Authority and divergence",
  "The relationship vocabulary is `provides`, `uses`, `calls`, `delegates-to`, `publishes`, `subscribes-to`, `reads`, `writes`, `validates`, `observes`, `authorizes`, and `connects-to`",
  "Abstract capability labels are preferred",
  "Concrete provider identity must be disclosed",
  "descriptive `### <diagram name>` heading",
  "trimmed root-to-current breadcrumb",
  "taller, narrower ELK/TB flowchart",
  "pre-render layout plan",
  "Authoritative prose and links define",
  "only when it improves scanability",
  "## Example Structure",
  "# <component-name> - as-is",
  "[`<immediate child>`](<child-path>/as-is.md#design)",
  "[as-is](<root-relative-path>/as-is.md#design) / [<parent component>](<parent-relative-path>/as-is.md#design) / **<component-name>**",
  "CHILD[\"<a href='<child-path>/as-is.md#design'><immediate child></a>\"]",
  "### Structural container",
  "config:",
  "layout: elk",
  "flowchart TB",
  "## Creation, Alignment, And Replacement Model",
  "Approved component boundary without an `as-is.md`",
  "Alignment is semantic rather than file-by-file",
  "Implementation is evidence rather than automatic record authority",
  "In-place revision is the default",
  "preservation needs have been assessed",
  "migration or retirement decision rather than ordinary alignment",
  "## Applying The Model",
  "implementation evidence when alignment is in scope",
  "do not own record meaning, task authority, or agent selection",
  "git diff --check",
];
for (const phrase of requiredSkillPhrases) {
  if (!skill.includes(phrase)) throw new Error(`skill is missing required phrase: ${phrase}`);
}

const requiredMermaidPhrases = [
  "## Pre-render layout plan",
  "available render-surface constraint",
  "intended orientation or shape",
  "visible-node, edge, and label density budget",
  "grouping and routing direction",
  "Do not invent a numeric width, height, or\naspect ratio",
];
for (const phrase of requiredMermaidPhrases) {
  if (!mermaidSkill.includes(phrase)) throw new Error(`generic Mermaid skill is missing required phrase: ${phrase}`);
}
for (const [name, text, phrase] of [
  ["integration skill", integrationSkill, "pre-render layout plan for every planned diagram"],
  ["setup skill", setupSkill, "pre-render layout plan for every planned diagram"],
] as const) {
  if (!text.includes(phrase)) throw new Error(`${name} is missing required phrase: ${phrase}`);
}
const requiredLayoutPlanRecordPhrases = [
  "- Pre-render layout plan:",
  "renderer-specific geometry remains untested",
];
for (const [name, text] of [
  ["generic Mermaid record", mermaidRecord],
  ["integration record", integrationRecord],
  ["setup record", setupRecord],
] as const) {
  for (const phrase of requiredLayoutPlanRecordPhrases) {
    if (!text.includes(phrase)) throw new Error(`${name} is missing required phrase: ${phrase}`);
  }
}

const requiredRecordPhrases = [
  "# Managing As-Is Documents - as-is",
  "[as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Managing As-Is Documents**",
  "Structural views explain stable containment or neighborhood",
  "temporal views explain one bounded consequential flow",
  "durable flow views disclose material failure or recovery behavior",
  "does not select, authorize, start, observe, recover, cancel, or delegate agents",
  "no live test can exercise record-maintenance execution",
  "Residual risk:",
];
for (const phrase of requiredRecordPhrases) {
  if (!record.includes(phrase)) throw new Error(`record is missing required phrase: ${phrase}`);
}

for (const completedIdentity of [
  "skills/managing-as-is-document:formalize-as-is-relationship-vocabulary",
  "skills/managing-as-is-document:validate-as-is-diagrams-and-navigation",
]) {
  if (backlog.includes(completedIdentity)) throw new Error(`completed backlog item must not remain as a dependency: ${completedIdentity}`);
}

for (const heading of ["## Structural container", "### Complete parent-record example", "### Structural container", "### Why this representation", "## Context map", "### Context map", "## Scenario or sequence flow", "### Scenario sequence", "## Data flow", "### Data flow", "## State flow", "### State flow", "## Decision flow", "### Decision flow", "## Recovery flow", "### Recovery flow", "## Actor journey", "### Actor journey"]) {
  if (!examples.includes(heading)) throw new Error(`diagram examples are missing ${heading}`);
}

for (const phrase of [
  "[Commerce Platform](../../as-is.md#design) / **Checkout**",
  "The matching Markdown `Components` table remains the sole immediate-child catalog and authoritative fallback when a renderer strips diagram links.",
  "<a href='./validation/as-is.md#design'>Validation</a>",
  "- Layout: balanced taller, narrower relationship map",
  "## Pre-render layout plan",
  "- Render-surface constraint:",
  "- Shape target:",
  "- Density budget:",
  "### Data flow",
  "### State flow",
  "### Decision flow",
  "config:\n  layout: elk",
  "flowchart TB",
  "The diagram-link and Markdown-fallback pair is intentional; do not repeat child targets or ordinary direct-child contracts in `## Links`",
  "Child box labels target the corresponding `Components` table entries",
]) {
  if (!examples.includes(phrase)) throw new Error(`structural container example is missing required phrase: ${phrase}`);
}
for (const phrase of [
  "## Relationship Labels",
  "| Label | Use when | Do not infer | Illustrative statement |",
  "| `delegates-to` | One component transfers a bounded responsibility",
  "The illustrative statements explain label meaning only; they do not add components or architecture facts to the canonical graph.",
  "A short reader-oriented edge phrase may stand in for a canonical label only when its mapping is explicit",
  "Concrete provider identity must be disclosed when it materially changes",
]) {
  if (!vocabulary.includes(phrase)) throw new Error(`architecture vocabulary is missing required phrase: ${phrase}`);
}

const structuralExample = examples.slice(examples.indexOf("## Structural container"), examples.indexOf("\n## Context map"));
for (const target of ["./validation/as-is.md#design", "./authorization/as-is.md#design", "./order-recording/as-is.md#design"]) {
  const occurrences = structuralExample.split(target).length - 1;
  if (occurrences !== 2) throw new Error(`structural container example must pair the linked child box and Components-table fallback for ${target}`);
}
if (skill.includes("container-diagram-example.md")) throw new Error("SKILL.md must link the consolidated structural container example in diagram-examples.md");
if (await legacyContainerExample.exists()) throw new Error("container-diagram-example.md must be consolidated into diagram-examples.md");
if (skill.lastIndexOf("\n## Links") > skill.indexOf("\n## Outputs")) throw new Error("SKILL.md must place supporting links beside the rules they support rather than in a trailing Links catalog");
if (!skill.includes("ordinary direct-child contracts")) throw new Error("SKILL.md must keep ordinary direct-child contracts out of a parent Links catalog");
if (skill.includes("resolving nearby Markdown `Parent:` link")) throw new Error("SKILL.md must replace the legacy Parent link rule with breadcrumbs");

const repositoryRoot = dirname(dirname(dirname(new URL(import.meta.url).pathname)));
const reconciliationStart = skill.indexOf("\n## Hierarchical Record Reconciliation\n");
if (reconciliationStart < 0) throw new Error("skill is missing hierarchical record reconciliation guidance");
const reconciliationEnd = skill.indexOf("\n## ", reconciliationStart + 1);
if (reconciliationEnd < 0) throw new Error("skill is missing the section after hierarchical record reconciliation guidance");
const reconciliation = skill.slice(reconciliationStart, reconciliationEnd);
const requiredReconciliationPhrases = [
  "host-approved reconciliation boundary and explicit exclusions",
  "declared canonical record graph and direct-child relationships",
  "stable evidence baseline",
  "final immediate-child record",
  "all immediate-child records are final for the same baseline",
  "only its own applicable evidence and the final immediate-child records",
  "child source, tests, task narratives, transcripts, runtime artifacts, or grandchildren",
  "child record, direct-child relationship, or baseline changes",
  "target-project-defined reconciliation handoff",
  "does not require a task record, task-tree topology, task lifecycle, scheduling, budgets, commits, changelogs",
];
for (const phrase of requiredReconciliationPhrases) {
  if (!reconciliation.includes(phrase)) throw new Error(`reconciliation contract is missing required phrase: ${phrase}`);
}
for (const localConvention of ["tasks.md", "as-is.json", "changelog.md"]) {
  if (reconciliation.includes(localConvention)) throw new Error(`reconciliation contract must not prescribe repository-local ${localConvention}`);
}
if (existsSync(join(repositoryRoot, "skills", "reconciling-as-is-records"))) {
  throw new Error("repository must not create a standalone reconciling-as-is-records skill");
}
if (skillsRecord.includes("reconciling-as-is-records/as-is.md#design")) {
  throw new Error("Skills catalog must not add reconciling-as-is-records as a component");
}
const excludedPrompt = join(repositoryRoot, ".pi", "prompts", "as-is.md");
const canonicalTitle = (text: string) => text.match(/^# (.+?) - as-is\s*$/m)?.[1];
const canonicalRecords = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if ([".git", "node_modules"].includes(entry.name)) return [];
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return canonicalRecords(path);
  if (entry.isFile() && entry.name === "as-is.md" && path !== excludedPrompt && canonicalTitle(readFileSync(path, "utf8"))) return [path];
  return [];
});
const normalizeTarget = (target: string) => target.replace(/(^|\/)\.\//g, "$1");
const linkTargets = (text: string) => Array.from(text.matchAll(/(?:href=['"]|\]\()([^'")\s]+as-is\.md#design)/g), (match) => normalizeTarget(match[1]));
const markdownTargets = (text: string) => Array.from(text.matchAll(/\]\(([^)\s]+)\)/g), (match) => normalizeTarget(match[1]));
const rootRecord = join(repositoryRoot, "as-is.md");
const componentsRecord = join(repositoryRoot, "components", "as-is.md");
const expectedBreadcrumb = (recordPath: string) => {
  if (recordPath === rootRecord) return "**as-is**";
  const ancestors: string[] = [];
  let directory = dirname(recordPath);
  while (true) {
    const candidate = join(directory, "as-is.md");
    if (candidate !== recordPath && canonicalTitle(readFileSync(candidate, "utf8"))) ancestors.push(candidate);
    if (directory === repositoryRoot) break;
    directory = dirname(directory);
  }
  ancestors.reverse();
  const title = canonicalTitle(readFileSync(recordPath, "utf8"));
  if (!title) throw new Error(`canonical record has no title: ${recordPath}`);
  return [...ancestors.map((ancestor) => {
    const ancestorTitle = canonicalTitle(readFileSync(ancestor, "utf8"));
    if (!ancestorTitle) throw new Error(`ancestor has no title: ${ancestor}`);
    return `[${ancestorTitle}](${relative(dirname(recordPath), ancestor).split(sep).join("/")}#design)`;
  }), `**${title}**`].join(" / ");
};
for (const recordPath of canonicalRecords(repositoryRoot)) {
  const text = readFileSync(recordPath, "utf8");
  const relativeRecord = relative(repositoryRoot, recordPath);
  const breadcrumb = expectedBreadcrumb(recordPath);
  if (text.split(breadcrumb).length - 1 !== 1) throw new Error(`canonical record must contain exactly one root-to-current breadcrumb: ${relativeRecord}`);
  if (/^Parent: /m.test(text)) throw new Error(`canonical record must not retain legacy Parent navigation: ${relativeRecord}`);
  const designStart = text.indexOf("\n## Design\n");
  if (designStart < 0) throw new Error(`canonical record must have Design: ${relativeRecord}`);
  const nextSection = text.indexOf("\n## ", designStart + 1);
  const design = text.slice(designStart, nextSection < 0 ? undefined : nextSection);
  if (!design.includes(breadcrumb)) throw new Error(`breadcrumb must occur in Design: ${relativeRecord}`);
  const firstDiagram = design.indexOf("```mermaid");
  if (firstDiagram >= 0 && design.indexOf(breadcrumb) > firstDiagram) throw new Error(`breadcrumb must precede first diagram: ${relativeRecord}`);
  if (!text.includes("\n## Components\n")) continue;
  const components = text.split("\n## Components\n", 2)[1].split("\n## ", 1)[0];
  const targets = Array.from(new Set(linkTargets(components)));
  const allTargets = linkTargets(text);
  for (const target of targets) {
    if (allTargets.filter((candidate) => candidate === target).length !== 2) throw new Error(`immediate child target must occur only in its Components fallback and linked Mermaid box: ${relativeRecord} -> ${target}`);
  }
  if (!text.includes("\n## Links\n")) continue;
  const childDirectories = targets.map((target) => target.slice(0, -"as-is.md#design".length));
  const links = text.split("\n## Links\n", 2)[1];
  for (const target of markdownTargets(links)) {
    if (childDirectories.some((childDirectory) => target.startsWith(childDirectory)) && /(?:^|\/)(agent|SKILL)\.md(?:#.*)?$/.test(target)) throw new Error(`parent Links must not catalog an ordinary direct-child contract: ${relativeRecord} -> ${target}`);
  }
}
if (readFileSync(rootRecord, "utf8").includes(".pi/as-is.md")) throw new Error("root record must not map the projected .pi prompt as a nonexistent component");

const componentsText = readFileSync(componentsRecord, "utf8");
const componentsDesign = componentsText.slice(componentsText.indexOf("\n## Design\n"), componentsText.indexOf("\n## Links\n"));
for (const phrase of [
  "### Component relationship map",
  "- Pre-render layout plan:",
  "taller-than-wide balanced relationship map",
  "nine child boxes, seven labeled relationship arrows",
  "config:\n  layout: elk",
  "flowchart TB",
]) {
  if (!componentsDesign.includes(phrase)) throw new Error(`Components diagram must include ${phrase}`);
}
if (componentsDesign.includes("flowchart LR") || componentsDesign.includes("direction LR")) throw new Error("Components diagram must not retain wide LR layout");

const diagramValidation = validateAsIsDiagramsAndNavigation(repositoryRoot, {
  rootRecordPath: "as-is.md",
  recordPaths: canonicalRecords(repositoryRoot).map((path) => relative(repositoryRoot, path)),
  requireDiagrams: false,
  requireNamedDiagramHeadings: false,
});
if (diagramValidation.issues.length > 0) {
  throw new Error(`as-is diagram and navigation validation failed: ${JSON.stringify(diagramValidation.issues)}`);
}
if (diagramValidation.records !== canonicalRecords(repositoryRoot).length) {
  throw new Error("as-is diagram and navigation validation did not inspect every canonical record");
}
if (diagramValidation.diagrams.some((diagram) => diagram.expectedHrefs?.some((target) => target.includes("<") || target.includes(">")))) {
  throw new Error("repository-wide rendered diagram inputs must not include placeholder href targets");
}
console.log(`managing-as-is-document content validation passed (${diagramValidation.records} records, ${diagramValidation.diagrams.length} diagrams)`);
