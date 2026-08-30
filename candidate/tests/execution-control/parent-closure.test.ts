import { describe, it, expect } from "bun:test";
import { ParentClosureEvaluator } from "../../execution-control/closure";
import type { ChildTerminalResult } from "../../execution-control/types";
import { createValidPlanEnvelope } from "../../fixtures/plan-builder";

describe("Candidate ParentClosureEvaluator", () => {
  const evaluator = new ParentClosureEvaluator();

  it("evaluates parent task as completed for closure when all children succeed and integrate cleanly", () => {
    const plan = createValidPlanEnvelope();

    const childResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: {
          passed: true,
          testsPassed: 10,
          coveragePercent: 95,
          details: ["All 10 unit tests passed"],
        },
        integrationEvidence: {
          appliedBase: "git-commit-base-001",
          mergedCommit: "git-commit-child1",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: ["Worktree merged cleanly"],
        },
        recordedSpend: {
          unitsUsed: 8,
          wallClockSeconds: 120,
        },
      },
      {
        childId: "child-process-adapter",
        componentKey: "core/adapters/process",
        taskStatus: "completed",
        validationEvidence: {
          passed: true,
          testsPassed: 8,
          coveragePercent: 90,
          details: ["All 8 tests passed"],
        },
        integrationEvidence: {
          appliedBase: "git-commit-base-001",
          mergedCommit: "git-commit-child2",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: ["Clean merge without conflicts"],
        },
        recordedSpend: {
          unitsUsed: 6,
          wallClockSeconds: 90,
        },
      },
    ];

    const outcome = evaluator.evaluate(plan, childResults, ["Minor deprecation notice in dependency"]);

    expect(outcome.status).toBe("completed");
    expect(outcome.isTerminal).toBe(true);
    expect(outcome.canCommit).toBe(true);
    expect(outcome.missingEvidence.length).toBe(0);
    expect(outcome.unaccountedChildren.length).toBe(0);
    expect(outcome.residualRisk).toContain("Minor deprecation notice in dependency");
    expect(outcome.totalSpend.unitsUsed).toBe(14);
    expect(outcome.totalSpend.wallClockSeconds).toBe(210);
    expect(outcome.childDispositions["child-task-control"].eligible).toBe(true);
    expect(outcome.childDispositions["child-process-adapter"].eligible).toBe(true);
  });

  it("fails closed when an expected child is missing from the accounting report", () => {
    const plan = createValidPlanEnvelope();

    // Only child-task-control is reported; child-process-adapter is missing
    const partialResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: {
          passed: true,
          testsPassed: 10,
          details: [],
        },
        integrationEvidence: {
          appliedBase: "git-commit-base-001",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: [],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
    ];

    const outcome = evaluator.evaluate(plan, partialResults);

    expect(outcome.status).toBe("ineligible");
    expect(outcome.isTerminal).toBe(false);
    expect(outcome.canCommit).toBe(false);
    expect(outcome.unaccountedChildren).toContain("child-process-adapter");
  });

  it("fails the parent immediately if any child task failed and identifies sibling compensation", () => {
    const plan = createValidPlanEnvelope();

    const childResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: { passed: true, testsPassed: 10, details: [] },
        integrationEvidence: {
          appliedBase: "base",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: [],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
      {
        childId: "child-process-adapter",
        componentKey: "core/adapters/process",
        taskStatus: "failed",
        validationEvidence: { passed: false, testsPassed: 2, details: ["Tests threw runtime error"] },
        recordedSpend: { unitsUsed: 4, wallClockSeconds: 40 },
      },
    ];

    const outcome = evaluator.evaluate(plan, childResults);

    expect(outcome.status).toBe("failed");
    expect(outcome.isTerminal).toBe(true);
    expect(outcome.canCommit).toBe(false);
    expect(outcome.rolledBackSiblings).toContain("child-task-control");
    expect(outcome.summary).toContain("child tasks failed");
  });

  it("marks parent as cancelled if a child task was cancelled and releases sibling leases", () => {
    const plan = createValidPlanEnvelope();

    const childResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: { passed: true, testsPassed: 10, details: [] },
        integrationEvidence: {
          appliedBase: "base",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: [],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
      {
        childId: "child-process-adapter",
        componentKey: "core/adapters/process",
        taskStatus: "cancelled",
        validationEvidence: { passed: false, testsPassed: 0, details: [] },
        recordedSpend: { unitsUsed: 2, wallClockSeconds: 20 },
      },
    ];

    const outcome = evaluator.evaluate(plan, childResults);

    expect(outcome.status).toBe("cancelled");
    expect(outcome.isTerminal).toBe(true);
    expect(outcome.canCommit).toBe(false);
    expect(outcome.rolledBackSiblings).toContain("child-task-control");
  });

  it("withholds closure when a child is still active or awaiting approval", () => {
    const plan = createValidPlanEnvelope();

    const childResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: { passed: true, testsPassed: 10, details: [] },
        integrationEvidence: {
          appliedBase: "base",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: [],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
      {
        childId: "child-process-adapter",
        componentKey: "core/adapters/process",
        taskStatus: "active",
        validationEvidence: { passed: false, testsPassed: 0, details: [] },
        recordedSpend: { unitsUsed: 2, wallClockSeconds: 30 },
      },
    ];

    const outcome = evaluator.evaluate(plan, childResults);

    expect(outcome.status).toBe("ineligible");
    expect(outcome.isTerminal).toBe(false);
    expect(outcome.canCommit).toBe(false);
  });

  it("rejects closure when child integration modified protected inputs or had dirty scope", () => {
    const plan = createValidPlanEnvelope();

    const childResults: ChildTerminalResult[] = [
      {
        childId: "child-task-control",
        componentKey: "core/modules/task-control",
        taskStatus: "completed",
        validationEvidence: { passed: true, testsPassed: 10, details: [] },
        integrationEvidence: {
          appliedBase: "base",
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: [],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
      {
        childId: "child-process-adapter",
        componentKey: "core/adapters/process",
        taskStatus: "completed",
        validationEvidence: { passed: true, testsPassed: 5, details: [] },
        integrationEvidence: {
          appliedBase: "base",
          cleanScope: false, // Dirty scope!
          protectedInputsUnmodified: false, // Protected input modified!
          verified: false,
          details: ["Protected input core/contracts modified"],
        },
        recordedSpend: { unitsUsed: 5, wallClockSeconds: 60 },
      },
    ];

    const outcome = evaluator.evaluate(plan, childResults);

    expect(outcome.status).toBe("ineligible");
    expect(outcome.isTerminal).toBe(false);
    expect(outcome.canCommit).toBe(false);
    expect(outcome.missingEvidence.some((m) => m.includes("dirty scope violations"))).toBe(true);
    expect(outcome.missingEvidence.some((m) => m.includes("altered protected inputs"))).toBe(true);
  });
});
