import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  identityFromAgent,
  parseAgentFrontMatter,
  parseDeclaredTools,
  resolveCanonicalAgent,
} from "./agent-resolution.ts";

test("parses agent front matter and preserves declared skills", () => {
  const definition = parseAgentFrontMatter([
    "---",
    "name: fixture-role",
    "model: medium",
    "thinking: high",
    "tools: read, call_subagent",
    "skills:",
    "  - skills/one/SKILL.md",
    "  - skills/two/SKILL.md",
    "---",
    "Return a bounded report.",
  ].join("\n"), "fixture-agent.md");
  expect(definition).toMatchObject({
    body: "Return a bounded report.",
    name: "fixture-role",
    model: "medium",
    thinking: "high",
    tools: "read, call_subagent",
    skills: ["skills/one/SKILL.md", "skills/two/SKILL.md"],
  });
});

test("validates and normalizes declared tools", () => {
  expect(parseDeclaredTools("read, read, call_subagent", "fixture-agent.md")).toBe("read,call_subagent");
  expect(() => parseDeclaredTools("read,unknown_tool", "fixture-agent.md")).toThrow("unsupported tools unknown_tool");
  expect(() => parseDeclaredTools("[]", "fixture-agent.md")).toThrow("tools declaration is empty");
});

test("resolves one canonical role independently of caller metadata", async () => {
  const root = await mkdtemp(join(tmpdir(), "as-is-agent-resolution-"));
  try {
    await mkdir(join(root, "agents", "fixture-role"), { recursive: true });
    await writeFile(join(root, "agents", "fixture-role", "agent.md"), [
      "---",
      "name: fixture-role",
      "mode: subagent",
      "tools: read, call_subagent",
      "---",
      "Fixture role.",
    ].join("\n"));
    const resolved = await resolveCanonicalAgent(root, "fixture-role");
    expect(resolved).toMatchObject({ name: "fixture-role", tools: ["read", "call_subagent"], body: "Fixture role." });
    await expect(resolveCanonicalAgent(root, "../fixture-role")).rejects.toThrow("invalid canonical agent role");
    await expect(resolveCanonicalAgent(root, "missing-role")).rejects.toThrow("canonical agent role not found");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("derives stable identity from explicit name or canonical path", () => {
  expect(identityFromAgent("/tmp/agent.md", { body: "x", name: "named-role" })).toBe("named-role");
  expect(identityFromAgent("/tmp/agents/path-role/agent.md", { body: "x" })).toBe("path-role");
  expect(identityFromAgent("/tmp/legacy.md", { body: "x" })).toBe("legacy");
});
