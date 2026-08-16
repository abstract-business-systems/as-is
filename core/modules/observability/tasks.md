# Task

## Requirement
Reconcile the partial post-completion task-artifact cleanup left by commit `4ff0d48` as one separately bounded recovery task. Preserve `changelog.md` and all implementation evidence; change only this component's backlog row and paired task artifacts.

## Plan
- Add the selected recovery identity `reconcile-task-artifact-pair` and establish this active paired record.
- Validate task-record structure, tracked JSON, content/backlog shape, diff scope, and vacuous descendant closure.
- Record concise completion evidence, remove only the exact backlog row, then commit the completion handoff with `{}` in `as-is.json` and no `tasks.md`.

## Scope And Constraints
- Component scope: `core/modules/observability` only.
- No tracer, test, runtime, launcher, evidence, configuration, or privacy changes.
- Preserve existing `changelog.md` and commit `4ff0d48` evidence.
- No descendants are authorized or launched; closure is vacuously terminal.
- No external effects, credentials, provider data, or private runtime/session data.

## Progress
- Task-start artifacts created; implementation evidence remains unchanged.

## Validation
Pending completion checks.

## Result
Pending.

## Recovery
Checkpoint: selected backlog row and active paired task artifacts are present. If any completion gate fails, restore both historical task artifacts from `4ff0d48^`, leave the recovery backlog row, and do not perform completion cleanup.

## Next Action
Run the bounded validation, record completion evidence, and prepare the single completion handoff.
