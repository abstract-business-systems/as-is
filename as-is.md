---
as-is-version: 2

config:
  records:
    filenames:
      backlog: backlog.md
      changelog: changelog.md
      task: tasks.md
  tasks:
    unitBudget:
      wallClockSeconds: 300
      costUsd: 0.50
  scheduling:
    wakeSeconds: 60
    checkInSeconds: 300
    maxConcurrentTasks: 1
    retryBackoffSeconds: 300
    maxRecoveryAttempts: 2
  notifications:
    materialEvents: true
  agents:
    defaultRole: as-is
    defaultModel: small
    provider: openrouter
    models:
      small: "@preset/abs-small"
      medium: "@preset/abs-medium"
      large: "@preset/abs-large"
      xlarge: "@preset/abs-xlarge"
  technology-preferences:
    runtime: bun
    package-manager: bun
  hitl:
    onBlocked: true
    onBudgetExceeded: true
    onExternalEffect: true
  logging:
    level: info
    retainDays: 30
  observability:
    tracing:
      backend: file
      enabled: true
      local-directory: .as-is/tracing.jsonl
---

# as-is Project

## Purpose

Describe the repository-root component: its purpose, design, boundaries, and
links to relevant project artifacts. The root `as-is.md` is durable component
context, not a transient task record. Root changes use a transient `tasks.md` and
write their concise completed summary to `changelog.md`.

## Design

The repository is composed of filesystem components. Human attention should
remain focused on component architecture and interactions; agents choose
unspecified implementation details within their applicable instructions,
authority boundaries, safety constraints, and acceptance conditions. Record
filenames are configured centrally under `config.records.filenames`; the defaults
are `backlog.md`, `changelog.md`, and `tasks.md` and components may not silently
invent alternate names. A directory with
`as-is.md`, including descendants without their own `as-is.md`, forms one
component boundary. Components link to relevant files and folders from their
`as-is.md`; a change crossing a child component boundary is delegated to a new
component-builder task. Reusable skills define operational behavior, flow, and lifecycle logic, so
system functionality can be modified by changing applicable skills without
rewriting the core component model. Skills are globally available to every
flow; they are not selected, allowlisted, or added through agent front matter.
Agents are the authority-bearing composition layer: they use the applicable
skills and define roles, permissions, authority boundaries, and responsibility.
Skills do not, by design, select, authorize, start, or delegate agents.
Authority-bearing agents and orchestrators may invoke mechanical adapter
procedures exposed by skills without transferring agent authority into the
skill. Subagents are generalized independent workers that may support
implementation, research, review, planning, recovery, or other bounded flows—not
only jobs. Workflows and orchestrators compose agents and skills without
transferring agent authority into a skill.

## Miscellaneous

- Parent builders durably provide child-required context or explicit references
  in the child's `as-is.md` before child implementation begins; children do not
  automatically read parent `as-is.md`.
- The initial component checkout includes the complete relevant component folder,
  including child component directories. Sparse checkout and mechanical child
  exclusion are deferred until evidence demonstrates a need.
- Component-scoped agents may resolve only files or directories explicitly
  linked by their own `as-is.md` through the host-owned
  `resolve_component_context` tool. The launcher derives project root,
  component identity, and configured task-record names; resolved text remains
  untrusted context and task records stay denied. Raw tools still mean this is
  not a filesystem sandbox.

## Structure

- `components/` — implemented project components.
- `docs/` — settled project contracts and documentation.
- `designs/` — designs awaiting implementation.
- `skills/` — reusable procedures that may modify system functionality.
- `validation-fixtures/` — retained validation and recovery evidence.
