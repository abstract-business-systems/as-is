# Coding/application flow plan — Draft 1
Purpose: Define the exact Terra-authored coding/application construction plan for the first bounded, provider-free execution-control candidate slice without authorizing implementation.

## Status and authority

Status: proposed exact coding/application top-level plan; Human Review is required before implementation. This plan is not a task record, implementation packet, target-contract adoption, benchmark protocol, migration decision, commit authorization, or merge authorization.

Construction-time assignment: Terra is the accountable plan author and implementation adviser; Luna is the implementation author for an admitted task. These are exercise responsibilities, not permanent target roles. The exact model identities, provider routes, human holders, budgets, capabilities, validators, reviewers, integration owners, and task revisions remain gate-time facts.

Plan identity: this packet is Draft 1. Its exact packet identity must be recorded in the separate freeze record before Human Review. A successor is required for any material change to scope, authority, acceptance, protected inputs, risk posture, or permitted external effects; the reviewed predecessor remains preserved.

`startsWork: false`

## Decision requested

Should the human accept this exact Terra-authored coding/application plan for preparation of one bounded implementation slice, subject to a separate kick-off and exact task-control admission?

Acceptance would authorize use of this plan as the coding/application planning basis only. It would not authorize task creation, worker launch, implementation, benchmark execution, target-contract adoption, retirement, commit, or merge.

## Sources and accepted boundaries

- Accepted high-level-design envelope: `drafts/agentic-development-system-high-level-design-draft11/`, accepted in `reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md`; target-design SHA-256 `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`.
- Accepted construction-planning map: `drafts/agentic-development-system-overall-realization-roadmap-draft12/`; packet digest `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124`; freeze and exact-review evidence are in `reviews/agentic-development-system/overall-realization-roadmap-draft12-freeze.md` and `reviews/agentic-development-system/overall-realization-roadmap-draft12-exact-review.md`.
- Focused candidate slice: `drafts/agentic-development-system-executable-realization-plan-draft6.md`; frozen SHA-256 `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`.
- Reviewed transition detail: `drafts/agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md` and `reviews/agentic-development-system/expert-component-builder-realization-transition-detail-plan-draft13.md`.
- Selected repository-local pilot: `validation-fixtures/dummy-delegation`, recorded in `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`.
- Current task authority: `core/contracts/component-task-record-protocol.md` and `core/modules/task-control/as-is.md`.

Current records and live contracts remain authoritative until a separately authorized, validated migration and adoption decision. The accepted target direction does not silently change current parent-side integration, task-control, launcher, process-adapter, or fixture behavior.

## Bounded question

Can the repository build and prove a provider-free candidate path that admits a bounded parent/child plan, reserves independent component attempts atomically, stops only affected work when independence is invalidated, applies a validated child result through a scope-preserving mechanical host boundary, and withholds successful parent closure until every owned child is terminal and accounted for?

The plan answers only how to prepare and validate that candidate slice. It does not claim that any candidate structure or behavior exists today.

## Scope

### In scope

1. Deterministic plan-envelope readiness and admission facts, including accepted-envelope identity, current record revisions, dependency classification, protected-input declarations, capability facts, budget/reserve facts, and freshness.
2. Atomic per-component and parent-allocation reservations with deterministic multi-reservation acquisition, release, stale-owner recovery, orphan handling, and no partial-admission claims.
3. Deterministic parent-closure evaluation that distinguishes task status from child validation, integration evidence, and terminal accounting.
4. A host-adapter mechanical child-result application boundary, if and only if its ownership prerequisite is resolved before task preparation. The adapter may preflight scope, protected inputs, expected parent base, dirty/conflicting state, locking, recovery, and ancestry; it may not make the child semantic decision or become a second build.
5. A provider-free `validation-fixtures/dummy-delegation` candidate harness using disposable local repositories, local stubs, fake clocks, and protected-file assertions, added only after the prerequisite candidate structures and focused checks pass.
6. Existing task-control, process-adapter, and dummy-delegation tests as separate regression evidence. Existing tests must not be relabeled as candidate-flow proof.

### Explicit non-goals

- No agents/skills contract redesign or implementation; that is the separate Sol-authored flow.
- No change to the live `component-builder`, launcher, task-control, contract, or fixture contract unless an admitted task explicitly declares the smallest required compatible update.
- No provider-backed execution, credential use, external network, package distribution, installation, upgrade, downgrade, uninstall, portability, or broad isolation claim.
- No benchmark run, advancement decision, migration execution, target adoption, artifact retirement, or merge.
- No hierarchy-wide scheduler, universal sibling cancellation policy, new receiving semantic authority, silent rebase, automatic scope widening, automatic budget increase, or live-reservation stealing.
- No invented Luna model ID, exact provider route, task holder, human holder, API, schema, storage path, or runtime default.

