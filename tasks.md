# Task

## Requirement
Establish a root-owned lifecycle/session-reference contract and baseline matrix for the cross-component richer observability proposal. Coordinate ownership and sequencing across the Pi launcher, observability tracer, and evidence tools without implementing runtime behavior or transferring task, privacy, session, or completion authority.

## Plan
- Review the existing execution contract, observability/tracer and evidence-tool records, launcher lifecycle/session behavior, focused tests, and current privacy constraints.
- Define a finite matrix for session.lifecycle, delegation.lifecycle, subprocess.launch, worker.lifecycle, subprocess.exit, and subprocess.handoff.
- For each event, classify the reference as delegating-session-reference, child-session-reference, or absent, with explicit availability timing and fail-closed rules.
- Record baseline gaps and separately bounded follow-up gates for launcher production, observability projection, and evidence-tool correlation.
- Run structural/content/task-record/reference validation and obtain final read-only expert review; no descendants are required.

## Progress
- The historical richer observability proposal was moved from `core/modules/observability` to the root backlog because its acceptance crosses launcher, observability, and evidence-tool ownership. Identity and intent are preserved.
- Completed observability work establishes opaque-only session references, bounded local queries, fail-closed projection, retention, and direct-export isolation; it does not prove complete lifecycle correlation.
- No implementation or runtime behavior changes have been made. The root task and paired narrative are active.

## Validation
Pending event/reference matrix, ownership map, baseline gap record, focused checks, and final expert review.

## Result
Pending.

## Blockers And Escalations
The key unknown is whether Pi exposes a child session ID early enough for all desired lifecycle events. This phase records `absent` when no valid opaque ID is available and does not authorize a host API or synthetic identifier.

## Recovery
Checkpoint: root backlog contains the selected identity and the active root task pair; the original component row has been removed through the authorized ownership reconciliation. If interrupted, preserve this pair and restore the source row plus remove the root row only through a reversible scoped reconciliation decision. No child task is required in this phase.

## Next Action
Complete the event/reference matrix and ownership baseline, then run the structural checks and final review.
