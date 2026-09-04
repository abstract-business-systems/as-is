import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type RoleFile = {
  name: string;
  path: string;
  tools: string[];
  skills: string[];
  permissions: Record<string, string>;
  body: string;
};

type ExpectedRole = Omit<RoleFile, "body" | "tools" | "skills" | "permissions"> & {
  tools: string[];
  skills: string[];
  permissions: Record<string, string>;
  positive: string;
  denied: string;
};

const root = process.cwd();
const expected: ExpectedRole[] = [
  { name: "as-is", path: "agents/as-is/agent.md", tools: ["read", "grep", "find", "ls", "bash", "edit", "write", "resolve_component_context"], skills: [], permissions: { task: "allow", webfetch: "deny", websearch: "deny" }, positive: "write", denied: "call_subagent" },
  { name: "component-builder", path: "agents/component-builder/agent.md", tools: ["read", "grep", "find", "ls", "bash", "edit", "write", "call_subagent", "resolve_component_context"], skills: [], permissions: { task: "allow", webfetch: "deny", websearch: "deny" }, positive: "call_subagent", denied: "focused_check" },
  { name: "evidence-validator", path: "agents/evidence-validator/agent.md", tools: ["read", "grep", "find", "ls", "git_inspect", "focused_check"], skills: [], permissions: { task: "deny", webfetch: "deny", websearch: "deny" }, positive: "focused_check", denied: "write" },
  { name: "execution-advisor", path: "agents/execution-advisor/agent.md", tools: ["read", "grep", "find", "ls", "search_traces", "get_trace", "summarize_trace", "compare_traces", "analyze_session", "resolve_component_context"], skills: ["skills/inspecting-execution-evidence", "skills/building-context"], permissions: { task: "deny", webfetch: "deny", websearch: "deny" }, positive: "search_traces", denied: "write" },
  { name: "expert", path: "agents/expert/agent.md", tools: ["read", "grep", "find", "ls", "resolve_component_context"], skills: ["skills/consulting-humans"], permissions: { task: "deny", webfetch: "deny", websearch: "deny" }, positive: "resolve_component_context", denied: "edit" },
  { name: "thinking-companion", path: "agents/thinking-companion/agent.md", tools: ["read", "grep", "find", "ls", "call_subagent", "resolve_component_context"], skills: [], permissions: { task: "deny", webfetch: "deny", websearch: "deny" }, positive: "call_subagent", denied: "write" },
  { name: "agent-capability-probe", path: "agents/agent-capability-probe/agent.md", tools: ["read", "grep", "find", "ls", "call_subagent"], skills: [], permissions: { task: "deny", webfetch: "deny", websearch: "deny" }, positive: "call_subagent", denied: "resolve_component_context" },
];

function discoveredRolePaths(): string[] {
  return readdirSync(resolve(root, "agents"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "worker")
    .map((entry) => `agents/${entry.name}/agent.md`)
    .filter((path) => {
      try {
        readFileSync(resolve(root, path), "utf8");
        return true;
      } catch {
        return false;
      }
    })
    .sort();
}

function readRole(role: ExpectedRole): RoleFile {
  const text = readFileSync(resolve(root, role.path), "utf8");
  const separator = text.indexOf("\n---\n");
  expect(separator).toBeGreaterThan(0);
  const frontmatter = text.slice(4, separator);
  const body = text.slice(separator + "\n---\n".length);
  const fields: Record<string, string> = {};
  const permissions: Record<string, string> = {};
  const skills: string[] = [];
  let section = "";
  for (const line of frontmatter.split("\n")) {
    const field = line.match(/^([a-z][a-z-]*):(?:\s+(.*))?$/);
    if (field) {
      section = field[1];
      fields[section] = field[2] ?? "";
      continue;
    }
    const nested = line.match(/^  ([a-z][a-z-]*):\s*(.+)$/);
    if (nested && section === "permission") permissions[nested[1]] = nested[2];
    const listItem = line.match(/^  -\s+(.+)$/);
    if (listItem && section === "skills") skills.push(listItem[1]);
  }
  return { name: fields.name, path: role.path, tools: fields.tools ? fields.tools.split(",") : [], skills, permissions, body };
}

test("F8 admission discovers exactly the seven fresh role contracts", () => {
  const paths = discoveredRolePaths();
  expect(paths).toEqual(expected.map((role) => role.path).sort());
  const discovered = paths.map((path) => readRole(expected.find((role) => role.path === path)!));
  expect(discovered.map(({ name, path }) => ({ name, path }))).toEqual(expected.map(({ name, path }) => ({ name, path })).sort((a, b) => a.path.localeCompare(b.path)));
  expect(new Set(discovered.map((role) => role.name)).size).toBe(7);
  expect(paths.some((path) => path.includes("design-prototyper"))).toBe(false);
});

test("F8 frontmatter tools and permissions match the exact roster matrix", () => {
  for (const role of expected) {
    const actual = readRole(role);
    expect(actual.name, role.path).toBe(role.name);
    expect(actual.tools, role.path).toEqual(role.tools);
    expect(actual.skills, role.path).toEqual(role.skills);
    expect(actual.permissions, role.path).toEqual(role.permissions);
  }
});

test("each F8 role admits its positive capability and denies a missing or forbidden one", () => {
  for (const role of expected) {
    const actual = readRole(role);
    expect(actual.tools, `${role.name} positive`).toContain(role.positive);
    expect(actual.tools, `${role.name} denied`).not.toContain(role.denied);
  }
});

test("role contracts retain the exact F8 anchors", () => {
  const anchors: Record<string, string[]> = {
    "as-is": ["recommendation, not authorization", "startsWork: false", "inferred intent", "Never delegate to yourself", "silently substitute"],
    "component-builder": ["skills grant no authority", "configured worker", "Never substitute", "semantic completion", "semantic integration", "Stop without proceeding"],
    "evidence-validator": ["`focused_check` is a parameterless `focused_check` capability", "code-owned fixed evidence collection only", "- Finding:", "- Evidence:", "- Recommendation:", "- Residual risk:", "safe to commit", "implementation may begin"],
    "execution-advisor": ["exact bounded selector", "approvalRequired: true", "Never approve or apply budget changes", "Stop with insufficient evidence"],
    "expert": ["advisory and read-only", "consulting-humans"],
    "thinking-companion": ["progressive disclosure", "Preserve the person's agency", "consulting-humans"],
    "agent-capability-probe": ["literal target role", "exactly once", "never substitute a role", "second call"],
  };
  for (const role of expected) {
    const contract = readRole(role).body;
    for (const anchor of anchors[role.name]) expect(contract, `${role.name}: ${anchor}`).toContain(anchor);
  }
});

test("component-builder is hollowed of the removed operational flow", () => {
  const contract = readRole(expected[1]).body;
  expect(contract).not.toContain("Required flow");
  expect(contract).not.toContain("admitLaunch()");
  expect(contract).not.toContain("cherry-pick");
  expect(contract).not.toContain("merge-base");
});
