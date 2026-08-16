# Task

## Requirement
Implement `core/modules/observability:allowlist-child-wait-phase`. Restore only the existing process-supervisor `phase: "child-wait"` trace attribute at the observability projection boundary. Other phase values and unapproved attributes remain omitted. Do not change the process adapter, launcher, task authority, process behavior, privacy policy breadth, or any other trace attribute domain.

## Plan
1. Read the observability durable record, selected backlog row, tracer implementation/tests, process supervisor producer/test, and emitted-path privacy contract.
2. Obtain a read-only expert plan review before editing.
3. Add `phase` to the tracer allowlist with the sole string domain `child-wait`; preserve fail-closed omission for all other values.
4. Add focused tracer coverage for admitted and rejected phase values, then run the observability and process-supervisor suites.
5. Run task/content/backlog validation, JSON parsing, `git diff --check`, diagnostics, and final configured-large expert review.
6. Record residual risk only for separately owned future trace attributes and emitted surfaces.

## Progress
Selected exact backlog identity `core/modules/observability:allowlist-child-wait-phase`. The completed emitted-path privacy projection correctly omits unapproved strings, but the existing process-supervisor `child-wait` span contract emits and tests `phase: "child-wait"`. The active task is limited to the observability projection and focused tests. No descendants are authorized.

## Validation
Pending. Acceptance requires focused observability tests, the focused process-supervisor suite, task-record/content/backlog validation, JSON parsing, `git diff --check`, changed-file diagnostics, and final configured-large expert review.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Do not broaden this correction into other phase values, process-supervisor edits, launcher changes, generic sanitization, task-control changes, or authority changes.

## Recovery
No descendants are authorized. Preserve the completed emitted-path privacy behavior if interrupted. Restore the selected observability backlog/task pair from Git if completion cleanup is interrupted; do not alter the process adapter or absorb launcher task state.

## Next Action
Obtain the required read-only expert plan review before editing.
