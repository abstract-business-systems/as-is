import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { correlateJobRegistryWithTraces, readJobRegistryEvidence, readTraceEvidence } from "../../tools/evidence/worker-tools-observability.ts";

const launcher = resolve("skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const asIsAgent = resolve("agents/as-is/agent.md");
const builderAgent = resolve("agents/component-builder/agent.md");
const record = resolve("validation-fixtures/dummy-delegation/tasks.md");
const localSessionId = "0190abcd-1234-4abc-8def-0123456789ab";
const liveIntegrationEnabled = process.env.AS_IS_LIVE_INTEGRATION === "1";

type RegistryEvent = Record<string, any>;
type Run = { stdout: string; stderr: string; exitCode: number };

const readEvents = (path: string): RegistryEvent[] =>
  readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line) as RegistryEvent);

function run(args: string[], env: NodeJS.ProcessEnv): Run {
  const result = Bun.spawnSync(["bun", launcher, ...args], { cwd: process.cwd(), env, stdout: "pipe", stderr: "pipe" });
  return {
    stdout: new TextDecoder().decode(result.stdout),
    stderr: new TextDecoder().decode(result.stderr),
    exitCode: result.exitCode ?? 1,
  };
}

function makePiStub(dir: string): string {
  const path = join(dir, "version-aware-pi-stub.sh");
  const probe = join(dir, "version-probe-observed");
  writeFileSync(path, `#!/usr/bin/env bash
set -u
if [[ "\${1:-}" == "--version" ]]; then
  printf '0.84.0\\n' > '${probe}'
  printf '0.84.0\\n'
  exit 0
fi
session_id=""
for ((index=1; index <= $#; index++)); do
  if [[ "\${!index}" == "--session-id" ]]; then
    next=$((index + 1))
    session_id="\${!next}"
  fi
done
printf '{"type":"session","id":"%s"}\\n' "\${session_id:-${localSessionId}}"
case "\${AS_IS_STUB_ATTEMPT:-success}" in
  failure) exit 17 ;;
  success) printf '{"type":"message","role":"assistant","content":[{"type":"text","text":"bounded local fixture result"}]}\\n' ; exit 0 ;;
  *) exit 19 ;;
esac
`, { mode: 0o755 });
  return path;
}

function launchChild(pi: string, registry: string, trace: string, taskName: string, attempt: string, parentJobId?: string, extraEnv: NodeJS.ProcessEnv = {}): Run {
  const args = [
    "--agent", builderAgent, "--task", `Dummy ${taskName} attempt ${attempt}.`, "--task-name", taskName,
    "--cwd", process.cwd(), "--record", record, "--caller", "as-is", "--pi", pi,
    "--no-worktree", "--budget-wall-clock-seconds", "10", "--budget-cost-usd", "0.01",
  ];
  if (parentJobId) args.push("--parent-job-id", parentJobId);
  return run(args, {
    ...process.env,
    ...extraEnv,
    AS_IS_JOBS_REGISTRY: registry,
    AS_IS_COMPONENT_BUILD_TRACER: "file",
    AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: trace,
    AS_IS_TASK_REVISION: "4",
    AS_IS_ATTEMPT: attempt,
    AS_IS_COMPONENT_IDENTITY: "validation-fixtures/dummy-delegation",
  });
}

