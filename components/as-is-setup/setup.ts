#!/usr/bin/env bun
import { existsSync, lstatSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

export type ClientKind = "pi" | "opencode" | "agents";
export type SetupResult = { root: string; kinds: ClientKind[]; linked: string[]; preserved: string[] };

const isDirectory = (path: string) => existsSync(path) && lstatSync(path).isDirectory();
const isFile = (path: string) => existsSync(path) && lstatSync(path).isFile();
function resourceNames(path: string, marker: string): string[] {
  if (!isDirectory(path)) return [];
  return Array.from(new Bun.Glob("*").scanSync({ cwd: path, onlyFiles: false }))
    .filter((name) => isDirectory(join(path, name)) && isFile(join(path, name, marker)))
    .sort();
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

export function detectClient(root: string): ClientKind[] {
  const kinds: ClientKind[] = [];
  if (isDirectory(join(root, ".pi")) || isDirectory(join(root, ".agents"))) kinds.push("pi");
  if (isFile(join(root, ".opencode", "opencode.json")) || isDirectory(join(root, ".opencode"))) kinds.push("opencode");
  if (isDirectory(join(root, ".agents")) && !kinds.includes("agents")) kinds.push("agents");
  return kinds;
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

export function setupClient(clientRoot: string, bundleRoot: string, detected = detectClient(clientRoot)): SetupResult {
  const root = resolve(clientRoot), bundle = resolve(bundleRoot);
  const result: SetupResult = { root, kinds: detected, linked: [], preserved: [] };
  const skills = join(bundle, "skills");
  const agents = join(bundle, "agents");
  for (const kind of detected) {
    if (kind === "opencode") configureOpenCode(root, bundle);
    if (kind === "pi" || kind === "opencode" || kind === "agents") {
      for (const name of resourceNames(skills, "SKILL.md")) link(join(skills, name), join(root, ".agents", "skills", name), result);
      for (const name of resourceNames(agents, "agent.md")) link(join(agents, name), join(root, ".agents", "agents", name), result);
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
