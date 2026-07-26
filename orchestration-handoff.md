# Knowledge-Work Automation Design Handoff

## Purpose

This handoff preserves the current design direction for a durable,
filesystem-oriented knowledge-work automation system. It is intended to let a
future session continue the design after context compaction without treating
open questions as settled decisions.

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
- Durable records should capture task status, meaningful progress, results,
  blockers, decisions, and the next action. The exact representation is not yet
  specified.
- This filesystem state is the primary recovery and delegation substrate. It is
  not merely a log of a chat session.
- The system should preserve useful partial work rather than requiring a full
  restart after interruption or failure.
- Durable task intent, scoped policy, decisions, progress summaries, results,
  blockers, and next actions belong in the root or relevant component's
  authored `as-is.md`. Private runtime state belongs in a user-level state
  directory; it includes session links, leases, caches, detailed logs, and
  secrets. The project receives no generated runtime-state files by default.
- Transient execution artifacts, including session links, leases, caches,
  detailed logs, and temporary prompts, are removed after successful task
  completion. Retain them only while needed for active work, recovery, audit,
  or an explicitly configured retention period; retain durable outcomes in the
  task record instead.

### Hierarchical Component Model

- The project itself supplies the hierarchy. Directories represent components.
- A change to a component is a task at that component directory level.
- At any instant, there is exactly one active task, including its task record,
  for a directory. That task may lead to subtasks in descendant directories.
- Subtasks are recorded in an `as-is.md` in the relevant component directory,
  not as an arbitrarily deep nested structure inside the parent task record.
  The component-directory hierarchy is the durable task tree; private runtime
  state may mirror it for implementation convenience but is not authoritative.
- Work that spans multiple components is performed at their nearest common
  ancestor rather than by cross-component delegation.
- “Co-existing” refers to tasks existing alongside the component being built,
  not to concurrent, independent tasks competing for the same directory.

### Task and Progress Protocol

- The core protocol is deliberately minimal: the presence of task-status and
  progress records in the filesystem makes the work visible and recoverable.
- Once defined, the component task-record protocol is the canonical field list
  for delegated work. Repository instructions and project decisions state only
  its applicable behavioral requirement and refer to the protocol for fields.
- Task records use the component's `as-is.md`. Its front-matter schema,
  Markdown section requirements, timestamps, versioning, status representation,
  and locking mechanism remain to be defined.
- Task records contain agent information sufficient for the orchestrator to
  understand who is responsible for a task and to route recovery.
- A progress marker indicates a single unit of work that should be handled by
  one agent at that point in time.
- Target task size is a micro-task: a few minutes of wall-clock work and a
  budget on the order of a couple of dimes. Exact limits remain configurable.

### Configuration Boundary

- as-is is a self-contained machine/user-installed bundle of agents, skills,
  references, examples, schemas, extensions, and adapters. It is invoked by its
  CLI or a chat slash-command adapter rather than copied into every project.
- A target project has an authored `as-is.md` at its root for project policy and
  project-level task context. A component with delegated work has an authored
  `as-is.md` in that component directory for its scoped task context and any
  permitted policy narrowing.
- The core provides a versioned default for every supported setting. The root
  `as-is.md` records every material effective constraint's source and precedence,
  including fixed, external, repository, user, and default values; generated
  runtime state remains separate and non-authoritative.
- A component `as-is.md` records the resolved effective policy, the source and
  precedence of each material inherited or overridden value, and any permitted
  scoped override. Protocol validation rejects lower-authority values that
  weaken a higher-authority constraint.
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

See `configuration.md` for the superseded JSON-manifest design and `as-is.md`
for the current project-facing design seed.

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
  the orchestrator delegates recovery to the agent identified in the task
  record, rather than relying on an independent generic recovery process.

### Delegation

- Delegation is vertical only: an agent delegates a bounded subtask to an agent
  working at a lower component level.
- Agents are generally specialists in domains and should delegate when a
  bounded lower-level subtask is more appropriate than retaining it locally.
- Horizontal delegation is not part of this model.
- Cross-component work belongs to the nearest common-ancestor task.
- Delegation should be represented through the filesystem task hierarchy so
  that its status and recovery remain durable and inspectable.
