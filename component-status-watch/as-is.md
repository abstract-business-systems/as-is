---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T11:49:46Z
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 180
      spent-seconds: 4.808251
      reserve-seconds: 45
      source: host-observed-monotonic-validation
  external-effects: require-current-turn-user-approval
acceptance:
  - Provide a user/as-is/orchestrator-callable, read-only machine-readable
    status operation with the exact component-path interface recorded in this
    component handoff; accept a canonical repository-relative component path
    and an optional one-based attempt, never a required JobId.
  - Provide a repeatable watch operation using the same path/attempt lookup and
    emit independently parseable structured observations without treating a
    polling interval or a missing observation as completion.
  - Join the durable component record with the accepted generic supervisor and
    opencode-launch-adapter observations. Every response includes explicit
    values or `unavailable` for task-revision/attempt and job identity,
    component path, as-is/orchestrator/implementer role and parent chain,
    adapter, supervisor and worker health, last event/time, durable state,
    stale/unknown classification, permission state, cancellation/recovery
    state, cleanup state, and next-safe-action/blocker information.
  - Preserve the stable identity
    `component-path/task-revision/attempt`; expose JobId only as a
    source-labelled diagnostic runtime field. The lookup and durable result
    remain valid when the submitting call has returned and never require a
    JobId for recovery or completion.
  - Reuse the supervisor's persisted runtime map and reconciliation rules as
    subordinate runtime observations. Reload/reconcile must preserve a live
    path/revision/attempt association, classify dead, missing, orphaned, stale,
    ambiguous, or unknown runtime state explicitly, and never infer completion
    from absent private state or a missing map entry.
  - Represent missing records, ambiguous attempt selection, terminal records,
    stale records, and unknown/unavailable runtime state explicitly; terminal
    durable state is not silently rewritten and missing state is not success.
  - Add focused harmless tests proving repeated polling/watch output, stable
    component-path lookup with and without an attempt, reload/reconciliation
    behavior, explicit unavailable/terminal/stale/unknown cases, and cleanup
    with no leftover worker/supervisor processes or runtime state.
  - Keep all implementation, tests, and this task record inside this component;
    read the named supervisor, adapter, and design-contract dependencies only.
    Do not modify the retired systemd flow, accounting aggregation
    implementation, full permission-event UI, SSH-disconnect handling,
    unrelated `control-plane.md`, parent/sibling records, or accepted launch
    implementation files.
---

# Component Status Watch

## Purpose

Expose the public path-and-attempt observation boundary for the accepted generic
supervisor and `opencode-launch-adapter` without making runtime JobIds or
private handles durable task identity.

## Requirement

Implement the smallest user/as-is/orchestrator-callable read-only status and
watch surface for a canonical component path and optional attempt. It must
join the authoritative component record with source-labelled supervisor and
adapter observations, preserve the repository's unavailable/unknown semantics,
and remain usable after the submitting call returns or runtime reconciliation.

Named read-only dependencies are `subprocess-execution-foundation/supervisor.ts`,
`subprocess-execution-foundation/supervisor.test.ts`,
`opencode-launch-adapter/adapter.ts`, `execution-accounting-design.md`,
`execution-contract.md`, `orchestration-design.md`, `configuration.md`,
`opencode-adapter.md`, and `component-task-record-protocol.md`. Repository
instructions, design principles, and permitted skills are centrally supplied
read-only context.

The implementation must not expand into historical cost aggregation, OpenCode
live event mediation, a full permission-approval UI, SSH-disconnect claims,
the retired systemd flow, or changes to unrelated `control-plane.md`. The
component directory is the sole implementation boundary; no child delegation
is permitted.

## Plan

1. Implement `component-status-watch/status-watch.ts` as the read-only API and
   CLI. The exact invocation is
   `bun component-status-watch/status-watch.ts status --project-root <root>
   <canonical-component-path> [--attempt <one-based-attempt>]`; repeated output
   uses `watch` with `--interval-ms <positive-ms>` and optional `--count <n>`.
   The exported API is `readComponentStatus(options)` and the repeatable
   `watchComponentStatus(options)` async generator.
2. Resolve the canonical path and record-derived task revision/attempt without
   a JobId, then project durable record, adapter checkpoint, and optional
   supervisor runtime-map observations into one independently parseable JSON
   object. Reload the map on every read and classify missing, orphaned, stale,
   ambiguous, unknown, unavailable, and terminal state explicitly.
3. Add `component-status-watch/status-watch.test.ts` with harmless fixtures and
   one accepted detached-supervisor lifecycle proving post-submit lookup,
   repeated polling/watch, path/attempt selection, map reload/reconciliation,
   explicit classifications, and process/runtime cleanup.
4. Run the focused Bun test and syntax/diff checks, record evidence and residual
   risk, then complete and commit only this component handoff.

## Progress

