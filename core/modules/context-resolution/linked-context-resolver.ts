import { createHash } from "node:crypto";
import { open, readdir } from "node:fs/promises";
import { realpathSync, statSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";

const maximumBytes = 64 * 1024;
const maximumDirectoryEntries = 100;
const taskRecordDefaults = ["task.md", "tasks.md"];

type FileIdentity = { dev: number; ino: number };

export type LinkedContextDiagnostic = { code: string; path?: string; message: string };
export type LinkedContextSource = { path: string; relativePath: string; sha256: string; mediaType: string; bytes: number };
export type LinkedContextDirectoryEntry = { name: string; kind: "file" | "directory"; relativePath: string; bytes?: number };
export type LinkedContextResult = {
  kind?: "file" | "directory";
  source?: LinkedContextSource;
  content?: string;
  entries?: LinkedContextDirectoryEntry[];
  diagnostics: LinkedContextDiagnostic[];
  complete: boolean;
};
export type LinkedContextPolicy = { taskRecordNames?: readonly string[] };

type DeclaredReference = { target: string; directory: boolean };

function within(root: string, candidate: string): boolean {
  const path = resolve(candidate);
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return path === root || path.startsWith(prefix);
}
function sameFile(left: FileIdentity, right: FileIdentity): boolean { return left.dev === right.dev && left.ino === right.ino; }
function failure(code: string, message: string, path?: string): LinkedContextResult { return { diagnostics: [{ code, path, message }], complete: false }; }

function declaredReferences(markdown: string): DeclaredReference[] {
  const references: DeclaredReference[] = [];
  const links = /(?<!!)\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
  for (const match of markdown.matchAll(links)) {
    const target = match[1] ?? match[2];
    references.push({ target, directory: target.endsWith("/") });
  }
  return references;
}

function mediaType(path: string): string {
  switch (extname(path).toLowerCase()) {
    case ".md": return "text/markdown; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".txt": return "text/plain; charset=utf-8";
    case ".yaml": case ".yml": return "application/yaml; charset=utf-8";
    case ".ts": return "text/typescript; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    default: return "text/plain; charset=utf-8";
  }
}

function validateReference(reference: string): string | undefined {
  if (!reference || reference.includes("\0") || reference.includes("#") || reference.includes("\\") || isAbsolute(reference) || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(reference)) {
    return "Reference must be a relative local path without fragments or URI schemes.";
  }
}

async function readBoundedUtf8(path: string, limit: number): Promise<{ bytes: Buffer; identity: FileIdentity }> {
  const file = await open(path, "r");
  try {
    const initial = await file.stat();
    if (!initial.isFile()) throw new Error("not-a-regular-file");
    if (initial.size > limit) throw new Error("content-too-large");
    const bytes = Buffer.alloc(initial.size + 1);
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesRead } = await file.read(bytes, offset, bytes.length - offset, offset);
      if (bytesRead === 0) break;
      offset += bytesRead;
    }
    const final = await file.stat();
    if (!sameFile(initial, final)) throw new Error("file-changed-during-read");
    if (offset > limit || final.size > limit) throw new Error("content-too-large");
    return { bytes: bytes.subarray(0, offset), identity: initial };
  } finally { await file.close(); }
}
function decodeUtf8(bytes: Buffer): string { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }

function crossesChildBoundary(component: string, target: string): boolean {
  if (!within(component, target)) return false;
  for (let current = dirname(target); current !== component; current = dirname(current)) {
    try { if (basename(realpathSync(resolve(current, "as-is.md"))) === "as-is.md") return true; } catch { /* no record */ }
  }
  return false;
}

/**
 * Resolves one explicitly exposed local context reference. A file link authorizes
 * only that file. A link ending in `/` authorizes its directory index and a
 * separately requested descendant. Results are context, never instructions or
 * task authority.
 */
