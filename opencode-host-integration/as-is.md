---
as-is-version: 2
task:
  status: blocked
  worker: implementer
  updated: 2026-07-27T13:09:43Z
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 12.380705
      reserve-seconds: 60
      source: host:monotonic-validation-wrapper
  external-effects: require-current-turn-user-approval
acceptance:
  - Resolve a real repository component path, durable task revision, one-based
    attempt, record revision, configured implementer, and the
    as-is -> orchestrator -> implementer parent/session chain from durable
    records before launch; reject direct, wrong-role, duplicate, stale, or
    unattributed submissions without fallback.
  - Connect the accepted opencode-launch-adapter to an actual OpenCode
    session/command mediation path through the accepted generic supervisor,
    without adding OpenCode assumptions to the generic supervisor core, and
    return after a durable launch-accepted checkpoint before worker completion.
  - Atomically write and update the supervisor-owned JobId map at
    ${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json
    for launch-accepted, running, terminal, cancellation, cleanup, and
    restart/reconciliation states. Keep component-path/task-revision/attempt
    authoritative and JobId diagnostic-only; reload must preserve or explicitly
    classify each association as live, dead, stale, orphaned, unknown, or
    unavailable without inferring completion from missing state.
  - Make component-path status with optional attempt work after the submitting
    call returns and after runtime-map reload, and exercise repeated polling and
    watch through component-status-watch with durable records remaining the
    authority.
  - Apply the scoped proactive permission profile before launch; surface
    denial, unavailable, and unknown/approval-needed states as durable,
    machine-readable outcomes without hidden prompts or unbounded waiting.
  - Validate harmless real-host lifecycle evidence for running and terminal
    states, cancellation, cleanup with no leftover process/groups or private
    runtime, stale/unknown state, duplicate/recovery handling, and map
    reconciliation/reload. Validate connection loss or SSH-equivalent host
    loss; if this host cannot prove it, record an explicit durable capability
    blocker and do not infer success.
  - Keep implementation, tests, fixtures, and this task record inside this
    component. Read named dependencies only; do not modify retired systemd
    history/flow, accounting design or aggregation, unrelated root-audit
    changes, untracked control-plane.md, accepted supervisor/adapter/status
    implementation files, public historical aggregation, or full permission UI.
  - Record actual host-reported cost when available, host-observed monotonic
    wall-clock use, validation evidence, residual risk, and descendant closure;
    invoke committing-completed-work only after every acceptance condition
    passes and the scoped handoff is committed.
---

# OpenCode Host Integration

## Purpose

Provide the smallest real host-integration slice that composes the accepted
generic supervisor, `opencode-launch-adapter`, and `component-status-watch` into
one detached OpenCode-mediated job lifecycle. This component owns only the
OpenCode host bridge and its runtime-map/reconciliation evidence; durable task
records remain authoritative and the generic supervisor remains host-neutral.

## Requirement

Implement and validate one supported non-blocking OpenCode mediation path. The
path must reread a real component record, preserve the configured
`as-is -> orchestrator -> implementer` attribution, submit through the accepted
launch adapter and supervisor, persist the documented private JobId map, and
remain addressable by component path and optional attempt after the submitting
call and a runtime reload. The bridge may use a component-local host wrapper to
start the real OpenCode command inside the supervisor-owned detached process,
but OpenCode command, session, event, and permission behavior must stay at this
adapter boundary rather than enter the generic supervisor.

The named read-only dependencies are `subprocess-execution-foundation/`,
`opencode-launch-adapter/`, `component-status-watch/`, `opencode-adapter.md`,
`execution-contract.md`, `orchestration-design.md`, `configuration.md`,
`execution-accounting-design.md`, and `component-task-record-protocol.md`.
Repository instructions, design principles, and permitted skills are centrally
supplied read-only context. No child delegation is permitted. A host limitation
that prevents proving connection loss, live OpenCode events, or safe
reconciliation is a durable blocker, not a reason to claim support or use a
foreground fallback.

## Plan

1. Inspect the accepted adapter, supervisor, status/watch contracts, fresh
   OpenCode discovery, and local command/session/event capabilities. Define the
   component-local bridge and exact map schema without changing dependencies.
2. Implement the detached real-OpenCode launch, atomic runtime-map lifecycle,
   reload/reconciliation, path/attempt status/watch composition, and explicit
   permission/unknown/connection-loss outcomes. Keep all host-specific behavior
   in this component and preserve the minimal launch envelope.
3. Add harmless fresh-host integration fixtures and run repeated polling,
   cancellation/recovery, restart/reconciliation, cleanup, task-record,
   type/build, and whitespace checks. Stop on any unsupported host capability,
   record the exact blocker, and do not retry or substitute a role.

## Progress

The orchestrator created this record atomically after reviewing the terminal
handoffs `e8fb1da`, `94e3d04`, `85116d5`, `57ed2d2`, `3a02974`, and `370dd05`,
the current root task, and the named host/execution specifications. The accepted
components are read-only dependencies for this bounded task. The required
worker is `implementer`; no child records or sibling tasks are authorized.

The component-local bridge and tests are now present. The implementation keeps
OpenCode command/session/event handling in `opencode-bridge.ts`, submits only
through `launchComponent`, and uses the accepted supervisor for detached
ownership, cancellation, and cleanup. `opencode-host-integration.ts` resolves
the canonical component path, derives the stable revision from the immutable
record definition, carries attempt 1 and the current record revision, validates
the supplied `as-is -> orchestrator -> implementer` session chain, persists the
private XDG runtime map atomically, and joins path/attempt status and watch.

The resolved durable identity for this record is
`opencode-host-integration/record-dd31b37d5838124cfbebc921/1`; the configured
worker is `implementer`. The adapter's minimal launch envelope carries the
record revision `2026-07-27T12:26:47Z` and parent/session attribution; the
generated JobId is stored only as a diagnostic map key. The supplied controller
chain is validated as `as-is -> orchestrator -> implementer`, while a live
OpenCode session chain remains the named blocker below. No descendants were
delegated.

The separate `mock-job/supervisor-fixture` child was independently accepted in
scoped commit `1e1bb4d`. Its deterministic local-only worker proved the generic
supervisor/adapter launch envelope, role/lifecycle events, persisted runtime-map
reconciliation, path/attempt status and repeated watch, cancellation/cleanup,
and controller-loss boundary. The orchestrator killed only the controller,
observed status after the loss, and confirmed an explicit terminal handoff with
no owned process or runtime leftovers. The fixture records
`openCodeEvidence: false` and made no OpenCode, model, provider, or network call;
it is not live OpenCode mediation evidence and does not change this component's
status.

## Validation

`verification-discipline` selected the focused component integration suite plus
the accepted seam regressions because this is a user-visible detached lifecycle
boundary. The changed artifacts are `opencode-bridge.ts`,
`opencode-host-integration.ts`, `opencode-host-integration.test.ts`, and this
record.

- The final fresh local run of `bun test
  opencode-host-integration/opencode-host-integration.test.ts` passed **4**,
  failed **0**, with **42 expect() calls**. It covered return after
  `launch-accepted`, stable path/task-revision/attempt identity, repeated
  status/watch polling, automatic map launch/running/terminal transitions,
  atomic map reload, stale and unknown/unavailable classification, duplicate
  rejection, proactive permission denial, cancellation, reconciliation of an
  orphaned identity, terminal handoff, and cleanup/no-leftovers. Its wrapper
  measured **4.128354 monotonic seconds**. Two independent preceding runs
  passed **4/0 with 42 expects** in **4.148225** and **4.104126 seconds**; the
  recorded cumulative focused validation time is **12.380705 seconds**.
- The local bridge fixture emitted machine-readable OpenCode-shaped session and
  task metadata for `as-is`, `orchestrator`, and `implementer`, including the
  implementer parent session, and the adapter recorded the event attribution
  without treating process exit as completion. This is fixture evidence only;
  it is not evidence from a live OpenCode model/session.
- `bun test opencode-launch-adapter/adapter.test.ts` passed **2**, failed **0**,
  with **30 expect() calls**. `bun test
  component-status-watch/status-watch.test.ts` passed **4**, failed **0**, with
  **46 expect() calls**. `bun test
  subprocess-execution-foundation/supervisor.test.ts` passed **10**, failed
  **0**, with **106 expect() calls**. These accepted dependency checks were
  read-only validation inputs; no dependency implementation was changed.
- `bun --check opencode-host-integration/opencode-bridge.ts` and
  `bun --check opencode-host-integration/opencode-host-integration.ts` exited
  `0`. No-bundle Bun transpile checks for the bridge, implementation, and test
  with `--target bun --outfile /dev/null` exited `0`.
- `python3 schemas/task-record-validator/task_record_validator.py
  opencode-host-integration` reported `VALID`. `git diff --check
  -- opencode-host-integration` produced no diagnostics.
- Fresh `opencode --version` reported `1.17.18`; fresh `opencode agent list`
  exposed `as-is (primary)`, `orchestrator (subagent)`, and
  `implementer (subagent)`. This proves discovery only, not a live model
  connection or a parent-linked task event.
- Independent post-suite process checks found no owned `opencode-bridge.ts`,
  `opencode-host-integration.ts`, or detached `supervisor.ts --supervise`
  process, and glob checks found no `as-is-opencode-host-*`,
  `as-is-opencode-adapter-*`, or `as-is-status-watch-*` fixture roots.

Host-reported monetary cost is unavailable. No OpenCode model/token charge or
provider billing value was observed, and `spent: 0.00` remains the supplied
non-billing placeholder rather than an actual-cost claim. The host-observed
monotonic validation use recorded here is **12.380705 seconds**, below the
300-second allocation; overlapping dependency-check intervals were not added a
second time.

Residual risk is limited to the unproven live OpenCode session/event boundary,
the unproven connection-loss/SSH-equivalent observation, unavailable provider
billing, and POSIX host process semantics outside the harmless local fixtures.
Descendant closure is satisfied: no child records were created, so there are no
failed or cancelled descendants to account for.

## Result

The bounded component implementation is complete as far as the local host
capabilities prove: it composes the accepted adapter and host-neutral
supervisor, starts a real `opencode run --format json --agent as-is` command
only inside the detached supervisor wrapper, persists the documented private
JobId map with stable path/revision/attempt identity, exposes reloadable
component-path status/watch, records explicit permission and reconciliation
outcomes, and preserves supervisor-owned cancellation and cleanup. The map is
atomically updated for launch-accepted, running, terminal, cancellation,
cleanup, and reconciliation transitions. No public historical aggregation,
full permission-event UI, retired systemd recovery, accounting changes, or root
completion is implied.

This record is intentionally **not completed** because the required live-host
evidence is unavailable. No completion or commit claim is made.

## Blockers And Escalations

Durable capability blocker: this host proves only local OpenCode discovery
(`opencode --version` and `opencode agent list`). A live `opencode run` would
require a model/provider connection, which is an external service effect not
authorized in this turn. The host also exposes no local OpenCode session/event
fixture or SSH-equivalent transport boundary that can be deliberately severed
and observed through the adapter. Therefore the required live session/event
parent attribution and real connection-loss/host-loss evidence remain
unproven. The local fixture must not be promoted to real-host evidence, and a
missing event, process exit, or unavailable private state must not be inferred
as success.

The accepted generic mock boundary is evidence for the reusable supervisor and
adapter contract only. It does not satisfy this component's live OpenCode
session/event, parent-linked attribution, or real host-loss acceptance
conditions; this record remains `blocked` and must not be marked completed.

The task stops at this blocker without retrying, substituting `general` or
`explore`, direct-launching a worker, using a foreground fallback, contacting an
external service, or modifying an accepted dependency.

## Recovery

Recover from this record and the scoped bridge/map implementation. Reread the
record, preserve the cumulative **12.380705-second** host observation and
unavailable cost source, and obtain an explicitly authorized local OpenCode
server/session fixture or SSH-equivalent loss harness before attempting the
blocked validation. Reuse the stable identity
`opencode-host-integration/record-dd31b37d5838124cfbebc921/1`; do not create a
new attempt merely because the map or JobId is reloaded. Never treat a JobId,
missing map entry, process exit, or lost private session as completion. Do not
modify parent, sibling, accepted dependency, retired systemd, accounting,
root-audit, or `control-plane.md` artifacts.

## Next Action

The orchestrator must provide or authorize a local live OpenCode session/event
fixture and a real connection-loss or SSH-equivalent host-loss observation.
Then the configured `implementer` may resume this blocked record, rerun the
same scoped checks, and update the blocker only with durable evidence. There is
no completion commit for this attempt because the acceptance boundary is not
fully evidenced; the orchestrator independently decides whether the root
remains blocked. This component cannot claim root completion.
