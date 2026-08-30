/**
 * Candidate Benchmark Suite & Baseline Comparator
 *
 * Measures performance, isolation, safety, and throughput metrics of the
 * candidate execution-control kernel and composable skills engine.
 */

import {
  PlanAdmissionEngine,
  ComponentReservationManager,
  ParentClosureEvaluator,
  type PlanEnvelope,
  type AdmissionContext,
  type ChildTerminalResult,
} from "../execution-control";
import {
  SkillRegistry,
  CompositionRunner,
  ExecutionTracer,
  implementingTasksMasterSkill,
  type SkillExecutionContext,
  type TaskImplementationInput,
} from "../skills";
import type { AgentContract } from "../agents";
import {
  createValidPlanEnvelope,
  createValidContext,
  createValidChildEntry,
} from "../fixtures/plan-builder";

export interface BenchmarkMetrics {
  admissionThroughputOpsPerSec: number;
  reservationContentionResolutionRate: number; // 1.0 = 100% atomic rollback, 0 deadlocks
  securityViolationCatchRate: number; // 1.0 = 100% caught
  failClosedClosureAccuracy: number; // 1.0 = 100% correct
  skillExecutionLatencyMs: number;
  totalPlansEvaluated: number;
  totalReservationsAttempted: number;
  totalViolationsTested: number;
  memoryUsageMb: number;
}

export class CandidateBenchmarkRunner {
  private readonly reservationManager = new ComponentReservationManager();
  private readonly admissionEngine: PlanAdmissionEngine;
  private readonly closureEvaluator = new ParentClosureEvaluator();
  private readonly registry = new SkillRegistry();
  private readonly runner: CompositionRunner;

  constructor() {
    this.admissionEngine = new PlanAdmissionEngine(this.reservationManager);
    this.registry.registerMaster(implementingTasksMasterSkill);
    this.runner = new CompositionRunner(this.registry);
  }

