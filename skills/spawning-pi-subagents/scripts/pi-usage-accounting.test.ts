import { expect, test } from "bun:test";
import { summarizePiUsage } from "./pi-usage-accounting.ts";

test("usage accounting is aggregate, deduplicated, and privacy-safe", () => {
  const summary = summarizePiUsage([
    JSON.stringify({ id: "secret", usage: { inputTokens: 2, outputTokens: 3, costUsd: 0.5 } }),
    JSON.stringify({ id: "secret", usage: { inputTokens: 2, outputTokens: 3, costUsd: 0.5 } }),
    JSON.stringify({ usage: { inputTokens: -1, outputTokens: 1, costUsd: "bad" } }),
  ]);
  expect(summary.observations).toBe(2);
  expect(summary.duplicateObservations).toBe(1);
  expect(summary.inputTokens).toBe(2);
  expect(summary.outputTokens).toBe(4);
  expect(summary.costUsd).toBeNull();
  expect(summary.providerCostUnknown).toBe(true);
  expect(JSON.stringify(summary)).not.toContain("secret");
});

test("unavailable and truncated observations are explicit", () => {
  expect(summarizePiUsage([], false).availability).toBe("unavailable");
  expect(summarizePiUsage([], true, true).availability).toBe("partial");
});
