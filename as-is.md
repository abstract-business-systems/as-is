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
  updated: 2026-07-26
---

# as-is Project

## Current Task

Rename the repository-content structure skill to the more accurate
`structuring-content` capability name.

## Purpose

Keep the repository's structure, durable specifications, and component task
records understandable as the system evolves and expands through delegation.

Permanent implementation references:

- [Orchestration Design](orchestration-design.md)
- [Component Task-Record Protocol](component-task-record-protocol.md)

## Acceptance Criteria

- The skill directory, front matter, heading, durable references, and OpenCode
  adapter all use `structuring-content`.
- The previous skill name has no remaining live reference.

## Progress

- The prior name was accurate but unnecessarily tied the skill to repository
  knowledge rather than its actual capability: structuring content.

## Decisions

- `structuring-content` is the narrowest accurate capability phrase for arranging
  sections, files, directories, and component boundaries.

## Blockers

- None.

## Result

- Renamed the canonical skill and installed OpenCode adapter to
  `structuring-content`.
- Updated the skill's front matter, heading, and description to express its
  content-structuring capability.
- Confirmed no live reference to either prior skill name remains.

## Next Action

Validate this rename, then resume defining the central execution envelope and
bounded delegation mechanics.
