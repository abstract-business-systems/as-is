import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const launcher = "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts";
const agent = ".agents/agents/as-is/agent.md";

test("dummy delegation fixture is bounded and isolated", async () => {
  const root = mkdtempSync(join(tmpdir(), "dummy-delegation-"));
  try {
    const stub = join(root, "pi-stub.sh");
    const registry = join(root, "jobs.jsonl");
    writeFileSync(stub, "#!/usr/bin/env bash\nprintf '{\\\"dummy\\\":true}\\n'\n", { mode: 0o755 });
    const child = Bun.spawn(["bun", launcher, "--agent", agent, "--task", "Dummy rehearsal.", "--cwd", process.cwd(), "--pi", stub, "--detach", "--no-worktree", "--no-session"], {
      cwd: process.cwd(),
      env: { ...Bun.env, AS_IS_JOBS_REGISTRY: registry },
      stdout: "pipe",
      stderr: "pipe",
    });
    const output = await new Response(child.stdout).text();
    expect(await child.exited).toBe(0);
    const handle = JSON.parse(output);
    expect(handle.identity).toBe("as-is");
    expect(handle.worktreePath).toBeNull();
    expect(existsSync(registry)).toBe(true);
    expect(Bun.file(stub).size).toBeGreaterThan(0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
