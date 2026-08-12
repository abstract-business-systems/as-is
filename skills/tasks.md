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
- Phase 1 checkpoint correction: local task metadata is `as-is.json`, matching the executable control plane, task validator, supervisor, launcher status join, and existing JSON-backed fixtures. The protocol/design references to `as-is.json.task` remain a separately scoped migration discrepancy; this correction does not resolve or weaken that contract question.
- Phase 2 — Inspect: not started.
- Phase 3 — Pilot: not started; execution requires this checkpoint to be reviewed and the task advanced to `active` by task management.
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

Pre-pilot planning checkpoint prepared; pilot work has not begun.

## Blockers And Escalations

No blocker. Do not begin Phase 3 until the pre-pilot checkpoint is committed and the task is explicitly activated through task management.

## Recovery

- Last durable checkpoint: Phase 1 planning artifacts committed in `skills/as-is.json.task`, `skills/tasks.md`, and `skills/backlog.md` at `a6482221570147dfe2b49eb0b815d7876e1c2a90`; this correction restores the executable repository convention of `as-is.json` for local task metadata.
- Incomplete phase: Phase 2 — Inspect.
- Cleanup required: retain all three checkpoint files until the pilot is complete or the task is explicitly cancelled; do not remove the selected backlog row.
- Safe next action: reread this record and current Git HEAD, then begin Phase 2 only after explicit activation.

## Next Action

After compaction or a new session, reread this record and begin Phase 2 only after explicit activation.
