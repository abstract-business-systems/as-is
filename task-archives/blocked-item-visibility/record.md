---
as-is-version: 2
task:
  status: ready
  worker: implementer
  updated: 2026-07-26T18:05:39Z
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 60
      spent-seconds: 0
      reserve-seconds: 15
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Define the exact changed-artifact set and display/reporting acceptance test
    after inspecting the first child's durable handoff and applicable local
    status-query patterns; do not start this task concurrently with the first
    child.
  - Improve durable visibility so a user reviewing root status cannot miss a
    blocked descendant, including the historical
    `validation-fixtures/increment-5-cost-observability` record, while
    preserving its `blocked` and explicit no-retry state.
  - Preserve task authority semantics, record-only status sourcing,
    higher-authority constraints, and `config.scheduling.maxConcurrentTasks: 1`;
    make no semantic authority change without repository evidence and a
    recorded decision.
  - Add or update a deterministic display/reporting acceptance test that proves
    a root status review visibly identifies the blocked descendant, its
    no-retry boundary, and the required next action without private runtime
    state.
  - Run the smallest relevant validation and record residual risk, recovery
    state, actual host-reported cost, and host-observed wall-clock use before
    handoff.
---

# Blocked Item Visibility

## Purpose

Make durable blocked-descendant state conspicuous in root status reporting so a
human can see a blocker without scanning private runtime state or guessing from
an aggregate status.

## Requirement

Establish this as a later, sequential implementer-owned child. It depends on the
first `control-plane/` handoff as an explicitly named external dependency
and must not run concurrently with it. Inspect the resulting local status
implementation and task-record patterns, then implement only the bounded
visibility improvement and its deterministic display/reporting evidence within
this component. Preserve the historical blocked/no-retry fixture exactly; do not
retry, edit, or substitute it.

## Plan

Remain `ready` until the orchestrator records that the first child is no longer
active and explicitly launches this child. At activation, inspect the named
dependency, define the target artifact set and acceptance output, implement the
smallest evidence-backed visibility change, and validate its root-status display
behavior.

## Progress

Created atomically by the root orchestrator at `2026-07-26T18:05:39Z`.
This child is intentionally unscheduled; it has no worker attempt, target-file
decision, cost observation, or wall-clock observation.

## Validation

No validation has run. The required evidence is a deterministic reporting test
whose observed output names the blocked descendant, retains no-retry status, and
shows the next safe action from durable records alone.

## Result

Pending sequential launch after the first child handoff is assessed.

## Blockers And Escalations

The current blocker is scheduling order: this child must not run concurrently
with `control-plane/`. A proposed authority or retry semantic change is not
within this task's authority and must be escalated with repository evidence.

## Recovery

The recovery checkpoint is this `ready` record and its named dependency on the
first child handoff. Do not activate it from a missing or private runtime
signal; reread the first child record and preserve the historical fixture
before a future launch.

## Next Action

Keep this record `ready` and unscheduled. After the first child is handed back
and the orchestrator has assessed its validation and residual risk, decide
whether to launch this configured `implementer` task.
