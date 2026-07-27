---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T13:06:47Z
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
      allocated-seconds: 240
      spent-seconds: 2.735
      reserve-seconds: 45
      source: host:monotonic-wrapper
  external-effects: prohibited
acceptance:
  - Implement a deterministic, local-only mock backend/adapter fixture in this
    component that accepts only the minimal component-path, durable task
    revision, one-based attempt, and parent envelope, without invoking
    OpenCode, a model, a provider, or any network service.
  - Emit machine-readable protocol-shaped lifecycle and role events for the
    `as-is -> orchestrator -> implementer` chain, preserving parent links and
    configured `implementer` attribution; wrong-role, missing-parent, duplicate,
    stale, and malformed envelopes must be explicit rejected or blocked results.
  - Exercise delayed completion, controlled failure, permission denial and
    awaiting-approval, cancellation, and cleanup outcomes through deterministic
    fixture controls. Permission waiting must use the documented durable
    `awaiting-approval`/`awaiting-user-approval` boundary and must not hide a
    prompt or infer approval.
  - Run through the accepted generic supervisor and its path/revision/attempt
    adapter boundary, persist and atomically reconcile the documented private
    runtime `job-map.json`, and keep JobId diagnostic-only rather than task
    identity or completion authority.
  - Provide fixture-local status lookup by canonical component path with an
    optional attempt and repeated watch output using the accepted status/watch
    contract. Reload/reconciliation must explicitly classify live, terminal,
    stale, dead, orphaned, unknown, and unavailable observations and must never
    infer completion from missing private state or a missing map entry.
  - Prove a controller/SSH-equivalent process can be terminated while the
    detached job continues or reaches an explicit terminal state, then prove
    restart/reconciliation, cancellation, cleanup, and no-leftover-process or
    process-group behavior with only temporary owned state.
  - Keep all implementation, tests, fixtures, and this record inside this
    component. Read named supervisor, adapter, status/watch, and contract files
    only as dependencies. Do not modify the retired systemd flow, accounting
    implementation, unrelated root-audit changes, untracked `control-plane.md`,
    blocked OpenCode host-integration files, or accepted dependency
    implementations.
  - Record exact invocation/protocol, validation commands and observed results,
    host-reported actual cost when available, host-observed monotonic wall-clock
    use, residual risk, cleanup evidence, and descendant closure before handoff.
---

# Mock Job Supervisor Fixture

## Purpose

Provide a deterministic local backend fixture for the generic supervisor,
launch-adapter, runtime-map, status/watch, and connection-loss boundary. This
component proves the host-neutral detached-job and durable-observation contract
without contacting OpenCode or any external model/provider.

## Task Revision

`mock-supervisor-fixture-v1`

## Requirement

Implement one tool-agnostic mock-job adapter/script and focused tests inside
this component. The fixture must accept the minimal launch envelope and derive
task meaning from the assigned component record and centrally supplied context;
it must not duplicate a repository-wide prompt or make a runtime JobId a task
identity. It may use Bun/TypeScript or another established local pattern, but
the mock protocol must be deterministic and independent of any OpenCode binary,
session, event bridge, model, provider, or network.

The fixture's scenarios must cover the harmless lifecycle matrix named in the
acceptance list, including a controller process-loss run in which only the
controller is killed and the detached supervisor-owned job is subsequently
observed through the path-based status/watch surface. Temporary runtime state
must be private, owned by the fixture run, and removed after durable evidence is
saved. The fixture is evidence for the generic supervisor and adapter contract
only; it is not OpenCode session/event mediation evidence.

Named read-only dependencies are `subprocess-execution-foundation/`,
`opencode-launch-adapter/`, `component-status-watch/`, `execution-contract.md`,
`orchestration-design.md`, `execution-accounting-design.md`,
`component-task-record-protocol.md`, and `opencode-adapter.md`. Repository
instructions, design principles, and permitted skills are centrally supplied
read-only context. No child delegation is permitted.

## Plan

1. Inspect the accepted supervisor, launch adapter, status/watch boundary, and
   named contracts to identify the smallest compatible mock adapter envelope,
   event shape, runtime-map path, and process ownership controls.
2. Implement the component-local deterministic mock command/adapter and tests
   for role/lifecycle events, delayed success, failure, permission outcomes,
   cancellation, cleanup, path/attempt status/watch, map reload/reconciliation,
   stale/unknown classification, and controller loss.
3. Run focused tests and exact CLI/protocol checks, independently inspect the
   process chain and runtime map, terminate only the controller for the
   connection-loss check, rerun status/watch after loss, validate the task
   record/build/diff, and record evidence and residual risk.

## Progress

