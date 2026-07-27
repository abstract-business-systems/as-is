import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import {
  cleanup,
  confirmCancellation,
  noLeftover,
  recordHandoff,
  requestCancellation,
  type DurableCheckpoint,
  type JobHandle,
  type RoleChain,
} from "../subprocess-execution-foundation/supervisor.ts";
import { launchComponent, type AdapterLaunchRequest } from "../opencode-launch-adapter/adapter.ts";
import { readComponentStatus, watchComponentStatus } from "./status-watch.ts";

const taskRevision = "status-watch-fixture-revision";
const roleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "status-as-is", parentSessionId: null, source: "focused-status-test" },
  orchestrator: { role: "orchestrator", sessionId: "status-orchestrator", parentSessionId: "status-as-is", source: "focused-status-test" },
  implementer: { role: "implementer", sessionId: "status-implementer", parentSessionId: "status-orchestrator", source: "focused-status-test" },
};

const sleep = (milliseconds: number) => new Promise<void>((resolvePromise) => setTimeout(resolvePromise, milliseconds));

interface Fixture {
  root: string;
  componentPath: string;
  componentDirectory: string;
  stateHome: string;
}

function checkpoint(
  event: string,
  details: Record<string, unknown> = {},
  jobId = "diagnostic-fixture-job",
  source = "focused-status-test",
  observedAt = new Date().toISOString(),
): DurableCheckpoint {
  return { operation: "test", event, jobId, source, observedAt, details };
}

function recordContents(
  status: "ready" | "active" | "completed" | "failed" | "cancelled",
  updated: string,
  events: DurableCheckpoint[] = [],
): string {
  const ledger = events.length > 0
    ? `\n\n## Execution Foundation Checkpoints\n\n<!-- subprocess-execution-foundation:begin -->\n${events.map((event) => JSON.stringify(event)).join("\n")}\n<!-- subprocess-execution-foundation:end -->\n`
    : "";
  return `---
as-is-version: 2
task:
  status: ${status}
  worker: implementer
  updated: ${updated}
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
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
  external-effects: require-current-turn-user-approval
acceptance:
  - focused status watch fixture
---

# Status Fixture

## Task Revision

\`${taskRevision}\`

## Progress

Focused fixture progress.

## Validation

- focused fixture validation

## Result

Fixture result is durable.

## Blockers And Escalations

None.

## Recovery

Use the component path and task revision; runtime state is supplementary.

## Next Action

Observe the durable record and take no action from a missing runtime map.
${ledger}`;
}

async function fixture(
  status: "ready" | "active" | "completed" | "failed" | "cancelled" = "active",
  updated = new Date().toISOString(),
  events: DurableCheckpoint[] = [],
): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "as-is-status-watch-"));
  const componentPath = "child";
  const componentDirectory = join(root, componentPath);
  const stateHome = join(root, "xdg-state");
  await mkdir(componentDirectory, { recursive: true });
  await writeFile(join(componentDirectory, "as-is.md"), recordContents(status, updated, events), "utf8");
  return { root, componentPath, componentDirectory, stateHome };
}

function projectKey(root: string): string {
  return `project-${createHash("sha256").update(resolve(root)).digest("hex").slice(0, 16)}`;
}

function mapPath(data: Fixture): string {
  return join(data.stateHome, "as-is", "projects", projectKey(data.root), "runtime", "job-map.json");
}

