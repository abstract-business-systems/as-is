import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  classifyStale,
  cleanup,
  confirmCancellation,
  launch,
  noLeftover,
  observe,
  recordPermissionNeeded,
  readDurableRecord,
  recordHandoff,
  resumeAfterApproval,
  requestCancellation,
  scheduleRecovery,
  validateRoleChain,
  validateTaskEvent,
  type DurableRecordObservation,
  type JobHandle,
  type LaunchRequest,
  type RoleChain,
} from "./supervisor.ts";

const roleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "session-as-is", parentSessionId: null, source: "test" },
  orchestrator: { role: "orchestrator", sessionId: "session-orchestrator", parentSessionId: "session-as-is", source: "test" },
  implementer: { role: "implementer", sessionId: "session-implementer", parentSessionId: "session-orchestrator", source: "test" },
};

const sleep = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
const monotonicSeconds = () => Number(process.hrtime.bigint()) / 1_000_000_000;

function recordContents(status: "ready" | "active" = "ready", updated = new Date().toISOString()): string {
  return `---
as-is-version: 2
task:
  status: ${status}
  worker: implementer
  updated: ${updated}
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 10
      spent-seconds: 0
      reserve-seconds: 1
      source: unavailable
acceptance:
  - harmless deterministic supervisor fixture
---

# Fixture

## Progress

The fixture is controlled only by the focused supervisor test.
`;
}

interface Fixture {
  root: string;
  recordPath: string;
  projectRoot: string;
}

async function fixture(status: "ready" | "active" = "ready", updated?: string): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "as-is-supervisor-test-"));
  const recordPath = join(root, "as-is.md");
  await writeFile(recordPath, recordContents(status, updated), "utf8");
  return { root, recordPath, projectRoot: root };
}

function requestFor(fixtureData: Fixture, command: string[], overrides: Partial<LaunchRequest> = {}): LaunchRequest {
  return {
    component: "test-component",
    recordPath: fixtureData.recordPath,
    projectRoot: fixtureData.projectRoot,
    projectKey: "supervisor-test",
    runId: `run-${crypto.randomUUID()}`,
    roleChain,
    worker: { role: "implementer", command: [process.execPath, "-e", command] },
    capabilities: { userEventBubbling: true, source: "focused-local-control-plane" },
    budget: {
      costAllocation: 0.20,
      costReserve: 0.04,
      costSpent: 0,
      costSource: "test-input",
      wallClockAllocationSeconds: 10,
      wallClockReserveSeconds: 1,
      wallClockSpentSeconds: 0,
      wallClockSource: "test-input",
    },
    checkInSeconds: 0.2,
    maxRecoveryAttempts: 2,
    retryBackoffSeconds: 1,
    ...overrides,
  };
}

function recordOnlyHandle(fixtureData: Fixture, jobId = `permission-${crypto.randomUUID()}`): JobHandle {
  return {
    jobId,
    component: "test-component",
    recordPath: fixtureData.recordPath,
    runtimeDir: join(fixtureData.root, "private-runtime"),
    workspacePath: join(fixtureData.root, "private-runtime", "workspace"),
    statePath: join(fixtureData.root, "private-runtime", "state.json"),
    attempt: 1,
  };
}

async function eventually<T>(read: () => Promise<T>, matches: (value: T) => boolean, timeout = 6000): Promise<T> {
  const deadline = Date.now() + timeout;
  let value = await read();
  while (!matches(value) && Date.now() < deadline) {
    await sleep(25);
    value = await read();
  }
  if (!matches(value)) throw new Error(`condition not observed before ${timeout}ms: ${JSON.stringify(value)}`);
  return value;
}

async function cleanupFixture(fixtureData: Fixture, handles: JobHandle[]): Promise<void> {
  for (const handle of handles) {
    try {
      await requestCancellation(handle, "focused test cleanup");
      await confirmCancellation(handle, 3000);
    } catch {
      // A completed or already cleaned fixture needs no cancellation.
    }
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const result = await cleanup(handle).catch(() => ({ cleaned: false }));
      if (result.cleaned) break;
      await sleep(25);
    }
  }
  await rm(fixtureData.root, { recursive: true, force: true });
}