The record was created atomically by the orchestrator for the configured
`implementer` after reviewing the accepted launch handoff at commit `94e3d04`.
The launch adapter and generic supervisor are dependencies, not files this
worker may modify. This task has no child records. The local implementation
pattern is dependency-free Bun/TypeScript with library exports plus a guarded
CLI entry point, as used by the named supervisor and adapter. The material
addition is required because the accepted dependencies expose only a
JobId/handle observation API and no stable component-path public surface.
The accepted supervisor source does not itself contain a `job-map.json`
writer; this component therefore consumes the documented persisted map when
present, reports its absence as unavailable/missing, and never creates a
second runtime authority or infers success from it.

The bounded implementation is now present in the component-only artifacts
`status-watch.ts` and `status-watch.test.ts`. `readComponentStatus(options)`
resolves a canonical repository-relative component path and optional one-based
attempt from the durable record, while `watchComponentStatus(options)` rereads
the same identity and yields independently parseable observations. The guarded
CLI/API name is `component-status-watch`; the exact commands are:

```text
bun component-status-watch/status-watch.ts status --project-root <root> <canonical-component-path> [--attempt <one-based-attempt>]
bun component-status-watch/status-watch.ts watch --project-root <root> <canonical-component-path> [--attempt <one-based-attempt>] --interval-ms <positive-ms> [--count <n>]
```

The response keeps the stable `componentPath/taskRevision/attempt` identity
separate from a source-labelled `runtimeJobId` diagnostic. It joins durable
record sections and checkpoints with adapter envelope/role data and the
documented user-level `job-map.json` plus private supervisor state when those
observations are present. Every public field has a structured value or
`unavailable`; missing records, missing/ambiguous attempts, terminal durable
records, stale/unknown freshness, orphaned map entries, runtime absence,
permission, cancellation/recovery, cleanup, blockers, and next action are
classified explicitly. Queries do not call the accepted mutating
`supervisor.observe()` API.

This is an authorized recovery of the same configured `implementer` task from
handoff commit `85116d5`, not a new task. The prior implementation and
validation evidence below are retained. The recovery is limited to the focused
test's read-only observation boundary: its byte-identical assertion races with
the accepted detached supervisor's durable `watchdog-configured` and `waiting`
checkpoints. The supervisor and adapter remain read-only dependencies and no
child delegation is permitted. There are no descendants; the failed/cancelled
descendant set is explicitly empty.

## Validation

`verification-discipline` selected the focused functional path because this is
a user-visible status boundary with runtime dependencies. The changed
artifacts are `component-status-watch/status-watch.ts`,
`component-status-watch/status-watch.test.ts`, and this record.

- `bun test component-status-watch/status-watch.test.ts` passed: **4 pass, 0
  fail, 43 expect() calls**. The four harmless tests cover post-submit lookup
  with and without attempt, stable path/revision/attempt identity, three
  independently parseable watch observations, read-only record preservation,
  persisted-map reload/reconciliation (matching then orphaned then matching),
  missing/unavailable/terminal/stale/unknown classifications, and accepted
  supervisor cleanup with false process/group health and no runtime state.
  Host-observed monotonic wall-clock for this focused command was **0.787
  seconds**; the command exited `0`.
- `bun --check component-status-watch/status-watch.ts` exited `0`.
- `bun component-status-watch/status-watch.ts status --project-root .
  component-status-watch` emitted one JSON object with the canonical path,
  durable `active` record, explicit missing attempt, runtime-map `missing`,
  and no inferred success. `bun
  component-status-watch/status-watch.ts watch --project-root . --interval-ms
  5 --count 2 component-status-watch` emitted two independently parseable JSON
  lines with watch sequences `0` and `1` and
  `completionInferredFromPolling: false`.
- `git diff --check -- component-status-watch` and no-index whitespace checks
  produced no diagnostics. The no-index checks return the expected difference
  exit code for untracked files; they were used only for whitespace evidence.

Host-reported monetary cost is **unavailable**; no provider billing source was
introduced or estimated. The recorded `spent-seconds: 0.79` is the named
host-observed monotonic validation interval, not a model or billing estimate.
No durable record was modified by status/watch reads; the lifecycle test's
durable changes were confined to its temporary fixture.

### Recovery validation attempt (accepted after supervisor repair)

The repaired test was independently inspected. Its active-fixture polling still
checks stable component-path/task-revision/attempt identity and
`completionInferredFromPolling: false`; its byte-preservation invariant is now
run only after `budget-observed` and direct no-leftover checks establish that
the detached supervisor and worker are quiescent. The final snapshot therefore
tests the read-only queries rather than racing legitimate supervisor writes; it
does not delete or ignore the read-only assertion.

Recovery changed artifacts are `component-status-watch/status-watch.test.ts`
and this component record; `status-watch.ts` was not changed.

- First independent recovery run: `bun test
  component-status-watch/status-watch.test.ts` passed **4**, failed **0**, with
  **46 expect() calls**; host-observed monotonic interval **1.496 seconds**;
  exit `0`.
- Second independent recovery run: the same command passed **4**, failed **0**,
  with **46 expect() calls**; host-observed monotonic interval **1.285
  seconds**; exit `0`.
- `bun --check component-status-watch/status-watch.ts` exited `0`.
  `bun --check` is not an applicable test-file syntax check on this Bun host: it
  executes the test module outside the test runner and reports `Cannot use
  describe outside of the test runner`; the focused Bun test above is the
  applicable test syntax/behavior check. No implementation or test change was
  made in response to that tool-boundary message.
