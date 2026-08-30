# Agentic Development System — Component-Builder Realization Transition Detail Plan (Draft 13)

Purpose: Define the first bounded detail-planning chunk for translating the accepted draft-11 parent/child realization direction into a reviewable, non-executable plan.

## Status and authority

Status: proposed successor detail-plan chunk; drafts 11 and 12 are preserved as reviewed predecessors. Implementation is not authorized.

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
| Repository-wide constraints | [`design-principles`](../design-principles.md) | Relevant authority, evidence, recovery, cognitive-load, minimal-change, and boundary constraints for this planning decision. |
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

| Transition | Preconditions to establish | Owner to appoint | Evidence required | Protected inputs | Stop or fail-closed condition | Recovery / safe checkpoint | Deliberately provisional mechanics / required owner role | Escalation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Parent plan preparation | Accepted envelope identity, parent anchor, bounded parent outcome, declared hierarchy, and permitted planning scope are identified. | Parent planning owner. | Anchor links, accepted revision, scope/non-goals, affected-child dispositions, dependencies, and recovery point. | Accepted envelope, current anchors, parent task authority, protected records, fixtures, baselines, validators, scorers, and credentials. | Missing or contradictory anchor, authority, hierarchy, or accepted scope. | Preserve the planning checkpoint and disposition list; no child launch. | Exact plan storage and record fields; parent planning owner with record-contract owner. | Caller/orchestrator; user if the envelope or boundary changes. |
| Child-plan assignment | Each impacted child and its own anchor are identified; each assignment has bounded outcome, scope, dependencies, protected inputs, acceptance, validation, recovery, escalation, and integration expectations. | Parent planning owner with child record owner. | Parent-plan revision, child-anchor link, assignment identity, required fields, and disposition for omitted or unaffected children. | Sibling scope, child record, accepted envelope, protected fixtures, and parent budget/status. | Child is outside hierarchy, ownership is absent, assignment widens scope, or required dependency is unavailable. | Preserve the parent plan and unresolved assignment; do not launch the affected child. | Planned-section shape and assignment representation; parent planner and record-contract owner. | Nearest common ancestor or applicable orchestrator; user for material boundary change. |
| Parent-level admission | Parent and child plans are complete, attributable, within the accepted envelope, and ready for launch; required capabilities and controls are available. | Deterministic task-control/admission owner. | Mechanical readiness result with source records and no semantic implementation judgment. | Task-control authority, protected plan and fixture inputs, budget reserve, and accepted revision. | Incomplete plan, stale revision, absent capability, budget failure, or unresolved blocking question. | Retain the failed readiness result and current task state; no child attempt begins. | Admission operation and readiness evidence shape; task-control owner. | Task-control caller; user only when the unresolved matter changes the envelope. |
| Child admission | Fresh child-scoped builder, child anchor, assigned plan, worker availability, budget, workspace, and protected controls are identified. | Child admission/orchestration owner. | Admission facts, normalized constraints, child attempt identity, and launch readiness. | Child anchor and plan, parent records, protected controls, credentials, and unrelated sibling files. | Active attempt exists, capability preflight fails, prohibited access is required, or inputs are stale/missing. | Preserve child ready state and admission evidence; no launch or automatic retry. | Worker admission, workspace, and capability-preflight mechanics; host/task-control owners. | Parent caller; applicable orchestrator; user for material envelope change. |
| Child implementation and validation | Child receives only the bounded packet and named dependencies; acceptance and required checks are executable within authority. | Child-scoped component-builder. | Changed-result identity, child validation commands/results, acceptance mapping, residual risk, and recovery checkpoint. | Child boundary, protected inputs, validators, baselines, fixtures, and task authority. | Contradiction, missing dependency, scope change, protected-input conflict, failed required validation, or budget exhaustion. | Preserve the child checkpoint, partial result, evidence, and task status; no silent retry or scope widening. | Packet schema, validation adapter, and recovery mechanics; child/assurance owners. | Parent caller and applicable orchestrator; no invented requirement or silent retry. |
| Child integration | Child result is scoped, validated, attributable, and the admitted integration mechanism is available. | Child integration owner, with host/integration owner to be appointed. | Integration result, conflict outcome, ancestry/scope evidence, preserved unrelated work, and recovery state. | Parent worktree, sibling changes, child commit/result, protected records, and unrelated files. | Conflict, mechanism unavailable, ancestry unproven, or integration would overwrite unrelated work. | Preserve the validated child result and integration checkpoint as pending; do not claim closure. | Scope-preserving integration mechanism and ancestry evidence; host/integration owner. | Parent caller and host/integration owner; user if the integration model changes the envelope. |
| Parent closure accounting | Every admitted child has terminal, failed, cancelled, or escalated disposition; blocking questions and integration obligations are resolved or explicitly retained. | Parent task owner. | Child handoffs, dispositions, descendant-closure evidence, parent-owned result, and unresolved-risk record. | Child-owned evidence and records, parent task authority, accepted envelope, and recovery candidates. | Active/blocked child, pending integration, unaccounted failure, or hidden blocking question. | Preserve parent accounting and all child dispositions; parent cannot claim completed closure. | Closure evidence and parent accounting representation; parent/task-control owners. | Parent's caller/orchestrator; user for material design or risk decisions. |

