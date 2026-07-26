import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, test } from "bun:test";
import { SystemdUserJobAdapter, type PollResult } from "./systemd-user-job-adapter.ts";

type Fixture = {
  root: string;
  recordPath: string;
  runtimeDirectory: string;
};

function fixture(updated = "2026-07-27T00:00:00Z"): Fixture {
  const root = join(tmpdir(), `as-is-systemd-user-job-adapter-${crypto.randomUUID()}`);
  const component = join(root, "component");
  mkdirSync(component, { recursive: true, mode: 0o700 });
  const recordPath = join(component, "as-is.md");
  writeFileSync(recordPath, `---
as-is-version: 2
task:
  status: ready
  worker: implementer
  updated: ${updated}
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 20
      spent-seconds: 0
      reserve-seconds: 2
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - bounded local systemd user job
---
# Probe component

## Result

Not yet available.

## Blockers And Escalations

None.

## Next Action

Observe the bounded probe.
`, { encoding: "utf8", mode: 0o600 });
  return { root, recordPath, runtimeDirectory: join(root, "private-runtime") };
}

function adapterFor(fixtureValue: Fixture, options: Partial<ConstructorParameters<typeof SystemdUserJobAdapter>[0]> = {}): SystemdUserJobAdapter {
  return new SystemdUserJobAdapter({
    recordPath: fixtureValue.recordPath,
    runtimeDirectory: fixtureValue.runtimeDirectory,
    boundedSeconds: 10,
    staleAfterSeconds: 300,
    retryBackoffSeconds: 1,
    approvedExternalEffect: true,
    mediation: { asIs: "as-is", orchestrator: "orchestrator", implementer: "implementer" },
    ...options,
  });
}

async function eventually(adapter: SystemdUserJobAdapter, predicate: (result: PollResult) => boolean): Promise<PollResult> {
  let last = await adapter.poll();
  const deadline = performance.now() + 8000;
  while (!predicate(last) && performance.now() < deadline) {
    await Bun.sleep(50);
    last = await adapter.poll();
  }
  if (!predicate(last)) throw new Error(`poll did not reach expected state: ${JSON.stringify(last)}`);
  return last;
}

async function cleanProbe(adapter: SystemdUserJobAdapter, fixtureValue: Fixture, launched: boolean): Promise<void> {
  if (launched) {
    try {
      const current = await adapter.poll();
      if (current.jobState === "running") {
        await adapter.cancel("test cleanup");
        await eventually(adapter, (result) => result.cancellationConfirmed);
      }
      if (current.jobState !== "unknown") await adapter.cleanup();
    } catch {
      // The assertion that failed is more useful than a cleanup assertion.
    }
  }
  rmSync(fixtureValue.root, { recursive: true, force: true });
}

