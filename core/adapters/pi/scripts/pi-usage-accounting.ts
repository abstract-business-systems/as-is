import { appendFile, chmod, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

export type PiUsageSummary = {
  availability: "available" | "unavailable" | "partial";
  observations: number;
  duplicateObservations: number;
  inputTokens: number | null;
  outputTokens: number | null;
  cacheReadTokens: number | null;
  cacheWriteTokens: number | null;
  costUsd: number | null;
  invalidFields: number;
  providerCostUnknown: boolean;
};

const empty = (availability: PiUsageSummary["availability"] = "available"): PiUsageSummary => ({
  availability, observations: 0, duplicateObservations: 0, inputTokens: 0, outputTokens: 0,
  cacheReadTokens: 0, cacheWriteTokens: 0, costUsd: 0, invalidFields: 0, providerCostUnknown: false,
});

const invalidValue = (value: unknown): boolean => value !== undefined && finiteNonnegative(value) === undefined;

const finiteNonnegative = (value: unknown): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  return value;
};
type UsageObservation = { usage: Record<string, unknown>; identity: string | null };

const messageIdentity = (value: unknown): string | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const identity = record.responseId ?? record.id;
  return typeof identity === "string" && identity.length > 0 ? identity : null;
};

const usageFromMessage = (value: unknown, fallbackIdentity: string | null = null): UsageObservation | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const usage = record.usage;
  if (!usage || typeof usage !== "object" || Array.isArray(usage)) return null;
  return { usage: usage as Record<string, unknown>, identity: messageIdentity(value) ?? fallbackIdentity };
};

const usageObservations = (value: unknown): UsageObservation[] => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const record = value as Record<string, unknown>;
  const observations: UsageObservation[] = [];
  const envelopeIdentity = messageIdentity(record);
  const direct = usageFromMessage(record, envelopeIdentity);
  if (direct) observations.push(direct);
  if (record.message) {
    const nested = usageFromMessage(record.message, envelopeIdentity);
    if (nested) observations.push(nested);
  }
  for (const key of ["turn_end", "agent_end"]) {
    const wrapper = record[key];
    if (!wrapper || typeof wrapper !== "object" || Array.isArray(wrapper)) continue;
    const wrapperIdentity = messageIdentity(wrapper) ?? envelopeIdentity;
    const wrapperObservation = usageFromMessage(wrapper, wrapperIdentity);
    if (wrapperObservation) observations.push(wrapperObservation);
    const wrapperRecord = wrapper as Record<string, unknown>;
    const nested = usageFromMessage(wrapperRecord.message, wrapperIdentity);
    if (nested) observations.push(nested);
    if (Array.isArray(wrapperRecord.messages)) {
      for (const message of wrapperRecord.messages) {
        const messageObservation = usageFromMessage(message, wrapperIdentity);
        if (messageObservation) observations.push(messageObservation);
      }
    }
  }
  return observations;
};

const usageFields = ["inputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens", "costUsd"] as const;
const observedValue = (usage: Record<string, unknown>, field: (typeof usageFields)[number]): unknown => {
  if (field === "inputTokens") return usage.inputTokens ?? usage.input;
  if (field === "outputTokens") return usage.outputTokens ?? usage.output;
  if (field === "cacheReadTokens") return usage.cacheReadTokens ?? usage.cacheRead;
  if (field === "cacheWriteTokens") return usage.cacheWriteTokens ?? usage.cacheWrite;
  if (usage.costUsd !== undefined) return usage.costUsd;
  const cost = usage.cost;
  return cost && typeof cost === "object" && !Array.isArray(cost) ? (cost as Record<string, unknown>).total : undefined;
};

