# Host-Neutral Execution Contract

## Purpose

This specification defines the host-neutral boundary between the orchestrator
and a worker runtime. It describes how the orchestrator launches, resumes,
observes, questions, cancels, and recovers a worker while keeping policy and
durable authority in the filesystem task record. A host adapter maps this
contract to its own sessions, processes, permissions, and measurement APIs; it
does not redefine the contract.

## Authority And Context

- The component `as-is.md` is the authoritative input and output for the
  bounded task. The orchestrator supplies the worker that record plus the
  centrally supplied repository instructions, applicable design principles,
  and permitted skills.
- The worker receives the component record, not a copied root record, a
  repository-wide prompt, or a private runtime snapshot. The record's
  `Requirement` names any necessary external dependency explicitly.
- The effective configuration and higher-authority constraints are normalized
  before launch and remain stable for an attempt. A worker or host cannot
  silently change authorization, budgets, status semantics, or the active
  configuration snapshot.
- The component directory is the default worker read/write boundary. The
  worker may update its own record and declared component artifacts; the
  orchestrator owns parent integration and delegation state.
- Runtime handles, leases, prompts, caches, logs, and secrets are private host
  state. They may support an active attempt or recovery, but they are not
  required inputs to resume and are never authoritative over the task record.

## Contract Shape

Each operation has a normalized request and result. The names below describe
concepts, not a required serialization format or host API.

An `ExecutionRequest` contains:

- `operation`: one of `launch`, `resume`, `observe`, `question`, `cancel`, or
  `recover`;
- `component`: the filesystem component path and its task-record path;
- `record-revision`: the durable record revision or equivalent freshness
  marker observed by the orchestrator;
- `record`: the component task record supplied as the worker's task-specific
  context for `launch`, `resume`, and `recover`;
- `configuration`: the normalized effective configuration and constraints for
  this attempt, excluding secrets and host-specific settings;
- `input`: operation-specific direction, question, cancellation reason, or
  recovery reason, when applicable;
- `budget`: the remaining authorized cost and wall-clock allocation, including
  reserve handling from the task record; and
- `return-condition`: the durable state or checkpoint the operation must
  report before returning.

An `ExecutionResult` contains:

- `outcome`: `started`, `progressed`, `waiting`, `completed`, `failed`,
  `cancelled`, `unavailable`, or `rejected`;
- `record-observation`: the latest durable task status, `task.updated`,
  progress/checkpoint, budget observations, blockers, decisions, result, and
  next action observed after the operation;
- `runtime-observation`: optional host-provided lifecycle and usage facts,
  clearly identified by source; unavailable values remain unavailable;
- `question`: a durable question or decision request when the worker cannot
  safely continue without input; and
- `recovery`: the safe next action and whether private runtime state may be
  discarded, retained, or is required for the next attempt.

The result is an observation and handoff, not permission to infer success from
process exit, an absent host handle, or a missing private runtime artifact.
The orchestrator rereads the durable record before interpreting the result and
must reject a stale result that would overwrite a newer checkpoint.

## Lifecycle Operations

### Launch

`launch` is valid only for a `ready` record whose allocation and authority have
been checked. The orchestrator creates a missing component record atomically
before this operation and supplies the record directly to the worker. The
worker advances the record to `active`, records its checkpoint, and begins one
bounded attempt. A launch result must identify whether the worker started,
was rejected, or became unavailable; it must not claim completion without the
durable completed record and validation evidence.

Launch does not prescribe a process, session, transport, model, tool set, or
concurrency mechanism. Those are adapter concerns.

### Resume

`resume` is valid for an active, blocked, approval-waiting, or failed task when
the orchestrator has a durable reason to continue it. The orchestrator rereads
the record and supplies that record rather than replaying a previous prompt or
requiring a prior runtime handle. The configured worker decides whether to
continue an atomic partial result, clean it up, or start the bounded unit
again. It preserves useful durable work and records a new checkpoint before
returning.

