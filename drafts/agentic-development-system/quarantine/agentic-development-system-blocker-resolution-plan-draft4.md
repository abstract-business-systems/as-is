# Agentic Development System — Blocker Resolution Plan

Purpose: Explain the selected pilot exclusions, define when deferred capabilities may be included, clarify the `core/contracts` boundary, and establish bounded resolution plans for child integration and task admission without authorizing implementation.

## Status and authority

Status: proposed successor detail-plan chunk; drafts 1, 2, and 3 are preserved predecessors. Implementation remains unauthorized.

This plan responds to the user's request to clear the two blockers recorded in the owner-and-pilot selection decision. It resolves planning ambiguity by defining candidate contracts, owners, evidence, and stop conditions. It does not adopt target contracts into current architecture, modify current implementations, create a task, authorize kick-off, launch a worker, authorize a commit, or claim that runtime blockers have been cleared.

The plan is derived from the human-accepted draft-11 envelope and the reviewed component-builder realization-transition detail plan, draft 13.

- [Accepted draft-11 target design](agentic-development-system-high-level-design-draft11/target-design.md)
- [Draft-11 Human Review acceptance](../reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md)
- [Reviewed realization-transition detail plan, draft 13](agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md)
- [Owner and pilot selection](agentic-development-system-owner-and-pilot-selection-draft1.md)
- [Core Contracts record](../core/contracts/as-is.md)
- [Task-control record](../core/modules/task-control/as-is.md)
- [Component-builder record](../agents/component-builder/as-is.md)
- [Dummy-delegation pilot record](../validation-fixtures/dummy-delegation/as-is.md)

Accepted target-design SHA-256: `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`.

Draft-1 review: `reviews/agentic-development-system/expert-blocker-resolution-plan-draft1.md`. Its two supported terminology repairs are incorporated here: integration-result values are not task statuses, and `ready` is not by itself proof of target plan-readiness admission. Draft 2 was reviewed with no supported repair. Draft-3 Sol-style and transitional alternate reviews identified three bounded repairs: terminal task-status terminology, unresolved receiving semantic-integration authority, and atomic same-component admission serialization.

## Executive answer

The pilot exclusions are deliberate risk and evidence boundaries, not statements that the excluded capabilities are unimportant or permanently rejected. The first pilot is intended to prove local control-plane behavior around delegation, scope, validation, recovery, and evidence without mixing in provider risk, distribution risk, consumer-setup risk, or broad workflow-evaluation claims.

The two blockers can be made concrete now: use a host-mediated, scope-preserving child-result integration operation for the integration mechanism, and use a deterministic plan-readiness/admission check backed by the existing task-control records for the admission mechanism. Both remain proposed until a later bounded implementation task produces compatibility and behavioral evidence.

## 1. Why the pilot excludes capabilities

