import { existsSync, lstatSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export type BacklogStatus = "open" | "selected" | "deferred";

export type BacklogItem = {
  id: string;
  status: BacklogStatus;
  userPreference: number;
  systemPreference: number;
  purpose: string;
  description: string;
  dependencies: string[];
  acceptance: string;
  notes: string;
  component: string;
  source: string;
};

export type WeightedBacklogItem = BacklogItem & { weight: number };

export type CompletedBacklogItem = BacklogItem & {
  changelog: string;
  evidence: string;
};

export type ComponentContext = {
  component: string;
  directory: string;
  asIsSource: string;
  purpose: string;
  boundary: string;
};

export type EquivalentCandidate = {
  identity: string;
  relation: "ancestor" | "descendant";
  match: "same-id" | "same-normalized-purpose-and-description";
};

export type ReconciliationScope = {
  owner: string;
  authorizedComponents: string[];
  rationale: string;
};

export type MoveOperation = { kind: "move"; from: string; toComponent: string; rationale: string };
export type RemoveOperation = { kind: "remove"; source: string; equivalent: string; rationale: string; outgoingDependencies?: string[] };
export type CombineOperation = { kind: "combine"; sources: string[]; survivor: string; rationale: string };
export type SplitReplacement = {
  component: string;
  item: Omit<BacklogItem, "component" | "source">;
};
export type SplitOperation = {
  kind: "split";
  source: string;
  replacements: SplitReplacement[];
  dependentReplacements: Record<string, string>;
  outgoingDependencies?: Record<string, string>;
  rationale: string;
};
export type ReconciliationOperation = MoveOperation | RemoveOperation | CombineOperation | SplitOperation;
export type ReconciliationResult = {
  changed: string[];
  removed: string[];
  candidates: EquivalentCandidate[];
};

const statusWeight: Record<BacklogStatus, number> = {
  open: 0,
  selected: 4,
  deferred: -2,
};

function cells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const result: string[] = [];
  let cell = "";
  let escaped = false;
  for (const character of trimmed) {
    if (escaped) {
      cell += `\\${character}`;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === "|") {
      result.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  if (escaped) cell += "\\";
  result.push(cell.trim());
  return result;
}

function unescapeCell(cell: string): string {
  return cell.replace(/\\\|/g, "|").trim();
}

function parseInteger(value: string, field: string, source: string): number {
  if (!/^-?\d+$/.test(value.trim())) {
    throw new Error(`${source}: ${field} must be an integer, got ${JSON.stringify(value)}`);
  }
  return Number(value);
}

function parseStatus(value: string, source: string): BacklogStatus {
  if (value !== "open" && value !== "selected" && value !== "deferred") {
    throw new Error(`${source}: status must be open, selected, or deferred, got ${JSON.stringify(value)}`);
  }
  return value;
}

function itemTableHeaderIndex(lines: string[]): number {
  return lines.findIndex((line) => {
    if (!line.trim().startsWith("|")) return false;
    const headers = cells(line).map((cell) => cell.toLowerCase());
    return headers.join("|") === [
      "id", "status", "user preference", "system preference", "purpose",
      "description", "dependencies", "acceptance", "notes",
    ].join("|");
  });
}

/** Parse the stable table schema used by a single backlog file. */
export function parseBacklog(markdown: string, source = "backlog.md", component = "root"): BacklogItem[] {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = itemTableHeaderIndex(lines);
  if (headerIndex < 0) throw new Error(`${source}: backlog item table is missing or has the wrong schema`);
  if (headerIndex + 1 >= lines.length || !/^\|?\s*:?-{3,}/.test(lines[headerIndex + 1].trim())) {
    throw new Error(`${source}: backlog table is missing its separator row`);
  }

  const items: BacklogItem[] = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith("|")) break;
    const row = cells(line).map(unescapeCell);
    if (row.length !== 9) throw new Error(`${source}: backlog row has ${row.length} cells, expected 9`);
    if (!row[0]) throw new Error(`${source}: backlog item id is empty`);
    const dependencies = row[6] === "-" || row[6] === "" ? [] : row[6]
      .split(/\s*,\s*/)
      .map((dependency) => dependency.trim())
      .filter(Boolean);
    for (const dependency of dependencies) {
      if (!/^[^:|]+:[^:|]+$/.test(dependency)) {
        throw new Error(`${source}: dependency ${JSON.stringify(dependency)} must use component:id`);
      }
    }
    items.push({
      id: row[0],
      status: parseStatus(row[1], source),
      userPreference: parseInteger(row[2], "user preference", source),
      systemPreference: parseInteger(row[3], "system preference", source),
      purpose: row[4],
      description: row[5],
      dependencies,
      acceptance: row[7],
      notes: row[8],
      component,
      source,
    });
  }
  return items;
}

