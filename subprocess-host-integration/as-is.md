---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T16:51:16Z
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
      spent-seconds: 16.866818
      reserve-seconds: 60
      source: host:monotonic-validation-wrapper
  external-effects: require-current-turn-user-approval
acceptance:
  - Provide the smallest subprocess-backed host integration for the already
    accepted generic delegate-component boundary. The host entry point must
    accept only the normalized caller identity and child component path with
    optional expected task revision/attempt; it must reject caller-supplied
    parent identity, parent JobId, worker role, command, free-form scope, and
    direct or wrong-role fallback. Derive the parent from the active binding,
    reread the durable caller and child records, resolve the configured child
    worker, and preserve component-path/task-revision/attempt as stable
    identity with JobId diagnostic-only.
  - Launch the resolved configured implementer as a real detached subprocess
    through the accepted subprocess-execution-foundation supervisor and its
    existing adapter seams. Return after the durable launch-accepted
    checkpoint, before a harmless delayed child completes. The child must not
    receive a caller-provided parent JobId or free-form scope; supervisor-owned
    normalized environment/context is allowed. Do not change completed generic
    delegation behavior, add a parallel execution implementation, revive
    systemd, or use the blocked OpenCode custom-tool path.
  - Persist and reload the supervisor-owned diagnostic runtime map, reconcile
    launch/running/terminal/cancellation/cleanup observations without making
    the map or JobId task authority, and expose status/watch by component path
    and attempt through the existing component-status-watch seam. Missing,
    malformed, stale, dead, orphaned, and unavailable private runtime state
    must remain explicit and must never be inferred as completion.
  - Prove cancellation and cleanup through the existing supervisor controls,
    including no owned worker, supervisor, process-group, temporary runtime,
    or runtime-map residue after cleanup. Preserve proactive permission-profile
    behavior and record permission-denied/approval-needed, missing-caller,
    mismatched-caller, missing-parent, wrong-role, wrong-component, duplicate,
    and unavailable-supervisor outcomes without prompting, retrying, or role
    substitution.
  - Use the existing mock-job/supervisor-fixture or an equivalent deterministic
    local controller-loss fixture to show that a disconnected controller does
    not make the detached child disappear from observation; report explicit
    host/runtime limits and do not claim general SSH-loss support. A harmless
    deterministic subprocess is preferred. Do not make a real provider,
    OpenCode, network, or model call and do not expose secrets.
  - Run focused functional tests, repeated independent reruns and cleanup or
    process checks, accepted supervisor/adapter/status-watch regressions,
    syntax/build checks, scoped task-record validation, and whitespace checks.
    Record observed results, host-reported actual cost, host-observed
    monotonic wall-clock use, residual risk, and descendant closure. Complete
    only when every acceptance condition is evidenced; otherwise record the
    exact durable blocker and stop.
  - Keep implementation, tests, fixtures, and this record inside this
    component. Read named dependencies only: `execution-contract.md`,
    `opencode-adapter.md`, `delegation-tool-boundary/`,
    `subprocess-execution-foundation/`, `opencode-launch-adapter/`,
    `component-status-watch/`, and `mock-job/supervisor-fixture/`. Do not
    modify `opencode-host-integration/`, completed generic delegation,
    supervisor, adapter, status/watch, mock fixture, systemd history,
    `control-plane.md`, or unrelated root work.
---

# Subprocess Host Integration

## Purpose

Replace the blocked OpenCode custom-tool host path with the smallest supported
local subprocess mediation that preserves the same control-plane semantics.
This component owns only the subprocess-backed host bridge and its deterministic
integration evidence. Durable task records remain authoritative, the generic
delegate-component boundary remains unchanged, and the accepted supervisor
continues to own detached process lifecycle.

## Requirement

Compose the existing generic delegation boundary, accepted subprocess
supervisor/adapter seams, and component-status-watch surface so an active
orchestrator can submit a configured implementer subprocess without waiting for
completion. Parentage and child resolution must come from active supervisor and
durable-record context rather than request fields. The implementation must be
usable without OpenCode; any OpenCode-specific custom-tool/session limitation is
an explicitly preserved residual blocker, not an acceptance claim or a reason
to add a foreground fallback.

## Plan

1. Inspect the named contracts and accepted implementations, then define the
   narrowest component-local subprocess adapter/bridge and deterministic fixture
   without editing the completed generic boundary or its dependencies.
2. Compose the generic request/result path with the existing detached
   supervisor, durable map, status/watch, cancellation, reconciliation, and
   cleanup seams. Keep task meaning in durable records and keep runtime JobId
   diagnostic-only.
