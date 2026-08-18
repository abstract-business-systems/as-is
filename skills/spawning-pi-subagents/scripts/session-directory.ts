import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

const defaultProjectTempDirectory = ".as-is";

function expandDirectory(value: string, projectRoot: string): string {
  const expanded = value === "~"
    ? homedir()
    : value.startsWith("~/")
      ? join(homedir(), value.slice(2))
      : value;
  return isAbsolute(expanded) ? expanded : resolve(projectRoot, expanded);
}

export function resolveSessionDirectory(configured: string | undefined, cwd: string, projectRoot = cwd, configuredProjectTemp = defaultProjectTempDirectory): string {
  const resolvedProjectRoot = resolve(projectRoot);
  const projectTemp = expandDirectory(configuredProjectTemp || defaultProjectTempDirectory, resolvedProjectRoot);
  if (configured === "<project-temp>") return projectTemp;
  if (configured?.startsWith("<project-temp>/")) return join(projectTemp, configured.slice("<project-temp>/".length));
  if (configured) return expandDirectory(configured, resolvedProjectRoot);
  return join(projectTemp, "subagents", "sessions");
}