| Excluded capability | Reason for exclusion from the first pilot | Immediate impact | When or whether it may be included |
| --- | --- | --- | --- |
| Provider-backed execution | Provider calls introduce model variability, credentials, network effects, cost uncertainty, and response-content handling that are not needed to test local delegation and boundary control. | The pilot cannot establish model efficacy, provider compatibility, credential handling, or real-world autonomous-development quality. | Include only in a separately approved live fixture after deterministic provider-free controls pass, `AS_IS_LIVE_INTEGRATION=1` and an explicitly approved `PI_BIN` are available, budgets are bounded, and the live result is reported separately from deterministic evidence. It is not required for clearing the two current blockers. |
| Model or provider selection | The target contract is role- and capability-oriented rather than tied to a model family or provider. | The pilot cannot support claims that one model, provider, or reviewer family is better. | Evaluate model/provider alternatives only in a separately labelled workflow or model-selection experiment with approved seed, settings, scorer, rubric, thresholds, and advancement rule. They remain outside the target-system contract. |
| Mock consuming project and setup-inclusive comparison | A second project would test installation, setup, discovery, compatibility, and current-versus-candidate consumption, not the local parent/child realization boundary. | The pilot cannot establish package usability, setup portability, or cross-project isolation. | Include after the local pilot has stable repository-local evidence and a separately owned seed, pinned baseline, candidate revision, setup conditions, and human-approved comparison protocol exist. It is required for broader consumption and setup claims, not for the local blocker-resolution proof. |
| Distribution, installation, upgrade, downgrade, uninstall, and portability | These are host and consumption concerns with different owners, failure modes, and recovery evidence. Combining them with child integration would make the first result difficult to interpret. | No distribution or lifecycle-support claim can be made. | Include through a later setup/consumption plan when a concrete consuming project or distribution need is selected and host-integration ownership and compatibility evidence are available. |
| Root-orchestrator redesign | The pilot needs a bounded caller and existing task authority; redesigning the root front face would add lifecycle and human-interaction variables. | The pilot does not prove the complete three-phase user-facing orchestration flow. | Include only when a separate bounded lifecycle task identifies a consumer-backed root-authority gap. The current `as-is` router boundary remains authoritative meanwhile. |
| Broad task-record or contract migration | Changing record schemas while testing integration would confound whether a failure came from admission, record compatibility, or Git/worktree mechanics. | The pilot uses current records as baseline and cannot prove the target record model. | Include after the blocker-resolution evidence identifies exact consumer-backed gaps and a separately reviewed migration packet specifies compatibility, recovery, and rollback/reversal evidence. |
| Skill replacement or artifact retirement | The target design does not authorize wholesale replacement, and current skills and artifacts may still be consumers or recovery evidence. | No conclusion may be drawn about the value or future of existing skills and artifacts. | Consider individual retain/adapt/replace/deprecate decisions only through bounded migration tasks with consumer inventory, replacement evidence, and explicit retirement authority. |
| Benchmark advancement | A benchmark requires pre-registered inputs, controls, scorer, rubric, thresholds, and a human decision; the local pilot is not a comparative benchmark. | The pilot cannot justify adopting the target workflow or claim superiority over the current workflow. | Include after the seed, feature, pinned baseline, candidate revision, equivalent settings, protected scorer, safety-failure policy, thresholds, and advancement rule are approved. A benchmark result remains evaluation evidence, not automatic adoption. |
| Security, filesystem, process, network, credential, and multi-project isolation claims | The existing worktree mechanism provides useful Git collision protection but does not prove OS-level or host-level isolation. | The pilot may demonstrate protected-file and scope checks but cannot claim complete sandboxing or security isolation. | Include as a separate host-safety validation slice with explicit capabilities, threat boundary, test environment, and evidence. Do not infer it from worktree success, process exit, registry output, or a child commit. |

### Exclusion policy

An exclusion reduces confounding risk and narrows the claim supported by the evidence; it does not erase the excluded capability from the target design. An excluded capability may be included later only when its owner, inputs, approval, acceptance conditions, validation, recovery, and evidence are separately bounded. If including it changes the accepted goal, boundary, authority, protected input, acceptance condition, risk posture, or permitted external effect, the change returns to Interactive Design / Prototyping and requires a successor packet and Human Review.

The first pilot therefore answers a narrow question: can the proposed parent/child realization boundary be rehearsed with deterministic local evidence while preserving scope, protected inputs, recovery, and durable accounting? It does not answer whether the complete agentic-development system is safe, portable, performant, secure, or more effective than the current workflow.

## 2. `core/contracts` explained

### What it is

`core/contracts/` is the repository's discoverable home for normative documents that describe expectations shared across components. A normative document states what a boundary means, which authority owns a decision, what inputs and outcomes have to be distinguishable, and which invariants consumers must preserve.

It is a documentation collection, not a merged runtime authority. A contract can describe a host-neutral lifecycle or data boundary without becoming an executable API, task manager, host adapter, or second registry.

### What each current contract does

