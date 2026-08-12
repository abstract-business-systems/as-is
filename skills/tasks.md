# Task

## Requirement

Prepare a bounded pre-pilot checkpoint for `skills:reconciling-as-is-records`. The pilot will determine whether repeated hierarchy-wide as-is realignment requires a distinct reusable coordination skill or can remain a composition of `managing-as-is-document`, `implementing-component-tasks`, and `building-components`.

This checkpoint is planning and recovery context only. It does not authorize pilot execution, create a new skill, select or launch agents, or claim completion of the backlog item.

## Plan

| Phase | Purpose | Completion evidence |
| --- | --- | --- |
| 1. Prepare | Establish the bounded requirement, ownership, acceptance conditions, constraints, and baseline. | Task metadata, backlog selection, and pilot boundary agree. |
| 2. Inspect | Compare the existing skills and relevant component contracts against the proposed reconciliation behavior. | Evidence identifies repeated coordination needs, existing coverage, and concrete gaps. |
| 3. Pilot | Run a bounded post-order reconciliation exercise using only authorized existing procedures. | The pilot records actual coordination steps, inputs, outputs, recovery points, and friction. |
| 4. Decide | Choose composition or a narrowly named new skill based on pilot evidence. | Decision records alternatives, rationale, authority boundaries, and residual risk. |
| 5. Validate and hand off | Run focused checks and prepare the durable result for completion reconciliation. | Validation evidence, changelog summary, and scoped handoff are ready. |

## Progress

- Phase 1 — Prepare: complete. The selected backlog item is `skills:reconciling-as-is-records`; scope is limited to this `skills/` component.
- Phase 1 checkpoint: the pilot must evaluate composition before introducing a new skill. Model, cache, batching, and launch policy are explicitly out of scope.
- Phase 2 — Inspect: not started.
- Phase 3 — Pilot: not started; execution requires this checkpoint to be reviewed and the task advanced to `active` by task management.
- Phase 4 — Decide: not started.
- Phase 5 — Validate and hand off: not started.

## Validation

| Check | Result | Residual risk |
| --- | --- | --- |
| Backlog schema and selected item reviewed against `skills/managing-backlog/SKILL.md` | Passed by inspection | The selected status is a planning input, not task completion authority. |
| Task record shape reviewed against `docs/component-task-record-protocol.md` | Passed by inspection | The record has not yet been validated by the repository validator. |
| Component boundary reviewed against `skills/as-is.md` and `skills/spawning-pi-subagents/as-is.md` | Passed by inspection | Pilot evidence may reveal a better owning component; any scope change requires reconciliation. |
| Pre-pilot commit | Pending | This checkpoint is not durable until committed. |

## Result

Pre-pilot planning checkpoint prepared; pilot work has not begun.

## Blockers And Escalations

No blocker. Do not begin Phase 3 until the pre-pilot checkpoint is committed and the task is explicitly activated through task management.

## Recovery

- Last durable checkpoint: Phase 1 planning artifacts prepared in `skills/as-is.json.task`, `skills/tasks.md`, and `skills/backlog.md`.
- Incomplete phase: Phase 2 — Inspect.
- Cleanup required: retain all three checkpoint files until the pilot is complete or the task is explicitly cancelled; do not remove the selected backlog row.
- Safe next action: validate this record, commit the scoped pre-pilot checkpoint, then resume from Phase 2 after explicit activation.

## Next Action

Validate the task record and commit `skills/as-is.json.task`, `skills/tasks.md`, and `skills/backlog.md` as the pre-pilot planning checkpoint. After compaction or a new session, reread this record and begin Phase 2 only after explicit activation.
