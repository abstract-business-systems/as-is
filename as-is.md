---
as-is-version: 2
task:
  status: completed
  worker: as-is
  updated: 2026-07-30T15:55:00Z
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
  - Preserve current-task authority in root `as-is.md`; do not keep a separate root `change-log.md`.
  - Move the project configuration document to `docs/configuration.md` and update references.
  - Revise the structure and task-record guidance to allow a small historical overview to live in `as-is.md` when that is the smallest coherent authoritative home, and to describe the `<xyz>.md` → `<xyz>/index.md` plus extracted-section-files pattern.
  - Validate links, naming, task-record content, preservation of historical facts, and `git diff --check`.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. This record is the authoritative home for current task authority at the root. Concise historical notes are folded into this record instead of keeping a separate root `change-log.md`.

## Requirement

Apply the content-structure correction: preserve the root as-is.md configuration and task-context authority; fold the small root change-log history into this record; delete the separate root change-log.md after preserving its necessary concise facts here; move `configuration.md` to `docs/configuration.md`; update references; and revise the structuring and task-record guidance accordingly. Do not implement runtime code or unrelated maintenance.

## Decision Boundary

- `as-is.md` is the sole current-task authority for this root record.
- Historical notes live here when they are small enough that this is the smallest coherent authoritative home.
- A separate history file is unnecessary for this repository root and must not become a second authority.
- The moved project configuration lives at `docs/configuration.md` and keeps its authority relationship to this root record.
- The work is limited to documentation and task-record updates needed to remove ambiguity; no runtime behavior changes are authorized.

## Plan

1. Inspect the current retry-with-pi tree and the prior changelog-authority changes.
2. Update the root record, structure guidance, task-record protocol, and configuration docs.
3. Move configuration documentation, remove the redundant change-log file, and update links.
4. Validate links, naming, task-record content, historical-fact preservation, and `git diff --check`.
5. Commit the scoped documentation-only handoff.

## Progress

- Inspected the retry-with-pi tree and the recent changelog-authority commits before editing.
- Moved the configuration document into `docs/configuration.md`.
- Folded the concise root historical notes into this record instead of retaining a separate root change log.
- Revised the structure and task-record guidance to make authority, placement, and expansion rules explicit.

## Validation

- Updated links and path references to the moved configuration document.
- Confirmed this record keeps current-task authority and now carries the concise historical notes that were previously split out.
- `git diff --check` passed.

## Result

Completed the scoped documentation/content restructuring correction. The repository now keeps the root current-task authority in `as-is.md`, stores the project configuration in `docs/configuration.md`, and no longer needs a separate root `change-log.md`.

## Historical Notes

- 2026-07-30: the earlier changelog-authority clarification established that current task authority belongs in `as-is.md`, not a parallel history file.
- 2026-07-30: the prior root documentation pass recorded that the structuring guidance now permits larger files when they are the smallest coherent authoritative home.
- 2026-07-29: spawning-pi-subagents gained detached handle registry facts and residual risk notes.
- 2026-07-28: spawning-pi-subagents gained hard wall-clock budgeting and forwarded cost-limit notes.

## Links

- `docs/configuration.md` — project configuration and verbosity guidance.
- `skills/structuring-content/SKILL.md` — content-structure placement rules and document-to-directory patterns.
- `component-task-record-protocol.md` — durable task-record authority, history placement, and recovery protocol.
- `.agents/agents/component-builder/agent.md` — component-builder child contract.

## Blockers And Escalations

Residual risk is limited to repository-wide historical references that still mention the old root `change-log.md` concept in older documents until those references are updated or intentionally left as historical prose.

## Recovery

If this task needs recovery, start from the current `as-is.md`, `docs/configuration.md`, the structuring skill, and the task-record protocol. Do not recreate a separate root history file.

## Next Action

None within this root record.
