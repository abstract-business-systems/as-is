#!/usr/bin/env bun
import { existsSync, lstatSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

export type ClientKind = "pi" | "opencode" | "agents";
export type CanonicalResourceInventory = { skills: string[]; agents: string[] };
export type ClientSignal = { kind: ClientKind; path: string };
export type ClientDetection = { kinds: ClientKind[]; signals: ClientSignal[]; ambiguous: boolean };
export type SetupResult = { root: string; kinds: ClientKind[]; linked: string[]; preserved: string[] };

const isDirectory = (path: string) => existsSync(path) && lstatSync(path).isDirectory();
const isFile = (path: string) => existsSync(path) && lstatSync(path).isFile();
function canonicalResourceNames(path: string, marker: string): string[] {
  if (!isDirectory(path)) return [];
  return Array.from(new Bun.Glob("*").scanSync({ cwd: path, onlyFiles: false }))
    .filter((name) => isDirectory(join(path, name)) && isFile(join(path, name, marker)))
    .sort();
}

export function inventoryCanonicalResources(bundleRoot: string): CanonicalResourceInventory {
  const bundle = resolve(bundleRoot);
  return {
    skills: canonicalResourceNames(join(bundle, "skills"), "SKILL.md"),
    agents: canonicalResourceNames(join(bundle, "agents"), "agent.md"),
  };
}

function relativeLink(source: string, target: string) {
  return relative(dirname(target), source) || ".";
}

function targetExists(path: string) {
  if (existsSync(path)) return true;
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function link(source: string, target: string, result: SetupResult) {
  mkdirSync(dirname(target), { recursive: true });
  if (targetExists(target)) { result.preserved.push(target); return; }
  symlinkSync(relativeLink(source, target), target, "junction");
  result.linked.push(target);
}

export function detectClient(root: string): ClientDetection {
  const clientRoot = resolve(root);
  const signals: ClientSignal[] = [];
  const addSignal = (kind: ClientKind, path: string) => signals.push({ kind, path });
  const piPath = join(clientRoot, ".pi");
  const opencodePath = join(clientRoot, ".opencode", "opencode.json");
  const agentsPath = join(clientRoot, ".agents");
  if (isDirectory(piPath)) addSignal("pi", piPath);
  if (isFile(opencodePath)) addSignal("opencode", opencodePath);
  if (isDirectory(agentsPath)) addSignal("agents", agentsPath);
  return {
    kinds: signals.map(({ kind }) => kind),
    signals,
    ambiguous: signals.length > 1,
  };
}

type SetupLink = { source: string; target: string };
type OpenCodeConfigPlan = { path: string; contents: string };
type AdapterPlan = { links: SetupLink[]; config?: OpenCodeConfigPlan };

function canonicalLinks(bundle: string, inventory: CanonicalResourceInventory, root: string, directory: string, includeAgents: boolean): SetupLink[] {
  const links = inventory.skills.map((name) => ({
    source: join(bundle, "skills", name),
    target: join(root, directory, "skills", name),
  }));
  if (includeAgents) {
    links.push(...inventory.agents.map((name) => ({
      source: join(bundle, "agents", name),
      target: join(root, directory, "agents", name),
    })));
  }
  return links;
}

function configurePi(root: string, bundle: string, inventory: CanonicalResourceInventory): AdapterPlan {
  const links = canonicalLinks(bundle, inventory, root, ".agents", false);
  const prompt = join(bundle, ".pi", "prompts", "as-is.md");
  if (isFile(prompt)) links.push({ source: prompt, target: join(root, ".pi", "prompts", "as-is.md") });
  return { links };
}

function configureOpenCode(root: string, bundle: string, inventory: CanonicalResourceInventory): AdapterPlan {
  const configPath = join(root, ".opencode", "opencode.json");
  if (!isFile(configPath)) return { links: [] };
  let config: unknown;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid OpenCode configuration: ${configPath}`, { cause: error });
  }
  if (config === null || typeof config !== "object" || Array.isArray(config))
    throw new Error(`OpenCode configuration must be a JSON object: ${configPath}`);
  const record = config as Record<string, unknown>;
  if ("skills" in record && (record.skills === null || typeof record.skills !== "object" || Array.isArray(record.skills)))
    throw new Error(`OpenCode skills configuration must be an object: ${configPath}`);
  const skills = (record.skills ?? {}) as Record<string, unknown>;
  if ("paths" in skills && (!Array.isArray(skills.paths) || skills.paths.some((path) => typeof path !== "string")))
    throw new Error(`OpenCode skills.paths must be an array of strings: ${configPath}`);
  const paths = Array.isArray(skills.paths) ? [...skills.paths] as string[] : [];
  const nativeSkills = "skills";
  if (!paths.includes(nativeSkills)) paths.push(nativeSkills);
  const nextConfig = { ...record, skills: { ...skills, paths } };
  return {
    config: { path: configPath, contents: `${JSON.stringify(nextConfig, null, 2)}\n` },
    links: canonicalLinks(bundle, inventory, root, ".opencode", true),
  };
}

function configureGenericAgents(root: string, bundle: string, inventory: CanonicalResourceInventory): AdapterPlan {
  return { links: canonicalLinks(bundle, inventory, root, ".agents", true) };
}

function adapterPlan(kind: ClientKind, root: string, bundle: string, inventory: CanonicalResourceInventory): AdapterPlan {
  if (kind === "pi") return configurePi(root, bundle, inventory);
  if (kind === "opencode") return configureOpenCode(root, bundle, inventory);
  return configureGenericAgents(root, bundle, inventory);
}

export function setupClient(clientRoot: string, bundleRoot: string, detected?: ClientKind[]): SetupResult {
  const root = resolve(clientRoot), bundle = resolve(bundleRoot);
  const detection = detectClient(root);
  const kinds = detected ?? (detection.ambiguous ? [] : detection.kinds);
  const result: SetupResult = { root, kinds, linked: [], preserved: [] };
  const inventory = inventoryCanonicalResources(bundle);
  const plans = kinds.map((kind) => adapterPlan(kind, root, bundle, inventory));
  for (const plan of plans) if (plan.config) writeFileSync(plan.config.path, plan.config.contents);
  for (const plan of plans)
    for (const operation of plan.links) link(operation.source, operation.target, result);
  return result;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const client = args[0] && !args[0].startsWith("-") ? args[0] : process.cwd();
  const bundle = args.find((arg) => arg.startsWith("--bundle="))?.slice(9) ?? resolve(import.meta.dir, "../..");
  const result = setupClient(client, bundle);
  console.log(JSON.stringify(result, null, 2));
}
