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
  worker: implementer
  updated: 2026-07-27T07:39:36Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 1
    maximum-children: 7
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Replace separate archive-folder recovery with current root/component records,
    Git history, and concise entries in change-log.md; do not claim Git history
    preserves uncommitted content.
  - Retire the superseded systemd flow after the accepted
    subprocess-execution-foundation handoff, preserve commit 3e54fcd as history,
    and record the uncommitted repair evidence that is not in Git.
  - Update repository instructions, agent definitions, the task-record protocol,
    execution/orchestration specifications, and navigation documents so future
    work does not create task-archives/ or depend on a separate systemd recovery
    path.
  - Keep universal guard clauses intact, do not alter control-plane.md, do not
    launch a worker, and do not modify accepted subprocess implementation code.
  - Validate references, task records, control-plane status, document and agent
    syntax, Git whitespace, and tracked/untracked consumers before handoff.
---

# as-is Project

## Purpose

Maintain the repository-root current task context. Current task state belongs in
this record or in a live component `as-is.md`; historical task state is
recoverable from Git history and summarized, without verbose duplication, in
[`change-log.md`](change-log.md).

## Requirement

Complete the authorized structural migration from separate archive folders to
Git history plus concise change-log entries, and retire the superseded systemd
flow in favor of the accepted subprocess execution foundation. This is a
documentation and task-state migration only. It does not launch an
implementer, change application or accepted component implementation code, or
alter `control-plane.md`.

## Decision Boundary

- The accepted subprocess foundation is the current execution implementation;
  its scoped handoff is commit `e8fb1da` and its component record is terminal.
- The former systemd user-job repair is retired as `cancelled`/`superseded`,
  not completed. Its accepted-scope baseline remains recoverable from commit
  `3e54fcd`; no systemd component record, implementation, archive folder, or
  recovery flow remains active.
- The historical blocked cost-observability fixture and the two unlaunched
  planning records are no longer task descendants. Their status, rationale,
  measured observations, source commits, and recovery points are summarized in
  `change-log.md`. They are not retried, restored, or treated as completed
  current work.
- No existing change-log convention was found during repository inspection.
  `change-log.md` is the smallest subject-named artifact required by the user's
  retention policy. It is a concise historical index, not task authority, a
  backlog, an archive folder, or a replacement for current `as-is.md` records.
  Its concrete acceptance condition is that every retired/deferred item names
  why it changed state, relevant Git commit(s), a recovery point, and any
  necessary fact about uncommitted evidence without secrets or verbose record
  duplication.
- The root remains the nearest common ancestor for this cross-cutting
  documentation/task-state migration. The accepted subprocess component was
  already independently completed; no implementer is launched by this task.

## Plan

1. Inspect all prior archive snapshots, current fixtures, records, instructions,
   agents, host configuration, and code/document consumers.
2. Audit tracked, untracked, and ignored archive/systemd artifacts, including
   ownership, consumers, recovery/audit value, and recreation cost.
3. Preserve the necessary concise facts in `change-log.md`; retain committed
   recovery through Git and do not imply that uncommitted repair files are in
   Git history.
4. Remove archive folders and the retired systemd flow, update current records
   and documents, and leave `control-plane.md` untouched.
5. Run focused reference, record, syntax, status, whitespace, and consumer
   checks; record observations and residual risk before completion.

## Progress

At the inspection checkpoint, the repository had no `change-log.md`,
`CHANGELOG`, or equivalent convention. The tracked archive snapshots contained
two ready but unscheduled planning records and one blocked/no-retry fixture.
The systemd repair archive also contained an untracked blocked record and an
uncommitted adapter/test snapshot. The active systemd implementation paths were
already removed in the working tree but had not yet been replaced by a durable
retirement decision.

The tracked systemd baseline is commit `3e54fcd`; the accepted subprocess
foundation is commit `e8fb1da`. The uncommitted repair snapshot is not
recoverable from Git. Its necessary facts are retained in `change-log.md`: the
record was blocked for worker/session loss, the record-schema indentation and
cleanup-confirmation defects remained unresolved, the validator raised a
`TypeError` on the unavailable cost value, and no current repair validation or
completion evidence existed. The full snapshot is intentionally not duplicated
after the consumer and audit assessment found no supported consumer outside
its own retired adapter/test and historical documentation.

## Validation

`verification-discipline` selected focused structural checks. The path-qualified
reference search found no `task-archives/<item>` or retired adapter path in the
current tree; remaining `task-archives/` mentions are policy prohibitions or
retention instructions. No active systemd command, adapter consumer, or
separate systemd recovery reference remains; the only implementation search hit
is a historical comment in the accepted supervisor and is not an executable
consumer.

- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reported `VALID`.
- `bun control-plane/control-plane.ts status .` reported root `completed`, no
  active tasks, and the configured `maxConcurrentTasks` value `1` from
  repository records only. `bun control-plane/control-plane.ts can-complete . .`
  reported `eligible: true` with no non-terminal or unaccounted failed/cancelled
  descendants.
- `python3 -m unittest -v schemas/task-record-validator/test_task_record_validator.py`
  passed all 6 tests.
- The OpenCode configuration parsed as JSON, and a fresh `opencode agent list`
  exposed `as-is (primary)`, `orchestrator (subagent)`, and
  `implementer (subagent)`; no configuration or agent syntax error was
  observed. Markdown files were inspected for required headings and links.
- `git diff --check` passed with no whitespace diagnostics.
- The tracked/untracked artifact audit found no remaining `task-archives/`
  directory or retired adapter files. A user-systemd unit query found no
  matching retired job and no live retired process. The unrelated untracked
  `control-plane.md` was not changed.

Host-reported monetary cost and cumulative task wall-clock are unavailable;
the numeric compatibility values above are not measured-use claims.

## Result

The migration is complete when the only historical recovery surfaces are Git
history and concise `change-log.md` entries, current task authority remains in
current `as-is.md` records, the retired systemd flow has no active consumer or
live job, and the accepted subprocess foundation remains unchanged. The former
systemd work is accounted for as cancelled/superseded, while the historical
blocked and unlaunched records remain historical evidence rather than hidden
successes.

## Blockers And Escalations

No current task blocker is known. Residual risk: the uncommitted systemd repair
snapshot was not committed and therefore cannot be reconstructed byte-for-byte
from Git; the change log preserves the necessary decision, defect, ownership,
and recovery facts. Future recovery of implementation details would require a
new explicit task based on commit `3e54fcd`, not restoration of an archive
folder or inference from the change log.

## Recovery

Recover this migration from the current root record and `change-log.md`. For
historical committed state, inspect the pre-migration repository checkpoint
`e8fb1da` and the systemd baseline `3e54fcd` with Git. Do not restore or create
`task-archives/`, do not revive the retired systemd flow, and do not infer
uncommitted repair content from Git. If a future authorized task needs any
retired behavior, it must create a new bounded component record at the
appropriate common ancestor and use only current policy plus Git evidence.

## Next Action

None for this completed migration. A fresh OpenCode process is required before
agent-definition changes are expected to affect discovery.