The parent planner is not assigned child implementation verification or child-result integration by this plan. “Parent-level admission” means a mechanical readiness check, not semantic review.

## Required planning outputs

1. A current-to-target responsibility matrix covering parent planning, child assignment, admission, child implementation, child validation, child integration, parent accounting, and escalation.
2. A transition table with preconditions, owners, evidence, protected inputs, fail-closed conditions, escalation, recovery, and provisional status.
3. A dependency disposition for each declared anchor: affected, unaffected, deferred, or escalated.
4. A compatibility note describing how current parent-owned semantic integration and final validation remain protected until a separately accepted and validated successor exists.
5. A readiness list for a later concrete repository-local pilot, without selecting the pilot.
6. An explicit inspection-boundary record identifying the inspected anchor-and-literal-link set, each discovered dependency's disposition, any expansion reason, the last relevant record inspected, and why no further in-scope expansion is required.
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

Each question below records its status, affected transition, owner role to appoint, dependencies, required evidence, safe checkpoint, and next action. These are planning dispositions only; they do not appoint owners, create tasks, or adopt contracts.

| Question | Status and affected transition | Owner role to appoint | Dependencies and required evidence | Safe checkpoint / blocking scope | Next action |
| --- | --- | --- | --- | --- | --- |
| Who owns and enforces scope-preserving, recoverable integration into the parent worktree? | **Blocking for later child integration; non-blocking for this worksheet.** Affects child integration and parent closure. | Host/integration owner. | Named host owner; conflict/serialization and ancestry evidence for a later pilot. | Stop before executable child integration; preserve child result and recovery state. | Identify the owner and candidate evidence during later pilot planning; do not choose mechanics here. |
| Which current task-control facts and future contract changes are sufficient for plan readiness, child admission, integration evidence, and descendant closure? | **Blocking for later executable child flow; non-blocking for this worksheet.** Affects parent admission, child admission, and closure. | Task-control owner with record-contract owner. | Current task-control boundaries; later compatibility and behavioral evidence. | Stop before admission if required facts are absent or stale; do not create a second authority. | Map current support and gaps in a later contract-planning chunk. |
| Which concrete parent and immediate child will form the first repository-local rehearsal? | **Blocking for later pilot execution; non-blocking for this worksheet.** Affects child admission and pilot execution. | Project orchestrator / pilot owner. | Selected parent and child anchors, seed and revisions, protected fixture, budget, and acceptance. | Stop before pilot planning can become executable; no component is selected by this worksheet. | Select only after accountable owners and pilot controls are appointed. |
| How will current parent-side semantic integration and final validation remain compatible during migration? | **Blocking for later migration execution; non-blocking for this worksheet.** Affects child integration and parent closure. | Component-builder migration owner with assurance owner. | Consumer inventory, compatibility path, behavioral tests, and integration evidence. | Preserve current parent behavior until successor evidence passes; stop retirement or replacement without it. | Define compatibility evidence in a later migration-planning chunk. |
| What exact field names, storage locations, manifest mechanics, and API shapes are needed? | **Non-blocking for this worksheet.** Affects later contract and implementation planning only. | Record-contract and task-control owners. | Accepted target direction and later consumer-backed design evidence. | Use no invented defaults; this worksheet remains non-executable. | Keep provisional and resolve only when a concrete consumer requires it. |
| What detailed root-orchestrator and design/prototyping role contracts are needed? | **Non-blocking for this worksheet.** Affects later lifecycle planning. | Root lifecycle and design owners. | Accepted envelope, current router boundary, and later owner decisions. | Do not change the current router-only record or role. | Plan separately after this transition worksheet. |
| Will a fixture, mock project, or another repository-local slice become the first proof? | **Non-blocking for this worksheet.** Affects later pilot selection and evaluation. | Pilot/evaluation owner. | Candidate scope, seed revision, protected scorer/validator, and evaluation protocol. | No evaluation or fixture task is admitted from this worksheet. | Evaluate options when the concrete pilot is selected. |
| What distribution, installation, upgrade, portability, and broader isolation choices are needed? | **Non-blocking for this worksheet.** Affects future consumption work only. | Setup/migration owner. | Setup-inclusive evidence and an approved later consumption decision. | Do not make broader distribution claims or expand this plan's scope. | Retain as deferred work under the accepted envelope. |

