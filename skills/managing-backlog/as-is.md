---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Define backlog ownership and prioritization without making it task authority.
---

# Managing Backlog

## Purpose

Maintain and prioritize bounded work proposals separately from active component
tasks, using durable recording tables and a deterministic query-time display.

## Design

The backlog is a planning index, not task authority. Each component backlog uses
a stable table with `id`, `status`, integer `user preference`, integer `system
preference`, `purpose`, `description`, `dependencies`, `acceptance`, and
`notes`. The component is derived from the backlog path rather than duplicated
in each source row.

Backlog status is `open`, `selected`, or `deferred`; active execution state
belongs to transient `tasks.md` records and completed summaries belong to
`changelog.md`. Dependencies use `component:id` references. Legacy string
priorities migrate deterministically to user preferences (`High=3`,
`Medium=2`, `Low=1`, `Deferred/absent=0`); uncertain legacy dependency text is
preserved in notes instead of being guessed or discarded.

The query does not persist `weight`. It computes
`status value + user preference + system preference + sum(dependent weights)`
with status values `open=0`, `selected=4`, and `deferred=-2`, then sorts
descending with a stable lexical tie-break. The dependent sum is intentional:
it gives fan-out value to prerequisites, whereas an average can hide the number
of items unblocked. Cycles are handled deterministically.

The conversational display contract is strict: for “Show me the backlog,
please.”, the agent runs the deterministic query and returns its rendered table
without abbreviating it. The representation columns are exactly `weight`,
`component`, `id`, `status`, `purpose`, `description`, `dependencies`, and
`notes`. `validateQueryRepresentation` and the focused tests protect this
contract after a fresh Pi validation found a five-column summary that omitted
description, dependencies, and notes.

Cleanup is evidence-gated and component-owned. `cleanupCompletedBacklogs`
removes only rows whose exact IDs occur in the owning `changelog.md` alongside a
completion term; it preserves ambiguous, cross-component, and merely mentioned
items. It does not replace task-management reconciliation or invent completion
status. The cleanup command reports each removed item and its evidence for
review.

## Links

- `SKILL.md` — authoritative backlog procedure.
- `backlog.md` — component backlog items.
- `scripts/query.ts` — deterministic parser, weight query, renderer, and response validator.
- `query.test.ts` — schema, weighting, cycle, repository, and response-shape tests.
- `../../backlog.md` — repository backlog index.

## Changelog

- 2026-08-08: Added the table schema, query-time weighting, repository migration, and focused tests.
- 2026-08-08: Recorded and corrected the fresh Pi response-shape defect by requiring the complete eight-column representation.
- 2026-08-02: Separated backlog management from task implementation and lifecycle.
