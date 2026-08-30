import { describe, it, expect, beforeEach } from "bun:test";
import { resolve } from "node:path";
import {
  PlanAdmissionEngine,
  ComponentReservationManager,
  ParentClosureEvaluator,
  type PlanEnvelope,
  type AdmissionContext,
  type ChildTerminalResult,
} from "../../execution-control";
import {
  SkillRegistry,
  CompositionRunner,
  ExecutionTracer,
  implementingTasksMasterSkill,
  buildingComponentsMasterSkill,
  contextBuildingSkill,
  verificationDisciplineSkill,
  namingSoftwareConceptsSkill,
  type SkillExecutionContext,
  type TaskImplementationInput,
  type ComponentBuildInput,
} from "../../skills";
import { loadRoleContracts, type AgentContract } from "../../agents";
import {
  createValidPlanEnvelope,
  createValidContext,
  createValidChildEntry,
} from "../../fixtures/plan-builder";

describe("Candidate End-to-End Pilot Testbed", () => {
  let registry: SkillRegistry;
  let runner: CompositionRunner;
  let reservationManager: ComponentReservationManager;
  let admissionEngine: PlanAdmissionEngine;
  let closureEvaluator: ParentClosureEvaluator;
  let contracts: ReadonlyMap<string, AgentContract>;

  beforeEach(async () => {
    registry = new SkillRegistry();
    registry.registerReusable(contextBuildingSkill);
    registry.registerReusable(verificationDisciplineSkill);
    registry.registerReusable(namingSoftwareConceptsSkill);
    registry.registerMaster(implementingTasksMasterSkill);
    registry.registerMaster(buildingComponentsMasterSkill);

    runner = new CompositionRunner(registry);
    reservationManager = new ComponentReservationManager();
    admissionEngine = new PlanAdmissionEngine(reservationManager);
    closureEvaluator = new ParentClosureEvaluator();

    const agentsDir = resolve(import.meta.dir, "../../agents");
    contracts = await loadRoleContracts(agentsDir);
  });

  it("executes complete lifecycle: planning -> admission -> parallel child execution -> integration -> closure", async () => {
    const implementer = contracts.get("implementer")!;
    const worker = contracts.get("worker")!;

    // 1. Intent & Plan Envelope construction
    const plan = createValidPlanEnvelope({
      planRevision: "plan-e2e-001",
      parent: {
        componentKey: "core",
        anchorPath: "core/as-is.md",
        taskRevision: "parent-task-e2e-001",
        boundedOutcome: "Realize multi-module task control and process adapters",
      },
      children: [
        createValidChildEntry("child-task-control", "core/modules/task-control", {
          scopeAllowlist: ["core/modules/task-control/**"],
          budget: { allocatedUnits: 10, maxWallClockSeconds: 120, reserveUnits: 2 },
        }),
        createValidChildEntry("child-process-adapter", "core/adapters/process", {
          scopeAllowlist: ["core/adapters/process/**"],
          budget: { allocatedUnits: 12, maxWallClockSeconds: 120, reserveUnits: 2 },
        }),
      ],
      freshness: {
        parentRecordRevision: "parent-rev-1",
        childRecordRevisions: {
          "core/modules/task-control": "rev-10",
          "core/adapters/process": "rev-20",
        },
        expectedParentBase: "git-commit-base-001",
      },
    });

    const admContext = createValidContext({
      currentParentBase: "git-commit-base-001",
      currentRecordRevisions: {
        "core/modules/task-control": "rev-10",
        "core/adapters/process": "rev-20",
      },
      parentAvailableUnits: 50,
    });

    // 2. Plan Admission & Component Reservation
    const admission = admissionEngine.evaluate(plan, admContext);
    expect(admission.status).toBe("admitted");
    expect(admission.reservations.length).toBe(2);
    expect(reservationManager.listActiveReservations().length).toBe(2);

    // 3. Child Task Realization via Worker Agent and Master Composition
    const childResults: ChildTerminalResult[] = [];

    for (const child of plan.children) {
      const childTracer = new ExecutionTracer(
        child.scopeAllowlist,
        child.protectedInputs
      );

      const childContext: SkillExecutionContext = {
        taskRevision: child.id,
        componentKey: child.componentKey,
        scopeAllowlist: child.scopeAllowlist,
        protectedInputs: child.protectedInputs,
        assignedAgent: worker,
        state: new Map(),
        tracer: childTracer,
        budgetRemaining: {
          units: child.budget.allocatedUnits,
          wallClockSeconds: child.budget.maxWallClockSeconds,
        },
      };

      const taskInput: TaskImplementationInput = {
        taskDescription: child.boundedOutcome,
        targetFiles: [`${child.componentKey}/src/impl.ts`],
        verificationChecks: [
          {
            name: `unit-tests-${child.id}`,
            run: async () => ({ passed: true, output: "10/10 tests passed" }),
          },
        ],
      };

      const workerExecution = await runner.runComposition(
        implementingTasksMasterSkill,
        childContext,
        "component-task",
        taskInput
      );

      expect(workerExecution.status).toBe("completed");
      expect(workerExecution.executedSteps.length).toBe(4);

      // Package child result
      childResults.push({
        childId: child.id,
        componentKey: child.componentKey,
        taskStatus: "completed",
        validationEvidence: {
          passed: true,
          testsPassed: workerExecution.data?.testsPassed ?? 1,
          details: workerExecution.evidence,
        },
        integrationEvidence: {
          appliedBase: plan.freshness.expectedParentBase,
          mergedCommit: `commit-${child.id}-final`,
          cleanScope: true,
          protectedInputsUnmodified: true,
          verified: true,
          details: ["Clean merge without scope violation"],
        },
        recordedSpend: {
          unitsUsed: workerExecution.totalSpend.units,
          wallClockSeconds: workerExecution.totalSpend.wallClockSeconds,
        },
      });
    }

    // 4. Parent Closure Evaluation and Reservation Release
    const closure = closureEvaluator.evaluate(plan, childResults);
    expect(["eligible", "completed"]).toContain(closure.status);
    expect(closure.totalSpend.unitsUsed).toBe(16); // 8 units per child * 2
    expect(closure.missingEvidence.length).toBe(0);

    // Release reservations upon closure
    const released = reservationManager.release(
      plan.children.map((c) => c.componentKey),
      plan.parent.taskRevision
    );
    expect(released.releasedKeys.length).toBe(2);
    expect(reservationManager.listActiveReservations().length).toBe(0);
  });

  it("handles child failure, fail-closed closure, and recovery re-planning", async () => {
    const worker = contracts.get("worker")!;

    // Initial Plan
    const plan = createValidPlanEnvelope({
      planRevision: "plan-failure-recovery-001",
      children: [
        createValidChildEntry("child-flaky", "core/modules/task-control", {
          scopeAllowlist: ["core/modules/task-control/**"],
          budget: { allocatedUnits: 10, maxWallClockSeconds: 120, reserveUnits: 2 },
        }),
      ],
    });

    const admContext = createValidContext({
      parentAvailableUnits: 30,
    });

    const admission = admissionEngine.evaluate(plan, admContext);
    expect(admission.status).toBe("admitted");

    // Worker execution encounters failing verification check
    const tracer = new ExecutionTracer(
      plan.children[0].scopeAllowlist,
      plan.children[0].protectedInputs
    );

    const childContext: SkillExecutionContext = {
      taskRevision: plan.children[0].id,
      componentKey: plan.children[0].componentKey,
      scopeAllowlist: plan.children[0].scopeAllowlist,
      protectedInputs: plan.children[0].protectedInputs,
      assignedAgent: worker,
      state: new Map(),
      tracer,
      budgetRemaining: { units: 10, wallClockSeconds: 120 },
    };

    const failingInput: TaskImplementationInput = {
      taskDescription: "Flaky change",
      targetFiles: ["core/modules/task-control/impl.ts"],
      verificationChecks: [
        {
          name: "strict-regression-test",
          run: async () => ({ passed: false, output: "SyntaxError: Unexpected token" }),
        },
      ],
    };

    const workerResult = await runner.runComposition(
      implementingTasksMasterSkill,
      childContext,
      "component-task",
      failingInput
    );

    expect(workerResult.status).toBe("failed");

    // Parent closure fails-closed
    const failedChildTerminal: ChildTerminalResult = {
      childId: "child-flaky",
      componentKey: "core/modules/task-control",
      taskStatus: "failed",
      validationEvidence: {
        passed: false,
        testsPassed: 0,
        details: ["SyntaxError: Unexpected token"],
      },
      recordedSpend: { unitsUsed: 5, wallClockSeconds: 30 },
    };

    const closure = closureEvaluator.evaluate(plan, [failedChildTerminal]);
    expect(closure.status).toBe("failed");
    expect(closure.summary).toContain("child tasks failed");

    // Recovery Re-plan: release old reservation, create amended plan
    reservationManager.release(["core/modules/task-control"], plan.parent.taskRevision);

    const recoveryPlan = createValidPlanEnvelope({
      planRevision: "plan-failure-recovery-002-amended",
      parent: {
        componentKey: "core",
        anchorPath: "core/as-is.md",
        taskRevision: "parent-task-e2e-001-attempt-2",
        boundedOutcome: "Amended realization after fixing syntax issue",
      },
      children: [
        createValidChildEntry("child-flaky-repaired", "core/modules/task-control", {
          scopeAllowlist: ["core/modules/task-control/**"],
          budget: { allocatedUnits: 10, maxWallClockSeconds: 120, reserveUnits: 2 },
        }),
      ],
    });

    const recoveryAdmission = admissionEngine.evaluate(recoveryPlan, admContext);
    expect(recoveryAdmission.status).toBe("admitted");

    // Retry with fresh execution context and fixed checks
    const repairedTracer = new ExecutionTracer(
      recoveryPlan.children[0].scopeAllowlist,
      recoveryPlan.children[0].protectedInputs
    );

    const repairedContext: SkillExecutionContext = {
      taskRevision: recoveryPlan.children[0].id,
      componentKey: recoveryPlan.children[0].componentKey,
      scopeAllowlist: recoveryPlan.children[0].scopeAllowlist,
      protectedInputs: recoveryPlan.children[0].protectedInputs,
      assignedAgent: worker,
      state: new Map(),
      tracer: repairedTracer,
      budgetRemaining: { units: 10, wallClockSeconds: 120 },
    };

    const repairedInput: TaskImplementationInput = {
      taskDescription: "Fixed syntax issue",
      targetFiles: ["core/modules/task-control/impl.ts"],
      verificationChecks: [
        {
          name: "strict-regression-test",
          run: async () => ({ passed: true, output: "All syntax checks passed" }),
        },
      ],
    };

    const repairedExecution = await runner.runComposition(
      implementingTasksMasterSkill,
      repairedContext,
      "component-task",
      repairedInput
    );
    expect(repairedExecution.status).toBe("completed");

    const repairedChildTerminal: ChildTerminalResult = {
      childId: "child-flaky-repaired",
      componentKey: "core/modules/task-control",
      taskStatus: "completed",
      validationEvidence: {
        passed: true,
        testsPassed: 5,
        details: ["All syntax checks passed"],
      },
      integrationEvidence: {
        appliedBase: recoveryPlan.freshness.expectedParentBase,
        mergedCommit: "commit-flaky-repaired",
        cleanScope: true,
        protectedInputsUnmodified: true,
        verified: true,
        details: ["Clean merge"],
      },
      recordedSpend: { unitsUsed: 6, wallClockSeconds: 35 },
    };

    const finalClosure = closureEvaluator.evaluate(recoveryPlan, [repairedChildTerminal]);
    expect(["eligible", "completed"]).toContain(finalClosure.status);
    reservationManager.release(["core/modules/task-control"], recoveryPlan.parent.taskRevision);
    expect(reservationManager.listActiveReservations().length).toBe(0);
  });

  it("prevents deadlock and maintains isolation across concurrent colliding plans", () => {
    // Plan A locks core/modules/task-control and core/adapters/process
    const planA = createValidPlanEnvelope({
      planRevision: "plan-A",
      parent: {
        componentKey: "core",
        anchorPath: "core/as-is.md",
        taskRevision: "task-parent-A",
        boundedOutcome: "Plan A realization",
      },
      freshness: {
        parentRecordRevision: "parent-rev-1",
        childRecordRevisions: {
          "core/modules/task-control": "rev-10",
          "core/adapters/process": "rev-20",
        },
        expectedParentBase: "git-commit-base-001",
      },
    });

    // Plan B also tries to lock core/modules/task-control and core/modules/observability
    const planB = createValidPlanEnvelope({
      planRevision: "plan-B",
      parent: {
        componentKey: "core",
        anchorPath: "core/as-is.md",
        taskRevision: "task-parent-B",
        boundedOutcome: "Plan B realization",
      },
      children: [
        createValidChildEntry("child-b1", "core/modules/task-control"),
        createValidChildEntry("child-b2", "core/modules/observability"),
      ],
      dependencyGraph: {
        nodes: ["child-b1", "child-b2"],
        edges: [],
        independenceClassification: { "child-b1": "independent", "child-b2": "independent" },
      },
      freshness: {
        parentRecordRevision: "parent-rev-1",
        childRecordRevisions: {
          "core/modules/task-control": "rev-10",
          "core/modules/observability": "rev-30",
        },
        expectedParentBase: "git-commit-base-001",
      },
    });

    const admContext = createValidContext({
      currentRecordRevisions: {
        "core/modules/task-control": "rev-10",
        "core/adapters/process": "rev-20",
        "core/modules/observability": "rev-30",
      },
      parentAvailableUnits: 50,
    });

    // Plan A admits and locks its components
    const admA = admissionEngine.evaluate(planA, admContext);
    expect(admA.status).toBe("admitted");
    expect(reservationManager.listActiveReservations().length).toBe(2);

    // Plan B admission is rejected due to collision on core/modules/task-control
    const admB = admissionEngine.evaluate(planB, admContext);
    expect(admB.status).toBe("rejected");
    expect(admB.violations.some((r) => r.includes("locked by task 'task-parent-A'"))).toBe(true);

    // Verify Plan B did NOT leave orphan lock on core/modules/observability (atomic rollback)
    expect(reservationManager.isLocked("core/modules/observability")).toBe(false);
    expect(reservationManager.listActiveReservations().length).toBe(2);

    // Release Plan A
    reservationManager.release(
      planA.children.map((c) => c.componentKey),
      planA.parent.taskRevision
    );
    expect(reservationManager.listActiveReservations().length).toBe(0);

    // Now Plan B can admit successfully
    const admB2 = admissionEngine.evaluate(planB, admContext);
    expect(admB2.status).toBe("admitted");
    expect(reservationManager.listActiveReservations().length).toBe(2);
    expect(reservationManager.isLocked("core/modules/observability")).toBe(true);

    // Clean up
    reservationManager.release(
      planB.children.map((c) => c.componentKey),
      planB.parent.taskRevision
    );
    expect(reservationManager.listActiveReservations().length).toBe(0);
  });
});
