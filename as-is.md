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
  hitl:
    onBlocked: true
    onBudgetExceeded: true
    onExternalEffect: true
  logging:
    level: info
    retainDays: 30

task:
  status: completed
  updated: 2026-07-26T13:46:37Z
---

# as-is Project

## Current Task

Make the core task protocol and orchestration design host-neutral, reduce
duplicated component-boundary context, and define wall-clock constraint handling.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- Core policy and orchestration documents define no host-specific behavior.
- Component records derive their writable scope from the directory and do not
  duplicate file or input boundary lists.
- Component records include a host-observed cumulative wall-clock budget while
  retaining timestamps for checkpoint ordering and stale-work recovery.
- Deterministic maintenance scripts have a documented role distinct from skills
  and generative agent reasoning.

## Progress

- The earlier `structuring-content` rename is complete.
- The minimal execution envelope was defined and the configured `implementer`
  completed the generated `verification-discipline` component record.
- The parent exposed the new skill through the installed OpenCode wrapper's
  `.agents/skills` adapter and repaired its stale `structuring-content` link.
- Host-specific facts are being moved from the core design to an adapter document.
- The host-neutral protocol, deterministic-maintenance boundary, and version 2
  record schema are defined.

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
- Focused skills coordinate deterministic maintenance scripts; scripts contain
  repeatable validation or transformations. No generic maintenance script is
  added until Increment 2 has a concrete record-validation need.

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Constraint and wall-clock fields are declarative until Increment 2 provides
  deterministic record validation and Increments 4 and 5 provide runtime
  enforcement through the host-neutral contract and selected adapter.

## Validation

- `git diff --check` completed successfully.
- Fresh `opencode debug agent orchestrator` and `opencode debug agent
  implementer` runs load the revised directory-scope and wall-clock instructions.
- The host-neutral core design contains no OpenCode-specific behavior; the
  host-specific mapping is isolated in `opencode-adapter.md`.
- The version 2 protocol contains no `boundaries.files` or `boundaries.inputs`
  fields. The completed version 1 dogfood record remains valid under its
  historical schema.

## Result

- Added a version 2 component-record schema with cost and wall-clock allocation,
  consumption, reserve, and measurement-source fields.
- Made directory scope the default writable boundary and requirements the sole
  location for exceptional external dependencies.
- Moved host-specific facts to `opencode-adapter.md` and made the core policy,
  architecture, and implementation sequence host-neutral.
- Defined the phased constraint rollout: static deterministic validation in
  Increment 2, runtime contract in Increment 4, and host-adapter enforcement in
  Increment 5.
- Defined deterministic maintenance scripts as focused reusable mechanics behind
  skills, with the Increment 2 record validator as the first concrete need.

## Next Action

Implement the focused deterministic record-validation script for authority,
cost, wall-clock child-budget, and descendant-closure checks to finish Increment
2.
