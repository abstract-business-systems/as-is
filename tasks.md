---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-08-03T06:40:00Z
  task-revision: launcher-expert-authority-repair-3
  attempt: 1
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
      allocated-seconds: 900
      spent-seconds: 0.00
      reserve-seconds: 90
      source: host-observed cumulative history retained separately; fresh 900-second authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Reproduce and explain the authorized as-is -> component-builder -> expert path without weakening direct expert authorization rules.
  - Apply the smallest launcher/orchestration repair needed for builder-owned expert validation to start and be attributable.
  - Add focused regression coverage for authorized builder-owned expert validation and unauthorized direct expert launch.
  - Preserve unrelated work and validate focused launcher tests, build, and diff check.
---
# Launcher Expert-Authority Repair

## Requirement
Repair the launcher authority/attribution path that prevented the configured component-builder from starting its mandatory expert plan review. Do not perform the canonical agent-source migration in this task.

## Scope
Only launcher/orchestration files and focused tests/docs owned by `skills/spawning-pi-subagents`; root task/changelog handoff is allowed. Do not modify product components, agent role contracts, or unrelated components. Use only component-builder for implementation.

## Plan
1. Reproduce the role lineage and environment propagation with launcher dry-runs.
2. Add the smallest focused regression coverage for component-builder -> expert authorization and direct expert rejection.
3. Run focused tests, Bun build, and diff check, then obtain fresh expert validation before commit.

## Prior Evidence And Authorization
Previous attempts consumed observed wall-clock budgets of 300 seconds and 600 seconds without an implementation handoff. Those observations are historical elapsed-time evidence only; host-reported monetary cost remains unavailable and is recorded as USD spent `0.00`. The user now authorizes this fresh 900-second wall-clock attempt under a new task revision. This is not a silent retry and does not authorize the canonical agent-source migration.

## Validation
`expert` plan review was launched through the launcher with caller `component-builder`; launcher attribution accepted the bounded review path. Focused launcher test passed (16/16), Bun build passed, and `git diff --check` passed. Fresh `expert` validation was launched through the same launcher with caller `component-builder` and parent job id; no implementation-scope blocker was reported. Direct expert launch from `user` remains rejected. Host-observed implementation/check elapsed time was approximately 10 seconds; monetary cost unavailable.

## Result
Completed: launcher authority now requires a propagated parent job id for worker/expert identities while preserving component-builder-owned expert validation. Focused regression coverage verifies builder-owned expert authorization and direct expert rejection. Safe to commit after the fresh expert validation.

## Blockers And Escalations
None for this newly authorized attempt. If the chain cannot be completed within the fresh allocation, preserve separate elapsed-time and cost accounting and record a durable blocker without retrying.

## Recovery
Preserve any incomplete worktree, registry, and launcher evidence. Do not begin the agent-source migration until this repair is completed and validated.

## Next Action
Commit the scoped launcher, focused test/docs, task-record, and changelog handoff.
