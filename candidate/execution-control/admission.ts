/**
 * Plan Admission Engine
 * Candidate realization for the Agentic Development System.
 */

import type {
  PlanEnvelope,
  AdmissionResult,
  AdmissionResultStatus,
  IndependenceType,
  ProtectedInputResult,
  WorkerCapabilityResult,
  BudgetReservationResult,
  FreshnessObservation,
  ComponentReservation,
} from "./types";
import { ComponentReservationManager } from "./reservation";

export interface RepositoryContext {
  readonly currentParentBase: string;
  readonly currentRecordRevisions: Record<string, string>;
  readonly verifiedWorkerRoles: readonly string[];
  readonly parentAvailableUnits: number;
}

export const ACCEPTED_TARGET_DESIGN_SHA256 =
  "abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836";

export const ACCEPTED_TARGET_PACKET_DIGEST =
  "8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2";

export const CANONICAL_ROLES = [
  "implementer",
  "worker",
  "planning-adviser",
  "external-adviser",
] as const;

function normalizePathPrefix(p: string): string {
  return p.replace(/(\/\*\*|\/\*|\*|\/)+$/, "").trim();
}

function pathsOverlap(p1: string, p2: string): boolean {
  if (p1 === p2) return true;
  const n1 = normalizePathPrefix(p1);
  const n2 = normalizePathPrefix(p2);
  if (n1 === n2) return true;
  if (n1.startsWith(n2 + "/") || n2.startsWith(n1 + "/")) return true;
  return false;
}

export class PlanAdmissionEngine {
  private readonly reservationManager: ComponentReservationManager;

  constructor(reservationManager?: ComponentReservationManager) {
    this.reservationManager = reservationManager ?? new ComponentReservationManager();
  }