| Contract | Plain-language role | Implementation authority remains with |
| --- | --- | --- |
| `component-task-record-protocol.md` | Defines the durable task metadata, narrative sections, lifecycle statuses, budget and delegation limits, recovery evidence, descendant closure, and paired cleanup expectations. | `core/modules/task-control` for transitions, validation, budget arithmetic, and handoff eligibility; task-management callers for orchestration. |
| `execution-contract.md` | Defines the host-neutral concepts for launching, observing, questioning, cancelling, recovering, and returning a worker result, including the rule that runtime observations cannot replace durable task state. | Process adapters for process mechanics, the Pi launcher for Pi mechanics, task-control for durable authority, observability for supplementary evidence, and component-builders for semantic integration. |
| `configuration.md` | Defines the generic boundary for configuration data, provenance, consumer-owned namespaces, defaults, and environment controls. | Each consuming implementation for its own keys, defaults, validation, and interpretation. |
| `architecture-vocabulary.md` | Defines shared terms such as component, boundary, owner, authority, evidence, and relationship labels so records do not silently use conflicting meanings. | Canonical component records for actual local architecture facts. |

### What it does not do

`core/contracts/` does not own task transitions, allocate budgets, launch processes, resolve Git conflicts, choose models, expose tools, grant permissions, select a component, approve a design, or complete a task. Moving a document into the collection does not transfer any of those responsibilities.

It also does not make a proposed target contract current. A future contract change needs an accepted design relationship, an identified consumer, a bounded key or operation set, compatibility and migration reasoning, focused validation, and separately authorized implementation. Until then, the current contract and current implementation owners remain authoritative.

### How it participates in clearing the blockers

For this blocker-resolution plan, `core/contracts` should document the cross-component meaning of plan readiness, child-result integration, and evidence ownership only after the concrete consumer-backed shape is accepted. It should not prescribe Git commands, filesystem paths, task-record mutation code, host-specific session behavior, or an implementation API prematurely.

The proposed ownership split is:

- `core/contracts` records the host-neutral invariants and vocabulary;
- `core/modules/task-control` owns deterministic plan-readiness, budget, status, question, recovery, and descendant-closure decisions;
- the host/integration adapter owns mechanical workspace, lock, ancestry, scope, conflict, and apply/abort operations;
- `agents/component-builder` owns the child semantic result, child validation, integration decision, and child handoff evidence under the accepted target direction;
- `agents/evidence-validator` performs bounded read-only evidence assessment when assigned;
- `skills/spawning-pi-subagents` supplies launch and ancestry observations but does not merge, integrate, or authorize;
- the parent records child dispositions and closure accounting without becoming the child's semantic verifier or integrator.

This split prevents `core/contracts` from becoming a vague “everything shared” module and prevents the host adapter from becoming a second task authority.

## 3. Blocker A: scope-preserving child-result integration

### Proposed resolution

Define a host-mediated `integrate-child-result` operation as a provisional target contract. The child initiates the operation after its own implementation and child-level validation. A receiving integration authority, distinct from the child, independently reviews the child's declared result and evidence and records the semantic disposition that the mechanical host operation consumes. A host/integration adapter performs only deterministic mechanical application of the child's declared result to the parent worktree. The child records its own validation and the operation outcome, conflict, or recovery state. The parent records the child disposition and closure facts but does not cherry-pick, semantically revalidate, or mechanically integrate the child result.

“Host-mediated” means that the child does not receive arbitrary parent filesystem access. The host uses an approved logical target and a bounded source result to perform the operation on the child's behalf. “Mechanical” means that the adapter checks identity, scope, ancestry, locks, protected paths, and conflict outcomes; it does not decide whether the implementation satisfies product semantics. The receiving integration authority makes the separate semantic acceptance/disposition decision before the adapter applies the result.

### Required preconditions

| Precondition | Required observation | Failure disposition |
| --- | --- | --- |
| Child result identity | One child task revision, attempt, source commit or equivalent immutable result, and expected parent base revision. | Do not integrate; retain the child result as recoverable. |
| Child validation | Child-owned acceptance and deterministic validation evidence are durably recorded before the request. | Return `validation-required`; child remains non-terminal for integration purposes. |
| Scope allowlist | The source diff resolves only to the child's component scope and excludes protected task, design, validator, scorer, credential, and unrelated paths. | Reject fail-closed; preserve source worktree and evidence. |
| Parent target freshness | The parent worktree still represents the declared integration base and has no undeclared conflicting changes. | Abort without partial application; return a stale-base or dirty-target blocker. |
| Integration serialization | A durable or host-owned integration lock prevents simultaneous operations against the same parent target. | Queue only when the task authority permits it; otherwise reject and preserve the checkpoint. |
| Capability preflight | The host can address the approved target, apply the bounded result, observe conflict/abort, and persist the outcome without exposing raw paths. | Record host capability unavailable; do not substitute direct child access. |
| Protected-input preservation | The adapter can compare protected and unrelated content before and after application. | Reject admission; no completion or cleanup claim. |
| Recovery checkpoint | The source result, expected base, operation identity, and target outcome can be retained after failure. | Preserve both workspaces and escalate; do not infer success from process exit. |

