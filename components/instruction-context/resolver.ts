import { readFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

export type InstructionSource = {
  path: string;
  relativePath: string;
  scope: "repository" | "component";
  content: string;
};

export type InstructionDiagnostic = {
  code: string;
  path?: string;
  message: string;
};

export type InstructionContext = {
  target: string;
  sources: InstructionSource[];
  diagnostics: InstructionDiagnostic[];
  complete: boolean;
};

function within(root: string, candidate: string): boolean {
  const path = resolve(candidate);
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return path === root || path.startsWith(prefix);
}

export async function resolveInstructionContext(repositoryRoot: string, targetComponent: string): Promise<InstructionContext> {
  const root = realpathSync(resolve(repositoryRoot));
  const requested = resolve(root, targetComponent);
  if (!within(root, requested)) return {
    target: targetComponent,
    sources: [],
    diagnostics: [{ code: "target-outside-repository", message: "Target component is outside the repository root." }],
    complete: false,
  };

  let target: string;
  try {
    target = realpathSync(requested);
  } catch {
    return {
      target: targetComponent,
      sources: [],
      diagnostics: [{ code: "target-not-found", message: "Target component does not exist." }],
      complete: false,
    };
  }
  if (!within(root, target)) return {
    target: targetComponent,
    sources: [],
    diagnostics: [{ code: "target-symlink-escape", message: "Target component resolves outside the repository root." }],
    complete: false,
  };

  const directories: string[] = [];
  for (let current = target; within(root, current); current = dirname(current)) {
    directories.unshift(current);
    if (current === root) break;
  }
  const sources: InstructionSource[] = [];
  const diagnostics: InstructionDiagnostic[] = [];
  for (const directory of directories) {
    const path = resolve(directory, "AGENTS.md");
    try {
      const content = await readFile(path, "utf8");
      sources.push({
        path,
        relativePath: relative(root, path) || "AGENTS.md",
        scope: directory === root ? "repository" : "component",
        content,
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") diagnostics.push({ code: "instruction-read-failed", path, message: error instanceof Error ? error.message : "Unable to read AGENTS.md." });
    }
  }
  return { target: relative(root, target) || ".", sources, diagnostics, complete: diagnostics.length === 0 };
}
