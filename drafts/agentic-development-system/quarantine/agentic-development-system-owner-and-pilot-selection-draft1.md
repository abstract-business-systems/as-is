# Agentic Development System — Owner and Pilot Selection

Purpose: Record the accountable role appointments and concrete repository-local pilot selected after Human Review acceptance and detail-plan review, without creating implementation authority.

## Status and authority

Decision date: 2026-08-27.

Status: accepted planning decision; implementation is not authorized.

The user directed both actions: appoint accountable owners and select a concrete repository-local pilot. This record makes those planning decisions explicit. It does not adopt target contracts into current architecture, create a task, authorize kick-off, authorize implementation, authorize a commit, or retire current behavior.

The accepted high-level envelope is the exact draft-11 packet:

- [Draft-11 target design](agentic-development-system-high-level-design-draft11/target-design.md)
- [Draft-11 manifest](agentic-development-system-high-level-design-draft11/review-manifest.md)
- [Human Review acceptance](../reviews/agentic-development-system/target-design-human-review-acceptance-draft11.md)
- Target-design SHA-256: `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`
- Packet digest: `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`

This decision follows the reviewed detail-plan chunk [Component-Builder Realization Transition, draft 13](agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md) and its [bounded review](../reviews/agentic-development-system/expert-component-builder-realization-transition-detail-plan-draft13.md).

## Appointed accountable owners

These appointments assign planning accountability to existing role or component boundaries. They do not grant a component permission to edit another component, and they do not resolve target contract questions by implication.

| Planning responsibility | Appointed owner | Boundary and immediate duty |
| --- | --- | --- |
| Parent/child realization transition | `agents/component-builder` role owner | Maintain the current role boundary as baseline; own the next bounded transition plan for parent planning, child assignment, child evidence, and parent closure accounting. |
| Deterministic task admission and budget facts | `core/modules/task-control` owner | Establish which current task-control facts support later readiness, admission, checkpoint, budget, cancellation, and descendant-closure decisions; do not create a competing authority. |
| Future cross-component contract documentation | `core/contracts` owner | Keep future normative contract documents distinct from executable implementations and task authority; record any required contract gap without adopting it. |
| Mechanical launch, workspace, and ancestry evidence | `skills/spawning-pi-subagents` owner | Establish the host-adapter evidence available for later child launch and scope-preserving integration; retain the current rule that the launcher does not merge or decide semantic integration. |
| Semantic integration boundary and parent accounting | `agents/component-builder` role owner | Preserve the current receiving-builder authority until a separately accepted successor is validated; define the later compatibility evidence for child-owned integration and parent disposition accounting. |
| Acceptance-to-evidence review | `agents/evidence-validator` role owner | Define the evidence categories and read-only review boundary for a later pilot; do not approve target adoption or implementation. |
| Root escalation and human-facing status | `agents/as-is` role owner | Preserve the current router-only boundary while carrying blockers and material envelope changes to the applicable orchestrator and user. |
| Pilot fixture and evidence retention | `validation-fixtures/dummy-delegation` component owner | Preserve the fixture as harmless, provider-free, non-product evidence; maintain pilot-specific scope and retention decisions within that component. |

### Owner limitations

The current records do not establish a single existing owner for a future child-side, scope-preserving parent-worktree integration operation. The appointments above assign the planning questions to the narrowest existing owners: `spawning-pi-subagents` for mechanical host evidence and `component-builder` for semantic integration and parent accounting. The actual target mechanism remains a blocking dependency for executable child integration and must not be inferred from this appointment.

No individual human identities are recorded because the repository context establishes role and component boundaries, not personnel assignments. The responsible orchestrator must name available runtime workers and any human decision holder when a later task is authorized.

## Selected repository-local pilot

### Pilot identity

Select the existing `validation-fixtures/dummy-delegation` component as the first repository-local realization pilot.

