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
  owner: architecture
  parent: null
  updated: 2026-07-26
---

# as-is Project

## Current Task

Define the first version of the `as-is.md` protocol for durable project and
component state.

The staged master-orchestrator implementation plan is maintained in
[orchestration-handoff.md](orchestration-handoff.md).

## Acceptance Criteria

- A root `as-is.md` can express project policy without `as-is.config.json`.
- A descendant `as-is.md` can express both a component task and a scoped policy
  override.
- A new agent can recover a component task from the file without a chat
  transcript or machine-local cache.
- The protocol separates durable project context from transient private runtime
  state.

## Progress

- Established the root file as the project-facing configuration and task-state
  artifact.
- Defined initial default budgets, scheduling, agent, HITL, and logging policy
  in constrained front matter.
- Established the initial design principles and created the setup, naming, and
  knowledge-organization skills.
- Added the documented OpenCode adapter for the repository-local `skills/`
  directory.
- Exposed the three canonical local skills through relative symlinks in
  `.agents/skills/`, the effective discovery path of the installed OpenCode
  wrapper. A fresh process discovered all three skills.
- Ran a fresh, read-only `opencode run` session that loaded and used
  `setting-up-as-is` to inspect the self-hosting integration.
- Planned the next orchestration increment around a durable delegation record,
  a scheduler/check-in contract, an OpenCode execution adapter, and a recovery
  path before implementing a master orchestrator.

## Decisions

- The active machine/user-installed bundle supplies defaults when no bundle is
  selected in project configuration.
- `as-is.md` supersedes the proposed `as-is.config.json` project manifest.
- `as-is.md` is updated during work but is committed only with a coherent,
  reviewable milestone rather than for transient checkpoints.
- User-level state is private and non-authoritative for project task intent. It
  may retain leases, session links, caches, secrets, and verbose logs.
- Repository instructions distinguish reusable skills from scoped agent roles,
  require durable handoffs for delegated work, and reserve independent
  validation for material risk or breadth.
- Reviewed the agent instructions and skills in the sibling `abs-seed` and `at`
  repositories. Adopted their portable safety, durable-context, and validation
  practices without importing project-specific DVC, runtime, model-routing, or
  content-generation contracts.
- The installed OpenCode wrapper overrides configured `skills.paths` with its
  own shared-store and `.agents/skills` paths. Keep the standard OpenCode
  `skills.paths` configuration for compatible hosts, and use relative
  `.agents/skills` symlinks as the non-duplicating adapter for this wrapper.
- OpenCode loads skills only at process startup. Restart OpenCode after changing
  skill content, skill links, or OpenCode configuration; no live reload command
  is available.
- Agents may select design-conformant names within their delegated boundary and
  report material, user-visible choices in their handoff or status report.
- When a non-fixed instruction merits departure, the agent surfaces the
  deviation, alternatives, reasons, and material effects to its caller and
  proceeds only with the required authority. Lower-authority requests cannot
  weaken higher-authority constraints.
- Artifacts, settings, abstractions, processes, and retained state exist only
  for a concrete need. Before removal, assess consumers, recovery or audit
  value, ownership, and recreation cost rather than dropping items by default.
- Delegated agents start with only their assigned component's `as-is.md`.
  Before launch, the orchestrator completes the component task-record protocol;
  broader repository context is supplied only when necessary.
- Transient runtime artifacts are removed after successful implementation unless
  active recovery, audit, or configured retention requires them. Durable task
  outcomes remain in project task records.

## Blockers

- The exact front-matter schema, Markdown section requirements, status values,
  and state-transition rules remain to be defined in a follow-up task.
- The installed OpenCode wrapper ignores project `skills.paths`, including an
  injected path. The `.agents/skills` symlink adapter preserves local discovery,
  but the wrapper's configuration-precedence behavior remains a host-level
  limitation.

## Next Action

Define the durable task-record protocol, including component placement,
delegation inputs, budgets, acceptance conditions, progress, results, and
single-owner claim semantics. This unblocks the scheduler/check-in and OpenCode
execution-adapter increments.