- A separate regression run of `bun test
  opencode-launch-adapter/adapter.test.ts` passed **2**, failed **0**, with
  **30 expect() calls**. The named supervisor and adapter `bun --check` commands
  both exited `0` in that run.
- The required combined sequence was stopped by the then-unrepaired
  `bun test subprocess-execution-foundation/supervisor.test.ts`: **9 pass, 1
  fail, 106 expect() calls**. The failure was the watchdog test at
  `supervisor.test.ts:332`, which expected `supervisor-watchdog` but received
  `undefined`; it was resolved in the separate accepted supervisor repair
  task, commit `57ed2d2`.
- After that repair, the supervisor worker recorded the full regression suite
  as **10 pass, 0 fail, 106 expect() calls**, and the adapter suite as **2 pass,
  0 fail, 30 expect() calls**. This component's independent post-repair rerun
  of `bun test component-status-watch/status-watch.test.ts` passed **4**, failed
  **0**, with **46 expect() calls** in **1.238251 seconds**.
- The post-repair status/watch rerun used the preserved uncommitted test repair;
  its quiescent snapshot still checks read-only record preservation, stable
  path/attempt identity, repeated parseable watch output, and no owned runtime
  leftovers. `bun --check component-status-watch/status-watch.ts` and a
  no-bundle build passed, and the focused component validator reported
  `VALID`.
- The status CLI and watch CLI were rerun after the repair record reached its
  terminal state: both emitted parseable JSON with explicit runtime-map
  missing/unavailable state and no completion inference. `git diff --check
  -- component-status-watch` reported no whitespace diagnostics.
- Direct cleanup observation after the stopped sequence found no process whose
  exact command tokens matched the detached `--supervise` fixture workers or
  the focused `as-is-status-watch-*`, `as-is-opencode-adapter-*`, or
  `as-is-supervisor-test-*` fixtures. The focused test's cleanup assertions and
  the direct observation both reported no owned process leftovers. Glob checks
  found no temporary fixture roots for those patterns. The pre-existing
  external `/tmp/as-is` tree was not removed or altered.

Residual risk: the accepted supervisor source exposes no `job-map.json` writer,
so production status reports runtime diagnostics as missing/unavailable until
the host supplies the documented map. The focused reload test supplies a
temporary contract-shaped map and accepted supervisor state; it does not claim
that an out-of-scope host producer or live OpenCode session/event bridge is
complete. SSH-disconnect handling, full permission-event UI, accounting
aggregation, and the retired systemd path remain intentionally unvalidated.

## Result

The component-path/attempt read-only status and watch slice is implemented and
focused validation supports its acceptance conditions. The API/CLI preserves
the durable record as authority, does not require a JobId, reloads runtime-map
metadata on every observation, and reports missing runtime state rather than
success. No descendants exist; failed or cancelled descendant accounting is
therefore an explicit empty set for this component.

That prior terminal-handoff result remains historical evidence. The recovery
test correction is now accepted after the separate supervisor repair and an
independent post-repair focused run. This component has no descendants, and
the scoped current handoff is eligible for its own completion commit.

## Blockers And Escalations

The prior supervisor regression blocker is resolved by the separate,
configured-implementer supervisor repair committed as `57ed2d2`; this component
did not retry or edit the supervisor. The independent post-repair focused
status/watch run passed, and the component's prior failed/cancelled descendant
set remains empty.

The prior byte-preservation assertion was invalid at the active
detached-supervisor boundary because concurrent supervisor checkpoints
legitimately changed the record between its snapshot and final read. This is
not evidence that the read-only status/watch queries mutated the record. The
accepted supervisor/map boundary limitation is recorded as residual risk rather
than hidden or substituted: map absence is represented as runtime
`missing`/`unavailable`, while the durable path lookup remains usable.
If future work requires a map producer or live OpenCode bridge, it must be a
separate authorized component task and must not modify this handoff by
silently making JobId authoritative.

## Recovery

Recovery checkpoint: after the two recovery focused intervals (**1.496 + 1.285
= 2.781 seconds**) and the independent post-repair interval (**1.238251
seconds**), cumulative recorded host-observed monotonic validation time is
**4.808251 seconds**, preserving the prior **0.79 seconds**. Host-reported
monetary cost is unavailable; no billing source was available and no zero or
estimate is claimed as actual cost. The separate supervisor repair is terminal
at `57ed2d2`; this component has no descendants, and direct cleanup observation
found no owned detached fixture processes/groups or matching temporary roots.
The pre-existing external `/tmp/as-is` tree was not removed or altered.

## Next Action

The current component repair is accepted and has no non-terminal descendants.
Its scoped handoff is ready for `committing-completed-work`, staging only
`component-status-watch/status-watch.test.ts` and this record. The prior
`status-watch.ts` implementation remains in its accepted handoff `85116d5` and
is not restaged. The parent integration remains blocked by intentionally
unimplemented host capabilities recorded in the root task; this component does
not expand into those capabilities.
