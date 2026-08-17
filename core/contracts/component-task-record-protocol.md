# Component Task-Record Protocol

**Contract collection:** [Core Contracts](index.md)

## Purpose

This permanent specification defines the machine-readable task metadata and human-readable task narrative used to change one bounded component directory. The local `task` object in the component's JSON companion holds one active task's machine metadata and the configured Markdown task file holds its human narrative; both are removed by task management after completion and its concise summary is retained in `changelog.md`. Task-record naming and defaults belong to the task-control consumer. The root companion may hold the root task object; component task objects remain local and never cascade.

## Placement And Hierarchy

A task targets one component directory. The directory path is the durable task and job identity, determines the task's scope and parent relationship, and is not repeated as mutable task metadata.

A component change is recorded through the local `task` object in its JSON companion and its transient configured Markdown narrative beside that companion by default. The JSON companion is the machine-readable task authority; the Markdown file is human-readable transient task context and evidence. Work that crosses into a separately owned child component uses a new bounded child task rather than editing across that boundary.

The task-control implementation owns task-record filename defaults, safe-basename validation, task discovery, and task metadata interpretation. Other consumers must not create a parallel task-record schema or silently reinterpret task fields.

## Creation And Maintenance

When work starts, task management creates or reuses the configured Markdown task narrative and its local JSON `task` object metadata before launch. It supplies the bounded requirement, effective constraints, cost allocation, wall-clock budget, acceptance conditions, configured worker, and initial `ready` status. If a task pair is incomplete, execution stops until the missing counterpart is restored from Git or history or a newly authorized task replaces both artifacts.

If a task record already exists, task management reuses it for active work or recovery and does not overwrite durable progress. The assigned worker maintains only its task evidence within the assigned component; the orchestrator creates or updates only the delegation information it owns.

## Task Metadata

The local JSON companion's `task` object is strict and machine-validatable:

```json
{
  "task": {
    "status": "ready",
    "worker": "implementer",
    "updated": "2026-07-26T00:00:00Z",
    "constraints": {
      "cost": { "currency": "USD", "allocated": 0.2, "spent": 0, "reserve": 0.04, "source": "host-reported" },
      "delegation": { "maximum-depth": 2, "maximum-children": 3 },
      "execution": { "wall-clock": { "allocated-seconds": 300, "spent-seconds": 0, "reserve-seconds": 60, "source": "host-reported" } },
      "external-effects": "require-current-turn-user-approval"
    },
    "acceptance": ["Implement the bounded component result."]
  }
}
```

- `task.status`, `task.worker`, `task.updated`, `task.constraints`, and `task.acceptance` are required. Unknown core task fields fail validation.
- `task.status` is one of `ready`, `active`, `blocked`, `awaiting-approval`, `completed`, `failed`, or `cancelled`.
- A permission gate uses the schema-compatible `awaiting-approval` status and records the exact durable permission state `awaiting-user-approval` in its execution checkpoint, together with the structured `permission-needed` event, approval scope, and user-visible escalation evidence. A transient prompt or host reply is not a durable answer.
- A new task begins as `ready`; a worker advances it to `active`; active work may become blocked, await approval, complete, fail, or be cancelled; blocked, approval-waiting, and failed work may return to active through recovery. A completed or cancelled record is replaced only when a new bounded task starts.
- `task.updated` is an RFC 3339 UTC timestamp recorded at each material status transition or durable checkpoint. It supports ordering, stale-work detection, recovery, and scheduled check-ins; it is neither execution-duration evidence nor a substitute for validation evidence.
- `worker` identifies the configured agent used for normal execution and recovery. It is not a claim, lease, session identifier, or guarantee that the same runtime instance remains available.
- A task incarnation has a durable opaque `task-revision`, and each new worker invocation within that revision has a one-based `attempt` ordinal. The stable observation key is `component-path/task-revision/attempt`. A runtime `JobId` is a private diagnostic alias and must not be required in current task context, used as public status authority, or required to recover the task.
- `constraints.cost.allocated` is the component's maximum authorized real cost; `spent` is actual cost reported by the host or CLI; and `reserve` is retained for validation, recovery, and handoff. A component may not allocate more to children than its remaining allocation after its own spent cost and reserve. If the host cannot report real cost, the task names the fallback metric and never represents an estimate as actual cost. The worker updates `spent` at material checkpoints and before every handoff, block, escalation, or child delegation.
- `constraints.delegation.maximum-depth` and `maximum-children` bound the descendant task tree for delegated implementation or component tasks. A parent may not create an implementation child when remaining depth is zero or when its direct-child count reaches the limit. Required read-only expert plan reviews, consultations, and final validations are serial validation calls rather than implementation-child fan-out: they do not consume an implementation-child slot, but each call requires explicit authority, terminal evidence, and its own recorded wall-clock/cost accounting. A validation call may not edit, delegate, or create a task descendant. If the host represents validation as a runtime child job, that diagnostic job must still be attributed and budgeted without changing task-tree limits.
- `constraints.execution.wall-clock.allocated-seconds` is the maximum cumulative wall-clock time authorized for the component. `spent-seconds` is the cumulative host-observed elapsed time across attempts, `reserve-seconds` is retained for validation, recovery, and handoff, and `source` identifies the observation. A component may not allocate more wall-clock time to children than its remaining allocation after its own spent time and reserve. A host uses a monotonic timer for an active attempt and records its observation at material checkpoints. If it cannot provide an observation, it records `source: unavailable` and does not claim automatic enforcement. Duration budgets are distinct from `task.updated`: duration limits work; timestamps order checkpoints and support stale-work recovery.
- Cost and wall-clock fields remain record-local for budget admission. A parent subtracts its own recorded spent use and retained reserve before checking child allocations; it does not add child actual use into its own `spent` fields. Child actual observations remain owned by the child path, and the control plane reports parent and child observations separately. A parent still accounts for failed or cancelled descendants in its completion result; that evidence is not a second accounting observation.
- Recovery checkpoints preserve cumulative observations for the current task path, revision, and attempt. A retry or recovery that starts a new worker invocation increments `attempt` and retains earlier observations. A supervisor re-observation of the same invocation updates the same key. A runtime `JobId` change never creates an attempt or resets use.
- Task-specific effective constraints belong in the task record. Repository instructions, design principles, reusable procedures, and other centrally supplied context are read-only execution inputs and are not repeated as task authority.

