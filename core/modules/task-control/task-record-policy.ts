type JsonObject = Record<string, unknown>;

export const DEFAULT_TASK_RECORD_NAME = "tasks.md";

export function isTaskNarrativeFilename(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value === value.split("/").at(-1) && !value.includes("\\") && value !== "." && value !== ".." && value !== "as-is.md";
}

function object(value: unknown): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}

/** Resolve task-record naming policy owned by task-control. */
export function taskRecordNameFromConfiguration(configuration: unknown): string {
  const records = object(object(configuration).records);
  const filenames = object(records.filenames);
  const configured = filenames.task;
  if (configured === undefined) return DEFAULT_TASK_RECORD_NAME;
  if (!isTaskNarrativeFilename(configured)) throw new Error("configuration.records.filenames.task must be a safe basename; configured task filename is unsafe");
  return configured;
}

export function taskRecordNamesFromConfiguration(configuration: unknown): string[] {
  return [...new Set([taskRecordNameFromConfiguration(configuration), DEFAULT_TASK_RECORD_NAME, "task.md"])]
    .filter(isTaskNarrativeFilename);
}
