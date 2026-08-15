# Task

## Requirement
Reconcile the durable Phase 9C task-control migration record after the completed physical move. Update `designs/core-modules-tools-and-skills.md` so its Phase 9C section distinguishes the completed readiness contract and completed physical migration from future work, while preserving the migration evidence, residual risks, authority boundaries, and explicit exclusions. Make no source, import, runtime, schema, setup, host, projection, browser, environment, target, tools, adapters, or further physical migration changes.

## Plan
1. Add the exact selected root backlog identity and establish this documentation-only task from clean migration commit `6914fa4`.
2. Review the Phase 9C section against the completed task-control family, current target records, root changelog, and retained Python reference.
3. Reconcile stale future/absent-target wording into a completed readiness-and-migration record without rewriting historical phase evidence.
4. Run content/navigation, backlog, task-record, JSON, reference, and whitespace checks; obtain final read-only review; commit one scoped documentation handoff.
5. Reconcile the exact backlog identity, remove the paired task artifacts, and pause.

## Scope
In scope: `designs/core-modules-tools-and-skills.md`, the completed target's `core/modules/task-control/as-is.md` navigation link, root backlog/changelog, root task metadata, and configured Markdown task narrative required to reconcile the completed Phase 9C record. Out of scope: all source/test/import changes; task-control implementation behavior; task schema/protocol; Python reference retirement; setup/projection/host changes; browser/environment capabilities; tools/adapters regrouping; further physical migration; and descendants.

## Acceptance
- Phase 9C durable design text accurately records both readiness and completed physical task-control migration; it does not claim the target is absent or the move remains future work.
- Completed inventory, target shape, migration sequence, validation evidence, authority boundaries, recovery, and residual risks remain discoverable and consistent with `core/modules/task-control/` and the retained Python reference.
- Exact selected identity `root:reconcile-task-control-migration-records` is recorded; content/navigation, backlog, task-record, JSON, reference, and whitespace checks pass; one scoped documentation commit is created.
- No implementation, runtime, schema, host, or physical layout behavior changes; no descendants are authorized.

## Progress
Started from clean committed migration baseline `6914fa4`. The physical migration and its completion evidence are durable, but the Phase 9C section used readiness-only wording that said the target was future or absent. The section now distinguishes the completed readiness contract from the completed physical migration and retains the current target, Python reference, boundaries, validation, recovery, and residual-risk evidence.

## Validation
Passed: `bun ./skills/managing-as-is-document/content-test.ts` reported 45 records and 46 diagrams; the target-record design link now resolves to the renamed completed Phase 9C heading; `bun ./skills/managing-backlog/content-test.ts` passed; `python3 components/task-record-validator/task_record_validator.py .` reported `VALID`; `python3 -m json.tool as-is.json` passed; the current-reference audit found no Phase 9C claim that the completed target is absent or that the physical migration remains future work; and `git diff --check` passed. No implementation or runtime checks were rerun because this task changes only durable design/backlog/task-record documentation. The physical migration's focused evidence remains in the root changelog and the completed migration commits.

## Result
The Phase 9C durable design record now accurately reflects both completed readiness and completed physical migration. No implementation, runtime, schema, host, projection, or further physical migration scope was added.

## Blockers And Escalations
No blocker currently. If reconciling the design would require changing implementation ownership, runtime semantics, task protocol, or the approved migration scope, stop and record that boundary rather than expanding this task.

## Recovery
Retain this task if the record cannot be reconciled without changing historical evidence or introducing new authority. Restore only this task's documentation edits if validation fails; do not revert the completed physical migration.

## Next Action
Obtain final read-only review, commit this scoped documentation reconciliation, reconcile `root:reconcile-task-control-migration-records`, remove the paired transient task artifacts, and pause.
