import { expect, test } from "bun:test";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  cleanupOpenCodeJob,
  confirmOpenCodeCancellation,
  discoverOpenCode,
  launchOpenCodeComponent,
  readOpenCodeStatus,
  readRuntimeMap,
  reconcileOpenCodeRuntimeMap,
  runtimeMapPath,
  watchOpenCodeStatus,
  cancelOpenCodeJob,
  observeOpenCodeJob,
  type OpenCodeJobHandle,
} from "./opencode-host-integration.ts";
import { AdapterLaunchError } from "../opencode-launch-adapter/adapter.ts";
import { noLeftover, recordHandoff } from "../subprocess-execution-foundation/supervisor.ts";

const roleChain = {
  asIs: { role: "as-is" as const, sessionId: "fixture-as-is", parentSessionId: null, source: "fresh-host-fixture" },
  orchestrator: { role: "orchestrator" as const, sessionId: "fixture-orchestrator", parentSessionId: "fixture-as-is", source: "fresh-host-fixture" },
  implementer: { role: "implementer" as const, sessionId: "fixture-implementer", parentSessionId: "fixture-orchestrator", source: "fresh-host-fixture" },
};

const permissionProfile = {
  source: "fresh-host-fixture-permission-preflight",
  approvedWorkspace: true,
  processGroupControl: true,
  standardInput: "disabled" as const,
  eventPersistence: true,
  watchdog: true,
  userEventBubbling: true,
};

const record = `---
as-is-version: 2
task:
  status: ready
  worker: implementer
  updated: 2026-07-27T12:00:00Z
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
      allocated-seconds: 30
      spent-seconds: 0
      reserve-seconds: 1
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Fresh local OpenCode mediation fixture.

# Fixture Component

## Purpose

Exercise the component-local OpenCode bridge.

## Requirement

Preserve the durable component path and mediated role chain.

## Plan

Run through the detached adapter fixture.

## Progress

Fixture is ready.

## Validation

Pending.

## Result

Pending.

## Blockers And Escalations

None.

## Recovery

Reread this record and reconcile the private map.

## Next Action

Observe by component path and attempt.
`;

interface Fixture {
  root: string;
  stateHome: string;
  componentPath: string;
  binary: string;
}

async function fixture(delaySeconds: string): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "as-is-opencode-host-"));
  const stateHome = join(root, "xdg-state");
  const componentPath = "fixture-component";
  await mkdir(join(root, componentPath), { recursive: true, mode: 0o700 });
  await writeFile(join(root, componentPath, "as-is.md"), record, { encoding: "utf8", mode: 0o600 });
  const binary = join(root, "opencode-fixture.sh");
  await writeFile(binary, `#!/bin/sh
sleep ${delaySeconds}
printf '%s\\n' '{"type":"session.created","sessionID":"oc-as-is","parentID":null,"agent":"as-is"}'
printf '%s\\n' '{"type":"task","sessionID":"oc-orchestrator","parentID":"oc-as-is","subagent_type":"orchestrator","agent":"orchestrator"}'
printf '%s\\n' '{"type":"task","sessionID":"oc-implementer","parentID":"oc-orchestrator","subagent_type":"implementer","agent":"implementer"}'
exit 0
`, { encoding: "utf8", mode: 0o700 });
  await chmod(binary, 0o700);
  return { root, stateHome, componentPath, binary };
}

function launchInput(data: Fixture) {
  return {
    projectRoot: data.root,
    componentPath: data.componentPath,
    parentContext: { componentPath: ".", role: "orchestrator" as const, sessionId: roleChain.orchestrator.sessionId, parentSessionId: roleChain.asIs.sessionId },
    roleChain,
    stateHome: data.stateHome,
    opencodeBinary: data.binary,
    permissionProfile,
    checkInSeconds: 0.2,
  };
}

async function eventually(handle: OpenCodeJobHandle, expected: string): Promise<void> {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const status = await readOpenCodeStatus({ projectRoot: handle.projectRoot, componentPath: handle.component, attempt: handle.attempt, stateHome: handle.stateHome });
    const runtime = status.runtime as Record<string, unknown>;
    if (runtime.hostStatus === expected) return;
    await Bun.sleep(25);
  }
  throw new Error(`host status ${expected} was not observed`);
}