- A delegated agent starts with only the `as-is.md` in its assigned component
  directory. Before launch, the orchestrator resolves applicable inherited
  policy and records the effective constraints, budget, scope, acceptance
  conditions, and return condition there. The agent may inspect outside that
  component only when its task explicitly identifies a necessary dependency or
  the human authorizes broader access.

## Sequenced Implementation Plan

Implement the master orchestrator only after its durable contract is defined.
Each increment must preserve the authority order, maintain recoverable context,
and use the smallest relevant validation before the next increment begins. Do
not begin a later increment until the preceding increment meets its stated
acceptance conditions.

1. **Define the durable task-record protocol.** Specify the component task
   record's placement, required fields, status state machine, task ownership,
   acceptance conditions, progress, result, next action, and single-owner claim
   semantics. Include allocated wall-clock, cost, context, retry, and
   concurrency budgets. For each material new abstraction, configuration
   surface, artifact, or execution path, require the local pattern considered,
   the concrete need and acceptance condition, and the changed-artifact set.
   The orchestrator rejects an incomplete material-change record before
   beginning or delegating work and reports it for review.
   Acceptance conditions: a new agent can locate the component record, recover
   its task without chat context, identify the record owner, and validate its
   claim; protocol validation can reject an invalid status or an authority-
   weakening override; it rejects a missing material-change record before both
   directly started and delegated work.
2. **Define inheritance and delegation.** Specify how the orchestrator resolves
   root and ancestor policy into the assigned component record, how local policy
   may narrow it, and how it records a bounded vertical delegation. Keep
   cross-component work at the nearest common ancestor.
   Acceptance conditions: the resolved record identifies the source and
   precedence of each material constraint; a lower-authority weakening override
   is rejected; a worker can begin from only its component record.
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
5. **Implement and validate the OpenCode adapter.** Map the contract to an
   OpenCode subagent where available, or a bounded `opencode run` subprocess
   otherwise. Validate a harmless child-component task in a fresh OpenCode
   process, including delegation notification, check-ins, budget handling,
   completion reporting, and cleanup of transient runtime artifacts.
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

1. **Component task-record schema:** Minimal required fields, Markdown-section
   requirements, timestamps, versioning, marker semantics, and whether status
   is represented by front matter, Markdown content, or both.
2. **Claim and exclusivity mechanism:** How the single-active-task-per-directory
   invariant is created and protected under concurrent orchestrator or agent
   activity. Prefer the smallest reliable mechanism.
3. **Scheduling policy:** Wake conditions, fixed versus adaptive intervals,
   maximum concurrency, cost budgets, and backoff behavior.
4. **Agent identity and recovery:** What agent information is stored, what it
   means to resume versus replace an agent, and how recovery behaves when the
   original specialist is unavailable.
5. **HITL protocol:** Which events require a human decision, how questions and
   approvals are persisted, and how the human changes direction safely.
6. **External-system protocol:** How integrations represent provenance,
   credentials, approval boundaries, retries, idempotency, and failure state.
7. **OpenCode mapping:** How the design maps to OpenCode agents, skills,
   permissions, sessions, task delegation, worktrees, and its HTTP/SDK APIs.

## OpenCode Facts Relevant to Later Implementation

- Agent skills are discovered from `.opencode/skills/<name>/SKILL.md` and
  compatible `.agents/skills/<name>/SKILL.md` locations.
- Skill availability can be controlled per agent with pattern-based `skill`
  permissions. Denied skills are hidden from an agent.
- Agents can be configured as primary or subagents with distinct prompts,
  models, permissions, and task-delegation permissions.
- OpenCode exposes session lifecycle, message, question, permission, event,
  and worktree-related operations through its HTTP server and SDK.
- Worktrees isolate branch checkouts and uncommitted changes, but are not a
  complete filesystem or context-security boundary by themselves.
- OpenCode configuration and skill/agent discovery should be validated against
  the installed version when implementation begins; configuration changes may
  require an OpenCode restart.

## Suggested Next Discussion

Begin the first implementation increment: define the component `as-is.md`
task-record schema and status/progress fields. It should record the responsible
agent and acceptance conditions, support recovery without embedding
orchestration policy into every agent prompt, and keep private runtime state out
of the project task record.
