import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  AdapterLaunchError,
  LAUNCH_MODE,
  launchComponent,
  type AdapterLaunchRequest,
  type ProactivePermissionProfile,
  type ResolvedOpenCodeJobSpecification,
} from "./adapter.ts";
import {
  cleanup,
  noLeftover,
  observe,
  recordHandoff,
  type RoleChain,
} from "../subprocess-execution-foundation/supervisor.ts";

const workerRoleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "as-is-test", parentSessionId: null, source: "integration-test" },
  orchestrator: {
    role: "orchestrator",
    sessionId: "orchestrator-test",
    parentSessionId: "as-is-test",
    source: "integration-test",
  },
  implementer: {
    role: "implementer",
    sessionId: "implementer-test",
    parentSessionId: "orchestrator-test",
    source: "integration-test",
  },
};

const permissionProfile: ProactivePermissionProfile = {
  source: "focused-integration-host",
  approvedWorkspace: true,
  processGroupControl: true,
  standardInput: "disabled",
  eventPersistence: true,
  watchdog: true,
  userEventBubbling: true,
};

const recordText = `---
as-is-version: 2
task:
  status: ready
  worker: implementer
  updated: 2026-07-27T10:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 3
      spent-seconds: 0
      reserve-seconds: 0.1
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Focused delayed-worker launch seam validation.
---

# Delayed Worker Fixture

## Purpose

Provide a harmless delayed worker for the adapter boundary test.

## Requirement

Run no external effect and leave the durable checkpoint as the authority.

## Plan

Launch once through the detached supervisor.

## Progress

Ready for the focused integration check.

## Validation

Pending.

## Result

Pending.

## Blockers And Escalations

None.

## Recovery

Reread this fixture record and preserve private supervisor ownership.

## Next Action

Run the focused test.
`;

async function fixture(name: string): Promise<{ root: string; componentPath: string; recordPath: string }> {
  const root = await mkdtemp(join(tmpdir(), "as-is-opencode-adapter-"));
  const componentPath = "delayed-component";
  const componentDirectory = join(root, componentPath);
  await mkdir(componentDirectory, { recursive: true, mode: 0o700 });
  const recordPath = join(componentDirectory, "as-is.md");
  await writeFile(recordPath, recordText.replace("Delayed Worker Fixture", name), { encoding: "utf8", mode: 0o600 });
  return { root, componentPath, recordPath };
}

function requestFor(
  root: string,
  componentPath: string,
  overrides: Partial<ResolvedOpenCodeJobSpecification> = {},
): AdapterLaunchRequest {
  return {
    projectRoot: root,
    componentPath,
    parentContext: {
      componentPath: ".",
      role: "orchestrator",
      sessionId: workerRoleChain.orchestrator.sessionId,
      parentSessionId: workerRoleChain.asIs.sessionId,
    },
    roleChain: workerRoleChain,
    job: {
      adapter: "opencode",
      executionMode: LAUNCH_MODE,
      componentPath,
      workerRole: "implementer",
      command: [process.execPath, "-e", "setTimeout(() => process.exit(0), 900)"],
      permissionProfile,
      checkInSeconds: 1,
      startDelayMilliseconds: 100,
      ...overrides,
    },
  };
}

async function expectRejected(request: AdapterLaunchRequest, code: string): Promise<void> {
  let error: unknown;
  try {
    await launchComponent(request);
  } catch (caught) {
    error = caught;
  }
  expect(error).toBeInstanceOf(AdapterLaunchError);
  expect((error as AdapterLaunchError).code).toBe(code);
}

async function waitForWorker(handle: Parameters<typeof observe>[0]): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const observation = await observe(handle);
    if (observation.host.status === "completed") return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
  }
  throw new Error("delayed worker did not complete within focused test bound");
}

