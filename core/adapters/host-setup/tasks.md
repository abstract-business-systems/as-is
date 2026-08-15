# Task

## Requirement
Establish the moved deterministic setup implementation as the concrete `core/adapters/host-setup` adapter owner for the root components dissolution. Preserve behavior and focused evidence; do not transfer host-integration, manifest, projection, target-write, browser, or environment authority.

## Plan
1. Validate the history-preserving move and destination record.
2. Run focused setup tests and content/reference checks.
3. Mark the destination task complete and hand the terminal result to the root task.

## Progress
The implementation and focused test moved from `components/as-is-setup/` to `core/adapters/host-setup/` in root commit `7ec8f20` using tracked-path-preserving Git moves. The destination record now names host-setup as the concrete adapter and retains the host-integration boundary as planning context. No descendants are authorized.

## Validation
Focused setup validation passed: 9 tests and 26 expectations. The tracked move is recorded in root commit `7ec8f20`; destination record, backlog, changelog, and `core/adapters` navigation identify the host-setup owner. The former `components/as-is-setup/` path has no tracked compatibility placeholder. Root task-record validation passed before this destination record was opened; final content/navigation validation is owned by the root integration task.

## Result
Completed the bounded host-setup destination establishment. No descendants were authorized; closure is vacuously terminal.

## Blockers And Escalations
Stop if setup behavior or host-integration authority changes, or if the former components path remains as a compatibility placeholder.

## Recovery
Revert the scoped setup move commit or use `git log --follow` to recover moved files while preserving the root task and destination evidence.

## Next Action
Parent root task must review this terminal handoff and complete root-owned topology reconciliation after the reference-evidence destination is terminal.
