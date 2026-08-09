import { lstatSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
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

const statusWeight: Record<BacklogStatus, number> = {
  open: 0,
  selected: 4,
  deferred: -2,
};

function cells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
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

export function cleanupCompletedBacklogs(root: string): CompletedBacklogItem[] {
  const completed = findCompletedItems(loadBacklogs(root), loadChangelogs(root));
  for (const file of backlogFiles(root)) {
    const component = componentForBacklog(root, file);
    const ids = new Set(completed.filter((item) => item.component === component).map((item) => item.id));
    if (ids.size > 0) writeFileSync(file, removeCompletedRows(readFileSync(file, "utf8"), ids));
  }
  return completed;
}

if (import.meta.main) {
  const rootArgument = process.argv.find((argument, index) => index >= 2 && argument !== "--cleanup" && argument !== "--all" && !argument.startsWith("--limit="));
  const root = resolve(rootArgument ?? process.cwd());
  if (process.argv.includes("--cleanup")) {
    const completed = cleanupCompletedBacklogs(root);
    console.log(completed.map((item) => `${item.component}:${item.id} — ${item.evidence}`).join("\n") || "No changelog-evidenced completed backlog items found.");
  } else {
    const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
    const limit = process.argv.includes("--all") ? null : limitArgument ? Number(limitArgument.slice("--limit=".length)) : 10;
    if (limit !== null && (!Number.isInteger(limit) || limit < 1)) throw new Error("--limit must be a positive integer");
    console.log(renderQuery(calculateWeights(loadBacklogs(root)), limit));
  }
}
