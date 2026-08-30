import { describe, it, expect, beforeEach } from "bun:test";
import { resolve } from "node:path";
import {
  SkillRegistry,
  CompositionRunner,
  ExecutionTracer,
  implementingTasksMasterSkill,
  buildingComponentsMasterSkill,
  type SkillExecutionContext,
  type TaskImplementationInput,
  type ComponentBuildInput,
} from "../../skills";
import { loadRoleContracts, type AgentContract } from "../../agents";
import { ComponentReservationManager } from "../../execution-control/reservation";
import {
  createValidPlanEnvelope,
  createValidContext,
} from "../../fixtures/plan-builder";

describe("Candidate CompositionRunner and Master Skills", () => {
  let registry: SkillRegistry;
  let runner: CompositionRunner;
  let contracts: ReadonlyMap<string, AgentContract>;

  beforeEach(async () => {
    registry = new SkillRegistry();
    registry.registerMaster(implementingTasksMasterSkill);
    registry.registerMaster(buildingComponentsMasterSkill);
    runner = new CompositionRunner(registry);

    const agentsDir = resolve(import.meta.dir, "../../agents");
    contracts = await loadRoleContracts(agentsDir);
  });

  it("executes the implementing-tasks composition successfully for a worker", async () => {
    const worker = contracts.get("worker")!;
    const tracer = new ExecutionTracer(["core/modules/task-control"], ["core/contracts"]);

    const context: SkillExecutionContext = {
      taskRevision: "task-worker-001",
      componentKey: "core/modules/task-control",
      scopeAllowlist: ["core/modules/task-control"],
      protectedInputs: ["core/contracts"],
      assignedAgent: worker,
      state: new Map(),
      tracer,
      budgetRemaining: { units: 20, wallClockSeconds: 300 },
    };

    const input: TaskImplementationInput = {
      taskDescription: "Add budget overflow unit test",
      targetFiles: ["core/modules/task-control/budget.ts"],
      verificationChecks: [
        {
          name: "test-budget-logic",
          run: async () => ({ passed: true, output: "5/5 tests passed" }),
        },
      ],
    };

    const result = await runner.runComposition(
      implementingTasksMasterSkill,
      context,
      "component-task",
      input
    );

    expect(result.status).toBe("completed");
    expect(result.executedSteps.length).toBe(4);
    expect(result.data?.testsPassed).toBe(1);
    expect(result.evidence.length).toBeGreaterThan(0);
    expect(result.totalSpend.units).toBeGreaterThan(0);
    expect(result.traces.some((t) => t.type === "composition_complete")).toBe(true);
  });

  it("fails the composition when deterministic verification checks fail", async () => {
    const worker = contracts.get("worker")!;
    const tracer = new ExecutionTracer(["core/modules/task-control"], ["core/contracts"]);

    const context: SkillExecutionContext = {
      taskRevision: "task-worker-002",
      componentKey: "core/modules/task-control",
      scopeAllowlist: ["core/modules/task-control"],
      protectedInputs: ["core/contracts"],
      assignedAgent: worker,
      state: new Map(),
      tracer,
      budgetRemaining: { units: 20, wallClockSeconds: 300 },
    };

    const input: TaskImplementationInput = {
      taskDescription: "Refactor budget module",
      targetFiles: ["core/modules/task-control/budget.ts"],
      verificationChecks: [
        {
          name: "failing-test-suite",
          run: async () => ({ passed: false, output: "Assertion failed: expected 10 got 0" }),
        },
      ],
    };

    const result = await runner.runComposition(
      implementingTasksMasterSkill,
      context,
      "component-task",
      input
    );

    expect(result.status).toBe("failed");
    expect(result.executedSteps).toContain("scope-verification");
    expect(result.executedSteps).toContain("apply-bounded-edits");
    expect(result.executedSteps).not.toContain("record-evidence"); // Aborted before recording final evidence
    expect(result.error).toContain("failing-test-suite");
    expect(result.traces.some((t) => t.type === "composition_failed")).toBe(true);
  });

  it("blocks execution when an agent lacks required tools for the composition", async () => {
    const planningAdviser = contracts.get("planning-adviser")!; // 0 tools
    const tracer = new ExecutionTracer(["core/modules/task-control"], ["core/contracts"]);

    const context: SkillExecutionContext = {
      taskRevision: "task-adviser-001",
      componentKey: "core/modules/task-control",
      scopeAllowlist: ["core/modules/task-control"],
      protectedInputs: ["core/contracts"],
      assignedAgent: planningAdviser,
      state: new Map(),
      tracer,
      budgetRemaining: { units: 20, wallClockSeconds: 300 },
    };

    const result = await runner.runComposition(
      implementingTasksMasterSkill,
      context,
      "component-task"
    );

    expect(result.status).toBe("blocked");
    expect(result.error).toContain("Agent 'planning-adviser' lacks required tools");
    expect(result.executedSteps.length).toBe(0);
    expect(result.traces.some((t) => t.type === "composition_failed")).toBe(true);
  });

  it("executes building-components master composition with full admission, reservation, child delegation, and closure", async () => {
    const implementer = contracts.get("implementer")!;
    const tracer = new ExecutionTracer(["root"], ["core/contracts"]);
    const resMgr = new ComponentReservationManager();

    const plan = createValidPlanEnvelope();
    const admCtx = createValidContext();

    const context: SkillExecutionContext = {
      taskRevision: "task-implementer-001",
      componentKey: "root",
      scopeAllowlist: ["root"],
      protectedInputs: ["core/contracts"],
      assignedAgent: implementer,
      state: new Map(),
      tracer,
      budgetRemaining: { units: 50, wallClockSeconds: 600 },
    };

    const input: ComponentBuildInput = {
      planEnvelope: plan,
      admissionContext: admCtx,
      reservationManager: resMgr,
    };

    const result = await runner.runComposition(
      buildingComponentsMasterSkill,
      context,
      "component-build-lifecycle",
      input
    );

    expect(result.status).toBe("completed");
    expect(result.executedSteps.length).toBe(3);
    expect(["eligible", "completed"]).toContain(result.data?.closureStatus);
    expect(result.data?.admitted).toBe(true);
    // Verify reservations were cleanly released upon completion
    expect(resMgr.listActiveReservations().length).toBe(0);
  });
});