Pilot anchor: [`validation-fixtures/dummy-delegation/as-is.md`](../validation-fixtures/dummy-delegation/as-is.md#design)

The pilot is a provider-free deterministic rehearsal of one bounded parent/child realization transition. It will later exercise the accepted target direction with a child-scoped result, child-level validation evidence, an admitted scope-preserving integration outcome, parent disposition accounting, and recoverable failure or blocked state. It is a control-plane and boundary pilot, not a product feature and not evidence of broad autonomous-development efficacy.

### Why this pilot

- It is an existing harmless fixture explicitly owned for delegation, recovery, task-record, and parent-integration evidence.
- Its current tests already provide deterministic local coverage for delegated attempts, retry evidence, privacy exclusions, startup behavior, and parent-integration preservation.
- It does not require credentials, provider access, external effects, package distribution, or a new consuming project.
- It exposes the exact current parent-integration evidence boundary that the accepted target direction proposes to change, making compatibility and migration risk observable.
- It keeps the first executable scope smaller than combining role changes, task-record changes, setup comparison, a mock consumer, and a benchmark.

### Pilot boundary

In scope for later planning:

- one bounded provider-free fixture scenario;
- the `dummy-delegation` anchor and its directly relevant fixture records and tests;
- current-versus-target responsibility evidence for parent planning, child validation, child integration, and parent accounting;
- protected fixture inputs and unrelated-file preservation;
- deterministic validation and read-only evidence review;
- explicit failure, blocked, recovery, and unresolved-question reporting.

Out of scope:

- changing the current `component-builder`, launcher, task-control, contract, or fixture implementation in this planning decision;
- a live provider-backed run;
- selecting or changing models, providers, or credentials;
- a mock consuming project or setup-inclusive baseline/candidate comparison;
- distribution, installation, upgrade, portability, or security-isolation claims;
- root-orchestrator redesign, broad record-schema migration, skill replacement, artifact retirement, or benchmark advancement;
- any task, worker launch, commit, or kick-off.

### Protected inputs and controls

- The accepted draft-11 packet, acceptance record, and draft-13 detail plan remain immutable references.
- Current `as-is.md` records remain current-architecture authority.
- Existing `dummy-delegation` fixture behavior remains baseline evidence until a separately authorized successor is validated.
- Fixture tests, protected inputs, validators, scorers, baselines, and unrelated files remain outside worker write scope.
- Deterministic validation remains provider-free; a live test remains disabled unless separately approved and explicitly enabled.
- No credentials or external effects are permitted.
- The pilot must not claim that worktrees alone enforce read isolation or that process exit, telemetry, registry evidence, or a child commit proves completion.

## Later pilot-plan acceptance conditions

Before an executable packet or task is considered, the later pilot plan must identify:

1. the exact parent and child task/component boundaries and their anchors;
2. the current baseline behavior and the specific target behavior being rehearsed;
3. the protected fixture, validators, scorer, unrelated-file control, and credential-free environment evidence;
4. the parent and child owners, dependencies, approved capabilities, budget, and wall-clock limits;
5. the child packet's bounded outcome, non-goals, acceptance, validation, recovery, escalation, and stop conditions;
6. the mechanical integration evidence and semantic ownership split, including the unresolved mechanism blocker if it remains;
7. the failure, cancellation, budget-stop, conflict, and unresolved-question dispositions;
8. the review and evidence path, including residual risk and the explicit rule that no result is complete until the applicable task authority and closure evidence say so; and
9. the exact deterministic commands and expected observations, without enabling a provider-backed run.

The later pilot plan must preserve current behavior as a comparison baseline and must return to planning if the selected change alters an accepted boundary, authority, protected input, acceptance condition, risk posture, or permitted external effect.

## Unresolved questions and dispositions

| Question | Status | Affected transition | Owner | Next action |
| --- | --- | --- | --- | --- |
| What exact mechanism permits a child to integrate only its own validated result into the parent worktree? | **Blocking** | Later child integration and parent closure. | `spawning-pi-subagents` owner with `component-builder` owner. | Define and evidence a scope-preserving, recoverable mechanism before executable pilot admission; do not infer it from current parent integration. |
| Which task-control facts and record changes are needed for plan readiness and child admission? | **Blocking** | Later parent/child admission. | `core/modules/task-control` owner with `core/contracts` owner. | Map current support and record gaps in a later contract-planning chunk. |
| Which concrete pilot should be used? | **Resolved** | Later pilot planning. | Project orchestrator and `validation-fixtures/dummy-delegation` owner. | Use `validation-fixtures/dummy-delegation` as selected above; do not launch it without a separately authorized task. |
| Who are the individual runtime workers and human decision holders? | **Non-blocking for planning; blocking before execution** | Later owner admission and escalation. | Project orchestrator. | Name them in the later task and packet; this record appoints role/component accountability only. |
| Does the pilot require a mock consuming project or setup comparison? | **Non-blocking for this pilot; blocking for setup-inclusive evaluation** | Later setup/evaluation. | Pilot/evaluation owner. | Defer; do not claim the pilot proves cross-project consumption or setup portability. |
| What are the exact field names, storage locations, and APIs? | **Non-blocking** | Later contract and implementation planning. | `core/contracts` and task-control owners. | Resolve only when a concrete consumer requires them; do not invent them here. |

## Next safe action

Prepare a later executable pilot plan for the selected `dummy-delegation` anchor only after the two integration/admission blockers have a bounded owner response and evidence plan. Then obtain the required bounded plan review and any required kick-off/task authorization. No implementation, worker launch, commit, or target-contract adoption follows from this selection record. `startsWork: false`.
