---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-08-02T00:00:00Z
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
tasks.

## Design

The backlog is a planning index. Active status belongs to transient `task.md`
files and completed summaries belong to component `changelog.md` files.

## Links

- `SKILL.md` — authoritative backlog procedure.
- `../../backlog.md` — repository backlog index.
- `../managing-backlog-and-tasks/SKILL.md` — task lifecycle procedure.

## Changelog

- 2026-08-02: separated backlog management from task implementation and lifecycle.
