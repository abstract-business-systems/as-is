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
- Durable state belongs in a user-level state directory, not in the target
  repository. The project receives no runtime-state files by default.

### Hierarchical Component Model

- The project itself supplies the hierarchy. Directories represent components.
- A change to a component is a task at that component directory level.
- At any instant, there is exactly one active task, including its task record,
  for a directory. That task may lead to subtasks in descendant directories.
- Subtasks are recorded in a state-tree directory that mirrors the relevant
  repository subdirectory, not as an arbitrarily deep nested structure inside
  the parent task file or as runtime files in the project itself.
- Work that spans multiple components is performed at their nearest common
  ancestor rather than by cross-component delegation.
- “Co-existing” refers to tasks existing alongside the component being built,
  not to concurrent, independent tasks competing for the same directory.

### Task and Progress Protocol

- The core protocol is deliberately minimal: the presence of task-status and
  progress records in the filesystem makes the work visible and recoverable.
- The task/progress file format is configurable. Do not choose JSON, YAML,
  Markdown, a filename convention, or a locking scheme prematurely.
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
- A target project has one authored as-is entry point at its root: `as-is.md`.
  It supplies project policy and durable task context.
- The core provides a versioned default for every supported setting. The
  manifest overrides policy explicitly, while generated runtime state remains
  separate and non-authoritative.
- Component-local policy uses scoped overrides declared in that same root
  manifest; components do not discover additional configuration files.
- Extensions are supplied by the selected bundle and are declared, ordered, and
  configured through the project manifest. Changing a project's bundle is the
  controlled way to change its available extension set.
- The configuration API is strict and versioned. Unknown core fields fail
  validation rather than silently changing automation behavior.
- Schema validation, separation of generated state from project policy, and
  HITL approval for irreversible external effects are fixed invariants, not
  overrideable preferences.
- Environment variables may resolve named secrets but do not override manifest
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

## Open Design Questions

These decisions were explicitly deferred and should be discussed before
implementation.

1. **Task-file schema:** Minimal required fields, marker semantics, naming and
   placement, timestamps, versioning, and whether status is represented by file
   presence, file content, or both.
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

Define the task-file and progress-marker schema within the established
configuration boundary. It should use the configured state path, record the
responsible agent and acceptance conditions, and support recovery without
embedding orchestration policy into every agent prompt.