### Candidate mechanical sequence

1. Parent planning records a committed parent checkpoint, child scope, expected parent base, protected inputs, and allowed integration operation.
2. Parent-level admission verifies the child plan and integration preconditions without evaluating implementation semantics.
3. The child implements only its assigned scope and runs the specified child-level validation.
4. The child requests integration using the immutable source result and expected parent base; it does not receive arbitrary parent paths or write authority.
5. The host/integration adapter acquires the parent-target lock, verifies the expected base, confirms the source diff is within the child allowlist, and confirms the target is eligible for the operation.
6. The adapter applies the bounded source result atomically or aborts without claiming a partial success; it records source identity, target identity, scope result, conflict result, and ancestry observation using approved logical references.
7. The child records an integration-result/disposition value such as `integrated`, `blocked`, or `recovery-required` with the adapter result and its own validation evidence. These are proposed evidence or handoff values, not newly adopted task statuses; durable task-status transitions remain constrained by the current task-control protocol until a later authorized, consumer-backed implementation establishes compatible representation and behavior.
8. The parent records the child's reported terminal disposition and descendant closure facts; it does not reinterpret the child's semantic result.

The exact command, patch representation, commit attribution, lock storage, and field names remain implementation details for a later consumer-backed task. A later implementation may use a scoped commit application, patch application, or another mechanism only if it proves the same preconditions and recovery behavior.

### Component-level concurrency and parent completion

The parent and child terms here refer to component-building flows: a parent component-builder builds the parent component, and each child component-builder builds a separately owned child component. A parent may decide to admit independent child builds in parallel when their component boundaries and declared dependencies do not overlap, their budgets fit the parent allocation, and the configured concurrency control permits it. Parallel child builds do not permit two builds for the same component.

At any instant, at most one admitted build or active implementation attempt may modify a given component. Same-component admission must atomically reserve or claim that component before returning `admitted`; a check followed by a separate claim is insufficient because two callers could otherwise pass the check concurrently. The parent, child, task-control, and host adapter must reject or queue a second build for the same component rather than allowing concurrent writers. A child build is not complete for parent purposes until that child has a durable terminal task status—`completed`, `failed`, or `cancelled`—with its required evidence, semantic integration disposition, and any required mechanical integration result recorded. A successful parent build completion is permitted only when every child build owned or admitted by that parent has a terminal task status, the parent's own acceptance conditions are satisfied, and failed or cancelled children are explicitly accounted for. Blocked, approval-waiting, escalated, or pending-integration child work is non-terminal and prevents successful parent completion; it must remain represented by recoverable accounting and checkpoint evidence rather than being treated as terminal. Integration-result values such as `integrated`, `blocked`, and `recovery-required` are evidence or handoff dispositions, not task statuses. These are target planning invariants; current task-control and launcher behavior remain the authority until separately authorized compatibility evidence establishes their implementation.

### Integration acceptance evidence

A future implementation task must demonstrate at least one successful provider-free integration after distinct receiving semantic acceptance, a rejected out-of-scope result, a stale-parent rejection, a conflict or dirty-target abort with preserved recovery state, serialized competing requests, preserved unrelated parent changes, protected-input rejection, and post-operation ancestry/scope observations. The existing `parent-integration.test.ts` is useful baseline evidence for preservation and ancestry, but it tests the current parent-side integration rehearsal and does not by itself prove this target operation.

### Residual integration risk

The proposed operation still requires host-level enforcement and a clear target-worktree ownership model. Git ancestry and a clean diff do not prove process, filesystem, credential, or network isolation. If the host cannot provide the preflight, lock, atomic abort, protected-path, and recovery evidence, the target transition remains blocked and current parent-side integration remains the compatibility path.

