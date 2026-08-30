import { describe, it, expect } from "bun:test";
import {
  ComponentReservationManager,
  PlanAdmissionEngine,
  ParentClosureEvaluator,
  type PlanEnvelope,
  type ChildTerminalResult,
} from "../../execution-control";
import {
  createValidChildEntry,
  createValidContext,
} from "../../fixtures/plan-builder";
import {
  ACCEPTED_TARGET_DESIGN_SHA256,
  ACCEPTED_TARGET_PACKET_DIGEST,
} from "../../execution-control/admission";

describe("Candidate Execution-Control Kernel - End-to-End Integration", () => {
  it("orchestrates a full 2-stage multi-child plan: admission, parallel locking, execution, and fail-closed parent closure", () => {
    // 1. Initialize Kernel Components
    const resMgr = new ComponentReservationManager();
    const admissionEngine = new PlanAdmissionEngine(resMgr);
    const closureEvaluator = new ParentClosureEvaluator();

    // 2. Define 3-Child Plan with Dependencies:
    // Child 1 (task-control) & Child 2 (process-adapter) run independently in parallel.
    // Child 3 (dummy-delegation) depends on Child 1 and Child 2.
    const child1 = createValidChildEntry("child-task-control", "core/modules/task-control");
    const child2 = createValidChildEntry("child-process-adapter", "core/adapters/process");
    const child3 = createValidChildEntry("child-dummy-delegation", "validation-fixtures/dummy-delegation", {
      dependencies: ["child-task-control", "child-process-adapter"],
      budget: { allocatedUnits: 15, maxWallClockSeconds: 300, reserveUnits: 3 },
    });

    const fullPlan: PlanEnvelope = {
      planRevision: "plan-e2e-20260830",
      acceptedEnvelope: {
        targetPacketDigest: ACCEPTED_TARGET_PACKET_DIGEST,
        targetDesignSha256: ACCEPTED_TARGET_DESIGN_SHA256,
      },
      parent: {
        componentKey: "root",
        anchorPath: "as-is.md",
        taskRevision: "task-root-milestone1",
        boundedOutcome: "Realize and verify Milestone 1 Execution-Control Kernel",
      },
      children: [child1, child2, child3],
      dependencyGraph: {
        nodes: ["child-task-control", "child-process-adapter", "child-dummy-delegation"],
        edges: [
          { from: "child-task-control", to: "child-dummy-delegation" },
          { from: "child-process-adapter", to: "child-dummy-delegation" },
        ],
        independenceClassification: {
          "child-task-control": "independent",
          "child-process-adapter": "independent",
          "child-dummy-delegation": "dependent",
        },
      },
      freshness: {
        parentRecordRevision: "root-rev-1",
        childRecordRevisions: {
          "core/modules/task-control": "rev-1",
          "core/adapters/process": "rev-1",
          "validation-fixtures/dummy-delegation": "rev-1",
        },
        expectedParentBase: "git-commit-milestone1-base",
      },
      nonGoals: [],
      planDigest: "digest-plan-e2e-milestone1",
    };

    const context = createValidContext({
      currentParentBase: "git-commit-milestone1-base",
      currentRecordRevisions: {
        "core/modules/task-control": "rev-1",
        "core/adapters/process": "rev-1",
        "validation-fixtures/dummy-delegation": "rev-1",
      },
      parentAvailableUnits: 60, // Total needed: (10+2) + (10+2) + (15+3) = 42 units
    });

    // 3. Evaluate Plan Admission
    const admissionResult = admissionEngine.evaluate(fullPlan, context);
    expect(admissionResult.status).toBe("admitted");
    expect(admissionResult.reservations.length).toBe(3);
    expect(admissionResult.budgetReservation.remainingParentReserve).toBe(18); // 60 - 42
    expect(resMgr.listActiveReservations().length).toBe(3);

    // 4. Simulate Parallel Execution of Stage 1 (Child 1 & Child 2)
    const child1Result: ChildTerminalResult = {
      childId: "child-task-control",
      componentKey: "core/modules/task-control",
      taskStatus: "completed",
      validationEvidence: {
        passed: true,
        testsPassed: 17,
        details: ["All task-control admission & reservation tests passed"],
      },
      integrationEvidence: {
        appliedBase: "git-commit-milestone1-base",
        mergedCommit: "git-commit-stage1-child1",
        cleanScope: true,
        protectedInputsUnmodified: true,
        verified: true,
        details: ["Clean worktree patch"],
      },
      recordedSpend: { unitsUsed: 9, wallClockSeconds: 150 },
    };

    const child2Result: ChildTerminalResult = {
      childId: "child-process-adapter",
      componentKey: "core/adapters/process",
      taskStatus: "completed",
      validationEvidence: {
        passed: true,
        testsPassed: 12,
        details: ["Process adapter mechanical checks passed"],
      },
      integrationEvidence: {
        appliedBase: "git-commit-milestone1-base",
        mergedCommit: "git-commit-stage1-child2",
        cleanScope: true,
        protectedInputsUnmodified: true,
        verified: true,
        details: ["Clean merge"],
      },
      recordedSpend: { unitsUsed: 8, wallClockSeconds: 130 },
    };

    // Release reservations for Stage 1 upon terminal completion
    resMgr.release(["core/modules/task-control"], "task-root-milestone1");
    resMgr.release(["core/adapters/process"], "task-root-milestone1");

    // Interim Parent Closure Check: Should be ineligible because Child 3 is pending
    const interimOutcome = closureEvaluator.evaluate(fullPlan, [child1Result, child2Result]);
    expect(interimOutcome.status).toBe("ineligible");
    expect(interimOutcome.canCommit).toBe(false);
    expect(interimOutcome.unaccountedChildren).toContain("child-dummy-delegation");

    // 5. Execute Stage 2 (Child 3)
    const child3Result: ChildTerminalResult = {
      childId: "child-dummy-delegation",
      componentKey: "validation-fixtures/dummy-delegation",
      taskStatus: "completed",
      validationEvidence: {
        passed: true,
        testsPassed: 20,
        details: ["All dummy delegation tests passed against Stage 1 structures"],
      },
      integrationEvidence: {
        appliedBase: "git-commit-milestone1-base",
        mergedCommit: "git-commit-stage2-child3",
        cleanScope: true,
        protectedInputsUnmodified: true,
        verified: true,
        details: ["Clean merge of fixture evidence"],
      },
      recordedSpend: { unitsUsed: 12, wallClockSeconds: 180 },
    };

    // Release reservation for Stage 2
    resMgr.release(["validation-fixtures/dummy-delegation"], "task-root-milestone1");

    // 6. Final Parent Closure Evaluation
    const finalOutcome = closureEvaluator.evaluate(fullPlan, [
      child1Result,
      child2Result,
      child3Result,
    ]);

    expect(finalOutcome.status).toBe("eligible");
    expect(finalOutcome.isTerminal).toBe(true);
    expect(finalOutcome.canCommit).toBe(true);
    expect(finalOutcome.missingEvidence.length).toBe(0);
    expect(finalOutcome.unaccountedChildren.length).toBe(0);
    expect(finalOutcome.totalSpend.unitsUsed).toBe(29); // 9 + 8 + 12
    expect(finalOutcome.totalSpend.wallClockSeconds).toBe(460); // 150 + 130 + 180
    expect(resMgr.listActiveReservations().length).toBe(0); // Zero lock leakage!
  });
});
