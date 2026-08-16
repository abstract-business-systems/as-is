import { expect, test } from "bun:test";
import { FOCUSED_CHECK_FILES, FOCUSED_CHECK_IDENTIFIER, focusedCheckArguments, focusedCheckEnvironment, runFocusedCheck } from "./evidence-validator-inspection-extension.ts";

test("focused check has a code-owned literal argv and bounded environment", () => {
  expect(FOCUSED_CHECK_IDENTIFIER).toBe("evidence-validator-focused-suite");
  expect(FOCUSED_CHECK_FILES).toEqual([
    "core/modules/task-control/task-record-validator.test.ts",
    "skills/managing-backlog/query.test.ts",
  ]);
  expect(focusedCheckArguments()).toEqual([
    process.execPath, "test", "--timeout", "20000", ...FOCUSED_CHECK_FILES,
  ]);
  expect(focusedCheckEnvironment()).toEqual({
    AS_IS_LIVE_INTEGRATION: "0", PI_OFFLINE: "1",
  });
});

test("focused check runs the fixed provider-free suite and returns bounded evidence", async () => {
  const evidence = await runFocusedCheck(process.cwd());
  expect(evidence.identifier).toBe(FOCUSED_CHECK_IDENTIFIER);
  expect(evidence.files).toEqual(FOCUSED_CHECK_FILES);
  expect(evidence.status).toBe("passed");
  expect(evidence.exitCode).toBe(0);
  expect(evidence.timedOut).toBe(false);
  expect(evidence.stdoutTruncated).toBe(false);
  expect(evidence.stderrTruncated).toBe(false);
});

test("focused check fails closed when a fixed input is unavailable", async () => {
  const evidence = await runFocusedCheck("/tmp/as-is-no-focused-check-input");
  expect(evidence).toMatchObject({
    identifier: FOCUSED_CHECK_IDENTIFIER,
    status: "unavailable",
    exitCode: null,
    timedOut: false,
  });
  expect(evidence.reason).toContain("unavailable");
});
