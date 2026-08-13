type BunFile = {
  text(): Promise<string>;
  exists(): Promise<boolean>;
};

const bun = (globalThis as typeof globalThis & { Bun: { file(path: URL): BunFile } }).Bun;
const file = (relativePath: string) => bun.file(new URL(relativePath, import.meta.url));
const [skill, record, backlog, examples] = await Promise.all([file("./SKILL.md").text(), file("./as-is.md").text(), file("./backlog.md").text(), file("./diagram-examples.md").text()]);
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
  "A `Components` table is the required Markdown fallback for each immediate child target rendered as a linked structural-container node",
  "the intentional diagram-link and Markdown-fallback pair is not a duplicated `## Links` catalog",
  "Source and test files are omitted by default",
  "Omit `## Links` when no qualifying direct context exists; never retain an empty Links section or add a placeholder statement.",
  "## Diagram And Navigation Model",
  "descriptive `### <diagram name>` heading",
  "resolving nearby Markdown `Parent:` link",
  "taller, narrower ELK/TB flowchart",
  "Authoritative prose and links define",
  "only when it improves scanability",
  "## Example Structure",
  "# <component-name> - as-is",
  "[`<immediate child>`](<child-path>/as-is.md#design)",
  "Parent: [`<parent component>`](<parent-relative-path>/as-is.md#design)",
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

const requiredRecordPhrases = [
  "# Managing As-Is Documents - as-is",
  "Parent: [Skills](../as-is.md#design)",
  "does not select, authorize, start, observe, recover, cancel, or delegate agents",
  "no live test can exercise record-maintenance execution",
  "Residual risk:",
];
for (const phrase of requiredRecordPhrases) {
  if (!record.includes(phrase)) throw new Error(`record is missing required phrase: ${phrase}`);
}

const dependency = "skills/managing-as-is-document:formalize-as-is-relationship-vocabulary, skills/managing-as-is-document:define-as-is-flow-view-rules";
if (!backlog.includes(dependency)) throw new Error("backlog dependencies must use scoped component:id references");

for (const heading of ["## Structural container", "### Complete parent-record example", "### Structural container", "### Why this representation", "## Context map", "### Context map", "## Scenario or sequence flow", "### Scenario sequence", "## Data flow", "### Data flow", "## State flow", "### State flow", "## Decision flow", "### Decision flow", "## Recovery flow", "### Recovery flow", "## Actor journey", "### Actor journey"]) {
  if (!examples.includes(heading)) throw new Error(`diagram examples are missing ${heading}`);
}

for (const phrase of [
  "Parent: [Commerce Platform](../../as-is.md#design)",
  "The matching Markdown `Components` table remains the authoritative fallback when a renderer strips diagram links.",
  "<a href='./validation/as-is.md#design'>Validation</a>",
  "- Layout: balanced taller, narrower relationship map",
  "### Data flow",
  "### State flow",
  "### Decision flow",
  "config:\n  layout: elk",
  "flowchart TB",
  "The diagram-link and Markdown-fallback pair is intentional; do not repeat child targets in `## Links`",
  "Child box labels target the corresponding `Components` table entries",
]) {
  if (!examples.includes(phrase)) throw new Error(`structural container example is missing required phrase: ${phrase}`);
}

const structuralExample = examples.slice(examples.indexOf("## Structural container"), examples.indexOf("\n## Context map"));
for (const target of ["./validation/as-is.md#design", "./authorization/as-is.md#design", "./order-recording/as-is.md#design"]) {
  const occurrences = structuralExample.split(target).length - 1;
  if (occurrences !== 2) throw new Error(`structural container example must pair the linked child box and Components-table fallback for ${target}`);
}
if (skill.includes("container-diagram-example.md")) throw new Error("SKILL.md must link the consolidated structural container example in diagram-examples.md");
if (await legacyContainerExample.exists()) throw new Error("container-diagram-example.md must be consolidated into diagram-examples.md");
if (skill.lastIndexOf("\n## Links") > skill.indexOf("\n## Outputs")) throw new Error("SKILL.md must place supporting links beside the rules they support rather than in a trailing Links catalog");

console.log("managing-as-is-document content validation passed");
