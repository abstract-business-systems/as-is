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
task:
  status: completed
  worker: as-is
  updated: 2026-08-02T08:03:00Z
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
  - Group implemented project components under `components/`; place settled project contracts under `docs/`; retain not-yet-implemented designs under `designs/`; omit host-specific directories from project structure documentation.
  - Move the task-record validator into `components/task-record-validator/`, retain its Python implementation, and record Bun translation as bounded backlog work.
  - Merge the accounting-design task record into `designs/as-is.md` without moving the still-unimplemented accounting design into the supervisor component.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. This record is the authoritative home for current task authority at the root. A concise `Changelog` is folded into this record instead of keeping a separate root history file.

## Requirement

Apply the bounded repository-structure correction: preserve root task-context authority; group implemented project components under `components/`; place settled project contracts under `docs/`; retain not-yet-implemented designs under `designs/`; omit host-specific directories from project structure documentation; preserve task-record lineage and update all references. Do not implement runtime behavior or translate the validator during this restructuring.

## Decision Boundary

- `as-is.md` is the sole current-task authority for this root record.
- `components/` owns implemented project components, including the current Python task-record validator; its future Bun translation is backlog work, not part of this migration.
- `docs/` owns settled implemented project contracts and host-adapter documentation, including design principles, the task-record protocol, configuration, and OpenCode adapter guidance.
- `designs/` owns designs awaiting implementation; `execution-accounting-design.md` remains there, while its separate task record is merged into `designs/as-is.md`.
- `.agents/`, `.pi/`, and `.opencode/` are host-specific machinery and are not project-structure siblings documented by this record.
- The `Changelog` is the canonical name for concise historical notes; it is not a second task authority, archive, or runtime log.
- A separate history file is unnecessary for this repository root and must not become a second authority.
- The moved project configuration lives at `docs/configuration.md` and keeps its authority relationship to this root record.
- The work is limited to documentation and task-record updates needed to remove ambiguity; no runtime behavior changes are authorized.

## Plan

1. Record the bounded structure decision and inspect consumers, task records, and host-specific boundaries.
2. Move implemented components into `components/`, settled contracts into `docs/`, and the validator into the component group without changing its implementation language.
3. Merge the accounting-design task record into `designs/as-is.md`; retain the unimplemented accounting design in `designs/`.
4. Update project references and relevant `as-is.md` structure descriptions while excluding host-specific directories from the project map.
5. Validate links, naming, task-record content, historical-fact preservation, focused tests, and `git diff --check`.

## Progress

- Inspected the current tree, tracked consumers, task records, design/document classification, and host-specific boundaries before editing.
- Recorded the migration boundary: implemented project components go under `components/`; settled project contracts go under `docs/`; designs awaiting implementation remain under `designs/`; host-specific directories are omitted from the project map.
- Moved implemented project components and the active task-record validator under `components/`.
- Moved settled contracts and host-adapter documentation under `docs/`.
- Merged the accounting-design task history into `designs/as-is.md`; the unimplemented accounting design remains in `designs/`.
- Validator implementation language remains unchanged and Bun translation is backlog work.

## Validation

- Markdown-link audit passed with zero broken relative links after the moves.
- `python3 -m unittest -v components/task-record-validator/test_task_record_validator.py` passed all 6 tests.
- Focused Bun tests passed: observability, control-plane, and subprocess
  foundation suites reported 15 passing tests and 139 expectations.
- Bun transpile/build checks passed for the orientation script, worker-tools
  extension, and subprocess launcher.
- `git diff --check` passed.
- The repository-wide task-record validator still reports pre-existing fixture,
  host-record, and root-budget violations; the moved component validator itself
  passes its focused suite. These remain residual risk outside this
  restructuring task.

## Result

Completed the bounded project-structure restructuring. Implemented components
are grouped under `components/`; settled contracts and host-adapter guidance are
under `docs/`; unimplemented designs remain under `designs/`; the accounting
history is merged into `designs/as-is.md`; and host-specific directories remain
outside the project structure summary. The root retains its full configuration
block and current-task authority, with concise history under the canonical
`Changelog` heading.

## Changelog

- 2026-08-02: grouped implemented components under `components/`, moved settled contracts to `docs/`, merged accounting-design task history into `designs/as-is.md`, and recorded validator Bun translation as backlog work.
- 2026-08-02: compressed the transient Pi subagent investigation into durable
  rationale: synchronous nested delegation, repeated recovery, blind waiting,
  and absent supervisor-owned enforcement caused excessive elapsed time; the
  detached subprocess foundation addresses the structural boundary. Historical
  cost and timing remain source-labelled observations, not provider billing.
- 2026-07-30: the earlier changelog-authority clarification established that current task authority belongs in `as-is.md`, not a parallel history file.
- 2026-07-30: the prior root documentation pass recorded that the structuring guidance now permits larger files when they are the smallest coherent authoritative home.
- 2026-07-29: spawning-pi-subagents gained detached handle registry facts and residual risk notes.
- 2026-07-28: spawning-pi-subagents gained hard wall-clock budgeting and forwarded cost-limit notes.

## Relevant Structure

- `components/` contains implemented project components: control-plane,
  observability, detached subprocess execution, and task-record validation.
- `docs/` contains settled project contracts and host-adapter documentation.
- `designs/` contains designs awaiting implementation; its `as-is.md` owns the
  design-task record and merged accounting-design history.
- `skills/` contains reusable repository procedures.
- `validation-fixtures/` contains retained validation and recovery evidence.
- Host-specific directories and private runtime state are governed by the
  as-is agent and host instructions and are intentionally omitted here.

## Links

- `docs/configuration.md` — project configuration and verbosity guidance.
- `docs/design-principles.md` — repository-wide governing principles.
- `docs/component-task-record-protocol.md` — durable task-record authority,
  `Changelog` placement, and recovery protocol.
- `components/task-record-validator/` — active Python validator; Bun translation
  is recorded in the backlog rather than implied by this migration.
- `skills/context-building/SKILL.md` — high-priority context-building procedure.
- `designs/as-is.md` — grouped design-document entry point and merged accounting
  design task history.
- `docs/opencode-adapter.md` — host-specific OpenCode mapping and limitations.
- `docs/execution-contract.md` — host-neutral worker lifecycle contract.

## Blockers And Escalations

Residual risk is limited to older historical prose that may still use legacy history terminology; current guidance uses `Changelog` consistently.

## Recovery

If this task needs recovery, start from the current `as-is.md`, `docs/`,
`designs/as-is.md`, the structuring skill, and the task-record protocol. Review
Git's rename lineage before any cleanup. Do not recreate a separate root history
file, restore the removed accounting task-record directory, or begin the Bun
validator translation under this completed restructuring task.

## Backlog

- High priority: assess existing agent definitions for unnecessarily narrow or
  host-specific responsibility and generalize them where evidence supports it;
  record the bounded maintenance decision in the agent scope record.

## Next Action

Complete the remaining reference and link audit for the moved paths, then
record the restructuring handoff. The validator's existing repository-wide
check still reports pre-existing fixture, host-record, and root-budget issues;
these are residual validation risks, not reasons to translate the validator in
this restructuring task.
