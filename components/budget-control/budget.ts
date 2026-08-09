/** Shared budget arithmetic for durable admission and runtime enforcement.
 *
 * This module is intentionally policy-light: task records remain authoritative,
 * while callers provide the observed values and decide how to report unknown
 * provider cost. It keeps allocation arithmetic identical across control-plane
 * and supervisor code without creating a second budget store.
 */

export type BudgetValue = number | "unavailable";

export interface BudgetEnvelope {
  allocation: BudgetValue;
  spent: BudgetValue;
  reserve: BudgetValue;
}

export function remainingBudget(budget: BudgetEnvelope): number | "unavailable" {
  if (![budget.allocation, budget.spent, budget.reserve].every((value) => typeof value === "number" && Number.isFinite(value))) {
    return "unavailable";
  }
  return Math.max(0, budget.allocation as number - budget.spent as number - budget.reserve as number);
}

export function isExhausted(budget: BudgetEnvelope): boolean | "unknown" {
  const remaining = remainingBudget(budget);
  if (remaining === "unavailable") return "unknown";
  return remaining <= 0;
}

export function admits(available: BudgetEnvelope, committed: number, requested: number): boolean {
  if (!Number.isFinite(committed) || committed < 0 || !Number.isFinite(requested) || requested < 0) return false;
  const remaining = remainingBudget(available);
  return remaining !== "unavailable" && committed + requested <= remaining;
}

export function continuationLimit(budget: BudgetEnvelope): number | "unavailable" {
  const remaining = remainingBudget(budget);
  return remaining === "unavailable" ? remaining : remaining;
}
