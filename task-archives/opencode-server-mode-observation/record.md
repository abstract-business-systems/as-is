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
  external-effects: prohibited
acceptance:
  - Use only repository and host evidence available through the configured
    `implementer`; do not use web research, external services, or unrelated host
    changes.
  - Determine whether OpenCode server mode provides easier navigation or
    observation of nested subagents than terminal mode, and record the evidence
    boundary, supported conclusion, unsupported conclusion, and uncertainty in
    a durable decision artifact within this component.
  - Inspect the local OpenCode adapter/configuration and available host
    capability evidence without claiming live control, task authority, or
    nested-subagent support that the evidence does not establish.
  - Define and run a smallest relevant local evidence check, record its direct
    observations and residual risk, and include actual host-reported cost and
    host-observed wall-clock use in the handoff.
  - Preserve the historical blocked/no-retry fixture, current authority
    semantics, and `config.scheduling.maxConcurrentTasks: 1`; make no unrelated
    host or repository changes.
---

# OpenCode Server-Mode Observation

## Purpose

Provide a bounded repository/host-evidence decision about whether OpenCode
server mode improves navigation or observation of nested subagents compared
with terminal mode, without turning that observation into a host-control
implementation.

## Requirement

This is a later, sequential implementer-owned research/decision child. The
configured `implementer` is the only selected worker because the task is a
bounded local evidence and durable-artifact handoff; no alternate role may be
substituted. Inspect the explicitly named local adapter and host capability
artifacts, run only local checks that do not contact external services, and
write the decision and its supported/unsupported boundary inside this
component. Do not make unrelated host changes or edit the historical fixture.

## Plan

Remain `ready` until the orchestrator explicitly schedules this task after
checking sibling independence and available allocation. At activation, inspect
`opencode-adapter.md`, `.opencode/package.json`, the relevant local agent
definitions, and the durable control-plane boundary; define the evidence set
and target decision artifact, run the smallest local observation, and record the
conclusion, limits, residual risk, cost, wall-clock, and recovery state.

## Progress

Created atomically by the root orchestrator at `2026-07-26T18:05:39Z`.
This child is intentionally unscheduled; it has no worker attempt, evidence
observation, cost observation, or wall-clock observation.

## Validation

No validation has run. The implementer must distinguish direct host/repository
observations from inference and must record an unsupported boundary when the
available evidence cannot establish a comparison.

## Result

Pending a future explicit sequential launch through the configured
`implementer`.

## Blockers And Escalations

No role blocker is present at creation: `implementer` is the configured and
selected worker for this bounded local decision. If that worker is unavailable,
a task event names another role, or the return cannot be attributed to it, the
orchestrator must record a durable blocker and stop without retrying or
substituting. Lack of local evidence is a task blocker, not permission to use
web research or alter the host.

## Recovery

The recovery checkpoint is this `ready` record and the named local adapter,
package, and agent-definition dependencies. On interruption, reread this
record, preserve any evidence already recorded, and use only the configured
`implementer`; do not infer a server/terminal conclusion from process absence.

## Next Action

Keep this record `ready` and unscheduled. The orchestrator may launch it only
after the first child handoff and the separately sequenced visibility work are
assessed, or may record a durable evidence blocker if the canonical worker is
not appropriate or available.