/** Parse only bounded Pi JSONL observations; never retain provider payloads or IDs. */
export const summarizePiUsage = (lines: string[], available = true, truncated = false): PiUsageSummary => {
  const result = empty(!available ? "unavailable" : truncated ? "partial" : "available");
  if (!available) return result;
  const seen = new Set<string>();
  for (const line of lines) {
    let parsed: unknown;
    try { parsed = JSON.parse(line); } catch { result.invalidFields++; continue; }
    for (const observation of usageObservations(parsed)) {
      const { usage, identity } = observation;
      const rawValues = usageFields.map((field) => observedValue(usage, field));
      const values = rawValues.map((value) => finiteNonnegative(value));
      const hasValue = values.some((value) => value !== undefined);
      const hasInvalid = rawValues.some(invalidValue);
      if (!hasValue && !hasInvalid) continue;
      const key = identity ? `response:${identity}` : null;
      if (key && seen.has(key)) { result.duplicateObservations++; continue; }
      if (key) seen.add(key);
      if (hasInvalid) result.invalidFields += rawValues.filter(invalidValue).length;
      result.observations++;
      (usageFields.slice(0, 4) as (keyof PiUsageSummary)[]).forEach((field, index) => {
        const value = values[index];
        if (value !== undefined) result[field] = (result[field] as number) + value;
      });
      const cost = values[4];
      if (cost === undefined) { result.providerCostUnknown = true; result.costUsd = null; }
      else if (!result.providerCostUnknown) result.costUsd = (result.costUsd as number) + cost;
    }
  }
  return result;
};

const validSummary = (value: unknown): value is PiUsageSummary => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const summary = value as Record<string, unknown>;
  if (!["available", "unavailable", "partial"].includes(String(summary.availability))) return false;
  for (const field of ["observations", "duplicateObservations", "invalidFields"]) {
    if (typeof summary[field] !== "number" || !Number.isInteger(summary[field]) || (summary[field] as number) < 0) return false;
  }
  for (const field of ["inputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens", "costUsd"]) {
    const fieldValue = summary[field];
    if (fieldValue !== null && (typeof fieldValue !== "number" || !Number.isFinite(fieldValue) || fieldValue < 0)) return false;
  }
  return typeof summary.providerCostUnknown === "boolean";
};

const mergeUsageSummaries = (prior: PiUsageSummary, summary: PiUsageSummary): PiUsageSummary => ({
  availability: prior.availability === summary.availability
    ? prior.availability
    : prior.availability === "available" && summary.availability === "available" ? "available" : "partial",
  observations: prior.observations + summary.observations,
  duplicateObservations: prior.duplicateObservations + summary.duplicateObservations,
  inputTokens: (prior.inputTokens ?? 0) + (summary.inputTokens ?? 0),
  outputTokens: (prior.outputTokens ?? 0) + (summary.outputTokens ?? 0),
  cacheReadTokens: (prior.cacheReadTokens ?? 0) + (summary.cacheReadTokens ?? 0),
  cacheWriteTokens: (prior.cacheWriteTokens ?? 0) + (summary.cacheWriteTokens ?? 0),
  costUsd: prior.costUsd === null || summary.costUsd === null ? null : (prior.costUsd ?? 0) + (summary.costUsd ?? 0),
  invalidFields: prior.invalidFields + summary.invalidFields,
  providerCostUnknown: prior.providerCostUnknown || summary.providerCostUnknown,
});

/** Host-owned aggregate retention. The path is deliberately not caller-selectable or emitted. */
export const retainPiUsageAggregate = async (path: string, summary: PiUsageSummary): Promise<void> => {
  try {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    await chmod(dirname(path), 0o700);
    // One bounded aggregate delta per append avoids a read-modify-write lock and
    // its stale-owner race. The file contains no provider payload or identifier.
    await appendFile(path, `${JSON.stringify(summary)}\n`, { encoding: "utf8", mode: 0o600 });
    await chmod(path, 0o600);
  } catch { /* accounting is best-effort and remains unavailable on failure */ }
};

export const readPiUsageAggregate = async (path: string): Promise<PiUsageSummary> => {
  try {
    const lines = (await readFile(path, "utf8")).split("\n").filter(Boolean);
    let aggregate: PiUsageSummary | null = null;
    for (const line of lines) {
      try {
        const summary = JSON.parse(line) as PiUsageSummary;
        if (!validSummary(summary)) continue;
        aggregate = aggregate ? mergeUsageSummaries(aggregate, summary) : summary;
      } catch { /* ignore incomplete append; aggregate remains source-labelled */ }
    }
    return aggregate ?? empty("unavailable");
  } catch {
    return empty("unavailable");
  }
};
