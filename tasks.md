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
- Existing launcher lifecycle points are `session.lifecycle`, `delegation.lifecycle`, `subprocess.launch`, `worker.lifecycle`, `subprocess.exit`, and `subprocess.handoff`. `session.lifecycle`, `delegation.lifecycle`, and `worker.lifecycle` use the inherited valid opaque session reference when available; component trace events also use the inherited reference when available. No child session ID is currently exposed by the launcher before or after the child run.
- The root task is documentation/contract-only. No implementation or runtime behavior changes have been made.
- A stale completed `core/modules/observability/as-is.json` task object remains without its paired `tasks.md` narrative from the prior component completion. The root task has not modified that child-owned record; it is a separate owner/recovery blocker to resolve before root task-record validation can pass.

## Validation
The baseline matrix is complete. The required fresh read-only expert gate is currently unavailable: the configured `expert` consultation failed before inspection because no provider API key is available. No role substitution, implementation, completion, or commit decision is authorized; the task remains active and the prior structural evidence is retained pending a successful expert gate.

The baseline matrix evidence is:

| Lifecycle event | Current producer | Reference classification | Availability rule | Current gap |
| --- | --- | --- | --- | --- |
| `session.lifecycle` | Pi launcher session span | `delegating-session-reference` or `absent` | Use inherited `PI_SESSION_FILE` only when its basename yields a valid opaque ID; otherwise omit. | A newly created child session ID is not available to the launcher at span creation. |
| `delegation.lifecycle` | Pi launcher bounded supervisor | `delegating-session-reference` or `absent` | Use the same inherited opaque ID; never derive one from a session directory/path. | Child-session correlation is unavailable. |
| `subprocess.launch` | Pi launcher component trace | `delegating-session-reference` or `absent` | `recordComponentTrace()` receives the inherited opaque reference through the environment helper; invalid/missing references omit. | Event attributes are further constrained by observability allowlists. |
| `worker.lifecycle` | Pi launcher worker span | `delegating-session-reference` or `absent` | Use only the inherited valid opaque ID. | No child ID is learned at worker start or finish. |
| `subprocess.exit` | Pi launcher component trace | `delegating-session-reference` or `absent` | Preserve omission when the inherited reference is unavailable. | Exit observation is not child-session correlation. |
| `subprocess.handoff` | Pi launcher component trace | `delegating-session-reference` or `absent` | Preserve omission when the inherited reference is unavailable. | Handoff evidence remains separate from session evidence. |

The approved contract is: a valid opaque session ID may be carried as a delegating-session reference; a child-session reference may be added only after a host-supported, trusted opaque-ID handoff exists; otherwise the reference is absent. No path, generated guess, store reference, prompt, tool content, provider/runtime payload, or authorization may substitute for an unavailable reference.

| Owner | Current responsibility | Follow-up gate |
| --- | --- | --- |
| `skills/spawning-pi-subagents` | Pi session/lifecycle production and current inherited-reference propagation. | Separately bounded producer task must establish whether Pi exposes a child ID without path leakage; preserve skill/tool forwarding and evidence-validator safety. |
| `core/modules/observability` | Fail-closed event-name/attribute/session-reference projection and supplementary export. | Separately bounded projection task only if the approved matrix requires a new allowlisted event or attribute; no raw session data. |
| `tools/evidence` | Exact-ID local session and trace queries with scope, filters, bounds, and privacy projection. | Separately bounded correlation test/task only if emitted references need a proven query correspondence; no new authority or global search. |

Before the latest recovery inspection, backlog/query (15 tests, 53 expectations), content/navigation (49 records, 47 diagrams), tracked JSON parsing, and `git diff --check` passed. The current task-record validator is blocked by the pre-existing stale completed `core/modules/observability/as-is.json` object without `core/modules/observability/tasks.md`; no child-owned record change was authorized in this root phase. Implementation/runtime behavior, launcher, observability, and evidence-tool suites remain unchanged. The fresh expert review is also unavailable because the configured provider reports no API key.

## Result
Blocked pending the required fresh read-only expert validation. The matrix and ownership handoff are complete, but no completion claim or commit is permitted while the configured expert is unavailable.

## Blockers And Escalations
The key unknown is whether Pi exposes a child session ID early enough for all desired lifecycle events. This phase records `absent` when no valid opaque ID is available and does not authorize a host API or synthetic identifier. Required expert final validation is unavailable because the configured provider reported no API key; do not silently substitute another role or treat recorded static checks as the missing expert gate. The root task-record validator is additionally blocked until the owning observability component reconciles its stale terminal task artifact.

## Recovery
Checkpoint: root backlog contains the selected identity and the active root task pair; the original component row has been removed through the authorized ownership reconciliation. If interrupted, preserve this pair and restore the source row plus remove the root row only through a reversible scoped reconciliation decision. No child task is required in this phase.

## Next Action
Obtain owner-authorized reconciliation of the stale terminal observability task artifact, restore configured expert availability or obtain separately authorized direction, then rerun task-record validation and fresh read-only final validation. Keep the root task active and the selected backlog identity until both gates pass.