## Current baseline and candidate target

| Concern | Current baseline to preserve | Candidate behavior to prove |
| --- | --- | --- |
| Task authority | Local JSON task object and configured Markdown narrative remain authoritative under task-control. | Admission and closure evaluators report facts without creating a competing task authority. |
| Parent/child integration | Current `component-builder` and launcher boundaries remain live behavior; current parent-side integration remains compatibility baseline. | A child-approved result can be mechanically applied only through a separately owned, scope-preserving, recoverable host boundary. |
| Process adapter | `core/adapters/process` owns process lifecycle and process-backed execution observations; its current record does not grant Git/worktree application authority. | The owner either accepts a bounded mechanical application responsibility with a durable record update in scope, or the process-adapter path remains blocked. |
| Concurrency | Current configuration has `maxConcurrentTasks: 1`; no present parallel capability is claimed. | Candidate controls can admit only independently bounded siblings when the explicitly approved candidate policy permits it, while rejecting overlap and dependency ordering violations. |
| Fixture evidence | Existing fixture tests are deterministic baseline evidence. | New candidate tests invoke the new candidate structures and record their distinct outcomes and recovery states. |
| Validation | Deterministic checks, semantic review, integration, and task status are distinct. | Candidate evidence preserves those distinctions and does not infer completion from process exit, telemetry, registry output, or a child commit. |

## Affected anchors and ownership

