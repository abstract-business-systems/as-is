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
  worker: component-builder
  updated: 2026-07-29T12:22:18Z
constraints:
  cost:
    currency: USD
    allocated: 0.60
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 2
    maximum-children: 8
  execution:
    wall-clock:
      allocated-seconds: 480
      spent-seconds: 180
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add a detached handle registry to the spawning-pi-subagents launcher: when
    `--detach` launches a child, append the handle JSON as one line to a
    discoverable registry file so any agent or supervisor can find active and
    past detached jobs by scanning one file.
  - The registry path resolves from `AS_IS_JOBS_REGISTRY` if set, otherwise
    defaults to `/tmp/as-is-jobs.jsonl`. Appends are best-effort and must not
    fail the launch if the registry is unwritable (log a stderr note and
    continue).
  - Add a `--no-registry` flag that suppresses the registry append for a
    detached launch.
  - Add a deterministic focused test (no real Pi provider contact): launch
    `--detach` with a stub `pi` and assert the registry file receives a line
    whose parsed JSON contains the handle's `jobId` and `pid`.
  - Update the `spawning-pi-subagents` SKILL.md `Detach Mode` section to
    document the registry path, the env override, and the `--no-registry`
    flag.
  - Preserve the existing launcher contract (agent file, task, cwd, model,
    tools, skills, approve, dry-run, blocking mode, detach mode, budget
    surface, private system-prompt handoff). Do not weaken the skill's stated
    non-properties unless this task explicitly implements them.
  - Keep the change dependency-free and Bun/TypeScript-compatible per the
    centrally supplied runtime preference.
  - Validate with `bun build`, `bun test` of the launcher test file,
    `--dry-run --detach` (confirm `detach: true` and unchanged handle shape),
    and `git diff --check` before handoff; record residual risk and
    host-observed wall-clock use.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. Current task state belongs in
this record or in a live component `as-is.md`; historical task state is
recoverable from Git history and summarized, without verbose duplication, in
[`change-log.md`](change-log.md).

## Requirement

Add a detached handle registry to the `spawning-pi-subagents` launcher so that
every `--detach` launch appends its handle to a single discoverable file. This
closes the "durable handle registry" gap recorded as unavailable in the skill and
in `independent-delegation.md` open decision #1: handles currently live only in
ephemeral `/tmp/as-is-child-*/` job directories with no index.

## Decision Boundary

- The launcher already implements `--detach` (fire-and-forget handle, detached
  budget supervisor, log + record as observation surfaces) and the blocking
  budget surface. This task adds only the registry append on detach; it does not
  add restart reconciliation, watchdog beyond the wall-clock budget, hard
  cost-budget enforcement at the launcher, or cancellation ownership.
- The registry is a best-effort observable index, not task authority. The
  component `as-is.md` record and `change-log.md` remain authoritative; the
  registry must not become a second task tree.
- Cost enforcement remains forwarded to the child for self-limiting; Pi cost is
  not directly observable from the launcher.
- The root is the nearest common ancestor for any cross-cutting integration
  edits. Bounded implementation work is routed to `component-builder`, which
  creates or reuses the component record at
  `skills/spawning-pi-subagents/as-is.md` and implements within that component
  directory only.

## Plan

1. Recover current root and component records, the launcher source and test,
   the SKILL.md, and `independent-delegation.md` before scoping.
2. Record this task in the root durable context and route the bounded work to
   `.agents/agents/component-builder.md` through the spawning-pi-subagents
   launcher; do not launch a worker directly.
3. The component-builder advances the component record to `active`, implements
   the registry append, the `--no-registry` flag, the focused test, and the
   SKILL.md update within the component directory.
4. On return, reread the component record, assess validation and residual risk,
  perform any nearest-common-ancestor integration, and commit only the scoped
  completed handoff.

## Progress

Task was routed to `component-builder` through the spawning-pi-subagents
launcher with `--approve` and `read,grep,find,ls,bash,edit,write` tools. The
component-builder completed and committed the bounded implementation as
`6e9a7e1` (`Add detached job handle registry`). The prior budget-enforcement
task remains terminal and committed (`9dc2090`, `07be8b4`); its history is
recovered from `change-log.md` and Git, not from this record.

## Validation

- `bun test` passed.
- Bare `bun build` was run and exited 1 because no entrypoint was supplied;
  the task-specific launcher build (`bun build --no-bundle --target bun
  --outfile /tmp/as-is-spawn-pi-subagent.js
  skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`) passed.
- `git diff --check` passed.
- `python3 schemas/task-record-validator/task_record_validator.py .` was run; its result is recorded as a pre-existing tree-wide validator failure outside this bounded integration.
- Focused component evidence recorded registry append, detach dry-run/handle shape, and deterministic stub coverage without provider contact.
- Host-observed worker-subtree wall-clock was approximately 150 seconds; this root execution is approximately 180 seconds including orchestration. Host-reported cost is unavailable.

## Result

Completed root integration of the detached handle registry handoff from commit
`6e9a7e1`. The component implementation appends one handle JSON line to
`AS_IS_JOBS_REGISTRY` (default `/tmp/as-is-jobs.jsonl`), tolerates registry
write failure, and supports `--no-registry`; its documentation and focused test
are included. No additional root implementation was needed.

## Blockers And Escalations

No current blocker. Residual risk: registry writes are intentionally
best-effort, so an unwritable or concurrently contended registry can omit a
handle; orphan detection/recovery is not solved, and the registry is an
observation index rather than task authority. Detached wall-clock use is not
surfaced to the parent as a first-class observation. Pi monetary cost remains
unavailable to the launcher and is only self-limited by the child. The
component record also retains pre-existing unrelated tree-wide task-record
validator findings.

## Recovery

Recover this completed integration from this record, `change-log.md`, the
component record at `skills/spawning-pi-subagents/as-is.md`, and commit
`6e9a7e1`. If verification must be repeated, rerun the listed checks; do not
create `task-archives/` or revive the retired systemd flow.

## Next Action

No further action for this bounded task. Future work may address orphan
reconciliation and parent-visible wall-clock accounting.
