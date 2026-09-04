# Agentic Development System — Executable Realization Plan — Draft 6

Purpose: Define the smallest reviewable implementation plan for building the proposed plan-readiness, admission, component-concurrency, child-integration, and parent-closure structures before exercising them with `validation-fixtures/dummy-delegation`.

## Status and authority

Status: proposed executable realization plan; implementation is not authorized.

## Successor identity

This is the sole focused successor to `drafts/agentic-development-system-executable-realization-plan-draft5.md`. Draft 5 and its actual Sol review are preserved as predecessor evidence. The unavailable draft-2 realization-plan review is not treated as an authority or reconstructed. This successor applies only the supported repairs identified in `reviews/agentic-development-system/sol-executable-realization-plan-draft5.md`; it does not authorize implementation or task creation.

This plan derives from the human-accepted draft-11 target envelope, the reviewed component-builder realization-transition plan draft 13, the owner-and-pilot selection, and the focused parallel-child clarification draft 2. It turns those planning decisions into a candidate implementation sequence and evidence design. It does not adopt target contracts into current architecture, create a task, authorize kick-off, launch a worker, authorize a commit, or claim that candidate behavior exists.

The plan is a planning artifact, not an implementation packet or task record. A later human decision must accept the exact reviewed plan and separately authorize kick-off for a named first bounded implementation task. Exact task-control admission remains required after kick-off.

## Controlling references and identity

- Accepted target design: `drafts/agentic-development-system-high-level-design-draft11/target-design.md`.
- Accepted target-design SHA-256: `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`.
- Accepted target packet digest: `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`.
- Reviewed realization detail plan: `drafts/agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md`.
- Planning owner and selected pilot: `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`.
- Focused parallel-child clarification: `drafts/agentic-development-system-parallel-child-build-processing-draft2.md`.
- Focused parallel-child draft-2 content SHA-256 at plan authoring: `c231b1639da9f59f6dfb3b124f795bdccdb3eacae96f0388ccbe5d779b47583d`.
- Actual draft-2 Sol review: `reviews/agentic-development-system/sol-parallel-child-build-processing-draft2.md`.
- Actual draft-2 Kimi review: `reviews/agentic-development-system/kimi-parallel-child-build-processing-draft2.md`.
- Quarantine index and quarantined provenance (blocker-resolution plan draft 6 plus its Sol and Kimi advisory reviews): pruned at adoption closure; recoverable via tag `adoption-evidence-full` (commit `c5c208c`).
- Draft-1 realization-plan review: `reviews/agentic-development-system/sol-executable-realization-plan-draft1.md`.
- Draft-2 realization-plan review: `reviews/agentic-development-system/sol-executable-realization-plan-draft2.md` (unavailable; not reconstructed).
- Draft-3 realization-plan review: `reviews/agentic-development-system/sol-executable-realization-plan-draft3.md`.
- Draft-3 content SHA-256 at authoring: `c7a701a8819b0158f81fea265587d32e65333e3587be23bbd27a1d8b687de435`.
- Draft-4 realization-plan review: `reviews/agentic-development-system/sol-executable-realization-plan-draft4.md`.
- Draft-4 content SHA-256 at authoring: `832af1f8f172bbbe8bf353c5b0f7147185f5d8a68781fd621ce48b08ad41ef3a`.
- Draft-5 realization-plan review: `reviews/agentic-development-system/sol-executable-realization-plan-draft5.md`.
- Draft-5 content SHA-256 at authoring: `6b9cf00f30756a176b9afb9a6a4e7700706ffd8e8e32fe1902b51c1a88d48eb3`.
- Current task authority: `core/contracts/component-task-record-protocol.md` and `core/modules/task-control/as-is.md`.
- Current role and launch boundaries: `agents/component-builder/as-is.md`, `agents/component-builder/agent.md`, and `skills/spawning-pi-subagents/SKILL.md`.
- Selected pilot anchor: `validation-fixtures/dummy-delegation/as-is.md`.

The accepted target identity and current records are inputs to this plan, not target-contract adoption. The plan's own exact revision must be recorded by its later bounded review and any successor; a content digest is computed after authoring and before that review rather than embedded recursively in the document.

## Bounded reuse of quarantined realization concerns

The quarantined blocker-resolution material was not used as a replacement for the focused draft-2 clarification. Its later-realization concerns were reintroduced only where they directly support executable evidence for the accepted envelope:

