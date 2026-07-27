import { describe, expect, test } from "bun:test";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  recordHandoff,
  type JobHandle,
  type RoleChain,
} from "../subprocess-execution-foundation/supervisor.ts";
import {
  OPEN_CODE_PAYLOAD_USED,
  SubprocessHostIntegration,
  readSubprocessRuntimeHandle,
  subprocessNoLeftover,
  type SubprocessActiveBinding,
} from "./subprocess-host-integration.ts";

const parentRevision = "subprocess-parent-v1";
const childRevision = "subprocess-child-v1";
const scriptPath = new URL("./subprocess-host-integration.ts", import.meta.url).pathname;

const roleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "active-as-is-session", parentSessionId: null, source: "local-subprocess-context" },
  orchestrator: {
    role: "orchestrator",
    sessionId: "active-orchestrator-session",
    parentSessionId: "active-as-is-session",
    source: "local-subprocess-context",
  },
  implementer: {
    role: "implementer",
    sessionId: "derived-implementer-session",
    parentSessionId: "active-orchestrator-session",
    source: "local-subprocess-context",
  },
};

const sleep = (milliseconds: number) => new Promise<void>((resolvePromise) => setTimeout(resolvePromise, milliseconds));

interface FixtureOptions {
  profileState?: "allowed" | "denied" | "awaiting-approval" | "unavailable";
  profileReason?: string;
  worker?: string;
  executionMode?: string;
  command?: string[];
  startDelayMilliseconds?: number;
  childStatus?: "ready" | "active";
}

interface Fixture {
  root: string;
  stateHome: string;
  childPath: string;
  childRecordPath: string;
  caller: { role: "orchestrator"; componentPath: string; taskRevision: string; attempt: number };
  binding: SubprocessActiveBinding;
  integration: SubprocessHostIntegration;
}

function workerCommand(delayMilliseconds = 350): string[] {
  const script = [
    "console.log(JSON.stringify({",
    "role: process.env.AS_IS_WORKER_ROLE,",
    "parentSession: process.env.AS_IS_PARENT_SESSION_ID,",
    "component: process.env.AS_IS_COMPONENT,",
    "parentJobId: process.env.AS_IS_PARENT_JOB_ID ?? null,",
    "jobId: process.env.AS_IS_JOB_ID ?? null,",
    "freeFormScope: process.env.AS_IS_FREE_FORM_SCOPE ?? null",
    "}));",
    `await Bun.sleep(${delayMilliseconds});`,
    "console.log('deterministic-subprocess-complete');",
  ].join(" ");
  return [process.execPath, "-e", script];
}

function permissionProfile(options: FixtureOptions): Record<string, unknown> {
  return {
    source: "local-subprocess-test-profile",
    approvedWorkspace: true,
    processGroupControl: true,
    standardInput: "disabled",
    eventPersistence: true,
    watchdog: true,
    userEventBubbling: true,
    ...(options.profileState ? { state: options.profileState } : {}),
    ...(options.profileReason ? { reason: options.profileReason } : {}),
  };
}

function recordText(
  status: "ready" | "active",
  worker: string,
  revision: string,
  options: FixtureOptions,
  includeExecution: boolean,
): string {
  const execution = includeExecution
    ? `
## Execution Resolution

\`\`\`json
${JSON.stringify({
  adapter: "subprocess-host-integration",
  permissionProfile: permissionProfile(options),
  authority: { parentComponentPath: "parent", canReceive: true, descendantScope: "parent/child" },
  jobSpecification: {
    executionMode: options.executionMode ?? "supervisor-owned-detached",
    command: options.command ?? workerCommand(),
    checkInSeconds: 0.2,
    ...(options.startDelayMilliseconds === undefined ? {} : { startDelayMilliseconds: options.startDelayMilliseconds }),
  },
}, null, 2)}
\`\`\`
`
    : "";
  return `---
as-is-version: 2
task:
  status: ${status}
  worker: ${worker}
  updated: 2026-07-27T16:00:00.000Z
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 8
      spent-seconds: 0
      reserve-seconds: 1
      source: unavailable
  external-effects: prohibited
acceptance:
  - Complete the deterministic local subprocess fixture.

# Subprocess Fixture ${revision}

## Task Revision

  \`${revision}\`

## Progress

The local record is a deterministic fixture.

## Validation

Pending.

## Result

Pending.

## Blockers And Escalations

None.

## Recovery

Reread the durable record and preserve the supervisor boundary.

## Next Action

Observe by component path, task revision, and attempt.
${execution}`;
}

