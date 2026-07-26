---
asIsVersion: 1

config:
  tasks:
    unitBudget:
      wallClockSeconds: 300
      costUsd: 0.20
  scheduling:
    wakeSeconds: 60
    maxConcurrentTasks: 1
    retryBackoffSeconds: 300
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
  updated: 2026-07-26T14:09:10Z
---

# as-is Project

## Current Task

Add a clean user-facing primary agent and project technology preferences before
beginning Increment 3.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- A primary `as-is` agent keeps the user-facing chat focused on intent, status,
  and delegation rather than implementation details.
- Project technology preferences are centrally available during foundation work
  without becoming mandatory constraints.
- The initial preference directs new foundations to use Bun as runtime and
  package manager when it fits the component requirement and existing patterns.

## Progress

- Increment 2 is complete and committed in `c19f45b` and `882f02d`.
- The root configuration now records Bun as the runtime and package-manager
  preference. This is a preference, not a constraint or an authorization to add
  dependencies without a component need.
- The root orchestrator will delegate the bounded primary-agent definition under
  `.agents` before integrating the root configuration and guidance changes.
- The configured implementer completed the `.agents` child handoff in
  `ddd9227` (`feat(agents): add as-is primary agent`).

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

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Actual component cost and host-observed wall-clock use remain unavailable from
  the current OpenCode adapter.

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

## Result

- Added the user-facing `as-is` primary agent. It summarizes durable status and
  results, while delegating substantive bounded work to `orchestrator`.
- Selected `as-is` as the OpenCode default agent and recorded the host-specific
  mapping without changing the orchestrator's durable-record authority.
- Added root `config.technology-preferences` with Bun as the preferred runtime
  and package manager, and made that preference centrally available for
  foundation work through repository guidance.

## Next Action

Begin Increment 3 only after recording its bounded check-in and control
requirements in this root task context.