| Quarantined concern | Disposition | Use in this plan | Boundary retained |
| --- | --- | --- | --- |
| Separate Human Review, kick-off, and exact task-control admission | adopted | Ordered implementation steps 1–4 and the status/authority section | No implementation or task authority is granted by this plan. |
| Atomic same-component reservation and release/reclaim | adopted | Reservation structure, recovery rules, and evidence matrix | Exact representation remains a candidate implementation detail; no current contract is changed. |
| Integration-success conditions and child/parent accounting | adopted | Parent closure outcome and integration evidence | Integration result values remain evidence; current task-status semantics remain authoritative. |
| Stale parent base after a parallel child advances the target | adopted | Integration recovery sequence and stale-base scenario | No silent rebase or broadened acceptance is permitted. |
| Queue/dequeue freshness | adopted | Admission structure and queue-freshness scenario | A queued request must be revalidated; no automatic refresh or retry authority is created. |
| Admission result distinction | adopted | The `admitted` / `rejected` / `unavailable` result set and its evidence fields | Result values remain candidate evidence, not task statuses or automatic retry authority. |
| Semantic disposition before application | adapted | The requirement that child semantic acceptance precedes host mechanical application | No new receiving authority is created, and the host only consumes the child's decision mechanically. |
| Universal sibling cancellation policy | rejected | Quarantined draft-6 concern | Later cancellation remains dependency-, budget-, and recovery-specific; unaffected siblings may continue. |
| Hierarchy-wide scheduler | deferred | Quarantined draft-6 concern | Not required for this pilot; overlapping ancestor/descendant work is conservatively rejected or ordered. |
| Distinct receiving semantic authority | rejected | Quarantined draft-6 concern | Child-owned integration decision is retained; no new semantic authority is introduced. |

The quarantined concern set is closed by the table above: every material reused or excluded concern has exactly one explicit disposition. Reused concerns are `adopted` except semantic-disposition ordering, which is `adapted` to the accepted child-owned boundary; universal sibling cancellation is `rejected`, the hierarchy-wide scheduler is `deferred`, and a distinct receiving semantic authority is `rejected`. No other quarantined concern is silently imported. Any newly discovered concern requires a separate bounded decision rather than implicit inclusion.

## Implementation question

Can the repository build a provider-free candidate path that deterministically admits bounded parent and child plans, reserves components atomically, permits only safely independent child builds to proceed in parallel, lets a child-owned integration stage apply only its validated result, and prevents successful parent closure until every owned child has successfully completed and been accounted for—while preserving current behavior until migration evidence exists?

## Claims this plan may support

If all planned implementation and validation stages pass, the candidate evidence may support only these bounded claims:

- a complete candidate plan can be rejected or admitted using explicit readiness facts;
- two independent child component builds can be admitted concurrently when the parent budget and candidate controls permit them;
- competing attempts for one component cannot both acquire its reservation;
- an ordered dependency is not admitted as an independent parallel pair;
- a newly discovered overlap or ordering dependency stops affected work at recoverable checkpoints without silently changing scope, ordering, reservation, or budget;
- a child-owned integration stage is mechanically constrained to its declared result and protected inputs;
- stale, dirty, conflicting, or out-of-scope integration is rejected or preserved as recoverable pending work; and
- parent success is withheld until every owned child has successful terminal task status, required integration evidence, and closure accounting.

The evidence cannot support claims about provider efficacy, distribution, portability, complete security isolation, broad workflow superiority, or target-contract adoption. Existing fixture tests remain baseline evidence and are not candidate evidence until the new structures are built and the candidate scenarios below execute through them.

## Bounded implementation slice

The implementation slice has four cooperating candidate structures and one evidence harness. The structures are proposed locations, not current authority:

| Candidate structure | Proposed owner | Responsibility | Explicit non-responsibility |
| --- | --- | --- | --- |
| `core/modules/task-control/plan-admission.ts` | `core/modules/task-control` | Validate a frozen parent/child plan, accepted-envelope identity, dependencies, budgets, protected inputs, worker capability facts, freshness, and admission outcome. | Does not implement child behavior, decide semantic correctness, apply Git changes, or grant human approval. |
| `core/modules/task-control/component-reservation.ts` | `core/modules/task-control` | Atomically acquire, inspect, release, and recover per-component reservations and the parent allocation reservation used for a parallel admission set. | Does not replace durable task status, infer completion from a lease, or authorize a plan outside task-control authority. |
| `core/adapters/process` host adapter | `core/adapters/process` component owner | Own the candidate host-mediated mechanical preflight and application boundary for one validated child result, preserving scope, protected inputs, expected-base freshness, conflict abort, recovery, and ancestry evidence. | Does not decide child semantic acceptance, change task status, create a task, resolve a conflict semantically, or become a second build. |
| `core/adapters/process/child-result-integration.ts` or equivalent adapter file | `core/adapters/process` owner | Provide the smallest host-adapter implementation location selected by the owner; exact file placement remains subject to the component anchor. | Does not grant task, launch, integration, or semantic authority to a skill. |
| `validation-fixtures/dummy-delegation/candidate-build-processing.test.ts` and focused helper fixtures | `validation-fixtures/dummy-delegation` | Exercise the candidate structures with deterministic local repositories, fake clocks, controlled child results, and protected-file assertions. | Does not modify product components, contact providers, or serve as proof before the candidate structures are invoked. |
| Parent-closure evaluation | `core/modules/task-control` owner | Deterministically evaluate child terminal status, integration evidence, parent acceptance, and failed/cancelled accounting without mutating task state. | Does not semantically review child work or replace the authority-bearing task transition. |
| Component records and task-control/launcher tests | Their existing component owners | Record durable design/link changes and regression evidence required by the implementation. | Do not silently promote candidate behavior to current architecture. |

