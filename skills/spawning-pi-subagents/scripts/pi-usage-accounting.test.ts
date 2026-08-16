import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPiUsageAggregate, retainPiUsageAggregate, summarizePiUsage } from "./pi-usage-accounting.ts";

test("usage accounting is aggregate, deduplicated, and privacy-safe", () => {
  const summary = summarizePiUsage([
    JSON.stringify({ id: "secret", usage: { inputTokens: 2, outputTokens: 3, costUsd: 0.5 } }),
    JSON.stringify({ id: "secret", usage: { inputTokens: 2, outputTokens: 3, costUsd: 0.5 } }),
    JSON.stringify({ id: "invalid", usage: { inputTokens: -1, outputTokens: 1, costUsd: "bad" } }),
    JSON.stringify({ id: "invalid", usage: { inputTokens: -1, outputTokens: 1, costUsd: "bad" } }),
  ]);
  expect(summary.observations).toBe(2);
  expect(summary.duplicateObservations).toBe(2);
  expect(summary.inputTokens).toBe(2);
  expect(summary.outputTokens).toBe(4);
  expect(summary.costUsd).toBeNull();
  expect(summary.providerCostUnknown).toBe(true);
  expect(summary.invalidFields).toBe(2);
  expect(JSON.stringify(summary)).not.toContain("secret");
});

test("invalid-only observations remain visible and cost remains unknown", () => {
  const summary = summarizePiUsage([JSON.stringify({ usage: { input: -1, output: "bad", cost: { total: Number.NaN } } })]);
  expect(summary.observations).toBe(1);
  expect(summary.invalidFields).toBe(3);
  expect(summary.providerCostUnknown).toBe(true);
  expect(summary.costUsd).toBeNull();
});

test("Pi-shaped usage fields are accepted without retaining identifiers", () => {
  const summary = summarizePiUsage([JSON.stringify({ id: "secret", message: { id: "response-1", usage: { input: 2, output: 3, cacheRead: 4, cacheWrite: 5, cost: { total: 0.5 } } } })]);
  expect(summary.inputTokens).toBe(2);
  expect(summary.outputTokens).toBe(3);
  expect(summary.cacheReadTokens).toBe(4);
  expect(summary.cacheWriteTokens).toBe(5);
  expect(summary.costUsd).toBe(0.5);
  expect(JSON.stringify(summary)).not.toContain("secret");
  expect(JSON.stringify(summary)).not.toContain("response-1");
});

test("wrapper usage is observed and inherits its trusted identity", () => {
  const summary = summarizePiUsage([
    JSON.stringify({ id: "wrapper-1", turn_end: { usage: { input: 2, output: 3, cost: { total: 0.2 } } } }),
    JSON.stringify({ id: "wrapper-1", turn_end: { usage: { input: 2, output: 3, cost: { total: 0.2 } } } }),
    JSON.stringify({ id: "wrapper-2", agent_end: { message: { usage: { input: 4, output: 5, cost: { total: 0.3 } } } } }),
  ]);
  expect(summary.observations).toBe(2);
  expect(summary.duplicateObservations).toBe(1);
  expect(summary.inputTokens).toBe(6);
  expect(summary.outputTokens).toBe(8);
  expect(summary.costUsd).toBe(0.5);
});

test("unavailable and truncated observations are explicit", () => {
  expect(summarizePiUsage([], false).availability).toBe("unavailable");
  expect(summarizePiUsage([], true, true).availability).toBe("partial");
});

test("aggregate retention is private, atomic, and cumulative", async () => {
  const directory = await mkdtemp(join(tmpdir(), "as-is-usage-accounting-"));
  try {
    const path = join(directory, "runtime", "usage.json");
    await retainPiUsageAggregate(path, summarizePiUsage([JSON.stringify({ usage: { inputTokens: 2, outputTokens: 3, costUsd: 0.5 } })]));
    await retainPiUsageAggregate(path, summarizePiUsage([JSON.stringify({ usage: { inputTokens: 4, outputTokens: 5, costUsd: 0.7 } })]));
    const aggregate = await readPiUsageAggregate(path);
    expect(aggregate.availability).toBe("available");
    expect(aggregate.inputTokens).toBe(6);
    expect(aggregate.costUsd).toBe(1.2);
    expect(JSON.stringify(aggregate)).not.toContain("response");
    const concurrentPath = join(directory, "runtime", "concurrent.json");
    await Promise.all(Array.from({ length: 8 }, (_, index) => retainPiUsageAggregate(concurrentPath, summarizePiUsage([JSON.stringify({ id: `response-${index}`, usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.1 } })]))));
    const concurrent = await readPiUsageAggregate(concurrentPath);
    expect(concurrent.availability).toBe("available");
    expect(concurrent.inputTokens).toBe(8);
    expect(concurrent.observations).toBe(8);
    const unavailablePath = join(directory, "runtime", "unavailable.json");
    await retainPiUsageAggregate(unavailablePath, summarizePiUsage([], false));
    await retainPiUsageAggregate(unavailablePath, summarizePiUsage([JSON.stringify({ id: "available-1", usage: { inputTokens: 1 } })]));
    expect((await readPiUsageAggregate(unavailablePath)).availability).toBe("partial");
  } finally { await rm(directory, { recursive: true, force: true }); }
});
