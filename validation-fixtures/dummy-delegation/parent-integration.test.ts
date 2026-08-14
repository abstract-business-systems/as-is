import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const git = (cwd: string, ...args: string[]): string => {
  const result = Bun.spawnSync(["git", ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) {
    throw new Error(new TextDecoder().decode(result.stderr));
  }
  return new TextDecoder().decode(result.stdout).trim();
};

const isAncestor = (cwd: string, ancestor: string, descendant: string): boolean =>
  Bun.spawnSync(["git", "merge-base", "--is-ancestor", ancestor, descendant], {
    cwd,
    stdout: "ignore",
    stderr: "ignore",
  }).exitCode === 0;

test("parent consolidates a scoped child commit without unrelated changes", () => {
  const repo = mkdtempSync(join(tmpdir(), "dummy-parent-integration-"));
  try {
    git(repo, "init", "--quiet");
    writeFileSync(join(repo, "fixture.txt"), "base\n");
    writeFileSync(join(repo, "unrelated.txt"), "preserve\n");
    git(repo, "add", ".");
    git(repo, "-c", "user.email=test@example.invalid", "-c", "user.name=dummy-test", "commit", "--quiet", "-m", "base");
    const parentBase = git(repo, "rev-parse", "HEAD");

    // Simulate the isolated child's scoped work and commit.
    writeFileSync(join(repo, "fixture.txt"), "base\nchild change\n");
    git(repo, "add", "fixture.txt");
    git(repo, "-c", "user.email=test@example.invalid", "-c", "user.name=dummy-test", "commit", "--quiet", "-m", "child: dummy scoped change");
    const childSha = git(repo, "rev-parse", "HEAD");
    expect(isAncestor(repo, childSha, "HEAD")).toBe(true);

    // Reset the parent to its original base, then integrate the child commit.
    git(repo, "reset", "--quiet", "--hard", parentBase);
    expect(readFileSync(join(repo, "unrelated.txt"), "utf8")).toBe("preserve\n");
    git(repo, "cherry-pick", "--no-commit", childSha);
    git(repo, "-c", "user.email=test@example.invalid", "-c", "user.name=dummy-test", "commit", "--quiet", "-m", "integrate: consolidate dummy child");
    const integrationSha = git(repo, "rev-parse", "HEAD");

    expect(integrationSha).not.toBe(childSha);
    expect(isAncestor(repo, parentBase, "HEAD")).toBe(true);
    expect(readFileSync(join(repo, "fixture.txt"), "utf8")).toBe("base\nchild change\n");
    expect(readFileSync(join(repo, "unrelated.txt"), "utf8")).toBe("preserve\n");
    expect(git(repo, "status", "--porcelain")).toBe("");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
