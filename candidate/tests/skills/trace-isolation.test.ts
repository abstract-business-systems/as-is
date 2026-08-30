import { describe, it, expect } from "bun:test";
import {
  ExecutionTracer,
  SecurityViolationError,
  ScopeViolationError,
} from "../../skills/trace";

describe("Candidate ExecutionTracer and Isolation Enforcement", () => {
  const scopeAllowlist = ["core/modules/task-control", "candidate/tests/execution-control"];
  const protectedInputs = ["core/contracts", "designs/agentic-development-system-implementation-plan.md"];

  it("records chronological trace events with proper metadata", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    tracer.record({
      type: "composition_start",
      compositionName: "building-components",
      role: "implementer",
      details: { taskRevision: "rev-1" },
    });

    tracer.record({
      type: "step_start",
      stepId: "step-1",
      details: { name: "Verify Scope" },
    });

    const events = tracer.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].type).toBe("composition_start");
    expect(events[0].compositionName).toBe("building-components");
    expect(events[0].timestamp).toBeGreaterThan(0);
    expect(events[1].type).toBe("step_start");
    expect(events[1].stepId).toBe("step-1");
  });

  it("allows mutation on paths within the admitted scope allowlist", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    expect(() => {
      tracer.assertPathPermitted("core/modules/task-control/budget.ts", true);
      tracer.assertPathPermitted("candidate/tests/execution-control/test.ts", true);
    }).not.toThrow();
  });

  it("throws SecurityViolationError when attempting mutation on protected inputs", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    expect(() => {
      tracer.assertPathPermitted("core/contracts/component-task-record-protocol.md", true);
    }).toThrow(SecurityViolationError);

    const events = tracer.getEvents();
    expect(events.some((e) => e.type === "protected_input_access")).toBe(true);
  });

  it("throws ScopeViolationError when attempting mutation outside scope allowlist", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    expect(() => {
      tracer.assertPathPermitted("core/adapters/process/supervisor.ts", true);
    }).toThrow(ScopeViolationError);

    const events = tracer.getEvents();
    expect(events.some((e) => e.type === "scope_violation")).toBe(true);
  });

  it("permits read access without mutating restrictions on allowed areas", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    expect(() => {
      tracer.assertPathPermitted("core/contracts/index.md", false);
      tracer.assertPathPermitted("as-is.md", false);
    }).not.toThrow();
  });

  it("tracks and accumulates spend metrics across execution steps", () => {
    const tracer = new ExecutionTracer(scopeAllowlist, protectedInputs);

    tracer.recordSpend({ units: 3, wallClockSeconds: 15 });
    tracer.recordSpend({ units: 5, wallClockSeconds: 35 });

    const totalSpend = tracer.getAggregateSpend();
    expect(totalSpend.units).toBe(8);
    expect(totalSpend.wallClockSeconds).toBe(50);

    const events = tracer.getEvents();
    const spendEvents = events.filter((e) => e.type === "spend_recorded");
    expect(spendEvents.length).toBe(2);
  });
});
