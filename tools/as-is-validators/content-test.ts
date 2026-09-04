// This is an as-is repository dogfood validator, not a portable skill conformance suite.
// Its repository-wide navigation assertions implement this repository's approved adoption policy.
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { validateAsIsDiagramsAndNavigation } from "./scripts/validate-as-is-diagrams-and-navigation";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

type BunFile = {
  text(): Promise<string>;
  exists(): Promise<boolean>;
};

const bun = (globalThis as typeof globalThis & { Bun: { file(path: URL): BunFile } }).Bun;
const file = (relativePath: string) => bun.file(new URL(relativePath, import.meta.url));
// A14 runtime home: of tools/as-is-validators retired at F5; this validator is retained runtime tooling.
// Its former self-referential narrative phrase batteries retired with that narrative; the repository-wide record walk, breadcrumb rules,
// and diagram/navigation validation below remain the repo-wide conformance gate; A13's transitional scope is resolved at F9.
const [vocabulary, mermaidSkill, skillsRecord] = await Promise.all([
  file("../../core/contracts/architecture-vocabulary.md").text(),
  file("../../skills/designing-mermaid-diagrams/SKILL.md").text(),
  file("../../skills/as-is.md").text(),
]);

for (const phrase of [
  "Define the reader question and diagram scope; choose a supported view and canonical labels",
  "write linked Mermaid source; check structure and hrefs; render only when material; inspect output; report source and renderer evidence separately",
  "Design the reader-oriented view, preserve navigational hrefs, run source checks, render when available, and report renderer limitations explicitly",
]) {
  if (!mermaidSkill.includes(phrase)) throw new Error(`generic Mermaid skill is missing required phrase: ${phrase}`);
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

const repositoryRoot = dirname(dirname(dirname(new URL(import.meta.url).pathname)));
const taskProtocol = readFileSync(join(repositoryRoot, "core", "contracts", "component-task-record-protocol.md"), "utf8");
const configurationGuide = readFileSync(join(repositoryRoot, "core", "contracts", "configuration.md"), "utf8");
const executionContract = readFileSync(join(repositoryRoot, "core", "contracts", "execution-contract.md"), "utf8");
const structuringSkill = readFileSync(join(repositoryRoot, "skills", "structuring-content", "SKILL.md"), "utf8");
const namingSkill = readFileSync(join(repositoryRoot, "skills", "choosing-names", "SKILL.md"), "utf8");
const historicalRecord = readFileSync(join(repositoryRoot, "agents", "as-is", "as-is-record-structure.md"), "utf8");
for (const [name, text, phrases] of [
  ["task protocol", taskProtocol, ["## Authority Boundary", "This protocol owns task metadata", "does not define component architecture", "does not define component architecture, durable component-record structure"]],
  ["configuration guide", configurationGuide, ["Each consumer owns the keys it reads", "generic resolver owns JSON parsing", "core/modules/task-control/task-record-policy.ts", "core/modules/observability/tracer.ts"]],
  ["execution contract", executionContract, ["core/contracts/execution-contract.md", "no standalone executable runtime contract module exists yet", "concrete consumer need"]],
  ["structuring skill", structuringSkill, ["Shape content around reader goals, ownership, discoverability, and lifecycle while preserving existing structural conventions", "choose the smallest meaningful location and representation", "keep authority with the owning record"]],
  ["naming skill", namingSkill, ["Inspect the concept's parent, siblings, and naming guidance, then choose the narrowest accurate name and record material departures", "update proven references atomically when renaming"]],
  ["historical as-is record", historicalRecord, ["historical companion", "current operational authority", "separate `## Boundary` heading is not mandatory"]],
] as const) {
  for (const phrase of phrases) if (!text.includes(phrase)) throw new Error(`${name} is missing reconciliation test phrase: ${phrase}`);
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
  if (path === join(repositoryRoot, "candidate", "benchmark")) return []; // frozen benchmark consumer trees are preserved evidence with their own record roots, not live canonical records
  if (entry.isDirectory()) return canonicalRecords(path);
  if (entry.isFile() && entry.name === "as-is.md" && path !== excludedPrompt && canonicalTitle(readFileSync(path, "utf8"))) return [path];
  return [];
});
const normalizeTarget = (target: string) => target.replace(/(^|\/)\.\//g, "$1");
const linkTargets = (text: string) => Array.from(text.matchAll(/(?:href=['"]|\]\()([^'")\s]+as-is\.md#design)/g), (match) => normalizeTarget(match[1]));
const markdownTargets = (text: string) => Array.from(text.matchAll(/\]\(([^)\s]+)\)/g), (match) => normalizeTarget(match[1]));
const rootRecord = join(repositoryRoot, "as-is.md");
const componentTargetPaths = (recordPath: string, text: string): string[] => Array.from(text.matchAll(/^\|\s*\[[^\]]+\]\(([^)\s]+as-is\.md#design)\)/gm), (match) => resolve(dirname(recordPath), match[1].split("#", 1)[0]));
const namespaceArtifacts = (text: string): string[] => {
  const declaration = text.match(/The (?:physical|flat) namespace also retains these directly owned artifacts:\s*([^\n]+)/);
  return declaration ? Array.from(declaration[1].split(". ", 1)[0].matchAll(/`([^`]+)`/g), (match) => match[1]) : [];
};
const pathInsideRepository = (path: string): boolean => {
  const root = resolve(repositoryRoot);
  const candidate = resolve(path);
  const remainder = relative(root, candidate);
  return remainder === "" || (!remainder.startsWith("..") && !remainder.startsWith(`${sep}..`));
};
const checkCoveragePath = (path: string, label: string, issues: string[]): boolean => {
  let stat;
  try {
    stat = lstatSync(path);
  } catch {
    issues.push(`${label} does not exist: ${relative(repositoryRoot, path)}`);
    return false;
  }
  if (!stat.isSymbolicLink()) return true;
  try {
    const target = realpathSync(path);
    if (!pathInsideRepository(target)) {
      issues.push(`${label} symlink escapes repository: ${relative(repositoryRoot, path)}`);
      return false;
    }
    return true;
  } catch {
    issues.push(`${label} symlink target cannot be resolved: ${relative(repositoryRoot, path)}`);
    return false;
  }
};
const validateComponentCoverage = (): void => {
  const issues: string[] = [];
  const records = canonicalRecords(repositoryRoot);
  for (const recordPath of records) {
    for (const target of componentTargetPaths(recordPath, readFileSync(recordPath, "utf8"))) {
      checkCoveragePath(target, "declared record", issues);
      checkCoveragePath(dirname(target), "declared component", issues);
    }
  }

  const boundaries = [
    { path: join(repositoryRoot, "skills"), record: join(repositoryRoot, "skills", "as-is.md"), artifacts: namespaceArtifacts(readFileSync(join(repositoryRoot, "skills", "as-is.md"), "utf8")) },
    { path: join(repositoryRoot, "core", "adapters"), record: join(repositoryRoot, "core", "adapters", "as-is.md"), artifacts: [] },
    { path: join(repositoryRoot, "tools"), record: join(repositoryRoot, "tools", "as-is.md"), artifacts: [] },
  ];
  for (const boundary of boundaries) {
    if (!checkCoveragePath(boundary.path, "checked boundary", issues)) continue;
    const expected = new Set([
      ...componentTargetPaths(boundary.record, readFileSync(boundary.record, "utf8")).filter((target) => dirname(dirname(target)) === boundary.path).map((target) => basename(dirname(target))),
      ...boundary.artifacts,
      basename(boundary.record),
    ]);
    for (const entry of readdirSync(boundary.path)) {
      const entryPath = join(boundary.path, entry);
      checkCoveragePath(entryPath, "boundary entry", issues);
      if (entry === "node_modules") issues.push(`node_modules is forbidden at checked boundary: ${relative(repositoryRoot, entryPath)}`);
      if (!expected.has(entry)) issues.push(`undeclared direct child at checked boundary: ${relative(repositoryRoot, entryPath)}`);
    }
    for (const entry of expected) checkCoveragePath(join(boundary.path, entry), "declared boundary child", issues);
  }
  if (issues.length > 0) throw new Error(`tree-to-record coverage validation failed: ${JSON.stringify(issues)}`);
  console.log(`tree-to-record coverage passed (${records.length} records, ${boundaries.length} boundaries)`);
};
const expectedBreadcrumb = (recordPath: string) => {
  if (recordPath === rootRecord) return "**Lineage**: **as-is**";
  const ancestors: string[] = [];
  let directory = dirname(recordPath);
  while (true) {
    const candidate = join(directory, "as-is.md");
    if (candidate !== recordPath && existsSync(candidate) && canonicalTitle(readFileSync(candidate, "utf8"))) ancestors.push(candidate);
    if (directory === repositoryRoot) break;
    directory = dirname(directory);
  }
  ancestors.reverse();
  const title = canonicalTitle(readFileSync(recordPath, "utf8"));
  if (!title) throw new Error(`canonical record has no title: ${recordPath}`);
  return `**Lineage**: ${[...ancestors.map((ancestor) => {
    const ancestorTitle = canonicalTitle(readFileSync(ancestor, "utf8"));
    if (!ancestorTitle) throw new Error(`ancestor has no title: ${ancestor}`);
    return `[${ancestorTitle}](${relative(dirname(recordPath), ancestor).split(sep).join("/")}#design)`;
  }), `**${title}**`].join(" / ")}`;
};
for (const recordPath of canonicalRecords(repositoryRoot)) {
  const text = readFileSync(recordPath, "utf8");
  const relativeRecord = relative(repositoryRoot, recordPath);
  const breadcrumb = expectedBreadcrumb(recordPath);
  if (text.split(breadcrumb).length - 1 !== 1) throw new Error(`canonical record must contain exactly one **Lineage** line: ${relativeRecord}`);
  if (/^Parent: /m.test(text)) throw new Error(`canonical record must not retain legacy Parent navigation: ${relativeRecord}`);
  const designStart = text.indexOf("\n## Design\n");
  if (designStart < 0) throw new Error(`canonical record must have Design: ${relativeRecord}`);
  const nextSection = text.indexOf("\n## ", designStart + 1);
  const design = text.slice(designStart, nextSection < 0 ? undefined : nextSection);
  if (!design.includes(breadcrumb)) throw new Error(`**Lineage** must occur in Design: ${relativeRecord}`);
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

const adapterRecord = join(repositoryRoot, "core", "adapters", "as-is.md");
const adapterText = readFileSync(adapterRecord, "utf8");
const adapterDesign = adapterText.slice(adapterText.indexOf("\n## Design\n"), adapterText.indexOf("\n## Links\n"));
for (const phrase of ["### Adapter hierarchy", "flowchart TB", "host-setup"]) {
  if (!adapterDesign.includes(phrase)) throw new Error(`Core adapter diagram must include ${phrase}`);
}
validateComponentCoverage();

const diagramValidation = validateAsIsDiagramsAndNavigation(repositoryRoot, {
  rootRecordPath: "as-is.md",
  recordPaths: canonicalRecords(repositoryRoot).map((path) => relative(repositoryRoot, path)),
  requireDiagrams: false,
  requireNamedDiagramHeadings: false,
  maxUnwrappedLabelCharacters: 28,
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
console.log(`repository as-is record validation passed (${diagramValidation.records} records, ${diagramValidation.diagrams.length} diagrams)`);