The accepted envelope permits these non-blocking deferrals because they do not alter the bounded planning direction. A question becomes blocking for this chunk only if resolving it changes the accepted goal, boundary, authority, protected inputs, acceptance, risk posture, or permitted external effect. Otherwise it remains visible with an owner role, evidence requirement, safe checkpoint, and next action.

## Inspection boundary and stopping record

This bounded planning scan inspected the following relevant anchor records and their literal links:

| Inspected record | Disposition in this chunk |
| --- | --- |
| [`as-is.md`](../as-is.md#design) | Affected root composition and hierarchy context. |
| [`agents/as-is.md`](../agents/as-is/as-is.md#design) | Affected role catalog and escalation context; current router boundary retained. |
| [`agents/component-builder/as-is.md`](../agents/component-builder/as-is.md#design) | Primary affected current role boundary. |
| [`core/as-is.md`](../core/as-is.md#design) | Affected deterministic-core ownership context. |
| [`core/modules/task-control/as-is.md`](../core/modules/task-control/as-is.md#design) | Affected current task-control dependency. |
| [`core/contracts/as-is.md`](../core/contracts/as-is.md#design) | Affected normative-document ownership context. |
| [`validation-fixtures/as-is.md`](../validation-fixtures/as-is.md#design) | Future pilot boundary only; no fixture is selected. |
| [`design-principles.md`](../design-principles.md) | Repository-wide authority and safety constraints relevant to bounded planning; no new principle is proposed. |
| [`drafts/agentic-development-system-high-level-design-draft11/target-design.md`](agentic-development-system-high-level-design-draft11/target-design.md) | Accepted target direction. |
| [`reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`](../reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md) | Human acceptance and authority limits. |

The last relevant record inspected was the draft-11 Human Review acceptance record. The repository-wide `design-principles.md` link was added to this successor's declared inspection set because it supplies constraints used by the plan. The relevant links from the inspected set are either already included in this declared transition scope or are not needed to answer the planning question. No planning-scope expansion beyond the named set occurred. No inspected record added an uninspected relevant in-scope link requiring further inspection within this transition scope. This is a bounded planning result, not proof that undocumented, generated, dynamic, or external consumers do not exist. Any later known consumer, broken or ambiguous link, shared-interface concern, missing owner, or recovery/safety issue triggers a recorded expansion or blocker.

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