function requestFor(fixture: Fixture, childOverrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    caller: { ...fixture.caller },
    child: { componentPath: fixture.childPath, ...childOverrides },
  };
}

async function makeFixture(options: FixtureOptions = {}): Promise<Fixture> {
  const root = await new Promise<string>((resolvePromise, reject) => {
    import("node:fs/promises").then(({ mkdtemp }) => mkdtemp(join(tmpdir(), "as-is-subprocess-host-"))).then(resolvePromise, reject);
  });
  const stateHome = join(root, "state");
  const parentDirectory = join(root, "parent");
  const childDirectory = join(parentDirectory, "child");
  await mkdir(childDirectory, { recursive: true, mode: 0o700 });
  await writeFile(join(parentDirectory, "as-is.md"), recordText("active", "orchestrator", parentRevision, {}, false), { mode: 0o600 });
  const childPath = "parent/child";
  const childRecordPath = join(childDirectory, "as-is.md");
  await writeFile(childRecordPath, recordText(options.childStatus ?? "ready", options.worker ?? "implementer", childRevision, options, true), { mode: 0o600 });
  const caller = { role: "orchestrator" as const, componentPath: "parent", taskRevision: parentRevision, attempt: 1 };
  const binding: SubprocessActiveBinding = {
    repositoryRoot: root,
    active: true,
    supervisorAvailable: true,
    toolContextId: "active-subprocess-tool-context",
    expectedRole: "orchestrator",
    canDelegate: true,
    caller,
    // This JobId is deliberately a parent-only diagnostic. The child command
    // must never receive it.
    job: { active: true, jobId: "parent-job-must-not-reach-child", identity: caller },
    supervisorContext: { roleChain, source: "local-subprocess-supervisor" },
  };
  return {
    root,
    stateHome,
    childPath,
    childRecordPath,
    caller,
    binding,
    integration: new SubprocessHostIntegration({ projectRoot: root, stateHome, jobId: () => `subprocess-test-${crypto.randomUUID()}` }),
  };
}

async function waitForStatus(
  fixture: Fixture,
  matches: (status: Record<string, unknown>) => boolean,
  timeoutMilliseconds = 8_000,
): Promise<Record<string, unknown>> {
  const deadline = Date.now() + timeoutMilliseconds;
  let status = await fixture.integration.status({ componentPath: fixture.childPath, attempt: 1 });
  while (!matches(status) && Date.now() < deadline) {
    await sleep(25);
    status = await fixture.integration.status({ componentPath: fixture.childPath, attempt: 1 });
  }
  if (!matches(status)) throw new Error(`status condition was not observed: ${JSON.stringify(status)}`);
  return status;
}

async function cleanupFixture(fixture: Fixture): Promise<void> {
  await rm(fixture.root, { recursive: true, force: true });
}

async function runtimeMapPath(fixture: Fixture): Promise<string> {
  const digest = await import("node:crypto").then(({ createHash }) => createHash("sha256").update(fixture.root).digest("hex").slice(0, 16));
  return join(fixture.stateHome, "as-is", "projects", `project-${digest}`, "runtime", "job-map.json");
}

