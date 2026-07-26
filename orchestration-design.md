# Knowledge-Work Automation Design

## Purpose

This permanent design specification defines the architecture and staged
implementation direction for a durable, filesystem-oriented knowledge-work
automation system. It distinguishes settled design from the transient current
task state in `as-is.md`.

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

See `agent-skills.md` for the current taxonomy and definitions.

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
  `as-is.md`. Private runtime state belongs in a user-level state
  directory; it includes session links, leases, caches, detailed logs, and
  secrets. The project receives no generated runtime-state files by default.
- Transient execution artifacts, including session links, leases, caches,
  detailed logs, and temporary prompts, are removed after successful task
  completion. Retain them only while needed for active work, recovery, audit,
  or an explicitly configured retention period; retain durable outcomes in the
  task record instead.

### Hierarchical Component Model

- The project itself supplies the hierarchy. Directories represent components.
- A change to a component is a task at that component directory level. The
  component's filesystem path determines its scope and parent; task records do
  not repeat either value.
- At any instant, there is exactly one active task, including its task record,
  for a directory. That task may lead to subtasks in descendant directories.
- Subtasks are recorded in an `as-is.md` in the relevant component directory,
  not as an arbitrarily deep nested structure inside the parent task record.
  The component-directory hierarchy is the durable task tree; private runtime
  state may mirror it for implementation convenience but is not authoritative.
- Work that spans multiple components is performed at their nearest common
  ancestor rather than by cross-component delegation.
- Independent sibling components may run concurrently when their directory
  scopes, external dependencies, and resource allocations do not overlap.
  Siblings do not mutate each other's records or depend on another active
  sibling's mutable state.

### Task and Progress Protocol

- The core protocol is deliberately minimal: the presence of task-status and
  progress records in the filesystem makes the work visible and recoverable.
- Once defined, the component task-record protocol is the canonical field list
  for delegated work. Repository instructions and project decisions state only
  its applicable behavioral requirement and refer to the protocol for fields.
- Task records use the component's `as-is.md`. Their protocol is defined in
  [Component Task-Record Protocol](component-task-record-protocol.md).
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

### Constraint Enforcement And Deterministic Maintenance

- Constraints are introduced in the durable task protocol now. Increment 2
  implements deterministic static record validation for authority, descendant
  closure, and cost and wall-clock budget arithmetic. Increments 4 and 5 add
  host-neutral runtime enforcement and map it through a selected host adapter.
- Deterministic maintenance scripts own repeatable schema checks, arithmetic,
  state-transition checks, and safe transformations. They return observable
  results and do not make generative policy or scope decisions.
- Skills select, invoke, and interpret deterministic scripts as part of a
  bounded workflow; agents supply judgment only where the script has an explicit
  input, unsupported condition, or escalation boundary.
- Do not create a generic maintenance framework or script directory in advance.
  The first script is justified by Increment 2's concrete task-record validation
  need; further scripts follow only when a repeated deterministic operation
  warrants them.

### Configuration Boundary

- as-is is a self-contained machine/user-installed bundle of agents, skills,
  references, examples, schemas, extensions, and adapters. A host adapter
  invokes it without copying the core into every target project.
- A target project has an authored `as-is.md` at its root for project policy and
  project-level task context. When work is first delegated to a component
  directory, the orchestrator generates its `as-is.md` task record atomically
  before launch; the worker then maintains it as durable scoped task context and
  any permitted policy narrowing. A generated component record is not private
  runtime state.
- The core provides a versioned default for every supported setting. Common
  policy is supplied centrally as read-only execution context; the root and
  component records contain only their task-specific effective constraints.
  Generated runtime state remains separate and non-authoritative.
- A component may narrow applicable policy only within its authority. Protocol
  validation rejects lower-authority values that weaken a higher-authority
  constraint.
- Extensions are supplied by the selected bundle and are declared, ordered, and
  configured through the root `as-is.md`. Changing a project's bundle is the
  controlled way to change its available extension set.
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

See `configuration.md` for the superseded JSON-manifest design,
`component-task-record-protocol.md` for the component record contract, and
`as-is.md` for transient current project task state.

### Orchestration and Control

- The orchestrator orchestrates. It maintains and interprets task state,
  starts or resumes work, observes progress, invokes recovery, and routes
  control and direction from HITL.
- The orchestrator is not intended to become the domain implementer or to own
  all decisions that a specialist can make within its delegated boundary.
- It is self-scheduling: it wakes at self-scheduled times to inspect the task
  state and move the process forward. Wake timing is configurable.