function baseWeight(item: BacklogItem): number {
  return statusWeight[item.status] + item.userPreference + item.systemPreference;
}

/**
 * Calculate a query-time weight. A prerequisite receives the sum of the
 * weights of items that depend on it, so important downstream work elevates
 * the work that unblocks it. The DFS is deterministic and cycle-safe: an edge
 * that re-enters the current path contributes the re-entered item's base
 * score once instead of recursing forever.
 */
export function calculateWeights(items: BacklogItem[]): WeightedBacklogItem[] {
  const byKey = new Map(items.map((item) => [`${item.component}:${item.id}`, item]));
  const dependents = new Map<string, BacklogItem[]>();
  for (const item of items) {
    for (const dependency of item.dependencies) {
      if (!byKey.has(dependency)) continue;
      const list = dependents.get(dependency) ?? [];
      list.push(item);
      dependents.set(dependency, list);
    }
  }
  for (const list of dependents.values()) list.sort((left, right) => `${left.component}:${left.id}`.localeCompare(`${right.component}:${right.id}`));

  const cache = new Map<string, number>();
  const visiting = new Set<string>();
  function weight(item: BacklogItem): number {
    const key = `${item.component}:${item.id}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    if (visiting.has(key)) return baseWeight(item);
    visiting.add(key);
    const value = baseWeight(item) + (dependents.get(key) ?? []).reduce((sum, dependent) => sum + weight(dependent), 0);
    visiting.delete(key);
    cache.set(key, value);
    return value;
  }
  return items.map((item) => ({ ...item, weight: weight(item) }));
}

export const queryHeaders = [
  "weight", "component", "id", "status", "purpose", "description", "dependencies", "notes",
] as const;

/** Validate a model or host response claiming to be the backlog representation. */
export function validateQueryRepresentation(markdown: string): void {
  const lines = markdown.split(/\r?\n/).filter((line) => line.trim().startsWith("|"));
  if (lines.length < 2 || cells(lines[0]).map((cell) => cell.toLowerCase()).join("|") !== queryHeaders.join("|")) {
    throw new Error(`backlog representation must use columns: ${queryHeaders.join(", ")}`);
  }
  if (!/^\|?\s*:?-{3,}/.test(lines[1].trim())) throw new Error("backlog representation is missing its separator row");
  for (const line of lines.slice(2)) {
    if (cells(line).length !== queryHeaders.length) throw new Error("backlog representation row has the wrong column count");
  }
}

/** Render the top ten weighted items by default; pass null for the complete view. */
export function renderQuery(items: WeightedBacklogItem[], limit: number | null = 10): string {
  const sorted = [...items].sort((left, right) =>
    right.weight - left.weight || `${left.component}:${left.id}`.localeCompare(`${right.component}:${right.id}`));
  const visible = limit === null ? sorted : sorted.slice(0, limit);
  const escape = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const lines = [
    `| ${queryHeaders.join(" | ")} |`,
    "| ---: | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const item of visible) {
    lines.push(`| ${item.weight} | ${escape(item.component)} | ${escape(item.id)} | ${item.status} | ${escape(item.purpose)} | ${escape(item.description)} | ${escape(item.dependencies.join(", ") || "-")} | ${escape(item.notes)} |`);
  }
  return lines.join("\n");
}

function repositoryFiles(directory: string, filename: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(directory)) {
    if (entry === ".git" || entry === "node_modules") continue;
    const path = join(directory, entry);
    let stat;
    try {
      if (lstatSync(path).isSymbolicLink()) continue;
      stat = statSync(path);
    } catch {
      continue;
    }
    if (stat.isDirectory()) result.push(...repositoryFiles(path, filename));
    else if (entry === filename) result.push(path);
  }
  return result;
}

function asIsFiles(directory: string): string[] {
  return repositoryFiles(directory, "as-is.md");
}

function sectionBody(markdown: string, heading: string): string {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return "";
  const end = lines.slice(start + 1).findIndex((line) => /^##\s+/.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : start + 1 + end).join("\n").trim();
}

export function loadComponentContexts(root: string): ComponentContext[] {
  const resolvedRoot = resolve(root);
  return asIsFiles(resolvedRoot).filter((file) => {
    const relativeFile = relative(resolvedRoot, file).replace(/\\/g, "/");
    return relativeFile === "as-is.md" || relativeFile.endsWith("/as-is.md");
  }).filter((file) => relative(resolvedRoot, file).replace(/\\/g, "/") !== ".pi/prompts/as-is.md").map((file) => {
    const relativeFile = relative(resolvedRoot, file).replace(/\\/g, "/");
    const directory = relativeFile.endsWith("/as-is.md")
      ? relativeFile.slice(0, -"/as-is.md".length) || "root"
      : "root";
    const purpose = sectionBody(readFileSync(file, "utf8"), "Purpose");
    if (!purpose) throw new Error(`${relative(resolvedRoot, file)}: component Purpose must be non-empty`);
    return { component: directory, directory: resolve(file, ".."), asIsSource: relative(resolvedRoot, file).replace(/\\/g, "/"), purpose, boundary: directory };
  }).sort((left, right) => left.component.localeCompare(right.component));
}

function isAncestor(ancestor: string, descendant: string): boolean {
  return ancestor === "root" || (descendant.startsWith(`${ancestor}/`) && descendant !== ancestor);
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[`*_\[\]().,;:!?\\/]+/g, " ").replace(/\s+/g, " ").trim();
}