export async function resolveLocalLinkedContext(projectRoot: string, baseRecord: string, reference: string, policy: LinkedContextPolicy = {}): Promise<LinkedContextResult> {
  let root: string;
  try { root = realpathSync(resolve(projectRoot)); } catch { return failure("project-root-not-found", "Project root does not exist."); }
  const requestedBase = resolve(root, baseRecord);
  if (!within(root, requestedBase)) return failure("base-outside-project", "Base record is outside the project root.");
  let base: string;
  try { base = realpathSync(requestedBase); } catch { return failure("base-not-found", "Base record does not exist."); }
  if (!within(root, base)) return failure("base-symlink-escape", "Base record resolves outside the project root.");
  if (basename(base) !== "as-is.md") return failure("invalid-base-record", "Base record must be named as-is.md.", base);

  let markdown: string;
  try { markdown = decodeUtf8((await readBoundedUtf8(base, maximumBytes)).bytes); }
  catch (error) { const message = error instanceof Error ? error.message : "Unable to read base record."; return failure(message === "content-too-large" ? "base-too-large" : "base-read-failed", message, base); }
  const invalidReference = validateReference(reference);
  if (invalidReference) return failure("unsupported-reference", invalidReference);

  const component = dirname(base);
  const declarations = declaredReferences(markdown);
  const declared = declarations.find(({ target, directory }) => target === reference || (directory && reference.startsWith(target)));
  if (!declared) return failure("reference-not-declared", "Reference is not explicitly exposed by an inline link in the base record.", base);
  const requestedExposure = resolve(component, declared.target);
  if (!within(root, requestedExposure)) return failure("target-outside-project", "Linked target is outside the project root.");
  let exposure: string;
  try { exposure = realpathSync(requestedExposure); } catch { return failure("target-not-found", "Linked target does not exist.", requestedExposure); }
  if (!within(root, exposure)) return failure("target-symlink-escape", "Linked target resolves outside the project root.", exposure);
  const requestedTarget = resolve(component, reference);
  if (!within(root, requestedTarget)) return failure("target-outside-project", "Linked target is outside the project root.");
  let target: string;
  try { target = realpathSync(requestedTarget); } catch { return failure("target-not-found", "Linked target does not exist.", requestedTarget); }
  if (!within(root, target)) return failure("target-symlink-escape", "Linked target resolves outside the project root.", target);
  if (declared.directory && !within(exposure, target)) return failure("target-outside-exposed-directory", "Linked target is outside the explicitly exposed directory.", target);
  const taskRecordNames = new Set(policy.taskRecordNames ?? taskRecordDefaults);
  if (taskRecordNames.has(basename(target))) return failure("task-record-denied", "Task records are not linked context.", target);
  if (crossesChildBoundary(component, target)) return failure("child-component-denied", "Linked target belongs to a nested component.", target);

  let stat;
  try { stat = statSync(target); } catch (error) { return failure("target-stat-failed", error instanceof Error ? error.message : "Unable to inspect linked target.", target); }
  if (stat.isDirectory()) {
    if (!declared.directory && reference === declared.target) return failure("directory-not-exposed", "A directory must be declared with a trailing slash.", target);
    let children;
    try { children = await readdir(target, { withFileTypes: true }); } catch (error) { return failure("directory-read-failed", error instanceof Error ? error.message : "Unable to list linked directory.", target); }
    const entries = children
      .filter((entry) => entry.isFile() || entry.isDirectory())
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, maximumDirectoryEntries)
      .map((entry) => ({ name: entry.name, kind: entry.isDirectory() ? "directory" as const : "file" as const, relativePath: relative(root, resolve(target, entry.name)), ...(entry.isFile() ? { bytes: statSync(resolve(target, entry.name)).size } : {}) }));
    return { kind: "directory", entries, diagnostics: children.length > maximumDirectoryEntries ? [{ code: "directory-truncated", path: target, message: `Directory index is limited to ${maximumDirectoryEntries} entries.` }] : [], complete: children.length <= maximumDirectoryEntries };
  }
  if (!stat.isFile()) return failure("target-not-file", "Linked target must be a regular file.", target);

  let read: { bytes: Buffer; identity: FileIdentity };
  try {
    read = await readBoundedUtf8(target, maximumBytes);
    if (!sameFile(read.identity, statSync(target))) return failure("target-changed-during-read", "Linked target changed while it was being read.", target);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read linked target.";
    if (message === "content-too-large") return failure("content-too-large", `Linked target exceeds the ${maximumBytes}-byte limit.`, target);
    return failure("target-read-failed", message, target);
  }
  let content: string;
  try { content = decodeUtf8(read.bytes); } catch { return failure("invalid-utf8", "Linked target is not valid UTF-8 text.", target); }
  return { kind: "file", source: { path: target, relativePath: relative(root, target), sha256: createHash("sha256").update(read.bytes).digest("hex"), mediaType: mediaType(target), bytes: read.bytes.length }, content, diagnostics: [], complete: true };
}
