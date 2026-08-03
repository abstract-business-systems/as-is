---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T06:20:00Z
  task-revision: launcher-expert-authority-repair-2
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
      allocated-seconds: 600
      spent-seconds: 300
      reserve-seconds: 60
      source: host-observed prior attempt; fresh 600-second authorization; cumulative ceiling 900 seconds
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
A prior repair attempt (`launcher-expert-authority-repair-1/1`) consumed its 300-second wall-clock allocation and budget-stopped without a child commit or validation evidence; that accounting is preserved. The user now authorizes a fresh bounded 600-second attempt under this new task revision. This is not a silent retry and does not authorize the agent-source migration.

## Validation
The configured chain did launch an expert from component-builder, but the mandatory plan review failed on budget admission: the task record conflated prior elapsed seconds with USD cost and did not admit a fresh 600-second allocation after reserve. No implementation or focused validation was authorized.

## Result
Blocked before implementation. No launcher repair was made and no migration retry occurred.

## Blockers And Escalations
- Prior 300 seconds is preserved as wall-clock history, not monetary cost; host cost remains unavailable.
- The previous 600-second authorization was not admitted cumulatively after the retained reserve, so the expert correctly rejected the attempt.
- No child implementation commit or validation evidence exists. Do not retry until a fresh task revision records unambiguous units and admission.

## Recovery
Preserve the expert and component-builder evidence, including `/tmp/as-is-child-27vm10/worktree`. Correct the task accounting in a new authorized revision before retrying. Do not begin the agent-source migration until this repair is completed and validated.

## Next Action
Await explicit budget-accounting reconciliation; no further launch is authorized by this blocked record.
