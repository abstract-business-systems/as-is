# Candidate implementation packet readiness — decision brief

## Purpose

Prepare the next exact, reviewable candidate implementation packet without creating tasks or invoking the current component-builder/control-plane workflow as candidate behavior.

This brief is a gate-readiness record, not an implementation packet, task record, kick-off, model selection, or implementation authorization. `startsWork: false`.

## Accepted basis

The Human Review acceptance for construction-agent/model-binding Draft 1 is recorded in `reviews/agentic-development-system/construction-agent-model-binding-draft1-human-review-acceptance.md`. It remains preserved planning provenance and leaves exact runtime selections and gate-time facts unresolved.

The later user-confirmed role-oriented direction is recorded in `reviews/agentic-development-system/role-oriented-agent-architecture-decision-brief.md`. A successor packet must use its role identities, live brokered communication, traceability requirements, call-time model selection, and `high` default thinking level rather than treating the historical Terra/Luna/Sol/Kimi labels as agent identities or fixed runtime bindings.

The first candidate implementation packet should be limited to the first provider-free task-control slice from executable realization Plan Draft 6:

- plan-envelope readiness and admission decisions;
- atomic component reservations and parent allocation reservation;
- deterministic parent-closure evaluation; and
- focused provider-free tests for those structures.

Process-adapter child-result integration, fixture candidate-flow exercise, benchmark execution, migration, adoption, retirement, commit, and merge remain later separately gated work.

## Proposed packet scope

The future exact packet would be one bounded coding/application implementation packet owned by `core/modules/task-control` and would name only these candidate artifacts unless a reviewed successor justifies a narrower or different set:

- `core/modules/task-control/plan-admission.ts`
- `core/modules/task-control/plan-admission.test.ts`
- `core/modules/task-control/component-reservation.ts`
- `core/modules/task-control/component-reservation.test.ts`

The packet would define parent-closure evaluation within `plan-admission.ts` unless an owner-backed boundary decision selects a separate file. It would not modify current task status semantics, current `ControlPlane`, current budget arithmetic, current launcher behavior, or current task records. Existing current tests would remain regression evidence. If implementation requires a durable `as-is.md` or contract change, work stops and a successor design decision is required before editing it.

## Proposed construction path

The role-oriented candidate flow is:

1. The `implementer` owns the exact packet, implementation planning, task maintenance, and any bounded consultation.
2. The `planning-adviser` answers only the implementer's context-supplied questions and may consult the `external-adviser` when useful.
3. Human Review considers the exact frozen packet.
4. A separate kick-off authorizes preparation or start of the named first bounded task only.
5. Exact candidate admission verifies the task, holder, role capabilities, budget, dependency, protection, recovery, and trace facts.
6. The `worker` implements only the admitted `core/modules/task-control` scope and reports to the implementer through the brokered channel.
7. Deterministic validation runs independently of model advice and semantic review.
8. The implementer reviews, integrates, and reports the result; any risk-triggered independent review is separately selected and authorized.

The `external-adviser` is optional and advisory-only. It is not a coding/application plan gate, reviewer authority, implementation actor, or completion authority.

## Required facts before freezing the packet

The following facts are currently unresolved and must be established without inference before the exact packet can be frozen or admitted:

| Fact | Current evidence | Required disposition |
| --- | --- | --- |
| Exact role-contract paths and contents | Historical Draft-1 profile labels exist, but no role-oriented live contracts are selected | Select or create the exact `implementer`, `planning-adviser`, `external-adviser`, and `worker` artifacts through the applicable planning gate; do not substitute `component-builder` or a historical model label. |
| Approved model pools, default routes, and call-time overrides | Historical Terra, Luna, Sol, Kimi, and OpenRouter observations are preserved provenance only | Confirm allowed role/model selections, availability, capability, fallback behavior, and call-time override policy, or record a blocker. Do not infer availability or a role binding from history/configuration. |
| Human/runtime holders and accountability | No individual holders are selected | Name the accountable holder for packet planning, implementation, result review, and task admission. |
| Declared capabilities/tools and communication edges | No candidate role capability or broker declaration is selected | Declare the minimum capabilities and permitted live communication edges for each role, then verify them before launch. A role or model name does not grant tools, context, or authority. |
| Cost and wall-clock allocations | Current configuration exposes `300` seconds and `$0.5` as current task defaults; these are not candidate selections | Select bounded allocations and retained reserves in the exact task/packet; do not copy current defaults silently. |
| Protected inputs and write allowlist | Draft-6 provides the protection categories; exact packet paths are not yet frozen | Freeze exact read-only inputs, writable artifact paths, validators, and recovery state. |
| Candidate admission owner | Current `ControlPlane.admitLaunch()` is only baseline budget preflight | Name the candidate deterministic admission implementation and its authority boundary; do not invoke the old control plane as candidate admission. |
| Task, plan, and communication-trace identities | No new packet, task revision, or broker trace schema exists | Generate exact packet/task identities after authoring and freeze; define correlation and trace identities before live delegation; preserve this brief and all accepted predecessors. |

A missing or contradictory fact is a blocker. The packet must not replace it with a preset, historical observation, caller identity, or generic worker.

## Candidate validation boundary

The exact packet should require provider-free, local validation with `PI_BIN` unset and `AS_IS_LIVE_INTEGRATION=0`. Its deterministic checks should cover:

- complete, stale, missing, contradictory, protected-input, dependency, capability, and budget admission inputs;
- `admitted`, `rejected`, and `unavailable` outcomes without task-status mutation;
- atomic same-component reservation race behavior;
- sorted multi-reservation no-partial-admission behavior;
- normal release and failed/cancelled recovery release;
- live-owner protection and stale-owner/orphan reclaim evidence; and
- parent closure ineligibility for active, blocked, approval-waiting, pending-integration, failed, and cancelled children, with successful closure eligible only after complete terminal accounting.

The existing task-control tests remain baseline regression checks. No candidate-flow claim is supported until the new candidate paths are invoked by their focused tests.

## Decision requested

Before the next packet is frozen, resolve the required gate-time facts above. The safe default is to keep this brief pending and prepare no task. If the facts cannot be established, record the affected blocker and do not select a substitute.

## Authority limits

This brief does not:

- create or reactivate task records;
- select permanent agents or models;
- authorize provider execution or implementation;
- change current contracts or current workflow behavior;
- authorize benchmark, migration, adoption, retirement, commit, or merge; or
- convert the proposed artifact list into an implementation instruction.

`startsWork: false`