## 4. Blocker B: plan readiness and child admission

### Proposed resolution

Reuse the existing task-control record authority and add a deterministic readiness decision around a separate bounded plan artifact rather than silently expanding the current task schema. The plan artifact is linked to the parent and child `as-is.md` anchors, the accepted envelope, and the parent task. Task-control consumes the artifact and current task records to return an admission result; it does not interpret implementation semantics.

This preserves the current division: task-control owns durable state and deterministic admission, the receiving integration authority owns semantic child-result acceptance, the host adapter owns mechanical application, the parent planner owns planning content, and the child owns implementation and child validation. The admission design must check both kinds of concurrency: independent children may run in parallel when admitted, while an atomic same-component reservation rejects or queues a second build. Parent completion remains closed until all parent-owned child builds have terminal task statuses, required integration evidence, and required accounting.

### Minimum plan-readiness facts

| Fact | Source or owner | Admission question |
| --- | --- | --- |

| Accepted-envelope identity | Frozen target packet and acceptance record | Is the plan derived from the exact accepted direction? |
| Parent and child anchors | Canonical `as-is.md` records | Are scope and ownership identifiable? |
| Parent task and plan identity | Parent task authority plus bounded plan artifact | Is this the intended task revision and plan revision? |
| Child assignments | Parent planning artifact linked to each child | Are only impacted children assigned, with omitted children explicitly disposed, and are parallelizable versus ordered children identified? |
| Scope and non-goals | Parent and child plan sections | Is each child assignment bounded and non-overlapping with siblings? |
| Dependencies and ordering | Plan artifact | Are required dependencies available, is the order safe, and are independent child builds eligible for parallel admission? |
| Protected inputs | Plan and current safety constraints | Are designs, records, validators, scorers, fixtures, credentials, and unrelated files protected? |
| Acceptance and validation | Child plan | Can the child run deterministic checks and record evidence? |
| Recovery and escalation | Child plan and task-control policy | Is there a safe checkpoint and a route for blockers or questions? |
| Integration declaration | Child plan, receiving semantic disposition, and host capability result | Is the admitted scope-preserving integration operation available after distinct semantic acceptance? |
| Budget and worker capability | Task-control records and host preflight | Do allocation, reserve, depth, child count, worker, and capabilities permit launch? |
| Freshness | Record revision and plan identity | Are the records and plan current rather than stale or contradictory, and can task-control atomically reserve the component without an active or reserved build? |

### Readiness result

The deterministic result should distinguish `admitted`, `rejected`, and `unavailable` without claiming semantic correctness. It should identify the checked plan and record identities, missing or contradictory facts, budget and capability observations, protected-input result, receiving semantic disposition, integration-preflight result, atomic component reservation result, and the safe next action. A rejection or unavailable result prevents child launch; it does not mutate unrelated records or create retry authority.

The result should be recorded as durable task evidence using the existing task-control event/checkpoint pattern once a later implementation task establishes the exact representation. No new task status is proposed by this plan: a later implementation may retain `ready` for an admitted child only if its durable readiness result/checkpoint is represented and validated compatibly; until then, `ready` retains its current task-protocol meaning and is not, by itself, proof of target plan-readiness admission. `blocked` represents an unresolved blocking condition, and `awaiting-approval` represents a durable approval gate under the current protocol.

### Admission acceptance evidence

A future implementation task must demonstrate acceptance of a complete plan, rejection for each missing required fact, stale-plan rejection, budget and reserve rejection, unavailable integration capability, protected-input failure, child-count/depth rejection, atomic same-component concurrent-build rejection or queueing, safe parallel admission for independent child components, and preservation of the current task record on failed admission. It must also demonstrate that the readiness control does not perform semantic child validation, make the receiving semantic integration decision, mechanically integrate a child result, grant human acceptance, or create a task by itself. Parent completion tests must show that a parent remains non-terminal while any owned child build is active, blocked, or otherwise non-terminal, and becomes eligible only after all owned child builds have terminal task statuses, required integration evidence, and accounted dispositions.

### Residual admission risk

