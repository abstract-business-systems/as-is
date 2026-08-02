# Component Task-Record Protocol

## Purpose

This permanent specification defines the durable `as-is.md` component record
and the transient task record used to change a component. An `as-is.md` describes
the component's purpose, design, boundary, and related artifacts. A component-level
`tasks.md` records one active bounded change and is removed by task management
after completion; its concise summary is retained in `changelog.md`. The filename
is configurable through `config.records.filenames.task`; `tasks.md` is the
repository default.

## Placement And Hierarchy

Every component has an `as-is.md` in its directory. It describes the
component's purpose and design and links to, and briefly describes, relevant
files and folders. The directory containing `as-is.md`, together with descendants
that do not contain their own `as-is.md`, is one component boundary. The directory
path is authoritative for the component's scope and parent relationship.

A component change is recorded in a transient `tasks.md` beside `as-is.md` by
default. If
work must cross into a subcomponent with its own `as-is.md`, the component builder
delegates a new component-builder task for that subcomponent rather than editing
across the boundary.

When a bounded document later becomes a directory, use the host pattern
`<xyz>.md -> <xyz>/index.md` for the authoritative entry point. Place extracted
section files beside that index and link them from a `Links` section in the
index or root `as-is.md` entry point so the entry point stays authoritative
without duplicating the extracted content.

## Creation And Maintenance

The root and component `as-is.md` files are durable component context. They
describe purpose, design, boundaries, and links; they do not contain the current
task's transient status, budget, plan, or recovery state. When work starts, task
management creates the configured task-record filename atomically in the target
component directory. When the orchestrator delegates
work to a component directory that has no task record, it generates that
component's `as-is.md` atomically from this protocol before launching the worker.
It supplies the bounded requirement, effective constraints, cost allocation,
wall-clock budget, acceptance conditions, configured worker, and initial `ready`
status. This system-generated record is durable project context, not private
generated runtime state.

If a component record already exists, the orchestrator reuses it for the active
task or recovery and does not overwrite its durable progress. After launch, the
assigned worker maintains its component record; the orchestrator creates or
updates only the delegation information it is responsible for.

## Task Front Matter

The transient configured task-record file (default `tasks.md`) front matter is
strict and machine-validatable:

```yaml
---
as-is-version: 2
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
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: host-reported
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
- A permission gate uses the schema-compatible `awaiting-approval` status and
  records the exact durable permission state `awaiting-user-approval` in its
  execution checkpoint, together with the structured `permission-needed` event,
  approval scope, and user-visible escalation evidence. This preserves strict
  front-matter validation while distinguishing a permission decision from a
  generic question. A transient prompt or host reply is not a durable answer.
- A new task begins as `ready`; a worker advances it to `active`; active work may
  become blocked, await approval, complete, fail, or be cancelled; blocked,
  approval-waiting, and failed work may return to active through recovery. A
  completed or cancelled record is replaced only when a new bounded task starts.
- `task.updated` is an RFC 3339 UTC timestamp recorded at each material status
  transition or durable checkpoint. It supports ordering, stale-work detection,
  recovery, and scheduled check-ins; it is neither execution-duration evidence
  nor a substitute for validation evidence. The root authored record may retain
  additional project configuration, but uses the same timestamp meaning for its
  current task.
- `worker` identifies the configured agent used for normal execution and
  recovery. It is not a claim, a lease, a session identifier, or a guarantee
  that the same runtime instance will be available.
- The component's canonical repository-relative path is the durable task and
  job identity. A task incarnation has a durable `task-revision`, and each new
  worker invocation within that revision has a one-based `attempt` ordinal.
  The stable observation key is `component-path/task-revision/attempt`;
  `task.updated` remains a mutable checkpoint/staleness marker, not an
  accounting identity. A runtime `JobId` is a private diagnostic alias and
  must not be required in current task context, used as public status authority,
  or required to recover the record.
- `constraints.cost.allocated` is the component's maximum authorized real cost;
  `spent` is actual cost reported by the host or CLI; and `reserve` is retained
  for validation, recovery, and handoff. A component may not allocate more to
  children than its remaining allocation after its own spent cost and reserve.
  If the host cannot report real cost, the record names the fallback metric and
  never represents an estimate as actual cost. The worker updates `spent` at
  material checkpoints and before every handoff, block, escalation, or child
  delegation.
- `constraints.execution.wall-clock.allocated-seconds` is the maximum cumulative
  wall-clock time authorized for the component. `spent-seconds` is the cumulative
  host-observed elapsed time across attempts, `reserve-seconds` is retained for
  validation, recovery, and handoff, and `source` identifies the observation. A
  component may not allocate more wall-clock time to children than its remaining
  allocation after its own spent time and reserve. A host uses a monotonic timer
  for an active attempt and records its observation at material checkpoints. If
  it cannot provide an observation, it records `source: unavailable` and does
  not claim automatic enforcement. This duration budget is distinct from
  `task.updated`: duration limits work; the timestamp orders durable checkpoints
  and supports stale-work recovery.
- Cost and wall-clock fields remain record-local for budget admission. A parent
  subtracts its own recorded spent use and retained reserve before checking
  child allocations; it does not add child actual use into the parent's
  `spent` fields. Child actual observations remain owned by the child path, and
  the control plane reports parent and child observations separately. A parent
  still accounts for failed or cancelled descendants in its completion result;
  that evidence is not a second resource observation.
- Recovery checkpoints preserve cumulative observations for the current task's
  path/revision/attempt keys. A retry or recovery that starts a new worker
  invocation increments `attempt`; a supervisor re-observation of the same
  invocation updates one key. Runtime JobIds may be retained as source-labelled
  diagnostics, but a JobId change never creates an attempt or resets use.
- Concise historical notes stay succinct by default. The canonical name for
  that section is `Changelog`; only the smallest necessary concise history
  belongs in the current root or component `as-is.md` when that record is the
  smallest coherent authoritative home. `Changelog` is historical overview,
  not current-task authority, an archive, or a runtime log. Project-specific
  verbosity controls how much is retained, but it does not create another
  authority or a second current-task record.
- The component directory is the default read/write boundary. `as-is.md` links
  relevant artifacts instead of duplicating their contents. The `Requirement` names an external dependency
  only when work must read outside that directory; it does not duplicate common
  execution context.
- Version 1 records retain the historical `constraints.boundaries` block and are
  interpreted by the version 1 schema. Version 2 removes that block and adds the
  wall-clock resource. Validators select the schema from `as-is-version`; a
  completed historical record is not rewritten solely to adopt a newer schema.
- Task-specific effective constraints belong in the record. Repository
  instructions, applicable design principles, and permitted skills are supplied
  centrally as read-only execution context and are not repeated as `sources` in
  every child record.

## Historical Recovery And Retirement

Current task authority remains in the root or component configured task-record
file (default `tasks.md`). Historical
task recovery uses Git history plus the repository's concise history entries;
it does not use a `task-archives/` directory, a second task tree, or a separate
host-specific recovery path. Historical notes are succinct by default and use the canonical `Changelog`
heading. A small retained `Changelog` may live in `as-is.md` when that record
is the smallest coherent authoritative home; it is never a parallel task
authority. Project-specific verbosity configuration, such as
a repository logging setting in `docs/configuration.md`, controls how much detail
is retained in the history entry, but only within its historical-overview role;
it is not task authority and must not duplicate verbose records or secrets.

Before removing historical material, the responsible orchestrator audits
tracked, untracked, and ignored contents, current consumers, ownership,
recovery/audit value, and cost to recreate. Git history does not preserve
uncommitted content. Necessary concise facts from an uncommitted artifact must
be retained in the current record or the concise history entry, or an
appropriately scoped evidence commit must be created before removal when
authorized. A claim of byte-for-byte recovery is prohibited when no such commit
exists.

The protocol has no `superseded` status. When a task is genuinely cancelled,
use the terminal `cancelled` status and account for it in the nearest ancestor's
result; when a completed implementation replaces an unlaunched or deferred
task, record the supersession decision in the current record and history summary
without manufacturing a completion transition. A retired host adapter is not
recovered by restoring an archive folder; any future need requires a new
authorized bounded task based on current policy and Git evidence.

## Component Record Body

The durable `as-is.md` body describes the component's purpose, design, links, and
concise `Changelog`; it does not contain transient task state.

## Transient Task Body

The transient configured task-record body is human-readable current task context and contains these sections:

```md
# Task

