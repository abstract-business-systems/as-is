# Knowledge-Work Automation Design

## Purpose

This permanent design specification defines the architecture and staged
implementation direction for a durable, filesystem-oriented knowledge-work
automation system. It distinguishes settled design from transient current task state held in
the local JSON `task` object and configured Markdown narrative.

## Goal

Build systems for knowledge-work automation from reusable skills, specialized
agents, and an orchestrator under human-in-the-loop (HITL) control. The system
should favor small, recoverable, low-cost units of work over long opaque agent
runs.

## Agreed Architecture

### Skills, Agents, and Workflows

- Canonical skills are atomic and reusable. They have one primary purpose and
  can be independently invoked, assessed, improved, permissioned, and reused.
- Skills are grouped into families for navigation and composition, but groups
  are not the canonical executable unit.
- Agents do not own skill definitions. An agent is a role-specific bundle of
  shared skills, instructions, permissions, tools, model settings, and domain
  specialization.
- Workflows and the orchestrator compose agents and skills to reach a goal.
- The foundational taxonomy can be comprehensive at the capability-domain
  level, but the collection of operational skills and domain playbooks is
  deliberately extensible rather than exhaustive.

See [`skills/as-is.md`](../skills/as-is.md) for the current repository skill
map and [`agent-skills.md`](../agent-skills.md) for the retained conceptual
taxonomy and definitions.

### Durable Agents

- Agents are durable by persisting material task state and progress to the
  filesystem frequently enough that another agent can inspect, recover, or
  continue the work.
- Durable records capture task status, meaningful progress, results, blockers,
  decisions, validation, real cost, and the next action.
- This filesystem state is the primary recovery and delegation substrate. It is
  not merely a log of a chat session.
- The system should preserve useful partial work rather than requiring a full
  restart after interruption or failure.
- Durable task intent, scoped policy, decisions, progress summaries, results,
  blockers, and next actions belong in the root or relevant component's
  configured Markdown task narrative, while machine status, constraints, and
  acceptance belong in the local `task` object in `as-is.json`. The durable
  component `as-is.md` remains architecture context. Private runtime state
  belongs in a user-level state directory; it includes session links, leases,
  caches, detailed logs, and secrets. The project receives no generated
  runtime-state files by default.
- Transient execution artifacts, including session links, leases, caches,
  detailed logs, and temporary prompts, are removed after successful task
  completion. Retain them only while needed for active work, recovery, audit,
  or an explicitly configured retention period; retain durable outcomes in the
  task record instead.
- Current machine task state is kept in the root or component `as-is.json` `task`
  object; human task intent and evidence are kept in the configured Markdown
  narrative. Historical committed state is recovered from Git history and
  concise entries in the canonical `Changelog` section; the repository does not
  create a `task-archives/` tree or a host-specific historical recovery path.
  The changelog records the reason for deferral, cancellation, supersession, or
  retirement, relevant commits, and a recovery point without becoming task
  authority or duplicating full records.
- Before removing a historical artifact, the orchestrator checks tracked,
  untracked, and ignored contents, consumers, ownership, audit/recovery value,
  and recreation cost. Git does not preserve uncommitted content, so necessary
  concise facts are retained in the changelog/current records or an authorized
  scoped evidence commit is made before removal. No byte-level recovery claim is
  made without a commit.
- The local JSON `task` object plus configured Markdown narrative are the task
  authority and evidence pair. Durable component `as-is.md` remains architecture
  context; there is no second authoritative backlog or task tree. A private
  future runtime index may hold discardable references, but it cannot replace,
  mirror as authority, or supersede repository-backed records.
- Private transient runtime state may use
  `${TMPDIR:-/tmp}/as-is/<project-key>/<run-id>/<component-key>/`, or an
  equivalent secure host temporary root. It must be collision-resistant,
  private to the run, disposable, and cleaned after durable evidence is saved.
  It is never task authority, history, approval state, or completion evidence.
  A project key alone is insufficient because concurrent or retried runs for
  one project would otherwise collide; the run ID separates those lifetimes,
  and the component key preserves the component boundary. `/tmp` is suitable
  only as a temporary fallback, not for durable records, because it is
  disposable, may be shared, and may be cleaned or unavailable across reboot
  or host-lifetime boundaries.

