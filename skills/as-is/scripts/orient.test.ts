import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { snapshot } from "./orient";

describe("orientation snapshot", () => {
  test("accepts an absent transient root task record", () => {
    const directory = mkdtempSync(join(tmpdir(), "orient-"));
    try {
      writeFileSync(join(directory, "as-is.md"), "---\nas-is-version: 2\n---\n# Root\n", "utf8");
      writeFileSync(join(directory, "changelog.md"), "# Changelog\n", "utf8");
      const report = snapshot(directory);
      expect(report.root.status).toBe("ready");
      expect(report.root.nextAction).toBe("not recorded");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  test("returns the compact task surfaces from the repository", () => {
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