The current repository has strong task-state, budget, recovery, and handoff primitives, but it does not yet establish a target plan-artifact schema or a target plan-readiness operation. Until a consumer-backed implementation and focused tests exist, current task-control behavior remains authoritative and the target child-admission transition remains unimplemented.

## 5. Pilot inclusion sequence

The safe sequence is:

1. Review this blocker-resolution plan and repair only supported planning defects.
2. Derive a bounded executable pilot plan for `validation-fixtures/dummy-delegation` from the two proposed resolutions, with exact current baseline behavior, plan artifact shape, host capability checks, protected inputs, commands, expected observations, and recovery cases.
3. Review that executable pilot plan; keep `startsWork: false` until a separate user kick-off/task decision.
4. Authorize a bounded implementation task only if the user separately chooses kick-off and names the applicable task scope, workers, and human decision holders.
5. Implement the smallest compatibility-preserving control/integration slice, run provider-free fixture evidence, and retain current parent-side integration until target evidence passes.
6. Decide separately whether to run live provider, setup/consumer, security-isolation, or benchmark follow-on slices; each must carry its own approval and claims.

The first pilot should not be expanded merely because an excluded capability is interesting. Include an exclusion only when the next decision requires its evidence and the owner can provide a bounded acceptance and recovery path.

## 6. Unresolved questions and dispositions

| Question | Disposition after this plan | Owner | Safe checkpoint |
| --- | --- | --- | --- |
| What exact mechanism permits a child to integrate only its own validated result into the parent worktree? | **Resolved as a candidate contract for planning; blocking for implementation until evidence exists.** | `skills/spawning-pi-subagents` host owner with `agents/component-builder` integration owner. | Preserve child result and reject integration when scope, base, lock, capability, or recovery evidence is unavailable. |
| Which task-control facts and record changes are needed for plan readiness and child admission? | **Resolved as a minimum fact set and ownership split for planning; blocking for implementation until a consumer-backed representation is tested.** | `core/modules/task-control` owner with `core/contracts` owner. | Keep current task authority; reject or block child admission when any required fact is absent or stale. |
| Which capabilities remain excluded from the first pilot? | **Resolved for this pilot.** | Project orchestrator with pilot/evaluation owner. | Do not make claims outside the local provider-free control-plane question. |
| When may excluded capabilities be added? | **Resolved as a gated follow-on policy, with capability-specific evidence and approval.** | The owner of each later bounded slice. | A capability remains deferred until its inputs, owner, acceptance, validation, recovery, and evidence are recorded. |
| What exact field names, APIs, lock storage, and patch/commit mechanics will be used? | **Non-blocking for this planning artifact; blocking for implementation design.** | `core/contracts`, task-control, and host/integration owners. | Do not invent executable names or mutate current schemas from this plan. |
| Which child builds may run in parallel, and what prevents two builds of the same component? | **Resolved as a planning invariant; blocking for implementation evidence.** | Parent planner with task-control and host/integration owners. | Independent-boundary/dependency analysis, atomic concurrency admission, per-component reservation, and parent closure tests. | Queue or reject same-component overlap; preserve parent non-completion until every owned child build has a terminal task status and required accounting. | Include these cases in the executable pilot plan; do not infer support from `maxConcurrentTasks` alone. |

## Acceptance conditions for this plan

This plan is complete for review when it explains the practical reason and evidence impact of each material pilot exclusion, gives inclusion triggers without implying automatic future work, accurately describes the `core/contracts` ownership boundary, defines candidate responses to both blockers, explicitly distinguishes parallel independent child builds from atomic same-component serialization, distinguishes child validation, receiving semantic integration, and mechanical application, requires parent completion to wait for every owned child build's terminal task status and required accounting, preserves current-versus-target separation, and keeps `startsWork: false`.

A successful review of this plan does not authorize the executable pilot plan, task creation, kick-off, implementation, target-contract adoption, or artifact retirement.

## Next safe action

Obtain one bounded read-only review of this exact plan. If no supported repair remains, derive the executable `dummy-delegation` pilot plan from these candidate resolutions, including parallel-independent-child, atomic same-component-serialization, distinct receiving semantic acceptance, and parent-closure cases, and preserve `startsWork: false` until a separate user kick-off and task authorization.
