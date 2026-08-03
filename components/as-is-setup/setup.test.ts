import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { detectClient, setupClient } from "./setup";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "as-is-setup-"));
  mkdirSync(join(root, "bundle", "skills", "alpha"), { recursive: true });
  writeFileSync(join(root, "bundle", "skills", "alpha", "SKILL.md"), "alpha");
  mkdirSync(join(root, "bundle", "agents", "worker"), { recursive: true });
  writeFileSync(join(root, "bundle", "agents", "worker", "agent.md"), "worker");
  mkdirSync(join(root, "bundle", ".pi", "prompts"), { recursive: true });
  writeFileSync(join(root, "bundle", ".pi", "prompts", "as-is.md"), "prompt");
  mkdirSync(join(root, "client", ".pi"), { recursive: true });
  return { root, bundle: join(root, "bundle"), client: join(root, "client") };
}

test("detects persisted Pi clients and links only canonical resources", () => {
  const f = fixture();
  expect(detectClient(f.client)).toEqual(["pi"]);
  const result = setupClient(f.client, f.bundle);
  expect(result.linked).toHaveLength(3);
  expect(Bun.file(join(f.client, ".agents", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("alpha");
  expect(Bun.file(join(f.client, ".agents", "agents", "worker", "agent.md")).text()).resolves.toBe("worker");
});

test("preserves collisions and is repeatable", () => {
  const f = fixture();
  mkdirSync(join(f.client, ".agents", "skills", "alpha"), { recursive: true });
  writeFileSync(join(f.client, ".agents", "skills", "alpha", "SKILL.md"), "local");
  const first = setupClient(f.client, f.bundle);
  const second = setupClient(f.client, f.bundle);
  expect(first.preserved.length).toBeGreaterThan(0);
  expect(second.linked).toHaveLength(0);
  expect(Bun.file(join(f.client, ".agents", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("local");
});

test("detects OpenCode persisted configuration and preserves unrelated JSON", () => {
  const f = fixture();
  mkdirSync(join(f.client, ".opencode"), { recursive: true });
  writeFileSync(join(f.client, ".opencode", "opencode.json"), JSON.stringify({ "$schema": "x", lsp: { disabled: true } }));
  expect(detectClient(f.client)).toContain("opencode");
  setupClient(f.client, f.bundle);
  const config = JSON.parse(readFileSync(join(f.client, ".opencode", "opencode.json"), "utf8"));
  expect(config["$schema"]).toBe("x");
  expect(config.skills.paths).toHaveLength(1);
});