### Hierarchical Component Model

- The project itself supplies the hierarchy. Directories represent components.
- A change to a component is a task at that component directory level. The
  component's filesystem path determines its scope and parent; task records do
  not repeat either value.
- The canonical durable task/job identity is the repository-relative component
  path. A durable task revision identifies one task incarnation and a one-based
  attempt identifies each new worker invocation within it. A runtime `JobId`
  is only a private operational alias and cannot replace the path, authorize a
  transition, or be required for recovery.
- At any instant, there is exactly one active task, including its task record,
  for a directory. That task may lead to subtasks in descendant directories.
- At most one active worker attempt may modify a component at a time. A later
  runtime implementation must enforce this with a per-component lease or lock;
  the lease controls exclusivity but does not become task authority.
- Subtasks are recorded in the local JSON `task` object and configured Markdown
  narrative in the relevant component directory, not as an arbitrarily deep
  nested structure inside the parent task record. The component-directory
  hierarchy is the durable task tree; private runtime state may mirror it for
  implementation convenience but is not authoritative.
- Work that spans multiple components is performed at their nearest common
  ancestor rather than by cross-component delegation.
- A parent orchestrator may update its own or root record, observe child
  records, and integrate at the nearest common ancestor after children finish.
  It must not edit sibling component files while those siblings are active.
- Independent sibling components may run concurrently when their directory
  scopes, external dependencies, and resource allocations do not overlap.
  Siblings do not mutate each other's records or depend on another active
  sibling's mutable state.

### Accounting And Runtime Identity

The change log is the concise cumulative functional and non-functional history
overview. Machine-readable accounting belongs in an explicitly defined JSON
data surface, not changelog front matter; it carries cost with currency/source,
wall-clock with unit/source, build count, and failure count. The summary is cumulative only over
finalized, canonical `worker-subtree` observations keyed by
`component-path/task-revision/attempt`; repeated observations update one key and
corrections supersede one key. An individual unavailable value remains
`unavailable`, and an incomplete aggregate is `unknown`, never zero. A
`full-invocation` observation is retained as a non-additive end-to-end view.

The parent owns its own orchestration and integration observations. A child owns
its worker-subtree actual use. Parent child allocations are authorization
boundaries rather than actual-use roll-ups, and parent completion still names
failed or cancelled descendants. New retries/recoveries receive the next
attempt ordinal; a supervisor restart or new JobId for the same invocation does
not create a duplicate observation.

The reusable supervisor must persist a private restart-reconcilable map for an
active attempt at
`${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json`.
It maps JobId to component path, task revision, attempt, adapter, private
handles, and state. It is subordinate runtime metadata and expires terminal,
cleaned entries only after retention. Public status accepts component path and
optional attempt; JobId is optional diagnostic output. OpenCode-specific
session/event behavior remains at the adapter boundary.

### Task and Progress Protocol

- The core protocol is deliberately minimal: the presence of task-status and
  progress records in the filesystem makes the work visible and recoverable.
- Once defined, the component task-record protocol is the canonical field list
  for delegated work. Repository instructions and project decisions state only
  its applicable behavioral requirement and refer to the protocol for fields.
- Task records use the local `task` object in `as-is.json` plus the configured
  Markdown narrative beside the component's `as-is.md`. Their protocol is
  defined in [Component Task-Record Protocol](../docs/component-task-record-protocol.md).
- The record identifies the configured worker suitable for recovery, not a mutable
  owner or lease. When recovery is required, the orchestrator rereads the record
  and delegates it to that role; the resumed worker decides whether to continue
  an atomic partial result, clean it up, or start again.
- A progress marker indicates a bounded unit of work handled by one worker at a
  point in time. Worker planning, task management, and delegation procedures are
  supplied as skills rather than duplicated in the record schema.
