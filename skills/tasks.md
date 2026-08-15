# Task

## Requirement
Complete the selected `skills:building-components-consolidation` exploration item. Compare `building-components`, `maintaining-components`, and `implementing-component-tasks`; determine whether consolidation is justified, preserve distinct authority and lifecycle boundaries, and record the smallest safe recommendation. This is a planning-only task: do not rewrite, merge, rename, or physically move any skill implementation.

## Plan
1. Read the three skill contracts and durable records, applicable instructions, backlog ownership rules, and agent/design consumers.
2. Build a bounded comparison of purpose, inputs, outputs, authority, lifecycle, validation, delegation/recovery, overlap, and unique responsibilities; identify alternatives and migration risks.
3. Record the recommendation in a distinct durable exploration artifact owned by the Skills component, linked from the Skills record, without duplicating operational contracts or altering existing skills.
4. Validate content/navigation, backlog, task-record, JSON, link, and whitespace checks; obtain final read-only expert review.
5. Record completion evidence, commit the scoped planning handoff, reconcile exact identity `skills:building-components-consolidation`, remove transient task artifacts, and pause.

## Scope
In scope: a new subject-named planning artifact under `skills/`, `skills/as-is.md` navigation if needed, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md`. Read-only context includes the three existing skill contracts/records, component-builder role contract, separation design, task protocol, and backlog procedure. Out of scope: changes to existing `SKILL.md` files or `as-is.md` records, agent prompts/front matter, tools, runtime behavior, task protocol, physical moves, and descendants.

## Acceptance
- The comparison covers all three current skills, identifies overlap and retained boundaries, evaluates consolidation alternatives, names migration and consumer risks, and gives an explicit recommendation.
- The recommendation preserves `maintaining-components` as evidence-based housekeeping and `implementing-component-tasks` as task lifecycle/child-boundary authority; `building-components` remains a composition procedure unless evidence justifies otherwise.
- The planning artifact is discoverable without becoming a second operational authority; no existing implementation or runtime behavior changes.
- Content/navigation, backlog, task-record, JSON, link, and whitespace checks pass; final expert review approves the handoff; no descendants are authorized.
- Exact `skills:building-components-consolidation` completion evidence is recorded and only that backlog row is reconciled.

## Progress
Started from clean committed baseline `b555a0d`. The selected row is open. Added `skills/building-components-consolidation.md` as a planning-only comparison. It confirms that `building-components` is a composition procedure, `implementing-component-tasks` owns task lifecycle and child boundaries, and `maintaining-components` owns evidence-based housekeeping; the recommendation is to retain all three separately and compose them.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and a focused comparison audit confirmed all three subjects, four alternatives, recommendation, risks, retained boundaries, and non-authority statement. No implementation or runtime checks were needed because this is a planning-only artifact. Final read-only expert review completed: safe to commit; no blocker.

## Result
The planning comparison supports retaining `building-components`, `maintaining-components`, and `implementing-component-tasks` as separate composable skills. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. If consolidation would require merging distinct primary purposes or moving authority into a skill, recommend retention/separation rather than implementation.

## Recovery
If the comparison cannot distinguish the boundaries from current evidence, record the unknowns and leave the task active. If validation fails, restore only the new planning artifact and task/backlog changes; do not modify existing skill contracts.

## Next Action
Record the concise completion summary, commit the scoped planning handoff, reconcile `skills:building-components-consolidation`, remove transient task artifacts, and pause.