The orchestrator selected `mock-job/supervisor-fixture` as a new component
because it names the bounded deterministic mock-job boundary without implying
OpenCode behavior. This record was created atomically before delegation with
the configured worker `implementer`, no children, a 0.40 USD authorization and
240-second wall-clock authorization. The parent/root and blocked
`opencode-host-integration` records remain read-only until the worker handoff
is independently accepted.

The configured `implementer` completed the component-local implementation with
no child delegation. `mock-job.ts` accepts exactly the four-key envelope
`componentPath`, `taskRevision`, `attempt`, and `parentContext`; derives the
worker command and role chain from the component record and parent context; and
submits the harmless Bun worker through the accepted launch-adapter boundary and
generic detached supervisor. `mock-job.test.ts` is the only fixture test and
uses only owned temporary project/state roots.

## Validation

Validation command (host-monotonic wrapper):

`python3 -c 'import subprocess,time,sys; started=time.monotonic_ns(); result=subprocess.run(["bun","test","mock-job/supervisor-fixture/mock-job.test.ts"], cwd="/home/vc/dev/trial/as-is"); print(f"HOST_MONOTONIC_WALL_CLOCK_SECONDS={(time.monotonic_ns()-started)/1_000_000_000:.3f}"); sys.exit(result.returncode)'`

Observed result: Bun 1.3.14 reported `5 pass`, `0 fail`, `72 expect() calls`;
the host wrapper reported `HOST_MONOTONIC_WALL_CLOCK_SECONDS=2.735`.

Exact protocol/CLI checks exercised by that focused command were:

The accepted launch envelope was exactly:
`{"componentPath":"mock-job/supervisor-fixture","taskRevision":"mock-supervisor-fixture-v1","attempt":1,"parentContext":{"componentPath":"mock-job","role":"orchestrator","sessionId":"<orchestrator-session>","parentSessionId":"<as-is-session>"}}`.

- `launchMockJob({ projectRoot, stateHome, envelope, control })` with the
  minimal four-key envelope and controls `delayed-completion`,
  `controlled-failure`, `permission-awaiting`, `permission-denied`, and
  `cancellation`.
- `bun mock-job.ts controller-loss --project-root <owned-temp>
  --state-home <owned-temp> --control controller-loss --envelope-json
  <minimal-envelope> --result-file <owned-temp>/controller-result.json`;
  only the controller process was terminated, and the detached supervisor-owned
  worker was subsequently observed and handed off.
- `bun mock-job.ts watch --project-root <owned-temp>
  --component-path mock-job/supervisor-fixture --state-home <owned-temp>
  --attempt 1 --count 3 --interval-ms 10` emitted three independent JSON
  observations with sequences `0, 1, 2` and
  `completionInferredFromPolling: false`.

The focused assertions directly observed parent-linked machine-readable role
events, implementer attribution, delayed completion, controlled failure,
durable `awaiting-approval` plus `awaiting-user-approval`, explicit denial,
atomic private map writes with mode `0600`, path/revision/attempt map identity,
diagnostic-only JobId, cleanup-complete evidence, and no leftover process group,
supervisor, supervisor process group, or runtime directory. Reconciliation
explicitly returned live, terminal, stale, dead, orphaned, unknown, malformed-
map/unavailable, and missing-map classifications without inferring completion
from missing private state. Host cost was unavailable; supervisor evidence
labels it `host:supervisor-cost-not-reported`. Wall-clock is the host monotonic
wrapper observation above, used as the validation fallback metric.

## Result

Completed. The deterministic local fixture proves only the generic
supervisor/runtime-map/status/watch and controller-loss boundary. It does not
claim a live OpenCode session, event bridge, permission bridge, model, provider,
or network service. All descendants are terminal by construction: this record
has `maximum-children: 0` and created no descendants. The scoped handoff is the
component files and this record; no parent or sibling record was changed.

## Blockers And Escalations

If the configured `implementer` is unavailable, returns under another role, or
the fixture cannot satisfy its local-only boundary, record the exact durable
blocker and stop without retry, role substitution, direct worker launch, model
invocation, external network access, or edits outside this component.

## Recovery

Recovery checkpoint: `mock-supervisor-fixture-v1`, completed record, focused
test suite passed, durable handoff and cleanup evidence retained in the record,
and all owned temporary roots removed after evidence was saved. Recover from
this record and the component-local files; do not treat a missing map, private
state, controller exit, or detached process exit as task completion.

Residual risk: this fixture uses the accepted adapter's normalized
`opencode` discriminant solely to reach the already accepted adapter boundary,
while the command is a local Bun worker and the result labels
`openCodeEvidence: false`. It does not validate a live OpenCode host/session or
external permission path; those remain outside this component's acceptance
boundary.

## Next Action

The orchestrator must independently rerun the focused component test, inspect
the scoped diff, and accept or reject this completed handoff. No retry,
substitution, child delegation, external service, or parent/sibling edit is
authorized by this component.
