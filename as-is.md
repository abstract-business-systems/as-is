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
  updated: 2026-07-26T14:31:00Z
---

# as-is Project

## Current Task

Select the documented OpenCode host adapter, map the host-neutral execution
contract to its bounded subprocess fallback, and validate one harmless child
component through delegation, notification/check-in, budget handling, durable
completion reporting, and transient runtime cleanup.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)
- [Host-Neutral Execution Contract](execution-contract.md)

## Acceptance Criteria

- Select the OpenCode adapter already documented in `opencode-adapter.md` and
  map all six operations in `execution-contract.md` without changing core
  policy or implementing Increment 6 recovery policy.
- Validate one harmless child-component task through the adapter, including
  delegation notification/check-in, budget handling, durable completion
  reporting, descendant closure, and cleanup of transient runtime artifacts.
- Preserve component-only initial context and record unavailable cost or
  wall-clock observations without presenting estimates as actual measurements.

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
- Increment 5 is handled at the root because adapter selection and lifecycle
  mapping are cross-cutting. The harmless validation task is delegated to the
  new `increment-5-dogfood` child because its README and task handoff have a
  distinct component boundary.
- The selected adapter is the documented bounded `opencode run` fallback. A
  host-managed child is not selected because this CLI does not expose reliable
  lifecycle cancellation and per-component usage observations.

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
- No Increment 5 blocker. Per-component actual cost and host-observed wall-clock
  use remain unavailable from this OpenCode adapter; records retain the
  unavailable source and do not present estimates as actual measurements.

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
- Residual risk before this increment: no host adapter or runtime execution
  path had exercised the contract; the bounded OpenCode dogfood below closes
  that gap, while host cost attribution remains unavailable.
- Increment 5 adapter mapping review: `opencode-adapter.md` maps all six
  lifecycle operations to bounded CLI invocations and durable record reads,
  preserving component-only worker context and deferring stale-task and
  replacement policy.
- Dogfood delegation notification/check-in: created
  `increment-5-dogfood/as-is.md` atomically in `ready`, emitted delegation from
  the durable parent transition, and observed the child worker checkpoint and
  completion through its record.
- Dogfood budget handling: child allocation was USD 0.10 with USD 0.02 reserve
  and 120 seconds with 30 seconds reserve, within the configured unit budget;
  cost and elapsed wall-clock observations remained unavailable from the host
  and were not represented as actual use.
- Dogfood completion: the child added only its local README, passed focused
  content validation and `git diff --check`, reached terminal `completed`, and
  had no descendants requiring closure accounting.
- Dogfood cleanup: the two private OpenCode session records created for the
  parent/child run were deleted after durable handoff; no project runtime
  artifact was retained. The durable child record and README remain.
- Validation limitation: the repository-wide Increment 2 validator is not a
  valid check for this mixed historical tree because it interprets host agent
  definitions and version-1 records as task records. The new child record was
  checked locally instead; no validator behavior was changed.

## Result

- Increment 5 is complete: the selected OpenCode fallback maps the host-neutral
  lifecycle contract and successfully exercised a harmless delegated child
  task with durable notification/check-in, budget evidence, completion, and
  cleanup. Increment 4's host-neutral lifecycle contract remains defined in
  `execution-contract.md` and linked from `orchestration-design.md`, while
  Increment 3's check-in and control semantics remain host-independent.
- Delegated task: `increment-5-dogfood`, record
  `increment-5-dogfood/as-is.md`, configured worker `implementer`, terminal
  `completed`, no descendants.

## Recovery

- Last durable checkpoint: Increment 5 child completion was reread, runtime
  sessions were cleaned, and adapter mapping was integrated.
- Incomplete work: none for Increment 5. Stale-task recovery, retry/backoff, and
  worker replacement remain intentionally deferred to Increment 6.
- Cleanup required: none; private sessions were deleted and durable outcomes
  remain in the records.
- Next safe action: commit this scoped root handoff and the child handoff; do
  not begin Increment 6 in this task.

## Next Action

Increment 5 is complete and ready for scoped handoff commits. No Increment 5
recovery action remains; Increment 6 is not part of this task.
