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
  updated: 2026-07-26T14:00:03Z
---

# as-is Project

## Current Task

 Finish Increment 2 by making component-record authority, resource-budget, and
 descendant-closure invariants deterministically verifiable.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- A local deterministic validator checks version 2 component records and their
  directory-derived task trees.
- The validator rejects weakened authority constraints, child cost or wall-clock
  allocations beyond the parent remainder, and invalid completed-descendant
  closure.
- Focused automated evidence covers valid and invalid trees, while the earlier
  bounded `verification-discipline` task remains the completed dogfood handoff
  for the minimal execution envelope.

## Progress

- The earlier `structuring-content` rename, minimal execution-envelope dogfood,
  host adapter exposure, host-neutral contract, version 2 protocol, and
  maintenance-model correction are complete.
- Created and delegated `schemas/task-record-validator/as-is.md` with the root
  unit allocation (USD 0.20 and 300 seconds), unavailable host measurements,
  no child delegation, and bounded acceptance conditions.
- Its configured implementer completed and committed the validator handoff as
  `c19f45b` (`feat(schemas): add task record validator`).

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

## Blockers

- Per-component actual cost is not available from the current OpenCode adapter;
  task records retain the fallback metric and do not present estimates as actual
  cost.
- Cost remains unavailable per component from the current OpenCode adapter, so
  `spent` remains a non-estimated zero and the validator cannot verify actual
  measurement provenance beyond the declared record fields.
- Runtime enforcement remains deferred to Increments 4 and 5; this increment
  provides static validation only.

## Validation

- Child observation: `python3 -m unittest -v test_task_record_validator.py`
  passed all six focused cases: valid tree, weakened external effects, weakened
  delegation, cost and wall-clock exhaustion, non-terminal descendant, and
  unaccounted failed descendant.
- Integration observation: `python3 task_record_validator.py .` printed
  `VALID`, and `python3 -m py_compile task_record_validator.py
  test_task_record_validator.py` completed successfully in the component.
- Orchestrator observation: the child record is `completed`, its only changed
  artifacts are committed in `c19f45b`, and it has no descendants. The root is
  therefore eligible for completion with no failed or cancelled descendants to
  account for.
- Residual risk: the intentionally small dependency-free YAML parser rejects
  legal YAML features outside the documented protocol subset; focused tests do
  not cover very large or adversarial directory trees.

## Result

- Added `schemas/task-record-validator`, a dependency-free deterministic local
  validator, six focused unittest fixtures, and component-local usage guidance.
- The validator rejects the required authority, resource-allocation, and
  completed-descendant violations, and accepts the documented valid task tree.
- Increment 2 is complete: common execution context and bounded delegation were
  defined and dogfooded previously; static validation now supplies its remaining
  deterministic enforcement evidence.

## Next Action

 Begin Increment 3 only after recording its bounded check-in and control
 requirements in this root task context.