test("launches a delayed implementer after proactive checks and leaves cleanup to supervisor", async () => {
  const valid = await fixture("Delayed Worker Fixture");
  try {
    const startedAt = Number(process.hrtime.bigint());
    const result = await launchComponent(requestFor(valid.root, valid.componentPath));
    const elapsedMilliseconds = Number(process.hrtime.bigint() - BigInt(startedAt)) / 1_000_000;

    expect(result.outcome).toBe("started");
    expect(elapsedMilliseconds).toBeLessThan(700);
    expect(result.record.status).toBe("active");
    expect(result.record.events.some((event) => event.event === "launch-accepted")).toBe(true);
    expect(result.record.events.some((event) => event.event === "adapter-envelope-recorded")).toBe(true);
    expect(Object.keys(result.envelope).sort()).toEqual([
      "attempt",
      "componentPath",
      "jobSpecification",
      "parentContext",
      "recordRevision",
      "taskRevision",
    ].sort());
    expect(result.envelope.componentPath).toBe(valid.componentPath);
    expect(result.envelope.attempt).toBe(1);
    expect(result.envelope.parentContext.role).toBe("orchestrator");
    expect(result.envelope.jobSpecification.workerRole).toBe("implementer");
    expect("jobId" in result.envelope).toBe(false);

    await expectRejected(requestFor(valid.root, valid.componentPath), "duplicate-conflicting-attempt");

    await waitForWorker(result.handle);
    await recordHandoff(result.handle, {
      validation: ["delayed worker completed under supervisor ownership"],
      result: "focused launch seam completed",
      descendantsTerminal: true,
      failedOrCancelledDescendants: [],
    });
    let cleaned = false;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const cleanupResult = await cleanup(result.handle);
      if (cleanupResult.cleaned) {
        cleaned = true;
        break;
      }
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
    }
    expect(cleaned).toBe(true);
    const leftover = await noLeftover(result.handle);
    expect(leftover.processGroupAlive).toBe(false);
    expect(leftover.supervisorAlive).toBe(false);
    expect(leftover.supervisorProcessGroupAlive).toBe(false);
    expect(leftover.runtimeExists).toBe(false);
  } finally {
    await rm(valid.root, { recursive: true, force: true });
  }
});

test("rejects wrong role, missing permission preflight, and foreground fallback before submission", async () => {
  const wrongRole = await fixture("Wrong Role Fixture");
  const missingPermission = await fixture("Permission Fixture");
  const foreground = await fixture("Foreground Fixture");
  try {
    await expectRejected(requestFor(wrongRole.root, wrongRole.componentPath, { workerRole: "general" }), "invalid-job-specification");
    await expectRejected(
      requestFor(missingPermission.root, missingPermission.componentPath, {
        permissionProfile: { ...permissionProfile, userEventBubbling: false },
      }),
      "permission-preflight-failed",
    );
    await expectRejected(
      requestFor(foreground.root, foreground.componentPath, {
        executionMode: "foreground" as typeof LAUNCH_MODE,
      }),
      "invalid-job-specification",
    );

    const wrongRoleRecord = await readFile(wrongRole.recordPath, "utf8");
    const permissionRecord = await readFile(missingPermission.recordPath, "utf8");
    const foregroundRecord = await readFile(foreground.recordPath, "utf8");
    expect(wrongRoleRecord).toContain("\"blocker\":\"invalid-job-specification\"");
    expect(permissionRecord).toContain("\"blocker\":\"permission-preflight-failed\"");
    expect(foregroundRecord).toContain("\"blocker\":\"invalid-job-specification\"");
    expect(wrongRoleRecord).not.toContain("launch-accepted");
    expect(permissionRecord).not.toContain("launch-accepted");
    expect(foregroundRecord).not.toContain("launch-accepted");
  } finally {
    await Promise.all([
      rm(wrongRole.root, { recursive: true, force: true }),
      rm(missingPermission.root, { recursive: true, force: true }),
      rm(foreground.root, { recursive: true, force: true }),
    ]);
  }
});
