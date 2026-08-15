import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveLocalLinkedContext } from "./linked-context-resolver.ts";

function fixture(): { root: string; component: string } {
  const root = mkdtempSync(join(tmpdir(), "as-is-linked-context-"));
  const component = join(root, "component");
  mkdirSync(component);
  writeFileSync(join(component, "as-is.md"), "# Component\n\n- [Guide](guide.md)\n- [Task](tasks.md)\n");
  writeFileSync(join(component, "guide.md"), "# Guide\n\nBounded context.\n");
  writeFileSync(join(component, "tasks.md"), "# Active task\n");
  return { root, component };
}

test("resolves one explicitly declared local link with provenance", async () => {
  const { root, component } = fixture();
  try {
    const result = await resolveLocalLinkedContext(root, "component/as-is.md", "guide.md");
    expect(result.complete).toBe(true);
    expect(result.content).toBe("# Guide\n\nBounded context.\n");
    expect(result.source?.relativePath).toBe("component/guide.md");
    expect(result.source?.mediaType).toBe("text/markdown; charset=utf-8");
    expect(result.source?.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(result.diagnostics).toEqual([]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("allows an explicit parent handoff but rejects undeclared, task-record, and escaping links", async () => {
  const { root, component } = fixture();
  const outside = mkdtempSync(join(tmpdir(), "as-is-linked-context-outside-"));
  try {
    writeFileSync(join(root, "design.md"), "# Shared design\n");
    writeFileSync(join(outside, "outside.md"), "Outside.\n");
    symlinkSync(join(outside, "outside.md"), join(component, "escape.md"));
    writeFileSync(join(component, "as-is.md"), "# Component\n\n- [Design](../design.md)\n- [Task](tasks.md)\n- [Escape](escape.md)\n");
    const handoff = await resolveLocalLinkedContext(root, "component/as-is.md", "../design.md");
    expect(handoff.complete).toBe(true);
    expect(handoff.source?.relativePath).toBe("design.md");
    for (const [reference, code] of [
      ["missing.md", "reference-not-declared"],
      ["tasks.md", "task-record-denied"],
      ["../outside.md", "reference-not-declared"],
    ]) {
      const result = await resolveLocalLinkedContext(root, "component/as-is.md", reference);
      expect(result.complete).toBe(false);
      expect(result.diagnostics[0]?.code).toBe(code);
    }
    const escaped = await resolveLocalLinkedContext(root, "component/as-is.md", "escape.md");
    expect(escaped.complete).toBe(false);
    expect(escaped.diagnostics[0]?.code).toBe("target-symlink-escape");
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

test("indexes an explicitly exposed directory and resolves one indexed file", async () => {
  const { root, component } = fixture();
  try {
    mkdirSync(join(component, "fixtures"));
    writeFileSync(join(component, "fixtures", "example.json"), "{\"example\":true}\n");
    writeFileSync(join(component, "as-is.md"), "# Component\n\n- [Fixtures](fixtures/)\n");
    const index = await resolveLocalLinkedContext(root, "component/as-is.md", "fixtures/");
    expect(index.complete).toBe(true);
    expect(index.kind).toBe("directory");
    expect(index.entries).toEqual([{ name: "example.json", kind: "file", relativePath: "component/fixtures/example.json", bytes: 17 }]);
    const file = await resolveLocalLinkedContext(root, "component/as-is.md", "fixtures/example.json");
    expect(file.complete).toBe(true);
    expect(file.kind).toBe("file");
    expect(file.content).toBe("{\"example\":true}\n");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("honors configured task-record names", async () => {
  const { root, component } = fixture();
  try {
    writeFileSync(join(component, "work.md"), "# Configured task\n");
    writeFileSync(join(component, "as-is.md"), "# Component\n\n- [Task](work.md)\n");
    const result = await resolveLocalLinkedContext(root, "component/as-is.md", "work.md", { taskRecordNames: ["work.md"] });
    expect(result.complete).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("task-record-denied");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects URI, fragment, directory, invalid UTF-8, and oversized content even when declared", async () => {
  const { root, component } = fixture();
  try {
    mkdirSync(join(component, "directory"));
    writeFileSync(join(component, "invalid.txt"), Buffer.from([0xc3, 0x28]));
    writeFileSync(join(component, "large.txt"), "x".repeat(64 * 1024 + 1));
    writeFileSync(join(component, "as-is.md"), "# Component\n\n- [URI](https://example.test/a.md)\n- [Fragment](guide.md#section)\n- [Directory](directory)\n- [Invalid](invalid.txt)\n- [Large](large.txt)\n");
    for (const [reference, code] of [
      ["https://example.test/a.md", "unsupported-reference"],
      ["guide.md#section", "unsupported-reference"],
      ["directory", "directory-not-exposed"],
      ["invalid.txt", "invalid-utf8"],
      ["large.txt", "content-too-large"],
    ]) {
      const result = await resolveLocalLinkedContext(root, "component/as-is.md", reference);
      expect(result.complete).toBe(false);
      expect(result.diagnostics[0]?.code).toBe(code);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
