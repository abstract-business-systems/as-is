# Kick-off decision brief — first task-control slice

## Decision requested

Should the user authorize preparation of one bounded implementation task for the unaffected `core/modules/task-control` slice described by accepted executable realization plan Draft 6?

This is a **kick-off decision for task preparation and exact admission only**. It is not implementation authorization.

Choices: **authorize preparation**, **request changes**, **defer**, or **decline**.

## Controlling plan

- Accepted plan: `drafts/agentic-development-system-executable-realization-plan-draft6.md`
- Accepted-plan SHA-256: `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`
- Human acceptance: `reviews/agentic-development-system/executable-realization-plan-draft6-human-review-acceptance.md`
- Construction flows: accepted coding/application and agents/skills flow plans remain applicable; no provider-backed execution is proposed.
- Planning-only status: `startsWork: false`

## Proposed first slice

Prepare a root-owned bounded task hierarchy whose only implementation descendant is the `core/modules/task-control` branch:

```text
root as-is parent task
└── core child task
    └── core/modules child task
        └── core/modules/task-control child task
```

The implementation child would cover the candidate task-control structures and focused checks for:

- deterministic plan-envelope readiness and admission results;
- dependency classification and independence invalidation facts;
- atomic per-component and parent-allocation reservations;
- release, stale-owner recovery, and orphan handling; and
- fail-closed parent-closure evaluation using integration evidence as an input.

The exact changed-artifact set, task-record locations, worker, capabilities, budgets, dependencies, protected inputs, acceptance mapping, recovery, and stop conditions must be prepared by task management and independently admitted by task-control. No task record exists yet.

## Explicitly excluded from this kick-off

- `core/adapters/process` child-result application or any expansion of process-adapter responsibility;
- Git/worktree integration, stale-base or conflict application, and integration locking;
- `validation-fixtures/dummy-delegation` candidate-flow implementation or end-to-end proof;
- provider execution, external network effects, setup, distribution, or benchmark work;
- changes to current `as-is.md`, task, agent, skill, adapter, fixture, or configuration contracts unless a later exact task declares and separately authorizes a compatible durable-record update;
- target-contract adoption, migration, retirement, commit, or merge; and
- any implementation descendant outside the named root → core → core/modules → task-control hierarchy.

Existing process, task-control, launcher, and fixture tests may later be used as baseline regression evidence only. They do not become candidate evidence without the new candidate structures and their focused checks.

## Required preparation gates after kick-off

If authorized, the next actions are:

1. Task management prepares the exact root and nested component task pairs before launch, preserving current task-record protocol and component ownership.
2. The preparation names accountable holders and exact configured worker/model facts without inventing unavailable identities; Luna is the construction-time coding responsibility and Terra remains the planner/adviser, subject to gate-time selection.
3. The task records define bounded cost and wall-clock allocations with retained reserves, protected inputs, dependency ordering, recovery, escalation, acceptance, deterministic validation, and explicit non-goals.
4. Task management records the task-start handoff in a scoped documentation checkpoint.
5. Task-control independently admits each applicable task. No worker launches and no implementation begins before admission.
6. After implementation, deterministic checks and any risk-triggered independent result review remain separate gates; candidate fixture exercise remains blocked until its prerequisites pass.

An unavailable worker, missing holder, unsupported capability, contradictory record, or insufficient budget remains a blocker. It does not authorize a substitute or broaden the slice.

## Authority and residual risk

This brief does not create tasks, alter current records, select exact workers or model IDs, authorize implementation, or resolve the deferred process-adapter ownership question. The reduced slice cannot prove child-result application, integration locking, stale-base/conflict recovery, or the complete fixture flow; parent closure must remain fail-closed when integration evidence is absent.

`startsWork: false`
