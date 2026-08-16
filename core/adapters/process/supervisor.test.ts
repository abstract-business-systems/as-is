import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ControlPlane } from "../../modules/task-control/control-plane.ts";
import {
  classifyStale,
  cleanup,
  createPrivateRecordOnlyHandle,
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

function assertNoRawPaths(value: unknown, rawPath: string): void {
  const serialized = JSON.stringify(value);
  expect(serialized).not.toContain(rawPath);
  expect(serialized).not.toContain("recordPath");
  expect(serialized).not.toContain("runtimeDir");
  expect(serialized).not.toContain("workspacePath");
  expect(serialized).not.toContain("statePath");
}

const roleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "session-as-is", parentSessionId: null, source: "test" },
  orchestrator: { role: "orchestrator", sessionId: "session-orchestrator", parentSessionId: "session-as-is", source: "test" },
  implementer: { role: "implementer", sessionId: "session-implementer", parentSessionId: "session-orchestrator", source: "test" },
};

const sleep = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
const privatePaths = new Map<string, { runtimeDir: string; workspacePath: string; stdout: string }>();
function privateFixture(handle: JobHandle): { runtimeDir: string; workspacePath: string; stdout: string } {
  const value = privatePaths.get(handle.handleToken);
  if (!value) throw new Error("private fixture is unavailable");
  return value;
}
const monotonicSeconds = () => Number(process.hrtime.bigint()) / 1_000_000_000;

function recordContents(): string {
  return `# Fixture Task

## Progress

The fixture is controlled only by the focused supervisor test.
`;
}

function taskData(status: "ready" | "active" = "ready", updated = new Date().toISOString(), allocatedCost = 0.20, allocatedWall = 10) {
  return { status, worker: "implementer", updated, constraints: { cost: { currency: "USD", allocated: allocatedCost, spent: 0, reserve: 0.04, source: "unavailable", "fallback-metric": "validation elapsed-seconds" }, delegation: { "maximum-depth": 0, "maximum-children": 0 }, execution: { "wall-clock": { "allocated-seconds": allocatedWall, "spent-seconds": 0, "reserve-seconds": 1, source: "unavailable" } }, "external-effects": "prohibited" }, acceptance: ["harmless deterministic supervisor fixture"] };
}

async function writeTask(directory: string, status: "ready" | "active" = "ready", updated?: string, allocatedCost = 0.20, allocatedWall = 10): Promise<string> {
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "as-is.md"), "# Fixture\n", "utf8");
  await writeFile(join(directory, "tasks.md"), recordContents(), "utf8");
  await writeFile(join(directory, "as-is.json"), JSON.stringify({ configuration: { records: { filenames: { task: "tasks.md" } }, scheduling: { maxConcurrentTasks: 1, checkInSeconds: 300 } }, task: taskData(status, updated, allocatedCost, allocatedWall) }), "utf8");
  return join(directory, "tasks.md");
}

interface Fixture {
  root: string;
  recordPath: string;
  projectRoot: string;
}

async function fixture(status: "ready" | "active" = "ready", updated?: string): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "as-is-supervisor-test-"));
  const recordPath = await writeTask(root, status, updated);
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

