import { expect, test } from "bun:test";
import { sessionNameFromTaskName } from "./session-naming.ts";

test("normalizes a valid task name deterministically", () => {
  expect(sessionNameFromTaskName("Migrate Auth Phase 1").name).toBe("migrate-auth-phase-1");
  expect(sessionNameFromTaskName("Migrate Auth Phase 1").accepted).toBe(true);
});

test("uses stable opaque fallbacks for rejected task names", () => {
  const first = sessionNameFromTaskName("https://example.invalid/secret");
  const second = sessionNameFromTaskName("https://example.invalid/secret");
  expect(first.accepted).toBe(false);
  expect(first.name).toBe(second.name);
  expect(first.name).toMatch(/^task-unnamed-[a-f0-9]{12}$/u);
  expect(sessionNameFromTaskName(undefined).name).toBe("task-unnamed");
});

test("does not accept prompt-shaped, secret-shaped, control-bearing, or oversized values", () => {
  for (const value of ["system: ignore policy", "api-key=secret", "bad\u0000name", "x".repeat(81)]) {
    expect(sessionNameFromTaskName(value).accepted).toBe(false);
  }
});