async function writeRuntimeMap(data: Fixture, entry: Record<string, unknown>): Promise<void> {
  const path = mapPath(data);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify({ [String(entry.jobId ?? "fixture-job")]: entry }, null, 2)}\n`, "utf8");
}

async function readStatus(data: Fixture, attempt?: number, now?: Date): Promise<Record<string, unknown>> {
  return readComponentStatus({
    projectRoot: data.root,
    componentPath: data.componentPath,
    attempt,
    stateHome: data.stateHome,
    now,
  });
}

function eventFrom(result: Awaited<ReturnType<typeof launchComponent>>, event: string): DurableCheckpoint | undefined {
  return result.record.events.find((candidate) => candidate.event === event);
}

async function eventuallyStatus(
  data: Fixture,
  matches: (value: Record<string, unknown>) => boolean,
  timeoutMilliseconds = 6_000,
): Promise<Record<string, unknown>> {
  const deadline = Date.now() + timeoutMilliseconds;
  let value = await readStatus(data);
  while (!matches(value) && Date.now() < deadline) {
    await sleep(25);
    value = await readStatus(data);
  }
  if (!matches(value)) throw new Error(`status condition not observed: ${JSON.stringify(value)}`);
  return value;
}

/**
 * The detached supervisor is allowed to append durable observations while a
 * status/watch query is running. Establish a real quiescent boundary before
 * taking the byte-preservation snapshot: the final supervisor checkpoint is
 * `budget-observed`, and no owned process may remain alive after it.
 */
async function waitForSupervisorQuiescence(data: Fixture, handle: JobHandle): Promise<void> {
  await eventuallyStatus(data, (value) => {
    const runtime = value.runtime as Record<string, unknown>;
    const lastEvent = value.lastEvent as Record<string, unknown>;
    return runtime.hostStatus === "completed" && lastEvent.event === "budget-observed";
  });
  const deadline = Date.now() + 3_000;
  while (Date.now() < deadline) {
    const leftovers = await noLeftover(handle);
    if (leftovers.processGroupAlive === false
      && leftovers.supervisorAlive === false
      && leftovers.supervisorProcessGroupAlive === false) return;
    await sleep(10);
  }
  throw new Error("detached supervisor did not become quiescent within focused test bound");
}

async function cleanupHandle(data: Fixture, handle: JobHandle | undefined): Promise<void> {
  if (!handle) return;
  try {
    await requestCancellation(handle, "focused status test cleanup");
    await confirmCancellation(handle, 3_000);
  } catch {
    // A completed or already-cleaned fixture does not need cancellation.
  }
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const result = await cleanup(handle).catch(() => ({ cleaned: false }));
    if (result.cleaned) return;
    await sleep(25);
  }
}

function launchRequest(data: Fixture): AdapterLaunchRequest {
  return {
    projectRoot: data.root,
    componentPath: data.componentPath,
    parentContext: { componentPath: ".", role: "orchestrator", sessionId: roleChain.orchestrator.sessionId, parentSessionId: roleChain.asIs.sessionId },
    roleChain,
    job: {
      adapter: "opencode",
      executionMode: "supervisor-owned-detached",
      componentPath: data.componentPath,
      workerRole: "implementer",
      command: [process.execPath, "-e", "await Bun.sleep(300); console.log('status-watch-worker');"],
      permissionProfile: {
        source: "focused-status-test",
        approvedWorkspace: true,
        processGroupControl: true,
        standardInput: "disabled",
        eventPersistence: true,
        watchdog: true,
        userEventBubbling: true,
      },
      checkInSeconds: 0.2,
      startDelayMilliseconds: 120,
    },
  };
}

describe("component-status-watch", () => {
  test("resolves stable path/attempt identity after detached submit and repeats read-only watch observations", async () => {
    const data = await fixture("ready");
    let handle: JobHandle | undefined;
    try {
      const launched = await launchComponent(launchRequest(data));
      handle = launched.handle;
      expect(launched.outcome).toBe("started");

      const accepted = eventFrom(launched, "adapter-envelope-recorded");
      expect(accepted).toBeDefined();
      await writeRuntimeMap(data, {
        jobId: handle.jobId,
        componentPath: data.componentPath,
        taskRevision: launched.envelope.taskRevision,
        attempt: launched.envelope.attempt,
        adapter: "opencode",
        statePath: handle.statePath,
        runtimeDir: handle.runtimeDir,
        runtimeState: "waiting",
        lastObservedAt: new Date().toISOString(),
      });

      const withoutAttempt = await readStatus(data);
      const withAttempt = await readStatus(data, 1);
      expect(withoutAttempt.resolution).toMatchObject({ status: "resolved" });
      expect(withoutAttempt.identity).toMatchObject({ componentPath: data.componentPath, taskRevision: launched.envelope.taskRevision, attempt: 1, stable: true });
      expect(withAttempt.identity).toEqual(withoutAttempt.identity);
      expect(withoutAttempt.runtimeJobId).toMatchObject({ value: handle.jobId, diagnosticOnly: true, lookupKey: false });
      expect(withoutAttempt.adapter).toMatchObject({ name: "opencode-launch-adapter" });
      expect(withoutAttempt.roleChain).toMatchObject({ status: "complete", asIs: { role: "as-is" }, orchestrator: { role: "orchestrator" }, implementer: { role: "implementer" } });
      expect((withoutAttempt.durableState as Record<string, unknown>).status).toBe("active");

      const watched: Record<string, unknown>[] = [];
      for await (const observation of watchComponentStatus({ ...{
        projectRoot: data.root,
        componentPath: data.componentPath,
        stateHome: data.stateHome,
      }, intervalMilliseconds: 10, count: 3 })) watched.push(observation);
      expect(watched).toHaveLength(3);
      expect(watched.map((entry) => (entry.watch as Record<string, unknown>).sequence)).toEqual([0, 1, 2]);
      expect(watched.every((entry) => (entry.watch as Record<string, unknown>).completionInferredFromPolling === false)).toBe(true);
      expect(watched.every((entry) => (entry.identity as Record<string, unknown>).key === (withoutAttempt.identity as Record<string, unknown>).key)).toBe(true);

      await waitForSupervisorQuiescence(data, handle);
      const beforeReadOnlyQueries = await readFile(join(data.componentDirectory, "as-is.md"), "utf8");
      const quiescentStatus = await readStatus(data, 1);
      const quiescentWatched: Record<string, unknown>[] = [];
      for await (const observation of watchComponentStatus({ ...{
        projectRoot: data.root,
        componentPath: data.componentPath,
        stateHome: data.stateHome,
        attempt: 1,
      }, intervalMilliseconds: 10, count: 3 })) quiescentWatched.push(observation);
      expect(quiescentStatus.identity).toEqual(withoutAttempt.identity);
      expect(quiescentWatched.map((entry) => (entry.identity as Record<string, unknown>).key)).toEqual([
        (withoutAttempt.identity as Record<string, unknown>).key,
        (withoutAttempt.identity as Record<string, unknown>).key,
        (withoutAttempt.identity as Record<string, unknown>).key,
      ]);
      expect(quiescentWatched.every((entry) => (entry.watch as Record<string, unknown>).completionInferredFromPolling === false)).toBe(true);
      expect(await readFile(join(data.componentDirectory, "as-is.md"), "utf8")).toBe(beforeReadOnlyQueries);
    } finally {
      await cleanupHandle(data, handle);
      await rm(data.root, { recursive: true, force: true });
    }
  });

  test("reloads the persisted map and reconciles orphaned and matching runtime observations", async () => {
    const data = await fixture("ready");
    let handle: JobHandle | undefined;
    try {
      const launched = await launchComponent(launchRequest(data));
      handle = launched.handle;
      const entry = {
        jobId: handle.jobId,
        componentPath: data.componentPath,
        taskRevision: launched.envelope.taskRevision,
        attempt: 1,
        adapter: "opencode",
        statePath: handle.statePath,
        runtimeDir: handle.runtimeDir,
        runtimeState: "waiting",
        lastObservedAt: new Date().toISOString(),
      };
      await writeRuntimeMap(data, entry);
      const reconciled = await readStatus(data, 1);
      expect(reconciled.reconciliation).toMatchObject({ status: "reconciled", stableIdentityPreserved: true });

      await writeRuntimeMap(data, { ...entry, taskRevision: "orphaned-runtime-revision" });
      const orphaned = await readStatus(data, 1);
      expect(orphaned.runtime).toMatchObject({ classification: "orphaned" });
      expect(orphaned.reconciliation).toMatchObject({ status: "orphaned" });
      expect((orphaned.durableState as Record<string, unknown>).status).toBe("active");

      await writeRuntimeMap(data, entry);
      const reloaded = await readStatus(data, 1);
      expect(reloaded.reconciliation).toMatchObject({ status: "reconciled" });
      expect((reloaded.runtimeMap as Record<string, unknown>).availability).toBe("available");
    } finally {
      await cleanupHandle(data, handle);
      await rm(data.root, { recursive: true, force: true });
    }
  });

  test("keeps missing, unavailable, terminal, stale, and unknown classifications explicit", async () => {
    const missing = await fixture("active");
    const terminal = await fixture("completed", new Date().toISOString(), [checkpoint("host-completed", { attempt: 1, taskRevision })]);
    const staleTime = new Date(Date.now() - 5_000).toISOString();
    const stale = await fixture("active", staleTime, [checkpoint("launch-accepted", { attempt: 1, taskRevision })]);
    const unknown = await fixture("active", "not-a-date", [checkpoint("launch-accepted", { attempt: 1, taskRevision })]);
    try {
      const unavailable = await readComponentStatus({ projectRoot: missing.root, componentPath: "does-not-exist", stateHome: missing.stateHome });
      expect(unavailable.resolution).toMatchObject({ status: "missing" });
      expect(unavailable.identity).toMatchObject({ componentPath: "does-not-exist", taskRevision: "unavailable", attempt: "unavailable" });
      expect((unavailable.durableState as Record<string, unknown>).classification).toBe("missing");

      const terminalStatus = await readStatus(terminal, 1);
      expect(terminalStatus.resolution).toMatchObject({ status: "resolved" });
      expect(terminalStatus.durableState).toMatchObject({ status: "completed", classification: "terminal" });
      expect((terminalStatus.stale as Record<string, unknown>).classification).toBe("unknown");

      const staleStatus = await readComponentStatus({ projectRoot: stale.root, componentPath: stale.componentPath, stateHome: stale.stateHome, checkInSeconds: 1, now: new Date() });
      expect(staleStatus.stale).toMatchObject({ classification: "stale" });
      expect((staleStatus.runtime as Record<string, unknown>).classification).toBe("missing");

      const unknownStatus = await readStatus(unknown, 1);
      expect(unknownStatus.stale).toMatchObject({ classification: "unknown" });
      expect(unknownStatus.runtime).toMatchObject({ classification: "missing" });
    } finally {
      await Promise.all([
        rm(missing.root, { recursive: true, force: true }),
        rm(terminal.root, { recursive: true, force: true }),
        rm(stale.root, { recursive: true, force: true }),
        rm(unknown.root, { recursive: true, force: true }),
      ]);
    }
  });

  test("preserves durable terminal state and proves accepted cleanup leaves no runtime or process leftovers", async () => {
    const data = await fixture("ready");
    let handle: JobHandle | undefined;
    try {
      const launched = await launchComponent(launchRequest(data));
      handle = launched.handle;
      await writeRuntimeMap(data, {
        jobId: handle.jobId,
        componentPath: data.componentPath,
        taskRevision: launched.envelope.taskRevision,
        attempt: 1,
        adapter: "opencode",
        statePath: handle.statePath,
        runtimeDir: handle.runtimeDir,
        runtimeState: "running",
        lastObservedAt: new Date().toISOString(),
      });
      const completed = await eventuallyStatus(data, (value) => (value.runtime as Record<string, unknown>).hostStatus === "completed");
      expect(completed.identity).toMatchObject({ attempt: 1 });
      expect((completed.durableState as Record<string, unknown>).status).toBe("active");

      const handoff = await recordHandoff(handle, {
        validation: ["focused status/watch lifecycle passed"],
        result: "detached fixture was observed through the stable path and handed off",
        descendantsTerminal: true,
        failedOrCancelledDescendants: [],
      });
      expect(handoff.status).toBe("completed");
      const terminal = await readStatus(data, 1);
      expect(terminal.durableState).toMatchObject({ status: "completed", classification: "terminal" });

      let cleaned = false;
      for (let attempt = 0; attempt < 120; attempt += 1) {
        const result = await cleanup(handle);
        if (result.cleaned) {
          cleaned = true;
          break;
        }
        await sleep(25);
      }
      expect(cleaned).toBe(true);
      const leftovers = await noLeftover(handle);
      expect(leftovers.processGroupAlive).toBe(false);
      expect(leftovers.supervisorAlive).toBe(false);
      expect(leftovers.supervisorProcessGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);

      await rm(mapPath(data), { force: true });
      const afterCleanup = await readStatus(data, 1);
      expect(afterCleanup.durableState).toMatchObject({ status: "completed", classification: "terminal" });
      expect(afterCleanup.runtime).toMatchObject({ classification: "missing" });
      expect(afterCleanup.nextSafeAction).toMatchObject({ source: "durable-component-record" });
      expect((await readFile(join(data.componentDirectory, "as-is.md"), "utf8"))).toContain("handoff-evidence");
    } finally {
      await cleanupHandle(data, handle);
      await rm(data.root, { recursive: true, force: true });
    }
  });
});
