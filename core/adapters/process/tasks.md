# Task

## Requirement
Implement `core/adapters/process:enforce-process-adapter-emitted-path-policy` at the process-adapter public result boundary only. Preserve private process, workspace, log, record, and recovery operands and all existing lifecycle mechanics while preventing direct or indirect filesystem paths from public handles, durable observations, host observations, diagnostics, recovery results, and nested structured values. Keep task-record authority in task control and do not change launcher/recovery projections, bounded-process-supervisor mechanics, tracer filtering, Git/worktree integration, handoff semantics, or completion authority.

## Plan
1. Read the process adapter record, selected backlog row, execution-contract privacy policy, supervisor implementation/tests, bounded-process-supervisor boundary, and recent evidence-tool enforcement.
2. Inventory exported result and handle surfaces, distinguish private operational inputs from emitted values, and define a supervisor-local fail-closed projection without creating a shared sanitizer.
3. Add provider-free fixtures for handles, durable observations, host observations, diagnostics, permission/cancellation/recovery/handoff/cleanup results, nested malformed values, and complete raw serialized-output absence.
4. Preserve and rerun lifecycle, cancellation, cleanup, recovery, stale, budget, handoff, task-record, and no-leftover regression tests; run no-bundle build, task/content/backlog validation, JSON parsing, diff-check, diagnostics, and final configured-large review.
5. Record completion evidence and clean exactly the selected backlog row and task artifacts in the scoped completion commit.

## Progress
Implemented the owner-local private locator map, path-free public handles, provenance-checked masked runtime references, explicit durable-record/checkpoint/nested-detail projection, bounded public diagnostics, fail-closed health/budget/state projection, and serialized recovery locking. Private process, workspace, record, log, state, cancellation, cleanup, recovery, and task-control mechanics remain internal.

## Validation
- `bun test core/adapters/process/supervisor.test.ts`: 19 pass, 0 fail, 219 expectations.
- `bun test core/adapters/process/bounded-process-supervisor.test.ts`: 2 pass, 0 fail, 10 expectations.
- No-bundle supervisor and bounded-process builds passed.
- `bun core/modules/task-control/task-record-validator.ts core/adapters/process`: `VALID` before completion cleanup.
- `bun skills/managing-as-is-document/content-test.ts`: passed, 49 records and 47 diagrams.
- `bun test skills/managing-backlog/query.test.ts`: 11 pass, 0 fail, 38 expectations.
- Tracked JSON parsing passed.
- VS Code diagnostics reported no issues for changed TypeScript and task files.
- `git diff --check`: passed.
- Final configured-large review found no remaining implementation blocker after fail-closed private-state and diagnostic fixes.

## Result
Completed. Public process-adapter handles, observations, diagnostics, recovery results, and nested structured values now exclude private filesystem operands and fail closed for malformed path-bearing values. Approved runtime navigation retains only validated masked logical references; untrusted runtime references emit `null`. No descendants were authorized or present; descendant closure is vacuously terminal.

## Design Decision
Use the policy-prescribed private map at `${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json`, atomically written with restrictive permissions. Each private locator records the job ID, canonical component identity, task revision, attempt, adapter, record/runtime/workspace/state operands, process handles, runtime state, timestamps, and expiry state. Public `JobHandle` values carry only logical identity, attempt, and an opaque correlation token; lifecycle APIs resolve the token through the private map before any private read. Missing, corrupt, mismatched, dead, or unreattachable entries return durable status with unavailable/unknown runtime evidence and never infer completion, failure, cleanup, or retry. Record-only permission fixtures use an explicit private factory. Routine lifecycle handles do not expose masked runtime references; masking is reserved for approved navigation/debugging projections.

## Blockers And Escalations
Root policy reconciliation completed in commits `ecec968` and `bc671c7`. No blocker remains within this bounded component. Launcher/recovery projections, tracer filtering, task authority, Git/worktree integration, handoff semantics, and completion authority remain outside scope.

## Recovery
Private handles and durable raw record operands remain usable for internal lifecycle operations, but they do not cross emitted boundaries. No descendants were spawned.

## Next Action
Terminal handoff recorded. The component backlog row was removed with evidence-gated cleanup in commit `263f67a`; this completed record is retained as task-control evidence according to the repository's current completed-component record convention.