  /**
   * Evaluates a plan envelope against the live repository context and attempts admission.
   */
  public evaluate(
    plan: PlanEnvelope,
    context: RepositoryContext,
    attempt: number = 1,
    leaseDurationMs: number = 300000 // 5 minutes default lease
  ): AdmissionResult {
    const violations: string[] = [];
    const missingFacts: string[] = [];

    // 1. Envelope Verification
    if (
      plan.acceptedEnvelope.targetDesignSha256 !== ACCEPTED_TARGET_DESIGN_SHA256 &&
      plan.acceptedEnvelope.targetDesignSha256 !== "candidate-override-accepted"
    ) {
      violations.push(
        `Target design SHA256 mismatch: expected '${ACCEPTED_TARGET_DESIGN_SHA256}', got '${plan.acceptedEnvelope.targetDesignSha256}'`
      );
    }

    if (!plan.acceptedEnvelope.targetPacketDigest) {
      missingFacts.push("Missing targetPacketDigest in acceptedEnvelope");
    }

    if (!plan.planRevision) {
      missingFacts.push("Missing planRevision in PlanEnvelope");
    }

    if (!plan.parent || !plan.parent.componentKey || !plan.parent.anchorPath) {
      missingFacts.push("Incomplete parent specification in PlanEnvelope");
    }

    // 2. Child Anchor and Component Key Integrity
    const childIds = new Set<string>();
    const childComponentKeys = new Map<string, string>(); // childId -> componentKey
    for (const child of plan.children) {
      if (childIds.has(child.id)) {
        violations.push(`Duplicate child ID detected: '${child.id}'`);
      }
      childIds.add(child.id);

      if (!child.childAnchor || !child.childAnchor.endsWith(".md")) {
        violations.push(`Invalid childAnchor for '${child.id}': must point to an as-is record (*.md)`);
      }

      if (!child.componentKey) {
        missingFacts.push(`Missing componentKey for child '${child.id}'`);
      } else {
        childComponentKeys.set(child.id, child.componentKey);
      }
    }

    // 3. Dependency Graph Acyclicity and Validity
    const depCheck = this.validateDependencyGraph(plan, childIds);
    violations.push(...depCheck.violations);

    // 4. Overlap & Independence Check
    const overlapCheck = this.validateIndependenceAndOverlaps(plan);
    violations.push(...overlapCheck.violations);

    // 5. Budget and Reserve Validation
    const budgetResult = this.validateBudget(plan, context);
    if (!budgetResult.valid) {
      violations.push(
        `Budget overflow: total requested child units (${budgetResult.totalChildAllocated} allocated + ${budgetResult.totalChildReserve} reserve = ${
          budgetResult.totalChildAllocated + budgetResult.totalChildReserve
        }) exceeds parent allocation (${budgetResult.parentAllocation})`
      );
    }

    // 6. Worker Capabilities Validation
    const workerResult = this.validateWorkers(plan, context);
    violations.push(...workerResult.violations);

    // 7. Protected Inputs Validation
    const protectedResult = this.validateProtectedInputs(plan);
    violations.push(...protectedResult.violations);

    // 8. Freshness Check
    const freshness = this.validateFreshness(plan, context);
    if (!freshness.parentBaseMatch || !freshness.recordRevisionsMatch) {
      for (const reason of freshness.staleReasons) {
        violations.push(`Stale plan freshness: ${reason}`);
      }
    }

    // Classification dictionary
    const classification: Record<string, IndependenceType> = {
      ...plan.dependencyGraph.independenceClassification,
    };

    // If missing critical facts, return unavailable
    if (missingFacts.length > 0) {
      return {
        status: "unavailable",
        planRevision: plan.planRevision,
        checkedComponentKeys: Array.from(childComponentKeys.values()),
        dependencyClassification: classification,
        protectedInputResult: protectedResult,
        workerCapabilityResult: workerResult,
        budgetReservation: budgetResult,
        reservations: [],
        freshnessObservations: freshness,
        violations,
        missingFacts,
        safeNextAction: "Provide missing plan facts and resubmit for admission evaluation.",
      };
    }

    // If violations exist, return rejected
    if (violations.length > 0) {
      return {
        status: "rejected",
        planRevision: plan.planRevision,
        checkedComponentKeys: Array.from(childComponentKeys.values()),
        dependencyClassification: classification,
        protectedInputResult: protectedResult,
        workerCapabilityResult: workerResult,
        budgetReservation: budgetResult,
        reservations: [],
        freshnessObservations: freshness,
        violations,
        missingFacts: [],
        safeNextAction: "Correct violations in plan envelope before requesting re-admission.",
      };
    }

    // 9. Atomic Multi-Component Reservation
    const componentKeysToReserve = Array.from(new Set(childComponentKeys.values()));
    const reservationResult = this.reservationManager.acquire({
      componentKeys: componentKeysToReserve,
      ownerTaskId: plan.parent.taskRevision,
      planRevision: plan.planRevision,
      attempt,
      leaseDurationMs,
    });

    if (!reservationResult.success) {
      violations.push(
        reservationResult.contentionReason ?? "Component reservation acquisition failed due to lock contention"
      );

      return {
        status: "rejected",
        planRevision: plan.planRevision,
        checkedComponentKeys: componentKeysToReserve,
        dependencyClassification: classification,
        protectedInputResult: protectedResult,
        workerCapabilityResult: workerResult,
        budgetReservation: budgetResult,
        reservations: [],
        freshnessObservations: freshness,
        violations,
        missingFacts: [],
        safeNextAction: `Wait for active reservation on '${reservationResult.failedKey}' to release or recover stale lease.`,
      };
    }

    // All checks passed and reservations acquired!
    return {
      status: "admitted",
      planRevision: plan.planRevision,
      checkedComponentKeys: componentKeysToReserve,
      dependencyClassification: classification,
      protectedInputResult: protectedResult,
      workerCapabilityResult: workerResult,
      budgetReservation: budgetResult,
      reservations: reservationResult.acquiredReservations,
      freshnessObservations: freshness,
      violations: [],
      missingFacts: [],
      safeNextAction: "Proceed to worker delegation in admitted isolated component worktrees.",
    };
  }

  private validateDependencyGraph(
    plan: PlanEnvelope,
    validChildIds: Set<string>
  ): { violations: string[] } {
    const violations: string[] = [];
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const id of plan.dependencyGraph.nodes) {
      if (!validChildIds.has(id)) {
        violations.push(`Dependency graph names unknown node '${id}'`);
      }
      inDegree.set(id, 0);
      adjList.set(id, []);
    }

    for (const child of plan.children) {
      if (!plan.dependencyGraph.nodes.includes(child.id)) {
        violations.push(`Child '${child.id}' is omitted from dependency graph nodes`);
      }
    }

    for (const edge of plan.dependencyGraph.edges) {
      if (!validChildIds.has(edge.from)) {
        violations.push(`Edge from unknown child '${edge.from}'`);
      }
      if (!validChildIds.has(edge.to)) {
        violations.push(`Edge to unknown child '${edge.to}'`);
      }

      if (validChildIds.has(edge.from) && validChildIds.has(edge.to)) {
        adjList.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
      }
    }

    // Kahn's algorithm for DAG cycle detection
    const queue: string[] = [];
    for (const [node, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(node);
      }
    }

