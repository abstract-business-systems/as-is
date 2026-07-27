import { chmod, mkdir, mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "bun:test";

import {
  AdapterLaunchError,
  cleanupComponent,
  classifyPermissionRequest,
  constructOpenCodeCommand,
  createPermissionProfile,
  detectOpenCodeCapability,
  detectPermissionRequest,
  launchOpenCode,
  type CommandObservation,
  type OpenCodeLaunchInput,
} from "./adapter.ts";
import { terminateOpenCodeProcessGroup } from "./runner.ts";
import {
  noLeftover,
  observe,
  readDurableRecord,
  type RoleChain,
} from "../subprocess-execution-foundation/supervisor.ts";

const roleChain: RoleChain = {
  asIs: { role: "as-is", sessionId: "test-as-is", parentSessionId: null, source: "adapter-test" },
  orchestrator: { role: "orchestrator", sessionId: "test-orchestrator", parentSessionId: "test-as-is", source: "adapter-test" },
  implementer: { role: "implementer", sessionId: "test-implementer", parentSessionId: "test-orchestrator", source: "adapter-test" },
};

const supportedProbe = {
  version: { exitCode: 0, stdout: "1.17.18\n", stderr: "" },
  help: {
    exitCode: 0,
    stdout: "      --auto  auto-approve permissions that are not explicitly denied (dangerous!)\n",
    stderr: "",
  },
};

const recordText = (status: "ready" | "active" = "ready") => `---
as-is-version: 2
task:
  status: ${status}
  worker: implementer
  updated: 2026-07-27T17:30:00.000Z
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
      allocated-seconds: 5
      spent-seconds: 0
      reserve-seconds: 0.2
      source: unavailable
acceptance:
  - deterministic OpenCode permission boundary
---

# Fixture

## Progress

Ready for the focused adapter check.
`;

async function fixture(): Promise<{ root: string; componentPath: string; recordPath: string }> {
  const root = await mkdtemp(join(tmpdir(), "as-is-opencode-adapter-test-"));
  const componentPath = "component";
  const directory = join(root, componentPath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const recordPath = join(directory, "as-is.md");
  await writeFile(recordPath, recordText(), { encoding: "utf8", mode: 0o600 });
  return { root, componentPath, recordPath };
}

async function fakeOpenCode(permissionEvent: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "as-is-fake-opencode-"));
  const path = join(root, "opencode");
  await writeFile(path, `#!/usr/bin/env node
process.stdout.write(${JSON.stringify(`${permissionEvent}\n`)});
setInterval(() => {}, 1000);
`, { encoding: "utf8", mode: 0o700 });
  await chmod(path, 0o755);
  return path;
}

function launchInput(
  data: { root: string; componentPath: string },
  executable: string,
  overrides: Partial<OpenCodeLaunchInput> = {},
): OpenCodeLaunchInput {
  return {
    projectRoot: data.root,
    componentPath: data.componentPath,
    parentContext: {
      componentPath: ".",
      role: "orchestrator",
      sessionId: roleChain.orchestrator.sessionId,
      parentSessionId: roleChain.asIs.sessionId,
    },
    roleChain,
    prompt: "harmless deterministic permission-boundary marker",
    executable,
    capabilityProbe: supportedProbe,
    checkInSeconds: 0.2,
    ...overrides,
  };
}

function capabilityObservation(version: string, help = supportedProbe.help): { version: CommandObservation; help: CommandObservation } {
  return { version: { exitCode: 0, stdout: `${version}\n`, stderr: "" }, help };
}

test("requires exact version/help capability and never selects hidden aliases", () => {
  const capability = detectOpenCodeCapability("opencode", supportedProbe);
  expect(capability.status).toBe("supported");
  expect(capability.strategy).toBe("auto");
  expect(capability.helpAdvertisesAuto).toBe(true);

  const drift = detectOpenCodeCapability("opencode", capabilityObservation("1.17.19"));
  expect(drift.status).toBe("unsupported");
  expect(drift.strategy).toBe("reject");
  expect(drift.reason).not.toContain("yolo");

  const failed = detectOpenCodeCapability("opencode", {
    version: { exitCode: 0, stdout: "1.17.18", stderr: "", timedOut: true },
    help: supportedProbe.help,
  });
  expect(failed.status).toBe("failed");
  expect(failed.strategy).toBe("reject");
});

test("constructs documented --auto and exposes only a redacted command observation", () => {
  const command = constructOpenCodeCommand({
    executable: "opencode",
    projectDirectory: "/tmp/disposable-project",
    prompt: "prompt-with-no-secret-in-this-test",
  });
  expect(command.command).toEqual([
    "opencode",
    "run",
    "--auto",
    "--format",
    "json",
    "--dir",
    "/tmp/disposable-project",
    "prompt-with-no-secret-in-this-test",
  ]);
  expect(command.observableCommand.at(-1)).toBe("<prompt-redacted>");
  expect(command.observableCommand).not.toContain("prompt-with-no-secret-in-this-test");
  expect(command.command).not.toContain("--yolo");
});

