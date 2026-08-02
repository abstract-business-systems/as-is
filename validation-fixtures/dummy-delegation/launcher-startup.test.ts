import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const run = (cwd: string, ...args: string[]): string => {
  const result = Bun.spawnSync(["git", ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(new TextDecoder().decode(result.stderr));
  return new TextDecoder().decode(result.stdout).trim();
};

test("same launcher prompt construction reaches a local child without model latency", () => {
  const dir = mkdtempSync(join(tmpdir(), "dummy-launcher-startup-"));
  try {
    const capture = join(dir, "child.json");
    const stub = join(dir, "pi-startup-stub.sh");
    writeFileSync(stub, [
      "#!/usr/bin/env bash",
      `printf '%s\\n' \"$*\" > '${capture}'`,
      "exit 0",
      "",
    ].join("\n"), { mode: 0o755 });
    const result = Bun.spawnSync([
      "bun", "skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts",
      "--agent", ".agents/agents/as-is/agent.md",
      "--task", "Startup-only dummy diagnostic.",
      "--cwd", process.cwd(),
      "--pi", stub,
      "--no-worktree",
      "--no-session",
      "--no-registry",
      "--budget-wall-clock-seconds", "5",
    ], { cwd: process.cwd(), stdout: "pipe", stderr: "pipe" });
    expect(result.exitCode).toBe(0);
    expect(readFileSync(capture, "utf8")).toContain("Startup-only dummy diagnostic.");
    expect(new TextDecoder().decode(result.stderr)).not.toContain("budget-stopped");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
