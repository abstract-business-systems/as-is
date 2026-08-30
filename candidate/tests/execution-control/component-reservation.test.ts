import { describe, it, expect } from "bun:test";
import {
  ComponentReservationManager,
  type Clock,
} from "../../execution-control/reservation";

class MockClock implements Clock {
  private currentTime: number;

  constructor(initialTime: number = 1000000) {
    this.currentTime = initialTime;
  }

  now(): number {
    return this.currentTime;
  }

  advance(ms: number) {
    this.currentTime += ms;
  }
}

describe("Candidate ComponentReservationManager", () => {
  it("atomically acquires multiple component keys in sorted order", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    const result = mgr.acquire({
      componentKeys: ["core/modules/task-control", "core/adapters/process"],
      ownerTaskId: "task-parent-rev1",
      planRevision: "plan-rev-1",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    expect(result.success).toBe(true);
    expect(result.acquiredReservations.length).toBe(2);
    expect(result.rolledBackKeys.length).toBe(0);

    const res1 = mgr.getReservation("core/adapters/process");
    expect(res1?.disposition).toBe("active");
    expect(res1?.acquiredAt).toBe(1000);
    expect(res1?.leaseExpiresAt).toBe(61000);

    const res2 = mgr.getReservation("core/modules/task-control");
    expect(res2?.disposition).toBe("active");
  });

  it("performs atomic rollback when any key in a batch is locked by another task", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    // First task acquires key B
    const r1 = mgr.acquire({
      componentKeys: ["comp-b"],
      ownerTaskId: "task-other",
      planRevision: "plan-other",
      attempt: 1,
      leaseDurationMs: 60000,
    });
    expect(r1.success).toBe(true);

    // Second task attempts to acquire key A, key B, and key C in one batch
    const r2 = mgr.acquire({
      componentKeys: ["comp-a", "comp-b", "comp-c"],
      ownerTaskId: "task-my-batch",
      planRevision: "plan-my-batch",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    expect(r2.success).toBe(false);
    expect(r2.failedKey).toBe("comp-b");
    expect(r2.acquiredReservations.length).toBe(0);
    // comp-a should have been acquired and then rolled back
    expect(r2.rolledBackKeys).toContain("comp-a");

    // Verify comp-a is free again and comp-b is still held by task-other
    expect(mgr.getReservation("comp-a")).toBeUndefined();
    expect(mgr.getReservation("comp-b")?.ownerTaskId).toBe("task-other");
    expect(mgr.getReservation("comp-c")).toBeUndefined();
  });

  it("supports re-entrant acquisition by the same task, planRevision, and attempt", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    const r1 = mgr.acquire({
      componentKeys: ["comp-a"],
      ownerTaskId: "task-1",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 60000,
    });
    expect(r1.success).toBe(true);

    const r2 = mgr.acquire({
      componentKeys: ["comp-a"],
      ownerTaskId: "task-1",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 60000,
    });
    expect(r2.success).toBe(true);
    expect(r2.acquiredReservations.length).toBe(1);
  });

  it("releases active reservations cleanly", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    mgr.acquire({
      componentKeys: ["comp-a", "comp-b"],
      ownerTaskId: "task-1",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    const releaseResult = mgr.release(["comp-a"], "task-1");
    expect(releaseResult.releasedKeys).toEqual(["comp-a"]);
    expect(mgr.getReservation("comp-a")).toBeUndefined();
    expect(mgr.getReservation("comp-b")?.disposition).toBe("active");
  });

  it("reclaims stale expired reservations with audit reason", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    mgr.acquire({
      componentKeys: ["comp-a"],
      ownerTaskId: "task-dead",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 5000, // expires at 6000
    });

    // Advance clock past expiration
    clock.advance(10000); // now at 11000

    const reclaim = mgr.reclaimStale({
      componentKey: "comp-a",
      reason: "Worker process crash detected and heartbeat timed out",
      isOwnerDead: true,
    });

    expect(reclaim.reclaimed).toBe(true);
    expect(reclaim.previousReservation?.ownerTaskId).toBe("task-dead");
    expect(reclaim.previousReservation?.disposition).toBe("active");
    expect(mgr.getReservation("comp-a")).toBeUndefined();
  });

  it("refuses to steal active lease if owner is not verified dead", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    mgr.acquire({
      componentKeys: ["comp-a"],
      ownerTaskId: "task-live",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 60000,
    });

    const reclaim = mgr.reclaimStale({
      componentKey: "comp-a",
      reason: "Attempting pre-emptive takeover",
      isOwnerDead: false,
    });

    expect(reclaim.reclaimed).toBe(false);
    expect(reclaim.reason).toContain("Cannot reclaim");
    expect(mgr.getReservation("comp-a")?.ownerTaskId).toBe("task-live");
  });

  it("sweeps orphans when leases expire", () => {
    const clock = new MockClock(1000);
    const mgr = new ComponentReservationManager(clock);

    mgr.acquire({
      componentKeys: ["comp-1", "comp-2"],
      ownerTaskId: "task-temp",
      planRevision: "plan-1",
      attempt: 1,
      leaseDurationMs: 5000,
    });

    clock.advance(6000);

    const swept = mgr.sweepOrphans();
    expect(swept.length).toBe(2);
    expect(swept[0].disposition).toBe("orphan");
    expect(mgr.listActiveReservations().length).toBe(0);
  });
});
