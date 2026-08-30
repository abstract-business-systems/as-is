# Agentic Development System — Parallel Child-Build Processing

Purpose: Clarify the accepted parent/child component-building flow for independent parallel child builds, per-component serialization, and parent completion, without changing the accepted design envelope or authorizing implementation.

## Status and authority

Status: proposed bounded detail-plan clarification; implementation is not authorized.

This artifact isolates the user's requested parallel-child processing rules from the previously over-broad blocker-resolution planning. It is derived from the human-accepted draft-11 target design, the reviewed component-builder realization-transition plan draft 13, and the selected `validation-fixtures/dummy-delegation` realization pilot.

It does not adopt target contracts, change current `as-is.md` records, create a task, authorize kick-off, launch a worker, authorize a commit, or claim that the target flow is implemented.

References:

- [Accepted draft-11 target design](agentic-development-system-high-level-design-draft11/target-design.md)
- [Reviewed component-builder realization-transition detail plan, draft 13](agentic-development-system-detail-plan-component-builder-realization-transition-draft13.md)
- [Owner and pilot selection](agentic-development-system-owner-and-pilot-selection-draft1.md)
- [Component-builder current record](../agents/component-builder/as-is.md)
- [Task-record protocol](../core/contracts/component-task-record-protocol.md)
- [Task-control current record](../core/modules/task-control/as-is.md)
- [Selected pilot record](../validation-fixtures/dummy-delegation/as-is.md)

## Clarified meaning of parent and child

Here, parent and child refer to component-building flows:

- a parent component-builder builds a parent component and owns one bounded parent build;
- an impacted child component-builder builds a separately owned child component under that parent build; and
- ordinary runtime nesting or generic agent delegation does not by itself create a component child.

A child with its own canonical `as-is.md` is a separately owned component. The parent may prepare and inject a child-specific plan, but the child remains responsible for its own component scope and child-level result.

## Processing rules

### Independent child builds may run in parallel

A parent may admit independent child component builds in parallel when all of the following hold:

- the child component boundaries do not overlap;
- declared dependencies do not require ordering between the children;
- the child plans and protected-input sets are complete;
- each child has its own budget, worker, acceptance, validation, recovery, and escalation terms;
- the parent allocation can support the combined admitted work; and
- the deterministic admission mechanism permits the parallel set.

Parallel admission is an optimization within the parent build, not a separate parent task or approval flow.

### At most one build per component

At any given time, at most one admitted build or active implementation attempt may modify a particular component. This applies equally to a parent component and each child component.

A second build targeting the same component must be rejected or queued by an atomic admission/reservation mechanism. A check that merely observes “no active build” is insufficient if another admission can occur before the reservation is made.

This per-component rule is distinct from any global concurrency limit. A global limit may restrict the number of simultaneous builds, but it does not replace per-component serialization.

### Parent completion waits for all owned child builds

The parent build owns the child builds it admits or assigns. A successful parent build may be marked `completed` only after:

- every child build owned by that parent has itself reached successful `completed` status;
- each child has supplied its required implementation, child-validation, and integration evidence;
- the parent's own acceptance conditions pass; and
- parent accounting records the child results and closure evidence.

A child that is active, blocked, awaiting approval, escalated, pending integration, failed, or cancelled prevents successful parent completion. A failed or cancelled child must remain explicitly accounted for in any terminal parent failure or cancellation; it must not be reported as a successful parent build.

The parent build therefore has this shape:

```text
Parent build
├── parent-owned work
├── Child A build ─┐
├── Child B build ─┼─ may run in parallel when independent and admitted
└── closure        ┘

Successful parent completion requires Child A and Child B to complete
successfully and all parent acceptance conditions to pass.
```

## Responsibility boundaries

| Responsibility | Owner in the proposed flow | Limit |
| --- | --- | --- |
| Identify impacted children and prepare child plans | Parent component-builder | Does not implement or semantically verify child work. |
| Decide whether a set of child builds is independent and orderable | Parent planning flow, subject to deterministic admission | Does not override component ownership or protected inputs. |
| Admit or reject a build and reserve its component slot | Deterministic task-control/admission mechanism | Does not judge implementation semantics or grant human approval. |
| Implement one child component | Child-scoped component-builder | Works only within its child scope and injected plan. |
| Validate a child result | Child component-builder under its accepted plan | Does not validate unrelated parent or sibling work. |
| Integrate a child result under the accepted target direction | Child component-building flow through the separately admitted integration mechanism | Must preserve scope, protected inputs, recovery, and conflict handling. The current parent-side integration behavior remains the baseline until migration evidence exists. |
| Record parent closure | Parent component-builder and task-control | Cannot claim successful completion while any owned child build is not successfully complete. |

## Current-versus-target distinction

Current repository behavior remains authoritative until separately authorized migration work is accepted and validated. Current evidence includes task-control's existing descendant and concurrency limits and the fixture's current delegation and parent-integration rehearsals.

The rules in this artifact are target planning clarifications. Existing `maxConcurrentTasks` behavior, current parent-side integration, process exit, a child commit, telemetry, or a registry event do not by themselves prove:

- safe parallel admission of independent child components;
- atomic per-component serialization;
- successful child completion before parent completion; or
- the target child-owned integration flow.

## Pilot evidence to derive later

The later executable pilot plan for `validation-fixtures/dummy-delegation` must build or prototype the new structures before using them as candidate evidence. It should include at least:

1. two independent child component builds admitted in parallel;
2. two competing builds targeting one component, proving atomic rejection or queueing;
3. a dependency-linked child pair that is ordered rather than run concurrently;
4. a parent that remains non-completed while any owned child is active, blocked, awaiting approval, escalated, pending integration, failed, or cancelled;
5. successful parent completion only after every owned child is successfully completed and accounted for;
6. explicit parent terminal failure or cancellation accounting when a child cannot complete;
7. budget and reserve admission for parallel children;
8. recovery and release/reclaim behavior for interrupted component reservations; and
9. preserved unrelated and protected inputs during the child result flow.

These are evidence requirements for a later implementation task, not claims that the existing fixture already satisfies them.

## Review and execution gates

The exact draft of this clarification receives the transitional review requested for the parallel-child changes:

1. actual Sol review as the original architecture author and primary reviewer;
2. actual Kimi review as the transitional alternate reviewer;
3. Sol disposition of supported findings and, if needed, one preserved successor;
4. commit preparation only after explicit commit authorization;
5. compaction only after the handoff and continuity checklist identify the exact current artifact and next action;
6. derivation of the executable pilot plan;
7. human review and separate kick-off for that pilot plan;
8. exact task-control admission; and
9. implementation of the new structures before candidate-flow testing.

The transitional Sol/Kimi reviews are process evidence for this planning step only. Alternate-family review remains outside the permanent target-system contract.

## Acceptance conditions

This clarification is ready for the next planning step when review confirms that:

- parent and child mean component-building flows;
- independent child component builds may run in parallel only when safely admitted;
- no two builds may modify the same component at one time;
- successful parent completion waits for every owned child build to complete successfully;
- non-terminal, failed, or cancelled child work cannot be treated as successful parent completion;
- current behavior is not confused with target behavior; and
- the clarification does not authorize implementation or broaden the accepted envelope.

## Next safe action

Obtain the actual Sol and Kimi reviews of this exact clarification. Preserve the review results, update the continuity handoff, and stop for commit authorization or the next planning decision. `startsWork: false`.
