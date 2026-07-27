---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T11:47:31Z
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
      spent-seconds: 35.749667
      reserve-seconds: 30
      source: host monotonic timer around final validation and repeated cleanup bundles
  external-effects: require-current-turn-user-approval
acceptance:
  - Identify why the watchdog failure checkpoint can lack the required
    source-labelled `supervisor-watchdog` attribution, and repair the source at
    the correct durable checkpoint boundary without weakening source-label
    requirements.
  - Preserve generic supervisor behavior, configured role attribution,
    parent-link validation, cumulative accounting, durable identity, lifecycle,
    cancellation, stale/recovery, and cleanup contracts.
  - Change only `supervisor.ts`, `supervisor.test.ts`, and this repair record;
    do not modify the accepted status-watch implementation or its uncommitted
    focused-test repair, parent/root records, adapter, systemd, control-plane,
    accounting, permission UI, SSH-disconnect, historical, or live mediation
    work.
  - Run the full supervisor suite, the component-status-watch focused suite,
    the opencode-launch-adapter focused suite, syntax/build checks, focused
    task-record validation, and independent repeated cleanup/no-leftover-
    process checks.
  - Complete only this new repair incarnation after validation and descendant
    closure, then commit its scoped handoff with `committing-completed-work`.
---

# Subprocess Supervisor Repair

## Purpose

Repair the accepted, host-neutral detached supervisor at the smallest durable
checkpoint boundary required by the watchdog regression exposed during
`component-status-watch` recovery. This is a new bounded task incarnation for
the existing component, not a reopening or mutation of its completed lineage.

## Requirement

The required regression is at
`subprocess-execution-foundation/supervisor.test.ts:332`: the durable `failure`
checkpoint is expected to expose `details.source: supervisor-watchdog`, but the
observed value is undefined. Determine whether concurrent watchdog and worker
completion paths are selecting or writing the wrong checkpoint, then make the
smallest implementation/test repair that preserves the source-label contract.
The generic supervisor must continue to own detached lifecycle, process-group
control, role/parent validation, cumulative accounting and identity, durable
checkpoints, cancellation, bounded recovery, and cleanup.

Named validation dependencies are the read-only
`component-status-watch/status-watch.test.ts` repair, its component record,
`opencode-launch-adapter/adapter.test.ts`, the task-record validator, and the
repository's applicable specifications. Repository instructions, design
principles, and permitted skills are centrally supplied read-only context.

## Component And Lineage Boundary

The component path remains `subprocess-execution-foundation`; its parent is the
repository root. The prior completed task record and implementation are
recoverable from Git commit `e8fb1da`, whose accepted scoped handoff remains
valid historical lineage. This current `as-is.md` replaces that terminal record
only because this explicitly authorized new bounded repair task has started; it
does not reopen, rewrite, or erase the prior handoff. No archive task tree or
second runtime authority is permitted.

The worker may change only this component directory's supervisor implementation,
supervisor tests, and this current repair record. The uncommitted
`component-status-watch/status-watch.test.ts` repair remains preserved and is
not part of this handoff.

## Plan

1. Reproduce and inspect the watchdog failure event sequence and the durable
   checkpoint writer/reader boundary, distinguishing implementation behavior
   from a test observation race.
2. Repair only the source attribution at the correct durable checkpoint
   boundary; retain explicit source labels rather than weakening or removing
   the assertion. Add or adjust focused regression coverage only inside this
   component.
3. Run the requested supervisor, status-watch, adapter, syntax/build,
   task-record, and independent cleanup checks. Record host-observed elapsed
   time, unavailable monetary cost, evidence, and residual risk before handoff.

## Progress

The orchestrator created this repair record atomically after reading the root
and component records, the uncommitted status-watch test repair, accepted
supervisor commit `e8fb1da`, status-watch handoff `85116d5`, and the exact
watchdog regression. The configured worker is `implementer`; no child
delegation is permitted. The active status-watch record remains a separate
blocked recovery with its test repair uncommitted and must not be retried by
this task.

## Validation

Direct reproduction before the repair was observed on the first run of
`bun test subprocess-execution-foundation/supervisor.test.ts`: 8 tests passed and
2 failed. At line 332, the assertion received `undefined` for
`failure.details.source`. The writer/reader boundary was the detached
supervisor's worker-exit finalization: its private state was atomically changed
to host status `failed` before the durable `failure` checkpoint was appended.
`observe()` and the status watch read private state and the durable record in
separate operations, so a reader could return the terminal host state while the
failure event was not yet present. The watchdog writer had already published
`watchdog-deadline-exceeded` with durable status `failed`; this was a
concurrency/readiness race, not an absent source constant.