test("as-is reconstructs a bounded failed attempt and fresh retry from registry and trace evidence", async () => {
  const root = mkdtempSync(join(tmpdir(), "dummy-delegation-efficacy-"));
  try {
    const registry = join(root, "jobs.jsonl");
    const trace = join(root, ".as-is", "tracing.jsonl");
    const pi = makePiStub(root);
    const failed = launchChild(pi, registry, trace, "dummy-retry", "1", undefined, { AS_IS_STUB_ATTEMPT: "failure" });
    expect(failed.exitCode).toBe(17);
    expect(readFileSync(join(root, "version-probe-observed"), "utf8").trim()).toBe("0.84.0");
    const firstLaunch = readEvents(registry).find((event) => event.event === "launched");
    expect(firstLaunch).toBeDefined();

    const retried = launchChild(pi, registry, trace, "dummy-retry", "2", firstLaunch?.jobId, { AS_IS_STUB_ATTEMPT: "success" });
    expect(retried.exitCode).toBe(0);

    const registryEvidence = await readJobRegistryEvidence(registry);
    const traceEvidence = await readTraceEvidence(root);
    const correlation = correlateJobRegistryWithTraces(traceEvidence.events, registryEvidence, { traceMalformedLines: traceEvidence.malformedLines });
    const launches = registryEvidence.records.filter((event) => event.event === "launched");
    const finishes = registryEvidence.records.filter((event) => event.event === "finished");
    expect(registryEvidence.availability).toBe("available");
    expect(launches).toHaveLength(2);
    expect(finishes).toHaveLength(2);
    expect(new Set(launches.map((event) => event.jobId)).size).toBe(2);
    expect(new Set(launches.map((event) => event.traceId)).size).toBe(2);
    expect(new Set(launches.map((event) => event.localSessionId)).size).toBe(2);
    expect(launches[1].parentJobId).toBe(launches[0].jobId);
    expect(correlation.availability).toBe("available");
    expect(correlation.nodeCount).toBe(2);
    expect(correlation.relationships).toEqual([{ parentJobId: launches[0].jobId, childJobId: launches[1].jobId, availability: "available" }]);
    const retry = (correlation.retries as Array<Record<string, any>>).find((group) => group.attempts?.join(",") === "1,2");
    expect(retry).toBeDefined();
    expect(new Set(retry?.jobIds)).toEqual(new Set(launches.map((event) => event.jobId)));
    expect(new Set(retry?.outcomes)).toEqual(new Set(["failure", "success"]));
    expect(correlation.inconsistencies).toEqual([]);
    const traceLaunches = traceEvidence.events.filter((event) => event.name === "subprocess.launch");
    expect(traceLaunches).toHaveLength(2);
    expect(traceLaunches[0].observations?.find((observation) => observation.kind === "taskRevision")?.value).toBe(4);
    expect(traceLaunches[1].observations?.find((observation) => observation.kind === "taskRevision")?.value).toBe(4);
    expect(traceLaunches[0].observations?.find((observation) => observation.kind === "attempt")?.value).toBe(1);
    expect(traceLaunches[1].observations?.find((observation) => observation.kind === "attempt")?.value).toBe(2);
    expect(traceLaunches[0].observations?.find((observation) => observation.kind === "parentCallId")?.availability).toBe("unavailable");
    expect(traceLaunches[1].observations?.find((observation) => observation.kind === "parentCallId")?.availability).toBe("available");
    expect(correlation.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ jobId: launches[0].jobId, attempts: [1], outcome: "failure" }),
      expect.objectContaining({ jobId: launches[1].jobId, attempts: [2], outcome: "success", parentJobId: launches[0].jobId }),
    ]));
    const traceText = readFileSync(trace, "utf8");
    expect(traceText).not.toMatch(/Dummy dummy-retry|bounded local fixture result|prompt|response|tool|secret|password/i);
    expect(traceText).not.toContain(process.cwd());
    expect(JSON.stringify(correlation)).not.toMatch(/path|cwd|record|secret|prompt|response|tool/i);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("as-is delegates one bounded component-builder attempt with durable evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "dummy-delegation-"));
  try {
    const registry = join(root, "jobs.jsonl");
    const innerStub = join(root, "component-builder-pi-stub.sh");
    writeFileSync(innerStub, "#!/usr/bin/env bash\nif [[ \"$1\" == \"--version\" ]]; then printf '0.84.0\\n'; exit 0; fi\nprintf '{\\\"fixture\\\":true}\\n'\n", { mode: 0o755 });
    const callerStub = join(root, "as-is-caller-stub.sh");
    writeFileSync(callerStub, [
      "#!/usr/bin/env bash",
      `if [[ "$1" == "--version" ]]; then printf '0.84.0\\n'; exit 0; fi`,
      `exec bun '${launcher}' --agent '${builderAgent}' --task 'Dummy component-builder attempt.' --cwd '${process.cwd()}' --record '${record}' --caller as-is --pi '${innerStub}' --no-worktree --no-session --budget-wall-clock-seconds 10 --budget-cost-usd 0.01`,
      "",
    ].join("\n"), { mode: 0o755 });

    const result = Bun.spawnSync([
      "bun", launcher, "--agent", asIsAgent, "--task", "Run the bounded dummy delegation.",
      "--cwd", process.cwd(), "--caller", "user", "--pi", callerStub,
      "--no-worktree", "--no-session", "--budget-wall-clock-seconds", "20", "--budget-cost-usd", "0.02",
    ], { cwd: process.cwd(), env: { ...Bun.env, AS_IS_JOBS_REGISTRY: registry }, stdout: "pipe", stderr: "pipe" });

    expect(result.exitCode).toBe(0);
    expect(existsSync(registry)).toBe(true);
    const events = readEvents(registry);
    expect(events.filter((event) => event.event === "launched")).toHaveLength(2);
    expect(events.filter((event) => event.event === "finished")).toHaveLength(2);
    const child = events.find((event) => event.event === "launched" && event.identity === "component-builder");
    expect(child).toMatchObject({ identity: "component-builder", caller: "as-is" });
    expect(child).not.toHaveProperty("recordPath");
    expect(events.find((event) => event.event === "finished" && event.jobId === child?.jobId)).toMatchObject({ exitCode: 0 });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
