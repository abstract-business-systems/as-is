import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

export type AsIsDiagramInput = {
  id: string;
  source: string;
  expectedHrefs?: string[];
  recordPath: string;
  diagramIndex: number;
};

export type AsIsDiagramValidationOptions = {
  rootRecordPath: string;
  recordPaths: readonly string[];
  requireDiagrams?: boolean;
  requireNamedDiagramHeadings?: boolean;
  maxUnwrappedLabelCharacters?: number;
  /** Transitional-only extra record-section titles accepted while a migration is pending; must be empty in the adopted steady state. */
  transitionalSectionTitles?: readonly string[];
  /** Transitional-only: allow design links resolving to existing canonical records outside the validated set (excluded transitional namespaces). */
  transitionalExternalRecords?: boolean;
};

export type AsIsValidationIssue = {
  path: string;
  code: string;
  message: string;
};

export type AsIsDiagramValidation = {
  records: number;
  diagrams: AsIsDiagramInput[];
  issues: AsIsValidationIssue[];
};

type ComponentsTable = {
  targets: string[];
  occurrences: string[];
};

type Breadcrumb = {
  line: string;
  targets: string[];
  labels: string[];
};

type RecordInfo = {
  path: string;
  relativePath: string;
  title: string;
  text: string;
  design: string;
  components: string | undefined;
  componentTable: ComponentsTable | undefined;
  breadcrumb: Breadcrumb | undefined;
};

type StructuralView = {
  flowchart: boolean;
  hrefByNode: Map<string, string>;
  nodeIds: Set<string>;
  containerNodeIds: Set<string>;
  outsideNodeIds: Set<string>;
  edges: Array<{ source: string; target: string; label: string | undefined }>;
  subgraphTitles: string[];
};