The plan deliberately reuses existing task-control, launcher, and fixture ownership rather than creating a generic orchestration framework or a new receiving semantic-integration authority. The child component-building flow remains the semantic owner of its own implementation, validation, integration decision, and integration evidence. The host adapter performs only the bounded mechanical application. The parent records child disposition and closure; it does not semantically verify or mechanically integrate the child result. The plan's candidate changes are decomposed by component in the ordered sequence below; no single cross-component task is implied. The proposed integration adapter is a host-adapter implementation location only; placing code under a skill does not grant the skill task, launch, integration, or semantic authority. The exact host-adapter anchor is `core/adapters/process/as-is.md`; its owner must resolve the boundary before any process-adapter task is prepared or admitted. The existing component owns detached process lifecycle and host-neutral process-backed mapping, but its current `as-is.md` does not already grant Git/worktree application authority. The owner must make a pre-task boundary decision: either accept the candidate responsibility and include the corresponding durable `as-is.md` update in the task-start scope, or record a blocker and stop that path. No skill directory is an alternative owner, and the process-adapter implementation task cannot decide its own prerequisite ownership boundary.

If implementation evidence shows that a proposed location crosses an existing component boundary or requires a new owner, stop at the design boundary and record a bounded blocker. Do not move code or invent an owner inside the implementation task.

## Component-task decomposition and ownership gate

The repository hierarchy requires nested ownership rather than one task spanning unrelated component directories. The following is the exact planning decomposition for a later authorized implementation; it creates no task by being written here:

```text
root as-is parent task
├── core child task
│   ├── core/modules child task
│   │   └── core/modules/task-control child task
│   └── core/adapters child task
│       └── core/adapters/process child task
└── validation-fixtures child task
    └── validation-fixtures/dummy-delegation child task
```

| Planned task boundary | Planned responsibility | Required handoff or dependency |
| --- | --- | --- |
| Root `as-is` parent task | Own the accepted envelope, cross-component plan, dependency ordering, parent accounting, and closure; do not edit child component files. | Human kick-off and task-control admission of the exact root task; delegates only to immediate `core` and `validation-fixtures` children. |
| `core` child task | Coordinate the `core/modules` and `core/adapters` implementation children and preserve the core component boundary; do not implement either branch across its own child boundary. | Receives the root-injected bounded plan; after its own admission, allocates child budgets from its admitted allocation, records child reservations/statuses, and delegates only to immediate children. |
| `core/modules` child task | Coordinate the `core/modules/task-control` child and preserve the modules boundary; do not implement task-control across its own child boundary. | Receives the bounded plan from `core`; after admission, allocates the explicitly bounded child reserve, records child spend/reserve and terminal disposition, and delegates only to that immediate child. |
| `core/modules/task-control` child task | Implement plan admission, reservation, parent-closure evaluation, and their focused tests. | Depends on the root accepted plan; receives an explicit allocation from `core/modules`, records its own spend/reserve, reports its terminal result to `core/modules`, and must pass pure decision and reservation checks before fixture candidate-flow exercise. |
| `core/adapters` child task | Coordinate the `core/adapters/process` child and preserve the adapters boundary; do not implement process-adapter work across its own child boundary. | Receives the bounded plan from `core`; after admission, allocates the explicitly bounded child reserve, records child spend/reserve and terminal disposition, and delegates only to that immediate child. |
| `core/adapters/process` child task | Implement mechanical child-result integration and focused tests within the process-adapter component after the prior owner boundary decision. | The boundary decision is resolved before this task is prepared; any accepted `as-is.md` update is included in its task-start scope. It reports its terminal result and recovery state to `core/adapters`; semantic integration remains child-owned. |
| `validation-fixtures` child task | Coordinate fixture evidence without changing product or core implementation boundaries. | Receives the candidate-flow plan only after candidate structures and their focused checks pass; allocates the explicitly bounded child reserve, records child spend/reserve and terminal disposition, and delegates to the `dummy-delegation` child task. |
| `validation-fixtures/dummy-delegation` child task | Add and run the provider-free candidate harness and preserve baseline tests as regression evidence. | Must not be admitted to candidate-flow exercise before task-control, reservation, and process-adapter candidate checks pass. |

