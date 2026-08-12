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
  "configured backlog and changelog records",
  "The record's durable inputs are authoritative",
  "## Record Model",
  "has no container diagram",
  "Links are direct, resolving repository-relative context",
  "## Diagram And Navigation Model",
  "Authoritative prose and links define",
  "only when it improves scanability",
  "## Example Structure",
  "# <component-name> - as-is",
  "[`<immediate child>`](<child-path>/as-is.md#design)",
  "Parent: [`<parent component>`](<parent-relative-path>/as-is.md#design)",
  "## Applying The Model",
  "After validation, the configured changelog record holds the validated durable change",
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

for (const heading of ["## Structural container", "### Complete parent-record example", "### Why this representation", "## Context map", "## Scenario or sequence flow", "## Recovery flow", "## Actor journey"]) {
  if (!examples.includes(heading)) throw new Error(`diagram examples are missing ${heading}`);
}

for (const phrase of ["Parent: [Commerce Platform](../../as-is.md#design)", "<a href='./validation/as-is.md#design'>Validation</a>", "Markdown `Components` table remains the authoritative fallback"]) {
  if (!examples.includes(phrase)) throw new Error(`structural container example is missing required phrase: ${phrase}`);
}

if (skill.includes("container-diagram-example.md")) throw new Error("SKILL.md must link the consolidated structural container example in diagram-examples.md");
if (await legacyContainerExample.exists()) throw new Error("container-diagram-example.md must be consolidated into diagram-examples.md");
if (skill.lastIndexOf("\n## Links") > skill.indexOf("\n## Outputs")) throw new Error("SKILL.md must place supporting links beside the rules they support rather than in a trailing Links catalog");

console.log("managing-as-is-document content validation passed");