- A record becomes completed only after its descendants are terminal and its
  acceptance evidence accounts for any failed or cancelled child. Its scoped
  durable handoff is committed before the completion is reported upward.
- Target task size is a micro-task: a few minutes of wall-clock work and a
  budget on the order of a couple of dimes. A host records cumulative
  wall-clock observations against the component budget; durable checkpoint
  timestamps remain the separate ordering and stale-work signal. Exact limits
  remain configurable.

### Constraint Enforcement And Component Maintenance

- Constraints are introduced in the durable task protocol now. Increment 2
  implements deterministic static record validation for authority, descendant
  closure, and cost and wall-clock budget arithmetic. Increments 4 and 5 add
  host-neutral runtime enforcement and map it through a selected host adapter.
- `maintaining-components` is the operational skill for bounded housekeeping and
  improvement work. It evaluates stale, redundant, inconsistent, and overly
  nondeterministic component behavior, then composes the smallest relevant skill
  and validation for the supported change.
- A maintenance task does not assume that deterministic behavior is always
  preferable. It replaces a nondeterministic flow only when a concrete
  correctness, cost, recovery, or repeatability need and acceptance condition
  justify the change.
- Do not create a generic maintenance framework. The skill operates through the
  existing component task protocol and adds a subordinate technique only when a
  bounded maintenance task demonstrates the need.

### Configuration Boundary

- as-is is a self-contained machine/user-installed bundle of agents, skills,
  references, examples, schemas, extensions, and adapters. A host adapter
  invokes it without copying the core into every target project.
- A target project has an authored `as-is.md` at its root for project policy and
  project-level task context. When work is first delegated to a component
  directory, the orchestrator generates its durable `as-is.md` context and
  local JSON `task` object plus Markdown narrative before launch; the worker
  then maintains the task pair as durable scoped task state and any permitted
  policy narrowing. Generated task artifacts are not private runtime state.
- The core provides a versioned default for every supported setting. Common
  policy is supplied centrally as read-only execution context; the root and
  component records contain only their task-specific effective constraints.
  Generated runtime state remains separate and non-authoritative.
- A component may narrow applicable policy only within its authority. Protocol
  validation rejects lower-authority values that weaken a higher-authority
  constraint.
- Root `configuration.technology-preferences` provides project-specific, centrally
  supplied guidance for laying a new component's foundation. It is a preference,
  not a constraint: implementers use it when it fits the bounded requirement and
  established local patterns, and record a material departure with its reason.
- Extensions are supplied by the selected bundle and are declared, ordered, and
  configured through the root machine configuration and host adapter boundary.
  Changing a project's bundle is the controlled way to change its available
  extension set.
- The configuration API is strict and versioned. Unknown core fields fail
  validation rather than silently changing automation behavior.
- Schema validation, separation of generated state from project policy, and
  HITL approval for irreversible external effects are fixed invariants, not
  overrideable preferences.
- Environment variables may resolve named secrets but do not override `as-is.md`
  policy. Secrets are never persisted in configuration, task, or generated
  state files.
- A core may improve itself through its normal task system, but an active run
  uses a stable normalized configuration snapshot and may not silently rewrite
  its authorization policy.

See `docs/configuration.md` for the superseded JSON-manifest design,
`docs/component-task-record-protocol.md` for the component record contract, and
`docs/execution-contract.md` for the host-neutral worker lifecycle contract.
See the configured JSON `task` object and Markdown narrative for transient current project task state.

### Orchestration and Control

- The orchestrator orchestrates. It maintains and interprets task state,
  starts or resumes work, observes progress, invokes recovery, and routes
  control and direction from HITL.
- The orchestrator is not intended to become the domain implementer or to own
  all decisions that a specialist can make within its delegated boundary.
- It is self-scheduling: it wakes at self-scheduled times to inspect the task
  state and move the process forward. Wake timing is configurable.
- An as-is/OpenCode turn is a control-plane turn, not the lifetime of a worker.
  Launch submits or spawns a worker attempt to a supervisor-owned job or a
  supported server job, records a durable launch checkpoint, and returns
  without waiting for worker completion.