A later task packet must name each task's local `as-is.md` anchor, exact changed-artifact set, worker, capabilities, budget, dependencies, protected inputs, acceptance, validation, recovery, and escalation. The root task owns cross-component accounting but does not acquire child implementation authority. Each intermediate task owns only its own component and delegates only to its immediate documented children. The process-adapter owner must make the boundary decision before its task is prepared; if the owner does not accept the proposed mechanical integration boundary, the implementation path is blocked and the orchestrator must record the decision rather than silently assigning a substitute owner. Every intermediate task follows the same rule: its parent admits and allocates the child before delegation, and the child reports spend, reserve, terminal disposition, and recovery state back to that parent without changing the parent's status or budget.

## Candidate data and decision boundaries

The candidate structures need exact data for the pilot. These shapes are implementation-plan proposals and remain non-current until separately accepted and implemented.

### Plan envelope

A candidate plan envelope contains:

- `plan-revision`: an immutable revision identifier for the plan artifact;
- `accepted-envelope`: the accepted draft-11 target packet identity and target-design digest;
- `parent`: the parent component identity, anchor identity, task revision, and bounded parent outcome;
- `children`: one entry per impacted immediate child, each with its child anchor, component key, bounded outcome, scope allowlist, dependencies, protected-input set, worker, capabilities, budget, acceptance, validation, recovery, escalation, and integration declaration;
- `dependency-graph`: explicit directed relationships and an independence classification for the proposed admission set;
- `freshness`: current parent and child record revisions and the parent target base expected by integration;
- `non-goals`: omitted or deferred children and capabilities, with a reason and disposition; and
- `plan-digest`: a digest of the complete frozen plan content excluding any transport wrapper.

The plan must identify the literal `as-is.md` anchor for every affected component and the nearest common parent that owns cross-component planning. A child plan is not valid merely because a parent names a directory. A parent plan is not valid merely because the child record is in `ready` status.

### Admission result

The candidate admission result is one of `admitted`, `rejected`, or `unavailable`. It records the plan identity, source record revisions, checked component keys, dependency classification, protected-input result, worker/capability result, budget and reserve observations, reservation result, freshness observations, missing or contradictory facts, and the safe next action.

`admitted` means that the deterministic control has recorded all required readiness facts and acquired the reservations for the named attempt set. It does not mean that implementation succeeded or that the parent may complete. `rejected` means the request is known not to satisfy a required condition. `unavailable` means the control could not safely establish a required fact or capability. Neither rejection nor unavailability creates retry authority or mutates unrelated records.

The candidate result is evidence associated with existing task records. It does not introduce a new task status. Existing `ready`, `active`, `blocked`, `awaiting-approval`, `completed`, `failed`, and `cancelled` meanings remain governed by the current task protocol until a separately accepted compatibility change exists.

### Component reservation

A reservation is an atomic admission fact for one component key and one task revision/attempt. The candidate reservation record contains the component key, owner task identity, plan revision, attempt, reservation identity, acquisition time, lease/check-in deadline, and release or recovery disposition. The reservation is not a task status, a worker identity, a completion claim, or a substitute for durable task state.

Acquisition must use one atomic create-if-absent operation per component key. A check followed by a later claim is invalid. A parallel admission set acquires the parent allocation reservation and all component reservations in a deterministic sorted-key order; if any acquisition fails, all reservations acquired by that set are released or retained as explicitly recoverable failure evidence before the admission result is returned. The implementation must not allow a partially admitted set to masquerade as a complete parallel admission.

A normal terminal child result releases its reservation after the durable result and integration evidence are recorded. A failed, cancelled, budget-stopped, or blocked result releases it only after the recovery checkpoint is durable and the reservation disposition is recorded. A crash or missing owner may be reclaimed only after the candidate recovery rule proves that the lease/check-in is stale and the owning task cannot still be active; an ambiguous live owner remains blocked rather than being stolen. Reclaim records the previous reservation identity, reason, observation time, and new disposition. A reservation directory or file left by an interrupted acquisition is treated as an orphan candidate and is not silently removed before the same stale-owner checks.

### Parent closure outcome

The candidate closure decision distinguishes the task-control status from the semantic build outcome:

- successful parent completion requires every owned/admitted child to have task status `completed`, successful child validation, successful child integration evidence, and explicit parent accounting;
- a child with `failed` or `cancelled` status prevents successful parent completion and must be named in a parent terminal failure or cancellation result;
- a child that is active, blocked, awaiting approval, escalated, or pending integration keeps the parent non-terminal for successful closure; and
- a parent may not treat a recorded `blocked`, `recovery-required`, or unavailable integration result as successful child completion.

The candidate closure evaluator is deterministic and fail-closed. It may report an eligible outcome without mutating a task record; the existing task-control transition remains the authority-bearing operation. The implementation must preserve the current task protocol and use a successor contract if a new status or result representation proves necessary.

## Candidate child-result integration

### Semantic and mechanical split

The child component-building flow owns the decision that its bounded implementation and validation are ready for integration and records its integration evidence or blocker. The integration adapter receives the immutable child result, the approved scope, the expected parent base, the protected-input set, and the child's declared integration decision. It performs only mechanical checks and application. Parent accounting consumes the child evidence and result; it does not reinterpret, cherry-pick, revalidate, or apply the result.

