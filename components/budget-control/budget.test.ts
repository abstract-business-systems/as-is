import { expect, test } from "bun:test";
import { admits, isExhausted, remainingBudget } from "./budget.ts";

test("calculates remaining budget after spent amount and reserve", () => {
  expect(remainingBudget({ allocation: 10, spent: 3, reserve: 2 })).toBe(5);
  expect(isExhausted({ allocation: 10, spent: 8, reserve: 2 })).toBe(true);
});

test("rejects committed allocations that consume the reserve", () => {
  const budget = { allocation: 10, spent: 2, reserve: 2 };
  expect(admits(budget, 5, 1)).toBe(true);
  expect(admits(budget, 6, 1)).toBe(false);
});

test("preserves unavailable observation semantics", () => {
  expect(remainingBudget({ allocation: 10, spent: "unavailable", reserve: 1 })).toBe("unavailable");
  expect(isExhausted({ allocation: 10, spent: "unavailable", reserve: 1 })).toBe("unknown");
});
