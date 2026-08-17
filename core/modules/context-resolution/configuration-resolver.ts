import { readFile } from "node:fs/promises";
import { readFileSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

type JsonObject = Record<string, unknown>;

export type ResolutionDiagnostic = {
  severity: "warning" | "error";
  code: string;
  path?: string;
  message: string;
};

export type DataSource = {
  path: string;
  scope: "repository" | "component";
};

export type ConfigurationResolution = {
  configuration: JsonObject;
  sources: DataSource[];
  provenance: Record<string, DataSource>;
  diagnostics: ResolutionDiagnostic[];
  complete: boolean;
};

export type AsIsDataResult = {
  target: string;
  effective: JsonObject;
  local: JsonObject;
  sources: DataSource[];
  provenance: Record<string, DataSource>;
  diagnostics: ResolutionDiagnostic[];
  complete: boolean;
};

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function within(root: string, candidate: string): boolean {
  const path = resolve(candidate);
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return path === root || path.startsWith(prefix);
}

function mergeConfiguration(target: JsonObject, source: JsonObject, sourceInfo: DataSource, provenance: Record<string, DataSource>, prefix = "configuration"): void {
  for (const [key, value] of Object.entries(source)) {
    const path = `${prefix}.${key}`;
    if (isObject(value) && isObject(target[key])) {
      mergeConfiguration(target[key] as JsonObject, value, sourceInfo, provenance, path);
    } else {
      target[key] = value;
      provenance[path] = sourceInfo;
    }
  }
}

export function parseAsIsJson(text: string, path = "as-is.json"): JsonObject {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new Error(`${path}: invalid JSON: ${error instanceof Error ? error.message : "unable to parse"}`);
  }
  if (!isObject(value)) throw new Error(`${path}: as-is.json must contain a JSON object.`);
  for (const key of ["configuration", "task"]) {
    if (value[key] !== undefined && !isObject(value[key])) {
      throw new Error(`${path}: ${key} must be an object when present.`);
    }
  }
  return value;
}

export function readAsIsJson(path: string): JsonObject {
  return parseAsIsJson(readFileSync(path, "utf8"), path);
}

async function readJson(path: string): Promise<JsonObject> {
  return parseAsIsJson(await readFile(path, "utf8"), path);
}

export async function resolveConfiguration(repositoryRoot: string, targetComponent = "."): Promise<ConfigurationResolution> {
  const result = await resolveAsIsData(repositoryRoot, targetComponent);
  return {
    configuration: isObject(result.effective.configuration) ? result.effective.configuration : {},
    sources: result.sources,
    provenance: result.provenance,
    diagnostics: result.diagnostics,
    complete: result.complete,
  };
}

export function findConfigurationRootSync(clientCwd: string): string | undefined {
  let current = resolve(clientCwd);
  while (true) {
    try {
      if (isObject(readAsIsJson(resolve(current, "as-is.json")).configuration)) return current;
    } catch { /* continue upward */ }
    const parent = dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
}

export function resolveConfigurationFromCwdSync(clientCwd: string): ConfigurationResolution & { root?: string } {
  const root = findConfigurationRootSync(clientCwd);
  if (!root) return { configuration: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "configuration-root-not-found", message: "No ancestor as-is.json declares configuration." }], complete: false };
  const target = relative(root, resolve(clientCwd)) || ".";
  return { ...resolveConfigurationSync(root, target), root };
}

export function resolveConfigurationSync(repositoryRoot: string, targetComponent = "."): ConfigurationResolution {
  const root = realpathSync(resolve(repositoryRoot));
  const requested = resolve(root, targetComponent);
  const diagnostics: ResolutionDiagnostic[] = [];
  if (!within(root, requested)) return { configuration: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-outside-repository", message: "Target component is outside the repository root." }], complete: false };
  let target: string;
  try { target = realpathSync(requested); } catch { return { configuration: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-not-found", message: "Target component does not exist." }], complete: false }; }
  if (!within(root, target)) return { configuration: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-symlink-escape", message: "Target component resolves outside the repository root." }], complete: false };
  const directories: string[] = [];
  for (let current = target; within(root, current); current = dirname(current)) { directories.unshift(current); if (current === root) break; }
  const configuration: JsonObject = {};
  const sources: DataSource[] = [];
  const provenance: Record<string, DataSource> = {};
  for (const directory of directories) {
    const path = resolve(directory, "as-is.json");
    let value: JsonObject;
    try { value = readAsIsJson(path); } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      diagnostics.push({ severity: "error", code: "invalid-json", path, message: error instanceof Error ? error.message : "Unable to read as-is.json." });
      continue;
    }
    const sourceInfo: DataSource = { path, scope: directory === root ? "repository" : "component" };
    sources.push(sourceInfo);
    if (isObject(value.configuration)) mergeConfiguration(configuration, value.configuration, sourceInfo, provenance);
  }
  return { configuration, sources, provenance, diagnostics, complete: diagnostics.every((diagnostic) => diagnostic.severity !== "error") };
}

export async function resolveAsIsData(repositoryRoot: string, targetComponent: string): Promise<AsIsDataResult> {
  const root = realpathSync(resolve(repositoryRoot));
  const targetPath = resolve(root, targetComponent);
  const diagnostics: ResolutionDiagnostic[] = [];
  if (!within(root, targetPath)) {
    return { target: targetComponent, effective: {}, local: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-outside-repository", message: "Target component is outside the repository root." }], complete: false };
  }

  let target: string;
  try {
    target = realpathSync(targetPath);
  } catch {
    return { target: targetComponent, effective: {}, local: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-not-found", message: "Target component does not exist." }], complete: false };
  }
  if (!within(root, target)) {
    return { target: targetComponent, effective: {}, local: {}, sources: [], provenance: {}, diagnostics: [{ severity: "error", code: "target-symlink-escape", message: "Target component resolves outside the repository root." }], complete: false };
  }

  const directories: string[] = [];
  for (let current = target; within(root, current); current = dirname(current)) {
    directories.unshift(current);
    if (current === root) break;
  }
  const effective: JsonObject = {};
  const local: JsonObject = {};
  const sources: DataSource[] = [];
  const provenance: Record<string, DataSource> = {};

  for (const directory of directories) {
    const path = resolve(directory, "as-is.json");
    let value: unknown;
    try {
      value = await readJson(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      diagnostics.push({ severity: "error", code: "invalid-json", path, message: error instanceof Error ? error.message : "Unable to read as-is.json." });
      continue;
    }
    const sourceInfo: DataSource = { path, scope: directory === root ? "repository" : "component" };
    sources.push(sourceInfo);
    if (isObject(value.configuration)) {
      if (!isObject(effective.configuration)) effective.configuration = {};
      mergeConfiguration(effective.configuration as JsonObject, value.configuration, sourceInfo, provenance);
    }
    if (directory === target) Object.assign(local, value);
  }

  const relativeTarget = relative(root, target) || ".";
  return { target: relativeTarget, effective, local, sources, provenance, diagnostics, complete: diagnostics.every((diagnostic) => diagnostic.severity !== "error") };
}
