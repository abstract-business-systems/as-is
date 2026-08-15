# Task

## Requirement
Prepare the separately authorized Phase 9C task-control migration-readiness contract from committed baseline `a64cbac`. Establish an evidence-backed, reversible contract for a future physical `core/modules/task-control/` migration covering the control-plane, budget arithmetic, task-record validator, and pure handoff-eligibility functionality. Preserve current runtime behavior, task-record authority, host-neutral boundaries, setup/projection surfaces, and existing component ownership. Do not create target directories, move or rename source files, change imports, or alter runtime behavior.

## Plan
1. Re-read the committed Phase 4 task-control implementation evidence, current component records, task protocol, core migration design, naming guidance, and all proven consumers.
2. Inventory current task-control implementation paths, focused tests, direct consumers, authority/security boundaries, compatibility concerns, and residual dynamic or host-specific risks.
3. Select and document the smallest target family shape, migration sequence, validation gate, recovery contract, and explicit exclusions in `designs/core-modules-tools-and-skills.md`.
4. Add the exact selected root backlog item and update only affected durable architecture/task-control records; validate content, backlog, JSON task metadata, references, and whitespace.
5. Obtain final read-only review, record evidence, and commit one scoped readiness handoff. No descendants are authorized.

## Scope
In scope: Phase 9C task-control migration-readiness design contract, root backlog selection, and affected task-control/core durable records required to define ownership, consumers, boundaries, target shape, compatibility, validation, and recovery. Out of scope: physical `core/modules/task-control/` creation; source/test relocation; import or runtime changes; validator/control-plane behavior changes; task schema/protocol changes; setup, projection, host, browser, environment, target-machine, tools, adapters, or descendants.

## Acceptance
- The design records an evidence-backed current inventory for control-plane, budget arithmetic, task-record validator, and handoff eligibility implementations and focused tests.
- Direct consumers and authority boundaries are mapped; validation remains mechanically independent from mutation and handoff remains pure.
- One smallest documented `core/modules/task-control/` family shape is selected without creating target directories or broad `core/adapters/` or `tools/` categories.
- The migration sequence preserves repository-local compatibility, host-neutral semantics, task-record authority, setup/projection boundaries, and reversible recovery.
- Exact selected identity `root:task-control-migration-readiness` is recorded; content/navigation, backlog, task-record, JSON, reference, and whitespace checks pass; one scoped documentation commit is created.
- No descendants are authorized; closure is vacuously terminal.

## Progress
Started from clean committed baseline `a64cbac`, immediately after the embedded task-record protocol correction and cleanup. Existing Phase 4A and 4B implementation work is committed and its durable changelog evidence is available. The committed inventory confirms four current boundaries: control-plane mutation, budget arithmetic, read-only task-record validation, and pure handoff eligibility. The target directory remains absent and all current implementation paths remain in place. The design, root backlog, component records, and root changelog now contain the readiness contract and exact selected identity.

## Validation
Passed: `bun ./skills/managing-as-is-document/content-test.ts` reported 44 records and 45 diagrams; `bun ./skills/managing-backlog/content-test.ts` passed; `python3 components/task-record-validator/task_record_validator.py .` reported `VALID`; `python3 -m json.tool as-is.json` passed; `git diff --check` passed; the current-reference audit found no obsolete task-authority wording; the target absence check confirmed `core/modules/task-control/` was not created; and the implementation-path check confirmed the four current source families remain at their existing paths. Focused runtime suites were not rerun because this readiness task makes no implementation or behavior change. Residual risk: dynamic, generated, projected, package, CLI, and external consumers remain to be revalidated during a future physical migration; provider, host, setup, browser, environment, and target behavior remain out of scope.

## Result
The Phase 9C task-control migration-readiness contract is complete and ready for durable handoff. The selected family is one documented future `core/modules/task-control/` component with four focused APIs and tests, while preserving distinct mutation, arithmetic, validation, and handoff authority boundaries. No descendants were authorized; closure is vacuously terminal.

## Blockers And Escalations
No blocker currently. The task-control migration remains readiness-only; any need for implementation changes, schema changes, host integration, or target effects must be recorded as a separate bounded task rather than expanded here.

## Recovery
If design ownership or consumer evidence is materially ambiguous, retain this task record in `active` or `blocked` state and record the missing evidence and next safe action. Do not create target directories or remove existing implementation records. Revert only this task's documentation changes if the selected readiness contract cannot be supported.

## Next Action
Obtain final read-only review, commit this scoped readiness handoff, reconcile `root:task-control-migration-readiness`, remove the paired transient task artifacts, and pause before selecting any physical task-control migration.