  async runFullBenchmark(mockWorker: AgentContract): Promise<BenchmarkMetrics> {
    const memBefore = process.memoryUsage().heapUsed;

    // 1. Admission & Preflight Throughput Benchmark (1,000 plan evaluations)
    const ADMISSION_ITERATIONS = 1000;
    const plan = createValidPlanEnvelope();
    const admContext = createValidContext();

    const startAdm = performance.now();
    for (let i = 0; i < ADMISSION_ITERATIONS; i++) {
      // Create lightweight admission engine with isolated reservation mgr
      const isolatedResMgr = new ComponentReservationManager();
      const engine = new PlanAdmissionEngine(isolatedResMgr);
      const result = engine.evaluate(plan, admContext);
      if (result.status !== "admitted") {
        throw new Error(`Benchmark admission unexpectedly failed on iteration ${i}`);
      }
    }
    const endAdm = performance.now();
    const admDurationSec = (endAdm - startAdm) / 1000;
    const admissionThroughputOpsPerSec = Math.round(ADMISSION_ITERATIONS / admDurationSec);

    // 2. Contention & Deadlock Safety Benchmark (500 colliding multi-component batches)
    const CONTENTION_PAIRS = 500;
    let successfulRollbacks = 0;
    const contentionResMgr = new ComponentReservationManager();

    // Pre-lock component 'core/modules/task-control'
    contentionResMgr.acquire({
      componentKeys: ["core/modules/task-control"],
      ownerTaskId: "task-holder-001",
      planRevision: "plan-holder",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    for (let i = 0; i < CONTENTION_PAIRS; i++) {
      // Attempt to acquire batch containing the locked key plus 2 new keys
      const batch = ["core/adapters/process", "core/modules/task-control", `core/extra/comp-${i}`];
      const outcome = contentionResMgr.acquire({
        componentKeys: batch,
        ownerTaskId: `task-contender-${i}`,
        planRevision: `plan-contender-${i}`,
        attempt: 1,
        leaseDurationMs: 60000,
      });

      if (!outcome.success) {
        // Verify atomic rollback: none of the other keys in the batch should be locked
        const processLocked = contentionResMgr.isLocked("core/adapters/process");
        const extraLocked = contentionResMgr.isLocked(`core/extra/comp-${i}`);
        if (!processLocked && !extraLocked) {
          successfulRollbacks++;
        }
      }
    }
    const reservationContentionResolutionRate = successfulRollbacks / CONTENTION_PAIRS;

    // 3. Security & Scope Boundary Violation Catch Rate (100 violation attempts)
    let caughtViolations = 0;
    const VIOLATION_CHECKS = 100;
    const tracer = new ExecutionTracer(
      ["core/modules/task-control"],
      ["core/contracts/**", "AGENTS.md"]
    );

    for (let i = 0; i < VIOLATION_CHECKS; i++) {
      let threw = false;
      try {
        if (i % 2 === 0) {
          // Protected input mutation attempt
          tracer.assertPathPermitted("core/contracts/component-task-record-protocol.md", true);
        } else {
          // Scope allowlist breach mutation attempt
          tracer.assertPathPermitted(`core/unauthorized-dir/file-${i}.ts`, true);
        }
      } catch {
        threw = true;
      }
      if (threw) {
        caughtViolations++;
      }
    }
    const securityViolationCatchRate = caughtViolations / VIOLATION_CHECKS;

    // 4. Fail-Closed Parent Closure Accuracy (100 scenarios with various defects)
    let correctClosureDecisions = 0;
    const CLOSURE_SCENARIOS = 100;

    for (let i = 0; i < CLOSURE_SCENARIOS; i++) {
      const isClean = i === 0;
      const childResults: ChildTerminalResult[] = [
        {
          childId: "child-task-control",
          componentKey: "core/modules/task-control",
          taskStatus: isClean ? "completed" : "failed",
          validationEvidence: { passed: isClean, testsPassed: isClean ? 5 : 0, details: [] },
          integrationEvidence: {
            appliedBase: "git-commit-base-001",
            mergedCommit: "commit-tc",
            cleanScope: true,
            protectedInputsUnmodified: isClean,
            verified: true,
            details: [],
          },
          recordedSpend: { unitsUsed: 5, wallClockSeconds: 30 },
        },
        {
          childId: "child-process-adapter",
          componentKey: "core/adapters/process",
          taskStatus: "completed",
          validationEvidence: { passed: true, testsPassed: 5, details: [] },
          integrationEvidence: {
            appliedBase: "git-commit-base-001",
            mergedCommit: "commit-proc",
            cleanScope: true,
            protectedInputsUnmodified: isClean,
            verified: true,
            details: [],
          },
          recordedSpend: { unitsUsed: 5, wallClockSeconds: 30 },
        },
      ];

      const outcome = this.closureEvaluator.evaluate(plan, childResults);
      if (isClean && (outcome.status === "eligible" || outcome.status === "completed")) {
        correctClosureDecisions++;
      } else if (!isClean && (outcome.status === "failed" || outcome.status === "ineligible" || outcome.status === "cancelled")) {
        correctClosureDecisions++;
      }
    }
    const failClosedClosureAccuracy = correctClosureDecisions / CLOSURE_SCENARIOS;

    // 5. Skill Composition Execution Latency
    const skillContext: SkillExecutionContext = {
      taskRevision: "bench-task-001",
      componentKey: "core/modules/task-control",
      scopeAllowlist: ["core/modules/task-control"],
      protectedInputs: ["core/contracts"],
      assignedAgent: mockWorker,
      state: new Map(),
      tracer: new ExecutionTracer(["core/modules/task-control"], ["core/contracts"]),
      budgetRemaining: { units: 20, wallClockSeconds: 300 },
    };

    const taskInput: TaskImplementationInput = {
      taskDescription: "Benchmark task execution",
      targetFiles: ["core/modules/task-control/impl.ts"],
      verificationChecks: [
        { name: "quick-check", run: async () => ({ passed: true, output: "ok" }) },
      ],
    };

    const startSkill = performance.now();
    await this.runner.runComposition(
      implementingTasksMasterSkill,
      skillContext,
      "component-task",
      taskInput
    );
    const endSkill = performance.now();
    const skillExecutionLatencyMs = Math.round((endSkill - startSkill) * 100) / 100;

    const memAfter = process.memoryUsage().heapUsed;
    const memoryUsageMb = Math.round(((memAfter - memBefore) / (1024 * 1024)) * 100) / 100;

    return {
      admissionThroughputOpsPerSec,
      reservationContentionResolutionRate,
      securityViolationCatchRate,
      failClosedClosureAccuracy,
      skillExecutionLatencyMs,
      totalPlansEvaluated: ADMISSION_ITERATIONS,
      totalReservationsAttempted: CONTENTION_PAIRS,
      totalViolationsTested: VIOLATION_CHECKS,
      memoryUsageMb: Math.max(0, memoryUsageMb),
    };
  }
}