async function recordOnlyHandle(fixtureData: Fixture, jobId = `permission-${crypto.randomUUID()}`): Promise<JobHandle> {
  return createPrivateRecordOnlyHandle(
    fixtureData.recordPath,
    join(fixtureData.root, "private-runtime"),
    join(fixtureData.root, "private-runtime", "workspace"),
    join(fixtureData.root, "private-runtime", "state.json"),
    "test-component",
    jobId,
  );
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

  test("emits one bounded child-wait span with deterministic lifecycle fields", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const traceDirectory = join(fixtureData.root, "trace.jsonl");
      const result = await launch(requestFor(fixtureData, "await Bun.sleep(300);", {
        tracer: { backend: "file", enabled: true, directory: traceDirectory },
      }), 3000);
      handles.push(result.handle);
      const lines = await eventually(async () => (await readFile(traceDirectory, "utf8")).trim().split("\n").filter(Boolean), (value) => value.some((line) => line.includes('"name":"child-wait"')));
      const spans = lines.map((line) => JSON.parse(line) as { name: string; durationMs?: number; attributes: { phase?: string; outcome?: string } });
      const waitSpans = spans.filter((span) => span.name === "child-wait");
      expect(waitSpans).toHaveLength(1);
      expect(waitSpans[0].attributes.phase).toBe("child-wait");
      expect(waitSpans[0].durationMs).toBeGreaterThanOrEqual(0);
      expect(waitSpans[0].attributes.outcome).toBe("success");
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  }, 15000);

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
      privatePaths.set(result.handle.handleToken, { runtimeDir: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId), workspacePath: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId, "workspace"), stdout: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId, "stdout.log") });
      const submissionSeconds = monotonicSeconds() - startedAt;
      handles.push(result.handle);

      expect(result.outcome).toBe("started");
      expect(result.handle).toEqual({
        jobId: result.handle.jobId,
        projectKey: "supervisor-test",
        component: "test-component",
        attempt: 1,
        handleToken: result.handle.handleToken,
      });
      assertNoRawPaths(result, fixtureData.root);
      expect(submissionSeconds).toBeLessThan(0.45);
       expect(result.record.status).toBe("active");
       expectEvent(result.record, "launch-requested");
       expectEvent(result.record, "launch-accepted");
       expectEvent(result.record, "capability-preflight-passed");
       const privateData = privateFixture(result.handle);
       const runtimeMode = (await stat(privateData.runtimeDir)).mode & 0o777;
       const workspaceMode = (await stat(privateData.workspacePath)).mode & 0o777;
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

      expect(completed.host.logs.stdout).toBeNull();
      expect(completed.host.runtimeReference).toBe(`<tmp>/as-is/supervisor-test/${request.runId}/test-component/${result.handle.jobId}`);
      expect(completed.host.runtimeReference).not.toContain(fixtureData.root);
      const stdout = await readFile(privateFixture(result.handle).stdout, "utf8");
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
      assertNoRawPaths(finalRecord, fixtureData.root);
      assertNoRawPaths(completed, fixtureData.root);
      expect(JSON.stringify(finalRecord)).not.toContain('"path"');
      expect(JSON.stringify(finalRecord)).not.toContain('"raw"');
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
      assertNoRawPaths(requested, fixtureData.root);
      expect(requested.record.events.some((event) => event.event === "cancellation-requested")).toBe(true);
      const confirmed = await confirmCancellation(result.handle, 4000);
      assertNoRawPaths(confirmed, fixtureData.root);
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

  test("stops an exhausted process and continues it after parent budget admission", async () => {
    const fixtureData = await fixture("active");
    const childRoot = join(fixtureData.root, "child");
    const childRecordPath = join(childRoot, "tasks.md");
    const handles: JobHandle[] = [];
    try {
      await writeTask(fixtureData.root, "active", undefined, 10, 100);
      await writeTask(childRoot, "active");
      const first = await launch(requestFor({ ...fixtureData, recordPath: childRecordPath }, "await Bun.sleep(1000);", {
        expectedRecordStatus: "active",
        budget: {
          costAllocation: 0.20,
          costReserve: 0.04,
          costSpent: 0,
          costSource: "test-input",
          wallClockAllocationSeconds: 0.25,
          wallClockReserveSeconds: 0.05,
          wallClockSpentSeconds: 0,
          wallClockSource: "test-input",
        },
      }));
      handles.push(first.handle);
      const stopped = await eventually(() => observe(first.handle), (value) => value.host.status === "failed", 3000);
      expect(stopped.record.events.some((event) => event.event === "watchdog-deadline-exceeded")).toBe(true);
      expect(stopped.budget?.cumulative.wallClockSpentSeconds).toBeGreaterThan(0);

      const recovery = await scheduleRecovery(first.handle, "bounded watchdog exhaustion", { now: new Date("2026-01-01T00:00:00.000Z"), retryBackoffSeconds: 0, maxRecoveryAttempts: 2 });
      expect(recovery.outcome).toBe("rejected");
      expect(recovery.reason).toContain("allocation");
      expect((await readDurableRecord(childRecordPath)).status).toBe("blocked");

      const control = new ControlPlane(fixtureData.root, { clock: () => new Date("2026-01-01T00:00:01.000Z") });
      const admission = control.extend("child", { cost: 0.10, wall: 1, recommendation: "approve", reason: "The bounded continuation remains necessary." });
      expect(admission.decision).toBe("approve");
      expect((await readDurableRecord(childRecordPath)).status).toBe("active");

      const continued = await launch(requestFor({ ...fixtureData, recordPath: childRecordPath }, "console.log('continued-after-budget');", {
        expectedRecordStatus: "active",
        budget: {
          costAllocation: 1,
          costReserve: 0.05,
          costSpent: 0,
          costSource: "test-input",
          wallClockAllocationSeconds: 1,
          wallClockReserveSeconds: 0.1,
          wallClockSpentSeconds: 0,
          wallClockSource: "test-input",
        },
      }));
      handles.push(continued.handle);
      const completed = await eventually(() => observe(continued.handle), (value) => value.host.status === "completed", 3000);
      expect(completed.record.status).toBe("active");
      expect(completed.host.logs.stdout).toBeNull();
    } finally {
      await cleanupFixture({ ...fixtureData, recordPath: childRecordPath }, handles);
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  }, 15000);

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
      expect(failed.record.events.find((event) => event.event === "watchdog-deadline-exceeded")?.details.source).toBe("supervisor-watchdog");
      const cleanupResult = await cleanup(result.handle);
      if (!cleanupResult.cleaned) {
        await sleep(75);
        expect((await cleanup(result.handle)).cleaned).toBe(true);
      }
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("rejects a launch request against a newer durable record revision", async () => {
    const fixtureData = await fixture();
    try {
      const before = await readDurableRecord(fixtureData.recordPath);
      await expect(launch(requestFor(fixtureData, "await Bun.sleep(1);", {
        recordRevision: "stale-record-revision",
      }))).rejects.toThrow("durable record revision is newer or does not match");
      const after = await readDurableRecord(fixtureData.recordPath);
      expect(after.status).toBe("ready");
      expect(after.events).toEqual(before.events);
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("persists private locators with restrictive permissions and rejects missing/corrupt maps", async () => {
    const fixtureData = await fixture();
    const previousState = process.env.XDG_STATE_HOME;
    const stateHome = await mkdtemp(join(tmpdir(), "as-is-state-test-"));
    process.env.XDG_STATE_HOME = stateHome;
    try {
      const result = await launch(requestFor(fixtureData, "await Bun.sleep(100);"));
      const mapPath = join(stateHome, "as-is", "projects", "supervisor-test", "runtime", "job-map.json");
      const map = JSON.parse(await readFile(mapPath, "utf8")) as { jobs: Record<string, unknown> };
      expect(map.jobs[result.handle.jobId]).toBeDefined();
      expect((await stat(mapPath)).mode & 0o777).toBe(0o600);
      await cleanupFixture(fixtureData, [result.handle]);
      const unavailable = await observe(result.handle);
      expect(unavailable.outcome).toBe("unavailable");
      expect(unavailable.health.workerAlive).toBe("unknown");
      await writeFile(mapPath, "not-json", "utf8");
      const fabricated = { ...result.handle, handleToken: `${result.handle.handleToken}-new` };
      await expect(observe(fabricated)).rejects.toThrow("private job map cannot be loaded");
      await writeFile(mapPath, JSON.stringify({ version: 1, projectKey: "supervisor-test", jobs: {} }), "utf8");
      await expect(observe(result.handle)).rejects.toThrow("private process operands cannot be resolved");
      await rm(mapPath, { force: true });
      const missingMapError = await observe(result.handle).catch((error) => error as Error);
      expect(missingMapError).toBeInstanceOf(Error);
      expect((missingMapError as Error).message).toBe("unavailable: private job map cannot be loaded at the private state boundary");
      expect((missingMapError as Error).message).not.toContain(fixtureData.root);
    } finally {
      if (previousState === undefined) delete process.env.XDG_STATE_HOME;
      else process.env.XDG_STATE_HOME = previousState;
      await rm(stateHome, { recursive: true, force: true });
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("does not emit a masked reference for an untrusted record-only runtime", async () => {
    const fixtureData = await fixture("active");
    try {
      const handle = await recordOnlyHandle(fixtureData);
      const observation = await observe(handle);
      expect(observation.host.runtimeReference).toBeNull();
      assertNoRawPaths(observation, fixtureData.root);
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("rejects fabricated public handles without private locator evidence", async () => {
    const fixtureData = await fixture();
    try {
      const fabricated: JobHandle = { jobId: "unknown-job", projectKey: "supervisor-test", component: "test-component", attempt: 1, handleToken: "fabricated-token" };
      await expect(observe(fabricated)).rejects.toThrow("private process operands cannot be resolved");
      await expect(observe({ ...fabricated, jobId: "../private-job" })).rejects.toThrow("job id is malformed");
      await expect(observe({ ...fabricated, component: "../private-component" })).rejects.toThrow("component identity is not a logical key");
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("projects malformed public ledger fields and private budget metadata safely", async () => {
    const fixtureData = await fixture("active");
    try {
      const raw = await readFile(fixtureData.recordPath, "utf8");
      const injected = JSON.stringify({
        operation: "./private/operation",
        event: "malformed/event",
        jobId: "../private-job",
        source: "/private/source",
        observedAt: "/private/time",
        recordPath: fixtureData.recordPath,
        details: { reason: fixtureData.recordPath, nested: { runtimeDir: fixtureData.root } },
      });
      const next = `${raw}\n<!-- subprocess-execution-foundation:begin -->\n${injected}\n<!-- subprocess-execution-foundation:end -->\n`;
      await writeFile(fixtureData.recordPath, next, "utf8");
      const record = await readDurableRecord(fixtureData.recordPath);
      assertNoRawPaths(record, fixtureData.root);
      expect(record.events.at(-1)?.operation).toBe("unknown");
      expect(record.events.at(-1)?.jobId).toBe("unknown");
      expect(record.events.at(-1)?.details).toEqual({});
    } finally {
      await rm(fixtureData.root, { recursive: true, force: true });
    }
  });

  test("projects malformed private budget values fail-closed", async () => {
    const fixtureData = await fixture("active");
    const handles: JobHandle[] = [];
    try {
      const request = requestFor(fixtureData, "await Bun.sleep(1000);", { expectedRecordStatus: "active" });
      const result = await launch(request);
      privatePaths.set(result.handle.handleToken, { runtimeDir: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId), workspacePath: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId, "workspace"), stdout: join(tmpdir(), "as-is", "supervisor-test", request.runId as string, "test-component", result.handle.jobId, "stdout.log") });
      handles.push(result.handle);
      await eventually(() => observe(result.handle), (value) => value.host.status === "running");
      const privateData = privateFixture(result.handle);
      const statePath = join(privateData.runtimeDir, "state.json");
      const state = JSON.parse(await readFile(statePath, "utf8")) as Record<string, any>;
      state.budget.costSpent = fixtureData.root;
      state.budget.wallClockSpentSeconds = fixtureData.root;
      state.attempts = [{ attempt: fixtureData.root, jobId: fixtureData.root, reason: fixtureData.root, wallClockSeconds: fixtureData.root, cost: fixtureData.root, costSource: fixtureData.root, wallClockSource: fixtureData.root, accounted: fixtureData.root }];
      await writeFile(statePath, JSON.stringify(state), "utf8");
      const observation = await observe(result.handle);
      assertNoRawPaths(observation, fixtureData.root);
      expect(observation.budget?.cumulative.costSpent).toBe("unavailable");
      expect(observation.budget?.attempts[0]?.cost).toBe("unavailable");
      state.budget = null;
      state.attempts = [null];
      await writeFile(statePath, JSON.stringify(state), "utf8");
      const malformedShape = await observe(result.handle);
      expect(malformedShape.budget?.cumulative.costSpent).toBe("unavailable");
      expect(malformedShape.budget?.attempts).toHaveLength(0);
      assertNoRawPaths(malformedShape, fixtureData.root);
    } finally {
      await cleanupFixture(fixtureData, handles);
    }
  });

  test("classifies stale, fresh, and unknown durable checkpoints without inference", () => {
    const old = new Date(Date.now() - 5000).toISOString();
    const fresh = new Date(Date.now() - 20).toISOString();
    expect(classifyStale({ status: "active", updated: old, events: [] }, 1).status).toBe("stale");
    expect(classifyStale({ status: "active", updated: fresh, events: [] }, 1).status).toBe("fresh");
    expect(classifyStale({ status: "active", updated: null, events: [] }, 1).status).toBe("unknown");
    expect(classifyStale({ status: "active", updated: "not-a-date", events: [] }, 1).status).toBe("unknown");
    expect(classifyStale({ status: "completed", updated: old, events: [] }, 1).status).toBe("unknown");
  });

  test("accounts an unavailable cost source, applies finite recovery backoff, and escalates", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const result = await launch(requestFor(fixtureData, "process.exit(7)"));
      handles.push(result.handle);
      const failed = await eventually(() => observe(result.handle), (value) => value.host.status === "failed" && value.record.status === "failed");
      expect(failed.record.status).toBe("failed");
      expect(failed.budget?.cumulative.costSpent).toBe("unavailable");
      expect(failed.budget?.attempts).toHaveLength(1);

      const now = new Date("2026-01-01T00:00:00.000Z");
      const first = await scheduleRecovery(result.handle, "stale worker checkpoint", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      assertNoRawPaths(first, fixtureData.root);
      expect(first.outcome).toBe("waiting");
      expect(first.attempt).toBe(1);
      expect(first.delaySeconds).toBe(2);
      const second = await scheduleRecovery(result.handle, "first recovery did not hand off", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      expect(second.outcome).toBe("waiting");
      expect(second.attempt).toBe(2);
      expect(second.delaySeconds).toBe(4);
      const escalated = await scheduleRecovery(result.handle, "bounded recovery exhausted", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 });
      assertNoRawPaths(escalated, fixtureData.root);
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

  test("serializes concurrent recovery scheduling for one predecessor", async () => {
    const fixtureData = await fixture();
    const handles: JobHandle[] = [];
    try {
      const result = await launch(requestFor(fixtureData, "process.exit(7)"));
      handles.push(result.handle);
      await eventually(() => observe(result.handle), (value) => value.host.status === "failed");
      const now = new Date("2026-01-01T00:00:00.000Z");
      const results = await Promise.all([
        scheduleRecovery(result.handle, "concurrent recovery one", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 }),
        scheduleRecovery(result.handle, "concurrent recovery two", { now, retryBackoffSeconds: 2, maxRecoveryAttempts: 2 }),
      ]);
      expect(results.map((value) => value.attempt).sort()).toEqual([1, 2]);
      const record = await readDurableRecord(fixtureData.recordPath);
      expect(record.events.filter((event) => event.event === "recovery-scheduled")).toHaveLength(2);
      expect(new Set(results.map((value) => value.attempt)).size).toBe(2);
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
      const approvedHandle = await recordOnlyHandle(approvedFixture);
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
      assertNoRawPaths(approved, approvedFixture.root);
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
      expect(completed.host.logs.stdout).toBeNull();

      const denied = await recordPermissionNeeded(await recordOnlyHandle(deniedFixture), {
        operation: "delete",
        capabilityClass: "filesystem",
        resourceClass: "protected-test-target",
        failureClass: "permission-denied",
        reason: "focused denial boundary",
      }, {
        source: "focused-user-event-bridge",
        present: async () => "denied",
      });
      assertNoRawPaths(denied, deniedFixture.root);
      expect(denied.outcome).toBe("denied");
      expect(denied.record.status).toBe("blocked");
      expect(denied.record.events.find((event) => event.event === "permission-denied")?.details.automaticRetry).toBe(false);
      await expect(resumeAfterApproval(await recordOnlyHandle(deniedFixture, denied.record.events.find((event) => event.event === "permission-needed")?.jobId), requestFor(deniedFixture, "await Bun.sleep(1);"))).rejects.toThrow(/approval/);
    } finally {
      await cleanupFixture(approvedFixture, handles);
      await rm(deniedFixture.root, { recursive: true, force: true });
    }
  });

  test("does not simulate a hidden prompt when permission-event bubbling is unavailable", async () => {
    const fixtureData = await fixture("active");
    try {
      const result = await recordPermissionNeeded(await recordOnlyHandle(fixtureData), {
        operation: "write",
        capabilityClass: "filesystem",
        resourceClass: "unapproved-test-target",
        failureClass: "permission-denied",
        reason: "host bridge intentionally unavailable",
      });
      assertNoRawPaths(result, fixtureData.root);
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