- A foreground child process that the as-is or orchestrator turn waits on is
  synchronous. Wrapping a nested subagent call in such a child does not satisfy
  the non-blocking launch boundary and must not be accepted as asynchronous
  execution.
- The supervisor or server job owns the long-running worker and its process
  group, captures logs and lifecycle events, and persists the state needed for
  later observation, cancellation, stale detection, and recovery. Later wake or
  check-in operations poll the durable task record and the job/process or
  session health; runtime health supplements rather than replaces durable task
  evidence.
- If the selected host cannot safely detach or submit a job with that ownership,
  observation, and cancellation boundary, the orchestrator records a durable
  capability blocker and does not claim asynchronous support.
- HITL provides control and direction through the orchestrator. The
  orchestrator also routes questions, approval requests, and material status to
  the human.
- Recovery is based on understanding the task record. If work is interrupted,
  the orchestrator delegates recovery to the configured worker identified in the
  record, rather than relying on an independent generic recovery process.
- Recovery uses the conservative host-neutral policy in
  `docs/execution-contract.md`: stale detection is source-labelled from durable
  checkpoints, retries are finite with cumulative backoff and budget
  observations, and unavailable-worker replacement requires explicit recorded
  direction or approval. A host adapter may report runtime facts but cannot
  silently replace a worker or infer completion from process exit.

### User Check-Ins And Control

- The root project context configures a periodic check-in interval under
  `configuration.scheduling.checkInSeconds`. The interval is a positive duration and
  applies to the orchestrator's durable observation cycle; it does not grant a
  worker additional execution time or replace the task wall-clock budget.
- A check-in is due when the configured interval has elapsed from the latest
  durable checkpoint represented by `task.updated`. The next due time is derived
  from that timestamp and the effective interval, so it remains recoverable
  without a private scheduler or session cache. A host may wake earlier for a
  material event.
- Material-event notification is enabled by the root
  `configuration.notifications.materialEvents` setting. When enabled, the
  orchestrator immediately reports delegation, blocking, budget risk or
  exhaustion, completion, failure, cancellation, and approval-required external
  effects. The event is observable from the durable task status, checkpoint,
  blocker or approval text, budget fields, child record, and next action; a
  private event log is not authoritative.
- User queries are answered from the root and component `as-is.md` records only.
  A response reports active tasks, delegated tasks, each task's status and
  configured worker, budget allocation and observed use (including unavailable
  sources), blockers, required decisions or approvals, and the next check-in.
  It does not inspect worker-private runtime state and must distinguish missing
  observations from zero use.
- Intermediate communication is control-plane communication, not worker
  steering. Status queries read durable task records. General questions use a
  separate read-only as-is/orchestrator interaction or a durable question;
  they are not private instructions to a worker. New parallel work is a
  parent-orchestrator delegation request. Approvals and cancellation are
  durably recorded before the corresponding action is taken. Direct messages
  to private workers are not authoritative.
- Control is routed through the orchestrator. A user may provide direction,
  approve a recorded external effect, or cancel a task; the orchestrator records
  the resulting durable checkpoint and status transition before reporting it.
  A query is read-only, and no control action silently weakens higher-authority
  constraints or changes the active configuration snapshot.
- Permission-aware execution is preflighted before launch, resume, or recovery.
  The supervisor owns a private approved workspace, disables hidden interactive
  prompts, and records a structured `permission-needed` event before escalating
  to the user. The schema-compatible task status is `awaiting-approval` with a
  durable checkpoint state of `awaiting-user-approval`; approval is scoped to the
  recorded operation and configuration, denial leaves durable blocked evidence,
  and resume rereads the record rather than replaying a transient prompt. A host
  that cannot prove user-event bubbling is a capability blocker, not permission
  to simulate success.
- Liveness is bounded by supervisor heartbeats and a deadline. Stale detection
  uses durable checkpoint age and the effective check-in interval, while missing
  or inconclusive clocks remain `unknown`. Recovery is finite and cumulative,
  fingerprints repeated permission/liveness blockers to suppress retry loops,
  and requires durable cancellation plus process-group and workspace cleanup
  confirmation before private state is removed.
