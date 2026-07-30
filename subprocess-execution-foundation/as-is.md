---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T07:23:55Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 7.879676
      reserve-seconds: 30
      source: host monotonic timer around focused supervisor validation; prior recovery attempts unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Implement the dependency-free supervisor-owned detached subprocess boundary
    without waiting for worker completion in the submitting turn.
  - Preserve component-record authority, configured
    as-is -> orchestrator -> implementer attribution, durable lifecycle evidence,
    cancellation, stale detection, bounded recovery, accounting, and cleanup.
  - Validate the lifecycle, permission, attribution, and cleanup boundaries with
    harmless local evidence and record source-labelled cost, wall-clock, and risk.
  - Keep historical recovery in Git and concise `Changelog` entries; do not depend
    on an archive folder or a separate retired-systemd recovery path.
  - Complete only this component's scoped handoff and account for descendants.
---

# Subprocess Execution Foundation

## Purpose

Own the cross-cutting, host-neutral launch foundation that submits a bounded
worker attempt without making the submitting as-is/OpenCode/orchestrator turn
wait for worker completion.

## Requirement

Implement and validate a supervisor-owned detached subprocess or equivalently
supported server-job boundary that preserves task-record authority,
component-only context, configured-role mediation, durable lifecycle evidence,
cancellation, stale detection, bounded recovery, cumulative accounting, and
private-runtime cleanup. A subprocess API such as `Bun.spawn` alone is only a
launch primitive.

## Plan

Use a dependency-free Bun/TypeScript supervisor with a POSIX process-group
boundary, atomic durable checkpoints, source-labelled observations, and a
disposable private runtime. Validate each acceptance boundary with harmless
local fixtures, then leave the terminal handoff in this record. The previous
systemd flow is not a dependency, fallback, or recovery task; its historical
disposition is in the canonical `Changelog` section and its committed baseline is Git commit
`3e54fcd`.

## Progress

The component record was created atomically for the configured `implementer`.
An initial attempt and two failed-to-return recovery requests remain preserved
as historical blockers in Git history and the prior record revisions; they were
not silently retried or converted to success. One explicitly authorized
configured-worker recovery completed the existing lineage on 2026-07-27. No
descendant was delegated, no real implementer task was launched, and no
repository runtime state was created.

## Validation

- `bun --check supervisor.ts` passed.
- The focused test artifact build passed, and `bun test supervisor.test.ts`
  reported `10 pass`, `0 fail`, and `106 expect()` calls.
- Tests covered durable launch acceptance before worker start,
  return-before-completion, POSIX `setsid` process-group ownership, approved
  `0700` workspace and disabled stdin, source-labelled logs/events, lifecycle
  polling, watchdog and stale/unknown classification, durable cancellation,
  bounded recovery, repeated-blocker suppression, cumulative unavailable cost,
  handoff evidence, and cleanup.
- Role checks accepted only machine-observable
  `as-is -> orchestrator -> implementer` attribution and rejected direct,
  wrong-role, missing-parent, and unattributed events.
- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reported `VALID` before the terminal
  handoff.
- `bun control-plane/control-plane.ts status .` read repository records and
  reported this component `completed` with no active task.
- An independent process check reported no foundation supervisors, and the
  owned temporary `/tmp/as-is/` runtime was absent after validation.

Host-reported monetary cost is unavailable. The final focused validation
observed `7.879676` seconds with a host monotonic timer; prior failed attempts'
cost and wall-clock remain unavailable rather than being represented as zero.
Residual risk is limited to POSIX `setsid`, host usage attribution, and the
unproven OpenCode live user-event bridge; the component does not claim those
unsupported host capabilities.

## Result

The detached subprocess execution foundation is complete in the scoped files
`supervisor.ts`, `supervisor.test.ts`, and this record. Scoped handoff commit:
`e8fb1da`. It is the accepted current foundation. The former systemd flow is
retired/superseded and is not an active fallback or separate recovery path; its
historical baseline and necessary retirement facts are recorded in
the canonical `Changelog` section.

## Blockers And Escalations

No current component blocker remains. Historical worker/session-loss,
failed-to-return, and permission/liveness observations remain lineage rather
than new work. The host does not provide provider/model billing, and the
OpenCode synchronous CLI does not prove a live user-event bridge; these are
residual risks, not reasons to reopen this terminal component.

## Recovery

On interruption, recover the current component record and inspect the scoped
handoff in Git. Historical committed implementation is available at `e8fb1da`;
the prior systemd baseline is available at `3e54fcd`, with its retirement
decision summarized in the canonical `Changelog` section. Do not restore historical task folders,
reopen this terminal record, or infer completion from process exit or private
runtime absence. A future change requires a new authorized bounded task.

## Next Action

None within this component. Parent-level documentation/task-state integration
may consume this terminal handoff without modifying the implementation files.
