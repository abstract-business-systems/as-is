---
as-is-version: 2

config:
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
task:
  status: completed
  worker: as-is
  updated: 2026-07-30T16:45:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Preserve current-task authority in root `as-is.md`; use `Changelog` as the canonical name for concise historical notes and never create a separate root history file.
  - Move the project configuration document to `docs/configuration.md` and update references.
  - Revise the structure and task-record guidance to allow a small historical overview to live in `as-is.md` when that is the smallest coherent authoritative home, and to describe the `<xyz>.md` → `<xyz>/index.md` plus extracted-section-files pattern.
  - Validate links, naming, task-record content, preservation of historical facts, and `git diff --check`.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. This record is the authoritative home for current task authority at the root. A concise `Changelog` is folded into this record instead of keeping a separate root history file.

## Requirement

Apply the documentation/task-record correction: preserve the full root configuration block and task-context authority; retain necessary concise history in the canonical `Changelog` section; update references and organization guidance; and do not implement runtime code or unrelated maintenance.

## Decision Boundary

- `as-is.md` is the sole current-task authority for this root record.
- The `Changelog` is the canonical name for concise historical notes; it is not a second task authority, archive, or runtime log.
- A separate history file is unnecessary for this repository root and must not become a second authority.
- The moved project configuration lives at `docs/configuration.md` and keeps its authority relationship to this root record.
- The work is limited to documentation and task-record updates needed to remove ambiguity; no runtime behavior changes are authorized.

## Plan

1. Inspect the current retry-with-pi tree and the prior changelog-authority changes.
2. Update the root record, structure guidance, task-record protocol, and configuration docs.
3. Update documentation, records, skill/agent entry points, design links, and canonical terminology.
4. Validate links, naming, task-record content, historical-fact preservation, and `git diff --check`.
5. Commit the scoped documentation-only handoff.

## Progress

- Inspected the retry-with-pi tree and the recent changelog-authority commits before editing.
- Moved the configuration document into `docs/configuration.md`.
- Folded the concise root historical notes into this record instead of retaining a separate root change log.
- Revised the structure and task-record guidance to make authority, placement, and expansion rules explicit.

## Validation

- Updated links and path references to the moved configuration document and
  grouped design documents; targeted Markdown-link audit passed after correcting
  moved-document relative paths.
- Confirmed this record keeps current-task authority, preserves the full root
  scheduling configuration, and carries the concise historical notes that were
  previously split out.
- `bun test skills/as-is/scripts/orient.test.ts` passed; the orientation script
  now reads the canonical root `Changelog` and no live separate history-file
  reference remains.
- `git diff --check` passed; branch ancestry remains based on `d09f5ea` and the
  reviewed child content is integrated in the local handoff commit.
- The repository-wide task-record validator reports pre-existing fixture and
  root-budget violations (including `.pi/prompts`, version-1 records, and the
  root's zero delegation budget); these are outside this bounded documentation
  correction and are retained as residual risk.

## Result

Completed the scoped documentation/task-record restructuring correction. The root retains its full configuration block and current-task authority, with concise history under the canonical `Changelog` heading.

## Changelog

- 2026-07-30: the earlier changelog-authority clarification established that current task authority belongs in `as-is.md`, not a parallel history file.
- 2026-07-30: the prior root documentation pass recorded that the structuring guidance now permits larger files when they are the smallest coherent authoritative home.
- 2026-07-29: spawning-pi-subagents gained detached handle registry facts and residual risk notes.
- 2026-07-28: spawning-pi-subagents gained hard wall-clock budgeting and forwarded cost-limit notes.

## Links

- `docs/configuration.md` — project configuration and verbosity guidance.
- `skills/structuring-content/SKILL.md` — content-structure placement rules and document-to-directory patterns.
- `component-task-record-protocol.md` — durable task-record authority, `Changelog` placement, and recovery protocol.
- `.agents/as-is.md` — agents-scope organization and backlog.
- `skills/context-building/SKILL.md` — high-priority context-building procedure.
- `designs/as-is.md` — grouped design-document entry point.
- `.agents/agents/component-builder/agent.md` — component-builder child contract.

## Blockers And Escalations

Residual risk is limited to older historical prose that may still use legacy history terminology; current guidance uses `Changelog` consistently.

## Recovery

If this task needs recovery, start from the current `as-is.md`, `docs/configuration.md`, the structuring skill, and the task-record protocol. Do not recreate a separate root history file.

## Backlog

- High priority: assess existing agent definitions for unnecessarily narrow or
  host-specific responsibility and generalize them where evidence supports it;
  record the bounded maintenance decision in the agent scope record.

## Next Action

None within this root record; the detached orientation helper still expects a
legacy history file and is outside this documentation-only change boundary.