- If no task is active, a query reports that state and no next check-in rather
  than inferring activity from transient host sessions. A blocked or
  approval-waiting task remains visible until a durable decision or recovery
  transition is recorded.

### Concurrency Boundary

- The current effective `configuration.scheduling.maxConcurrentTasks` remains `1`.
  No runtime concurrency increase is part of the current design-context task.
- Future `maxConcurrentTasks: 3` semantics count active leaf worker attempts,
  not parent control-plane orchestrators. Parent orchestrators submit and
  return, then observe and integrate on later wake/check-in operations; they do
  not consume leaf-worker slots merely by coordinating children.
- Before a later implementation raises the limit, it must provide an exclusive
  per-component lease or lock, global slot accounting, independent cost and
  wall-clock budgets for each leaf attempt, sibling isolation, parent
  observation across wake/check-in operations, and descendant closure before an
  ancestor completes.
- A slot or lease is coordination evidence only. Durable component records
  remain the authority for status, approvals, history, validation, and
  completion.

### Host-Neutral Execution Contract

The lifecycle boundary for worker execution is defined in
`docs/execution-contract.md`. It normalizes `launch`, `resume`, `observe`,
`question`, `cancel`, and `recover` operations around the component task
record. The orchestrator supplies the worker its component record plus central
read-only execution context; it does not copy repository-wide context into the
worker record or make private runtime state authoritative.

Each operation returns durable record observations, optional source-labelled
host observations, and a recoverable next action. Durable status transitions,
checkpoint timestamps, budget accounting, questions, approvals, cancellation,
and descendant closure remain governed by the task-record protocol. A runtime
handle, process exit, session prompt, or missing private state cannot replace
that evidence. The contract intentionally leaves host selection, transport,
session/process behavior, scheduling, retry/backoff policy, and measurement
implementation to later adapter and recovery increments.

### Non-Blocking Job Model

The execution boundary has two distinct lifetimes:

1. The as-is/OpenCode/orchestrator turn performs bounded control-plane work. It
   validates the record and allocation, submits or spawns one worker attempt,
   and returns after the supervisor or supported server job has accepted the
   attempt and the durable launch checkpoint has been written.
2. The supervisor/job lifetime owns the long-running `as-is -> orchestrator ->
   implementer` mediation, its process group, logs, events, and private
   transient runtime state. It persists durable checkpoints and remains
   independently observable after the submitting turn returns.

The supervisor/job must expose enough evidence for a later orchestrator wake or
check-in to poll the durable component record and process/session health, request
cancellation, detect stale or unavailable work, and perform bounded recovery.
Process health, a job handle, an event stream, or process exit is supplementary;
none can create a completion transition without the worker's durable validation
and handoff. A child process started by the submitting turn and awaited by that
turn is explicitly not this model.

The host capability prerequisite is strict. A host adapter may use a detached
supervisor process, a host-managed job, or a supported server job, but it must
demonstrate submission-before-completion, ownership of the worker process group,
log/event capture, durable state persistence, polling, and cancellation. If it
cannot establish those facts safely, the result is a durable blocker and the
adapter must not claim asynchronous execution. OpenCode server mode is only a
possible transport or job-submission mechanism; it is not evidence by itself of
nested navigation, detached execution, or asynchronous lifecycle support.

### Minimal Execution Envelope

The minimal dogfood path uses an orchestrator role and an implementer role. Both
receive repository instructions, applicable design principles, and permitted
skills as central read-only context. The component record supplies only its
bounded requirement, effective constraints, acceptance conditions, configured
worker, and cost and wall-clock allocations.

1. The orchestrator reads the parent context, rejects a lower-authority
   weakening constraint, and creates a missing child record atomically in
   `ready` state.
2. The orchestrator verifies that the child allocation, including its reserve,
   is within the parent allocation, then delegates the component to the record's
   configured worker.
3. The orchestrator submits or spawns the attempt through the supervisor or
   supported server job, which preserves the `as-is -> orchestrator ->
   implementer` role mediation and component-only task context. The orchestrator
   records the durable launch checkpoint and returns without waiting for worker
   completion.