The smallest repair was made in `supervisor.ts`: the final durable
`failure`/`host-completed`/`cancellation-confirmed` checkpoint is now written
before the private `worker-exited` state update exposes the terminal host
status. The explicit `source` remains `supervisor-watchdog` for watchdog
failures and `host-process` otherwise. `supervisor.test.ts` was inspected and
its source-labelled assertion was preserved unchanged; no test weakening or
test-file edit was needed.

Authoritative final validation evidence:

- Final bundle measured `10.361879` monotonic seconds and ran the full
  `bun test subprocess-execution-foundation/supervisor.test.ts` suite: `10
  pass`, `0 fail`, `106 expect() calls`; the watchdog test passed.
- The preserved uncommitted repair was used by
  `bun test component-status-watch/status-watch.test.ts`: `4 pass`, `0 fail`,
  `46 expect() calls`.
- `bun test opencode-launch-adapter/adapter.test.ts`: `2 pass`, `0 fail`, `30
  expect() calls`.
- `bun --check subprocess-execution-foundation/supervisor.ts` passed. Bun
  no-bundle transpile/build checks to `/dev/null` passed for
  `supervisor.ts`, `supervisor.test.ts`, `component-status-watch/status-watch.ts`,
  `component-status-watch/status-watch.test.ts`,
  `opencode-launch-adapter/adapter.ts`, and
  `opencode-launch-adapter/adapter.test.ts`. A direct `bun --check` on the test
  module is not an applicable test syntax check on this Bun host because it
  executes the module outside Bun's test runner (`Cannot use describe outside
  of the test runner`); the full suites and transpile checks provide the
  applicable evidence.
- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reported `VALID`.
- An independent repeated cleanup bundle ran the full supervisor suite three
  times, measured `25.387788` monotonic seconds, and reported `10 pass`, `0
  fail`, `106 expect() calls` on each run. Each run's fixture cleanup and
  `noLeftover()` assertions passed. After the bundle, repeated process checks
  reported no `supervisor.ts --supervise`, worker-fixture, or named test-fixture
  processes; the three temporary fixture glob checks found no
  `as-is-supervisor-test-*`, `as-is-status-watch-*`, or
  `as-is-opencode-adapter-*` directories. The owned worker, supervisor,
  worker process group, supervisor process group, and current private fixture
  runtime were therefore observed absent.

Host-reported monetary cost is unavailable; no monetary spend is claimed and
the record retains `spent: 0.00` only as the supplied non-billing budget
placeholder with `source: unavailable`. The host-observed monotonic wall-clock
accounted here is `35.749667` seconds (`10.361879` final validation bundle plus
`25.387788` repeated cleanup bundle), below the 120-second allocation. No
descendants were delegated, so there are no failed or cancelled descendants
to account for.

Residual risk is limited to the host's unavailable billing surface, POSIX host
process semantics, and one pre-existing private runtime artifact outside this
component's scope: `/tmp/as-is/project-d72ec1dc4939eb58/.../state.json` from a
10:34 adapter fixture remained observable after these checks, while its
recorded PIDs were absent. The current validation-created fixture roots and
owned processes were clean; the pre-existing artifact was not created by this
repair and was not removed because the task forbids outside-scope mutation.

## Result

The watchdog durable-checkpoint regression is repaired at the writer boundary
without changing the prior completed foundation lineage represented by
`e8fb1da`. Terminal durable evidence is now published before terminal private
host state, preserving explicit watchdog source attribution and generic
lifecycle, role/parent, identity, accounting, cancellation, stale/recovery,
watchdog, and cleanup behavior. This repair record has no descendants and all
of its acceptance conditions are evidenced above.

Exact changed-artifact set for this repair is:

- `subprocess-execution-foundation/supervisor.ts`
- `subprocess-execution-foundation/as-is.md`

`subprocess-execution-foundation/supervisor.test.ts` was not changed; the
existing regression assertion remains intact. No status-watch, adapter, parent,
root, or unrelated artifact was staged or changed by this repair.

## Blockers And Escalations

The initial blocker is the watchdog `failure` checkpoint source regression
reported by the status-watch recovery. If the configured `implementer` is
unavailable, returns under another role, or the repair validation fails, record
the exact durable blocker and stop without retry, role substitution, systemd
revival, or mixed/unscoped commit.

## Recovery

The completion checkpoint is this record at status `completed`, with the
durable implementation change in `supervisor.ts`; recover the pre-repair
accepted state with `git show e8fb1da` only for historical comparison. The
scoped completion commit must contain only this record and implementation
change. Do not restore an archive, remove the uncommitted status-watch repair,
or treat the pre-existing external `/tmp/as-is` artifact as this task's owned
runtime state.

## Next Action

Commit this completed component handoff with `committing-completed-work`, staging
only `supervisor.ts` and this record. The parent may independently review this
record and the scoped commit; the separate uncommitted
`component-status-watch/status-watch.test.ts` repair remains untouched and is
not part of this completion.