const designLinkPattern = /(?:href\s*=\s*['"]|\]\()([^'"\s)]+as-is\.md#design)/g;
const markdownDesignLinkPattern = /\]\(([^)\s]+as-is\.md#design)/g;
const mermaidFencePattern = /```mermaid\s*\n([\s\S]*?)\n```/g;
const breadcrumbPattern = /^\*\*Lineage\*\*:\s*(?:(?:\[([^\]]+)\]\(([^)\s]+as-is\.md#design)\)\s*\/\s*))*\*\*([^*]+)\*\*$/;
const allowedRecordSections = new Set(["Purpose", "Components", "Design", "Relationships", "Links"]);
const defaultMaxUnwrappedLabelCharacters = 28;
const mermaidLabelPattern = /\["([^"]+)"\]|\['([^']+)'\]|\{"([^"]+)"\}|\{'([^']+)'\}/g;
const mermaidEdgeLabelPattern = /\|([^|\n]+)\|/g;

const visibleLabelLength = (label: string): number => label.replace(/<[^>]*>/g, "").length;
const stripMarkup = (label: string): string => label.replace(/<a\b[^>]*>/g, "").replace(/<\/a>/g, "");
const unwrappedLabelIssues = (source: string, maxCharacters: number): string[] => {
  const labels: string[] = [];
  for (const line of source.split(/\r?\n/)) {
    for (const match of line.matchAll(mermaidLabelPattern)) labels.push(match[1] ?? match[2] ?? match[3] ?? match[4] ?? "");
    for (const match of line.matchAll(mermaidEdgeLabelPattern)) labels.push(match[1]);
  }
  return labels.filter((label) => !stripMarkup(label).includes("<br/>") && visibleLabelLength(stripMarkup(label)) > maxCharacters);
};

const canonicalTitle = (text: string): string | undefined => {
  const firstContentLine = text.split(/\r?\n/).find((line) => line.trim().length > 0);
  return firstContentLine?.match(/^# (.+?) - as-is$/)?.[1];
};

const normalizeTarget = (target: string): string => target.replace(/(^|\/)\.\//g, "$1");
const unique = (values: string[]): string[] => [...new Set(values)];
const relativePath = (root: string, path: string): string => relative(root, path).split(sep).join("/");

const section = (text: string, heading: string): string | undefined => {
  const start = text.search(new RegExp(`^## ${heading}\\s*$`, "m"));
  if (start < 0) return undefined;
  const bodyStart = text.indexOf("\n", start);
  if (bodyStart < 0) return "";
  const next = text.slice(bodyStart + 1).search(/^## /m);
  return text.slice(bodyStart + 1, next < 0 ? undefined : bodyStart + 1 + next);
};

const suppliedRecordPaths = (root: string, recordPaths: readonly string[], issues: AsIsValidationIssue[]): string[] => {
  const paths = new Set<string>();
  for (const supplied of recordPaths) {
    const path = resolve(root, supplied);
    const rootRelative = relative(root, path);
    if (rootRelative.startsWith(`..${sep}`) || rootRelative === "..") {
      issues.push({ path: rootRelative.split(sep).join("/"), code: "record-scope", message: "supplied record path is outside the validation scope" });
    } else if (!existsSync(path)) {
      issues.push({ path: rootRelative.split(sep).join("/"), code: "record-scope", message: "supplied record path does not exist" });
    } else if (!path.endsWith(`${sep}as-is.md`) && path !== join(root, "as-is.md")) {
      issues.push({ path: rootRelative.split(sep).join("/"), code: "record-scope", message: "supplied record path must name an as-is.md record" });
    } else {
      paths.add(path);
    }
  }
  return [...paths].sort();
};

const rawDesignTargetOccurrences = (text: string): string[] => Array.from(text.matchAll(designLinkPattern), (match) => match[1]);
const rawDesignTargets = (text: string): string[] => unique(rawDesignTargetOccurrences(text));
const designTargetOccurrences = (text: string): string[] => rawDesignTargetOccurrences(text).map(normalizeTarget);
const designTargets = (text: string): string[] => unique(designTargetOccurrences(text));
const markdownTargetOccurrences = (text: string): string[] => Array.from(text.matchAll(markdownDesignLinkPattern), (match) => normalizeTarget(match[1]));
const markdownTargets = (text: string): string[] => unique(markdownTargetOccurrences(text));

const parseComponentsTable = (text: string): ComponentsTable | undefined => {
  const lines = text.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => /^\|\s*Component\s*\|\s*Purpose\s*\|\s*$/.test(line));
  if (headerIndex < 0 || !/^\|\s*:?-+:?\s*\|\s*:?-+:?\s*\|\s*$/.test(lines[headerIndex + 1] ?? "")) return undefined;
  const occurrences: string[] = [];
  let index = headerIndex + 2;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    const row = lines[index].match(/^\|\s*\[[^\]]+\]\(([^)\s]+as-is\.md#design)\)\s*\|\s*[^|]+?\s*\|\s*$/);
    if (!row) return undefined;
    occurrences.push(normalizeTarget(row[1]));
    index += 1;
  }
  return occurrences.length > 0 ? { targets: unique(occurrences), occurrences } : undefined;
};

const recordTarget = (from: string, to: string): string => {
  const target = relative(dirname(from), to).split(sep).join("/");
  return `${target || "as-is.md"}#design`;
};

const resolveDesignTarget = (root: string, from: string, target: string): string | undefined => {
  const targetPath = target.split("#", 1)[0];
  if (!targetPath || targetPath.includes("<") || targetPath.includes(">")) return undefined;
  const resolved = resolve(dirname(from), targetPath);
  const rootRelative = relative(root, resolved);
  if (rootRelative.startsWith(`..${sep}`) || rootRelative === ".." || resolved === root) return undefined;
  return resolved;
};

const parseBreadcrumb = (design: string, title: string): Breadcrumb | undefined => {
  for (const line of design.split(/\r?\n/)) {
    const trimmed = line.trim();
    const match = trimmed.match(breadcrumbPattern);
    if (!match || match[3] !== title) continue;
    const entries = [...trimmed.matchAll(/\[([^\]]+)\]\(([^)\s]+as-is\.md#design)\)/g)];
    return {
      line: trimmed,
      labels: entries.map((entry) => entry[1]),
      targets: entries.map((entry) => normalizeTarget(entry[2])),
    };
  }
  return undefined;
};

const structuralView = (source: string): StructuralView => {
  const flowchart = /\bflowchart\s+(?:TB|TD|BT|RL|LR)\b/.test(source);
  const hrefByNode = new Map<string, string>();
  const nodeIds = new Set<string>();
  const containerNodeIds = new Set<string>();
  const outsideNodeIds = new Set<string>();
  const edges: StructuralView["edges"] = [];
  const subgraphTitles: string[] = [];
  let subgraphDepth = 0;
  for (const line of source.split(/\r?\n/)) {
    const subgraph = line.match(/^\s*subgraph\s+[^\s[]+(?:\["([^"]+)"\]|\[([^\]]+)\])?/);
    if (subgraph) {
      subgraphTitles.push(subgraph[1] ?? subgraph[2] ?? "");
      subgraphDepth += 1;
      continue;
    }
    if (/^\s*end\s*$/.test(line)) {
      subgraphDepth = Math.max(0, subgraphDepth - 1);
      continue;
    }
    const node = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s*(?=\[|\(|\{)/);
    if (node) {
      nodeIds.add(node[1]);
      (subgraphDepth > 0 ? containerNodeIds : outsideNodeIds).add(node[1]);
    }
    const linkedNode = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s*\[[^\n]*?href\s*=\s*['"]([^'"]+as-is\.md#design)['"]/);
    if (linkedNode) hrefByNode.set(linkedNode[1], normalizeTarget(linkedNode[2]));
    const edge = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s+(-->|-.->|==>|~~~)(?:\|([^|]*)\|)?\s*([A-Za-z][A-Za-z0-9_-]*)/);
    if (edge) {
      edges.push({ source: edge[1], label: edge[3], target: edge[4] });
      for (const nodeId of [edge[1], edge[4]]) {
        nodeIds.add(nodeId);
        (subgraphDepth > 0 ? containerNodeIds : outsideNodeIds).add(nodeId);
      }
    }
  }
  return { flowchart, hrefByNode, nodeIds, containerNodeIds, outsideNodeIds, edges, subgraphTitles };
};

const isStructuralContainer = (source: string, title: string): boolean => {
  const view = structuralView(source);
  return view.flowchart && view.subgraphTitles.length === 1 && view.subgraphTitles[0] === title;
};

const addIssue = (issues: AsIsValidationIssue[], root: string, path: string, code: string, message: string): void => {
  issues.push({ path: relativePath(root, path), code, message });
};

const parentCandidates = (records: Map<string, RecordInfo>, root: string, issues: AsIsValidationIssue[]): Map<string, string[]> => {
  const candidates = new Map<string, string[]>();
  for (const parent of records.values()) {
    for (const target of parent.componentTable?.targets ?? []) {
      const childPath = resolveDesignTarget(root, parent.path, target);
      const child = childPath ? records.get(childPath) : undefined;
      if (!child) {
        addIssue(issues, root, parent.path, "unresolved-design-link", `Components child link does not resolve to a canonical record: ${target}`);
        continue;
      }
      if (child.path === parent.path) addIssue(issues, root, parent.path, "parent-graph", "a record cannot declare itself as an immediate child");
      const paths = candidates.get(child.path) ?? [];
      paths.push(parent.path);
      candidates.set(child.path, paths);
    }
  }
  return candidates;
};

const declaredAncestorChain = (record: RecordInfo, root: string, rootPath: string, records: Map<string, RecordInfo>, candidates: Map<string, string[]>, issues: AsIsValidationIssue[]): string[] | undefined => {
  if (resolve(record.path) === rootPath) {
    if ((candidates.get(record.path)?.length ?? 0) > 0) addIssue(issues, root, record.path, "parent-graph", "the canonical root record must not have a declared parent");
    return [];
  }
  const ancestors: string[] = [];
  const seen = new Set<string>([record.path]);
  let childPath = record.path;
  while (resolve(childPath) !== rootPath) {
    const parents = unique(candidates.get(childPath) ?? []);
    if (parents.length === 0) {
      addIssue(issues, root, record.path, "breadcrumb-parent", "record has no uniquely declared parent in a Components table");
      return undefined;
    }
    if (parents.length > 1) {
      addIssue(issues, root, record.path, "breadcrumb-parent", "record has more than one declared parent; the canonical breadcrumb is ambiguous");
      return undefined;
    }
    const parentPath = parents[0];
    if (parentPath === rootPath && (candidates.get(rootPath)?.length ?? 0) > 0) addIssue(issues, root, record.path, "parent-graph", "declared Components relationships contain a cycle involving the canonical root record");
    if (seen.has(parentPath)) {
      addIssue(issues, root, record.path, "breadcrumb-parent", "declared Components relationships contain a cycle");
      return undefined;
    }
    const parent = records.get(parentPath);
    if (!parent) {
      addIssue(issues, root, record.path, "breadcrumb-parent", "declared breadcrumb parent is not a canonical record");
      return undefined;
    }
    ancestors.unshift(parentPath);
    seen.add(parentPath);
    childPath = parentPath;
  }
  return ancestors;
};

export function validateAsIsDiagramsAndNavigation(repositoryRoot: string, options: AsIsDiagramValidationOptions): AsIsDiagramValidation {
  const root = resolve(repositoryRoot);
  const rootPath = resolve(root, options.rootRecordPath);
  const issues: AsIsValidationIssue[] = [];
  const records = new Map<string, RecordInfo>();
  const rootRelative = relative(root, rootPath);
  if (rootRelative.startsWith(`..${sep}`) || rootRelative === "..") issues.push({ path: rootRelative.split(sep).join("/"), code: "root-record", message: "configured root record must be inside the validation scope" });

  const transitionalSections = new Set((options.transitionalSectionTitles ?? []).map((title) => title.trim()));
  for (const path of suppliedRecordPaths(root, options.recordPaths, issues)) {
    const text = readFileSync(path, "utf8");
    const title = canonicalTitle(text);
    for (const match of text.matchAll(/^## ([^\n]+)$/gm)) {
      if (!allowedRecordSections.has(match[1].trim()) && !transitionalSections.has(match[1].trim())) addIssue(issues, root, path, "record-shape", `canonical record contains unsupported section: ${match[1].trim()}`);
    }
    if (/^\s*-?\s*Pre-render layout plan:/im.test(text)) addIssue(issues, root, path, "record-shape", "canonical record must not contain a render layout plan");
    if (!title) {
      addIssue(issues, root, path, "strict-title", "the first content line must use `# <component-name> - as-is`");
      continue;
    }
    const design = section(text, "Design");
    if (design === undefined) {
      addIssue(issues, root, path, "missing-design", "canonical record must contain a `## Design` section");
      continue;
    }
    const components = section(text, "Components");
    const componentTable = components === undefined ? undefined : parseComponentsTable(components);
    if (components !== undefined && componentTable === undefined) addIssue(issues, root, path, "components-fallback", "Components must contain a two-column Component/Purpose Markdown table");
    const breadcrumb = parseBreadcrumb(design, title);
    if (!breadcrumb) addIssue(issues, root, path, "breadcrumb", "Design must contain one `**Lineage**: ` root-to-current line ending at the canonical title");
    if (breadcrumb && design.split(breadcrumb.line).length - 1 !== 1) addIssue(issues, root, path, "breadcrumb", "Design must contain exactly one root-to-current breadcrumb");
    records.set(path, { path, relativePath: relativePath(root, path), title, text, design, components, componentTable, breadcrumb });
  }

  const candidates = parentCandidates(records, root, issues);
  if (!records.has(rootPath)) issues.push({ path: relativePath(root, rootPath), code: "root-record", message: "configured root record was not discovered as a canonical record" });
  const diagrams: AsIsDiagramInput[] = [];

  for (const record of records.values()) {
    for (const target of designTargets(record.text)) {
      const resolved = resolveDesignTarget(root, record.path, target);
      if (!resolved || !existsSync(resolved) || (!records.has(resolved) && !options.transitionalExternalRecords)) addIssue(issues, root, record.path, "unresolved-design-link", `design link does not resolve to a canonical record: ${target}`);
    }

    const isRoot = resolve(record.path) === rootPath;
    if (isRoot && record.breadcrumb && record.breadcrumb.targets.length > 0) addIssue(issues, root, record.path, "breadcrumb-parent", "the root record must not link to a parent in its breadcrumb");
    if (!isRoot) {
      if (!record.breadcrumb || record.breadcrumb.targets.length === 0) addIssue(issues, root, record.path, "breadcrumb-parent", "a non-root record must expose a nearby parent link in its breadcrumb");
      if (record.breadcrumb?.targets.at(-1) === normalizeTarget(recordTarget(record.path, record.path))) addIssue(issues, root, record.path, "breadcrumb-parent", "a non-root record must not use a self-link as its final parent breadcrumb");
    }

    const ancestors = declaredAncestorChain(record, root, rootPath, records, candidates, issues);
    if (record.breadcrumb && ancestors) {
      const expectedTargets = ancestors.map((ancestor) => normalizeTarget(recordTarget(record.path, ancestor)));
      if (record.breadcrumb.targets.length !== expectedTargets.length || record.breadcrumb.targets.some((target, index) => target !== expectedTargets[index])) {
        addIssue(issues, root, record.path, "breadcrumb-parent", `breadcrumb must list declared ancestors in order: ${expectedTargets.join(" / ") || "(root record)"}`);
      }
      for (let index = 0; index < record.breadcrumb.targets.length; index += 1) {
        const target = record.breadcrumb.targets[index];
        const targetPath = resolveDesignTarget(root, record.path, target);
        const targetRecord = targetPath ? records.get(targetPath) : undefined;
        if (!targetRecord) continue;
        if (record.breadcrumb.labels[index] !== targetRecord.title) addIssue(issues, root, record.path, "breadcrumb-label", `breadcrumb label must match its canonical record title: ${targetRecord.title}`);
      }
    }

    const firstFenceIndex = record.design.indexOf("```mermaid");
    const firstNamedDiagramIndex = record.design.search(/^### .+$/m);
    if (record.breadcrumb && ((firstNamedDiagramIndex >= 0 && record.design.indexOf(record.breadcrumb.line) > firstNamedDiagramIndex) || (firstNamedDiagramIndex < 0 && firstFenceIndex >= 0 && record.design.indexOf(record.breadcrumb.line) > firstFenceIndex))) {
      addIssue(issues, root, record.path, "breadcrumb", "breadcrumb must precede the first named diagram view");
    }

    const fences = [...record.design.matchAll(mermaidFencePattern)].map((match) => match[1]);
    if (options.requireDiagrams && fences.length === 0) addIssue(issues, root, record.path, "diagram", "Design must contain at least one Mermaid diagram");
    if (options.requireNamedDiagramHeadings) {
      const headings = [...record.design.matchAll(/^### ([^\n]+)$/gm)];
      let previousFenceEnd = -1;
      for (const match of record.design.matchAll(mermaidFencePattern)) {
        const heading = [...headings].reverse().find((candidate) => (candidate.index ?? -1) < (match.index ?? 0) && (candidate.index ?? -1) > previousFenceEnd);
        if (!heading) addIssue(issues, root, record.path, "diagram-heading", "each Mermaid diagram must follow a descriptive `### <diagram name>` heading");
        previousFenceEnd = (match.index ?? 0) + match[0].length;
      }
    }
    for (const [index, source] of fences.entries()) {
      const maxLabelCharacters = options.maxUnwrappedLabelCharacters ?? defaultMaxUnwrappedLabelCharacters;
      for (const label of unwrappedLabelIssues(source, maxLabelCharacters)) {
        addIssue(issues, root, record.path, "diagram-readability", `diagram label exceeds ${maxLabelCharacters} unwrapped characters; shorten or add a natural <br/> break: ${label}`);
      }
      const expectedHrefs = rawDesignTargets(source);
      diagrams.push({ id: `${record.relativePath}#design:${index + 1}`, source, expectedHrefs: expectedHrefs.length > 0 ? expectedHrefs : undefined, recordPath: record.relativePath, diagramIndex: index + 1 });
      const markdownFallbacks = new Set(markdownTargets(record.text));
      for (const target of expectedHrefs.map(normalizeTarget)) {
        const resolved = resolveDesignTarget(root, record.path, target);
        if (!resolved || !existsSync(resolved) || !records.has(resolved)) addIssue(issues, root, record.path, "unresolved-design-link", `diagram link does not resolve to a canonical record: ${target}`);
        if (!markdownFallbacks.has(target)) addIssue(issues, root, record.path, "markdown-fallback", `diagram link has no resolving Markdown fallback: ${target}`);
      }
    }

    if (record.componentTable) {
      const componentTargets = record.componentTable.targets;
      if (new Set(record.componentTable.occurrences).size !== record.componentTable.occurrences.length) addIssue(issues, root, record.path, "components-fallback", "Components table child targets must be unique");
      for (const target of componentTargets) {
        const childPath = resolveDesignTarget(root, record.path, target);
        const child = childPath ? records.get(childPath) : undefined;
        const childParentTarget = child?.breadcrumb?.targets.at(-1);
        const childParentPath = child && childParentTarget ? resolveDesignTarget(root, child.path, childParentTarget) : undefined;
        if (child && childParentPath && childParentPath !== record.path) addIssue(issues, root, record.path, "immediate-child", `Components target is not an immediate child according to its declared breadcrumb: ${target}`);
      }
      const first = fences[0];
      if (!first || !isStructuralContainer(first, record.title)) {
        addIssue(issues, root, record.path, "parent-only-container", "a parent Design must begin with a structural container diagram");
      } else {
        const structural = structuralView(first);
        const linkedHrefs = [...structural.hrefByNode.values()];
        const diagramTargets = unique(linkedHrefs);
        const unlinkedNodes = [...structural.nodeIds].filter((nodeId) => !structural.hrefByNode.has(nodeId));
        if (structural.outsideNodeIds.size > 0 || structural.containerNodeIds.size !== structural.nodeIds.size || unlinkedNodes.length > 0 || linkedHrefs.length !== componentTargets.length || diagramTargets.length !== componentTargets.length || diagramTargets.some((target) => !componentTargets.includes(target))) {
          addIssue(issues, root, record.path, "immediate-child", "structural container nodes must be exactly the declared immediate children");
        }
        for (const target of componentTargets) {
          const occurrenceCount = designTargetOccurrences(record.text).filter((candidate) => candidate === target).length;
          if (occurrenceCount !== 2) addIssue(issues, root, record.path, "components-fallback", `immediate-child target must occur once in the Components table and once in the structural diagram: ${target}`);
        }
        for (const edge of structural.edges) {
          if (!structural.hrefByNode.has(edge.source) || !structural.hrefByNode.has(edge.target)) addIssue(issues, root, record.path, "sibling-arrow", "structural relationship arrows must connect declared immediate-child nodes");
          if (!edge.label?.trim()) addIssue(issues, root, record.path, "sibling-arrow", "structural sibling relationship arrows must have explicit labels");
          if (edge.label && /contains/i.test(edge.label)) addIssue(issues, root, record.path, "sibling-arrow", "containment must be represented by nesting, not a `contains` relationship arrow");
        }
        if (componentTargets.length > 1 && structural.edges.length === 0) addIssue(issues, root, record.path, "sibling-arrow", "a multi-child structural container must show explicit sibling relationship arrows");
      }
    } else if (record.components !== undefined) {
      addIssue(issues, root, record.path, "components-fallback", "a parent record must declare immediate children in a valid Components table");
    } else if (record.design && [...record.design.matchAll(mermaidFencePattern)].some((match) => isStructuralContainer(match[1], record.title))) {
      addIssue(issues, root, record.path, "parent-only-container", "a record without Components must not contain a structural container subgraph");
    }
  }

  return { records: records.size, diagrams, issues };
}

if (import.meta.main) {
  const rootArgument = process.argv.find((argument, index) => index >= 2 && !argument.startsWith("--"));
  const cliRoot = rootArgument ?? process.cwd();
  const recordsArgument = process.env.AS_IS_RECORDS ?? process.argv.find((argument) => argument.startsWith("--records="))?.slice("--records=".length);
  if (!recordsArgument) {
    console.error("AS_IS_RECORDS or --records=<comma-separated as-is.md paths> is required; callers own record discovery and scope");
    process.exitCode = 2;
  } else {
    const result = validateAsIsDiagramsAndNavigation(cliRoot, {
      rootRecordPath: process.env.AS_IS_ROOT_RECORD ?? "as-is.md",
      recordPaths: recordsArgument.split(",").filter(Boolean),
    });
    console.log(JSON.stringify({ records: result.records, diagrams: result.diagrams.length, linkedDiagrams: result.diagrams.filter((diagram) => diagram.expectedHrefs !== undefined).length, issues: result.issues }, null, 2));
    if (result.issues.length > 0) process.exitCode = 1;
  }
}