Integration is a stage of the same admitted child build. It is not a second component build, a second task, or a second reservation for the child component. A workspace-level integration lock is a separate mechanical target lock and must not be confused with a component-build reservation.

### Mechanical preflight and apply sequence

1. Read the immutable child result identity, task revision, attempt, plan revision, expected parent base, scope allowlist, protected inputs, and child validation evidence.
2. Verify that the child result is attributable to the admitted reservation and that its declared source is still available.
3. Acquire the parent-target integration lock using deterministic ordering and record the operation identity.
4. Revalidate the parent target base, current task/plan revisions, protected inputs, unrelated changes, source scope, and source ancestry while holding the lock.
5. Abort without mutation when the target is stale, dirty beyond the declared allowance, conflicting, out of scope, unavailable, or protected content would change.
6. Consume the child's semantic integration decision and apply only the declared bounded result through the host adapter. The adapter must not create or invent a semantic disposition.
7. Record the result, conflict or abort reason, preserved recovery checkpoint, protected/unrelated-file comparison, and post-operation ancestry observation.
8. Release the integration lock only after the mechanical outcome and recovery evidence are durable.

If another parallel child has advanced the parent target after this child was admitted, the child does not silently rebase, widen scope, or reuse stale acceptance. It returns a stale-base recovery result. A later bounded recovery decision may revalidate the child result against the new base or request a new child attempt, preserving the original evidence and budget observations.

### Required integration evidence

The candidate harness must demonstrate:

- one successful provider-free child-result application through the candidate adapter;
- rejection of a result that changes a path outside the child allowlist;
- rejection of protected-input modification;
- stale parent-base rejection after another child advances the target;
- dirty-target or conflict abort without a partial success claim;
- serialized competing integration operations;
- preserved unrelated parent changes;
- source/result identity and caller-ancestry evidence; and
- release or recovery of the target lock after success and after each failure mode.

The existing `validation-fixtures/dummy-delegation/parent-integration.test.ts` remains baseline evidence for the current parent-side rehearsal. It must not be relabeled as candidate evidence; the new harness must invoke the new adapter and assert its distinct ownership and failure behavior.

## Parallel admission and dependency invalidation

### Admission of independent children

The candidate parent planner supplies the child set and dependency graph. The deterministic admission control verifies that child component boundaries do not overlap, no declared dependency requires ordering within the admitted set, each child has complete plan/protected-input/budget/recovery data, the parent allocation covers the combined reservations, and the global concurrency policy permits the set. It atomically reserves every component in the set before returning `admitted`.

The parent may request parallel admission for independent children, but it cannot override component ownership, protected inputs, current task authority, or the deterministic result. Same-component and ancestor/descendant overlap are rejected or ordered conservatively; they are not treated as independent merely because two paths differ textually.

### Independence invalidation

If a relationship initially classified as independent is later shown to overlap or require ordering, the control records an invalidation event naming the affected plan revisions, component keys, observed relationship, and checkpoint. Affected builds stop at recoverable checkpoints. Siblings whose independence remains established may continue. No build silently changes scope, ordering, reservation, budget, or parent target to continue.

The candidate implementation must not impose a universal sibling-wide cancellation policy. The parent planner or applicable orchestrator applies the later dependency, budget, recovery, and cancellation policy using the durable result. The candidate test must prove that unaffected independent siblings can continue while the invalidated affected set is stopped, and that all affected reservations remain visible until release or recovery disposition.

### Queue freshness

A queued admission request is not admitted merely because it was once ready. At dequeue time, the control rechecks plan digest, parent and child record revisions, dependency graph, protected-input digest, budget/reserve availability, worker/capability facts, same-component reservations, and integration readiness. Any mismatch returns `rejected` or `unavailable` with a recovery action; it does not silently refresh the request or change its scope.

## Ordered implementation sequence

The implementation must follow this order. No candidate-flow test may be presented as evidence before the preceding structure is built and its focused unit checks pass.

The exact provider-free commands below are the validation surface for this plan. They are commands to be run only after the separately authorized tasks exist; listing them creates no task or execution authority. Planned output files may be absent before implementation and task admission; their absence is checked only at the named validation checkpoint. The commands are grouped by prerequisite order: pure decision checks, reservation checks, process-adapter checks, then candidate fixture flow; baseline regression checks are separate and do not unlock candidate flow.

