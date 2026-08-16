# Task

## Requirement
Reconcile `agents:generic-agent-specialization` as a planning-only umbrella. Preserve the completed component-builder extraction evidence, replace the multi-agent implementation row with independently bounded future sequencing only if needed, and do not activate Phase 0, Phase 1, or any agent migration.

## Plan
1. Inspect the agents component record, separation plan, component-builder changelog and contract, and current backlog schema.
2. Update only the agents backlog and agents changelog to make the stale umbrella non-selectable and preserve authoritative sequencing evidence.
3. Validate focused backlog/content/task-record/JSON/whitespace checks and obtain final review before cleanup.

## Progress
Read-only expert review determined that `agents:generic-agent-specialization` cannot be selected as one implementation task because its acceptance spans multiple agent migrations and the separation plan requires Phase 0 and Phase 1 before later per-agent work. The component-builder extraction is already documented as completed in `agents/component-builder/changelog.md`; no duplicate child task should be created.

## Validation
Pending reconciliation edits and focused checks.

## Result
Pending.

## Blockers And Escalations
No blocker currently known. This task is planning-only and must not change agent contracts, skills, runtime behavior, routing, task authority, or child component records. If the current agents backlog cannot represent the required Phase 0/Phase 1 sequencing without inventing unsupported ownership or dependencies, preserve the row and record that bounded blocker rather than activating implementation.

## Recovery
The task-start handoff is the local `agents/as-is.json` task object and this narrative. Keep the agents backlog and changelog recoverable until validation and final review pass. Do not remove any child record or completed component-builder evidence. If reconciliation fails, restore the backlog and changelog while retaining the active task pair for recovery.

## Next Action
Prepare the smallest agents backlog/changelog reconciliation, then validate and record completion evidence before exact cleanup.
