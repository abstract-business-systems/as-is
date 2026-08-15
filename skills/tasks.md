# Task

## Requirement
Reconcile the selected `skills:add-naming-guidance-to-as-is` backlog item by confirming that naming guidance is discoverable in the Skills catalog and is applied by `as-is-setup` and `managing-as-is-document` through inspection of parent/sibling vocabulary and nearby conventions, without requiring a direct naming-skill dependency. Preserve existing naming, setup, record-management, and catalog contracts; make no implementation or runtime changes.

## Plan
1. Review the selected backlog row, naming skill and durable record, Skills catalog, setup and integration contracts, managing-as-is-document contract, and relevant history.
2. Compare each acceptance condition with current links and wording; verify that the two consuming skills name sibling/local convention inspection and do not require an unnecessary direct dependency.
3. Record concise completion evidence, run content/navigation, backlog, task-record, JSON, focused naming, and whitespace checks, and obtain final read-only review.
4. Commit the scoped documentation/task handoff, reconcile exact identity `skills:add-naming-guidance-to-as-is`, remove transient task artifacts, and pause.

## Scope
In scope: `skills/as-is.md`, `skills/naming-software-concepts/` durable guidance, `skills/as-is-setup/SKILL.md`, `skills/integrate-as-is-documentation/SKILL.md`, `skills/managing-as-is-document/SKILL.md`, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md` only as required for reconciliation. Out of scope: implementation changes, runtime behavior, agent prompts, tools, modules, root documents, host setup, and descendants.

## Acceptance
- Naming guidance is discoverable through `skills/as-is.md` and its canonical naming skill record.
- `as-is-setup` and `managing-as-is-document` require inspection of parent/sibling vocabulary or nearby conventions where names or labels are proposed, while not creating an unnecessary direct dependency on the naming skill.
- Existing contracts and authority boundaries remain consistent; no runtime or implementation change occurs.
- Content/navigation, backlog, task-record, JSON, focused naming, and whitespace checks pass; final expert review approves the handoff; no descendants are authorized.
- Exact `skills:add-naming-guidance-to-as-is` completion evidence is recorded and only that backlog row is reconciled.

## Progress
Started from clean committed baseline `c0d6507`. The selected row is open, with notes indicating the work was previously applied. Current evidence shows `skills/as-is.md` links the naming skill, `as-is-setup` instructs inspection of the target parent's existing sibling records and nearby artifacts as naming evidence, `integrate-as-is-documentation` instructs established sibling vocabulary and semantic-departure review, and `managing-as-is-document` applies the same rule for labels. No implementation or runtime change was needed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and the focused naming audit confirmed one catalog target, matching naming front matter, sibling/local vocabulary guidance in setup and record management, and no unnecessary direct naming-skill dependency. The first audit assertion used the wrong phrase for setup's equivalent wording and was corrected before recording this evidence; no repository defect was found. Final read-only expert review completed: safe to commit; no blocker.

## Result
The naming guidance acceptance is supported by current skill contracts and catalog evidence. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. If acceptance requires a missing consumer or a new direct dependency, record the gap rather than broadening scope or rewriting existing skill contracts.

## Recovery
If the audit finds a material gap or contradictory owner, leave the row open and record the precise blocker. If validation fails, restore only this task's scoped documentation changes; preserve the existing naming and record-management contracts.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:add-naming-guidance-to-as-is`, remove transient task artifacts, and pause.