1. **Freeze and review this plan.** Record the plan digest externally, inspect the exact file set, obtain the bounded read-only plan review, respond with at most one focused successor, and obtain Human Review of the exact resulting plan. The digest must be recomputed from the frozen successor bytes and recorded in its review/handoff; no task or implementation authority follows from review alone.
2. **Kick off one bounded parent task separately.** The user names the exact first implementation slice and permits task preparation/admission only. The nearest common parent for this cross-component slice is the repository root `as-is` component; the parent task must identify separately owned child tasks for each changed component and must not grant one component authority over another.
3. **Prepare the task pair and start handoff.** Task management, not task-control, creates the exact parent task pair and any separately owned child task pairs with protected inputs, workers, capabilities, budgets, dependencies, acceptance, recovery, and stop conditions. Task management commits the task-start handoff before implementation.
4. **Admit the exact tasks.** Task-control independently verifies the exact task revisions, holders, component boundaries, capabilities, budgets, dependencies, protected inputs, evidence requirements, and recovery terms. Implementation begins only after each applicable task is admitted; an admission result is not semantic approval.
5. **Build pure decision structures first.** The separately admitted `core/modules/task-control` task implements and tests plan-envelope validation, dependency classification, admission-result evaluation, parent-closure evaluation, and budget/reserve arithmetic without launching workers or mutating fixture product behavior.
6. **Build atomic reservation control.** Within the admitted task and component boundary, implement and test sorted multi-reservation acquisition, same-component rejection, parent-allocation reservation, release, stale-owner recovery, orphan handling, and no-partial-admission behavior using deterministic fake clocks and temporary state.
7. **Build mechanical child-result integration.** The separately admitted host-adapter task implements and tests preflight, scope/protected-input checks, expected-base freshness, integration locking, atomic apply/abort, recovery checkpoint, release, and ancestry observation. Keep semantic integration ownership with the child flow and current parent-side integration as the compatibility baseline until candidate evidence passes.
8. **Add candidate fixture harness.** The separately admitted fixture task adds provider-free candidate tests and disposable repositories under the fixture's own component boundary. Keep validators, protected inputs, scorers, and unrelated-file controls outside worker mutation scope. Do not enable the live provider-backed test.
9. **Exercise candidate scenarios.** Run the exact scenarios in the evidence matrix below through the new structures, not through existing baseline-only paths. Record observed results, task revisions/attempts, reservation outcomes, integration outcomes, parent closure decisions, recovery states, and residual risk.
10. **Review candidate evidence.** Obtain fresh read-only final-diff and evidence validation. Resolve defects within the authorized component tasks or record a blocker; do not infer target adoption from passing tests.
11. **Prepare migration and benchmark decisions separately.** Only after candidate evidence is reviewed may the responsible orchestrator propose compatibility migration, setup-inclusive comparison, or benchmark inputs. Each requires its own bounded review and approval.

### Exact provider-free validation commands

The separately admitted component tasks must use these commands from the repository root, with no provider or external service enabled. The exact paths below are expected outputs of the implementation tasks; their absence before implementation is expected and must not block task admission. At the validation checkpoint, a missing planned path is a blocker; the worker must not substitute another path. Every candidate command must run with `AS_IS_LIVE_INTEGRATION=0`, with `PI_BIN` unset, and with only local temporary repositories/stubs; the task narrative must record those environment facts.