- HITL provides control and direction through the orchestrator. The
  orchestrator also routes questions, approval requests, and material status to
  the human.
- Recovery is based on understanding the task record. If work is interrupted,
  the orchestrator delegates recovery to the configured worker identified in the
  record, rather than relying on an independent generic recovery process.

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
3. The implementer changes only its component directory, advances the
   record through its status transition, uses the smallest task-specific checks,
   and records validation evidence, actual host-reported cost when available,
   residual risk, recovery state, and next action before handoff.
4. The orchestrator reads the completed record and performs any required
   ancestor-level integration, including exposing a newly created repository
   skill through the host adapter.
5. The worker or responsible orchestrator uses `committing-completed-work` to
   commit the completed record and only its scoped changes. A failed commit keeps
   the record recoverable rather than reporting completion.

The envelope deliberately does not implement scheduling, check-ins, runtime
session recovery, or a host-neutral lifecycle adapter. Those remain later
increments. When a host cannot report per-component cost, the record names its
fallback metric and leaves `spent` as non-actual rather than presenting an
estimate as a cost.

An adapter should prefer a host-managed child worker when it exposes the
required lifecycle events, cancellation, and attributable usage. This preserves
host session linkage and control better than an independently launched process,
but does not itself make cost attribution reliable; that remains a host
measurement capability. A bounded subprocess is the fallback where a host cannot
provide the required child-worker lifecycle contract.

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
   filesystem-derived placement and parentage, strict front matter, Markdown
   sections, status values, configured-worker recovery routing, host-reported
   component cost, child-record handoffs, pre-handoff validation, and safe
   sibling parallelism.
2. **Define inheritance, delegation, and the minimal dogfood path.** Specify how
   the orchestrator supplies central common context, records task-specific
   effective constraints and a bounded vertical delegation, and lets a worker
   request child work. Define the minimum orchestrator and worker agent
   configurations needed to run one harmless self-hosting task through this
   protocol. Keep cross-component work at the nearest common ancestor.
    Acceptance conditions: a worker can begin from its component record plus the
    central execution envelope; a focused deterministic record-validation script
    rejects a lower-authority weakening constraint and child cost or wall-clock
    allocation beyond the parent's remaining budget; and the minimal orchestrator
    delegates one bounded task to the worker, which validates and records its
    handoff. The dogfood task must use the repository structure rules: record
    component purpose, preserve folder-file-section lineage, and group child
    components by meaningful type where applicable.
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
5. **Implement and validate a host adapter.** Map the contract to a host-managed
   child worker where available, or a bounded subprocess otherwise. Validate a
   harmless child-component task using the selected adapter, including delegation
   notification, check-ins, budget handling, completion reporting, and cleanup
   of transient runtime artifacts.
   Acceptance conditions: the harmless task satisfies the lifecycle contract,
   preserves component-only initial context, and records durable evidence of
   notifications, validation, and cleanup.
6. **Implement recovery and independent validation.** Define stale-task
   detection, retry and backoff, unavailable-worker replacement, and the risk
   threshold for independent review. Verify that interruption recovery uses the
   durable task record without retaining unnecessary transient files.
   Acceptance conditions: an interrupted harmless task can be recovered from
   its component record, and cleanup removes only private transient artifacts
   not required by the configured recovery or audit boundary.

## Open Design Questions

These decisions were explicitly deferred and should be discussed before
implementation.

1. **Scheduling policy:** Wake conditions, fixed versus adaptive intervals,
   maximum concurrency, cost budgets, and backoff behavior.
2. **Agent identity and recovery:** What it means to resume versus replace a
   configured worker and how recovery behaves when the
   original specialist is unavailable.
3. **HITL protocol:** Which events require a human decision, how questions and
   approvals are persisted, and how the human changes direction safely.
4. **External-system protocol:** How integrations represent provenance,
   credentials, approval boundaries, retries, idempotency, and failure state.
5. **Host adapter selection:** Which host can enforce the execution contract and
   report the lifecycle and measurement observations it requires.

## Host Adapters

Host-specific discovery, permission, session, and measurement facts belong in
adapter documents. They map the host-neutral execution contract without changing
the core protocol or policy. Select the applicable adapter document when
implementing or validating a host mapping.

## Suggested Next Discussion

Begin the second implementation increment: define the central execution envelope
and bounded delegation mechanics, then create and dogfood minimal orchestrator
and worker agent configurations on one harmless self-hosting task. Keep common
policy and private runtime state out of component records.