## Historical Recovery And Retirement

Current machine task authority remains in the root or component JSON companion's `task` object. The configured task-record file remains the human narrative and evidence companion. Historical task recovery uses Git history plus concise entries in the canonical sibling `changelog.md`; it does not use a `task-archives/` directory, a second task tree, or a separate host-specific historical path. Legacy YAML-front-matter task records are unsupported. Every task uses a JSON `task` object in its local companion and a front-matter-free Markdown narrative. Historical notes are succinct and never become task authority or duplicate verbose records or secrets.

Before removing historical material, the responsible orchestrator audits tracked, untracked, and ignored contents, current consumers, ownership, recovery or audit value, and cost to recreate. Git history does not preserve uncommitted content. Necessary timeless facts from an uncommitted artifact must be retained in the appropriate current durable record, while dated task facts belong in the concise history entry; otherwise an appropriately scoped evidence commit must be created before removal when authorized. A claim of byte-for-byte recovery is prohibited when no such commit exists.

The protocol has no `superseded` status. When a task is genuinely cancelled, use the terminal `cancelled` status and account for it in the nearest ancestor's result; when a completed implementation replaces an unlaunched or deferred task, record the supersession decision in the current record and history summary without manufacturing a completion transition. A retired host adapter is not recovered by restoring an archive folder; any future need requires a new authorized bounded task based on current policy and Git evidence.

## Companion/Narrative Recovery

Companion JSON and the configured task narrative are individually atomic writes, not one crash-atomic transaction. A present `task` object in the JSON companion without its configured narrative is an invalid blocked state: task execution must stop until the narrative is restored from Git or history or a newly authorized task replaces both artifacts. A narrative without a local `task` object has no task authority and must not be executed. Completion follows the same rule: do not claim completion after only one artifact is removed; restore the missing counterpart or finish the paired cleanup before handoff. This rule makes partial writes visible and recoverable without pretending they are atomic.

## Transient Task Body

The transient configured Markdown task narrative is human-readable current task context and contains these sections:

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

`Requirement` states the bounded work. `Validation` records the smallest relevant check, its outcome, and residual risk. `Recovery` records the last durable checkpoint, incomplete work, cleanup required, and next safe action. A material change additionally records the local pattern considered, concrete need, acceptance condition, and changed-artifact set. Repeated task fields, ownership, status, and acceptance mappings should use Markdown tables; prose is reserved for rationale and relationships.

## Delegation And Parallelism

The responsible orchestrator may schedule siblings concurrently only after verifying that their component directories are independent, no requirement names another active sibling as an external dependency, and their cost and wall-clock allocations fit the available parent budget. The parent later reads child records, composes their results, and performs any required integration validation.

A terminal child has status `completed`, `failed`, or `cancelled`. A parent may become `completed` only when every descendant is terminal, its own acceptance conditions are satisfied, and its result explicitly accounts for every failed or cancelled descendant. An active, blocked, or awaiting-approval descendant keeps every ancestor non-completed. The responsible worker or orchestrator validates this closure before changing a record to `completed`.

At task start, task management commits one task-start handoff containing the selected backlog status and the active JSON task metadata plus configured Markdown narrative. After validation qualifies completion, task management and `committing-completed-work` prepare a second completion handoff. The completion procedure stages the completed task's declared scoped changes, concise owning `changelog.md` summary, exact evidence-gated backlog-row removal, and cleanup of configured task metadata and the transient task file together. There must be no separate task-deletion-only or backlog-clearance-only commit. The changelog summary is written before backlog eligibility is evaluated, and its exact identity evidence is included in the second completion commit. A failed or interrupted first handoff preserves the selected backlog and active task pair. A failed or interrupted completion preserves or restores the terminal task, task artifacts, and unreconciled backlog row for recovery; it must not claim cleanup from an uncommitted working-tree mutation. Unrelated work remains untouched.

On interruption, the orchestrator rereads the task record and delegates it to the configured worker. That worker decides whether to continue an atomic partial result, clean it up, or start again.

## Recovery Evidence

Recovery uses the existing body sections rather than private runtime state or a new history field. For each recovery attempt, the responsible orchestrator records in `Progress` or `Recovery`:

- the attempt ordinal and durable reason, including the source-labelled stale observation when applicable;
- the configured worker identity and availability result;
- cumulative cost and wall-clock observations, remaining allocation, and retained reserve without resetting prior values;
- the backoff calculation and durable next action before another launch; and
- the checkpoint, validation result, cleanup boundary, and any named approval or replacement decision.

An unavailable configured worker remains a durable blocker until explicit direction or approval names a replacement. A replacement does not erase the original worker identity or its failed attempt. A host fallback or wrong-role return is not a replacement. Recovery never infers completion from process exit, a missing private runtime artifact, or an unlinked host result.

## Authority Boundary

This protocol owns task metadata, task narrative shape, task lifecycle, budget and delegation constraints, recovery evidence, descendant closure, and completion cleanup. It does not define component architecture, durable component-record structure, configuration namespaces, implementation defaults, host adapter behavior, or runtime observation semantics.