| Stage | Command | Required observable assertions |
| --- | --- | --- |
| Pure task-control decision and closure checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/plan-admission.test.ts core/modules/task-control/handoff-eligibility.test.ts` | Exit `0`; complete-plan admission is `admitted`; missing/stale/protected/budget/dependency inputs are `rejected` or `unavailable`; parent closure remains ineligible for each non-terminal child and for failed/cancelled children without accounting; no unrelated record changes. |
| Existing task-control regression checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/control-plane.test.ts` | Exit `0`; current task-record status, budget, recovery, delegation, and closure behavior remains intact. This is baseline regression evidence, not candidate-flow evidence. |
| Reservation race and recovery checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/component-reservation.test.ts` | Exit `0`; concurrent same-component attempts have exactly one reservation winner; multi-reservation failure leaves no partial admitted set; success/failure/cancellation release is observable; live-owner reservation is not stolen; stale-owner/orphan reclaim records reason and leaves no leak. |
| Host-adapter integration checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/adapters/process/child-result-integration.test.ts` | Exit `0`; valid result applies once; out-of-scope/protected/stale/dirty/conflicting results abort without partial application; competing operations serialize; lock release/recovery and ancestry/scope observations are explicit; unrelated files remain byte-identical. |
| Existing process-adapter regression checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/adapters/process/bounded-process-supervisor.test.ts core/adapters/process/supervisor.test.ts` | Exit `0`; current host-neutral process lifecycle remains intact. This is baseline regression evidence, not candidate-flow evidence. |
| Candidate fixture harness | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test validation-fixtures/dummy-delegation/candidate-build-processing.test.ts` | Exit `0`; scenarios execute through candidate plan admission, reservations, invalidation, integration, and closure structures; provider-free temporary repositories and fake clocks are used; candidate evidence names outcomes and preserved recovery state. |
| Existing fixture regression checks | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test validation-fixtures/dummy-delegation/dummy-delegation.test.ts validation-fixtures/dummy-delegation/launcher-startup.test.ts validation-fixtures/dummy-delegation/parent-integration.test.ts` | Exit `0`; existing baseline behavior remains intact. These results are regression evidence only, not target-flow evidence. |

If a planned file or command does not exist after task admission, the affected task stops and records a blocker; the worker must not substitute a different command or silently alter scope. The candidate fixture harness command is permitted only after the pure task-control decision checks, reservation checks, and process-adapter integration checks all pass. Existing baseline regression commands are separate compatibility checks and do not convert baseline behavior into candidate evidence.

| Scenario | Candidate path | Required observation | Failure meaning |
| --- | --- | --- | --- |
| Complete plan admission | Plan validator and parent allocation reservation | `admitted` result names exact plan/revisions, budgets, dependencies, protected inputs, and reservations | Missing facts or stale identity must reject/unavailable before launch |
| Missing or contradictory plan | Plan validator | One deterministic rejection with reason and preserved task state | No child launch or automatic repair |
| Two independent children | Multi-reservation admission and fixture harness | Both children reserve distinct components and may run concurrently within parent/global budgets | Any duplicate reservation, budget overrun, or unbounded launch fails the slice |
| Two attempts for one component | Atomic reservation control | Exactly one attempt acquires; the other is rejected or remains queued | A check-then-claim race fails the slice |
| Dependency-linked children | Dependency classifier and admission | Pair is ordered or rejected as a parallel set; no concurrent admission | Treating ordered work as independent fails the slice |
| Independence invalidation | Invalidation/recovery path | Affected builds stop at recoverable checkpoints; still-independent siblings continue; no silent mutation | Silent replanning or sibling contamination fails the slice |
| Successful child integration | Child-owned decision plus mechanical adapter | Scoped result applies, protected/unrelated files remain unchanged, lock releases, ancestry is observable | Parent-side integration or unproven success fails the slice |
| Stale base or conflict | Integration preflight and abort | No partial application; recovery result remains available; reservation/lock disposition is explicit | Applying against stale or dirty target fails the slice |
| Queued request freshness | Queue/dequeue revalidation | Changed plan, record, budget, dependency, protection, or integration fact prevents admission | Admission from stale facts fails the slice |
| Parent with active child | Closure evaluator and task control | Parent cannot reach successful completion | Any successful parent result is a closure failure |
| Parent with blocked/approval/pending-integration child | Closure evaluator | Parent remains non-terminal for success and preserves blocker | Treating a non-terminal child as complete fails the slice |
| Parent with failed/cancelled child | Terminal accounting | Parent cannot be successful; failure/cancellation names the child and preserves evidence | Silent omission or successful parent completion fails the slice |
| All children successful | Closure evaluator and task transition | Parent success is eligible only after all child statuses, integration evidence, acceptance, and accounting pass | Early completion fails the slice |
| Reservation interruption | Recovery/reclaim control | Live owner is not stolen; stale owner/orphan can be reclaimed with durable reason; no leak remains | Unsafe stealing or permanent reservation leak fails the slice |
| Protected and unrelated inputs | Integration adapter and fixture assertions | Protected designs, task records, validators, scorers, credentials, and unrelated files are unchanged | Worktree success alone is insufficient |

## Protected inputs and execution controls

The later implementation packet must mark these inputs read-only for workers and candidate fixture mutations:

- accepted draft-11 packet, acceptance record, draft-13 plan, focused draft-2 clarification, and all review records;
- current component `as-is.md` records and task-control/contract records unless the exact task declares an authorized durable-record update;
- task-start and completion-control files outside the assigned component scope;
- validators, scorers, benchmark inputs, baseline revisions, and protected fixture controls;
- credentials, provider configuration, external network access, and live provider controls;
- unrelated parent and sibling component files; and
- any candidate reservation or integration state not owned by the current operation.

The candidate tests use temporary local Git repositories, disposable records, fake clocks, local stubs, and provider-free execution. `AS_IS_LIVE_INTEGRATION=1` is not enabled. A process exit, child commit, registry event, trace event, or passing baseline fixture test is supplementary evidence only and cannot establish candidate completion.

## Recovery and escalation

Every failed candidate operation preserves the smallest recoverable checkpoint: plan and record revisions, reservation identities, expected base, source result, protected-input snapshot, observed failure, budget observations, and next action. The control must not automatically widen scope, retry with a new budget, rebase stale work, cancel unaffected siblings, or steal a live reservation.

Escalation follows existing ownership:

- task-control resolves deterministic readiness, reservation, budget, status, and closure facts;
- the launcher/host adapter resolves mechanical capability, workspace, scope, lock, conflict, and ancestry observations;
- the child component-builder resolves child implementation, validation, integration decision, and child evidence within its own component;
- the parent component-builder records child assignment, dependency disposition, parent-owned work, and closure accounting without taking child semantic authority; and
- the project orchestrator bubbles unresolved material boundary, authority, risk, or accepted-envelope changes to the user.

A missing owner, contradictory current record, inability to prove atomic acquisition, inability to preserve protected inputs, or inability to recover a stale operation is blocking for implementation and stops the affected slice. It does not authorize a substitute owner or a broader redesign.

## Unresolved questions and dispositions

| Question | Classification | Owner role | Safe checkpoint | Next action |
| --- | --- | --- | --- | --- |
| Can the existing process adapter perform scope-preserving child-result application without granting child filesystem access? | Blocking before process-adapter task preparation and for integration implementation | `core/adapters/process` owner with `agents/component-builder` owner | Preserve child result and parent target; do not prepare or admit the process-adapter implementation path | Confirm the process-adapter boundary before preparing the process-adapter task; if accepted, include the durable record update in that task-start scope, then prove the candidate adapter sequence in unit and fixture tests before integration admission |
| Which exact durable location and lease representation should reservations use? | Blocking for reservation implementation; non-blocking for plan review | `core/modules/task-control` owner | Keep candidate state disposable and preserve orphan evidence | Select one atomic local representation in the implementation packet and test release/reclaim |
| How should a stale child result be revalidated after another child advances the parent base? | Blocking for stale-base recovery | `component-builder` owner with host-adapter owner | Keep the original child result pending; no silent rebase | Define whether a new bounded attempt or explicit revalidation is authorized in the later task |
| Does the candidate require a new durable task result field or status? | Non-blocking for this plan; blocking if implementation needs one | `core/contracts` and task-control owners | Use existing statuses and separate result evidence unless compatibility fails | Escalate a successor contract only if consumer-backed evidence requires it |
| What parent/global concurrency limit applies to the first pilot? | Resolved for planning: use current configured limit as a candidate input and test the new per-component rule separately | Task-control owner and pilot owner | Do not alter current configuration without explicit task scope | Add a candidate fixture-local admission limit without treating current `maxConcurrentTasks` as proof of target behavior |
| Should a universal sibling-cancellation policy be added? | Rejected for this plan; later cancellation policy remains dependency-, budget-, and recovery-specific | Parent planner and applicable orchestrator | Preserve unaffected independent siblings; stop affected work at recoverable checkpoints | Resolve only in a later bounded policy decision if a consumer requires it |
| Should a hierarchy-wide scheduler be added? | Deferred, not required for this pilot | Task-control owner | Reject or conservatively order overlapping ancestor/descendant work | Introduce only with a separate consumer-backed design decision |
| Should a distinct receiving semantic authority be added? | Rejected for this plan; child-owned integration decision is retained | Component-builder owner | Do not invent a second semantic authority; host application remains mechanical | Reopen only through a material design change and Human Review |
| Which individual workers and human decision holders will execute the task? | Non-blocking for plan review; blocking before kick-off | Project orchestrator | Do not launch or create task records | Name them in the separately authorized task and packet |
| Should setup, live-provider, security-isolation, or benchmark work be included? | Resolved: excluded from this slice | Later capability owners | Keep claims local and provider-free | Derive separately only after candidate evidence and approval |

The implementation tasks named in the ordered sequence are a planning decomposition, not created tasks. Their records, holders, budgets, and admission results must be created only after Human Review and a separate kick-off decision.

## Acceptance conditions for this plan

The plan is ready for human review only when:

- it traces each candidate structure and scenario to the accepted draft-11 envelope, current owner, or focused draft-2 clarification;
- it keeps current task-control, parent-side integration, and fixture behavior visibly separate from candidate behavior;
- it defines exact candidate responsibility boundaries for plan admission, reservations, child-owned integration, parent accounting, and evidence;
- it specifies atomic same-component serialization, parent-budget reservation, release/reclaim, queued freshness, dependency invalidation, stale-base handling, protected-input enforcement, and parent closure evidence;
- it requires candidate structures to be built before candidate fixture testing;
- it preserves the two focused draft-2 repairs without adding the quarantined detour as an unreviewed target contract;
- it classifies unresolved questions as resolved, non-blocking, or blocking and names safe checkpoints and next actions;
- it states the protected inputs, provider-free controls, deterministic validation, recovery, escalation, and explicit exclusions; and
- it remains a proposal with `startsWork: false`, no task, no kick-off, no implementation, no target-contract adoption, and no commit authorization.

A positive plan review does not authorize implementation. Human acceptance of this exact plan, a separately bounded kick-off decision, and exact task-control admission remain required.

## Next safe action

Draft 6 is the sole focused successor required by `reviews/agentic-development-system/sol-executable-realization-plan-draft5.md`. Its exact content digest must be computed and recorded externally before its bounded review. Obtain the required bounded review of this exact successor and Human Review before any task or implementation action. Do not create a task, launch a worker, modify current implementation, or exercise `dummy-delegation` before those gates. `startsWork: false`.
