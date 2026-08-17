import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { resolveAsIsData, resolveConfigurationFromCwdSync, resolveConfigurationSync } from "./configuration-resolver";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "as-is-data-"));
  mkdirSync(join(root, "components", "child"), { recursive: true });
  return root;
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value)}\n`);
}

test("cascades configuration without copying inherited values", async () => {
  const root = fixture();
  writeJson(join(root, "as-is.json"), { configuration: { model: "large", execution: { retries: 3 } }, state: { root: true } });
  writeJson(join(root, "components", "child", "as-is.json"), { configuration: { execution: { retries: 1 } }, state: { local: true }, note: "child-only" });
  const result = await resolveAsIsData(root, "components/child");
  expect(result.complete).toBe(true);
  expect(result.effective.configuration).toEqual({ model: "large", execution: { retries: 1 } });
  expect(result.local).toEqual({ configuration: { execution: { retries: 1 } }, state: { local: true }, note: "child-only" });
  expect(result.provenance["configuration.model"]?.scope).toBe("repository");
  expect(result.provenance["configuration.execution.retries"]?.path).toBe(join(root, "components", "child", "as-is.json"));
  rmSync(root, { recursive: true, force: true });
});

test("keeps task local while cascading only configuration", async () => {
  const root = fixture();
  writeJson(join(root, "as-is.json"), { configuration: { agents: { defaultModel: "small" } }, task: { status: "active" } });
  writeJson(join(root, "components", "child", "as-is.json"), { task: { status: "ready" } });
  const result = await resolveAsIsData(root, "components/child");
  expect(result.effective).toEqual({ configuration: { agents: { defaultModel: "small" } } });
  expect(result.local.task).toEqual({ status: "ready" });
  rmSync(root, { recursive: true, force: true });
});

test("keeps missing optional files valid and reports malformed applicable data", async () => {
  const root = fixture();
  writeFileSync(join(root, "as-is.json"), "not json");
  const result = await resolveAsIsData(root, "components/child");
  expect(result.complete).toBe(false);
  expect(result.diagnostics[0]?.code).toBe("invalid-json");
  rmSync(root, { recursive: true, force: true });
});

test("resolves effective configuration synchronously without cascading local task data", () => {
  const root = fixture();
  writeJson(join(root, "as-is.json"), { configuration: { agents: { defaultModel: "small" } }, task: { status: "active" } });
  writeJson(join(root, "components", "child", "as-is.json"), { configuration: { agents: { defaultThinkingLevel: "high" } }, task: { status: "ready" } });
  const result = resolveConfigurationSync(root, "components/child");
  expect(result.complete).toBe(true);
  expect(result.configuration).toEqual({ agents: { defaultModel: "small", defaultThinkingLevel: "high" } });
  expect(result.provenance["configuration.agents"]?.scope).toBe("repository");
  rmSync(root, { recursive: true, force: true });
});

test("finds the configuration root from a nested client directory", () => {
  const root = fixture();
  writeJson(join(root, "as-is.json"), { configuration: { agents: { defaultModel: "small" } } });
  const result = resolveConfigurationFromCwdSync(join(root, "components", "child"));
  expect(result.root).toBe(root);
  expect(result.configuration.agents).toEqual({ defaultModel: "small" });
  rmSync(root, { recursive: true, force: true });
});

test("keeps resolver ownership generic while cascading consumer namespaces and provenance", () => {
  const root = fixture();
  writeJson(join(root, "as-is.json"), {
    configuration: {
      observability: { tracing: { backend: "file", enabled: true } },
      agents: { defaultModel: "small" },
    },
  });
  writeJson(join(root, "components", "child", "as-is.json"), {
    configuration: { observability: { tracing: { enabled: false } }, agents: { defaultThinkingLevel: "high" } },
    task: { status: "active" },
  });
  const result = resolveConfigurationSync(root, "components/child");
  expect(result.configuration).toEqual({
    observability: { tracing: { backend: "file", enabled: false } },
    agents: { defaultModel: "small", defaultThinkingLevel: "high" },
  });
  expect(result.provenance["configuration.observability"]?.scope).toBe("repository");
  expect(result.provenance["configuration.observability.tracing.enabled"]?.scope).toBe("component");
  expect(result.configuration).not.toHaveProperty("task");
  rmSync(root, { recursive: true, force: true });
});

test("reports malformed configuration for an explicit root", () => {
  const root = fixture();
  writeFileSync(join(root, "as-is.json"), "not json");
  const result = resolveConfigurationSync(root, ".");
  expect(result.complete).toBe(false);
  expect(result.diagnostics[0]?.code).toBe("invalid-json");
  rmSync(root, { recursive: true, force: true });
});

test("rejects targets outside the repository and symlink escapes", async () => {
  const root = fixture();
  const outside = mkdtempSync(join(tmpdir(), "as-is-data-outside-"));
  expect((await resolveAsIsData(root, "../outside")).complete).toBe(false);
  symlinkSync(outside, join(root, "escape"));
  expect((await resolveAsIsData(root, "escape")).diagnostics[0]?.code).toBe("target-symlink-escape");
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});
