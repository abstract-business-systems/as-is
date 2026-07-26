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
  updated: 2026-07-26T14:12:02Z
---

# as-is Project

## Current Task

Define Increment 3 user check-ins and control without implementing a scheduler,
runtime notification transport, or host adapter.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- `orchestration-design.md` defines a configurable periodic check-in interval
  derived from durable task timestamps, without conflating it with execution
  budgets.
- The design defines immediate notifications for delegation, blocking, budget
  risk or exhaustion, completion, failure, cancellation, and approval-required
  external effects, with each event observable from durable task state.
- The design defines a query response containing active and delegated tasks,
  status, budget use and observation source, blockers, required decisions, and
  next check-in, without reading worker-private runtime state.
- The design defines bounded user control for direction, approval, and
  cancellation through the orchestrator, with durable status/checkpoint updates.

## Progress

- Increment 2 is complete and committed in `c19f45b` and `882f02d`.
- The root configuration now records Bun as the runtime and package-manager
  preference. This is a preference, not a constraint or an authorization to add
  dependencies without a component need.
- The root orchestrator will delegate the bounded primary-agent definition under
  `.agents` before integrating the root configuration and guidance changes.
- The configured implementer completed the `.agents` child handoff in
  `ddd9227` (`feat(agents): add as-is primary agent`).
- Increment 3 was handled at the root because its acceptance conditions are
  a cross-cutting durable design contract; no component implementation or child
  delegation is required.
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

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Actual component cost and host-observed wall-clock use remain unavailable from
  the current OpenCode adapter.
- No Increment 3 blocker. Runtime scheduling, notification delivery, and control
  enforcement are intentionally deferred to Increments 4 and 5.

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
  yet; those are explicit Increment 4/5 acceptance conditions.

## Result

- Increment 3 design is complete: periodic check-ins, material-event
  notifications, record-only query responses, and bounded user controls are
  defined in `orchestration-design.md` and this current task context.
- No delegated task IDs or component handoffs exist for Increment 3 because the
  smallest satisfying change is at the root design/configuration boundary.

## Recovery

- Last durable checkpoint: Increment 3 requirements and design contract recorded
  at the root; no child task is active.
- Incomplete work: none for this increment. Runtime implementation remains
  intentionally deferred.
- Cleanup required: none.
- Next safe action: begin Increment 4 from the host-neutral execution-contract
  requirements in `orchestration-design.md`.

## Next Action

Begin Increment 4 from the host-neutral execution-contract requirements in
`orchestration-design.md`; no Increment 3 recovery action remains.
