import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const PI_PACKAGE_NAME = "@earendil-works/pi-coding-agent";
const VERSION_PATTERN = /^\d+\.\d+\.\d+$/u;

export type PiVersionContract = {
  packageName: string;
  version: string;
  packageSpec: string;
};

export type PiInvocation = {
  command: string;
  args: string[];
  source: "explicit" | "environment" | "skill-local" | "package-fallback";
};

export function contractFromPackageManifest(raw: unknown, source = "package.json"): PiVersionContract {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`Pi package contract is not an object: ${source}`);
  }
  const manifest = raw as Record<string, unknown>;
  const dependencies = manifest.dependencies;
  if (dependencies === null || typeof dependencies !== "object" || Array.isArray(dependencies)) {
    throw new Error(`Pi package contract has no dependencies object: ${source}`);
  }
  const version = (dependencies as Record<string, unknown>)[PI_PACKAGE_NAME];
  if (typeof version !== "string" || !VERSION_PATTERN.test(version)) {
    throw new Error(`Pi package contract must declare exact version ${PI_PACKAGE_NAME}@x.y.z: ${source}`);
  }
  return { packageName: PI_PACKAGE_NAME, version, packageSpec: `${PI_PACKAGE_NAME}@${version}` };
}

export function loadPiVersionContract(packagePath = resolve(import.meta.dir, "..", "package.json")): PiVersionContract {
  try {
    return contractFromPackageManifest(JSON.parse(readFileSync(packagePath, "utf8")), packagePath);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Pi package contract")) throw error;
    throw new Error(`Unable to load Pi package contract from ${packagePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function parsePiVersionOutput(output: string): string {
  const lines = output.trim().split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length !== 1 || !VERSION_PATTERN.test(lines[0])) {
    throw new Error("Pi version probe returned malformed or ambiguous output");
  }
  return lines[0];
}

export function assertPiVersionCompatible(output: string, contract: PiVersionContract): string {
  const version = parsePiVersionOutput(output);
  if (version !== contract.version) {
    throw new Error(`Pi version mismatch: expected ${contract.version}, observed ${version}`);
  }
  return version;
}

export function versionProbeArguments(invocation: PiInvocation): string[] {
  return [...invocation.args, "--version", "--no-extensions"];
}