test("preserves explicit deny behavior while rejecting pending or unexpected requests", () => {
  const profile = createPermissionProfile(["filesystem.delete"]);
  const denied = classifyPermissionRequest({
    operation: "delete",
    capabilityClass: "filesystem",
    resourceClass: "protected-target",
    reason: "explicit deny fixture",
    state: "pending",
    sourceEvent: "permission.asked",
  }, profile);
  expect(denied.outcome).toBe("fail-closed");
  expect(denied.reason).toContain("explicit deny");
  expect(classifyPermissionRequest({
    operation: "delete",
    capabilityClass: "filesystem",
    resourceClass: "protected-target",
    reason: "deny must win over a contradictory host observation",
    state: "approved",
    sourceEvent: "permission.replied",
  }, profile).outcome).toBe("fail-closed");

  const unexpected = detectPermissionRequest(JSON.stringify({
    type: "permission.asked",
    properties: { operation: "write", capabilityClass: "filesystem", resourceClass: "unknown-target", state: "pending" },
  }));
  expect(unexpected?.sourceEvent).toBe("permission.asked");
  expect(classifyPermissionRequest(unexpected!, profile).outcome).toBe("fail-closed");
  expect(detectPermissionRequest(JSON.stringify({ type: "step-finish", properties: { cost: 0 } }))).toBeNull();
});

test("durably fails closed on a permission request, terminates the child group, and leaves no runtime entries", async () => {
  const data = await fixture();
  const executable = await fakeOpenCode(JSON.stringify({
    type: "permission.asked",
    properties: {
      operation: "delete",
      capabilityClass: "filesystem",
      resourceClass: "protected-target",
      reason: "deterministic unexpected request",
      state: "pending",
    },
  }));
  let handle: Parameters<typeof observe>[0] | null = null;
  try {
    const launched = await launchOpenCode(launchInput(data, executable, { explicitDenyRules: ["filesystem.delete"] }));
    handle = launched.handle;
    let failed = false;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const observation = await observe(launched.handle);
      if (observation.host.status === "failed") {
        failed = true;
        break;
      }
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
    }
    expect(failed).toBe(true);
    const record = await readDurableRecord(data.recordPath);
    const failure = record.events.find((event) => event.event === "permission-failed-closed");
    const termination = record.events.find((event) => event.event === "permission-process-terminated");
    expect(record.status).toBe("failed");
    expect(failure?.details.permissionState).toBe("failed-closed");
    expect(failure?.details.permissionReason).toContain("explicit deny");
    expect(termination?.details.termination).toBeDefined();
    expect((termination?.details.termination as { groupTerminated?: boolean }).groupTerminated).toBe(true);

    let cleaned = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const result = await cleanupComponent(launched.handle);
      if (result.cleaned) {
        cleaned = true;
        break;
      }
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
    }
    expect(cleaned).toBe(true);
    const leftovers = await noLeftover(launched.handle);
    expect(leftovers.processGroupAlive).toBe(false);
    expect(leftovers.supervisorAlive).toBe(false);
    expect(leftovers.supervisorProcessGroupAlive).toBe(false);
    expect(leftovers.runtimeExists).toBe(false);
    const promptFile = launched.envelope.jobSpecification.command[launched.envelope.jobSpecification.command.indexOf("--prompt-file") + 1];
    await expect(stat(promptFile)).rejects.toThrow();
  } finally {
    if (handle) {
      await cleanupComponent(handle).catch(() => undefined);
    }
    await rm(data.root, { recursive: true, force: true });
    await rm(executable, { recursive: true, force: true });
  }
});

test("rejects version drift before launch and records the safe blocker", async () => {
  const data = await fixture();
  try {
    let caught: unknown;
    try {
      await launchOpenCode(launchInput(data, "opencode", {
        capabilityProbe: capabilityObservation("1.17.19"),
      }));
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(AdapterLaunchError);
    expect((caught as AdapterLaunchError).code).toBe("opencode-capability-preflight-failed");
    const record = await readDurableRecord(data.recordPath);
    expect(record.status).toBe("blocked");
    expect(record.events.find((event) => event.event === "opencode-capability-preflight-failed")?.details.safeFallback)
      .toContain("reject");
    expect(record.events.some((event) => event.event === "launch-accepted")).toBe(false);
  } finally {
    await rm(data.root, { recursive: true, force: true });
  }
});

test("process-group termination is bounded and escalates without leaving the child alive", async () => {
  const child = Bun.spawn([process.execPath, "-e", "setInterval(() => {}, 1000)"], {
    stdin: "ignore",
    stdout: "ignore",
    stderr: "ignore",
    detached: true,
  } as any);
  const termination = await terminateOpenCodeProcessGroup(child.pid, 350);
  await child.exited;
  expect(termination.groupTerminated).toBe(true);
  expect(termination.boundedMilliseconds).toBeLessThan(500);
});

test("accepts an already auto-approved permission observation without treating it as a request", () => {
  const request = detectPermissionRequest(JSON.stringify({
    type: "permission.asked",
    properties: { operation: "read", capabilityClass: "filesystem", resourceClass: "workspace", state: "approved" },
  }));
  expect(classifyPermissionRequest(request!, createPermissionProfile()).outcome).toBe("approved-observation");
});
