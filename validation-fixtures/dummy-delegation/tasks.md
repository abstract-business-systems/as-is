---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-04T03:30:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.05
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 30
      spent-seconds: 0
      reserve-seconds: 10
      source: unavailable
  external-effects: prohibited
acceptance:
  - The deterministic dummy delegation rehearsal has a bounded, scoped handoff.
---
# Dummy Delegation Task

## Requirement
Run only the harmless dummy delegation fixture; do not modify product components.

## Plan
Use a deterministic stub, one child attempt, one scoped commit, and explicit parent integration classification.

## Progress
Ready for the controlled rehearsal.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None.

## Recovery
Preserve any dirty worktree and record its path before cleanup.

## Next Action
Run the fixture test without a provider call.
