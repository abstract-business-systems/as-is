---
as-is-version: 2
task:
  status: active
  worker: component-builder
  updated: 2026-08-04T01:00:00Z
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
Implement the approved backlog/context alignment: make `backlog.md`, `changelog.md`, and `task.md` filenames configurable; classify root backlog items under owning component backlogs; correct deterministic-skills semantics and classify it under skills; move validator and tracing items to their component backlogs; preserve open/deferred items and completed-item removal policy; and provide an approach for remaining root backlog items without implementing them.

## Plan
Update root configuration/protocol-facing documentation and root backlog classification, delegate bounded child backlog updates to the owning component builders, validate backlog ownership and filename configuration, obtain read-only expert validation, then commit the scoped root handoff and integrate child commits.

## Progress
Root task is active. Child backlog reclassification is integrated; root edits preserve remaining items as open/deferred and do not implement them.

## Validation
- Pre-change protocol and task records inspected.
- Read-only expert validation initially failed on deterministic-skills wording and contradictory stale task handoff; both corrected.
- Final read-only expert validation passed against committed HEAD `f513a5939cc3af002b1e3a0194bff180da8e7b76`.
- `git diff --check` passed; focused orient and observability tests passed (1 and 2 tests respectively).
- Host-reported child cost unavailable; child wall-clock was observed by launcher but no cost estimate is claimed.

## Result
Completed implementation and scoped commit: durable component backlogs and root planning index are aligned without implementing remaining backlog items. The transient record is intentionally retained active per the user request.

## Blockers And Escalations
None. Expert validation passed. Child commits were integrated as scoped commits; the root policy change remains in this task's handoff.

## Recovery
Resume from the current task record and the scoped diff if commit preparation is interrupted. Child durable summaries are already committed.

## Next Action
Handoff is committed at `f513a5939cc3af002b1e3a0194bff180da8e7b76`; retain this active transient task record as requested. No remaining backlog item is implemented by this task.