Resume does not mean that the same runtime instance or host session is reused.
Any reuse is an optimization that cannot change recovery behavior.

### Observe

`observe` obtains the current state without granting the worker new authority
or changing its task. The orchestrator observes the root and component
records, task status, configured worker, budget allocation and host-reported
use, blockers, required decisions, checkpoint freshness, and next action. A
host may additionally report lifecycle or measurement facts, but the source
and availability of each fact must be preserved.

Observation must not inspect worker-private state to answer a durable task
query. A host can report a private runtime fact as supplementary evidence, but
it cannot use that fact to replace a missing durable checkpoint, cost
observation, or status transition.

### Question

`question` carries a worker question or an orchestrator direction that requires
human input or a materially different safe action. The orchestrator records
the question, its blocking decision, or its approval requirement in the task
record before presenting it. The worker remains `blocked` or
`awaiting-approval` until the durable answer, direction, or approval is
recorded; a host reply or transient prompt alone is not an answer.

An answer is scoped to the recorded question and current configuration. It may
provide direction or approve the recorded external effect, but it cannot
weaken a higher-authority constraint, retroactively authorize an unrecorded
effect, or alter the active configuration snapshot. Read-only queries are not
questions and must not change task state.

### Cancel

`cancel` is an orchestrator-routed control action. The orchestrator records the
user-authorized cancellation reason and a durable checkpoint, then asks the
host to stop the attempt when possible. The task becomes `cancelled` only
after the record contains the cancellation transition and recovery/result
context; a host stop signal alone is insufficient.

Cancellation is bounded and observable: it must not silently delete durable
partial work, child records, audit evidence, or artifacts needed for recovery.
Private runtime state may be cleaned after the durable cancellation is safely
recorded, subject to the configured retention or audit boundary. A cancelled
task is terminal until a new bounded task replaces it; it is not resumed by
silently treating cancellation as interruption.

### Recover

`recover` starts from the durable record after interruption, stale work,
unavailability, failed handoff, or an incomplete host attempt. The
orchestrator identifies the configured worker in the record, verifies the
record is still recoverable, records the recovery checkpoint/reason, and
delegates to that worker. The worker owns the domain decision to continue,
clean up, or restart its atomic partial result.

Recovery must preserve the task's authority, remaining budget, descendants,
and acceptance conditions. A failed or unavailable runtime does not justify
resetting spent observations, replacing the configured worker silently, or
marking the task complete. If the configured worker is unavailable, the
orchestrator records that blocker and follows a later replacement policy;
this contract does not choose the replacement, retry, backoff, or scheduling
policy.

## State And Checkpoint Rules

- Every operation that changes durable state records `task.updated` and the
  relevant progress, result, blocker, decision, recovery, or next-action
  information before reporting the transition.
- Operations honor the task protocol transitions: `ready` to `active`, and
  from active to `blocked`, `awaiting-approval`, `completed`, `failed`, or
  `cancelled`; recoverable blocked, approval-waiting, and failed work may
  return to `active` through `recover` or an explicitly recorded resume.
- Completion requires validation evidence, terminal descendants, and explicit
  accounting for failed or cancelled descendants. No operation may turn a
  non-terminal task into `completed` based only on runtime exit.
- Budget observations are cumulative across attempts. Cost and wall-clock use
  are actual only when reported by the host; otherwise the record retains the
  unavailable source and does not claim automatic enforcement.
- The orchestrator treats a changed record revision as authoritative. An
  operation returning against an older revision must be discarded or reconciled
  through a new durable checkpoint rather than overwriting newer work.

## Boundary Of This Contract

This specification does not select a host adapter, define a CLI or wire
protocol, implement scheduling or wake timing, define retry/backoff rules,
choose a runtime process or session model, or promise host cost attribution.
Increment 5 maps this contract to a selected host and validates those host
capabilities. Later recovery work may define stale detection and replacement
policy without changing the lifecycle authority defined here.
