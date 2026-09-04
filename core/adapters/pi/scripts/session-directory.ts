import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

const defaultSessionDirectory = ".as-is/subagents/sessions";

function resolveConfiguredDirectory(value: string, projectRoot: string): string {
  const expanded = value === "~"
    ? homedir()
    : value.startsWith("~/")
      ? join(homedir(), value.slice(2))
      : value;
  return isAbsolute(expanded) ? expanded : resolve(projectRoot, expanded);
}

export function resolveSessionDirectory(configured: string | undefined, cwd: string, projectRoot = cwd): string {
  const resolvedProjectRoot = resolve(projectRoot);
  return resolveConfiguredDirectory(configured ?? defaultSessionDirectory, resolvedProjectRoot);
}
