# Task

## Requirement
Reconcile the selected `skills:context-building-canonical-name` backlog item by confirming that `skills/context-building/` is the canonical context-building skill and is discoverable through `skills/as-is.md`, without changing its contract or runtime behavior. Preserve neighboring skill ownership and leave implementation unchanged.

## Plan
1. Review the selected backlog row, context-building skill and durable record, Skills catalog, naming guidance, and adjacent context/building contracts.
2. Verify canonical naming, front matter, path, catalog link, and absence of a competing context-building skill authority.
3. Record concise completion evidence, run scoped content, catalog/link, task-record, JSON, and whitespace checks, and obtain final read-only review.
4. Commit the scoped documentation/task handoff, reconcile only `skills:context-building-canonical-name`, remove transient task artifacts, and pause.

## Scope
In scope: `skills/context-building/SKILL.md`, `skills/context-building/as-is.md`, `skills/as-is.md`, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md` only as required for reconciliation. Out of scope: context resolver modules, existing skill implementation changes, agent prompts/front matter, tools, runtime behavior, task-control, host integration, and descendants.

## Acceptance
- The canonical name is `context-building`, the path and front matter agree, and `skills/as-is.md` provides one discoverable catalog link to `context-building/as-is.md#design`.
- No competing skill authority or duplicate catalog entry is introduced; the existing context-building contract and authority boundaries remain unchanged.
- Exact `skills:context-building-canonical-name` completion evidence is recorded and only that backlog row is reconciled.
- Scoped content/navigation, backlog, task-record, JSON, and whitespace checks pass; final expert review approves the handoff; no descendants are authorized.

## Progress
Started from clean committed baseline `cd7326c`. The selected row is open. Current evidence confirms `skills/context-building/SKILL.md` has front matter `name: context-building`, the matching directory, a durable `as-is.md`, and one catalog entry in `skills/as-is.md`; no competing `context-building` skill directory was found. No implementation or runtime change was needed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and the focused canonical-name audit found exactly one matching skill path and exactly one catalog target. No behavior checks were needed because this is a documentation-only reconciliation. Final read-only expert review completed: safe to commit; no blocker.

## Result
The canonical context-building name and catalog discoverability are confirmed with no contract or implementation change. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. If the canonical name or ownership conflicts with another current authority, leave the item open and record the conflict rather than renaming or duplicating a skill.

## Recovery
If validation finds a duplicate or broken link, preserve the task active and record the smallest corrective action. Do not modify context-resolution implementation or neighboring skill authority. Restore only this task's documentation changes if the handoff fails.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:context-building-canonical-name`, remove transient task artifacts, and pause.
