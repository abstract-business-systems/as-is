import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { resolveInstructionContext } from "./instruction-resolver";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "instruction-context-"));
  mkdirSync(join(root, "components", "child"), { recursive: true });
  return root;
}

test("returns applicable instruction files in ancestor-first order", async () => {
  const root = fixture();
  writeFileSync(join(root, "AGENTS.md"), "root");
  writeFileSync(join(root, "components", "AGENTS.md"), "components");
  writeFileSync(join(root, "components", "child", "AGENTS.md"), "child");
  const result = await resolveInstructionContext(root, "components/child");
  expect(result.complete).toBe(true);
  expect(result.sources.map((source) => source.relativePath)).toEqual(["AGENTS.md", "components/AGENTS.md", "components/child/AGENTS.md"]);
  expect(result.sources.map((source) => source.content)).toEqual(["root", "components", "child"]);
  rmSync(root, { recursive: true, force: true });
});

test("allows missing instruction files and rejects traversal and symlink escapes", async () => {
  const root = fixture();
  const noFiles = await resolveInstructionContext(root, "components/child");
  expect(noFiles).toMatchObject({ complete: true, sources: [] });
  const outside = mkdtempSync(join(tmpdir(), "instruction-context-outside-"));
  expect((await resolveInstructionContext(root, "../outside")).complete).toBe(false);
  symlinkSync(outside, join(root, "escape"));
  expect((await resolveInstructionContext(root, "escape")).diagnostics[0]?.code).toBe("target-symlink-escape");
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});
