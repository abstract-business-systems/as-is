---
as-is-version: 2
task:
  status: active
  worker: component-builder
  updated: 2026-08-04T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.90
    spent: 0.00
    reserve: 0.10
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Orient reads durable as-is.md plus transient task.md without mismatch.
  - Worker role can implement bounded changes without committing; expert role is read-only and uses large preset.
  - call_subagent permits only project-controlled worker or expert roles.
  - Component-builder requires expert validation before commit.
---
# Task

## Requirement
Update backlog policy so completed items are removed, correct the managing-backlog skill's prior naming-related guidance, remove completed entries from every existing backlog while preserving open/deferred items, and inspect/explain `skills/as-is/scripts/orient.ts` responsibility and placement.

## Plan
Delegate bounded edits at the `skills/managing-backlog/` and `components/as-is-setup/` component boundaries. Update root backlog policy and root skills guidance, inspect orient implementation/tests, validate all backlog files and focused checks, obtain read-only expert validation, then commit the scoped root handoff.

## Progress
Child component handoffs completed: `skills/managing-backlog` corrected its schema and removed the misplaced naming guidance; `components/as-is-setup` removed its completed backlog row and retained open items. Root backlog policy and completed rows were integrated. `skills/as-is/scripts/orient.ts` was inspected with its focused test.

`orient.ts` produces a compact, read-only orientation snapshot: it obtains task status from `ControlPlane`, reads the root task's next action and changelog, scans design/spec Markdown for open decisions, and reports Git working-tree state. It belongs under `skills/as-is` because it is the deterministic script implementing the `as-is` skill's entrypoint/orientation procedure, while control-plane remains the source of task-state semantics.

## Validation
- `bun test skills/as-is/scripts/orient.test.ts`: passed (1 test, 0 failures).
- `git diff --check`: passed.
- `find . -name backlog.md -print -exec grep -n 'completed' {} \\;`: only policy/prose mentions; no completed-status backlog rows.
- Final read-only expert validation: PASS. Confirmed both backlog files retain only open planning rows, managing-backlog schema/removal policy is corrected with no Naming Guidance section, and the orient explanation matches implementation and test.
- Host-reported delegation cost and wall-clock: unavailable; child records retain source-unavailable accounting.

## Result
Completed the backlog policy and cleanup task. Durable summaries are recorded in `skills/managing-backlog/changelog.md` and `components/as-is-setup/changelog.md`; completed planning rows were removed while open items remain. The orient responsibility and placement are documented in this handoff.

## Blockers And Escalations
None. Expert validation passed. Child commits were integrated as scoped commits; the root policy change remains in this task's handoff.

## Recovery
Resume from the current task record and the scoped diff if commit preparation is interrupted. Child durable summaries are already committed.

## Next Action
Mark this record completed and commit only the root backlog policy, task record, and no unrelated files.
