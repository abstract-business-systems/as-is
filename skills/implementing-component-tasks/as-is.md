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
  - Define deterministic bounded component-task implementation and handoff.
---

# Implementing Component Tasks

## Purpose

Provide the reusable implementation procedure for one bounded component task.

## Design

This skill owns transient task creation, scoped implementation, child-boundary
delegation, deterministic validation, changelog handoff, and task cleanup.

## Links

- `SKILL.md` — authoritative implementation procedure.
- `../../docs/component-task-record-protocol.md` — task and component boundaries.
- `../managing-backlog/SKILL.md` — task selection input.

## Changelog

- 2026-08-02: separated task implementation from backlog prioritization.
