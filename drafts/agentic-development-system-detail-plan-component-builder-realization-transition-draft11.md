# Agentic Development System — Component-Builder Realization Transition Detail Plan

Purpose: Define the first bounded detail-planning chunk for translating the accepted draft-11 parent/child realization direction into a reviewable, non-executable plan.

## Status and authority

Status: proposed detail-plan chunk; implementation is not authorized.

This plan derives detail from the accepted draft-11 envelope. It does not modify current architecture, adopt target contracts, select a task, create task authority, authorize kick-off, authorize implementation, select a concrete pilot, or choose field names, APIs, host operations, or integration mechanics.

The accepted envelope is:

- [Draft-11 target design](agentic-development-system-high-level-design-draft11/target-design.md)
- [Draft-11 manifest](agentic-development-system-high-level-design-draft11/review-manifest.md)
- [Human Review acceptance](../reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md)
- Target-design SHA-256: `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`
- Packet digest: `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`

## Planning question

What must be established, owned, and evidenced before the accepted parent/child realization direction can be turned into a concrete repository-local pilot plan without allowing parent planning, child implementation, child verification, child integration, task control, or documentation placement to acquire another component's authority?

## Recommended bounded scope

Prepare one anchor-linked transition worksheet for the proposed change from the current parent-side child integration and final-validation model to the accepted target direction:

- parent planning and child-plan preparation remain one parent bounded task;
- a separate deterministic admission control checks plan readiness and child launch readiness;
- a fresh child-scoped `component-builder` receives an explicit plan from its own anchor;
- the child owns its implementation, child-level validation, and integration of its own result through an admitted mechanism; and
- the parent records child dispositions and descendant closure without semantically verifying, revalidating, cherry-picking, approving, or integrating the child result.

The worksheet will describe transition preconditions, ownership, evidence, protected inputs, stop conditions, escalation routes, recovery expectations, and deliberately provisional mechanics. It will establish readiness for a later concrete pilot plan, not the pilot itself.

## Explicit exclusions

- Do not edit current `as-is.md`, agent, skill, task-control, contract, fixture, tool, or host-adapter files.
- Do not adopt target role contracts, task-record fields, schemas, APIs, or runtime controls.
- Do not create or authorize an implementation task, backlog item, kick-off, commit, or delegated worker.
- Do not select a concrete parent, immediate child, mock feature, seed revision, baseline revision, candidate revision, model, or benchmark.
- Do not design the whole current-versus-target record model, root orchestrator, setup comparison, distribution model, or migration execution.
- Do not treat existing fixture behavior or current component-builder behavior as proof that the target behavior exists.
- Do not use alternate-model or alternate-family review as a target-system gate.

## Affected anchors and relationships

The plan follows the accepted planning rule: inspect the relevant component anchors and relevant files literally linked from them. The links below are the declared bounded context for this planning chunk.

