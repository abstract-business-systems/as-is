import { appendFile, chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
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

const finiteNonnegative = (value: unknown): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  return value;
};
const usageObject = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  return record.usage && typeof record.usage === "object" ? record.usage as Record<string, unknown> : record;
};

/** Parse only bounded Pi JSONL observations; never retain provider payloads or IDs. */
export const summarizePiUsage = (lines: string[], available = true, truncated = false): PiUsageSummary => {
  const result = empty(!available ? "unavailable" : truncated ? "partial" : "available");
  if (!available) return result;
  const seen = new Set<string>();
  for (const line of lines) {
    let parsed: unknown;
    try { parsed = JSON.parse(line); } catch { continue; }
    const usage = usageObject(parsed);
    if (!usage) continue;
    const fields = ["inputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens", "costUsd"];
    const values = fields.map((field) => finiteNonnegative(usage[field]));
    if (!values.some((value) => value !== undefined)) continue;
    const key = values.map((value) => value === undefined ? "?" : String(value)).join(",");
    if (seen.has(key)) { result.duplicateObservations++; continue; }
    seen.add(key); result.observations++;
    (fields.slice(0, 4) as (keyof PiUsageSummary)[]).forEach((field, index) => {
      const value = values[index];
      if (value === undefined && usage[field] !== undefined) result.invalidFields++;
      else if (value !== undefined) result[field] = (result[field] as number) + value;
    });
    const cost = values[4];
    if (cost === undefined) { if (usage.costUsd !== undefined) result.invalidFields++; result.providerCostUnknown = true; result.costUsd = null; }
    else if (!result.providerCostUnknown) result.costUsd = (result.costUsd as number) + cost;
  }
  return result;
};

/** Host-owned aggregate retention. The path is deliberately not caller-selectable or emitted. */
export const retainPiUsageAggregate = async (path: string, summary: PiUsageSummary): Promise<void> => {
  try {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    let prior: PiUsageSummary | undefined;
    try { prior = JSON.parse(await readFile(path, "utf8")) as PiUsageSummary; } catch { /* first record */ }
    const aggregate = prior && prior.availability ? {
      ...summary,
      observations: (prior.observations ?? 0) + summary.observations,
      duplicateObservations: (prior.duplicateObservations ?? 0) + summary.duplicateObservations,
      inputTokens: (prior.inputTokens ?? 0) + (summary.inputTokens ?? 0),
      outputTokens: (prior.outputTokens ?? 0) + (summary.outputTokens ?? 0),
      cacheReadTokens: (prior.cacheReadTokens ?? 0) + (summary.cacheReadTokens ?? 0),
      cacheWriteTokens: (prior.cacheWriteTokens ?? 0) + (summary.cacheWriteTokens ?? 0),
      costUsd: prior.costUsd === null || summary.costUsd === null ? null : (prior.costUsd ?? 0) + (summary.costUsd ?? 0),
      invalidFields: (prior.invalidFields ?? 0) + summary.invalidFields,
      providerCostUnknown: prior.providerCostUnknown || summary.providerCostUnknown,
    } : summary;
    const temporary = `${path}.tmp-${process.pid}`;
    await writeFile(temporary, `${JSON.stringify(aggregate)}\n`, { encoding: "utf8", mode: 0o600 });
    await chmod(temporary, 0o600);
    await rename(temporary, path);
    await chmod(path, 0o600);
  } catch { /* accounting is best-effort and remains unavailable on failure */ }
};