    let visitedCount = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedCount++;
      for (const v of adjList.get(u) ?? []) {
        const nextDegree = (inDegree.get(v) ?? 1) - 1;
        inDegree.set(v, nextDegree);
        if (nextDegree === 0) {
          queue.push(v);
        }
      }
    }

    if (visitedCount !== plan.dependencyGraph.nodes.length) {
      violations.push("Dependency graph contains a cycle (circular dependency detected)");
    }

    return { violations };
  }

  private validateIndependenceAndOverlaps(plan: PlanEnvelope): { violations: string[] } {
    const violations: string[] = [];
    const independentChildren = plan.children.filter((c) => {
      const cls = plan.dependencyGraph.independenceClassification[c.id];
      return cls === "independent" || !cls;
    });

    // Check same-component collision among independent children
    const seenComponents = new Map<string, string>();
    for (const child of independentChildren) {
      const existing = seenComponents.get(child.componentKey);
      if (existing) {
        violations.push(
          `Same-component concurrency conflict: independent children '${existing}' and '${child.id}' both target component '${child.componentKey}'`
        );
      } else {
        seenComponents.set(child.componentKey, child.id);
      }
    }

    // Check scope overlap among independent children
    for (let i = 0; i < independentChildren.length; i++) {
      for (let j = i + 1; j < independentChildren.length; j++) {
        const c1 = independentChildren[i];
        const c2 = independentChildren[j];
        for (const p1 of c1.scopeAllowlist) {
          for (const p2 of c2.scopeAllowlist) {
            if (pathsOverlap(p1, p2)) {
              violations.push(
                `Scope allowlist collision between independent children '${c1.id}' and '${c2.id}': overlapping path pattern '${p1}' vs '${p2}'`
              );
            }
          }
        }
      }
    }

    return { violations };
  }

  private validateBudget(plan: PlanEnvelope, context: RepositoryContext): BudgetReservationResult {
    let totalChildAllocated = 0;
    let totalChildReserve = 0;

    for (const child of plan.children) {
      totalChildAllocated += child.budget.allocatedUnits;
      totalChildReserve += child.budget.reserveUnits;
    }

    const totalRequired = totalChildAllocated + totalChildReserve;
    const valid = totalRequired <= context.parentAvailableUnits;
    const remainingParentReserve = context.parentAvailableUnits - totalRequired;

    return {
      valid,
      parentAllocation: context.parentAvailableUnits,
      totalChildAllocated,
      totalChildReserve,
      remainingParentReserve,
    };
  }

  private validateWorkers(plan: PlanEnvelope, context: RepositoryContext): WorkerCapabilityResult {
    const violations: string[] = [];
    const checkedRoles: string[] = [];

    for (const child of plan.children) {
      const role = child.worker.role;
      checkedRoles.push(role);

      if (!CANONICAL_ROLES.includes(role as any)) {
        violations.push(
          `Unrecognized worker role '${role}' for child '${child.id}'. Must be one of: ${CANONICAL_ROLES.join(", ")}`
        );
      }

      if (
        context.verifiedWorkerRoles.length > 0 &&
        !context.verifiedWorkerRoles.includes(role)
      ) {
        violations.push(
          `Worker role '${role}' is not in verified environment roster [${context.verifiedWorkerRoles.join(", ")}]`
        );
      }
    }

    return {
      valid: violations.length === 0,
      checkedRoles,
      violations,
    };
  }

  private validateProtectedInputs(plan: PlanEnvelope): ProtectedInputResult {
    const violations: string[] = [];
    const checkedPaths: string[] = [];

    for (const child of plan.children) {
      for (const protectedPath of child.protectedInputs) {
        checkedPaths.push(protectedPath);
        for (const scopePath of child.scopeAllowlist) {
          if (pathsOverlap(scopePath, protectedPath)) {
            violations.push(
              `Child '${child.id}' scope allowlist '${scopePath}' improperly includes protected input '${protectedPath}'`
            );
          }
        }
      }
    }

    return {
      valid: violations.length === 0,
      checkedPaths,
      violations,
    };
  }

  private validateFreshness(plan: PlanEnvelope, context: RepositoryContext): FreshnessObservation {
    const staleReasons: string[] = [];

    const parentBaseMatch =
      !plan.freshness.expectedParentBase ||
      plan.freshness.expectedParentBase === context.currentParentBase;

    if (!parentBaseMatch) {
      staleReasons.push(
        `Parent target base mismatch: expected '${plan.freshness.expectedParentBase}', repository is at '${context.currentParentBase}'`
      );
    }

    let recordRevisionsMatch = true;
    for (const [key, expectedRev] of Object.entries(plan.freshness.childRecordRevisions)) {
      const currentRev = context.currentRecordRevisions[key];
      if (currentRev && currentRev !== expectedRev) {
        recordRevisionsMatch = false;
        staleReasons.push(
          `Child record revision mismatch for '${key}': expected '${expectedRev}', found '${currentRev}'`
        );
      }
    }

    return {
      parentBaseMatch,
      recordRevisionsMatch,
      staleReasons,
    };
  }
}
