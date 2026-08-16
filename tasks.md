# Task

## Requirement
Coordinate implementation of a bounded fixed focused-check capability for the read-only `evidence-validator` profile. The capability must be parameterless and code-owned, run only an enumerated local deterministic suite, return bounded fail-closed evidence, and preserve task, commit, integration, completion, privacy, session, provider, and authority boundaries.

## Plan
- Review the cancelled documentation-only child task, current launcher/profile/inspection extension, evidence-validator role contract and tests, task protocol, and root architecture records.
- Delegate one sequential launcher-owned child for the fixed tool, literal suite runner, bounded result/error handling, profile wiring, and launcher/extension tests.
- Delegate one sequential evidence-validator-owned child for the role contract, durable role context, and provider-independent focused behavioral coverage.
- Integrate each validated child commit into the root worktree, run cross-component checks, obtain fresh final read-only expert validation, and complete only after descendant closure.

## Progress
- User explicitly authorized implementation rather than narrowing the stale documentation-only acceptance.
- The prior `skills/spawning-pi-subagents:dynamic-expert-validation-access` task was cancelled and superseded; its backlog row remains represented by this selected root identity. The cancelled child is accounted for as prior superseded work, not an active descendant.
- The proposal was moved to root because implementation crosses `skills/spawning-pi-subagents` and `agents/evidence-validator`; the exact identity and intent are preserved.
- The launcher child completed and was integrated directly from commits `d7c67ef`, `2c05675`, `88c02f9`, `fd1dd8f`, `8f6e666`, and `ddf221c`. Its final state and focused evidence are preserved in the launcher changelog; no child role contract was changed.

## Validation
Launcher child validation passed: focused extension 4 tests with 20 expectations; launcher 51 tests with 322 expectations; both no-bundle Bun builds; task-record `VALID`; content/navigation 49 records and 47 diagrams; tracked JSON parsing; and `git diff --check`. Fresh final child expert validation returned `PASS — safe to integrate`. Unrelated pre-existing process/usage-accounting recovery files remain uncommitted and excluded. The evidence-validator role child remains to be planned and implemented.

## Result
Launcher child is complete and integrated. Root coordination remains active pending the sequential evidence-validator role-contract child, cross-component validation, and final expert review.

## Blockers And Escalations
The fixed suite identifier, exact literal argv/file set, timeout, output cap, and minimal environment must be finalized in the child plan before implementation. No generic command runner or caller-controlled selector is authorized.

## Recovery
Checkpoint: selected root backlog row and active root task pair are present. The prior cancelled documentation-only task remains recoverable in its terminal record and history. If a child fails or is interrupted, preserve its active record/worktree/commit as applicable, integrate no unvalidated result, retain the selected root row, and account for the failed/cancelled descendant before any root completion. If the fixed-check mechanism cannot be bounded fail-closed, stop and retain the proposal without weakening the profile.

## Next Action
Obtain fresh root plan confirmation for the remaining evidence-validator child, then create its paired task record and implement only the role-contract and provider-independent focused behavioral coverage. Do not alter launcher runtime beyond the integrated child handoff.
