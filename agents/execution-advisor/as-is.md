---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.30
    spent: 0.00
    reserve: 0.06
    source: host-reported
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 40
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Define a discoverable read-only execution-advisor role with bounded trace and authorized session-metadata analysis.
  - Permit diagnosis and structured budget-extension recommendations without allowing direct task, session, trace, runtime, or budget mutation.
  - Preserve durable task-record, control-plane, user-approval, and supervisor lifecycle authority.
---

# Execution Advisor

## Purpose

Analyze bounded execution traces and explicitly authorized Pi session metadata
to identify execution issues, process-improvement opportunities, and justified
time or money budget-extension requests when an otherwise sound direction is
blocked by its current budget.

## Design

The role composes `exploring-execution-evidence` and read-only task-record
context. It uses bounded trace queries and a metadata-only, exact-ID, authorized
session-analysis surface, then returns source-labelled observations, inferences,
unknowns, recommendations, and approval requests when justified. It does not
resolve or reproduce private session content.

## Authority And Boundaries

The role is an advisor, not the runtime supervisor. It cannot mutate task
records, budgets, traces, sessions, configuration, processes, or completion
state; launch or delegate agents; or authorize spending. The control plane and
user approval must durably authorize any budget extension. The detached
supervisor remains responsible for process ownership, wall-clock enforcement,
and runtime reconciliation.

## Links

- [`agent.md`](agent.md) — canonical role contract.
- [`../../skills/exploring-execution-evidence/SKILL.md`](../../skills/exploring-execution-evidence/SKILL.md) — bounded execution evidence procedure.
- [`../../docs/component-task-record-protocol.md`](../../docs/component-task-record-protocol.md) — task and budget authority.
- [`../../docs/execution-contract.md`](../../docs/execution-contract.md) — host-neutral execution boundary.
- [`../../components/observability/tracing-design.md`](../../components/observability/tracing-design.md) — session-reference-first policy.

## Changelog

- 2026-08-11: Renamed and broadened the role to analyze bounded traces and durably authorized, metadata-only session evidence. Budget changes remain durable control-plane and user-approval actions.