function identityParts(identity: string): [string, string] {
  const separator = identity.lastIndexOf(":");
  if (separator <= 0 || separator === identity.length - 1) throw new Error(`invalid backlog identity ${JSON.stringify(identity)}`);
  return [identity.slice(0, separator), identity.slice(separator + 1)];
}

function identityOf(item: BacklogItem): string {
  return `${item.component}:${item.id}`;
}

function backlogFiles(directory: string): string[] {
  return repositoryFiles(directory, "backlog.md");
}

export function componentForBacklog(root: string, file: string): string {
  const relativePath = relative(root, file);
  const directory = relativePath.endsWith("/backlog.md")
    ? relativePath.slice(0, -"/backlog.md".length)
    : relativePath.slice(0, -"backlog.md".length);
  return directory || "root";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function isCompletionEvidence(line: string): boolean {
  if (!/\b(added|closed|completed|created|finished|implemented|introduced|removed|validated)\b/i.test(line)) return false;
  return !/\b(no|not|never|unimplemented|remains?)\b.{0,50}\b(added|closed|completed|created|finished|implemented|introduced|removed|validated)\b/i.test(line) &&
    !/\b(deferred|pending|open)\b/i.test(line);
}

export function findCompletedItems(
  items: BacklogItem[],
  changelogs: Map<string, string>,
): CompletedBacklogItem[] {
  return items.flatMap((item) => {
    const changelog = changelogs.get(item.component);
    const itemPattern = new RegExp(`(^|[^a-z0-9-])${escapeRegExp(item.id)}(?=[^a-z0-9-]|$)`, "i");
    if (!changelog || !itemPattern.test(changelog)) return [];
    const evidence = changelog.split(/\r?\n/).find((line) => itemPattern.test(line) && isCompletionEvidence(line));
    return evidence ? [{ ...item, changelog: item.component, evidence }] : [];
  });
}

/** Remove only rows whose completion is evidenced by the owning changelog. */
export function removeCompletedRows(markdown: string, completedIds: Set<string>): string {
  if (completedIds.size === 0) return markdown;
  const lines = markdown.split(/\r?\n/);
  const headerIndex = itemTableHeaderIndex(lines);
  if (headerIndex < 0) return markdown;
  const output = [...lines];
  let index = headerIndex + 2;
  while (index < output.length && output[index].trim().startsWith("|")) {
    const row = cells(output[index]).map(unescapeCell);
    if (row.length === 9 && completedIds.has(row[0])) output.splice(index, 1);
    else index += 1;
  }
  return output.join("\n");
}

export function loadBacklogs(root: string): BacklogItem[] {
  return backlogFiles(root).flatMap((file) => parseBacklog(
    readFileSync(file, "utf8"),
    relative(root, file),
    componentForBacklog(root, file),
  ));
}

export function loadChangelogs(root: string): Map<string, string> {
  return new Map(repositoryFiles(root, "changelog.md").map((file) => {
    const relativePath = relative(root, file);
    const component = relativePath.endsWith("/changelog.md")
      ? relativePath.slice(0, -"/changelog.md".length)
      : relativePath.slice(0, -"changelog.md".length);
    return [component || "root", readFileSync(file, "utf8")];
  }));
}

function componentAncestors(component: string): string[] {
  if (component === "root") return [];
  const parts = component.split("/");
  const result = ["root"];
  for (let index = 1; index < parts.length; index += 1) result.push(parts.slice(0, index).join("/"));
  return result;
}

export function findAncestorAndDescendantCandidates(
  items: BacklogItem[],
  owner: string,
  proposed: Pick<BacklogItem, "id" | "purpose" | "description">,
): EquivalentCandidate[] {
  const candidates: EquivalentCandidate[] = [];
  for (const item of items) {
    if (item.component === owner) continue;
    const relation = isAncestor(item.component, owner) ? "ancestor" : isAncestor(owner, item.component) ? "descendant" : undefined;
    if (!relation) continue;
    const match = item.id === proposed.id
      ? "same-id"
      : normalized(item.purpose) === normalized(proposed.purpose) && normalized(item.description) === normalized(proposed.description)
        ? "same-normalized-purpose-and-description"
        : undefined;
    if (match) candidates.push({ identity: identityOf(item), relation, match });
  }
  return candidates.sort((left, right) => left.identity.localeCompare(right.identity));
}

function backlogTableLines(markdown: string): { before: string[]; after: string[] } {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = itemTableHeaderIndex(lines);
  if (headerIndex < 0) throw new Error("backlog item table is missing or has the wrong schema");
  let end = headerIndex + 2;
  while (end < lines.length && lines[end].trim().startsWith("|")) end += 1;
  return { before: lines.slice(0, headerIndex + 2), after: lines.slice(end) };
}

function serializeBacklogItem(item: BacklogItem): string {
  const values = [item.id, item.status, String(item.userPreference), String(item.systemPreference), item.purpose, item.description, item.dependencies.join(", ") || "-", item.acceptance, item.notes];
  return `| ${values.map((value) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ")).join(" | ")} |`;
}

function serializeBacklog(markdown: string, items: BacklogItem[]): string {
  const { before, after } = backlogTableLines(markdown);
  return [...before, ...items.map(serializeBacklogItem), ...after].join("\n");
}

function requireNonEmpty(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} must be non-empty`);
}

function loadBacklogFiles(root: string): Map<string, { file: string; markdown: string; items: BacklogItem[] }> {
  return new Map(backlogFiles(root).map((file) => {
    const component = componentForBacklog(root, file);
    const markdown = readFileSync(file, "utf8");
    return [component, { file, markdown, items: parseBacklog(markdown, relative(root, file), component) }];
  }));
}

function requireIdentity(items: BacklogItem[], identity: string): BacklogItem {
  identityParts(identity);
  const found = items.filter((item) => identityOf(item) === identity);
  if (found.length !== 1) throw new Error(`backlog identity ${JSON.stringify(identity)} must identify exactly one item`);
  return found[0];
}

function requireComponent(contexts: ComponentContext[], component: string): void {
  if (!contexts.some((context) => context.component === component)) throw new Error(`component ${JSON.stringify(component)} has no as-is.md context`);
}

function authorize(scope: ReconciliationScope, component: string): void {
  if (!scope.authorizedComponents.includes(component)) throw new Error(`component ${component} is outside the authorized reconciliation scope`);
}

function validateReplacement(item: SplitReplacement["item"], component: string): BacklogItem {
  const candidate: BacklogItem = { ...item, component, source: `${component}/backlog.md` };
  if (!candidate.id || !candidate.purpose || !candidate.description || !candidate.acceptance) throw new Error("split replacement has missing required text");
  parseBacklog(`# Backlog\n\n| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |\n| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |\n${serializeBacklogItem(candidate)}\n`, "split replacement", component);
  return candidate;
}