4. The supervisor/job owns the long-running worker, process group, logs, and
   events. On later wake or check-in, the orchestrator polls the durable child
   record and source-labelled job/process health, then routes cancellation,
   question, stale, or bounded-recovery actions through the same role boundary.
5. The implementer changes only its component directory, advances the
   record through its status transition, uses the smallest task-specific checks,
   and records validation evidence, actual host-reported cost when available,
   residual risk, recovery state, and next action before handoff.
6. The orchestrator reads the completed record and performs any required
   ancestor-level integration, including exposing a newly created repository
   skill through the host adapter.
7. The worker or responsible orchestrator uses `committing-completed-work` to
   commit the completed record and only its scoped changes. A failed commit keeps
   the record recoverable rather than reporting completion.

The envelope does not implement scheduling, check-ins, runtime session
recovery, or a host adapter. The host-neutral lifecycle contract is defined in
`docs/execution-contract.md`; host-specific enforcement and recovery behavior
remain later increments. When a host cannot report per-component cost, the
record names its fallback metric and leaves `spent` as non-actual rather than
presenting an estimate as a cost.

An adapter should prefer a host-managed detached job when it exposes the required
submission-before-completion boundary, process-group ownership, lifecycle events,
cancellation, and attributable usage. A supervisor-owned detached subprocess is
also valid when it provides those same observations and controls. A foreground
subprocess that the submitting OpenCode/as-is turn waits on is not a fallback; it
is synchronous and cannot satisfy this contract. When neither a safe detached
supervisor nor a supported server job is evidenced, the adapter must report a
capability blocker rather than weakening the contract.

### Delegation

- Delegation is vertical only: an agent delegates a bounded subtask to an agent
  working at a lower component level.
- Agents are generally specialists in domains and should delegate when a
  bounded lower-level subtask is more appropriate than retaining it locally.
- Horizontal delegation is not part of this model.
- Cross-component work belongs to the nearest common-ancestor task.
- Delegation should be represented through the filesystem task hierarchy so
  that its status and recovery remain durable and inspectable.
- The delegated worker receives its component `as-is.md` plus centrally supplied
  common execution context. Before launch, the orchestrator creates the record
  when needed and records task-specific constraints, real-cost and wall-clock
  allocations, acceptance conditions, and return condition there. It reuses
  rather than overwrites an existing active or recoverable record. The worker may
  inspect outside that component only when its requirement explicitly identifies
  a necessary dependency or the human authorizes broader access.

## Sequenced Implementation Plan

Implement the master orchestrator only after its durable contract is defined.
Each increment must preserve the authority order, maintain recoverable context,
and use the smallest relevant validation before the next increment begins. Do
not begin a later increment until the preceding increment meets its stated
acceptance conditions.

1. **Define the durable task-record protocol.** Completed. The protocol defines
   filesystem-derived placement and parentage, strict local `task` objects in `as-is.json`
   metadata plus front-matter-free Markdown narrative sections, status values,
   configured-worker recovery routing, host-reported
   component cost, child-record handoffs, pre-handoff validation, and safe
   sibling parallelism.
2. **Define inheritance, delegation, and the minimal dogfood path.** Specify how
   the orchestrator supplies central common context, records task-specific
   effective constraints and a bounded vertical delegation, and lets a worker
   request child work. Define the minimum orchestrator and worker agent
   configurations needed to run one harmless self-hosting task through this
   protocol. Keep cross-component work at the nearest common ancestor.
    Acceptance conditions: a worker can begin from its component record plus the
    central execution envelope; focused deterministic validation rejects a
    lower-authority weakening constraint and child cost or wall-clock allocation
    beyond the parent's remaining budget; and the minimal orchestrator delegates
    one bounded task to the worker, which validates and records its handoff. The
    dogfood task must use the repository structure rules: record component
    purpose, preserve folder-file-section lineage, and group child components by
    meaningful type where applicable.
