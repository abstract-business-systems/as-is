---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T05:46:00Z
  task-revision: launcher-expert-authority-repair-1
  attempt: 1
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
Blocked by the bounded launcher attempt: `as-is budget-stopped: limit=wall-clock seconds=300 exit=124`. No scoped implementation handoff, focused test evidence, or expert-validation evidence was produced. `git diff --check` remains clean for the caller worktree.

## Result
Incomplete; the authority repair was not implemented or validated. No migration retry was performed.

## Blockers And Escalations
- The configured component-builder repair attempt consumed its 300-second wall-clock allocation and budget-stopped.
- No attributable child commit or validation evidence is available.
- Do not silently retry or substitute another role. A future attempt requires a new durable authorization with sufficient budget and preserved cumulative accounting.

## Recovery
Preserve any incomplete worktree and registry evidence; inspect launcher job records before any future attempt. This task has spent one bounded attempt with 300 observed seconds. Do not begin the agent-source migration until this repair is completed and validated. Resume only under a new task revision and explicit authorization.

## Next Action
Escalate the budget-stopped authority-repair attempt; no further launch is authorized by this record.