test("composes detached OpenCode mediation, runtime-map reload, repeated watch, terminal handoff, and cleanup", async () => {
  const data = await fixture("0.25");
  let handle: OpenCodeJobHandle | undefined;
  try {
    const startedAt = Number(process.hrtime.bigint());
    const launched = await launchOpenCodeComponent(launchInput(data));
    const elapsed = Number(process.hrtime.bigint() - BigInt(startedAt)) / 1_000_000;
    handle = launched.handle;
    expect(launched.outcome).toBe("started");
    expect(launched.runtimeMap.persisted).toBe(true);
    expect(elapsed).toBeLessThan(700);
    expect(launched.envelope.componentPath).toBe(data.componentPath);
    expect(launched.envelope.attempt).toBe(1);
    expect(launched.envelope.parentContext.role).toBe("orchestrator");
    expect(launched.envelope.jobSpecification.workerRole).toBe("implementer");
    expect("jobId" in launched.envelope).toBe(false);

    const firstMap = await readRuntimeMap(data.root, data.stateHome);
    expect(firstMap.availability).toBe("available");
    expect(firstMap.map?.entries[handle.jobId]).toMatchObject({
      componentPath: data.componentPath,
      taskRevision: launched.envelope.taskRevision,
      attempt: 1,
      runtimeState: "launch-accepted",
    });

    const firstStatus = await readOpenCodeStatus({ projectRoot: data.root, componentPath: data.componentPath, stateHome: data.stateHome });
    expect(firstStatus.identity).toMatchObject({ componentPath: data.componentPath, taskRevision: launched.envelope.taskRevision, attempt: 1, stable: true });
    expect((firstStatus.runtimeMap as Record<string, unknown>).availability).toBe("available");
    const staleStatus = await readOpenCodeStatus({
      projectRoot: data.root,
      componentPath: data.componentPath,
      stateHome: data.stateHome,
      now: new Date(Date.now() + 10_000),
    });
    expect((staleStatus.stale as Record<string, unknown>).classification).toBe("stale");

    const mapPath = runtimeMapPath(data.root, data.stateHome);
    const savedMap = JSON.parse(await readFile(mapPath, "utf8")) as { version: 1; updatedAt: string; entries: Record<string, Record<string, unknown>> };
    const originalMap = JSON.parse(JSON.stringify(savedMap)) as typeof savedMap;
    savedMap.entries[handle.jobId].statePath = join(data.root, "missing-private-state.json");
    savedMap.entries[handle.jobId].runtimeState = "unavailable";
    savedMap.entries[handle.jobId].processHandles = { supervisorPid: null, supervisorProcessGroupId: null, workerPid: null, workerProcessGroupId: null };
    await writeFile(mapPath, `${JSON.stringify(savedMap)}\n`, { encoding: "utf8", mode: 0o600 });
    const unknownRuntime = await readOpenCodeStatus({ projectRoot: data.root, componentPath: data.componentPath, attempt: 1, stateHome: data.stateHome });
    expect(["unknown", "unavailable"].includes((unknownRuntime.runtime as Record<string, unknown>).classification as string)).toBe(true);
    await writeFile(mapPath, `${JSON.stringify(originalMap)}\n`, { encoding: "utf8", mode: 0o600 });

    const watched: Record<string, unknown>[] = [];
    for await (const item of watchOpenCodeStatus({ projectRoot: data.root, componentPath: data.componentPath, stateHome: data.stateHome, intervalMilliseconds: 10, count: 3 })) watched.push(item);
    expect(watched).toHaveLength(3);
    expect(watched.map((item) => (item.watch as Record<string, unknown>).sequence)).toEqual([0, 1, 2]);
    expect(watched.every((item) => (item.watch as Record<string, unknown>).completionInferredFromPolling === false)).toBe(true);

    const reloaded = await reconcileOpenCodeRuntimeMap(data.root, data.stateHome);
    expect(reloaded.map?.entries[handle.jobId]).toMatchObject({ taskRevision: launched.envelope.taskRevision, attempt: 1 });
    await eventually(handle, "completed");
    expect((await readRuntimeMap(data.root, data.stateHome)).map?.entries[handle.jobId]).toMatchObject({ runtimeState: "terminal" });
    await observeOpenCodeJob(handle);
    await recordHandoff(handle, {
      validation: ["fresh local wrapper emitted attributed OpenCode session/task metadata"],
      result: "detached mediation fixture completed under supervisor ownership",
      descendantsTerminal: true,
      failedOrCancelledDescendants: [],
    });
    const terminal = await readOpenCodeStatus({ projectRoot: data.root, componentPath: data.componentPath, attempt: 1, stateHome: data.stateHome });
    expect((terminal.runtime as Record<string, unknown>).classification).toBe("terminal");
    expect((terminal.lastEvent as Record<string, unknown>).event).toBe("handoff-evidence");
    expect(terminal.roleChain).toMatchObject({ asIs: { role: "as-is" }, orchestrator: { role: "orchestrator" }, implementer: { role: "implementer" } });
    const cleaned = await cleanupOpenCodeJob(handle);
    expect(cleaned.cleaned).toBe(true);
    expect((await noLeftover(handle)).runtimeExists).toBe(false);
    expect((await noLeftover(handle)).processGroupAlive).toBe(false);
    const afterCleanup = await readRuntimeMap(data.root, data.stateHome);
    expect(afterCleanup.map?.entries[handle.jobId]).toMatchObject({ runtimeState: "cleanup", cleanupState: "complete" });

    await rm(runtimeMapPath(data.root, data.stateHome), { force: true });
    const missingRuntime = await readOpenCodeStatus({ projectRoot: data.root, componentPath: data.componentPath, attempt: 1, stateHome: data.stateHome });
    expect((missingRuntime.runtime as Record<string, unknown>).classification).toBe("missing");
    expect((missingRuntime.durableState as Record<string, unknown>).classification).toBe("terminal");
  } finally {
    if (handle) await cleanupOpenCodeJob(handle).catch(() => undefined);
    await rm(data.root, { recursive: true, force: true });
  }
});