function rewriteDependencies(items: BacklogItem[], from: string, to: string, authorized: Set<string>): void {
  for (const item of items) {
    if (!item.dependencies.includes(from)) continue;
    authorize({ owner: item.component, authorizedComponents: [...authorized], rationale: "dependency rewrite" }, item.component);
    item.dependencies = item.dependencies.map((dependency) => dependency === from ? to : dependency);
  }
}

function provenance(item: BacklogItem, rationale: string, label: string): string {
  return `${item.notes && item.notes !== "-" ? `${item.notes}\n` : ""}[${label} ${identityOf(item)}] ${rationale}; original status: ${item.status}; user preference: ${item.userPreference}; system preference: ${item.systemPreference}; dependencies: ${item.dependencies.join(", ") || "-"}; purpose: ${item.purpose}; description: ${item.description}; acceptance: ${item.acceptance}; notes: ${item.notes}`;
}

export function reconcileBacklogs(root: string, scope: ReconciliationScope, operation: ReconciliationOperation): ReconciliationResult {
  requireNonEmpty(scope.owner, "scope.owner");
  requireNonEmpty(scope.rationale, "scope.rationale");
  requireNonEmpty(operation.rationale, "operation.rationale");
  const contexts = loadComponentContexts(root);
  requireComponent(contexts, scope.owner);
  const files = loadBacklogFiles(root);
  const allItems = [...files.values()].flatMap((entry) => entry.items);
  const byIdentity = new Map(allItems.map((item) => [identityOf(item), item]));
  const authorized = new Set(scope.authorizedComponents);
  authorize(scope, scope.owner);
  const touched = new Set<string>([scope.owner]);
  const candidates: EquivalentCandidate[] = [];
  const ownerRelation = (component: string): "owner" | "ancestor" | "descendant" => {
    if (component === scope.owner) return "owner";
    if (isAncestor(component, scope.owner)) return "ancestor";
    if (isAncestor(scope.owner, component)) return "descendant";
    throw new Error(`component ${component} is unrelated to owner ${scope.owner}`);
  };
  const addTouched = (component: string) => { authorize(scope, component); requireComponent(contexts, component); ownerRelation(component); touched.add(component); };
  const find = (identity: string) => {
    const item = byIdentity.get(identity);
    if (!item) throw new Error(`unknown backlog identity ${JSON.stringify(identity)}`);
    addTouched(item.component);
    return item;
  };
  const rewrite = (from: string, to: string) => {
    for (const item of allItems) if (item.dependencies.includes(from)) {
      addTouched(item.component);
      item.dependencies = item.dependencies.map((dependency) => dependency === from ? to : dependency);
    }
  };
  const remove = (item: BacklogItem) => {
    const entry = files.get(item.component);
    if (!entry) throw new Error(`backlog file missing for ${item.component}`);
    entry.items = entry.items.filter((candidate) => identityOf(candidate) !== identityOf(item));
  };
  const add = (item: BacklogItem) => {
    const entry = files.get(item.component);
    if (!entry) throw new Error(`backlog file missing for ${item.component}`);
    if (byIdentity.has(identityOf(item)) && byIdentity.get(identityOf(item)) !== item) throw new Error(`destination identity already exists: ${identityOf(item)}`);
    entry.items.push(item);
  };

  if (operation.kind === "move") {
    const source = find(operation.from);
    addTouched(operation.toComponent);
    if (byIdentity.has(`${operation.toComponent}:${source.id}`)) throw new Error(`destination identity already exists: ${operation.toComponent}:${source.id}`);
    const moved = { ...source, component: operation.toComponent, source: `${operation.toComponent}/backlog.md`, dependencies: [...source.dependencies], notes: source.notes };
    const oldIdentity = identityOf(source);
    remove(source); add(moved); rewrite(oldIdentity, identityOf(moved));
  } else if (operation.kind === "remove") {
    const source = find(operation.source);
    const equivalent = find(operation.equivalent);
    if (source.dependencies.length && !operation.outgoingDependencies) throw new Error("remove requires an explicit outgoing dependency disposition");
    if (operation.outgoingDependencies && operation.outgoingDependencies.some((dependency) => !source.dependencies.includes(dependency))) throw new Error("remove outgoing dependency disposition contains an unknown dependency");
    const relation = isAncestor(source.component, equivalent.component) || isAncestor(equivalent.component, source.component);
    if (!relation) throw new Error("remove equivalent must be an ancestor or descendant");
    const matches = findAncestorAndDescendantCandidates(allItems, source.component, source).some((candidate) => candidate.identity === identityOf(equivalent));
    if (!matches) throw new Error("remove requires an explicit ancestor/descendant equivalence candidate");
    equivalent.notes = provenance(source, operation.rationale, "retained-equivalent");
    equivalent.dependencies = [...new Set([...equivalent.dependencies, ...(operation.outgoingDependencies ?? [])])].filter((dependency) => dependency !== identityOf(equivalent)).sort();
    rewrite(identityOf(source), identityOf(equivalent)); remove(source);
  } else if (operation.kind === "combine") {
    if (operation.sources.length < 2 || new Set(operation.sources).size !== operation.sources.length) throw new Error("combine requires at least two distinct sources");
    const sources = operation.sources.map(find);
    const survivor = find(operation.survivor);
    if (!sources.includes(survivor)) throw new Error("combine survivor must be one of the sources");
    const absorbed = sources.filter((item) => item !== survivor);
    const dependencies = new Set(survivor.dependencies);
    for (const item of absorbed) for (const dependency of item.dependencies) dependencies.add(dependency);
    for (const item of absorbed) {
      const absorbedIdentity = identityOf(item);
      dependencies.delete(absorbedIdentity);
      survivor.notes = provenance(item, operation.rationale, "combined");
      rewrite(absorbedIdentity, identityOf(survivor));
      remove(item);
    }
    dependencies.delete(identityOf(survivor));
    survivor.dependencies = [...dependencies].sort();
  } else if (operation.kind === "split") {
    const source = find(operation.source);
    if (operation.replacements.length < 2) throw new Error("split requires at least two replacements");
    const replacements = operation.replacements.map((replacement) => { addTouched(replacement.component); return validateReplacement(replacement.item, replacement.component); });
    if (new Set(replacements.map(identityOf)).size !== replacements.length) throw new Error("split replacements must have distinct identities");
    for (const replacement of replacements) if (byIdentity.has(identityOf(replacement)) && identityOf(replacement) !== identityOf(source)) throw new Error(`destination identity already exists: ${identityOf(replacement)}`);
    const replacementIds = new Set(replacements.map(identityOf));
    for (const item of allItems) if (item.dependencies.includes(identityOf(source))) {
      addTouched(item.component);
      const target = operation.dependentReplacements[identityOf(item)];
      if (!target || !replacementIds.has(target)) throw new Error(`split is missing dependent replacement for ${identityOf(item)}`);
      item.dependencies = item.dependencies.map((dependency) => dependency === identityOf(source) ? target : dependency);
    }
    remove(source);
    if (source.dependencies.length && !operation.outgoingDependencies) throw new Error("split requires an explicit outgoing dependency disposition");
    if (operation.outgoingDependencies) {
      for (const dependency of source.dependencies) {
        const target = operation.outgoingDependencies[dependency];
        if (!target || !replacementIds.has(target)) throw new Error(`split is missing outgoing dependency replacement for ${dependency}`);
      }
      for (const replacement of replacements) replacement.dependencies = [...replacement.dependencies, ...source.dependencies.filter((dependency) => operation.outgoingDependencies?.[dependency] === identityOf(replacement))];
    }
    for (const replacement of replacements) { replacement.notes = provenance(source, operation.rationale, "split-replacement"); add(replacement); }
  }

  for (const component of touched) {
    authorize(scope, component);
    const entry = files.get(component);
    if (!entry) throw new Error(`backlog file missing for ${component}`);
    parseBacklog(serializeBacklog(entry.markdown, entry.items), entry.file, component);
  }
  const resultItems = [...files.values()].flatMap((entry) => entry.items);
  const identities = new Set<string>();
  for (const item of resultItems) { const identity = identityOf(item); if (identities.has(identity)) throw new Error(`duplicate backlog identity ${identity}`); identities.add(identity); }
  const staged = [...files].filter(([component]) => touched.has(component)).map(([component, entry]) => ({ component, entry, temporary: `${entry.file}.reconcile-${process.pid}` }));
  const backups: Array<{ file: string; backup: string }> = [];
  try {
    for (const { entry, temporary } of staged) writeFileSync(temporary, serializeBacklog(entry.markdown, entry.items));
    for (const { entry, temporary } of staged) {
      const backup = `${entry.file}.reconcile-backup-${process.pid}`;
      if (existsSync(backup)) unlinkSync(backup);
      renameSync(entry.file, backup);
      backups.push({ file: entry.file, backup });
      renameSync(temporary, entry.file);
    }
    for (const { backup } of backups) if (existsSync(backup)) unlinkSync(backup);
  } catch (error) {
    for (const { entry, temporary } of staged) if (existsSync(temporary)) unlinkSync(temporary);
    for (const { file, backup } of backups.reverse()) {
      if (existsSync(file)) unlinkSync(file);
      if (existsSync(backup)) renameSync(backup, file);
    }
    throw error;
  }
  if (operation.kind === "remove") candidates.push(...findAncestorAndDescendantCandidates(allItems, identityParts(operation.source)[0], byIdentity.get(operation.source)!));
  return { changed: [...touched].sort(), removed: operation.kind === "move" ? [operation.from] : operation.kind === "remove" ? [operation.source] : operation.kind === "combine" ? operation.sources.filter((identity) => identity !== operation.survivor) : operation.kind === "split" ? [operation.source] : [], candidates };
}