describe("subprocess host integration", () => {
  test("derives parent and command from durable state, returns at acceptance, watches lifecycle, and cleans all state", async () => {
    const fixture = await makeFixture({ startDelayMilliseconds: 100 });
    let handle: JobHandle | null = null;
    try {
      const startedAt = Number(process.hrtime.bigint());
      const result = await fixture.integration.invoke(requestFor(fixture), fixture.binding);
      const elapsedMilliseconds = Number(process.hrtime.bigint() - BigInt(startedAt)) / 1_000_000;
      expect(result.outcome).toBe("started");
      expect(result.status).toBe("launch-accepted");
      expect(result.launch.checkpoint).toBe("durable-launch-accepted");
      expect(elapsedMilliseconds).toBeLessThan(1_500);
      expect(result.parent).toEqual(fixture.caller);
      expect(result.workerRole).toBe("implementer");
      expect(result.handle.diagnosticOnly).toBe(true);
      expect(result.handle.lookupKey).toBe(false);
      expect(OPEN_CODE_PAYLOAD_USED).toBe(false);
      expect(Object.keys(requestFor(fixture)).sort()).toEqual(["caller", "child"]);
      expect(Object.keys((requestFor(fixture) as { caller: Record<string, unknown> }).caller).sort()).toEqual(["attempt", "componentPath", "role", "taskRevision"]);

      handle = await readSubprocessRuntimeHandle({ projectRoot: fixture.root, stateHome: fixture.stateHome, componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(handle).not.toBeNull();
      const running = await waitForStatus(fixture, (status) => (status.runtime as Record<string, unknown>)?.hostStatus === "running");
      expect((running.identity as Record<string, unknown>).key).toBe(`${fixture.childPath}/${childRevision}/1`);
      expect((running.runtimeJobId as Record<string, unknown>).diagnosticOnly).toBe(true);

      const watched: Record<string, unknown>[] = [];
      for await (const observation of fixture.integration.watch({ componentPath: fixture.childPath, attempt: 1, intervalMilliseconds: 10, count: 3 })) watched.push(observation);
      expect(watched).toHaveLength(3);
      expect(watched.map((value) => (value.watch as Record<string, unknown>).sequence)).toEqual([0, 1, 2]);
      expect(watched.every((value) => (value.watch as Record<string, unknown>).completionInferredFromPolling === false)).toBe(true);

      const completed = await waitForStatus(fixture, (status) => (status.runtime as Record<string, unknown>)?.hostStatus === "completed");
      const stdout = await readFile(handle!.runtimeDir + "/stdout.log", "utf8");
      expect(stdout).toContain('"role":"implementer"');
      expect(stdout).toContain('"parentSession":"active-orchestrator-session"');
      expect(stdout).toContain('"component":"parent/child"');
      expect(stdout).not.toContain("parent-job-must-not-reach-child");
      expect(stdout).not.toContain("AS_IS_PARENT_JOB_ID");
      expect(completed.runtime).toMatchObject({ hostStatus: "completed" });

      await recordHandoff(handle!, {
        validation: ["real detached Bun subprocess reached host completion"],
        result: "local subprocess handoff completed without OpenCode payload or invocation",
        descendantsTerminal: true,
        failedOrCancelledDescendants: [],
      });
      await waitForStatus(fixture, (status) => {
        const durable = status.durableState as Record<string, unknown>;
        const runtime = status.runtime as Record<string, unknown>;
        return durable.status === "completed" && runtime.classification === "terminal";
      });
      const terminal = await fixture.integration.reconcile({ componentPath: fixture.childPath, attempt: 1 });
      expect((terminal.durableState as Record<string, unknown>).status).toBe("completed");
      expect((terminal.runtime as Record<string, unknown>).classification).toBe("terminal");
      const map = JSON.parse(await readFile(await runtimeMapPath(fixture), "utf8")) as { entries: Record<string, { runtimeState: string }> };
      expect(Object.values(map.entries)[0]?.runtimeState).toBe("terminal");

      const cleaned = await fixture.integration.cleanup({ componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(cleaned.status).toBe("cleanup-complete");
      expect(await readSubprocessRuntimeHandle({ projectRoot: fixture.root, stateHome: fixture.stateHome, componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 })).toBeNull();
      await expect(stat(await runtimeMapPath(fixture))).rejects.toMatchObject({ code: "ENOENT" });
      const leftovers = await subprocessNoLeftover(handle!);
      expect(leftovers.processGroupAlive).toBe(false);
      expect(leftovers.supervisorAlive).toBe(false);
      expect(leftovers.supervisorProcessGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);
    } finally {
      await cleanupFixture(fixture);
    }
  });

  test("rejects unsupported request claims and every named caller/parent/component/duplicate/unavailable class without fallback", async () => {
    const fixture = await makeFixture();
    const duplicate = await makeFixture({ startDelayMilliseconds: 50, command: workerCommand(1_000) });
    try {
      expect((await fixture.integration.invoke({ child: { componentPath: fixture.childPath } }, fixture.binding)).blocker?.code).toBe("missing-caller");
      expect((await fixture.integration.invoke(requestFor(fixture))).blocker?.code).toBe("missing-caller");
      expect((await fixture.integration.invoke({ caller: { ...fixture.caller, role: "implementer" }, child: { componentPath: fixture.childPath } }, fixture.binding)).blocker?.code).toBe("mismatched-caller");
      expect((await fixture.integration.invoke(requestFor(fixture), { ...fixture.binding, job: { ...fixture.binding.job, active: false } })).blocker?.code).toBe("missing-parent");
      expect((await fixture.integration.invoke(requestFor(fixture), { ...fixture.binding, expectedRole: "implementer" })).blocker?.code).toBe("wrong-role");
      expect((await fixture.integration.invoke({ caller: fixture.caller, child: { componentPath: "parent/missing" } }, fixture.binding)).blocker?.code).toBe("wrong-component");
      expect((await fixture.integration.invoke({ caller: fixture.caller, child: { componentPath: "sibling" } }, fixture.binding)).blocker?.code).toBe("wrong-component");
      for (const claim of ["parent", "parentJobId", "worker", "command", "scope"]) {
        expect((await fixture.integration.invoke({ ...requestFor(fixture), [claim]: "caller-claim" }, fixture.binding)).blocker?.code).toBe("mismatched-caller");
      }
      expect((await fixture.integration.invoke({ caller: fixture.caller, child: { componentPath: fixture.childPath, scope: "free-form" } }, fixture.binding)).blocker?.code).toBe("wrong-component");
      expect((await fixture.integration.invoke(requestFor(fixture), { ...fixture.binding, supervisorAvailable: false })).blocker?.code).toBe("unavailable-supervisor");

      const first = await duplicate.integration.invoke(requestFor(duplicate, { attempt: 1 }), duplicate.binding);
      expect(first.outcome).toBe("started");
      const second = await duplicate.integration.invoke(requestFor(duplicate, { attempt: 1 }), duplicate.binding);
      expect(second.outcome).toBe("rejected");
      expect(second.blocker?.code).toBe("duplicate-attempt");
      expect(second.stableIdentity).toEqual({ componentPath: duplicate.childPath, taskRevision: childRevision, attempt: 1 });
      expect((await duplicate.integration.cancel({ componentPath: duplicate.childPath, taskRevision: childRevision, attempt: 1 })).status).toBe("cleanup-complete");
    } finally {
      await cleanupFixture(fixture);
      await cleanupFixture(duplicate);
    }
  });

  test("resolves configured worker and records permission denial and approval-needed without prompting", async () => {
    const denied = await makeFixture({ profileState: "denied", profileReason: "fixture permission denied" });
    const waiting = await makeFixture({ profileState: "awaiting-approval", profileReason: "fixture approval needed" });
    const wrongRole = await makeFixture({ worker: "general" });
    const foreground = await makeFixture({ executionMode: "foreground" });
    try {
      const denial = await denied.integration.invoke(requestFor(denied), denied.binding);
      expect(denial.outcome).toBe("rejected");
      expect(denial.blocker).toMatchObject({ code: "permission-denied", permissionState: "denied", fallback: "not-permitted" });
      expect(await readFile(denied.childRecordPath, "utf8")).toContain('"permissionState":"denied"');

      const approval = await waiting.integration.invoke(requestFor(waiting), waiting.binding);
      expect(approval.outcome).toBe("waiting");
      expect(approval.status).toBe("awaiting-approval");
      expect(approval.blocker).toMatchObject({ code: "permission-denied", permissionState: "awaiting-user-approval" });
      expect(await readFile(waiting.childRecordPath, "utf8")).toContain('"permissionState":"awaiting-user-approval"');

      const role = await wrongRole.integration.invoke(requestFor(wrongRole), wrongRole.binding);
      expect(role.blocker?.code).toBe("wrong-role");
      const fallback = await foreground.integration.invoke(requestFor(foreground), foreground.binding);
      expect(fallback.blocker?.code).toBe("unavailable-supervisor");
      expect(await readFile(foreground.childRecordPath, "utf8")).not.toContain("launch-accepted");
    } finally {
      await Promise.all([cleanupFixture(denied), cleanupFixture(waiting), cleanupFixture(wrongRole), cleanupFixture(foreground)]);
    }
  });

  test("reloads and reconciles malformed/orphaned runtime state, then cancels through the supervisor and removes the map", async () => {
    const fixture = await makeFixture({ startDelayMilliseconds: 50, command: workerCommand(2_000) });
    let handle: JobHandle | null = null;
    try {
      const result = await fixture.integration.invoke(requestFor(fixture), fixture.binding);
      expect(result.outcome).toBe("started");
      handle = await readSubprocessRuntimeHandle({ projectRoot: fixture.root, stateHome: fixture.stateHome, componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(handle).not.toBeNull();
      await waitForStatus(fixture, (status) => (status.runtime as Record<string, unknown>)?.hostStatus === "running");
      const mapPath = await runtimeMapPath(fixture);
      const original = await readFile(mapPath, "utf8");
      await writeFile(mapPath, "{malformed", "utf8");
      const malformed = await fixture.integration.status({ componentPath: fixture.childPath, attempt: 1 });
      expect(malformed.runtimeMap).toMatchObject({ availability: "malformed" });
      expect((malformed.runtime as Record<string, unknown>).classification).toBe("unavailable");
      await writeFile(mapPath, original, "utf8");
      const parsed = JSON.parse(original) as { entries: Record<string, Record<string, unknown>> };
      const entry = Object.values(parsed.entries)[0];
      entry.taskRevision = "orphaned-revision";
      await writeFile(mapPath, `${JSON.stringify(parsed)}\n`, "utf8");
      const orphaned = await fixture.integration.status({ componentPath: fixture.childPath, attempt: 1 });
      expect((orphaned.runtime as Record<string, unknown>).classification).toBe("orphaned");
      await writeFile(mapPath, original, "utf8");
      expect((await fixture.integration.reconcile({ componentPath: fixture.childPath, attempt: 1 })).reconciliation).toMatchObject({ status: "reconciled" });

      const cancelled = await fixture.integration.cancel({ componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(cancelled.outcome).toBe("cancelled");
      expect(cancelled.status).toBe("cleanup-complete");
      const leftovers = await subprocessNoLeftover(handle!);
      expect(leftovers.processGroupAlive).toBe(false);
      expect(leftovers.supervisorAlive).toBe(false);
      expect(leftovers.supervisorProcessGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);
      await expect(stat(mapPath)).rejects.toMatchObject({ code: "ENOENT" });
    } finally {
      await cleanupFixture(fixture);
    }
  });

  test("keeps a detached child observable after the submitting controller is terminated", async () => {
    const fixture = await makeFixture({ startDelayMilliseconds: 50, command: workerCommand(450) });
    const requestFile = join(fixture.root, "controller-request.json");
    const bindingFile = join(fixture.root, "controller-binding.json");
    const resultFile = join(fixture.root, "controller-result.json");
    let controller: ReturnType<typeof Bun.spawn> | null = null;
    let handle: JobHandle | null = null;
    try {
      await writeFile(requestFile, `${JSON.stringify(requestFor(fixture))}\n`, "utf8");
      await writeFile(bindingFile, `${JSON.stringify(fixture.binding)}\n`, "utf8");
      controller = Bun.spawn([
        process.execPath,
        scriptPath,
        "controller-loss",
        "--project-root",
        fixture.root,
        "--state-home",
        fixture.stateHome,
        "--request-file",
        requestFile,
        "--binding-file",
        bindingFile,
        "--result-file",
        resultFile,
      ], { stdout: "ignore", stderr: "ignore" } as any);
      let resultText = "";
      for (let attempt = 0; attempt < 120; attempt += 1) {
        try {
          resultText = await readFile(resultFile, "utf8");
          break;
        } catch {
          await sleep(25);
        }
      }
      expect(resultText).not.toBe("");
      const controllerResult = JSON.parse(resultText) as { outcome: string; status: string; openCodePayloadUsed: boolean };
      expect(controllerResult).toMatchObject({ outcome: "started", status: "launch-accepted", openCodePayloadUsed: false });
      process.kill(controller.pid, "SIGTERM");
      await Promise.race([controller.exited, sleep(1_000)]);

      const observed = await waitForStatus(fixture, (status) => (status.runtime as Record<string, unknown>)?.hostStatus === "completed");
      expect((observed.identity as Record<string, unknown>).key).toBe(`${fixture.childPath}/${childRevision}/1`);
      handle = await readSubprocessRuntimeHandle({ projectRoot: fixture.root, stateHome: fixture.stateHome, componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(handle).not.toBeNull();
      await recordHandoff(handle!, {
        validation: ["detached child remained observable after controller termination"],
        result: "controller-loss fixture completed under the detached supervisor",
        descendantsTerminal: true,
        failedOrCancelledDescendants: [],
      });
      const cleaned = await fixture.integration.cleanup({ componentPath: fixture.childPath, taskRevision: childRevision, attempt: 1 });
      expect(cleaned.status).toBe("cleanup-complete");
      const leftovers = await subprocessNoLeftover(handle!);
      expect(leftovers.processGroupAlive).toBe(false);
      expect(leftovers.supervisorAlive).toBe(false);
      expect(leftovers.supervisorProcessGroupAlive).toBe(false);
      expect(leftovers.runtimeExists).toBe(false);
    } finally {
      if (controller) {
        try { process.kill(controller.pid, "SIGKILL"); } catch { /* controller may already be gone */ }
      }
      if (handle) {
        // The normal path removes the runtime; this is only a bounded fallback
        // for a test assertion failure before the cleanup checkpoint.
        await sleep(50);
      }
      await cleanupFixture(fixture);
    }
  });
});
