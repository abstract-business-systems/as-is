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

function link(source: string, target: string, result: SetupResult) {
  mkdirSync(dirname(target), { recursive: true });
  if (existsSync(target)) { result.preserved.push(target); return; }
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

function configureOpenCode(root: string, bundleRoot: string) {
  const configPath = join(root, ".opencode", "opencode.json");
  if (!isFile(configPath)) return;
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const skills = config.skills && typeof config.skills === "object" ? config.skills : {};
  const paths = Array.isArray(skills.paths) ? skills.paths : [];
  const bundleSkills = relative(dirname(configPath), join(bundleRoot, "skills")) || ".";
  if (!paths.includes(bundleSkills)) paths.push(bundleSkills);
  config.skills = { ...skills, paths };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

export function setupClient(clientRoot: string, bundleRoot: string, detected?: ClientKind[]): SetupResult {
  const root = resolve(clientRoot), bundle = resolve(bundleRoot);
  const detection = detectClient(root);
  const kinds = detected ?? (detection.ambiguous ? [] : detection.kinds);
  const result: SetupResult = { root, kinds, linked: [], preserved: [] };
  const inventory = inventoryCanonicalResources(bundle);
  const skills = join(bundle, "skills");
  const agents = join(bundle, "agents");
  for (const kind of kinds) {
    if (kind === "opencode") configureOpenCode(root, bundle);
    if (kind === "pi" || kind === "opencode" || kind === "agents") {
      for (const name of inventory.skills) link(join(skills, name), join(root, ".agents", "skills", name), result);
      for (const name of inventory.agents) link(join(agents, name), join(root, ".agents", "agents", name), result);
    }
    if (kind === "pi" && isFile(join(bundle, ".pi", "prompts", "as-is.md")))
      link(join(bundle, ".pi", "prompts", "as-is.md"), join(root, ".pi", "prompts", "as-is.md"), result);
  }
  return result;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const client = args[0] && !args[0].startsWith("-") ? args[0] : process.cwd();
  const bundle = args.find((arg) => arg.startsWith("--bundle="))?.slice(9) ?? resolve(import.meta.dir, "../..");
  const result = setupClient(client, bundle);
  console.log(JSON.stringify(result, null, 2));
}