3. **Define user check-ins and control.** Add configurable periodic check-ins
   and immediate notifications for delegation, blocking, budget risk or
   exhaustion, completion, failure, cancellation, and approval-required
   external effects. Define query responses that report active and delegated
   tasks, status, budget use, blockers, required decisions, and next check-in.
   Acceptance conditions: configured interval and material-event notifications
   are observable from durable task state, and a user query produces the defined
   status without reading worker-private runtime state.
4. **Define the host-neutral execution contract.** Model launching, resuming,
   observing, questioning, cancelling, and recovering a worker without tying
   orchestration policy to a particular CLI. The worker receives its component
   task record, not a duplicate of repository-wide context.
   Acceptance conditions: the contract represents every lifecycle action needed
   by the preceding task protocol without adding host-specific policy.
5. **Implement and validate a host adapter.** Map the contract to a
   supervisor-owned detached job or a supported server job. A foreground child
   process awaited by the submitting host turn is not an asynchronous mapping.
   Validate a harmless child-component task using the selected adapter, including
   `as-is -> component-builder -> …` mediation, component-only initial
   context, a launch checkpoint returned before worker completion, supervisor/job
   ownership of the process group, log/event capture, later durable and health
   polling, cancellation, stale handling, bounded recovery, budget handling,
   completion reporting, and cleanup of transient runtime artifacts. If host
   evidence cannot establish safe detachment or job submission, record a blocker
   and stop without claiming asynchronous support.
   Acceptance conditions: the harmless task satisfies the non-blocking lifecycle
   contract, preserves component-only initial context and role mediation, and
   records durable evidence of launch, polling, cancellation or recovery,
   validation, and cleanup.
6. **Implement recovery and independent validation.** Completed in the current
   Increment 6 task. The host-neutral contract defines stale-task detection,
   finite retry and backoff, cumulative budget preservation,
   unavailable-worker replacement approval, and independent review. The local
   interrupted fixture recovered from its component record without retaining
   unnecessary transient files.
   Acceptance conditions met: the interrupted harmless task was recovered from
   its component record, and cleanup removed only private transient artifacts
   not required by the configured recovery or audit boundary.

The accepted current implementation for the execution-foundation boundary is
the dependency-free subprocess supervisor recorded by the terminal
`components/subprocess-execution-foundation/as-is.md` handoff and commit `e8fb1da`. The
previous systemd user-job flow is retired/superseded and is not a fallback,
active sequencing dependency, or separate recovery path. Its historical
baseline is recoverable only through Git and the canonical `Changelog` section.

## Open Design Questions

These decisions were explicitly deferred and should be discussed before
implementation.

1. **Scheduling policy:** Wake conditions and adaptive scheduling remain open,
   while the current limit is `1` and a future limit of `3` counts leaf worker
   attempts only. The future implementation must satisfy the concurrency
   boundary above before raising the configured value.
2. **Agent identity and recovery:** What it means to resume versus replace a
   configured worker and how recovery behaves when the
   original specialist is unavailable.
3. **HITL protocol:** Which events require a human decision, how questions and
   approvals are persisted, and how the human changes direction safely.
4. **External-system protocol:** How integrations represent provenance,
   credentials, approval boundaries, retries, idempotency, and failure state.
5. **Host adapter selection:** Which host can enforce the non-blocking job
   boundary, own the worker process group, support polling and cancellation, and
   report the lifecycle and measurement observations the execution contract
   requires. OpenCode server mode remains a candidate transport/job-submission
   mechanism, not proof of nested navigation or asynchronous execution.

## Host Adapters

Host-specific discovery, permission, session, and measurement facts belong in
adapter documents. They map the host-neutral execution contract without changing
the core protocol or policy. Select the applicable adapter document when
implementing or validating a host mapping.

## Suggested Next Discussion

The next bounded implementation should first implement and validate control-plane
status and parallel delegation while leaving `maxConcurrentTasks` at `1`. Only
after that evidence is accepted should a separate bounded task raise the limit
to `3` and validate three independent child components. Do not begin either
implementation task without a new current-turn authorization and bounded task
context.
