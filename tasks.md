# Task

## Requirement
Complete `root:agent-specialization-phase-1-orchestration` as a root-owned, behavior-neutral cross-component contract clarification. Clarify the authority boundary between the root/as-is orchestrator and globally available reusable procedures in the explicitly scoped skill documents. Preserve role selection and routing, task admission, budgets, recovery, user control, parent integration, completion authority, configured worker identity, expert gates, and host-neutral runtime semantics. Document existing agent-front-matter `skills:` forwarding as unchanged launcher compatibility behavior; do not change launcher behavior or activate a later runtime migration.

## Plan
1. Reconcile the user-authorized root ownership move: preserve the Phase 1 identity in the root backlog, remove its source row from `agents/backlog.md`, and rewrite the deferred later-migrations dependency to `root:agent-specialization-phase-1-orchestration`.
2. Read the root, Agents, Skills, task-record, orchestration, separation, and launcher records and obtain attributable expert plan review before edits.
3. Audit the scoped reusable procedures for wording that could imply skill-owned selection, authorization, launch, delegation, recovery, integration, or completion authority.
4. Apply only behavior-neutral contract clarifications to `skills/building-components/SKILL.md`, `skills/implementing-component-tasks/SKILL.md`, `skills/committing-completed-work/SKILL.md`, and `skills/spawning-pi-subagents/SKILL.md` where evidence supports them. Inspect `skills/verification-discipline/SKILL.md` but change it only if a concrete contradiction is found.
5. Run focused static/prose checks and unchanged routing, control-plane, task-record, and launcher behavioral regressions; record residual baseline failures without weakening tests or widening scope.
6. Obtain fresh read-only final validation of the actual diff, then record completion evidence, perform exact root backlog cleanup, remove the root task pair, and create one scoped completion commit.

## Progress
The Phase 0 inventory is complete in `agents/changelog.md`. The user explicitly authorized the recommended root-owned cross-component task after expert review identified that the original Agents ownership was too narrow. A second expert plan review passed with one required artifact correction: `agents/backlog.md` is an explicitly authorized source-index mutation for the identity-preserving move and dependency rewrite, but no child task record, role contract, or child durable record may change. The deterministic reconciliation moved the selected proposal to `backlog.md` with identity preserved and rewrote `agents:agent-specialization-later-migrations` to depend on `root:agent-specialization-phase-1-orchestration`.

The approved changed-artifact boundary is the root task pair, root backlog/changelog, the source `agents/backlog.md` move/dependency rewrite, and the four explicitly scoped procedure documents. `agents/as-is.md`, `agents/as-is/agent.md`, all child records, role front matter, launcher source/tests, task protocol, capability admission, routing, host projections, package files, and runtime artifacts are read-only and must remain unchanged.

## Validation
Pending focused static/prose audit, contract clarifications, behavioral regressions, task-record validation, and final expert validation.

## Result
Pending.

## Blockers And Escalations
No blocker currently known after the owner decision and backlog reconciliation. Do not remove or weaken front-matter skill forwarding; it is current tested compatibility behavior and must be documented as unchanged/deferred. If a prose ambiguity requires changing launcher implementation, tests, role front matter, task protocol, capabilities, routing, host projections, or runtime behavior, stop and record that as an out-of-scope blocker rather than widening this task. Do not create a generic routing skill or a new adapter/module/tool surface.

## Recovery
The task-start handoff is the selected root backlog row, root `as-is.json.task`, root `tasks.md`, and the authorized source-index reconciliation. Resume from this record and the last committed checkpoint; do not infer progress from process exit, private sessions, traces, or generated runtime state. If the cross-backlog move or a focused clarification cannot be safely retained, restore the root and Agents backlog pair without duplicating the identity and leave the task non-terminal. If validation fails, preserve the active task pair and record the exact failed check and smallest recovery action.

## Next Action
Audit the four scoped procedure documents, obtain source-labelled findings, then apply the smallest behavior-neutral authority clarifications before running regression validation.
