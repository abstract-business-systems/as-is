import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { snapshot } from "./orient";

describe("orientation snapshot", () => {
  test("accepts an absent transient root task record", () => {
    const directory = mkdtempSync(join(tmpdir(), "orient-"));
    try {
      writeFileSync(join(directory, "as-is.md"), "# Root\n", "utf8");
      writeFileSync(join(directory, "as-is.json"), JSON.stringify({ configuration: { records: { filenames: { task: "tasks.md" } } } }), "utf8");
      writeFileSync(join(directory, "changelog.md"), "# Changelog\n", "utf8");
      const report = snapshot(directory);
      expect(report.root.status).toBe("ready");
      expect(report.root.nextAction).toBe("not recorded");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  test("reads the task-control-owned configured narrative name", () => {
    const directory = mkdtempSync(join(tmpdir(), "orient-configured-name-"));
    try {
      writeFileSync(join(directory, "as-is.md"), "# Root\n", "utf8");
      writeFileSync(join(directory, "as-is.json"), JSON.stringify({
        configuration: { records: { filenames: { task: "work.md" } } },
        task: {
          status: "active",
          worker: "worker",
          updated: "2026-08-24T00:00:00Z",
          constraints: {
            cost: { currency: "USD", allocated: 1, spent: 0, reserve: 0, source: "test", "fallback-metric": "test" },
            delegation: { "maximum-depth": 0, "maximum-children": 0 },
            execution: { "wall-clock": { "allocated-seconds": 60, "spent-seconds": 0, "reserve-seconds": 0, source: "test" } },
            "external-effects": "prohibited",
          },
          acceptance: ["Read the configured narrative."],
        },
      }), "utf8");
      writeFileSync(join(directory, "work.md"), "# Task\n\n## Requirement\n\nTest.\n\n## Plan\n\nTest.\n\n## Progress\n\nTest.\n\n## Validation\n\nTest.\n\n## Result\n\nTest.\n\n## Blockers And Escalations\n\nNone.\n\n## Recovery\n\nTest.\n\n## Next Action\n\nUse the configured narrative.\n\n## End\n", "utf8");
      writeFileSync(join(directory, "changelog.md"), "# Changelog\n\n## Changelog\n\n- Test.\n", "utf8");
      expect(snapshot(directory).root.nextAction).toBe("Use the configured narrative.");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  test("returns the compact task surfaces from the repository", () => {
    if (process.env.AS_IS_RUN_ORIENTATION_REPOSITORY_FIXTURE !== "1") return;
    const report = snapshot();
    expect(report.root.status).toBeString();
    expect(report.root.nextAction.length).toBeGreaterThan(0);
    expect(report.components.some((task) => task.path === ".")).toBe(true);
    expect(report.open.every((task) => task.status !== "completed")).toBe(true);
    expect(Array.isArray(report.changelog.residualRisk)).toBe(true);
    expect(Array.isArray(report.openDecisions)).toBe(true);
    expect(report.workingTree === "clean" || Array.isArray(report.workingTree)).toBe(true);
  });
});
