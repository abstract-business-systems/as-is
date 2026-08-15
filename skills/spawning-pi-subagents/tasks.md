# Task

## Requirement
Implement `restart-reconciliation` as a bounded, durable, idempotent recovery-candidate observation for dead detached runners with non-terminal child records. Do not automatically restart, mutate child task status, reallocate budgets, cancel subtrees, broaden retry authority, call providers, change host/setup behavior, distribute packages, or redesign the registry broadly.

## Plan
1. Inspect the current detached registry, runner lifecycle, `--jobs` status join, task-record evidence extraction, preserved-worktree reporting, and existing launcher/process tests.
2. Define the smallest source-labelled recovery-candidate observation and idempotency key without creating task authority or automatic retry behavior.
3. Implement bounded reconciliation in the launcher observation path and expose the result through `--jobs`.
4. Add provider-free fixtures for dead/non-terminal, dead/terminal, completion-line-present, missing/unreadable record, preserved worktree, and repeated observation behavior.
5. Validate focused launcher/process suites, builds, task/content/backlog/JSON/whitespace checks, and final configured-preset review.
6. Complete through the two-commit lifecycle with concise changelog evidence and exact backlog cleanup.

## Progress
Task selected after configured expert review. Existing `--detach`, detached supervision, wall-clock watchdog behavior, registry launch/completion lines, `--jobs` observation, and preserved-worktree reporting are already implemented. The remaining bounded gap is durable reconciliation evidence for a dead or missing runner whose child task record remains non-terminal. This task treats reconciliation as an observation and recovery-candidate projection only; parent/user authorization remains required for restart or task mutation.

No descendants are authorized.

## Validation
Pending implementation. The expert recommendation used only configured `large` -> `@preset/abs-large` and found no readiness task required. The implementation must remain provider-free and preserve current task authority.

## Result
Pending.

## Blockers And Escalations
If the required observation cannot be represented idempotently without mutating child task authority or inventing retry ownership, stop and record the blocker. Do not convert a recovery candidate into an automatic relaunch, cancellation, status transition, budget extension, or subtree operation.

## Recovery
Retain all existing registry launch/completion lines, task records, result files, and preserved worktree paths. A failed implementation can be reverted to the current read-only `--jobs` crash-candidate observation without affecting child records. Do not remove preserved recovery surfaces.

## Next Action
Inspect the launcher registry and `--jobs` implementation, then add the smallest durable recovery-candidate observation and focused fixtures.
