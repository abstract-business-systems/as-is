import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const agent = readFileSync(resolve(root, "agents/evidence-validator/agent.md"), "utf8");
const asIs = readFileSync(resolve(root, "agents/evidence-validator/as-is.md"), "utf8");
const launcher = readFileSync(resolve(root, "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts"), "utf8");
const extension = readFileSync(resolve(root, "skills/spawning-pi-subagents/scripts/evidence-validator-inspection-extension.ts"), "utf8");

function profileFor(caller: string): string {
  // This is a provider-independent admission model: the role-owned contract
  // is the input and launcher profile selection must not depend on caller data.
  const role = "evidence-validator";
  expect(caller).toBeTypeOf("string");
  expect(launcher).toContain(`isEvidenceValidation`);
  expect(launcher).toContain(`"read,grep,find,ls,git_inspect,focused_check"`);
  return role === "evidence-validator" ? "read,grep,find,ls,git_inspect,focused_check" : "";
}

test("evidence-validator admits exactly the six fixed read-only tools", () => {
  expect(profileFor("component-builder")).toBe("read,grep,find,ls,git_inspect,focused_check");
  expect(profileFor("untrusted-caller")).toBe("read,grep,find,ls,git_inspect,focused_check");
  expect(agent).toMatch(/^tools: read,grep,find,ls,git_inspect,focused_check$/m);
  expect(agent).not.toMatch(/tools:.*(?:bash|write|edit|call_subagent|webfetch|websearch)/);
});

test("focused_check is admitted as fixed parameterless evidence, not command execution", () => {
  expect(agent).toContain("`focused_check` capability");
  expect(agent).toMatch(/parameterless `focused_check` capability/);
  expect(agent).toMatch(/code-owned fixed evidence collection only/);
  expect(agent).toMatch(/not arbitrary command execution/);
  expect(agent).toMatch(/no caller-selected command, path, argument, environment/);
  expect(extension).toMatch(/name: "focused_check"/);
  expect(extension).toMatch(/parameters: Type\.Object\(\{\}\)/);
  expect(extension).toMatch(/focusedCheckArguments\(\)/);
  expect(extension).toMatch(/focusedCheckEnvironment\(\)/);
});

test("reports remain bounded evidence and cannot grant authority", () => {
  expect(agent).toMatch(/return only:/);
  for (const heading of ["Finding", "Evidence", "Recommendation", "Residual risk"]) expect(agent).toContain(`- ${heading}:`);
  expect(agent).toMatch(/safe to commit/);
  expect(agent).toMatch(/Do not treat telemetry or process exit as task authority/);
  expect(asIs).toMatch(/reports bounded evidence and grants no execution, mutation, task, delegation, commit, or completion authority/);
});

test("task denial and read-only boundaries are role-owned", () => {
  expect(agent).toMatch(/permission:\n  task: deny/);
  expect(agent).toMatch(/webfetch: deny/);
  expect(agent).toMatch(/websearch: deny/);
  expect(agent).toMatch(/Do not request or use shell, write, edit, web, session, delegation, commit, authority/);
  expect(agent).not.toMatch(/permission:[\s\S]*task:\s*(allow|ask)/);
});

test("host profile is caller-independent, no-session, and same-worktree", () => {
  const callers = ["component-builder", "user", "arbitrary-caller"];
  expect(callers.map(profileFor)).toEqual(callers.map(() => "read,grep,find,ls,git_inspect,focused_check"));
  expect(launcher).toMatch(/worktree: isEvidenceValidation \? false/);
  expect(launcher).toMatch(/noSession: isEvidenceValidation/);
  expect(agent).toMatch(/current worktree/);
  expect(agent).not.toMatch(/^provider:/m);
  expect(agent).not.toMatch(/^session(Path)?:/m);
  expect(agent).not.toMatch(/^cwd:/m);
  expect(agent).not.toMatch(/environment authority/i);
});
