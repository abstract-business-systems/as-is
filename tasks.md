---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T08:40:00Z
  task-revision: canonical-role-source-phase-2
  attempt: 0
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: host-observed elapsed-seconds only; not monetary cost
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0.00
      reserve-seconds: 60
      source: explicit current-turn authorization; overrides 300-second default for this bounded phase
  external-effects: require-current-turn-user-approval
acceptance:
  - All four role directories exist under top-level agents/ as the sole canonical source.
  - No duplicate tracked role source remains under .agents/agents/.
  - .agents documentation and links identify .agents/agents as host projection only and point canonical references to agents/.
  - Only root coordination and .agents source-layout artifacts change; setup, launcher, product, and unrelated components remain unchanged.
  - Focused path/reference checks and git diff --check pass; one scoped commit is created and rollback is its revert.
---
# Canonical Role-Source Phase 2

## Requirement
Execute the explicitly approved first phase of Option B: move `.agents/agents/{as-is,component-builder,expert,worker}` to top-level `agents/` as the sole canonical role-source tree. Treat `.agents/agents/` as host projection only, without maintaining duplicate tracked role files.

## Ownership Decision
The root component owns migration coordination and the canonical top-level `agents/` tree. The `.agents` component owns only its projection documentation and links; it does not retain duplicate role source files. This phase may modify only `agents/`, `.agents/`, and root task/changelog handoff records. Setup wiring and launcher references are explicitly deferred to later phases.

## Scope And Rollback
Move the four role directories atomically in one scoped handoff. Update `.agents` durable documentation and links. Do not modify `components/as-is-setup`, `skills/spawning-pi-subagents`, product components, or unrelated documentation. Rollback is reverting the single scoped migration commit; do not delete projection state outside this phase.

## Plan
Reread current records and prior blocker evidence. Obtain expert plan review under the explicit ownership decision, perform the move, run acceptance-mapped path/reference checks and `git diff --check`, obtain final expert validation, and create one scoped commit. Verify unrelated paths remain unchanged.

## Prior Evidence And Authorization
The previous phase was blocked because ownership, projection representation, acceptance checks, rollback, and budget authority were not explicit. The user has now approved this scope resolution. The current turn authorizes a fresh 600-second wall-clock phase, overriding the 300-second default unit budget; monetary cost remains `spent: 0.00` because host cost is unavailable.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None for this newly authorized phase. If expert review or implementation identifies a boundary not covered here, stop and record it rather than expanding scope.

## Recovery
Preserve any incomplete worktree and registry evidence. If the move is incomplete, restore only within the controlled worktree; do not alter the caller projection or retry silently.

## Next Action
Launch one bounded component-builder attempt for the explicitly approved role-source phase.