| Role | Anchor | Relationship to this plan |
| --- | --- | --- |
| Primary current role boundary | [`component-builder`](../agents/component-builder/as-is.md#design) | Current authority and behavior being compared with the accepted parent/child direction. |
| Current deterministic task authority | [`task-control`](../core/modules/task-control/as-is.md#design) | Dependency for task transitions, budgets, checkpoints, cancellation, completion, descendant closure, and launch admission. |
| Normative contract collection | [`Core Contracts`](../core/contracts/as-is.md#design) | Dependency for future contract documentation; placement does not transfer implementation ownership. |
| Repository composition and hierarchy | [`as-is`](../as-is.md#design) | Root context for component boundaries, current-versus-target distinction, and navigation. |
| Current front-face role | [`agents/as-is`](../agents/as-is/as-is.md#design) | Escalation and lifecycle context; its current router-only boundary remains unchanged. |
| Future evidence boundary | [`validation-fixtures`](../validation-fixtures/as-is.md#design) | Potential later rehearsal boundary; not a runtime dependency or implementation target in this chunk. |
| Accepted target direction | [`draft-11 target design`](agentic-development-system-high-level-design-draft11/target-design.md) | Proposed target behavior and non-goals. |
| Human decision evidence | [`draft-11 acceptance`](../reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md) | Exact acceptance and authority limits. |

The plan does not recursively inspect unrelated links. A newly discovered relevant link is added only when it is within this transition scope and its inclusion reason is recorded.

## Current-versus-target responsibility map

| Responsibility | Current authority or evidence | Accepted target direction | Status in this plan |
| --- | --- | --- | --- |
| Parent planning | Current [`component-builder`](../agents/component-builder/as-is.md#design) owns component planning and descendant handoffs. | Parent identifies impacted children and prepares child-specific plans as part of one parent bounded task. | Define transition preconditions and evidence; do not change the role. |
| Child plan readiness | Current records do not establish the proposed separate readiness control. | A deterministic admission control checks child-plan completeness and launch readiness. | Identify required facts and owner; exact contract remains provisional. |
| Child implementation | Current worker/component-builder boundaries remain current authority. | Fresh child-scoped `component-builder` executes only its assigned plan from its own anchor. | Define packet inputs, protected controls, and stop conditions. |
| Child validation | Current receiving builder owns semantic integration and final validation. | Child performs and records child-level validation before claiming successful integration. | Identify evidence categories and compatibility questions; no validator is adopted. |
| Child integration | Current receiving builder owns semantic integration; launcher supplies mechanical evidence. | Child integrates only its own result through a scope-preserving, recoverable admitted mechanism. | Identify required evidence and unresolved host ownership; do not select mechanics. |
| Parent accounting and closure | Current parent owns descendant disposition and completion boundaries under task-control. | Parent records terminal child reports and closure accounting without semantic child-result verification or integration. | Preserve current task authority while defining target transition evidence. |
| Escalation | Current callers bubble blockers to the applicable orchestrator and user when required. | Contradictions, scope changes, protected-input conflicts, and material boundary changes stop and escalate. | Define routes and blocking scope; do not create a new escalation authority. |

## Transition controls

| Transition | Preconditions to establish | Owner to appoint | Evidence required | Protected inputs | Stop or fail-closed condition | Escalation |
| --- | --- | --- | --- | --- | --- | --- |
| Parent plan preparation | Accepted envelope identity, parent anchor, bounded parent outcome, declared hierarchy, and permitted planning scope are identified. | Parent planning owner. | Anchor links, accepted revision, scope/non-goals, affected-child dispositions, dependencies, and recovery point. | Accepted envelope, current anchors, parent task authority, protected records, fixtures, baselines, validators, scorers, and credentials. | Missing or contradictory anchor, authority, hierarchy, or accepted scope. | Caller/orchestrator; user if the envelope or boundary changes. |
| Child-plan assignment | Each impacted child and its own anchor are identified; each assignment has bounded outcome, scope, dependencies, protected inputs, acceptance, validation, recovery, escalation, and integration expectations. | Parent planning owner with child record owner. | Parent-plan revision, child-anchor link, assignment identity, required fields, and disposition for omitted or unaffected children. | Sibling scope, child record, accepted envelope, protected fixtures, and parent budget/status. | Child is outside hierarchy, ownership is absent, assignment widens scope, or required dependency is unavailable. | Nearest common ancestor or applicable orchestrator; user for material boundary change. |
| Parent-level admission | Parent and child plans are complete, attributable, within the accepted envelope, and ready for launch; required capabilities and controls are available. | Deterministic task-control/admission owner. | Mechanical readiness result with source records and no semantic implementation judgment. | Task-control authority, protected plan and fixture inputs, budget reserve, and accepted revision. | Incomplete plan, stale revision, absent capability, budget failure, or unresolved blocking question. | Task-control caller; user only when the unresolved matter changes the envelope. |
| Child admission | Fresh child-scoped builder, child anchor, assigned plan, worker availability, budget, workspace, and protected controls are identified. | Child admission/orchestration owner. | Admission facts, normalized constraints, child attempt identity, and launch readiness. | Child anchor and plan, parent records, protected controls, credentials, and unrelated sibling files. | Active attempt exists, capability preflight fails, prohibited access is required, or inputs are stale/missing. | Parent caller; applicable orchestrator; user for material envelope change. |
| Child implementation and validation | Child receives only the bounded packet and named dependencies; acceptance and required checks are executable within authority. | Child-scoped component-builder. | Changed-result identity, child validation commands/results, acceptance mapping, residual risk, and recovery checkpoint. | Child boundary, protected inputs, validators, baselines, fixtures, and task authority. | Contradiction, missing dependency, scope change, protected-input conflict, failed required validation, or budget exhaustion. | Parent caller and applicable orchestrator; no invented requirement or silent retry. |
| Child integration | Child result is scoped, validated, attributable, and the admitted integration mechanism is available. | Child integration owner, with host/integration owner to be appointed. | Integration result, conflict outcome, ancestry/scope evidence, preserved unrelated work, and recovery state. | Parent worktree, sibling changes, child commit/result, protected records, and unrelated files. | Conflict, mechanism unavailable, ancestry unproven, or integration would overwrite unrelated work. | Parent caller and host/integration owner; user if the integration model changes the envelope. |
| Parent closure accounting | Every admitted child has terminal, failed, cancelled, or escalated disposition; blocking questions and integration obligations are resolved or explicitly retained. | Parent task owner. | Child handoffs, dispositions, descendant-closure evidence, parent-owned result, and unresolved-risk record. | Child-owned evidence and records, parent task authority, accepted envelope, and recovery candidates. | Active/blocked child, pending integration, unaccounted failure, or hidden blocking question. | Parent's caller/orchestrator; user for material design or risk decisions. |

The parent planner is not assigned child implementation verification or child-result integration by this plan. “Parent-level admission” means a mechanical readiness check, not semantic review.

## Required planning outputs

1. A current-to-target responsibility matrix covering parent planning, child assignment, admission, child implementation, child validation, child integration, parent accounting, and escalation.
2. A transition table with preconditions, owners, evidence, protected inputs, fail-closed conditions, escalation, recovery, and provisional status.
3. A dependency disposition for each declared anchor: affected, unaffected, deferred, or escalated.
4. A compatibility note describing how current parent-owned semantic integration and final validation remain protected until a separately accepted and validated successor exists.
5. A readiness list for a later concrete repository-local pilot, without selecting the pilot.
6. An explicit stopping statement identifying the last relevant literal-linked record inspected and why no further in-scope expansion is required.
7. A bounded review record for this exact plan, with any repair tied to a successor plan rather than an in-place rewrite after review.

## Acceptance conditions for this planning chunk

This chunk is complete when:

- Every affected anchor has a resolving literal link and an explicit relationship to the plan.
- Current authority and accepted target direction are visibly separated.
- No plan statement adopts a target role, contract, schema, API, task, pilot, or runtime mechanism.
- Parent planning, parent-level admission, child validation, child integration, and parent closure accounting are distinct responsibilities.
- Each proposed transition names preconditions, an owner to appoint, evidence, protected inputs, stop condition, escalation route, and unresolved mechanics.
- Blocking questions are separated from non-blocking planning questions.
- The plan states its bounded stopping rule and records any expansion reason.
- The plan identifies the next safe action and preserves `startsWork: false`.

## Unresolved questions and dispositions

### Blocking for a later executable child flow, not blocking this planning chunk

- Who owns and enforces scope-preserving, recoverable integration into the parent worktree?
- Which current task-control facts and future contract changes are sufficient for plan readiness, child admission, integration evidence, and descendant closure?
- Which concrete parent and immediate child will form the first repository-local rehearsal?
- How will current parent-side semantic integration and final validation remain compatible during migration?

### Non-blocking for this planning chunk

- Exact field names, storage locations, manifest mechanics, and API shapes.
- Detailed root-orchestrator and design/prototyping role contracts.
- Whether a fixture, mock project, or another repository-local slice becomes the first proof.
- Distribution, installation, upgrade, portability, and broader isolation choices deferred by the accepted envelope.

A question becomes blocking for this chunk only if resolving it changes the accepted goal, boundary, authority, protected inputs, acceptance, risk posture, or permitted external effect. Otherwise it remains visible with an owner, evidence requirement, and next action.

## Planning validation

The bounded review of this plan must verify:

- **Traceability:** Each proposed transition traces to a named current anchor and the exact accepted packet.
- **Authority separation:** The plan does not grant skills, telemetry, parent planners, documentation collections, or fixtures authority owned elsewhere.
- **Current/target separation:** Proposed behavior is labeled as target direction or provisional detail, while current records remain authoritative.
- **Responsibility separation:** Parent planning and admission do not become child implementation verification or child-result integration.
- **Completeness:** Every transition includes preconditions, owner, evidence, protected inputs, stop condition, escalation, and unresolved mechanics.
- **Scope:** No concrete task, implementation mechanism, schema, pilot, migration action, or artifact retirement is silently selected.

## Next safe action

Obtain one bounded read-only review of this exact plan. If it finds no supported repair, record the review and update the canonical handoff with the plan and its review status. Then stop for the next planning decision: appoint accountable owners and select a concrete repository-local pilot before deriving any executable implementation packet or task. `startsWork: false`.
