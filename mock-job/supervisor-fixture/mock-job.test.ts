import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  cleanupMockJob,
  cancelMockJob,
  exercisePermission,
  finalizeMockJob,
  launchMockJob,
  reconcileMockJob,
  type MockHandleFile,
  type MockLaunchEnvelope,
} from "./mock-job.ts";
import {
  noLeftover,
  observe,
  recordHandoff,
  readDurableRecord,
  type JobHandle,
} from "../../subprocess-execution-foundation/supervisor.ts";

const componentPath = "mock-job/supervisor-fixture";
const taskRevision = "mock-supervisor-fixture-v1";
const scriptPath = join(dirname(fileURLToPath(import.meta.url)), "mock-job.ts");
const sleep = (milliseconds: number) => new Promise<void>((resolvePromise) => setTimeout(resolvePromise, milliseconds));

interface Fixture {
  root: string;
  recordPath: string;
  stateHome: string;
  envelope: MockLaunchEnvelope;
}

function fixtureRecord(status: "ready" | "active" = "ready"): string {
  return `---
as-is-version: 2
task:
  status: ${status}
  worker: implementer
  updated: ${new Date().toISOString()}
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 20
      spent-seconds: 0
      reserve-seconds: 2
      source: unavailable
  external-effects: prohibited
acceptance:
  - deterministic local mock supervisor fixture
---

# Mock Fixture

## Task Revision

  \`${taskRevision}\`

## Progress

Focused fixture test.

## Validation

- focused mock fixture validation

## Result

Pending.

## Blockers And Escalations

None.

## Recovery

Use the component path, task revision, and attempt; private runtime is supplementary.

## Next Action

Observe the durable record through the path-based status surface.
`;
}

async function makeFixture(status: "ready" | "active" = "ready"): Promise<Fixture> {
  const cleanRoot = await mkdtemp(join(tmpdir(), "as-is-mock-fixture-"));
  const directory = join(cleanRoot, componentPath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const recordPath = join(directory, "as-is.md");
  await writeFile(recordPath, fixtureRecord(status), { encoding: "utf8", mode: 0o600 });
  const stateHome = join(cleanRoot, "state-home");
  return {
    root: cleanRoot,
    recordPath,
    stateHome,
    envelope: {
      componentPath,
      taskRevision,
      attempt: 1,
      parentContext: {
        componentPath: "mock-job",
        role: "orchestrator",
        sessionId: "fixture-orchestrator",
        parentSessionId: "fixture-as-is",
      },
    },
  };
}

async function eventually<T>(read: () => Promise<T>, matches: (value: T) => boolean, timeout = 8_000): Promise<T> {
  const deadline = Date.now() + timeout;
  let value = await read();
  while (!matches(value) && Date.now() < deadline) {
    await sleep(25);
    value = await read();
  }
  if (!matches(value)) throw new Error(`condition not observed: ${JSON.stringify(value)}`);
  return value;
}

function handle(value: MockHandleFile): JobHandle {
  return { ...value };
}

function projectKey(root: string): string {
  return `project-${createHash("sha256").update(resolve(root)).digest("hex").slice(0, 16)}`;
}

function mapPath(fixture: Fixture): string {
  return join(fixture.stateHome, "as-is", "projects", projectKey(fixture.root), "runtime", "job-map.json");
}

async function mapDocument(fixture: Fixture): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(mapPath(fixture), "utf8")) as Record<string, unknown>;
}

