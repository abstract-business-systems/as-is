import { expect, test } from "bun:test";
import { DEFAULT_TASK_RECORD_NAME, isTaskNarrativeFilename, taskRecordNameFromConfiguration, taskRecordNamesFromConfiguration } from "./task-record-policy.ts";

test("uses the task-control default when no task filename is configured", () => {
  expect(DEFAULT_TASK_RECORD_NAME).toBe("tasks.md");
  expect(taskRecordNameFromConfiguration(undefined)).toBe("tasks.md");
  expect(taskRecordNameFromConfiguration({ records: {} })).toBe("tasks.md");
  expect(taskRecordNamesFromConfiguration({})).toEqual(["tasks.md", "task.md"]);
});

test("accepts safe configured task basenames and preserves compatibility names", () => {
  for (const name of ["work.md", "task-record.md", "notes.txt"]) {
    expect(isTaskNarrativeFilename(name)).toBe(true);
    expect(taskRecordNameFromConfiguration({ records: { filenames: { task: name } } })).toBe(name);
  }
  expect(taskRecordNamesFromConfiguration({ records: { filenames: { task: "work.md" } } })).toEqual(["work.md", "tasks.md", "task.md"]);
  expect(taskRecordNamesFromConfiguration({ records: { filenames: { task: "tasks.md" } } })).toEqual(["tasks.md", "task.md"]);
});

test("rejects traversal, absolute, separator, reserved, and malformed task names", () => {
  for (const name of ["", ".", "..", "as-is.md", "../work.md", "/tmp/work.md", "nested/work.md", "nested\\work.md", null, 42]) {
    expect(isTaskNarrativeFilename(name)).toBe(false);
    expect(() => taskRecordNameFromConfiguration({ records: { filenames: { task: name } } })).toThrow("configuration.records.filenames.task must be a safe basename; configured task filename is unsafe");
  }
});
