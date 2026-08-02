import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const launcher = resolve("skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts");
const asIsAgent = resolve(".agents/agents/as-is/agent.md");
const builderAgent = resolve(".agents/agents/component-builder/agent.md");
const record = resolve("validation-fixtures/dummy-delegation/tasks.md");

type RegistryEvent = { event?: string; identity?: string; caller?: string; recordPath?: string; jobId?: string; exitCode?: number };

const readEvents = (path: string): RegistryEvent[] =>
  readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line) as RegistryEvent);

test("as-is delegates one bounded component-builder attempt with durable evidence", () => {
  const root = mkdtempSync(join(tmpdir(), "dummy-delegation-"));
  try {
    const registry = join(root, "jobs.jsonl");
    const innerStub = join(root, "component-builder-pi-stub.sh");
    writeFileSync(innerStub, "#!/usr/bin/env bash\nprintf '{\\\"fixture\\\":true}\\n'\n", { mode: 0o755 });
    const callerStub = join(root, "as-is-caller-stub.sh");
    writeFileSync(callerStub, [
      "#!/usr/bin/env bash",
      // This local stub is the deterministic as-is caller. It delegates exactly once.
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
    const launches = events.filter((event) => event.event === "launched");
    const finishes = events.filter((event) => event.event === "finished");
    expect(launches).toHaveLength(2);
    expect(finishes).toHaveLength(2);
    const child = launches.find((event) => event.identity === "component-builder");
    expect(child).toMatchObject({ identity: "component-builder", caller: "as-is", recordPath: record });
    expect(finishes.find((event) => event.jobId === child?.jobId)).toMatchObject({ exitCode: 0 });
    // The task record, not process exit, is the durable protocol source supplied to the child.
    expect(readFileSync(record, "utf8")).toContain("status: active");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
