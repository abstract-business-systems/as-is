import { lstatSync, readFileSync, readdirSync, statSync } from "node:fs";
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

/** Parse the stable table schema used by a single backlog file. */
export function parseBacklog(markdown: string, source = "backlog.md", component = "root"): BacklogItem[] {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    if (!line.trim().startsWith("|")) return false;
    const headers = cells(line).map((cell) => cell.toLowerCase());
    return headers.join("|") === [
      "id", "status", "user preference", "system preference", "purpose",
      "description", "dependencies", "acceptance", "notes",
    ].join("|");
  });
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

export function renderQuery(items: WeightedBacklogItem[]): string {
  const sorted = [...items].sort((left, right) =>
    right.weight - left.weight || `${left.component}:${left.id}`.localeCompare(`${right.component}:${right.id}`));
  const escape = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const lines = [
    `| ${queryHeaders.join(" | ")} |`,
    "| ---: | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const item of sorted) {
    lines.push(`| ${item.weight} | ${escape(item.component)} | ${escape(item.id)} | ${item.status} | ${escape(item.purpose)} | ${escape(item.description)} | ${escape(item.dependencies.join(", ") || "-")} | ${escape(item.notes)} |`);
  }
  return lines.join("\n");
}

function backlogFiles(directory: string): string[] {
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
    if (stat.isDirectory()) result.push(...backlogFiles(path));
    else if (entry === "backlog.md") result.push(path);
  }
  return result;
}

export function componentForBacklog(root: string, file: string): string {
  const relativePath = relative(root, file);
  const directory = relativePath.endsWith("/backlog.md")
    ? relativePath.slice(0, -"/backlog.md".length)
    : relativePath.slice(0, -"backlog.md".length);
  return directory || "root";
}

export function loadBacklogs(root: string): BacklogItem[] {
  return backlogFiles(root).flatMap((file) => parseBacklog(
    readFileSync(file, "utf8"),
    relative(root, file),
    componentForBacklog(root, file),
  ));
}

if (import.meta.main) {
  const root = resolve(process.argv[2] ?? process.cwd());
  console.log(renderQuery(calculateWeights(loadBacklogs(root))));
}
