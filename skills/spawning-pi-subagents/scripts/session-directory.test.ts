import { expect, test } from "bun:test";
import { homedir } from "node:os";
import { join } from "node:path";
import { resolveSessionDirectory } from "./session-directory.ts";

test("resolves an absolute configured session directory", () => {
  expect(resolveSessionDirectory("/var/tmp/as-is-sessions", "/repo/work", "/repo")).toBe("/var/tmp/as-is-sessions");
});

test("resolves project-temp, relative, and home-relative configured directories", () => {
  expect(resolveSessionDirectory("<project-temp>/subagents/sessions", "/repo/work", "/repo")).toBe("/repo/.as-is/subagents/sessions");
  expect(resolveSessionDirectory("<project-temp>/sessions", "/repo/work", "/repo", ".runtime")).toBe("/repo/.runtime/sessions");
  expect(resolveSessionDirectory(".private/sessions", "/repo/work", "/repo")).toBe("/repo/.private/sessions");
  expect(resolveSessionDirectory("~/as-is-sessions", "/repo/work", "/repo")).toBe(join(homedir(), "as-is-sessions"));
});

test("uses a stable private project-scoped temp default", () => {
  const first = resolveSessionDirectory(undefined, "/repo/work", "/repo");
  const second = resolveSessionDirectory(undefined, "/repo/work", "/repo");
  expect(first).toBe(second);
  expect(first).toBe("/repo/.as-is/subagents/sessions");
});