function parseCleanupIdentity(selection: string | undefined): string {
  if (!selection || !/^[^:\s]+:[^:\s]+$/.test(selection)) {
    throw new Error("cleanup requires one exact fully-qualified selection in component:id form");
  }
  return selection;
}

export function cleanupCompletedBacklogs(root: string, selection?: string): CompletedBacklogItem[] {
  const identity = parseCleanupIdentity(selection);
  const [component, id] = identity.split(":");
  const completed = findCompletedItems(loadBacklogs(root), loadChangelogs(root));
  const selected = completed.filter((item) => item.component === component && item.id === id);
  if (selected.length === 0) throw new Error(`cleanup selection ${JSON.stringify(identity)} has no changelog-evidenced completion`);
  for (const file of backlogFiles(root)) {
    if (componentForBacklog(root, file) !== component) continue;
    writeFileSync(file, removeCompletedRows(readFileSync(file, "utf8"), new Set([id])));
  }
  return selected;
}

if (import.meta.main) {
  const cleanupArguments = process.argv.filter((argument) => argument.startsWith("--cleanup="));
  if (cleanupArguments.length > 0 || process.argv.includes("--cleanup")) {
    if (process.argv.includes("--cleanup") || cleanupArguments.length !== 1) {
      throw new Error("cleanup requires exactly one --cleanup=component:id selection; bare --cleanup is not allowed");
    }
    const cleanupArgument = cleanupArguments[0];
    const rootArguments = process.argv.filter((argument, index) => index >= 2 && !argument.startsWith("--cleanup=") && argument !== "--all" && !argument.startsWith("--limit="));
    if (rootArguments.length > 1) throw new Error("cleanup accepts at most one repository root argument");
    const root = resolve(rootArguments[0] ?? process.cwd());
    const completed = cleanupCompletedBacklogs(root, cleanupArgument.slice("--cleanup=".length));
    console.log(completed.map((item) => `${item.component}:${item.id} — ${item.evidence}`).join("\n"));
  } else {
    const rootArgument = process.argv.find((argument, index) => index >= 2 && argument !== "--all" && !argument.startsWith("--limit="));
    const root = resolve(rootArgument ?? process.cwd());
    const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
    const limit = process.argv.includes("--all") ? null : limitArgument ? Number(limitArgument.slice("--limit=".length)) : 10;
    if (limit !== null && (!Number.isInteger(limit) || limit < 1)) throw new Error("--limit must be a positive integer");
    console.log(renderQuery(calculateWeights(loadBacklogs(root)), limit));
  }
}
