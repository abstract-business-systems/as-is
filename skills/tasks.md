# Task

## Requirement

Prepare and evaluate the skills-owned decision context for `skills:reconciling-as-is-records`. A root-owned manual vertical-slice pilot will realign canonical `as-is.md` records with their owned implementation, then determine whether repeated hierarchy-wide reconciliation requires a distinct reusable coordination skill or can remain manual coordination plus existing record-management guidance.

This skills task owns neither cross-component pilot execution nor fixture-record edits. The root `tasks.md` owns target revision, pilot graph, serial admission, budgets, recovery, and coordination; each fixture component owns any local record change. The pilot deliberately does not use `implementing-component-tasks` or `building-components` as execution procedures. `managing-as-is-document` remains applicable only to durable record meaning and structure.

## Plan

| Phase | Purpose | Completion evidence |
| --- | --- | --- |
| 1. Prepare | Establish the bounded requirement, ownership, acceptance conditions, constraints, and baseline. | Task metadata, backlog selection, and pilot boundary agree. |
| 2. Inspect | Compare individual record-management guidance with the root pilot coordination contract. | Evidence identifies existing semantic coverage and any remaining coordination gap without treating a generic task skill as the pilot executor. |
| 3. Observe pilot | Consume the root pilot's bounded outcome after its leaf-first record alignment and parent reconciliation. | The root record supplies actual declared inputs, outputs, recovery points, friction, and validation. |
| 4. Decide | Choose manual composition or a narrowly named new skill based on pilot evidence. | Decision records alternatives, rationale, authority boundaries, and residual risk. |
| 5. Validate and hand off | Run focused checks and prepare the durable result for completion reconciliation. | Validation evidence, changelog summary, and scoped handoff are ready. |

## Progress

- Phase 1 — Prepare: complete. The selected backlog item is `skills:reconciling-as-is-records`; the skills component owns the eventual reusable-procedure decision, not the cross-component pilot.
- Phase 1 checkpoint: real alignment means each component compares its own `as-is.md` with owned implementation and repairs only supported stale documentation. A parent consumes final immediate-child records as semantic inputs; it does not receive child implementation, tests, task narratives, transcripts, or grandchildren.
- Phase 1 checkpoint: the root manual pilot is `validation-fixtures/` plus its four documented child components; it excludes `agent-capability-probe/` and root reconciliation. Leaves align first, the fixture parent follows, and root coordination evaluates the outcome. The root task is the campaign authority.
- Phase 1 checkpoint: `implementing-component-tasks` and `building-components` are not pilot execution procedures. Model, cache, batching, and launch policy remain root/orchestrator concerns and are out of the candidate skill contract.
- Phase 1 checkpoint correction: local task metadata is `as-is.json`, matching the executable control plane, task validator, supervisor, launcher status join, and existing JSON-backed fixtures. The protocol/design references to `as-is.json.task` remain a separately scoped migration discrepancy; this correction does not resolve or weaken that contract question.
- Phase 2 — Inspect: complete. Existing skills cover individual semantic alignment, ordinary task lifecycle, and component boundaries, but do not themselves supply the root pilot's graph, post-order admission, final-child-record interface, or aggregate hierarchy evaluation.
- Phase 3 — Observe pilot: pending root task admission and its owner-boundary outcomes.
- Phase 4 — Decide: not started.
- Phase 5 — Validate and hand off: not started.

## Validation

| Check | Result | Residual risk |
| --- | --- | --- |
| Backlog schema and selected item reviewed against `skills/managing-backlog/SKILL.md` | Passed by inspection | The selected status is a planning input, not task completion authority. |
| Task companion implementation and repository convention reviewed against `docs/component-task-record-protocol.md`, `docs/configuration.md`, and `components/control-plane/control-plane.ts` | Passed by inspection | The protocol/design use `as-is.json.task`, while the current executable control plane and validator use local `as-is.json`; this checkpoint follows the executable repository convention. Reconciling that broader migration discrepancy is out of this pilot's scope. |
| Component boundary reviewed against `skills/as-is.md` and `skills/spawning-pi-subagents/as-is.md` | Passed by inspection | Pilot evidence may reveal a better owning component; any scope change requires reconciliation. |
| Corrected checkpoint orientation | `bun skills/managing-as-is-document/scripts/orient.ts` returned the ready `skills` task. | It establishes executable record discovery, not pilot completion. |
| Focused record checks | `bun test components/control-plane/control-plane.test.ts`, `bun test skills/managing-as-is-document/scripts/orient.test.ts`, and `python3 components/task-record-validator/task_record_validator.py skills` passed. | These checks cover the local companion/narrative convention and orientation path; they do not reconcile the protocol/design filename discrepancy. |
| Checkpoint history | Initial checkpoint committed at `a6482221570147dfe2b49eb0b815d7876e1c2a90`; the corrected local companion has focused validation. | Git history is authoritative for the correction commit; this evidence does not establish pilot completion. |

## Result

Skills-owned decision checkpoint prepared. The root-owned pilot admission records the actual as-is.md repair flow; no new reconciliation skill has been justified or created.

## Blockers And Escalations

Await the root-owned pilot record and its bounded outcome. Do not create a reconciliation skill, coordinate fixture edits from `skills/`, or represent the manual pilot as invocation of `implementing-component-tasks` or `building-components`.

## Recovery

- Last durable checkpoint: Phase 1 planning artifacts committed in `skills/as-is.json.task`, `skills/tasks.md`, and `skills/backlog.md` at `a6482221570147dfe2b49eb0b815d7876e1c2a90`; the executable companion correction is recorded at `6ec44ad770885dca0614b77a1ff76164d0bafc78` and uses `skills/as-is.json`.
- Incomplete phase: Phase 3 — Observe the root-owned `validation-fixtures` vertical-slice pilot, then Phase 4 — Decide.
- Cleanup required: retain the skills decision checkpoint until the root pilot reaches a bounded outcome or this task is explicitly cancelled; do not remove the selected backlog row.
- Safe next action: reread this record and the root `tasks.md`; do not edit fixture records or create a new skill from the skills task.

## Next Action

After compaction or a new session, reread this record and the root `tasks.md`; await the root pilot's leaf-first and parent-reconciliation evidence before deciding whether a reusable reconciliation skill is justified.
