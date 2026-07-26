# Component Task-Record Protocol

## Purpose

This permanent specification defines the durable `as-is.md` record for a
component with delegated work. The record preserves the component's bounded task
state and handoff evidence; it is not a log, lock, or copy of parent state.

## Placement And Hierarchy

Every component with delegated work has an `as-is.md` in that component's
directory. The directory path is authoritative for the component's scope and
parent relationship. Child records are the durable delegation and handoff
evidence; a parent need not maintain a duplicate child list, status ledger, or
result copy.

## Creation And Maintenance

The root `as-is.md` is authored project context. When the orchestrator delegates
work to a component directory that has no task record, it generates that
component's `as-is.md` atomically from this protocol before launching the worker.
It supplies the bounded requirement, effective constraints, cost allocation,
acceptance conditions, configured worker, and initial `ready` status. This
system-generated record is durable project context, not private generated runtime
state.

If a component record already exists, the orchestrator reuses it for the active
task or recovery and does not overwrite its durable progress. After launch, the
assigned worker maintains its component record; the orchestrator creates or
updates only the delegation information it is responsible for.

## Front Matter

The front matter is strict and machine-validatable:

```yaml
---
as-is-version: 1
task:
  status: ready
  worker: implementer
  updated: 2026-07-26T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: host-reported
  delegation:
    maximum-depth: 2
    maximum-children: 3
  boundaries:
    files: []
    inputs: []
  external-effects: require-current-turn-user-approval
acceptance:
  - Implement the bounded component result.
---
```

- `as-is-version`, `task.status`, `task.worker`, `task.updated`, `constraints`,
  and `acceptance` are required. Unknown core front-matter fields fail
  validation.
- `task.status` is one of `ready`, `active`, `blocked`,
  `awaiting-approval`, `completed`, `failed`, or `cancelled`.
- A new task begins as `ready`; a worker advances it to `active`; active work may
  become blocked, await approval, complete, fail, or be cancelled; blocked,
  approval-waiting, and failed work may return to active through recovery. A
  completed or cancelled record is replaced only when a new bounded task starts.
- `worker` identifies the configured agent used for normal execution and
  recovery. It is not a claim, a lease, a session identifier, or a guarantee
  that the same runtime instance will be available.
- `constraints.cost.allocated` is the component's maximum authorized real cost;
  `spent` is actual cost reported by the host or CLI; and `reserve` is retained
  for validation, recovery, and handoff. A component may not allocate more to
  children than its remaining allocation after its own spent cost and reserve.
  If the host cannot report real cost, the record names the fallback metric and
  never represents an estimate as actual cost. The worker updates `spent` at
  material checkpoints and before every handoff, block, escalation, or child
  delegation.
- `constraints.boundaries.files` and `constraints.boundaries.inputs` declare the
  component's intended mutable files and required inputs relative to its
  directory. The responsible orchestrator uses them, together with cost
  allocations, to determine whether siblings may run concurrently.
- Task-specific effective constraints belong in the record. Repository
  instructions, applicable design principles, and permitted skills are supplied
  centrally as read-only execution context and are not repeated as `sources` in
  every child record.

## Markdown Body

The body is human-readable durable task context and contains these sections:

```md
# Component Name

## Purpose
## Requirement
## Plan
## Progress
## Validation
## Result
## Blockers And Escalations
## Recovery
## Next Action
```

`Purpose` explains why the component exists and establishes its intended place
in the system; `Requirement` states its bounded current work. `Validation`
records the smallest relevant check, its outcome, and residual risk. A worker
validates before handing a component back as completed. `Recovery` records the
last durable checkpoint, incomplete work, cleanup required, and next safe action.
A material change additionally records the local pattern considered, concrete
need, acceptance condition, and changed-artifact set.

## Delegation And Parallelism

The responsible orchestrator may schedule siblings concurrently only after
verifying that their declared file, input, and budget boundaries are independent.
The parent later reads child records, composes their results, and performs any
required integration validation.

On interruption, the orchestrator rereads the component record and delegates it
to the configured worker. That worker decides whether to continue an atomic
partial result, clean it up, or start again.
