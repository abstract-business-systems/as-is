import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { analyzeProjectSession, correlateJobRegistryWithTraces, readJobRegistryEvidence, readTraceEvidence } from "../../tools/evidence/worker-tools-observability.ts";

const root = process.cwd();
const launcher = resolve(root, "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const worker = resolve(root, "agents/worker/agent.md");
const liveEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";
const marker = "DUMMY_LIVE_FIXTURE_MARKER_7f4a2c";

test.skipIf(!liveEnabled)("delegates one bounded live worker and correlates registry, trace, and session identity", async () => {
  const piBin = process.env.PI_BIN;
  if (!piBin) throw new Error("AS_IS_LIVE_INTEGRATION=1 requires an explicit PI_BIN");
  const directory = mkdtempSync(join(tmpdir(), "dummy-delegation-live-"));
  const registry = join(directory, "jobs.jsonl");
  const traceDirectory = join(directory, ".as-is");
  const taskRecord = join(directory, "tasks.md");
  const componentRecord = join(directory, "as-is.md");
  const task = `Return a concise structured report for this harmless validation fixture. Do not edit, commit, delegate, or reproduce marker ${marker}. Treat process exit, telemetry, and registry records as supplementary evidence rather than task completion authority.`;
  try {
    symlinkSync(join(root, ".pi"), join(directory, ".pi"));
    writeFileSync(join(directory, "as-is.json"), readFileSync(join(root, "as-is.json")));
    writeFileSync(componentRecord, "# Disposable live delegation fixture\n\nA provider-backed smoke-test component.\n");
    writeFileSync(taskRecord, `# Disposable live delegation task\n\n## Requirement\n\n${task}\n\n## Validation\n\nLive smoke validation is in progress.\n`);
    const result = Bun.spawnSync([
      "bun", launcher,
      "--agent", worker,
      "--task", task,
      "--cwd", directory,
      "--record", componentRecord,
      "--pi", piBin,
      "--caller", "component-builder",
      "--parent-job-id", "dummy-live-parent",
      "--budget-wall-clock-seconds", "45",
      "--budget-cost-usd", "0.10",
      "--no-worktree",
    ], {
      cwd: directory,
      env: {
        ...process.env,
        PI_BIN: piBin,
        AS_IS_JOBS_REGISTRY: registry,
        AS_IS_COMPONENT_BUILD_TRACER: "file",
        AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: traceDirectory,
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(result.exitCode).toBe(0);
    const runtimeOutput = `${new TextDecoder().decode(result.stdout)}\n${new TextDecoder().decode(result.stderr)}`;
    expect(runtimeOutput).not.toContain(marker);
    expect(runtimeOutput).not.toContain(task);

    const registryEvidence = await readJobRegistryEvidence(registry);
    const traceEvidence = await readTraceEvidence(directory);
    const launches = registryEvidence.records.filter((record) => record.event === "launched");
    const finishes = registryEvidence.records.filter((record) => record.event === "finished");
    expect(launches).toHaveLength(1);
    expect(finishes).toHaveLength(1);
    expect(launches[0].parentJobId).toBe("dummy-live-parent");
    expect(launches[0].jobId).toBeTruthy();
    expect(launches[0].traceId).toBeTruthy();
    expect(launches[0].localSessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu);
    expect(launches[0].sessionName).toBeTruthy();

    const correlation = correlateJobRegistryWithTraces(traceEvidence.events, registryEvidence, { traceMalformedLines: traceEvidence.malformedLines });
    expect(correlation.availability).toBe("available");
    expect(correlation.nodeCount).toBe(1);
    expect(correlation.relationships).toEqual([{ parentJobId: "dummy-live-parent", childJobId: launches[0].jobId, availability: "unavailable", reason: "missing-parent" }]);
    expect(JSON.stringify(correlation)).not.toContain(directory);
    expect(JSON.stringify(correlation)).not.toContain(marker);

    const session = await analyzeProjectSession(directory, launches[0].localSessionId!, 10, undefined, undefined, "summary");
    expect(session).toMatchObject({ availability: "available", sessionId: launches[0].localSessionId, sessionName: launches[0].sessionName });
    expect(JSON.stringify(session)).not.toContain(marker);
    expect(JSON.stringify(session)).not.toContain(task);
    const traceText = JSON.stringify(traceEvidence);
    expect(traceText).not.toContain(marker);
    expect(traceText).not.toContain(task);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 90_000);