## Requirement
## Plan
## Progress
## Validation
## Result
## Blockers And Escalations
## Recovery
## Next Action
```

`Purpose` and `Design` belong to durable `as-is.md`; `Requirement` states the
transient task's bounded work. `Validation` records the smallest relevant check,
its outcome, and residual risk. A worker validates before handoff. `Recovery`
records the last durable checkpoint, incomplete work, cleanup required, and next
safe action. A material change additionally records the local pattern
considered, concrete need, acceptance condition, and changed-artifact set.
Repeated task fields, ownership, status, and acceptance mappings should use
Markdown tables; prose is reserved for rationale and relationships.

## Delegation And Parallelism

The responsible orchestrator may schedule siblings concurrently only after
verifying that their component directories are independent, no requirement names
another active sibling as an external dependency, and their cost and wall-clock
allocations fit the available parent budget.
The parent later reads child records, composes their results, and performs any
required integration validation.

A terminal child has status `completed`, `failed`, or `cancelled`. A parent may
become `completed` only when every descendant is terminal, its own acceptance
conditions are satisfied, and its result explicitly accounts for every failed or
cancelled descendant. An active, blocked, or awaiting-approval descendant keeps
every ancestor non-completed. The responsible worker or orchestrator validates
this closure before changing a record to `completed`.

After a task qualifies for completion, invoke task management, then
`committing-completed-work`. The procedure stages only the completed task's
declared scoped changes and its task record, cleans up and removes the configured
transient task file after all tasks in the record qualify for completion, then
commits the durable handoff, and
leaves unrelated work untouched. A failed commit leaves the task non-completed
and records the failure for recovery.

On interruption, the orchestrator rereads the component record and delegates it
to the configured worker. That worker decides whether to continue an atomic
partial result, clean it up, or start again.

## Recovery Evidence

Recovery uses the existing body sections rather than private runtime state or a
new front-matter history field. For each recovery attempt, the responsible
orchestrator records in `Progress` or `Recovery`:

- the attempt ordinal and durable reason, including the source-labelled stale
  observation when applicable;
- the configured worker identity and availability result;
- cumulative cost and wall-clock observations, remaining allocation, and
  retained reserve without resetting prior values;
- the backoff calculation and durable next action before another launch; and
- the checkpoint, validation result, cleanup boundary, and any named approval
  or replacement decision.

An unavailable configured worker remains a durable blocker until explicit
direction or approval names a replacement. A replacement does not erase the
original worker identity or its failed attempt. A host fallback or wrong-role
return is not a replacement. Recovery never infers completion from process
exit, a missing private runtime artifact, or an unlinked host result.
