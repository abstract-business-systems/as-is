import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  DelegateComponentSupervisor,
  FileSystemDurableState,
  readDelegationStatus,
  runtimeJobMapPath,
  type CallerIdentity,
  type DelegateComponentRequest,
  type SupervisorActiveBinding,
} from "./delegate-component.ts";
import { DeterministicMockAdapter } from "./mock-adapter.ts";

const parentTaskRevision = "parent-task-v1";
const childTaskRevision = "child-task-v1";

function recordText(status: string, worker: string, revision: string, execution?: string): string {
  return `---
as-is-version: 2
task:
  status: ${status}
  worker: ${worker}
  updated: 2026-07-27T14:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.30
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 2
    maximum-children: 2
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 20
      source: unavailable
  external-effects: prohibited
acceptance:
  - Complete the local fixture.
---

# Local Fixture

## Task Revision

\`${revision}\`

## Purpose

The record is a deterministic fixture for the generic delegation boundary.

## Progress

Fixture is ready.

## Validation

Pending.

## Result

Pending.

## Blockers And Escalations

None.

## Recovery

Reread this record.

## Next Action

Run the focused test.
${execution ? `
## Execution Resolution


  \`\`\`json
${execution}
  \`\`\`
` : ""}`.replace(/\u001b/g, "");
}

interface Fixture {
  root: string;
  stateHome: string;
  childPath: string;
  caller: CallerIdentity;
  binding: SupervisorActiveBinding;
  supervisor: DelegateComponentSupervisor;
  adapter: DeterministicMockAdapter;
}

async function fixture(options: {
  adapterId?: "opencode" | "shell" | "ci" | "remote";
  preflight?: { state: "allowed" | "denied" | "awaiting-approval" | "unavailable"; reason?: string };
  childWorker?: string;
} = {}): Promise<Fixture> {
  const root = await mkdtemp(join(tmpdir(), "as-is-delegate-boundary-"));
  const stateHome = join(root, "state");
  const parentPath = join(root, "parent");
  const childPath = join(parentPath, "child");
  await mkdir(childPath, { recursive: true, mode: 0o700 });
  const adapterId = options.adapterId ?? "shell";
  const execution = JSON.stringify({
    adapter: adapterId,
    permissionProfile: { workspace: "owned-fixture", processGroupControl: true },
    jobSpecification: { backend: adapterId, fixture: true },
  });
  await writeFile(join(parentPath, "as-is.md"), recordText("active", "orchestrator", parentTaskRevision), { mode: 0o600 });
  await writeFile(
    join(childPath, "as-is.md"),
    recordText("ready", options.childWorker ?? "implementer", childTaskRevision, execution),
    { mode: 0o600 },
  );
  const caller: CallerIdentity = {
    role: "orchestrator",
    componentPath: "parent",
    taskRevision: parentTaskRevision,
    attempt: 1,
  };
  const binding: SupervisorActiveBinding = {
    repositoryRoot: root,
    active: true,
    supervisorAvailable: true,
    toolContextId: "tool-context-1",
    expectedRole: "orchestrator",
    canDelegate: true,
    caller,
    job: { active: true, jobId: "parent-job-1", identity: caller },
  };
  const adapter = new DeterministicMockAdapter(adapterId, {
    preflight: options.preflight,
    completionDelayMilliseconds: 40,
  });
  const supervisor = new DelegateComponentSupervisor({
    projectRoot: root,
    stateHome,
    adapters: [adapter],
    jobId: () => "job-delegate-test-1",
  });
  return { root, stateHome, childPath: "parent/child", caller, binding, supervisor, adapter };
}

function requestFor(fixtureValue: Fixture, overrides: Partial<DelegateComponentRequest["child"]> = {}): DelegateComponentRequest {
  return {
    caller: { ...fixtureValue.caller },
    child: { componentPath: fixtureValue.childPath, ...overrides },
  };
}

async function closeFixture(value: Fixture): Promise<void> {
  expect(value.adapter.activeCount).toBe(0);
  expect(value.adapter.leftoverProcessCount).toBe(0);
  await rm(value.root, { recursive: true, force: true });
}

test("requires every caller field to match the active binding and a fresh durable record", async () => {
  const value = await fixture();
  try {
    const missing = await value.supervisor.invoke({ child: { componentPath: value.childPath } }, value.binding);
    expect(missing.blocker?.code).toBe("missing-caller");
    const noBinding = await value.supervisor.invoke(requestFor(value));
    expect(noBinding.blocker?.code).toBe("missing-caller");

    for (const field of ["role", "componentPath", "taskRevision", "attempt"] as const) {
      const changed = { ...value.caller, [field]: field === "attempt" ? 2 : `${value.caller[field]}-spoof` };
      const result = await value.supervisor.invoke({ caller: changed, child: { componentPath: value.childPath } }, value.binding);
      expect(result.blocker?.code).toBe("mismatched-caller");
      expect(result.outcome).toBe("rejected");
    }

    const freshRecord = await readFile(join(value.root, "parent", "as-is.md"), "utf8");
    await writeFile(join(value.root, "parent", "as-is.md"), freshRecord.replace("parent-task-v1", "parent-task-v2"), { mode: 0o600 });
    const stale = await value.supervisor.invoke(requestFor(value), value.binding);
    expect(stale.blocker?.code).toBe("mismatched-caller");
    expect(value.adapter.launches).toHaveLength(0);
  } finally {
    await closeFixture(value);
  }
});

test("derives parent, minimizes the request, persists a diagnostic JobId, and returns at launch acceptance", async () => {
  const value = await fixture();
  try {
    const request = requestFor(value);
    const startedAt = Number(process.hrtime.bigint());
    const result = await value.supervisor.invoke(request, value.binding);
    const elapsedMilliseconds = Number(process.hrtime.bigint() - BigInt(startedAt)) / 1_000_000;

    expect(result.outcome).toBe("started");
    expect(result.status).toBe("launch-accepted");
    expect(result.launch.checkpoint).toBe("durable-launch-accepted");
    expect(elapsedMilliseconds).toBeLessThan(500);
    expect(value.adapter.isCompleted({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 })).toBe(false);
    expect(value.adapter.activeCount).toBe(1);
    expect(result.parent).toEqual(value.caller);
    expect(result.handle).toEqual({
      jobId: "job-delegate-test-1",
      source: "delegate-component.job-map",
      diagnosticOnly: true,
      lookupKey: false,
    });
    expect(Object.keys(request).sort()).toEqual(["caller", "child"]);
    expect(Object.keys(request.caller).sort()).toEqual(["attempt", "componentPath", "role", "taskRevision"]);
    expect(Object.keys(request.child).sort()).toEqual(["componentPath"]);
    expect("parent" in request).toBe(false);
    const parentClaim = await value.supervisor.invoke({ ...request, parent: { componentPath: "spoofed" } }, value.binding);
    expect(parentClaim.blocker?.code).toBe("mismatched-caller");
    const freeFormChild = await value.supervisor.invoke({
      ...request,
      child: { componentPath: value.childPath, taskScope: "spoofed scope" },
    }, value.binding);
    expect(freeFormChild.blocker?.code).toBe("wrong-component");

    const childRecord = await readFile(join(value.root, value.childPath, "as-is.md"), "utf8");
    expect(childRecord).toContain('"event":"launch-accepted"');
    expect(childRecord).toContain('"diagnosticOnly":true');
    const map = JSON.parse(await readFile(runtimeJobMapPath(value.root, value.stateHome), "utf8")) as { entries: Record<string, { componentPath: string; taskRevision: string; attempt: number }> };
    expect(map.entries["job-delegate-test-1"]).toMatchObject({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 60));
    expect(value.adapter.isCompleted({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 })).toBe(true);
    const cleaned = await value.supervisor.cleanup({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(cleaned.status).toBe("cleanup-complete");
  } finally {
    await closeFixture(value);
  }
});

test("rejects missing parent context, wrong roles, wrong component scope, and arbitrary attempts without fallback", async () => {
  const value = await fixture();
  try {
    const missingParent = await value.supervisor.invoke(requestFor(value), { ...value.binding, job: { ...value.binding.job, active: false } });
    expect(missingParent.blocker?.code).toBe("missing-parent");

    const wrongRole = await value.supervisor.invoke(requestFor(value), { ...value.binding, expectedRole: "implementer" });
    expect(wrongRole.blocker?.code).toBe("wrong-role");

    const outside = await value.supervisor.invoke({ caller: value.caller, child: { componentPath: "sibling" } }, value.binding);
    expect(outside.blocker?.code).toBe("wrong-component");
    const revision = await value.supervisor.invoke(requestFor(value, { taskRevision: "old-child-revision" }), value.binding);
    expect(revision.blocker?.code).toBe("wrong-component");
    const arbitraryAttempt = await value.supervisor.invoke(requestFor(value, { attempt: 4 }), value.binding);
    expect(arbitraryAttempt.blocker?.code).toBe("duplicate-attempt");
    expect(value.adapter.launches).toHaveLength(0);
  } finally {
    await closeFixture(value);
  }
});

test("returns explicit duplicate-attempt and preserves the first stable identity", async () => {
  const value = await fixture();
  try {
    const first = await value.supervisor.invoke(requestFor(value, { attempt: 1 }), value.binding);
    expect(first.outcome).toBe("started");
    const duplicate = await value.supervisor.invoke(requestFor(value, { attempt: 1 }), value.binding);
    expect(duplicate.outcome).toBe("rejected");
    expect(duplicate.blocker?.code).toBe("duplicate-attempt");
    expect(duplicate.stableIdentity).toEqual({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(value.adapter.launches).toHaveLength(1);
    const cancelled = await value.supervisor.cancel({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(cancelled).toMatchObject({ outcome: "cancelled" });
  } finally {
    await closeFixture(value);
  }
});

test("records permission denial and approval wait without submitting or prompting through a fallback", async () => {
  const denied = await fixture({ preflight: { state: "denied", reason: "fixture permission denied" } });
  const waiting = await fixture({ preflight: { state: "awaiting-approval", reason: "fixture approval required" } });
  try {
    const denial = await denied.supervisor.invoke(requestFor(denied), denied.binding);
    expect(denial.outcome).toBe("rejected");
    expect(denial.status).toBe("blocked");
    expect(denial.blocker).toMatchObject({ code: "permission-denied", permissionState: "denied", fallback: "not-permitted" });
    expect(denied.adapter.launches).toHaveLength(0);
    expect(await readFile(join(denied.root, denied.childPath, "as-is.md"), "utf8")).toContain('"permissionState":"denied"');

    const approval = await waiting.supervisor.invoke(requestFor(waiting), waiting.binding);
    expect(approval.outcome).toBe("waiting");
    expect(approval.status).toBe("awaiting-approval");
    expect(approval.blocker).toMatchObject({ code: "permission-denied", permissionState: "awaiting-user-approval" });
    expect(waiting.adapter.launches).toHaveLength(0);
    expect(await readFile(join(waiting.root, waiting.childPath, "as-is.md"), "utf8")).toContain('"permissionState":"awaiting-user-approval"');
  } finally {
    await closeFixture(denied);
    await closeFixture(waiting);
  }
});

test("looks up by path/revision/attempt, keeps JobId diagnostic-only, and cancels with cleanup", async () => {
  const value = await fixture();
  try {
    const started = await value.supervisor.invoke(requestFor(value), value.binding);
    expect(started.outcome).toBe("started");
    const observed = await readDelegationStatus({ projectRoot: value.root, stateHome: value.stateHome, componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(observed.stableIdentity).toEqual({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(observed.runtime.jobId).toEqual({ jobId: "job-delegate-test-1", source: "delegate-component.job-map", diagnosticOnly: true, lookupKey: false });
    expect(observed.runtime.map).toBe("available");
    expect(observed.status).toBe("launch-accepted");

    const cancelled = await value.supervisor.cancel({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(cancelled.outcome).toBe("cancelled");
    expect(cancelled.status).toBe("cleanup-complete");
    expect(value.adapter.cancelled).toHaveLength(1);
    expect(value.adapter.cleaned).toHaveLength(1);
    expect(value.adapter.activeCount).toBe(0);
    expect(value.adapter.leftoverProcessCount).toBe(0);
    const after = await value.supervisor.status({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
    expect(after.durable.recordStatus).toBe("cancelled");
    expect(after.runtime.state).toBe("cleanup-complete");
  } finally {
    await closeFixture(value);
  }
});

test("uses one request/result seam for OpenCode, shell, CI, and remote adapter labels", async () => {
  for (const adapterId of ["opencode", "shell", "ci", "remote"] as const) {
    const value = await fixture({ adapterId });
    try {
      const result = await value.supervisor.invoke(requestFor(value), value.binding);
      expect(result.outcome).toBe("started");
      expect(result.launch.adapter).toBe(adapterId);
      expect(value.adapter.launches[0]?.parent).toEqual(value.caller);
      expect(value.adapter.launches[0]?.jobSpecification).toEqual({ backend: adapterId, fixture: true });
    } finally {
      await value.supervisor.cancel({ componentPath: value.childPath, taskRevision: childTaskRevision, attempt: 1 });
      await closeFixture(value);
    }
  }
});

test("reports unavailable supervisor rather than direct or foreground fallback", async () => {
  const value = await fixture();
  try {
    const unavailable = await value.supervisor.invoke(requestFor(value), { ...value.binding, supervisorAvailable: false });
    expect(unavailable.outcome).toBe("unavailable");
    expect(unavailable.blocker).toMatchObject({ code: "unavailable-supervisor", fallback: "not-permitted" });
    expect(value.adapter.launches).toHaveLength(0);
  } finally {
    await closeFixture(value);
  }
});

test("keeps fresh durable state authoritative when a runtime map is absent", async () => {
  const value = await fixture();
  try {
    const status = await readDelegationStatus({ projectRoot: value.root, stateHome: value.stateHome, componentPath: value.childPath });
    expect(status.taskRevision).toBe(childTaskRevision);
    expect(status.attempt).toBe("unavailable");
    expect(status.runtime.map).toBe("missing");
    expect(status.runtime.jobId).toBe("unavailable");
    expect(status.nextAction).toContain("unavailable");
  } finally {
    await closeFixture(value);
  }
});

test("does not let a configured child worker role be silently replaced", async () => {
  const value = await fixture({ childWorker: "" });
  try {
    const result = await value.supervisor.invoke(requestFor(value), value.binding);
    expect(result.blocker?.code).toBe("wrong-role");
    expect(value.adapter.launches).toHaveLength(0);
  } finally {
    await closeFixture(value);
  }
});

void FileSystemDurableState;
