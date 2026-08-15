import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateTree } from "./task-record-validator.ts";

function narrative(result = "- Pending."): string {
  return `# Task
## Requirement
Text.
## Plan
Text.
## Progress
Text.
## Validation
Text.
## Result
${result}
## Blockers And Escalations
Text.
## Recovery
Text.
## Next Action
Text.
`;
}

function task(status = "active", cost = 6, wall = 60, depth = 1, children = 2, effects = "require-current-turn-user-approval") {
  return { status, worker: "implementer", updated: "2026-07-26T14:00:00Z", constraints: { cost: { currency: "USD", allocated: cost, spent: 1, reserve: 1, source: "unavailable", "fallback-metric": "unavailable" }, delegation: { "maximum-depth": depth, "maximum-children": children }, execution: { "wall-clock": { "allocated-seconds": wall, "spent-seconds": 10, "reserve-seconds": 10, source: "unavailable" } }, "external-effects": effects }, acceptance: ["A bounded result."] };
}

async function fixture(parentTask = task(), childTask?: ReturnType<typeof task>, parentResult = "- Child `child` completed normally."): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "as-is-validator-"));
  await writeFile(join(root, "as-is.json"), JSON.stringify({ configuration: { records: { filenames: { task: "tasks.md" } } }, task: parentTask }));
  await writeFile(join(root, "tasks.md"), narrative(parentResult));
  if (childTask) {
    const child = join(root, "child");
    await mkdir(child);
    await writeFile(join(child, "as-is.json"), JSON.stringify({ task: childTask }));
    await writeFile(join(child, "tasks.md"), narrative());
  }
  return root;
}

test("accepts a configuration-only root after task cleanup", async () => {
  const root = await mkdtemp(join(tmpdir(), "as-is-validator-config-only-"));
  try {
    await writeFile(join(root, "as-is.json"), JSON.stringify({ configuration: { records: { filenames: { task: "tasks.md" } } } }));
    expect(validateTree(root)).toEqual([]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("accepts a valid completed tree", async () => {
  const root = await fixture({ ...task("completed"), constraints: task("completed").constraints }, { ...task("completed", 4, 40, 0, 0), constraints: task("completed", 4, 40, 0, 0).constraints });
  try { expect(validateTree(root)).toEqual([]); } finally { await rm(root, { recursive: true, force: true }); }
});

test("matches weakened policy, delegation, budget, and descendant diagnostics", async () => {
  const root = await fixture(task("active", 5, 50, 1, 1, "prohibited"), task("active", 4, 40, 1, 2, "require-current-turn-user-approval"));
  try {
    const errors = validateTree(root).join("\n");
    expect(errors).toContain("external-effects weakens parent policy");
    expect(errors).toContain("maximum-depth weakens parent delegation limit");
    expect(errors).toContain("maximum-children weakens parent delegation limit");
    expect(errors).toContain("child cost allocations exceed remaining budget");
    expect(errors).toContain("child wall-clock allocations exceed remaining budget");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("rejects missing task fields and unsafe configured filenames", async () => {
  const root = await fixture();
  try {
    const metadata = JSON.parse(await Bun.file(join(root, "as-is.json")).text());
    delete metadata.task.worker;
    await writeFile(join(root, "as-is.json"), JSON.stringify(metadata));
    expect(validateTree(root).join("\\n")).toContain("missing fields: worker");
    metadata.configuration.records.filenames.task = "../unsafe.md";
    await writeFile(join(root, "as-is.json"), JSON.stringify(metadata));
    expect(validateTree(root).join("\\n")).toContain("configured task filename is unsafe");
    metadata.configuration.records.filenames.task = "..";
    await writeFile(join(root, "as-is.json"), JSON.stringify(metadata));
    expect(validateTree(root).join("\\n")).toContain("configured task filename is unsafe");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("rejects malformed legacy narratives, unsafe filenames, and invalid timestamps", async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, "tasks.md"), "---\nstatus: active\n---\n" + narrative());
    expect(validateTree(root).join("\\n")).toContain("legacy YAML task narrative is unsupported");
    await writeFile(join(root, "tasks.md"), narrative());
    const metadata = JSON.parse(await Bun.file(join(root, "as-is.json")).text());
    metadata.task.updated = "2026-02-29T14:00:00Z";
    await writeFile(join(root, "as-is.json"), JSON.stringify(metadata));
    expect(validateTree(root).join("\\n")).toContain("invalid timestamp");
    metadata.task.updated = "not-a-timestamp";
    await writeFile(join(root, "as-is.json"), JSON.stringify(metadata));
    expect(validateTree(root).join("\\n")).toContain("must be an RFC 3339 UTC timestamp");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("reports sibling diagnostics in deterministic path order", async () => {
  const root = await fixture(task("active", 6, 60, 1, 2));
  try {
    for (const name of ["z-child", "a-child"]) {
      const child = join(root, name);
      await mkdir(child);
      await writeFile(join(child, "as-is.json"), JSON.stringify({ task: task("active", 4, 40, 1, 2) }));
      await writeFile(join(child, "tasks.md"), narrative());
    }
    const errors = validateTree(root);
    expect(errors.findIndex((error) => error.includes("a-child"))).toBeLessThan(errors.findIndex((error) => error.includes("z-child")));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("rejects completed parents with non-terminal or unaccounted failed descendants", async () => {
  const root = await fixture(task("completed"), task("active", 4, 40, 0, 0));
  try { expect(validateTree(root).join("\n")).toContain("non-terminal descendant child"); } finally { await rm(root, { recursive: true, force: true }); }
  const failedRoot = await fixture(task("completed"), task("failed", 4, 40, 0, 0), "- Pending.");
  try { expect(validateTree(failedRoot).join("\n")).toContain("does not account for failed descendant child"); } finally { await rm(failedRoot, { recursive: true, force: true }); }
});
