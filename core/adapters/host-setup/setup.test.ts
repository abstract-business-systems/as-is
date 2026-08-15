import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { detectClient, inventoryCanonicalResources, setupClient } from "./setup";

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

test("inventories only immediate canonical resources in stable order", () => {
  const f = fixture();
  mkdirSync(join(f.bundle, "skills", "zulu"), { recursive: true });
  writeFileSync(join(f.bundle, "skills", "zulu", "SKILL.md"), "zulu");
  mkdirSync(join(f.bundle, "skills", "nested", "child"), { recursive: true });
  writeFileSync(join(f.bundle, "skills", "nested", "child", "SKILL.md"), "nested");
  mkdirSync(join(f.bundle, "skills", "missing-marker"), { recursive: true });
  mkdirSync(join(f.bundle, "agents", "alpha"), { recursive: true });
  writeFileSync(join(f.bundle, "agents", "alpha", "agent.md"), "alpha");
  mkdirSync(join(f.bundle, "agents", "wrong-marker"), { recursive: true });
  writeFileSync(join(f.bundle, "agents", "wrong-marker", "SKILL.md"), "wrong");
  writeFileSync(join(f.bundle, "skills", "not-a-directory"), "ignored");
  mkdirSync(join(f.bundle, ".agents", "skills", "generated"), { recursive: true });
  writeFileSync(join(f.bundle, ".agents", "skills", "generated", "SKILL.md"), "generated");

  expect(inventoryCanonicalResources(f.bundle)).toEqual({
    skills: ["alpha", "zulu"],
    agents: ["alpha", "worker"],
  });
});

test("detects persisted Pi clients and links only canonical resources", () => {
  const f = fixture();
  expect(detectClient(f.client)).toEqual({
    kinds: ["pi"],
    signals: [{ kind: "pi", path: join(f.client, ".pi") }],
    ambiguous: false,
  });
  const result = setupClient(f.client, f.bundle);
  expect(result.linked).toHaveLength(2);
  expect(Bun.file(join(f.client, ".agents", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("alpha");
  expect(Bun.file(join(f.client, ".pi", "prompts", "as-is.md")).text()).resolves.toBe("prompt");
  expect(Bun.file(join(f.client, ".agents", "agents", "worker", "agent.md")).exists()).resolves.toBe(false);
});

test("preserves collisions and is repeatable", () => {
  const f = fixture();
  mkdirSync(join(f.client, ".agents", "skills", "alpha"), { recursive: true });
  writeFileSync(join(f.client, ".agents", "skills", "alpha", "SKILL.md"), "local");
  const first = setupClient(f.client, f.bundle, ["pi"]);
  const second = setupClient(f.client, f.bundle, ["pi"]);
  expect(first.preserved.length).toBeGreaterThan(0);
  expect(second.linked).toHaveLength(0);
  expect(Bun.file(join(f.client, ".agents", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("local");
});

test("reports no signal for an incomplete OpenCode directory", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  mkdirSync(join(f.client, ".opencode"), { recursive: true });
  expect(detectClient(f.client)).toEqual({ kinds: [], signals: [], ambiguous: false });
});

test("reports ambiguity and does not implicitly wire multiple clients", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  mkdirSync(join(f.client, ".agents"), { recursive: true });
  mkdirSync(join(f.client, ".opencode"), { recursive: true });
  writeFileSync(join(f.client, ".opencode", "opencode.json"), "{}");
  expect(detectClient(f.client)).toEqual({
    kinds: ["opencode", "agents"],
    signals: [
      { kind: "opencode", path: join(f.client, ".opencode", "opencode.json") },
      { kind: "agents", path: join(f.client, ".agents") },
    ],
    ambiguous: true,
  });
  expect(setupClient(f.client, f.bundle)).toMatchObject({ kinds: [], linked: [] });
  expect(setupClient(f.client, f.bundle, ["agents"]).kinds).toEqual(["agents"]);
});

test("reports no persisted client signals", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  expect(detectClient(f.client)).toEqual({ kinds: [], signals: [], ambiguous: false });
});

test("detects OpenCode persisted configuration and preserves unrelated JSON", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  mkdirSync(join(f.client, ".opencode"), { recursive: true });
  writeFileSync(join(f.client, ".opencode", "opencode.json"), JSON.stringify({ "$schema": "x", lsp: { disabled: true } }));
  expect(detectClient(f.client)).toEqual({
    kinds: ["opencode"],
    signals: [{ kind: "opencode", path: join(f.client, ".opencode", "opencode.json") }],
    ambiguous: false,
  });
  setupClient(f.client, f.bundle);
  const config = JSON.parse(readFileSync(join(f.client, ".opencode", "opencode.json"), "utf8"));
  expect(config["$schema"]).toBe("x");
  expect(config.skills.paths).toEqual(["skills"]);
  expect(Bun.file(join(f.client, ".opencode", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("alpha");
  expect(Bun.file(join(f.client, ".opencode", "agents", "worker", "agent.md")).text()).resolves.toBe("worker");
});

test("keeps generic agent projection separate from host adapters", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  mkdirSync(join(f.client, ".agents"), { recursive: true });
  const result = setupClient(f.client, f.bundle);
  expect(result.kinds).toEqual(["agents"]);
  expect(Bun.file(join(f.client, ".agents", "skills", "alpha", "SKILL.md")).text()).resolves.toBe("alpha");
  expect(Bun.file(join(f.client, ".agents", "agents", "worker", "agent.md")).text()).resolves.toBe("worker");
  expect(Bun.file(join(f.client, ".opencode", "opencode.json")).exists()).resolves.toBe(false);
});

test("rejects malformed OpenCode configuration before mutation", () => {
  const f = fixture();
  rmSync(join(f.client, ".pi"), { recursive: true, force: true });
  mkdirSync(join(f.client, ".opencode"), { recursive: true });
  const configPath = join(f.client, ".opencode", "opencode.json");
  writeFileSync(configPath, JSON.stringify({ skills: { paths: "not-an-array" }, unrelated: true }));
  expect(() => setupClient(f.client, f.bundle)).toThrow(/skills\.paths/);
  expect(readFileSync(configPath, "utf8")).toBe(JSON.stringify({ skills: { paths: "not-an-array" }, unrelated: true }));
  expect(Bun.file(join(f.client, ".opencode", "skills", "alpha", "SKILL.md")).exists()).resolves.toBe(false);
});
