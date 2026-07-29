import { describe, expect, test } from "bun:test";
import { snapshot } from "./orient";

describe("orientation snapshot", () => {
  test("returns the compact task surfaces from the repository", () => {
    const report = snapshot();
    expect(report.root.status).toBeString();
    expect(report.root.nextAction.length).toBeGreaterThan(0);
    expect(report.components.some((task) => task.path === ".")).toBe(true);
    expect(report.open.every((task) => task.status !== "completed")).toBe(true);
    expect(Array.isArray(report.changeLog.residualRisk)).toBe(true);
    expect(Array.isArray(report.openDecisions)).toBe(true);
    expect(report.workingTree === "clean" || Array.isArray(report.workingTree)).toBe(true);
  });
});