describe("systemd user-job adapter", () => {
  test("submits without waiting, persists a checkpoint, polls ownership/output, and cleans up", async () => {
    const fixtureValue = fixture();
    const adapter = adapterFor(fixtureValue);
    let launched = false;
    try {
      const startedAt = performance.now();
      const launch = await adapter.launch(["/bin/sh", "-c", "printf 'probe-start\\n'; sleep 2; printf 'probe-done\\n'"]);
      const launchElapsed = performance.now() - startedAt;
      launched = launch.outcome === "started";
      expect(launch.outcome).toBe("started");
      expect(launch.unit).toMatch(/\.service$/);
      expect(launchElapsed).toBeLessThan(1500);

      const checkpoint = readFileSync(fixtureValue.recordPath, "utf8");
      expect(checkpoint).toContain('"event":"launch-accepted"');
      expect(checkpoint).toContain("durable launch checkpoint only; worker completion not awaited");
      expect(checkpoint).toMatch(/^  status: active$/m);

      const running = await adapter.poll();
      expect(["running", "completed"]).toContain(running.jobState);
      expect(running.completionAuthority).toBe("component task record");
      expect(running.hostObservation.source).toBe("systemctl --user show");
      expect(running.hostObservation.controlGroup).toContain(launch.unit!);

      const completed = await eventually(adapter, (result) => result.jobState === "completed");
      expect(completed.outcome).toBe("progressed");
      expect(completed.output.stdout.source).toBe("systemd transient-unit stdout");
      expect(completed.output.stdout.text).toContain("probe-start");
      expect(completed.output.stdout.text).toContain("probe-done");
      expect(completed.recordStatus).toBe("active");
      expect(readFileSync(fixtureValue.recordPath, "utf8")).not.toMatch(/^  status: completed$/m);

      await adapter.cleanup();
      expect(existsSync(fixtureValue.runtimeDirectory)).toBe(false);
    } finally {
      await cleanProbe(adapter, fixtureValue, launched);
    }
  }, 15000);

  test("routes cancellation and confirms terminated process state", async () => {
    const fixtureValue = fixture();
    const adapter = adapterFor(fixtureValue);
    let launched = false;
    try {
      const launch = await adapter.launch(["/bin/sh", "-c", "printf 'cancel-start\\n'; sleep 30; printf 'cancel-done\\n'"]);
      launched = launch.outcome === "started";
      expect(launch.outcome).toBe("started");
      await eventually(adapter, (result) => result.jobState === "running");

      const cancellation = await adapter.cancel("bounded validation cancellation");
      expect(cancellation.outcome).toBe("progressed");
      expect(cancellation.requestDurable).toBe(true);
      expect(cancellation.terminationConfirmed).toBe(false);

      const confirmed = await eventually(adapter, (result) => result.cancellationConfirmed);
      expect(confirmed.outcome).toBe("cancelled");
      expect(confirmed.recordStatus).toBe("cancelled");
      expect(confirmed.hostObservation.mainPid).toBe(0);
      expect(confirmed.output.stdout.text).toContain("cancel-start");
      expect(confirmed.output.stdout.text).not.toContain("cancel-done");
      expect(readFileSync(fixtureValue.recordPath, "utf8")).toContain('"event":"cancellation-confirmed"');

      await adapter.cleanup();
      expect(existsSync(fixtureValue.runtimeDirectory)).toBe(false);
    } finally {
      await cleanProbe(adapter, fixtureValue, launched);
    }
  }, 15000);

  test("records stale/failure state and bounds recovery escalation", async () => {
    const fixtureValue = fixture();
    let current = new Date("2026-07-27T00:00:00Z");
    const adapter = adapterFor(fixtureValue, {
      boundedSeconds: 10,
      staleAfterSeconds: 1,
      maxRecoveryAttempts: 1,
      clock: () => current,
    });
    let launched = false;
    try {
      const launch = await adapter.launch(["/bin/sh", "-c", "printf 'stale-start\\n'; sleep 5; printf 'stale-done\\n'"]);
      launched = launch.outcome === "started";
      expect(launch.outcome).toBe("started");
      await eventually(adapter, (result) => result.jobState === "running");
      current = new Date("2026-07-27T00:00:02Z");
      const stale = await adapter.poll();
      expect(stale.stale.state).toBe("stale-candidate");
      expect(stale.recovery.state).toBe("stale-candidate");

      const scheduled = await adapter.recover("stale validation checkpoint");
      expect(scheduled.outcome).toBe("scheduled");
      expect(scheduled.attempt).toBe(1);
      const escalated = await adapter.recover("bounded recovery limit reached");
      expect(escalated.outcome).toBe("escalated");
      expect(escalated.nextAction).toContain("do not retry or substitute a role");
      expect(readFileSync(fixtureValue.recordPath, "utf8")).toContain('"event":"recovery-escalated"');
    } finally {
      await cleanProbe(adapter, fixtureValue, launched);
    }

    const failedFixture = fixture();
    const failedAdapter = adapterFor(failedFixture, { maxRecoveryAttempts: 1 });
    let failedLaunched = false;
    try {
      const launch = await failedAdapter.launch(["/bin/sh", "-c", "printf 'failure\\n'; exit 17"]);
      failedLaunched = launch.outcome === "started";
      expect(launch.outcome).toBe("started");
      const failed = await eventually(failedAdapter, (result) => result.jobState === "failed");
      expect(failed.outcome).toBe("failed");
      expect(failed.hostObservation.execMainStatus).toBe(17);
      expect(failed.recovery.state).toBe("required");
      expect(failed.output.stdout.text).toContain("failure");
      await failedAdapter.recover("failed bounded probe");
      const escalated = await failedAdapter.recover("second recovery is not permitted");
      expect(escalated.outcome).toBe("escalated");
      await failedAdapter.cleanup();
    } finally {
      await cleanProbe(failedAdapter, failedFixture, failedLaunched);
    }
  }, 25000);

  test("rejects role substitution before creating host state", async () => {
    const fixtureValue = fixture();
    try {
      expect(() => adapterFor(fixtureValue, { mediation: { asIs: "as-is", orchestrator: "orchestrator", implementer: "general" } })).toThrow("role substitution rejected");
      expect(readFileSync(fixtureValue.recordPath, "utf8")).toMatch(/^  status: ready$/m);
      expect(existsSync(fixtureValue.runtimeDirectory)).toBe(false);
    } finally {
      rmSync(fixtureValue.root, { recursive: true, force: true });
    }
  });
});