3. Add focused local evidence for identity, configured worker resolution,
   non-blocking return, lifecycle/status/watch, reload/reconciliation,
   permission and caller failures, controller loss, cancellation, cleanup, and
   no leftovers. Run the required regressions and record any unsupported host
   boundary as a blocker or residual limitation.

## Progress

This component record was created atomically by the orchestrator for the
explicit scope switch. The existing `opencode-host-integration/` record remains
blocked and unchanged: it still records the distinct limitation that actual
OpenCode custom-tool exposure, permission mediation, and a tool-mediated smoke
are not proven. This subprocess task does not reopen that record, claim an
OpenCode invocation, or revive systemd. The configured worker is `implementer`
and no descendants are authorized.

The configured `implementer` has started the component-local implementation.
The named accepted delegation, supervisor, adapter, status/watch, and mock
seams remain read-only. No descendants are authorized. The implementation will
use a durable `Execution Resolution` fixture record to select a harmless Bun
command and pass that command only through a new local adapter into the
accepted detached supervisor.

The implementation is complete in the three component-local artifacts named
below. `SubprocessHostIntegration` composes the accepted generic
`delegate-component` boundary with a `DetachedSubprocessAdapter`, which maps
only the durable child `Execution Resolution` command and proactive permission
profile to the accepted detached supervisor. The active binding carries the
supervisor-derived role chain as private host context; the normalized request
continues to contain only caller identity and child path/revision/attempt.
The adapter persists a private encoded supervisor handle and process paths in
the existing diagnostic JobId map so a fresh controller can reload and control
the same stable path/revision/attempt identity. It does not create a second
execution engine or change any accepted dependency.

One local composition detail is material: the accepted generic boundary writes
its own checkpoint after an adapter returns, while the detached supervisor
writes its launch checkpoint before its `launch()` call returns. The
component-local `SubprocessCheckpointSource` intentionally leaves the generic
optimistic revision token empty for this composed path; the adapter still
rereads and validates the durable `task.updated` value before supervisor launch,
and patches the existing private map with the post-supervisor record hash
before the generic boundary continues. This preserves the accepted generic
behavior without erasing either durable checkpoint.

## Validation

`verification-discipline` selected an end-to-end local integration check because
this component is a user-visible detached execution boundary with durable
identity, cancellation, cleanup, and controller-loss behavior. Exact observed
commands and results follow:

- The repeated focused command was:
  `python3 -c 'import subprocess,time,sys; started=time.monotonic_ns();
  codes=[]; [codes.append(subprocess.run(["bun","test","subprocess-host-integration/subprocess-host-integration.test.ts"],cwd="/home/vc/dev/trial/as-is").returncode) for _ in range(3)]; elapsed=(time.monotonic_ns()-started)/1_000_000_000; print(f"HOST_MONOTONIC_WALL_CLOCK_SECONDS={elapsed:.6f}"); print(f"RUN_EXIT_CODES={codes}"); sys.exit(0 if all(code == 0 for code in codes) else 1)'`.
  It reported three independent runs of **5 pass, 0 fail, 84 expect() calls**,
  `HOST_MONOTONIC_WALL_CLOCK_SECONDS=4.785543`, and
  `RUN_EXIT_CODES=[0, 0, 0]`. The focused assertions directly exercised the
  exact normalized request shape, derived parent and configured implementer,
  diagnostic-only JobId, real delayed Bun subprocess, running/terminal
  path-and-attempt status, repeated watch, malformed/orphaned map reload,
  permission denial and awaiting approval, all named caller/parent/component/
  duplicate/unavailable failures, wrong role, foreground/OpenCode fallback
  rejection, cancellation, cleanup, controller termination, and child output
  proving no parent JobId or free-form scope reached the child.
- The accepted seam regression bundle was:
  `python3 -c 'import subprocess,time,sys; started=time.monotonic_ns(); commands=[["bun","test","subprocess-host-integration/subprocess-host-integration.test.ts"],["bun","test","subprocess-execution-foundation/supervisor.test.ts"],["bun","test","opencode-launch-adapter/adapter.test.ts"],["bun","test","component-status-watch/status-watch.test.ts"],["bun","test","delegation-tool-boundary/delegate-component.test.ts"]]; results=[]; [results.append((command,subprocess.run(command,cwd="/home/vc/dev/trial/as-is").returncode)) for command in commands]; elapsed=(time.monotonic_ns()-started)/1_000_000_000; print(f"HOST_MONOTONIC_WALL_CLOCK_SECONDS={elapsed:.6f}"); print(f"RUN_EXIT_CODES={[code for _,code in results]}"); sys.exit(0 if all(code == 0 for _,code in results) else 1)'`.
  It reported `HOST_MONOTONIC_WALL_CLOCK_SECONDS=12.081275` and
  `RUN_EXIT_CODES=[0, 0, 0, 0, 0]`: focused **5/0, 79 expects**;
  supervisor **10/0, 106 expects**; launch adapter **2/0, 30 expects**;
  status/watch **4/0, 46 expects**; and generic delegation **10/0, 120
  expects**.