async function writeMap(fixture: Fixture, entries: Record<string, unknown>): Promise<void> {
  await mkdir(dirname(mapPath(fixture)), { recursive: true, mode: 0o700 });
  await writeFile(mapPath(fixture), `${JSON.stringify({ version: 1, entries }, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
}

async function destroy(fixture: Fixture): Promise<void> {
  await rm(fixture.root, { recursive: true, force: true });
}

async function spawnCli(args: string[], input?: string): Promise<{ code: number; stdout: string; stderr: string }> {
  const child = Bun.spawn([process.execPath, scriptPath, ...args], {
    stdin: input === undefined ? "ignore" : "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });
  if (input !== undefined) {
    child.stdin.write(input);
    child.stdin.end();
  }
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { code, stdout, stderr };
}

describe("deterministic mock supervisor fixture", () => {
  test("accepts the minimal envelope, emits role/lifecycle protocol, persists path identity, watches, hands off, and cleans", async () => {
    const fixture = await makeFixture();
    let launched: Awaited<ReturnType<typeof launchMockJob>> | undefined;
    try {
      launched = await launchMockJob({ projectRoot: fixture.root, stateHome: fixture.stateHome, envelope: fixture.envelope, control: "delayed-completion" });
      expect(launched.outcome).toBe("started");
      expect(launched.adapterBoundary).toEqual({ name: "opencode-launch-adapter", backend: "mock-job-adapter", openCodeEvidence: false });
      expect(launched.envelope).toEqual(fixture.envelope);
      expect("jobId" in launched.envelope).toBe(false);
      expect(launched.roleChain).toMatchObject({
        asIs: { role: "as-is", sessionId: "fixture-as-is", parentSessionId: null },
        orchestrator: { role: "orchestrator", sessionId: "fixture-orchestrator", parentSessionId: "fixture-as-is" },
        implementer: { role: "implementer", parentSessionId: "fixture-orchestrator" },
      });
      expect(launched.events).toContain("role-attributed");
      const raw = await readFile(fixture.recordPath, "utf8");
      expect(raw).toContain('"event":"role-attributed"');
      expect(raw).toContain('"target":"implementer"');
      expect(raw).toContain('"parentLink":"as-is -> orchestrator -> implementer"');

      const map = await mapDocument(fixture);
      const entries = map.entries as Record<string, Record<string, unknown>>;
      expect(entries[launched.handle.jobId]).toMatchObject({
        componentPath,
        taskRevision,
        attempt: 1,
        adapter: "mock-job-adapter",
        backend: "mock-job-adapter",
      });
      expect((await stat(mapPath(fixture))).mode & 0o777).toBe(0o600);

      const live = await eventually(
        () => reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 }),
        (value) => value.classification === "live",
      );
      expect(live.jobId).toMatchObject({ diagnosticOnly: true, lookupKey: false });
      expect(live.stableIdentityPreserved).toBe(true);

      const watched = await spawnCli([
        "watch", "--project-root", fixture.root, "--component-path", componentPath,
        "--state-home", fixture.stateHome, "--attempt", "1", "--count", "3", "--interval-ms", "10",
      ]);
      expect(watched.code).toBe(0);
      const watchLines = watched.stdout.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as Record<string, unknown>);
      expect(watchLines).toHaveLength(3);
      expect(watchLines.map((value) => (value.watch as Record<string, unknown>).sequence)).toEqual([0, 1, 2]);
      expect(watchLines.every((value) => (value.watch as Record<string, unknown>).completionInferredFromPolling === false)).toBe(true);

      const hostCompleted = await eventually(
        () => observe(handle(launched!.handle)),
        (value) => value.host.status === "completed" && value.record.events.some((event) => event.event === "budget-observed"),
      );
      expect(hostCompleted.budget?.cumulative.costSpent).toBe("unavailable");
      expect(hostCompleted.budget?.cumulative.wallClockSpentSeconds).toBeGreaterThan(0);
      const stale = await reconcileMockJob({
        projectRoot: fixture.root,
        componentPath,
        stateHome: fixture.stateHome,
        attempt: 1,
        now: new Date(Date.now() + 1_000),
        checkInSeconds: 0.15,
      });
      expect(stale.classification).toBe("stale");

      await recordHandoff(handle(launched.handle), {
        validation: ["role and lifecycle event stream, delayed completion, path/attempt watch, and accounting observed"],
        result: "local mock completion is durably handed off",
        descendantsTerminal: true,
        failedOrCancelledDescendants: [],
      });
      const terminal = await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 });
      expect(terminal.classification).toBe("terminal");
      expect(terminal.statusClassification).toBe("terminal");
      const cleaned = await cleanupMockJob(launched.handle, fixture.root, fixture.stateHome);
      expect(cleaned.cleanup.cleaned).toBe(true);
      expect(cleaned.leftovers).toMatchObject({ processGroupAlive: false, supervisorAlive: false, supervisorProcessGroupAlive: false, runtimeExists: false });
      expect((await mapDocument(fixture)).entries).toEqual({});
      expect((await readDurableRecord(fixture.recordPath)).status).toBe("completed");
    } finally {
      if (launched) await cleanupMockJob(launched.handle, fixture.root, fixture.stateHome).catch(() => undefined);
      await destroy(fixture);
    }
  }, 20_000);

  test("runs controlled failure, permission awaiting/denial, cancellation, and cleanup without approval inference", async () => {
    const failure = await makeFixture();
    const awaiting = await makeFixture();
    const denied = await makeFixture();
    const cancelled = await makeFixture();
    const launched: Array<{ fixture: Fixture; handle: MockHandleFile }> = [];
    try {
      const failed = await launchMockJob({ projectRoot: failure.root, stateHome: failure.stateHome, envelope: failure.envelope, control: "controlled-failure" });
      launched.push({ fixture: failure, handle: failed.handle });
      const failedObservation = await eventually(() => observe(handle(failed.handle)), (value) => value.host.status === "failed");
      expect(failedObservation.record.status).toBe("failed");
      expect(failedObservation.record.events.find((event) => event.event === "failure")).toBeDefined();
      const failedClean = await cleanupMockJob(failed.handle, failure.root, failure.stateHome);
      expect(failedClean.cleanup.cleaned).toBe(true);

      const waiting = await launchMockJob({ projectRoot: awaiting.root, stateHome: awaiting.stateHome, envelope: awaiting.envelope, control: "permission-awaiting" });
      launched.push({ fixture: awaiting, handle: waiting.handle });
      const permissionWait = await exercisePermission(waiting.handle, "awaiting");
      expect(permissionWait.permission.outcome).toBe("waiting");
      expect(permissionWait.permission.record.status).toBe("awaiting-approval");
      const needed = permissionWait.permission.record.events.find((event) => event.event === "permission-needed");
      expect(needed?.details.permissionState).toBe("awaiting-user-approval");
      expect(needed?.details.hiddenPrompt).toBe(false);
      expect(permissionWait.answer).toBeUndefined();
      const waitingStatus = await reconcileMockJob({ projectRoot: awaiting.root, componentPath, stateHome: awaiting.stateHome, attempt: 1 });
      expect((waitingStatus.status.permission as Record<string, unknown>).state).toBe("awaiting-user-approval");
      const cancelledWaiting = await cancelMockJob(waiting.handle, awaiting.root, awaiting.stateHome, "cancel approval-wait fixture");
      expect(cancelledWaiting.record.status).toBe("cancelled");
      expect(cancelledWaiting.leftovers.runtimeExists).toBe(false);

      const deniedRun = await launchMockJob({ projectRoot: denied.root, stateHome: denied.stateHome, envelope: denied.envelope, control: "permission-denied" });
      launched.push({ fixture: denied, handle: deniedRun.handle });
      const deniedPermission = await exercisePermission(deniedRun.handle, "denied");
      expect(deniedPermission.answer?.outcome).toBe("denied");
      expect(deniedPermission.answer?.record.status).toBe("blocked");
      expect(deniedPermission.answer?.record.events.some((event) => event.event === "permission-denied")).toBe(true);
      const deniedCancelled = await cancelMockJob(deniedRun.handle, denied.root, denied.stateHome, "cancel denied permission fixture");
      expect(deniedCancelled.record.status).toBe("cancelled");

      const cancelRun = await launchMockJob({ projectRoot: cancelled.root, stateHome: cancelled.stateHome, envelope: cancelled.envelope, control: "cancellation" });
      launched.push({ fixture: cancelled, handle: cancelRun.handle });
      const cancelledRun = await cancelMockJob(cancelRun.handle, cancelled.root, cancelled.stateHome, "explicit fixture cancellation");
      expect(cancelledRun.record.events.some((event) => event.event === "cancellation-requested")).toBe(true);
      expect(cancelledRun.record.events.some((event) => event.event === "cancellation-confirmed")).toBe(true);
      expect(cancelledRun.record.status).toBe("cancelled");
      expect(cancelledRun.leftovers).toMatchObject({ processGroupAlive: false, supervisorAlive: false, supervisorProcessGroupAlive: false, runtimeExists: false });
    } finally {
      await Promise.all(launched.map(({ fixture, handle }) => cleanupMockJob(handle, fixture.root, fixture.stateHome).catch(() => undefined)));
      await Promise.all([destroy(failure), destroy(awaiting), destroy(denied), destroy(cancelled)]);
    }
  }, 25_000);

  test("rejects malformed, missing-parent, wrong-role, stale, and duplicate envelopes as durable blockers", async () => {
    const malformed = await makeFixture();
    const missingParent = await makeFixture();
    const wrongRole = await makeFixture();
    const stale = await makeFixture();
    const duplicate = await makeFixture();
    let duplicateRun: Awaited<ReturnType<typeof launchMockJob>> | undefined;
    try {
      await expect(launchMockJob({
        projectRoot: malformed.root,
        stateHome: malformed.stateHome,
        control: "delayed-completion",
        envelope: { ...malformed.envelope, unexpected: true },
      })).rejects.toMatchObject({ code: "malformed-envelope" });
      expect((await readDurableRecord(malformed.recordPath)).status).toBe("blocked");

      const missing = { componentPath, taskRevision, attempt: 1 };
      await expect(launchMockJob({ projectRoot: missingParent.root, stateHome: missingParent.stateHome, control: "delayed-completion", envelope: missing })).rejects.toMatchObject({ code: "missing-parent" });
      expect((await readDurableRecord(missingParent.recordPath)).status).toBe("blocked");

      await expect(launchMockJob({
        projectRoot: wrongRole.root,
        stateHome: wrongRole.stateHome,
        control: "delayed-completion",
        envelope: { ...wrongRole.envelope, parentContext: { ...wrongRole.envelope.parentContext, role: "general" } },
      })).rejects.toMatchObject({ code: "wrong-parent" });
      expect((await readDurableRecord(wrongRole.recordPath)).status).toBe("blocked");

      await expect(launchMockJob({
        projectRoot: stale.root,
        stateHome: stale.stateHome,
        control: "delayed-completion",
        envelope: { ...stale.envelope, taskRevision: "old-task-revision" },
      })).rejects.toMatchObject({ code: "stale-envelope" });
      expect((await readDurableRecord(stale.recordPath)).status).toBe("blocked");

      duplicateRun = await launchMockJob({ projectRoot: duplicate.root, stateHome: duplicate.stateHome, envelope: duplicate.envelope, control: "delayed-completion" });
      await expect(launchMockJob({ projectRoot: duplicate.root, stateHome: duplicate.stateHome, envelope: duplicate.envelope, control: "delayed-completion" })).rejects.toMatchObject({ code: "duplicate-conflicting-attempt" });
      expect((await readDurableRecord(duplicate.recordPath)).status).toBe("blocked");
      await cancelMockJob(duplicateRun.handle, duplicate.root, duplicate.stateHome, "cleanup duplicate envelope fixture");
    } finally {
      if (duplicateRun) await cleanupMockJob(duplicateRun.handle, duplicate.root, duplicate.stateHome).catch(() => undefined);
      await Promise.all([destroy(malformed), destroy(missingParent), destroy(wrongRole), destroy(stale), destroy(duplicate)]);
    }
  }, 20_000);

  test("makes live, dead, orphaned, unknown, unavailable, and missing reconciliation explicit", async () => {
    const fixture = await makeFixture();
    let launched: Awaited<ReturnType<typeof launchMockJob>> | undefined;
    try {
      launched = await launchMockJob({ projectRoot: fixture.root, stateHome: fixture.stateHome, envelope: fixture.envelope, control: "controller-loss" });
      const entry = (await mapDocument(fixture)).entries as Record<string, Record<string, unknown>>;
      const current = entry[launched.handle.jobId];
      expect((await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 })).classification).toBe("live");

      await writeMap(fixture, {
        [launched.handle.jobId]: { ...current, taskRevision: "orphan-revision", runtimeState: "running" },
      });
      expect((await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 })).classification).toBe("orphaned");

      await writeMap(fixture, {
        [launched.handle.jobId]: { ...current, statePath: join(fixture.root, "missing-state.json"), runtimeState: "running", supervisorPid: 999991, workerPid: 999992, supervisorProcessGroupId: 999991, workerProcessGroupId: 999992 },
      });
      expect((await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 })).classification).toBe("dead");

      await writeMap(fixture, {
        [launched.handle.jobId]: { ...current, statePath: join(fixture.root, "missing-state.json"), runtimeState: "unknown" },
      });
      expect((await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 })).classification).toBe("unknown");

      await writeFile(mapPath(fixture), "not-json\n", "utf8");
      const unavailable = await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 });
      expect(unavailable.classification).toBe("unavailable");
      expect(unavailable.mapAvailability).toBe("malformed");

      await rm(mapPath(fixture), { force: true });
      const missing = await reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 });
      expect(missing.classification).toBe("missing");
      expect((missing.status.durableState as Record<string, unknown>).status).toBe("active");

      // Recreate the map and let the detached worker reach a terminal host
      // state; durable completion is still written explicitly below.
      await writeMap(fixture, { [launched.handle.jobId]: current });
      await eventually(() => observe(handle(launched!.handle)), (value) => value.host.status === "completed");
      const final = await finalizeMockJob(launched.handle, fixture.root, fixture.stateHome);
      expect(final.record.status).toBe("completed");
      expect(final.cleanup.cleaned).toBe(true);
      expect(final.leftovers.runtimeExists).toBe(false);
    } finally {
      if (launched) await cleanupMockJob(launched.handle, fixture.root, fixture.stateHome).catch(() => undefined);
      await destroy(fixture);
    }
  }, 20_000);

  test("proves controller loss while a detached job continues, then reconciles, hands off, and cleans", async () => {
    const fixture = await makeFixture();
    const resultFile = join(fixture.root, "controller-result.json");
    let controller: Bun.Subprocess | undefined;
    try {
      controller = Bun.spawn([
        process.execPath,
        scriptPath,
        "controller-loss",
        "--project-root", fixture.root,
        "--state-home", fixture.stateHome,
        "--control", "controller-loss",
        "--envelope-json", JSON.stringify(fixture.envelope),
        "--result-file", resultFile,
      ], { stdin: "ignore", stdout: "pipe", stderr: "pipe" });
      await eventually(async () => {
        try {
          return JSON.parse(await readFile(resultFile, "utf8")) as { handle: MockHandleFile };
        } catch {
          return null;
        }
      }, (value): value is { handle: MockHandleFile } => value !== null, 5_000);
      const result = JSON.parse(await readFile(resultFile, "utf8")) as { handle: MockHandleFile };
      controller.kill("SIGTERM");
      await controller.exited;

      const afterLoss = await eventually(
        () => reconcileMockJob({ projectRoot: fixture.root, componentPath, stateHome: fixture.stateHome, attempt: 1 }),
        (value) => value.classification === "dead" || value.classification === "live",
        8_000,
      );
      expect(["dead", "live"]).toContain(afterLoss.classification);
      const completed = await eventually(() => observe(handle(result.handle)), (value) => value.host.status === "completed");
      expect(completed.record.status).toBe("active");
      const reconciledHandoff = await finalizeMockJob(result.handle, fixture.root, fixture.stateHome);
      expect(reconciledHandoff.record.status).toBe("completed");
      expect(reconciledHandoff.cleanup.cleaned).toBe(true);
      expect(reconciledHandoff.leftovers).toMatchObject({ processGroupAlive: false, supervisorAlive: false, supervisorProcessGroupAlive: false, runtimeExists: false });
      expect((await readDurableRecord(fixture.recordPath)).events.some((event) => event.event === "handoff-evidence")).toBe(true);
    } finally {
      if (controller) controller.kill("SIGKILL");
      await destroy(fixture);
    }
  }, 20_000);
});