test("rejects duplicate attempts and proactive permission denial without fallback", async () => {
  const denied = await fixture("0.05");
  try {
    let error: unknown;
    try {
      await launchOpenCodeComponent({ ...launchInput(denied), permissionProfile: { ...permissionProfile, userEventBubbling: false } });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(AdapterLaunchError);
    expect((error as AdapterLaunchError).code).toBe("permission-preflight-failed");
    expect(await readFile(join(denied.root, denied.componentPath, "as-is.md"), "utf8")).toContain("permission-preflight-failed");
  } finally {
    await rm(denied.root, { recursive: true, force: true });
  }

  const duplicate = await fixture("10");
  let handle: OpenCodeJobHandle | undefined;
  try {
    const launched = await launchOpenCodeComponent(launchInput(duplicate));
    handle = launched.handle;
    let error: unknown;
    try {
      await launchOpenCodeComponent(launchInput(duplicate));
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(AdapterLaunchError);
    expect((error as AdapterLaunchError).code).toBe("duplicate-conflicting-attempt");
    await cancelOpenCodeJob(handle, "duplicate fixture cleanup");
    await confirmOpenCodeCancellation(handle, 3_000);
    expect((await cleanupOpenCodeJob(handle)).cleaned).toBe(true);
  } finally {
    if (handle) await cleanupOpenCodeJob(handle).catch(() => undefined);
    await rm(duplicate.root, { recursive: true, force: true });
  }
});

test("records cancellation and explicitly reconciles an orphaned map without inferring completion", async () => {
  const data = await fixture("10");
  let handle: OpenCodeJobHandle | undefined;
  try {
    const launched = await launchOpenCodeComponent(launchInput(data));
    handle = launched.handle;
    const cancelled = await cancelOpenCodeJob(handle, "fresh fixture cancellation");
    expect(["progressed", "cancelled"].includes(cancelled.outcome)).toBe(true);
    const confirmed = await confirmOpenCodeCancellation(handle, 3_000);
    expect(confirmed.record.status).toBe("cancelled");
    const cancellationMap = await readRuntimeMap(data.root, data.stateHome);
    expect(cancellationMap.map?.entries[handle.jobId]).toMatchObject({ runtimeState: "cancellation" });

    const mapPath = runtimeMapPath(data.root, data.stateHome);
    const map = JSON.parse(await readFile(mapPath, "utf8")) as { version: 1; updatedAt: string; entries: Record<string, Record<string, unknown>> };
    map.entries[handle.jobId].taskRevision = "stale-revision";
    await writeFile(mapPath, `${JSON.stringify(map)}\n`, { encoding: "utf8", mode: 0o600 });
    const orphaned = await reconcileOpenCodeRuntimeMap(data.root, data.stateHome);
    expect(orphaned.map?.entries[handle.jobId]).toMatchObject({ runtimeState: "orphaned", reconciliationState: "orphaned" });

    const cleaned = await cleanupOpenCodeJob(handle);
    expect(cleaned.cleaned).toBe(true);
  } finally {
    if (handle) {
      await confirmOpenCodeCancellation(handle, 3_000).catch(() => undefined);
      await cleanupOpenCodeJob(handle).catch(() => undefined);
    }
    await rm(data.root, { recursive: true, force: true });
  }
});

test("discovers the installed OpenCode host without claiming a live model/session connection", async () => {
  const discovered = await discoverOpenCode();
  expect(discovered.available).toBe(true);
  expect(discovered.version).toBe("1.17.18");
  expect(discovered.source).toBe("host-command-discovery");
});
