---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T06:40:00Z
  task-revision: launcher-expert-authority-repair-3
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
Reproduce the role lineage and environment propagation, identify the smallest authorization or attribution defect, implement a scoped fix, and validate the exact chain `as-is -> component-builder -> expert`. Direct user/as-is expert launches must remain rejected.

## Prior Evidence And Authorization
Previous attempts consumed observed wall-clock budgets of 300 seconds and 600 seconds without an implementation handoff. Those observations are historical elapsed-time evidence only; host-reported monetary cost remains unavailable and is recorded as USD spent `0.00`. The user now authorizes this fresh 900-second wall-clock attempt under a new task revision. This is not a silent retry and does not authorize the canonical agent-source migration.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None for this newly authorized attempt. If the chain cannot be completed within the fresh allocation, preserve separate elapsed-time and cost accounting and record a durable blocker without retrying.

## Recovery
Preserve any incomplete worktree, registry, and launcher evidence. Do not begin the agent-source migration until this repair is completed and validated.

## Next Action
Launch one bounded component-builder attempt for the launcher repair with the fresh 900-second allocation.