function expectEvent(record: DurableRecordObservation, event: string): void {
  expect(record.events.some((candidate) => candidate.event === event)).toBe(true);
}

describe("detached subprocess foundation", () => {
  test("enforces the configured role chain and rejects direct or unattributed events", () => {
    expect(() => validateRoleChain(roleChain)).not.toThrow();
    expect(() => validateTaskEvent({
      kind: "task",
      source: "host-event-stream",
      sessionId: roleChain.implementer.sessionId,
      parentSessionId: roleChain.orchestrator.sessionId,
      target: "implementer",
      agent: "implementer",
    }, roleChain)).not.toThrow();
    expect(() => validateTaskEvent({
      kind: "task",
      source: "host-event-stream",
      sessionId: roleChain.implementer.sessionId,
      parentSessionId: roleChain.orchestrator.sessionId,
      target: "general",
      agent: "general",
    }, roleChain)).toThrow(/delegation blocker/);
    expect(() => validateTaskEvent({
      kind: "task",
      source: "",
      sessionId: roleChain.implementer.sessionId,
      parentSessionId: roleChain.orchestrator.sessionId,
      target: "implementer",
      agent: "implementer",
    }, roleChain)).toThrow(/unattributed/);
    expect(() => validateTaskEvent({
      kind: "task",
      source: "host-event-stream",
      sessionId: roleChain.implementer.sessionId,
      parentSessionId: roleChain.asIs.sessionId,
      target: "implementer",
      agent: "implementer",
    }, roleChain)).toThrow(/parent linkage/);
  });

  test("returns after a durable launch checkpoint, owns a process group, polls, hands off, and cleans", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const request = requestFor(fixtureData, [
       "console.log(process.env.AS_IS_ROLE_CHAIN);",
        "console.log(process.env.AS_IS_NO_INTERACTIVE_PROMPT);",
        "console.log('worker-start');",
        "await Bun.sleep(300);",
        "console.log('worker-finish');",
      ].join(" "), { startDelayMilliseconds: 600 });
      const startedAt = monotonicSeconds();
      const result = await launch(request, 3000);
      const submissionSeconds = monotonicSeconds() - startedAt;
      handles.push(result.handle);

      expect(result.outcome).toBe("started");
      expect(submissionSeconds).toBeLessThan(0.45);
       expect(result.record.status).toBe("active");
       expectEvent(result.record, "launch-requested");
       expectEvent(result.record, "launch-accepted");
       expectEvent(result.record, "capability-preflight-passed");
       const runtimeMode = (await stat(result.handle.runtimeDir)).mode & 0o777;
       const workspaceMode = (await stat(result.handle.workspacePath)).mode & 0o777;
       expect(runtimeMode).toBe(0o700);
       expect(workspaceMode).toBe(0o700);

       const waiting = await eventually(() => observe(result.handle), (value) => value.host.status === "waiting" && value.record.events.some((event) => event.event === "watchdog-configured"));
       expectEvent(waiting.record, "watchdog-configured");
       expect(waiting.health.supervisorAlive).toBe(true);
       expect(waiting.health.supervisorProcessGroupAlive).toBe(true);
      expect(waiting.health.workerAlive).toBe(false);
      expect(waiting.stale.status).toBe("fresh");

      const running = await eventually(() => observe(result.handle), (value) => value.host.status === "running");
      expect(running.health.workerAlive).toBe(true);
       expect(running.health.processGroupAlive).toBe(true);
       expect(running.health.supervisorProcessGroupAlive).toBe(true);
       expectEvent(running.record, "heartbeat");
      expect(running.host.workerProcessGroupId).toBeGreaterThan(0);

      const completed = await eventually(
        () => observe(result.handle),
        (value) => value.host.status === "completed" && value.record.events.some((event) => event.event === "budget-observed"),
      );
      expect(completed.outcome).toBe("progressed");
      expect(completed.record.status).toBe("active");
      expect(completed.budget?.cumulative.wallClockSpentSeconds).toBeGreaterThan(0);
      expect(completed.budget?.cumulative.costSpent).toBe("unavailable");
      expect(completed.budget?.cumulative.costSource).toContain("not-reported");
      expectEvent(completed.record, "budget-observed");

      const stdoutPath = completed.host.logs.stdout;
      expect(stdoutPath).not.toBeNull();
      const stdout = await readFile(stdoutPath as string, "utf8");
      expect(stdout).toContain("[worker.stdout]");
       expect(stdout).toContain("as-is -> orchestrator -> implementer");
       expect(stdout).toContain("1");
      expect(stdout).toContain("worker-finish");

      const handoff = await recordHandoff(result.handle, {
        validation: ["focused deterministic lifecycle test passed"],
        result: "harmless detached job observed and handed off",
        descendantsTerminal: true,
        failedOrCancelledDescendants: [],
      });
      expect(handoff.status).toBe("completed");
      expectEvent(handoff, "handoff-evidence");

      let cleaned = false;
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const cleanupResult = await cleanup(result.handle);
        if (cleanupResult.cleaned) {
          cleaned = true;
          break;
        }
        await sleep(25);
      }
      expect(cleaned).toBe(true);
      const leftovers = await noLeftover(result.handle);
       expect(leftovers.processGroupAlive).toBe(false);
       expect(leftovers.supervisorAlive).toBe(false);
       expect(leftovers.supervisorProcessGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);
      const finalRecord = await readDurableRecord(fixtureData.recordPath);
      expectEvent(finalRecord, "cleanup-complete");
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("records durable cancellation, confirms termination, and preserves audit evidence", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const result = await launch(requestFor(fixtureData, "console.log('cancel-start'); await Bun.sleep(5000);"));
      handles.push(result.handle);
      await eventually(() => observe(result.handle), (value) => value.host.status === "running");
      const requested = await requestCancellation(result.handle, "focused cancellation validation");
      expect(requested.record.events.some((event) => event.event === "cancellation-requested")).toBe(true);
      const confirmed = await confirmCancellation(result.handle, 4000);
      expect(confirmed.record.status).toBe("cancelled");
      expect(confirmed.outcome).toBe("cancelled");
      expectEvent(confirmed.record, "cancellation-confirmed");
      expect(confirmed.health.processGroupAlive).toBe(false);
      expect(confirmed.record.events.some((event) => event.details.partialWorkPreserved === true)).toBe(true);
      const cleanupResult = await cleanup(result.handle);
      if (!cleanupResult.cleaned) {
        await sleep(50);
        expect((await cleanup(result.handle)).cleaned).toBe(true);
      }
      const leftovers = await noLeftover(result.handle);
      expect(leftovers.processGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("enforces a bounded watchdog deadline and preserves the failure checkpoint", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const result = await launch(requestFor(fixtureData, "await Bun.sleep(1000);", {
        budget: {
          costAllocation: 0.20,
          costReserve: 0.04,
          costSpent: 0,
          costSource: "test-input",
          wallClockAllocationSeconds: 0.35,
          wallClockReserveSeconds: 0.05,
          wallClockSpentSeconds: 0,
          wallClockSource: "test-input",
        },
      }));
      handles.push(result.handle);
      const failed = await eventually(() => observe(result.handle), (value) => value.host.status === "failed", 3000);
      expect(failed.record.status).toBe("failed");
      expectEvent(failed.record, "watchdog-deadline-exceeded");
      expect(failed.record.events.find((event) => event.event === "failure")?.details.source).toBe("supervisor-watchdog");
      const cleanupResult = await cleanup(result.handle);
      if (!cleanupResult.cleaned) {
        await sleep(75);
        expect((await cleanup(result.handle)).cleaned).toBe(true);
      }
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("classifies stale, fresh, and unknown durable checkpoints without inference", () => {
    const old = new Date(Date.now() - 5000).toISOString();
    const fresh = new Date(Date.now() - 20).toISOString();
    expect(classifyStale({ path: "fixture", status: "active", updated: old, events: [], raw: "" }, 1).status).toBe("stale");
    expect(classifyStale({ path: "fixture", status: "active", updated: fresh, events: [], raw: "" }, 1).status).toBe("fresh");
    expect(classifyStale({ path: "fixture", status: "active", updated: null, events: [], raw: "" }, 1).status).toBe("unknown");
    expect(classifyStale({ path: "fixture", status: "active", updated: "not-a-date", events: [], raw: "" }, 1).status).toBe("unknown");
    expect(classifyStale({ path: "fixture", status: "completed", updated: old, events: [], raw: "" }, 1).status).toBe("unknown");
  });

  test("accounts an unavailable cost source, applies finite recovery backoff, and escalates", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const result = await launch(requestFor(fixtureData, "process.exit(7)"));
      handles.push(result.handle);
      const failed = await eventually(() => observe(result.handle), (value) => value.host.status === "failed");
      expect(failed.record.status).toBe("failed");
      expect(failed.budget?.cumulative.costSpent).toBe("unavailable");
      expect(failed.budget?.attempts).toHaveLength(1);

      const now = new Date("2026-01-01T00:00:00.000Z");
      const first = await scheduleRecovery(result.handle, "stale worker checkpoint", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      expect(first.outcome).toBe("waiting");
      expect(first.attempt).toBe(1);
      expect(first.delaySeconds).toBe(2);
      const second = await scheduleRecovery(result.handle, "first recovery did not hand off", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      expect(second.outcome).toBe("waiting");
      expect(second.attempt).toBe(2);
      expect(second.delaySeconds).toBe(4);
      const escalated = await scheduleRecovery(result.handle, "bounded recovery exhausted", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      expect(escalated.outcome).toBe("rejected");
      expect(escalated.reason).toContain("max recovery attempts");
      const record = await readDurableRecord(fixtureData.recordPath);
      expect(record.status).toBe("blocked");
      expectEvent(record, "recovery-scheduled");
      expectEvent(record, "recovery-escalated");
      expect(record.events.filter((event) => event.event === "budget-observed")).toHaveLength(1);
      expect(record.events.find((event) => event.event === "budget-observed")?.details.noDoubleCounting).toBe(true);
      const repeated = await scheduleRecovery(result.handle, "stale worker checkpoint", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      expect(repeated.outcome).toBe("rejected");
      expect(repeated.reason).toContain("repeated blocker fingerprint");
      expect((await readDurableRecord(fixtureData.recordPath)).events.some((event) => event.details.repeatedBlocker === true)).toBe(true);
      const cleanupResult = await cleanup(result.handle);
      if (!cleanupResult.cleaned) {
        await sleep(50);
        expect((await cleanup(result.handle)).cleaned).toBe(true);
      }
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("durably blocks exhausted admission and unavailable configured workers", async () => {
    const exhausted = await fixture();
    const unavailable = await fixture();
    try {
      const exhaustedResult = await launch(requestFor(exhausted, "await Bun.sleep(1);", {
        budget: {
          costAllocation: 1,
          costReserve: 0.1,
          costSpent: 0.9,
          costSource: "durable-test",
          wallClockAllocationSeconds: 1,
          wallClockReserveSeconds: 0.1,
          wallClockSpentSeconds: 0.9,
          wallClockSource: "durable-test",
        },
      }));
      expect(exhaustedResult.outcome).toBe("rejected");
      expect(exhaustedResult.record.status).toBe("blocked");
      expectEvent(exhaustedResult.record, "budget-blocked");

      const unavailableResult = await launch(requestFor(unavailable, "await Bun.sleep(1);", {
        worker: { role: "implementer", command: [process.execPath, "-e", "await Bun.sleep(1);"], available: false },
      }));
      expect(unavailableResult.outcome).toBe("unavailable");
      expect(unavailableResult.record.status).toBe("blocked");
      expectEvent(unavailableResult.record, "worker-unavailable");
      expect(unavailableResult.record.events.find((event) => event.event === "worker-unavailable")?.details.replacement).toContain("not permitted");
    } finally {
      await rm(exhausted.root, { recursive: true, force: true });
      await rm(unavailable.root, { recursive: true, force: true });
    }
  });

  test("requires capability preflight and leaves an unavailable host as a durable blocker", async () => {
    const fixtureData = await fixture();
    try {
      const request = requestFor(fixtureData, "await Bun.sleep(1);", {
        capabilities: { userEventBubbling: false, source: "unproven-test-host" },
      });
      const result = await launch(request);
      expect(result.outcome).toBe("unavailable");
      expect(result.record.status).toBe("blocked");
      const preflight = result.record.events.find((event) => event.event === "capability-preflight-failed");
      expect(preflight?.source).toBe("durable-task-record");
      expect(preflight?.details.blocker).toBe("worker-loss/capability");
      expect(preflight?.details.hiddenInteractivePrompt).toBe(false);
      expect((await noLeftover(result.handle)).runtimeExists).toBe(false);
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("persists permission-needed state, bubbles a scoped decision, and resumes only after approval", async () => {
    const approvedFixture = await fixture("active");
    const deniedFixture = await fixture("active");
    const handles: JobHandle[] = [];
    try {
      const approvedHandle = recordOnlyHandle(approvedFixture);
      const bubbled: string[] = [];
      const approved = await recordPermissionNeeded(approvedHandle, {
        operation: "write",
        capabilityClass: "filesystem",
        resourceClass: "approved-test-target",
        failureClass: "permission-denied",
        reason: "focused reversible permission boundary",
      }, {
        source: "focused-user-event-bridge",
        present: async (event) => {
          bubbled.push(`${event.event}:${event.permissionState}:${event.fingerprint}`);
          return "approved";
        },
      });
      expect(approved.outcome).toBe("approved");
      expect(bubbled[0]).toMatch(/^permission-needed:awaiting-user-approval:/);
      expect(approved.record.status).toBe("awaiting-approval");
      expect(approved.record.events.find((event) => event.event === "permission-needed")?.details.permissionState)
        .toBe("awaiting-user-approval");
      expect(approved.record.events.find((event) => event.event === "permission-approved")?.details.permissionState)
        .toBe("approved");

      const resumed = await resumeAfterApproval(approvedHandle, requestFor(approvedFixture, "console.log('approved-resume');"));
      handles.push(resumed.handle);
      expect(resumed.outcome).toBe("started");
      const completed = await eventually(() => observe(resumed.handle), (value) => value.host.status === "completed");
      expect((await readFile(completed.host.logs.stdout as string, "utf8"))).toContain("approved-resume");

      const denied = await recordPermissionNeeded(recordOnlyHandle(deniedFixture), {
        operation: "delete",
        capabilityClass: "filesystem",
        resourceClass: "protected-test-target",
        failureClass: "permission-denied",
        reason: "focused denial boundary",
      }, {
        source: "focused-user-event-bridge",
        present: async () => "denied",
      });
      expect(denied.outcome).toBe("denied");
      expect(denied.record.status).toBe("blocked");
      expect(denied.record.events.find((event) => event.event === "permission-denied")?.details.automaticRetry).toBe(false);
      await expect(resumeAfterApproval(recordOnlyHandle(deniedFixture, denied.record.events.find((event) => event.event === "permission-needed")?.jobId), requestFor(deniedFixture, "await Bun.sleep(1);"))).rejects.toThrow(/approval/);
    } finally {
      await cleanupFixture(approvedFixture, handles);
      await rm(deniedFixture.root, { recursive: true, force: true });
    }
  });

  test("does not simulate a hidden prompt when permission-event bubbling is unavailable", async () => {
    const fixtureData = await fixture("active");
    try {
      const result = await recordPermissionNeeded(recordOnlyHandle(fixtureData), {
        operation: "write",
        capabilityClass: "filesystem",
        resourceClass: "unapproved-test-target",
        failureClass: "permission-denied",
        reason: "host bridge intentionally unavailable",
      });
      expect(result.outcome).toBe("unavailable");
      expect(result.record.status).toBe("blocked");
      expectEvent(result.record, "permission-needed");
      expectEvent(result.record, "permission-escalation-unproven");
      expect(result.record.events.find((event) => event.event === "permission-needed")?.details.permissionState)
        .toBe("awaiting-user-approval");
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });
});
