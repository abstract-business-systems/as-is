---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T10:35:12Z
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: unavailable
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 210
      spent-seconds: 1.178
      reserve-seconds: 45
      source: host:monotonic-validation-wrapper
  external-effects: require-current-turn-user-approval
acceptance:
  - Resolve the named component record and its configured worker from durable
    state; accept only the configured implementer role and preserve the
    as-is -> orchestrator -> implementer parent/role attribution.
  - Pass a minimal launch envelope containing the canonical component path,
    durable task revision, one-based attempt, parent context, and resolved
    adapter/job specification. Keep generated JobId runtime-diagnostic only;
    it must not become task-record identity or completion authority.
  - Apply the configured/proactive permission profile before submitting the
    worker, and reject missing parent, wrong role, wrong component,
    duplicate/conflicting attempt, and unsupported foreground fallback.
  - Invoke the accepted generic supervisor without OpenCode assumptions in the
    supervisor core, return after its durable launch checkpoint before worker
    completion, and retain enough durable/runtime correlation state for later
    component-path/attempt lookup without implementing public status/watch.
  - Preserve cancellation and cleanup ownership at the supervisor boundary.
  - Validate the seam with a harmless delayed-worker integration test covering
    return-before-completion, envelope and role validation, permission
    preflight, durable checkpoint, and cleanup.
---

# OpenCode Launch Adapter

## Purpose

Own the narrow host-adapter seam that resolves one durable component task and
submits its configured worker through the accepted generic supervisor. The
name identifies both the host boundary (OpenCode) and the single lifecycle
operation in scope (launch); public observation and the wider adapter remain
future work.

## Requirement

Implement only the adapter-to-supervisor launch seam. Resolve the component
record, configured worker, parent role context, effective proactive permission
profile, and secret-free job specification before calling the reusable
supervisor in `../subprocess-execution-foundation/supervisor.ts`. The adapter
must reject invalid or ambiguous delegation rather than falling back to a
foreground OpenCode invocation or another role. It must return after the
supervisor's durable launch checkpoint and leave cancellation/cleanup with the
supervisor. Do not implement public status/watch, historical aggregation,
full permission-event UI, or the retired systemd flow.

The named external specifications and implementation dependency are
read-only dependencies for this component: `execution-contract.md`,
`orchestration-design.md`, `opencode-adapter.md`, `configuration.md`,
`execution-accounting-design.md`, `component-task-record-protocol.md`, and
`subprocess-execution-foundation/supervisor.ts`. Repository instructions,
design principles, and permitted skills are centrally supplied read-only
context; no copied project-wide prompt belongs in the launch envelope.

## Plan

1. Define a small OpenCode-boundary request and resolver that derives the
   component path, task revision/record revision, attempt, configured worker,
   parent context, permission profile, and normalized job specification from
   durable state.
2. Validate authority, role links, component identity, attempt freshness,
   proactive permission capability, and detached-job support before invoking
   `launch()` from the generic supervisor.
3. Add focused harmless integration tests with a delayed worker, then record
   validation, measured host use, residual risk, and the scoped handoff.

## Progress

The configured `implementer` worker accepted this component at
`2026-07-27T10:31:00Z` and completed the bounded adapter seam in this
directory. The accepted generic supervisor remained a read-only dependency;
no child tasks were permitted or present. The adapter now resolves the
component record and configured `implementer`, validates the mediated parent
chain and detached job specification, performs proactive capability checks,
and submits only through the supervisor.

## Validation

- `bun test opencode-launch-adapter/adapter.test.ts` passed: `2 pass`, `0
  fail`, `30 expect() calls`. The focused test independently observed a
  delayed worker returning after the supervisor's durable `launch-accepted`
  checkpoint, verified the minimal envelope has no JobId identity, rejected a
  duplicate attempt, rejected a wrong worker role, rejected a failed
  proactive permission profile, rejected foreground fallback, and confirmed
  durable handoff followed by supervisor-owned cleanup with no leftover
  process groups or runtime directory.
- The same command was wrapped with `time.monotonic_ns()` and reported
  `host-monotonic-wall-clock-seconds=1.178`; this is the measured focused
  validation interval and is recorded as the available host observation, not
  an estimate of the full implementer turn.
- Host-reported actual cost is unavailable. The record retains the configured
  fallback metric (`validation elapsed-seconds (not monetary cost)`) and does
  not represent a guessed or provider-billing value as cost.
- There are no descendant records; descendant closure is therefore satisfied.

The evidence supports the bounded adapter acceptance conditions. It does not
prove a live OpenCode host session/event bridge, public status/watch, or later
observation of a real OpenCode worker.

## Result

Completed the OpenCode-to-generic-supervisor launch seam only. The durable
envelope carries the canonical component path, derived durable task revision,
record revision, one-based attempt, parent context, and resolved secret-free
adapter/job specification. Runtime JobId remains diagnostic correlation; the
supervisor retains process-group cancellation and cleanup ownership. Invalid
parent, role, component, attempt, permission, unavailable-worker, and
foreground cases become durable blockers without a fallback or top-level CLI
worker.

## Blockers And Escalations

No implementation blocker remains. Residual risk is intentionally bounded:
actual host OpenCode session/event mediation, public status/watch, later
path/attempt observation, and full end-to-end `as-is -> orchestrator ->
implementer` session evidence remain unproven and are not substituted by this
adapter or its harmless supervisor fixture. Full implementer-turn wall-clock
use is unavailable; only the monotonic focused-check interval is observed.

## Recovery

The durable recovery checkpoint is the component-local adapter implementation,
its focused integration test, and the validation evidence above. On
interruption before handoff, reread this record, inspect the component-local
files, and rerun the focused test with the configured `implementer`; preserve
the atomic implementation and do not modify the parent record, sibling
components, the accepted supervisor, `control-plane.md`, or retired systemd
artifacts. The scoped handoff is ready for commit; no private runtime state is
required for recovery.

## Next Action

The orchestrator independently reviews this completed handoff and its focused
evidence. Future work may validate actual OpenCode host session/event
mediation and later observation through a separately bounded task; it must not
expand this seam into public status/watch, historical aggregation, a full
permission-event UI, systemd revival, or foreground fallback.
