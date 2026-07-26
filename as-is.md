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
  updated: 2026-07-26T13:35:44Z
---

# as-is Project

## Current Task

Strengthen completion semantics and make a completed `as-is.md` produce a scoped
durable commit, while recording execution-model fit as a design principle.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- Parent records cannot become `completed` while a descendant is non-terminal.
- A completed record's scoped handoff is committed without staging unrelated
  work.
- Agent instructions use the shared verification and completion procedures.
- Design principles distinguish deterministic enforcement from generative work.

## Progress

- The earlier `structuring-content` rename is complete.
- The minimal execution envelope was defined and the configured `implementer`
  completed the generated `verification-discipline` component record.
- The parent exposed the new skill through the installed OpenCode wrapper's
  `.agents/skills` adapter and repaired its stale `structuring-content` link.
- Completion closure, scoped automatic committing, and execution-model fit are
  now defined and exposed to both OpenCode agents.

## Decisions

- `verification-discipline` is the canonical cross-cutting capability name from
  `agent-skills.md`; it composes task-specific tools and evidence rather than
  replacing specialist validation procedures.
- A timestamp remains required because stale-work detection and check-ins need
  a durable ordering signal; it is not evidence of cost, elapsed work, or
  completion.
- Completion and commits are governed by focused skills. A broad "maintain
  components" skill would mix unrelated responsibilities and obscure their
  verification boundaries.
- Universal repository rules remain centrally supplied read-only context. Child
  records carry only the bounded requirement and task-specific effective
  constraints, not a duplicate of universal rules.
- A future OpenCode adapter should prefer subagents when their lifecycle and
  attributable usage capabilities satisfy the execution contract; a separate
  process remains a bounded fallback rather than a cost-accounting solution.

## Blockers

- Per-component actual cost is not available from the current OpenCode CLI;
  component records retain the fallback metric and do not present estimates as
  actual cost.
- Constraint weakening and child-budget enforcement are currently agent
  instructions, not machine-validated protocol checks.

## Validation

- `git diff --check` completed successfully.
- Fresh `opencode debug agent orchestrator` and `opencode debug agent
  implementer` runs load the completion and verification instructions.
- Fresh `opencode debug skill` discovery lists
  `committing-completed-work` from its `.agents/skills` adapter.
- The only descendant record, `skills/verification-discipline/as-is.md`, has
  `status: completed`; no failed or cancelled child needs parent accounting.

## Result

- Added `committing-completed-work`, which stages and commits only a completed
  task's scoped durable handoff after validation and descendant closure.
- Removed the blanket no-commit rule while preserving prohibitions on amend,
  push, branch, and remote changes.
- Made descendant closure a completion precondition in the protocol, repository
  instructions, and OpenCode agent prompts.
- Kept RFC 3339 task timestamps as a state and stale-work signal, not completion
  or cost evidence.
- Recorded deterministic enforcement versus nondeterministic generative work as
  a project design principle.

## Next Action

Implement the machine-validatable authority and child-budget checks needed to
finish Increment 2.
