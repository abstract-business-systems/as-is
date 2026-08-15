# Task

## Requirement
Execute the separately authorized physical Phase 9C task-control migration from the committed readiness baseline `0d3cb7b`. Move the approved TypeScript task-control implementations and focused tests into the documented `core/modules/task-control/` family, update proven repository-local imports and durable navigation atomically, preserve the Python validator reference until separately retired, and preserve all authority, provenance, budget, validation, handoff, host-neutral, setup, projection, and recovery boundaries.

## Plan
1. Record the exact selected migration identity and establish the pre-move implementation/reference inventory.
2. Run focused pre-move control-plane, budget, validator, handoff, supervisor, launcher, worker-tool, orientation, and affected agent/skill checks as the baseline.
3. Use history-preserving tracked moves for the approved TypeScript files/tests; create the documented target records; leave the Python validator reference in its current component.
4. Update proven imports, scripts, READMEs, architecture records, component maps, and navigation; classify stale-path matches and retain only intentional historical/reference paths.
5. Run focused post-move behavior and build checks plus content/navigation, task-record, JSON, reference, stale-path, structural-target, and whitespace validation.
6. Record evidence and residual risk, obtain final read-only review, commit one scoped migration, reconcile the exact backlog identity, remove the paired task artifacts, and pause.

## Scope
In scope: `core/modules/task-control/` target records; the approved TypeScript implementations and focused tests from control-plane, budget-control, task-record-validator, and handoff-eligibility; proven repository-local imports and direct documentation/navigation links; retirement of the control-plane and budget-control component records after durable handoff; retention and update of the Python task-record-validator reference component. Out of scope: Python reference retirement, task schema/protocol changes, validator/control-plane behavior redesign, broad tools/adapters relocation, setup/projection/host changes, browser/environment capability work, target-machine writes, provider changes, and descendants.

## Acceptance
- `core/modules/task-control/` exists as one documented component with focused control-plane, budget, task-record-validator, and handoff-eligibility APIs/tests.
- Approved TypeScript source/tests move with history-preserving tracked paths; the Python validator reference remains at `components/task-record-validator/task_record_validator.py` and is explicitly documented as retained reference evidence.
- Proven repository-local imports, direct README/design links, component/core navigation, and affected durable records are updated; no stale executable import or old implementation-path reference remains outside intentional history/reference evidence.
- Post-move focused behavior/build checks preserve task mutation, budget arithmetic, read-only validation, fail-closed handoff eligibility, supervisor/launcher/worker/orientation consumers, and affected agent/skill behavior.
- Task-record authority, host-neutral boundaries, unavailable-observation semantics, setup/projection boundaries, and recovery remain unchanged; no broad `core/adapters/` or `tools/` directory is created.
- Exact selected identity `root:task-control-family-migration` is recorded; content/navigation, backlog, task-record, JSON, reference, stale-path, structural-target, and whitespace checks pass; one scoped migration commit is created.
- No descendants are authorized; closure is vacuously terminal.

## Progress
Started from clean committed baseline `0d3cb7b` after the readiness contract. The approved target family and migration sequence were documented; the pre-move target was absent and all approved TypeScript paths were retained until the baseline was recorded. The four approved implementation/test pairs now live under `core/modules/task-control/` through history-preserving moves. The Python validator reference remains at `components/task-record-validator/task_record_validator.py`. Proven imports, README guidance, core/component navigation, task-control records, and launcher links have been updated. No broad `core/adapters/` or `tools/` directory was created.

## Validation
Pre-move baseline: the focused combined suite reported 80 passed, 3 known unrelated baseline failures, and 465 expectations; the failures were the existing agent-thinking declaration mismatch, caller-worktree ancestry fixture, and ignored temporary task fixture discovery. Post-move task-control and supervisor suites passed 40 tests and 208 expectations; the task-control builds passed for control-plane and validator. Content/navigation passed with 45 records and 46 diagrams; backlog validation passed; task-record validation reported `VALID`; JSON parsing passed; `git diff --check` passed; stale executable import/path search passed; the target structural check confirmed `core/modules/task-control/` exists and no broad `core/adapters/` or `tools/` directory was created. Durable navigation reconciliation removed stale current-source links from the former control-plane, budget, and validator records and updated the launcher history entry. Residual known failures remain outside the migrated family: repository agent-thinking declaration mismatch, caller-worktree ancestry fixture, and orientation discovery of ignored temporary legacy task fixtures. The Python reference remains at `components/task-record-validator/task_record_validator.py`; no runtime/schema/setup/host/projection behavior was intentionally changed.

## Result
The approved task-control TypeScript family has been physically migrated to `core/modules/task-control/` with focused tests, proven consumers, durable navigation, and distinct authority boundaries preserved. The Python validator reference remains intentionally retained. The known full-suite failures are unrelated baseline or ignored-fixture conditions and do not involve the migrated task-control behavior.

## Blockers And Escalations
No blocker currently. If a dynamic, generated, projected, package, CLI, or external consumer requires a compatibility path or changes the approved target shape, stop and record the evidence rather than broadening the migration.

## Recovery
Before moving, retain the complete path inventory and baseline test results. If any move or reference update is partial, keep this task active or blocked, restore the prior paths/references or revert only this task's migration commit, and do not retire the Python reference or claim completion until all focused checks and durable records reconcile.

## Next Action
Record the exact completion evidence in the root changelog, then reconcile `root:task-control-family-migration` and remove the paired transient task artifacts.
