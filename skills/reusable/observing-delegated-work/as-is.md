# Observing Delegated Work - as-is

## Purpose
Observe delegated progress, results, budgets, and terminal status.

## Design
The skill reads approved progress and evidence surfaces incrementally through the approved handle, task record, logs, traces, or session selectors, compares progress with acceptance and budget, and classifies the work as running, blocked, failed, or terminal. It is the observation counterpart to the sibling delegating-bounded-work skill and composes with evidence-inspection skills for deeper trace questions: it reports blockers and outcomes without directing work. It holds no direction or completion authority, does not infer completion from observation, preserves the worker's granted scope, and grants no tools; it establishes fit only.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Observing Delegated Work**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../as-is.md](../as-is.md) — concise capability catalog entry.