- `bun --check subprocess-host-integration/subprocess-host-integration.ts`
  exited `0`. `bun build --no-bundle subprocess-host-integration/subprocess-host-integration.ts --outfile /dev/null`
  and the equivalent command for
  `subprocess-host-integration.test.ts` both transpiled successfully.
- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-host-integration` reported **VALID**. `git diff --check --
  subprocess-host-integration` and the no-index checks for all three untracked
  component files reported `NO_WHITESPACE_DIAGNOSTICS`.
- Independent cleanup checks after the final validation reported
  `NO_FOCUSED_PROCESSES` for detached `--supervise` and controller-loss
  processes and `NO_SUBPROCESS_HOST_RUNTIME_DIRECTORIES` for this component's
  temporary roots. The focused tests also observed false worker/supervisor/
  process-group health and absent private runtime plus absent runtime-map file
  after cleanup. Pre-existing unrelated `/tmp/as-is` artifacts from other
  components were observed but not modified because they are outside this
  component's scope.

Host-reported monetary cost is **unavailable**. The supplied `spent: 0.00`
remains a non-billing placeholder and is not represented as provider cost. The
host-observed monotonic validation use recorded here is **16.866818 seconds**:
4.785543 seconds for the final repeated focused bundle plus 12.081275 seconds
for the accepted seam regression bundle, below the 300-second allocation. This
is validation elapsed time, not monetary usage or a measurement of the full
implementer turn.

## Result

Completed. The smallest local subprocess-backed host integration now accepts
only the normalized caller/child request through the accepted generic boundary,
derives parent identity from the active supervisor binding, rereads durable
caller and child records, resolves the configured `implementer`, assigns the
attempt and diagnostic-only JobId, and returns only after the durable generic
launch-accepted checkpoint. The durable child `Execution Resolution` selects a
harmless delayed Bun command; the actual child is launched as a detached
subprocess by the accepted supervisor, with supervisor-owned parentage and
stable componentPath/taskRevision/attempt identity. No caller parent, JobId,
worker, command, or free-form scope is forwarded.

The existing runtime map is atomically reloaded and reconciled through the
existing path-and-attempt status/watch seam. Missing, malformed, orphaned,
unavailable, live, terminal, cancellation, and cleanup observations remain
explicit; JobId and private handles remain diagnostic runtime state. Cancellation
and cleanup are routed through the accepted supervisor and leave no owned
worker, supervisor, process group, private runtime, or component runtime-map
entry. The controller-loss fixture killed only the submitting local controller
and subsequently observed the detached child through the stable path identity.

No OpenCode payload was used, no OpenCode custom tool was called, and no
provider, model, network, or external service was contacted. The
`opencode-host-integration/` custom-tool/session blocker remains explicitly
outside this result.

Exact changed-artifact set:

- `subprocess-host-integration/subprocess-host-integration.ts`
- `subprocess-host-integration/subprocess-host-integration.test.ts`
- `subprocess-host-integration/as-is.md`

There are no descendants (`maximum-children: 0`), so the terminal descendant
set is empty and there are no failed or cancelled descendants to account for.

## Blockers And Escalations

No implementation blocker remains for the bounded local subprocess host path.
Residual risk is limited to POSIX `setsid`/process-group semantics, the
host-unavailable billing surface, the accepted generic-to-supervisor checkpoint
composition documented in Progress, and the fact that controller-loss evidence
is same-host local process termination only. It does not prove general SSH loss,
remote host recovery, OpenCode session/event mediation, OpenCode custom-tool
exposure, provider/model use, or a live approval UI. Those remain explicit
OpenCode/host blockers rather than fallback claims.

## Recovery

Reread this component record and the named read-only dependencies. The durable
recovery checkpoint is the three component-local files named above and the
focused command `bun test
subprocess-host-integration/subprocess-host-integration.test.ts`; no private
runtime state is required. If a handoff is interrupted, rerun the focused test,
the accepted seam regressions, the no-bundle checks, the scoped validator, and
the process/whitespace checks. Preserve the non-fallbacking failure taxonomy and
do not revive systemd or claim OpenCode evidence.

## Next Action

The orchestrator must independently inspect this completed record and scoped
diff, rerun the selected checks as needed, account for the residual OpenCode and
controller-loss limits, and commit only this component's durable handoff with
`committing-completed-work`. No parent, sibling, accepted dependency, systemd
history, or external service was changed.
