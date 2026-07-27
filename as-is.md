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
  worker: orchestrator
  updated: 2026-07-28T01:30:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 2
    maximum-children: 8
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add budget enforcement (wall-clock time and monetary cost) to the
    spawning-pi-subagents launcher so that a child Pi process given budget
    limits stops the current action and returns when a limit is reached, rather
    than running unbounded.
  - Let a delegating agent forward time and money constraints to the executing
    agent through the launcher, and record that the constraints were passed so a
    parent can account for a budget-stopped return.
  - Preserve the existing launcher contract (agent file, task, cwd, model,
    tools, skills, approve flags, dry-run, private system-prompt handoff,
    JSON/print/no-session mode) and do not weaken the skill's stated
    non-properties unless this task explicitly implements them.
  - Keep the change dependency-free and Bun/TypeScript-compatible per the
    centrally supplied runtime preference; do not add a host integration,
    credential, or external service dependency.
  - Do not modify control-plane.md, the retired systemd lineage, accepted
    component implementation code, or the execution-accounting-design
    specification; update the spawning-pi-subagents SKILL.md and agent
    guidance only as needed to document the new budget surface.
  - Validate the launcher syntax/dry-run, the new budget behavior with the
    smallest deterministic focused check, task-record validity, and
    git diff --check before handoff; record residual risk, host-reported cost,
    and host-observed wall-clock use.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. Current task state belongs in
this record or in a live component `as-is.md`; historical task state is
recoverable from Git history and summarized, without verbose duplication, in
[`change-log.md`](change-log.md).

## Requirement

Add budget enforcement through the pi-subagent so that a delegated Pi child
process accepts time (wall-clock) and money (cost) limits, stops the current
action, and returns when a limit is reached. Any delegating agent must forward
these constraints to the executing agent through the launcher. The prior root
migration (archive folders to Git history plus `change-log.md`) is terminal and
committed; its history is recovered from `change-log.md` and commits
`d6b03b7` and `e8fb1da`, not from this record.

## Decision Boundary

- The `spawning-pi-subagents` skill previously disclaimed hard budgets,
  watchdog enforcement, and non-blocking launch acceptance. This task closed
  the hard wall-clock budget gap for the synchronous launcher path only; it
  did not add a detached supervisor, restart reconciliation, or non-blocking
  launch acceptance. Cost enforcement is forwarded, not launcher-observed.
- The accounting substrate (path/revision/attempt identity, parent/child
  budget ownership, unavailable-observation semantics) is defined by
  `execution-accounting-design.md` and its terminal component record; this task
  implements enforcement, not a new accounting model.
- The accepted `control-plane` Bun implementation and
  `subprocess-execution-foundation` supervisor remain unchanged.
  `control-plane.md` is a pre-existing untracked file and stays untouched.
- The retired systemd lineage stays retired; no archive folder or systemd
  recovery path is created or depended on.
- The root is the nearest common ancestor for any cross-cutting integration
  edits (launcher plus agent guidance). Bounded implementation work is routed
  to the orchestrator, which creates the component record and delegates to the
  configured worker; as-is does not implement the component-domain change.

## Plan

1. Recover current root and component records, the spawning-pi-subagents skill,
   execution-accounting-design, control-plane, and Git history before scoping.
2. Record this new task in the root durable context and route the bounded work
   to `.agents/agents/orchestrator.md` through the spawning-pi-subagents
   launcher; do not launch an implementer directly.
3. The orchestrator creates the component `as-is.md`, delegates to the
   configured worker, and the worker implements budget flags, enforcement, and
   constraint forwarding in the launcher plus minimal SKILL.md/agent guidance
   updates.
4. On return, reread the component record, assess validation and residual risk,
   perform any nearest-common-ancestor integration, and commit only the scoped
   completed handoff.

## Progress

