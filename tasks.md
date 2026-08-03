---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T05:30:00Z
  task-revision: launcher-expert-authority-repair-1
  attempt: 0
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0.00
      reserve-seconds: 60
      source: unavailable
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

## Prior Evidence
The canonical agent-source migration was blocked because its component-builder launch returned without attributable implementation evidence and required expert validation was unavailable. No migration files were changed. This is a new task revision with a separate bounded budget; no migration retry is authorized by this record.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None. If the authorized chain cannot be reproduced safely within this budget, record the exact blocker and preserve recovery evidence without retrying.

## Recovery
Preserve any incomplete worktree and registry evidence. Do not begin the agent-source migration until this repair is completed and validated.

## Next Action
Launch one bounded component-builder attempt for the launcher repair.
