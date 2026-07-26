---
asIsVersion: 1

config:
  tasks:
    unitBudget:
      wallClockSeconds: 300
      costUsd: 0.20
  scheduling:
    wakeSeconds: 60
    checkInSeconds: 300
    maxConcurrentTasks: 1
    retryBackoffSeconds: 300
  notifications:
    materialEvents: true
  agents:
    defaultRole: implementer
  technology-preferences:
    runtime: bun
    package-manager: bun
  hitl:
    onBlocked: true
    onBudgetExceeded: true
    onExternalEffect: true
  logging:
    level: info
    retainDays: 30

task:
  status: completed
  updated: 2026-07-26T14:16:54Z
---

# as-is Project

## Current Task

Define Increment 4's host-neutral execution contract for launching, resuming,
observing, questioning, cancelling, and recovering workers without selecting or
implementing a host adapter, runtime scheduler, or adapter behavior.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)
- [Host-Neutral Execution Contract](execution-contract.md)

## Acceptance Criteria

- `execution-contract.md` defines host-neutral launch, resume, observation,
  question, cancellation, and recovery operations around the component task
  record.
- The contract supplies the worker its component task record plus central
  read-only execution context, without duplicating repository-wide context or
  making private runtime state authoritative.
- Each lifecycle operation has durable state/checkpoint, result, observation,
  question, cancellation, and recovery semantics that satisfy the existing
  task-record protocol, including descendant closure and budget evidence.
- The contract leaves host selection, transport, session/process behavior,
  scheduling, retry/backoff policy, and measurement implementation to later
  increments and adds no host-specific policy.

## Progress

- Increment 2 is complete and committed in `c19f45b` and `882f02d`.
- Increment 3 is complete and committed in `ed952de`.
- The root configuration now records Bun as the runtime and package-manager
  preference. This is a preference, not a constraint or an authorization to add
  dependencies without a component need.
- The root orchestrator will delegate the bounded primary-agent definition under
  `.agents` before integrating the root configuration and guidance changes.
- The configured implementer completed the `.agents` child handoff in
  `ddd9227` (`feat(agents): add as-is primary agent`).
- Increment 4 is handled at the root because its acceptance conditions span the
  orchestrator lifecycle and component task-record protocol. No child
  component owns this cross-cutting contract, so no child record or delegation
  is required.
- Added the minimal effective configuration surface: `config.scheduling.checkInSeconds`
  and `config.notifications.materialEvents`. The design records why these are
  needed and keeps enforcement for later increments.

## Decisions

- Constraint declarations are introduced now in the task protocol. Increment 2
  adds deterministic static validation; Increment 4 defines host-neutral runtime
  enforcement; and a selected host adapter implements that enforcement in
  Increment 5.
- `task.updated` remains necessary: a wall-clock budget controls cumulative
  runtime, while a timestamp orders durable checkpoints and supports stale-work
  recovery. Neither substitutes for validation evidence.
- Component directory scope is the default writable boundary. External reads are
  named only as exceptions in the bounded requirement, avoiding duplicate file,
  input, and universal-context declarations.
- `maintaining-components` is an operational skill, not a generic script layer.
  It composes focused skills and validation within a bounded component task.
- Deterministic static validation belongs in the local
  `schemas/task-record-validator` component. It checks record structure and
  tree invariants but does not claim host runtime enforcement.
- Technology preferences guide foundation choices only. A component follows an
  applicable higher-authority requirement and established local pattern first;
  a material departure from a preference is recorded with its reason.
- Check-in timing is a durable observation schedule, not a worker execution
  budget. `task.updated` plus the configured interval derives the next due time.
- Material events are reported from durable transitions and state fields rather
  than a new private event log, preserving recovery through task records alone.
- Query responses expose only root and component task records. Unavailable host
  measurements remain unavailable and are never represented as zero or as an
  estimate.
- User direction, approval, and cancellation are orchestrator-routed controls;
  queries are read-only and controls cannot weaken higher-authority constraints.
- The lifecycle contract is normalized around the component record and keeps
  host handles, sessions, processes, transports, scheduling, retry policy, and
  measurement implementation outside the core. Launch, resume, observe,
  question, cancel, and recover return durable observations; runtime state is
  supplementary and non-authoritative.

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Actual component cost and host-observed wall-clock use remain unavailable from
  the current OpenCode adapter.
- No Increment 4 blocker. Host selection, runtime scheduling, adapter mapping,
  and concrete recovery policy remain intentionally deferred to Increments 5
  and 6.

## Validation

- Child observation: a fresh `opencode agent list` process discovered `as-is`
  as a primary agent with task delegation allowed and web access denied; its
  component-local whitespace and descendant-closure checks passed.
- Integration observation: the `.agents` child record is `completed`, has no
  descendants, and its scoped handoff is committed in `ddd9227`.
- Integration observation: a fresh `opencode agent list` process recognized
  `as-is` as a primary agent after the configuration change; a JSON assertion
  confirmed `.opencode/opencode.json` retains its schema and sets
  `default_agent` to `as-is`.
- Residual risk: existing interactive OpenCode sessions retain their startup
  configuration and must be restarted before they select the new default.
- Structural review: the Increment 3 contract was checked against the existing
  task-record fields and orchestration sequence. It uses `task.updated`, status,
  budget, blockers, approval, result, and next-action state rather than adding a
  runtime artifact or host-specific rule.
- Scope review: no component records were created or changed; no descendant
  work was needed. `git diff --check` passed for the documentation changes.
- Residual risk: no runtime scheduler or host notification observation exists
  yet; those remain later host/runtime work.
- Increment 4 contract review: `execution-contract.md` defines all six
  lifecycle actions, component-record-only worker context, durable state and
  revision rules, source-labelled observations, question/approval handling,
  cancellation, and recovery handoff without host-specific policy.
- Static documentation check: `git diff --check` passed for the changed
  specifications and root record.
- Residual risk: no host adapter or runtime execution path has exercised the
  contract; that is intentionally Increment 5 work.

## Result

- Increment 4 is complete: the host-neutral lifecycle contract is defined in
  `execution-contract.md` and linked from `orchestration-design.md`, while
  Increment 3's check-in and control semantics remain host-independent.
- No delegated task IDs, child records, or component handoffs exist for
  Increment 4 because the smallest satisfying change is at the root
  cross-cutting design boundary.

## Recovery

- Last durable checkpoint: Increment 4 lifecycle contract and root integration
  review recorded; no child task is active.
- Incomplete work: none for this increment. Host adapter and runtime behavior
  remain intentionally deferred.
- Cleanup required: none.
- Next safe action: select and implement a host mapping only under Increment 5
  after this scoped handoff is committed.

## Next Action

Increment 4 is complete and ready for its scoped root handoff commit. Begin
Increment 5 only by selecting a host adapter; no Increment 4 recovery action
remains.
