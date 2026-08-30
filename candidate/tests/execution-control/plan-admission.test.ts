import { describe, it, expect } from "bun:test";
import {
  PlanAdmissionEngine,
  ACCEPTED_TARGET_DESIGN_SHA256,
  timingSafeEqual,
  canonicalizeJson,
  computeCanonicalSha256,
} from "../../execution-control/admission";
import { ComponentReservationManager } from "../../execution-control/reservation";
import {
  createValidPlanEnvelope,
  createValidContext,
  createValidChildEntry,
} from "../../fixtures/plan-builder";

describe("Candidate PlanAdmissionEngine", () => {
  it("admits a valid plan envelope and acquires atomic reservations with fencing tokens", () => {
    const resMgr = new ComponentReservationManager();
    const engine = new PlanAdmissionEngine(resMgr);

    const plan = createValidPlanEnvelope();
    const context = createValidContext();

    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("admitted");
    expect(result.violations.length).toBe(0);
    expect(result.missingFacts.length).toBe(0);
    expect(result.reservations.length).toBe(2);
    expect(result.reservations[0].fencingToken).toBeDefined();
    expect(result.reservations[0].leaseGeneration).toBeGreaterThan(0);
    expect(result.checkedComponentKeys).toContain("core/modules/task-control");
    expect(result.checkedComponentKeys).toContain("core/adapters/process");
    expect(result.budgetReservation.valid).toBe(true);
    expect(result.budgetReservation.remainingParentReserve).toBe(26); // 50 - (10+2 + 10+2)
  });

  it("revalidates an admitted plan at dequeue time and detects expired or stolen leases", () => {
    const resMgr = new ComponentReservationManager();
    const engine = new PlanAdmissionEngine(resMgr);

    const plan = createValidPlanEnvelope();
    const context = createValidContext();

    const admission = engine.evaluate(plan, context);
    expect(admission.status).toBe("admitted");

    // Fresh dequeue revalidation passes
    const reval = engine.revalidateAdmission(admission, context);
    expect(reval.valid).toBe(true);

    // If a lease was released / stolen, revalidation fails
    resMgr.release(["core/modules/task-control"], plan.parent.taskRevision);
    const staleReval = engine.revalidateAdmission(admission, context);
    expect(staleReval.valid).toBe(false);
    expect(staleReval.staleReasons.some((r) => r.includes("no longer valid"))).toBe(true);
  });

  it("verifies RFC 8785 JSON canonicalization and constant-time string equality", () => {
    expect(timingSafeEqual("abc4d367d6e7", "abc4d367d6e7")).toBe(true);
    expect(timingSafeEqual("abc4d367d6e7", "abc4d367d6e8")).toBe(false);
    expect(timingSafeEqual("short", "longer-string")).toBe(false);

    const objA = { b: 2, a: 1 };
    const objB = { a: 1, b: 2 };
    expect(canonicalizeJson(objA)).toBe('{"a":1,"b":2}');
    expect(canonicalizeJson(objB)).toBe('{"a":1,"b":2}');
    expect(computeCanonicalSha256(objA)).toBe(computeCanonicalSha256(objB));
  });

  it("rejects a plan with mismatched target design SHA256", () => {
    const engine = new PlanAdmissionEngine();
    const plan = createValidPlanEnvelope({
      acceptedEnvelope: {
        targetDesignSha256: "unaccepted-invalid-sha",
        targetPacketDigest: "some-digest",
      },
    });
    const context = createValidContext();

    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Target design SHA256 mismatch"))).toBe(true);
  });

  it("rejects a plan with invalid budget arithmetic (fractional, negative, or NaN units)", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-1", "comp-1", {
      budget: {
        allocatedUnits: -5 as any,
        maxWallClockSeconds: 30,
        reserveUnits: 0,
      },
    });

    const plan = createValidPlanEnvelope({
      children: [child1],
      dependencyGraph: {
        nodes: ["child-1"],
        edges: [],
        independenceClassification: { "child-1": "independent" },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Budget overflow or arithmetic invalidity"))).toBe(true);
  });

  it("rejects a plan with circular dependency cycles", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-a", "comp-a");
    const child2 = createValidChildEntry("child-b", "comp-b");
    const child3 = createValidChildEntry("child-c", "comp-c");

    const plan = createValidPlanEnvelope({
      children: [child1, child2, child3],
      dependencyGraph: {
        nodes: ["child-a", "child-b", "child-c"],
        edges: [
          { from: "child-a", to: "child-b" },
          { from: "child-b", to: "child-c" },
          { from: "child-c", to: "child-a" }, // Cycle: A -> B -> C -> A
        ],
        independenceClassification: {
          "child-a": "dependent",
          "child-b": "dependent",
          "child-c": "dependent",
        },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("circular dependency detected"))).toBe(true);
  });

  it("rejects independent children targeting the same component key", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-a1", "comp-shared");
    const child2 = createValidChildEntry("child-a2", "comp-shared");

    const plan = createValidPlanEnvelope({
      children: [child1, child2],
      dependencyGraph: {
        nodes: ["child-a1", "child-a2"],
        edges: [],
        independenceClassification: {
          "child-a1": "independent",
          "child-a2": "independent",
        },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Same-component concurrency conflict"))).toBe(true);
  });

  it("rejects independent children with overlapping scope allowlists", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-1", "comp-1", {
      scopeAllowlist: ["src/shared/utils.ts", "src/comp-1/**"],
    });
    const child2 = createValidChildEntry("child-2", "comp-2", {
      scopeAllowlist: ["src/shared/utils.ts", "src/comp-2/**"],
    });

    const plan = createValidPlanEnvelope({
      children: [child1, child2],
      dependencyGraph: {
        nodes: ["child-1", "child-2"],
        edges: [],
        independenceClassification: {
          "child-1": "independent",
          "child-2": "independent",
        },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Scope allowlist collision"))).toBe(true);
  });

  it("rejects a plan whose total child budget exceeds parent allocation", () => {
    const engine = new PlanAdmissionEngine();
    const plan = createValidPlanEnvelope();
    // Parent only has 10 units, but children require (10+2) + (10+2) = 24 units
    const context = createValidContext({ parentAvailableUnits: 10 });

    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.budgetReservation.valid).toBe(false);
    expect(result.violations.some((v) => v.includes("Budget overflow"))).toBe(true);
  });

  it("rejects a child whose scope allowlist includes protected inputs", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-1", "comp-1", {
      scopeAllowlist: ["core/contracts/index.md", "comp-1/**"],
      protectedInputs: ["core/contracts/**"],
    });

    const plan = createValidPlanEnvelope({
      children: [child1],
      dependencyGraph: {
        nodes: ["child-1"],
        edges: [],
        independenceClassification: { "child-1": "independent" },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("improperly includes protected input"))).toBe(true);
  });

  it("rejects an unknown worker role", () => {
    const engine = new PlanAdmissionEngine();
    const child1 = createValidChildEntry("child-1", "comp-1", {
      worker: {
        role: "unauthorized-rogue-agent",
        model: "some-model",
        capabilities: ["read"],
      },
    });

    const plan = createValidPlanEnvelope({
      children: [child1],
      dependencyGraph: {
        nodes: ["child-1"],
        edges: [],
        independenceClassification: { "child-1": "independent" },
      },
    });

    const context = createValidContext();
    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Unrecognized worker role"))).toBe(true);
  });

  it("rejects a plan with stale parent base or record revisions", () => {
    const engine = new PlanAdmissionEngine();
    const plan = createValidPlanEnvelope({
      freshness: {
        parentRecordRevision: "rev-1",
        childRecordRevisions: {
          "core/modules/task-control": "old-stale-rev-9",
        },
        expectedParentBase: "git-commit-base-001",
      },
    });

    const context = createValidContext({
      currentRecordRevisions: {
        "core/modules/task-control": "new-live-rev-10",
      },
    });

    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("Stale plan freshness"))).toBe(true);
  });

  it("rejects admission when component reservation is actively locked by another task", () => {
    const resMgr = new ComponentReservationManager();
    // Pre-lock core/adapters/process by another active task
    resMgr.acquire({
      componentKeys: ["core/adapters/process"],
      ownerTaskId: "other-task-running",
      planRevision: "other-plan",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    const engine = new PlanAdmissionEngine(resMgr);
    const plan = createValidPlanEnvelope();
    const context = createValidContext();

    const result = engine.evaluate(plan, context);

    expect(result.status).toBe("rejected");
    expect(result.violations.some((v) => v.includes("is actively locked by task 'other-task-running'"))).toBe(true);
    // Ensure task-control reservation was rolled back and is not left locked
    expect(resMgr.getReservation("core/modules/task-control")).toBeUndefined();
  });
});