| Anchor | Role in this plan | Boundary |
| --- | --- | --- |
| [`as-is.md`](../../as-is.md#design) | Nearest common repository parent for cross-component planning and accounting. | Must not be edited by a child task; root authority remains separate. |
| [`core/as-is.md`](../../core/as-is.md#design) | Host-neutral implementation-family boundary. | Does not become a host adapter, task authority, or target-project integration. |
| [`core/modules/task-control/as-is.md`](../../core/modules/task-control/as-is.md#design) | Candidate plan admission, reservations, closure evaluation, and focused tests. | Task-control remains the authority for task transitions and budget interpretation. |
| [`core/adapters/process/as-is.md`](../../core/adapters/process/as-is.md#design) | Candidate mechanical host boundary, subject to an owner decision before task preparation. | Does not decide semantic child acceptance, task status, or merge. |
| [`agents/component-builder/as-is.md`](../../agents/component-builder/as-is.md#design) | Current parent/child semantic and integration baseline. | No role-contract migration is implied by this plan. |
| [`skills/spawning-pi-subagents/SKILL.md`](../../skills/spawning-pi-subagents/SKILL.md) | Current launch, worktree, and ancestry evidence input. | Launcher remains an adapter/procedure consumer and does not become an integration authority. |
| [`validation-fixtures/as-is.md`](../../validation-fixtures/as-is.md#design) | Fixture evidence boundary. | Does not own product or core implementation. |
| [`validation-fixtures/dummy-delegation/as-is.md`](../../validation-fixtures/dummy-delegation/as-is.md#design) | Selected provider-free pilot anchor. | Candidate evidence remains pilot-scoped and does not prove broad realization. |
| [`core/contracts/component-task-record-protocol.md`](../../core/contracts/component-task-record-protocol.md) | Normative current task lifecycle and closure input. | No new task status or second task schema is introduced by this plan. |

A newly discovered affected component, shared interface, or authority crossing stops the affected plan path. The nearest common planning owner must record the expansion or blocker; the implementation task may not silently broaden its changed-artifact set.

## Construction responsibilities and review path

| Responsibility | Assignment and boundary |
| --- | --- |
| Plan author/adviser | Terra authors this plan and advises within the accepted envelope. Advice cannot change scope, acceptance, architecture, protected inputs, risk, or external effects without a successor plan and applicable Human Review. |
| Plan review | No Sol or Kimi coding/application plan review is required or claimed. No substitute model reviewer is invented. Deterministic identity, link, and acceptance checks remain required. |
| Human decision | The human accepts, requests revision, defers, or rejects this exact frozen plan. Human acceptance does not authorize launch. |
| Implementation author | Luna writes code only after kick-off and exact task-control admission. The exact model identity and runtime holder remain unselected. |
| Implementation adviser/result reviewer | Terra advises Luna within the accepted envelope and reviews Luna's result as explicitly non-independent. |
| Independent result review | Add a separately selected reviewer only when risk, architecture, security, external effects, disagreement, or policy requires it. The selection is gate-time and not implied here. |
| Deterministic validation | Protected code-owned checks remain separate from model advice, plan review, semantic result review, process exit, telemetry, and integration. |
| Integration owner | The process-adapter ownership question must be resolved before its task is prepared. Current parent-side integration remains the baseline until candidate evidence and adoption exist. |

## Required gates

1. **Exact plan freeze.** Materialize this packet, verify its exact file set and links, compute caller-owned identities, and record the freeze before Human Review. Any material change creates a successor.
2. **Coding/application Human Review.** The human decides on this exact frozen Terra plan. Requesting revision returns the plan to bounded planning; acceptance authorizes planning basis only.
3. **Process-adapter boundary decision.** Before preparing or admitting any process-adapter task, its owner must accept the proposed mechanical boundary and any required durable `as-is.md` update in the task-start scope, or record a blocker. A child task cannot decide its own prerequisite ownership.
4. **Separate kick-off.** The human names the exact first implementation slice and permits task preparation or start only for that slice. This is not blanket authorization for the roadmap.
5. **Task preparation and start handoff.** Task management creates the exact root and immediate-child task pairs, records workers, capabilities, budgets, dependencies, protected inputs, acceptance, recovery, and stop conditions, and commits the task-start handoff before implementation.
6. **Exact task-control admission.** Task-control verifies each task revision, boundary, holder, budget/reserve, capability, dependency, protection, validation, integration owner, and recovery term. No implementation begins before admission.
7. **Candidate structure readiness.** Pure task-control, reservation, and process-adapter focused checks pass in dependency order before the fixture candidate harness is admitted or exercised.
8. **Candidate proof review.** After candidate scenarios pass, obtain fresh read-only result/evidence validation. Passing checks do not adopt target contracts or authorize a benchmark.

## Later task decomposition

This plan creates no task. If separately authorized, the exact hierarchy is:

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

The root task owns cross-component planning, ordering, accounting, and closure. Each child owns only its own component. The parent does not edit child files, semantically verify child implementation, or mechanically apply child results. The current component-builder contract and the accepted target direction differ on this point; compatibility remains required until a separately validated migration.

The process-adapter child is conditional: it cannot be prepared until the boundary decision in Gate 3 is recorded. If that decision is negative or unavailable, the plan stops the process-adapter branch and preserves the current parent-side integration baseline; it does not invent a replacement owner.

The fixture child is conditional: it cannot be admitted to candidate-flow exercise until the pure task-control, reservation, and process-adapter candidate checks pass. Existing baseline fixture tests may run as compatibility checks, but they do not unlock candidate-flow claims.

## Dependency-ordered realization sequence

This is the intended order after all authorization gates; it is not an execution command and does not authorize work.

1. Verify the accepted envelope and accepted Draft-12 planning-map identity used by the exact plan.
2. Record the process-adapter ownership decision before preparing that branch.
3. Prepare and admit the bounded task hierarchy with exact gate-time facts.
4. Implement and focus-test plan readiness/admission and parent-closure evaluation in task-control.
5. Implement and focus-test atomic reservation, release, stale-owner recovery, orphan handling, and no-partial-admission behavior.
6. Implement and focus-test mechanical child-result integration only if its owner accepted the boundary; preserve current behavior as the comparison path.
7. Add the provider-free candidate fixture harness under its own component boundary.
8. Run candidate scenarios through the candidate structures, then run baseline regression checks separately.
9. Obtain result/evidence validation, record residual risk and recovery, and stop before benchmark or adoption decisions.

An invalidated independence relationship stops affected builds at recoverable checkpoints while unaffected independent siblings may continue. The control must not silently change scope, order, reservation, budget, parent target, or cancellation policy.

## Acceptance conditions

The exact plan is acceptable only if the later admitted implementation can demonstrate all of the following within the bounded pilot:

- Complete, fresh plan inputs are admitted only when scope, dependencies, accepted-envelope identity, protections, capabilities, budget/reserve, recovery, and record revisions are present.
- Missing, stale, contradictory, protected, or unavailable facts fail closed as `rejected` or `unavailable`; neither result creates retry authority.
- Atomic reservation gives competing same-component attempts exactly one winner, prevents partial multi-reservation admission, releases terminal reservations after durable evidence, and does not steal a live owner.
- Ordered or overlapping children are rejected or ordered rather than admitted as independent; later invalidation stops affected work while still-independent siblings may continue.
- Mechanical application accepts only an attributable, validated child result within its allowlist and expected parent base; protected, unrelated, stale, dirty, conflicting, or out-of-scope changes abort without partial success.
- Parent success is ineligible until every owned child has terminal status, required validation and integration evidence, and explicit accounting; failed, cancelled, blocked, active, awaiting-approval, or pending-integration children prevent successful closure.
- Existing task-control, process-adapter, and fixture regression suites pass without silently changing current semantics.
- Candidate evidence is provider-free, uses disposable local state and fake clocks, leaves protected inputs and unrelated files unchanged, and records recovery state for every failed path.

## Exact deterministic validation surface

These commands are planned validation inputs only. They may run only after the applicable task exists, is admitted, and the prerequisite structure has been built. Every candidate command uses `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0`; no provider or external service is enabled.

| Stage | Command | Required evidence |
| --- | --- | --- |
| Plan admission and closure | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/plan-admission.test.ts core/modules/task-control/handoff-eligibility.test.ts` | Fresh complete plans admit; missing/stale/protected/budget/dependency inputs fail closed; parent closure is ineligible for non-terminal or unaccounted children. |
| Existing task-control regression | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/control-plane.test.ts` | Current task status, budget, recovery, delegation, and closure behavior remains intact. |
| Reservation | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/component-reservation.test.ts` | One same-component winner; no partial admission; release/recovery and live-owner protection are observable. |
| Host-adapter integration | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/adapters/process/child-result-integration.test.ts` | Valid scoped application succeeds; protected, unrelated, stale, dirty, conflicting, and out-of-scope results abort safely; locking and ancestry evidence are explicit. |
| Existing process-adapter regression | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/adapters/process/bounded-process-supervisor.test.ts core/adapters/process/supervisor.test.ts` | Current lifecycle and durable-record mapping remains intact. |
| Candidate fixture harness | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test validation-fixtures/dummy-delegation/candidate-build-processing.test.ts` | Candidate scenarios execute through admission, reservation, invalidation, integration, and closure structures with provider-free disposable state. |
| Existing fixture regression | `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test validation-fixtures/dummy-delegation/dummy-delegation.test.ts validation-fixtures/dummy-delegation/launcher-startup.test.ts validation-fixtures/dummy-delegation/parent-integration.test.ts` | Existing baseline behavior remains intact; results are regression evidence only. |

A planned path absent at the validation checkpoint is a blocker. The worker must not substitute a different command or silently alter scope. Candidate fixture execution is forbidden until its three prerequisite candidate checks pass.

## Protected inputs and controls

Workers may read these inputs but may not modify them unless a separately admitted task declares the exact authorized durable-record update:

- accepted Draft-11 design and acceptance evidence;
- accepted Draft-12 roadmap packet, freeze, exact review, and this exact plan packet;
- Draft-6 realization plan and its review/freeze evidence;
- current `as-is.md` records, task protocol, role and skill contracts, and configuration records;
- validators, scorers, benchmark inputs, baseline revisions, and protected fixture controls;
- credentials, provider configuration, live-provider controls, and external network access;
- unrelated parent, sibling, and child component files; and
- reservation, lock, task, or runtime state not owned by the current admitted operation.

Provider-free candidate checks use only local stubs, disposable temporary repositories, fake clocks, and bounded output. Worktree, process, registry, trace, or session observations are supplementary and do not establish completion or isolation by themselves.

## Recovery and escalation

At every failed or unavailable operation, preserve the smallest checkpoint containing the plan and record revisions, operation/reservation/lock identity, expected parent base, child result identity, protected-input snapshot, observed reason, cumulative budget observations, and next safe action.

Do not automatically widen scope, rebase stale work, retry with a new budget, cancel unaffected siblings, steal a live reservation, or infer success from exit status. A failed process-adapter ownership decision blocks only its affected branch and leaves the current parent-side baseline intact; if the candidate claim depends on that branch, the candidate proof remains incomplete.

Escalate deterministic readiness, budget, and task-status questions to task-control ownership; mechanical workspace, lock, scope, and ancestry questions to the process-adapter boundary owner; semantic child-result questions to the component-builder owner; and material boundary, authority, risk, or accepted-envelope changes through the project orchestrator to the human.

Terra's implementation-result review is non-independent. Add independent review when the risk triggers in this plan apply. Deterministic validation remains separate from both reviews.

## Gate-time facts intentionally left unselected

The following must be selected and recorded only at the applicable review, kick-off, or admission gate:

- exact plan revision and packet digest after freeze;
- authorized human decision-holder identity;
- process-adapter boundary decision and any exact durable-record change;
- root and child task revisions and configured task narratives;
- individual worker/runtime holders;
- Luna's exact model ID, provider route, thinking level, and capability set;
- Terra's exact runtime identity and advice/result-review scope;
- cost and wall-clock allocations, retained reserves, retry/recovery limits, and observation sources;
- protected validators, scorers, fixture controls, and integration owner;
- independent result reviewer when a trigger applies; and
- exact task-level stop conditions and recovery approvals.

No missing gate-time fact may be filled by a historical model observation, preset alias, process exit, reviewer output, or this plan's existence.

## Safe next action

Create the exact packet identity and freeze record for this plan, run deterministic link/structure checks, and present its concise decision brief for Human Review. If accepted, resolve the process-adapter ownership boundary and request a separate kick-off; do not create tasks or launch Luna from this plan. `startsWork: false`.
