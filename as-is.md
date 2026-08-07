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

```mermaid
flowchart TD
    USER[User intent] --> ROUTER[as-is agent]
    ROUTER --> RECORDS[Durable as-is.md and tasks.md records]
    RECORDS --> SCOPE[Select lowest owning component]
    SCOPE --> AGENT[Authority-bearing agent]
    AGENT --> SKILLS[Reusable skills]
    SKILLS --> WORK[Bounded implementation or evidence work]
    WORK --> VALIDATE[Validation]
    VALIDATE --> HANDOFF[changelog.md and scoped Git commit]
    HANDOFF --> REPORT[Parent/user result]
    SCOPE --> CHILD{Child has its own as-is.md?}
    CHILD -- No --> LOCAL[Keep work in current boundary]
    CHILD -- Yes --> DELEGATE[Delegate child component-builder]
    DELEGATE --> RECORDS
    CONFIG[Root configuration\nrecords, budgets, agents, runtime] -. governs .-> RECORDS
    OBS[Logs, sessions, JobIds] -. supplementary evidence .-> REPORT
```

The repository is composed of filesystem components. Each `as-is.md` describes
one component's current purpose, design, boundary, and links. Durable records
hold project context and task state; agents hold authority; skills provide
reusable procedures; and host runtime artifacts provide observation only. A
component owns its directory and delegates work when a descendant has its own
`as-is.md` boundary.

## Structure

- `components/` — implemented project components.
- `docs/` — settled project contracts and documentation.
- `designs/` — designs awaiting implementation.
- `skills/` — reusable procedures that may modify system functionality.
- `validation-fixtures/` — retained validation and recovery evidence.
