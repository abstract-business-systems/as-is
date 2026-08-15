# Task

## Requirement
Reconcile the selected `skills:bounded-directory-or-project-as-is-setup` backlog item by confirming that the canonical `as-is-setup` procedure supports whole-project setup by default and explicit directory-scoped setup as an independent bounded target. Preserve its boundary, instruction, candidate, record, validation, and no-parent-discovery rules without changing implementation or runtime behavior.

## Plan
1. Review the selected backlog item, `skills/as-is-setup/SKILL.md`, its durable record, integration composition, setup component evidence, configuration/task protocol, and naming/structuring guidance.
2. Compare each acceptance condition against the current procedure and identify any material gap or contradiction.
3. Record concise completion evidence, run content/navigation, backlog, task-record, JSON, focused scope-mode, and whitespace checks, and obtain final read-only review.
4. Commit the scoped documentation/task handoff, reconcile exact identity `skills:bounded-directory-or-project-as-is-setup`, remove transient task artifacts, and pause.

## Scope
In scope: `skills/as-is-setup/SKILL.md`, `skills/as-is-setup/as-is.md`, `skills/integrate-as-is-documentation/SKILL.md` only as read-only context, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md` only as required for reconciliation. Out of scope: setup implementation/tests, host adapters, projections, target writes, runtime behavior, root documents, and descendants.

## Acceptance
- The procedure clearly defines whole-project mode as the default when no directory is supplied.
- The procedure clearly defines explicit directory-scoped mode as an independent setup root, limits inspection and writes to the target and descendants, and excludes enclosing project root, parent instruction, siblings, and ancestors.
- The target root record, applicable target-local instruction, candidate review, human approval, canonical instruction injection, and before/after boundary validation are stated consistently.
- Exact `skills:bounded-directory-or-project-as-is-setup` completion evidence is recorded and only that backlog row is reconciled.
- Content/navigation, backlog, task-record, JSON, focused scope-mode, and whitespace checks pass; final expert review approves the handoff; no descendants are authorized.

## Progress
Started from clean committed baseline `8a67bf0`. The selected row is open and depends on the completed `skills:as-is-setup-skill` item. Current `skills/as-is-setup/SKILL.md` explicitly defines both modes, describes the supplied directory as the independent setup root, limits inspection/modification to that directory and its descendants, excludes enclosing-project and sibling paths, establishes target-local instruction ownership, root-record placement, candidate review, canonical instruction injection, and before/after path-boundary validation. No files have changed for this reconciliation task yet.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and the focused scope-mode audit confirmed whole-project default, explicit independent directory target, target/descendant confinement, exclusion of enclosing and sibling paths, target-local instruction ownership, and before/after path validation wording. The first audit assertion used a different phrase from the equivalent current wording and was corrected before recording this evidence; no repository defect was found. Final read-only expert review completed: safe to commit; no blocker.

## Result
The whole-project and explicit directory-scoped setup acceptance is supported by the current procedure. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. If the current contract depends on parent discovery or implementation changes not present in the skill record, leave the item open and record the precise gap.

## Recovery
If a scope-mode contradiction is found, leave the task active and preserve the current skill contract. If validation fails, restore only this task's scoped documentation changes; do not modify setup implementation or host projections.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:bounded-directory-or-project-as-is-setup`, remove transient task artifacts, and pause.
