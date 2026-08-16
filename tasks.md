# Task

## Requirement
Complete the preserved bounded Pi usage-accounting dependency across the mechanical process boundary and the `skills/spawning-pi-subagents` launcher. Capture bounded child stdout without changing process authority, parse secret-safe finite Pi usage/cost observations, persist private accounting evidence, and keep public handles, registries, diagnostics, traces, task records, and authority boundaries path- and payload-safe.

## Plan
- Start the root coordination task for the exact `execution-usage-accounting` backlog identity and preserve the existing WIP as recovery evidence.
- Delegate the mechanical `core/adapters/process` stdout-observation child first; integrate only after its focused validation and scoped handoff pass.
- Delegate the sequential `skills/spawning-pi-subagents` accounting child after process-boundary closure; integrate only after parser, persistence, privacy, and launcher regression evidence pass.
- Run cross-component validation, obtain fresh read-only expert review, record concise root completion evidence, remove only the exact root backlog row, and commit the completion patch without unrelated recovery work.

## Progress
- User explicitly authorized continuing the preserved usage-accounting work after compaction.
- The committed launcher currently imports `./pi-usage-accounting.ts` and reads `stdoutText`, while those implementation files are preserved outside `HEAD`; a clean checkout is therefore currently incomplete until this task either completes that dependency or records a separately authorized rollback.
- The preserved WIP is recovery evidence from `stash@{1}` and the new `stash@{0}`; it is not task authority and will be applied only within the bounded child scopes.
- The permanent execution-accounting design remains the authoritative contract for path/revision/attempt identity, worker-subtree attribution, unavailable values, deduplication, and private runtime metadata.
- Fresh expert plan review identified five required tightenings before launcher implementation: remove caller-controlled `--accounting-path`; pass stdout availability/truncation into accounting semantics; do not coerce invalid numeric fields to zero; retain private accounting beyond normal blocking cleanup; and omit response identifiers/raw provider content from all durable/public projections.
- The process child completed in source commit `dd70662` and completion commit `4c264c8`; its bounded 4 MiB stdout observation is integrated in the root branch.

## Validation
Pending child implementation and cross-component validation.

## Result
Pending.

## Blockers And Escalations
The accounting work crosses `core/adapters/process` and `skills/spawning-pi-subagents`; the root coordinates sequential children under `maxConcurrentTasks: 1`. No public handle, registry, trace, task record, or provider payload may expose accounting paths or raw usage data. If the existing WIP cannot satisfy the fixed accounting/privacy contract without broader authority or host changes, stop and record a bounded blocker rather than expanding scope.

## Recovery
Checkpoint: root task and selected backlog identity are recorded; the preserved usage-accounting WIP remains in Git stash and the worktree is clean before child task creation. If a child fails or is interrupted, preserve its task record and worktree/commit evidence, integrate no unvalidated result, account for the terminal outcome, and retain the selected root row. Do not delete the WIP or reset the committed launcher dependency without an explicit bounded decision.

## Next Action
Create the process-boundary child task and commit the root task-start handoff before implementation. Then run the process child sequentially and inspect its validated handoff before creating the launcher accounting child.
