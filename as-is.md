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
  updated: 2026-07-26T13:50:42Z
---

# as-is Project

## Current Task

Correct the maintenance model by defining and exposing a component-maintenance
skill rather than treating maintenance as a deterministic-script layer.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- `maintaining-components` provides a bounded, reusable component-housekeeping
  and improvement procedure.
- The maintenance model preserves intentionally generative work and replaces a
  nondeterministic flow only when evidence and acceptance conditions justify it.
- Architecture and skill guidance no longer describe maintenance as a generic
  deterministic-script layer.

## Progress

- The earlier `structuring-content` rename is complete.
- The minimal execution envelope was defined and the configured `implementer`
  completed the generated `verification-discipline` component record.
- The parent exposed the new skill through the installed OpenCode wrapper's
  `.agents/skills` adapter and repaired its stale `structuring-content` link.
- The prior host-neutral and version 2 protocol work is complete.
- The maintenance distinction is being corrected before the next validator task.

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

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Constraint and wall-clock fields are declarative until Increment 2 provides
  deterministic record validation and Increments 4 and 5 provide runtime
  enforcement through the host-neutral contract and selected adapter.

## Validation

- `git diff --check` completed successfully.
- Fresh `opencode debug skill` discovery lists `maintaining-components` from its
  `.agents/skills` adapter.
- The core guidance contains no remaining deterministic-maintenance-script
  policy; it defines component maintenance as an operational skill.

## Result

- Added `maintaining-components`, a bounded housekeeping and improvement skill
  that composes existing focused skills and validation.
- Replaced the script-centric maintenance interpretation in the design
  principles, skills architecture, and orchestration design.
- Recorded that deterministic replacements need concrete correctness, cost,
  recovery, or repeatability evidence; intentionally generative work remains
  valid when it serves the component.

## Next Action

Implement focused deterministic validation for authority, cost, wall-clock
child-budget, and descendant-closure checks to finish Increment 2.
