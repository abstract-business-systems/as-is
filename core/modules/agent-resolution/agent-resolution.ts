import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

export const canonicalRoleName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export const supportedAgentTools = new Set([
  "read", "write", "edit", "bash", "grep", "find", "ls", "webfetch", "websearch",
  "call_subagent", "resolve_component_context", "git_inspect", "search_traces", "get_trace",
  "summarize_trace", "compare_traces", "analyze_session",
]);

export type AgentDefinition = {
  body: string;
  model?: string;
  thinking?: string;
  tools?: string;
  name?: string;
  skills?: string[];
};

export type CanonicalAgentDefinition = {
  body: string;
  model?: string;
  thinking?: string;
  tools: string[];
  name?: string;
};

export function parseAgentFrontMatter(raw: string, filePath: string): AgentDefinition {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u);
  if (!match) throw new Error(`Agent file has no front matter: ${filePath}`);

  const frontMatterLines = match[1].split(/\r?\n/u);
  const values = new Map<string, string>();
  const skills: string[] = [];
  for (let index = 0; index < frontMatterLines.length; index += 1) {
    const line = frontMatterLines[index];
    const field = line.match(/^([a-zA-Z][a-zA-Z-]*):\s*(.*)$/u);
    if (!field) continue;
    values.set(field[1], field[2].trim());
    if (field[1] !== "skills") continue;
    const inline = field[2].trim();
    if (inline.startsWith("[") && inline.endsWith("]")) {
      for (const value of inline.slice(1, -1).split(",")) {
        const skill = value.trim().replace(/^['"]|['"]$/g, "");
        if (skill) skills.push(skill);
      }
      continue;
    }
    for (let child = index + 1; child < frontMatterLines.length; child += 1) {
      const item = frontMatterLines[child].match(/^\s+-\s+(.+)$/u);
      if (!item) break;
      const skill = item[1].trim().replace(/^['"]|['"]$/g, "");
      if (skill) skills.push(skill);
      index = child;
    }
  }

  const body = match[2].trim();
  if (!body) throw new Error(`Agent file has no prompt body: ${filePath}`);

  return {
    body,
    model: values.get("model"),
    thinking: values.get("thinking"),
    tools: values.get("tools"),
    name: values.get("name"),
    skills: skills.length > 0 ? skills : undefined,
  };
}

export function parseDeclaredTools(value: string | undefined, agentPath: string): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (normalized === "[]" || normalized === "") throw new Error(`Agent tools declaration is empty: ${agentPath}`);
  const names = normalized.split(",").map((name) => name.trim()).filter(Boolean);
  if (names.length === 0) throw new Error(`Agent tools declaration is empty: ${agentPath}`);
  const unsupported = names.filter((name) => !supportedAgentTools.has(name));
  if (unsupported.length > 0) {
    throw new Error(`Agent declares unsupported tools ${unsupported.join(", ")}: ${agentPath}`);
  }
  return [...new Set(names)].join(",");
}

export function identityFromAgent(agentPath: string, definition?: AgentDefinition): string {
  if (definition?.name) return definition.name;
  const file = basename(agentPath, ".md");
  if (file === "agent") return basename(dirname(agentPath));
  return file;
}

export async function resolveCanonicalAgent(cwd: string, role: string): Promise<CanonicalAgentDefinition> {
  if (!canonicalRoleName.test(role)) throw new Error(`invalid canonical agent role: ${role}`);
  const agentsDirectory = join(cwd, "agents");
  const entries = await readdir(agentsDirectory, { withFileTypes: true });
  const matches = entries.filter((entry) => entry.isDirectory() && entry.name === role);
  if (matches.length !== 1) throw new Error(`canonical agent role not found: ${role}`);
  const path = join(agentsDirectory, role, "agent.md");
  const definition = parseAgentFrontMatter(await readFile(path, "utf8"), path);
  const declared = parseDeclaredTools(definition.tools, path);
  return {
    body: definition.body,
    model: definition.model,
    thinking: definition.thinking,
    tools: declared ? declared.split(",") : [],
    name: definition.name,
  };
}