The root migration task is terminal and committed; this record carried the
budget-enforcement task as current context per the replaceable-context policy.
The orchestrator created the component record at
`skills/spawning-pi-subagents/as-is.md`, delegated it to the configured
`implementer` through the spawning-pi-subagents launcher, and the implementer
completed the scoped handoff in commit `9dc2090`. The orchestrator then
reread the component record, independently re-ran the required validations,
and performed nearest-common-ancestor integration by recording the finalized
handoff in `change-log.md` and this root record. The component record is
`completed` with no descendants; the bounded task is terminal.

## Validation

`verification-discipline` selected delegation, component-handoff, and
integration checks for this turn. The delegation target was the configured
`orchestrator` agent file; no implementer was launched directly from the root.
The component record front matter parses as a version-2 task record and the
orchestrator independently confirmed the worker's validation:

- Launcher syntax build (`bun build --no-bundle --target bun`) transpiled
  cleanly.
- `--dry-run` emits a `budget` object with `wall-clock-seconds` and `cost-usd`
  (values when supplied, `null` when unset) alongside the unchanged contract
  fields.
- Smallest deterministic focused enforcement check (no provider contact): a
  stub `pi` sleeping 30s with `--budget-wall-clock-seconds 1` returned in
  ~1030ms with exit `124` and stderr `as-is budget-stopped: limit=wall-clock
  seconds=1 exit=124`; no lingering child process remained.
- Regression: a non-budget stub exiting `7` forwarded exit `7` and stdout
  unchanged; negative budget values are rejected.
- Tree-wide `python3 schemas/task-record-validator/task_record_validator.py .`
  reports the pre-existing `INVALID` set only (mixed agent-record shape,
  root-only `config`, legacy skill-record fields, aggregate descendant
  issues); no error mentions `skills/spawning-pi-subagents`, and the committed
  change introduces no new validator error.
- `git diff --check` over the committed change and the working tree is clean.

Host-reported monetary cost for the implementer run was observed in the Pi
JSON stream (~$0.012) but is not directly observable to the launcher or
component record; the component record records cost `unavailable` with
worker-subtree wall-clock `150` seconds. Root-own orchestration cost remains
unavailable.

## Result

Completed. The synchronous `spawning-pi-subagents` launcher now enforces a
hard wall-clock budget at the process level (SIGTERM then SIGKILL on the child
process group, with a distinguishable exit `124` and `as-is budget-stopped`
stderr marker), forwards wall-clock and cost constraints to the executing
agent through the private system-prompt handoff, and records the forwarded
budget in `--dry-run` output so a parent can account for a budget-stopped
return. The existing launcher contract is preserved; the change is
dependency-free and Bun/TypeScript-compatible. SKILL.md and the orchestrator
agent guidance document the new surface. The single descendant
`skills/spawning-pi-subagents` is terminal (`completed`); no failed or
cancelled descendant requires accounting. Scoped worker commit: `9dc2090`.

## Blockers And Escalations

No blocker. Residual risk: the launcher enforces a true wall-clock hard stop,
but Pi monetary cost is not directly observable from the launcher; cost
enforcement is forwarded to the child for self-limiting and is an
approximation that a child could overrun before self-limiting. The wall-clock
budget bounds only the child run (not prompt preparation or `--dry-run`) and
has a short SIGKILL grace after SIGTERM. Tree-wide task-record validity
remains pre-existing `INVALID` for unrelated records outside this task's
scope. If the orchestrator target had been unavailable, a durable blocker
would have been recorded rather than substituting a role.

## Recovery

Recover this task from the current root record and `change-log.md`. For the
prior terminal migration, inspect commits `d6b03b7` and `e8fb1da` with Git. Do
not restore or create `task-archives/`, do not revive the retired systemd flow,
and do not infer uncommitted repair content from Git. If the orchestrator
return is interrupted, reread this record and the component `as-is.md` the
orchestrator created before resuming.

## Next Action

The bounded budget-enforcement task is complete and committed. The scoped
completed handoff (root record plus change-log entry) is ready for commit via
`committing-completed-work`. No further implementer launch is required.
