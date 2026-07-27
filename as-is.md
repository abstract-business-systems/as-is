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
  status: blocked
  worker: implementer
  updated: 2026-07-27T16:56:42Z
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
  - Preserve the separation between the delegate protocol's parent-child
    semantics and the reusable supervisor core; expose one generic
    supervisor-provided delegation tool/skill whose caller identity is stated
    by the agent but verified against the active supervisor context and durable
    caller record. Keep OpenCode-specific session, event, and permission
    behavior at the adapter boundary, with a clear extension point for shell,
    CI, remote, and other job backends.
  - Provide one supported non-blocking host integration that maps an
    orchestrator delegation-tool call to the accepted detached supervisor,
    resolves the child component and configured implementer from durable
    records, establishes parentage from the active supervisor context, assigns
    the attempt/runtime JobId, and returns after a durable launch checkpoint
    rather than waiting for worker completion or foreground process exit.
  - Run a harmless fresh real-OpenCode smoke in which an OpenCode-hosted agent
    calls the supervisor-provided delegation tool. The evidence must show the
    verified caller identity, derived parent, configured child launch, and
    component-path/task-revision/attempt status after submission. Nested
    OpenCode agent/session events are optional diagnostics and are not an
    acceptance requirement.
   - Provide a user/as-is/orchestrator-invocable, read-only, machine-readable
     live-job status command or API addressable by component path and optional
     attempt. Repeated calls must resolve the related durable record without
     relying on an in-memory handle; a runtime JobId may be exposed only as
     diagnostic data and is not task identity. The response must report the
     durable record, attempt, verified role/derived parent chain (and optional
     host-session diagnostics),
    supervisor and worker PIDs, process-group IDs and health, host status and
    outcome, stale classification, source-labelled budget observations, logs
    or their unavailable state, and the next safe action.
  - Make the same status surface parseable by the as-is/orchestrator and keep
    the component record authoritative. Missing private state, an unavailable
    host observation, or a lost connection must be reported explicitly rather
    than inferred as completion or cleanup.
  - Make permission-needed/approval, stale or unknown, cancellation requested
    or confirmed, recovery scheduled or escalated, cleanup deferred or
    complete, and role-attribution or parent-link failures visible through the
    status surface. Validate the SSH-disconnect or equivalent connection-loss
    behavior; if the selected host cannot observe it, record a durable
    capability blocker instead of claiming support.
  - Validate the complete harmless path from a fresh as-is invocation through
    orchestrator submission, implementer execution, repeated status polling,
    cancellation or recovery, durable handoff, and cleanup. Preserve
    component-only context, higher-authority constraints, cumulative budget
    evidence, descendant closure, and scoped completion commits.
---

# Subprocess Pipeline Integration

## Purpose

Record the bounded integration work needed to make the accepted subprocess
foundation usable as the user's end-to-end as-is pipeline. Current task state
belongs in this record or in a live component `as-is.md`; historical task state
is recoverable from Git history and summarized, without verbose duplication, in
[`change-log.md`](change-log.md).

## Requirement

Integrate the accepted detached subprocess supervisor with the real
as-is/orchestrator host path and expose a repeatable live-job observation
surface. The integration must establish the user's stated behavior without
turning a foreground OpenCode/task-tool call into a falsely asynchronous
launch. Agents call the generic supervisor-provided delegation tool and state
their semantic identity; the supervisor verifies the caller, derives parentage
from its active context, resolves the child path and configured role, assigns
attempt/runtime correlation, and returns after durable launch acceptance. The
delegate protocol remains the semantic layer for parent-child scope, role
attribution, component path, acceptance, handoff, and ancestor integration
authority. The supervisor remains a host-neutral core for arbitrary job
backends; OpenCode session, event, and permission behavior belongs only to its
adapter. It must not replace durable task records with private runtime state or
silently substitute a role.

## Decision Boundary

- The accepted subprocess foundation is the current execution implementation;
  its scoped handoff is commit `e8fb1da` and its component record is terminal.
- The existing OpenCode mapping remains synchronous and explicitly says that
  live control and a validated non-blocking host mapping are unimplemented.
  The current control-plane CLI reads repository records only and does not
  inspect sessions, processes, private runtime state, or job handles.
- The durable launch envelope is intentionally minimal: component path, durable
  task revision and attempt, record revision, and an adapter/job specification
  resolved from the current records and effective configuration. Requirement,
  configured worker, acceptance, constraints,
  common context, and integration authority are derived from `as-is.md` and
  centrally supplied read-only context rather than duplicated in command
  arguments.
- The agent-facing delegation request is intentionally smaller than a host
  nesting event: caller semantic identity plus child component path and
  optional expected task revision/attempt. The supervisor-issued active binding
  verifies the caller; parent identity, configured worker, effective child
  context, attempt assignment, and runtime JobId are resolved or assigned by
  the supervisor. JobId remains diagnostic-only and path/revision/attempt is
  the stable lookup identity.
- Proactive permission profiles are inputs to the supervisor and selected
  adapter. Generic capability preflight belongs to the reusable supervisor;
  OpenCode-specific permission settings and event limitations belong only to
  `opencode-adapter.md`.
- This root record is the nearest common ancestor for the cross-cutting host
  integration and live-status surface. The audit that created this record did
  not launch a worker or modify implementation code.
- The prior completed migration is recoverable from Git commit `d6b03b7` and
  the historical decisions in `change-log.md`; this record is the new bounded
  current task rather than a claim that the prior migration was incomplete.

## Plan

1. Add and validate the smallest adapter-to-supervisor launch seam using the
   minimal component-path/task-revision/attempt envelope and an optional
   diagnostic runtime job identifier. Do not encode
   task-record semantics or OpenCode assumptions in the supervisor.
2. Add a stable component-path status lookup, with optional attempt selection,
   and machine-readable output that joins the durable record with
   source-labelled supervisor/process observations without making private
   runtime state authoritative. A JobId-only lookup is not the stable task
   interface. This remains a separate
   acceptance slice from the launch seam.
3. Wire the as-is/orchestrator path and fresh-host mediation to those
   boundaries through the generic delegation tool; reject synchronous
   foreground fallback, mismatched caller, missing parent, wrong role or
   component, duplicate attempt, permission denial, and unavailable supervisor
   as durable blockers. OpenCode nested event attribution is optional
   diagnostics rather than a required semantic edge.
4. Validate repeated status polling and the permission, stale, cancellation,
   recovery, cleanup, attribution, and connection-loss boundaries with harmless
   local evidence and a fresh host invocation.
5. Record residual risk and the scoped handoff only after descendant closure,
   required validation, and the completed-work commit are available.

## Progress

The audit found that the role definitions are correctly routed: the as-is
primary explicitly requests `orchestrator`, and the orchestrator definition
requires the configured `implementer` target without fallback. The accepted
supervisor library can detach a harmless command and its focused tests prove a
launch checkpoint can return before worker completion.

The first bounded implementation slice is now complete in the new
`opencode-launch-adapter` component. Its configured `implementer` handoff is
committed in `94e3d04` and resolves the durable child record, validates the
`as-is -> orchestrator -> implementer` chain and proactive permission profile,
passes the minimal path/revision/attempt/parent/job envelope, and submits only
through the accepted generic supervisor. The component record and focused test
remain the authoritative handoff evidence; the parent task remains blocked
because its later status/watch and live-host acceptance conditions are not met.

This clarification records the architectural split: delegation semantics remain
in the durable protocol and records; the accepted supervisor is a reusable
host-neutral runtime core; and OpenCode behavior determines only the OpenCode
adapter's session, event, permission, and role-mediation mapping. Shell, CI,
remote, and other backends remain extension points. The minimum launch envelope
is component path plus durable task revision/attempt, record revision, and the
resolved adapter/job specification; task meaning is derived from `as-is.md`
rather than duplicated in command arguments. Generated JobId and parent-job identifiers
remain optional runtime correlation data, not task identity.

### Architectural correction: generic delegation-tool boundary

The corrected model does not require OpenCode to understand delegation nesting
or emit nested agent/session events. An active agent states its semantic
identity to the supervisor-provided generic delegation tool; the supervisor
verifies it against the supervisor-issued caller binding and durable caller
record, derives parent identity from the active supervisor job/tool context,
resolves the child component and configured worker from durable records, assigns
the attempt and diagnostic-only JobId, launches through the selected adapter,
and returns after durable launch acceptance. The child uses the same tool for
further authorized delegation. OpenCode, shell, CI, and remote adapters only
expose or translate this contract; they do not own nesting semantics.

The full request, result, failure classes, and stable
`component-path/task-revision/attempt` lookup identity are now authoritative in
`execution-contract.md`. A new bounded `delegation-tool-boundary/` task record
was created for the next implementation task with the configured worker
`implementer`, but no worker was launched and no tool implementation is claimed
in this correction. Historical accounting and the accepted public
`component-status-watch` surface remain dependencies, not scope of that new
task.

The end-to-end host path is not ready. `opencode-adapter.md` records that the
current `opencode run` and task-tool path is synchronous, that the generic
delegation tool is not yet implemented, that no validated OpenCode server/job
mapping exists, and that live control is unimplemented.
The accepted supervisor exports `launch()` and `observe(handle)` as library
APIs, while the delegated `component-status-watch` component now supplies the
new path/attempt CLI and API boundary; its independent acceptance remains
blocked below. The existing control-plane `status` and `general-question`
commands remain explicitly record-only.

The live observation gap remains material at the host boundary: the internal
`observe(handle)` result joins runtime JobId, process health, stale
classification, budget, and durable events, while the new status surface can
join those observations only when the documented runtime map is available.
The existing control-plane record-only output still has no runtime process
chain. No validated SSH-disconnect observation or OpenCode live user-event
bridge was found. Nested OpenCode event attribution is no longer an acceptance
requirement under the correction; the missing generic tool implementation and a
future tool-mediated smoke are the current blockers. These are not permission
to substitute a host fallback or modify accepted implementation code outside
the bounded child.

At the initial child checkpoint, the launch adapter and a scoped status/watch
implementation were present, but no full OpenCode host mediation was claimed.
The harmless adapter fixture did not prove a real OpenCode session/event bridge,
and the status/watch child's independent focused validation was then blocked by
a deterministic test failure. The parent task remained non-terminal at that
checkpoint; the later repair and current parent state are recorded below.

The next bounded child `component-status-watch` was delegated only to the
configured `implementer` and produced scoped handoff commit `85116d5` with the
path-based `component-status-watch` API/CLI. The worker record reports a
component-path/task-revision/attempt lookup, repeated JSON watch output,
explicit unavailable/unknown/terminal classifications, and contract-shaped
runtime-map reconciliation without making JobId task identity. At that earlier
checkpoint, the worker's handoff was not accepted by this parent: an independent
rerun of its focused test failed deterministically in the active detached
fixture because the test asserted the record remained byte-identical while the
supervisor was concurrently writing its `watchdog-configured` and `waiting`
checkpoints. This was a validation blocker, not evidence that the read-only
query itself wrote the record. No worker retry or role substitution was launched.

The explicitly authorized recovery of that same component was delegated only to
the configured `implementer`; no duplicate or substitute task was created. The
worker repaired the test boundary in `component-status-watch/status-watch.test.ts`
by waiting for the detached fixture to reach its final `budget-observed`
checkpoint and for owned processes/groups to be gone before taking the durable
record snapshot used by the read-only assertion. The test still exercises active
stable path/revision/attempt lookup and repeated watch output, and the
quiescent snapshot still asserts that status/watch reads do not mutate the
record. Two independent focused runs passed (`4 pass, 0 fail, 46 expect()` each).
The required supervisor regression then failed outside this component (`9 pass,
1 fail, 106 expect()`, watchdog assertion at
`subprocess-execution-foundation/supervisor.test.ts:332`, expected source
`supervisor-watchdog`, received `undefined`). The worker correctly stopped
without retrying, editing the supervisor, or substituting a role.

The orchestrator then created a new bounded repair incarnation at
`subprocess-execution-foundation/as-is.md` for the configured `implementer`,
preserving the completed lineage at `e8fb1da`. The repair identified a race in
which private terminal host state became visible before the durable terminal
failure checkpoint and ordered the source-labelled durable checkpoint first.
Its scoped handoff was independently reviewed and committed as `57ed2d2` after
the full supervisor suite, adapter/status-watch suites, syntax/build, validator,
and repeated cleanup checks passed. The orchestrator then independently reran
the preserved status-watch test repair (`4 pass, 0 fail, 46 expect()`), reran
its syntax/build, CLI, validator, and cleanup checks, and accepted the separate
status-watch repair as terminal in its current record. Its test/record-only
handoff was committed separately as `3a02974`; `status-watch.ts` remained in
the prior accepted handoff `85116d5`. The status/watch runtime-map absence and
host-mediation limitations remain explicit and are not being expanded here.

### Bounded OpenCode host-integration attempt

The next authorized child was created atomically at
`opencode-host-integration/as-is.md` for the configured `implementer`, with
the narrow host-integration boundary recorded there. The worker returned under
the correct `implementer` attribution with no descendants and left the child
`blocked`, not completed. Its durable identity is
`opencode-host-integration/record-dd31b37d5838124cfbebc921/1`; no completion
commit was created.

The child produced only component-local artifacts:
`opencode-host-integration/opencode-bridge.ts`,
`opencode-host-integration/opencode-host-integration.ts`,
`opencode-host-integration/opencode-host-integration.test.ts`, and its current
record. The worker's fresh harmless fixtures passed the focused suite (`4
pass, 0 fail, 42 expects`), repeated focused runs, adapter/status-watch/
supervisor regression suites, syntax/build checks, scoped task-record
validation, whitespace checks, map reload/reconciliation, cancellation,
cleanup, duplicate, stale/unknown, permission-denial, and no-leftover checks.
Those are local fixture observations only. Fresh `opencode --version` and
`opencode agent list` proved installed discovery (`1.17.18`, with `as-is`,
`orchestrator`, and `implementer`), but no live model/session event bridge.

Under the earlier event-attribution criterion, the exact durable blocker was
that this host could not prove a live OpenCode session/event mediation with
parent-linked task attribution or a real connection-loss/SSH-equivalent
host-loss observation without an external model or provider service and an
authorized loss harness. The child explicitly did not promote fixture-shaped
events, process exit, missing private state, or discovery output to live-host
evidence, did not retry or substitute a role, and did not invoke a foreground
fallback. The corrected criterion now treats nested event attribution as
optional; the current child record names the unimplemented generic tool and
missing tool-mediated smoke as the active blocker.

### Deterministic generic-boundary fixture

The separately bounded `mock-job/supervisor-fixture` was delegated only to the
configured `implementer` and completed in scoped commit `1e1bb4d`. Its local
deterministic Bun worker accepts the exact four-field envelope
`componentPath/taskRevision/attempt/parentContext`, emits the
`as-is -> orchestrator -> implementer` role/lifecycle events, writes and
reconciles the documented private runtime map, and exposes path/attempt status
and repeated watch without making JobId task identity. The worker record reports
`5 pass`, `0 fail`, `72 expect()` calls; the task-record validator reports
`VALID`; accepted supervisor, launch-adapter, and status/watch regression suites
also passed independently.

The orchestrator independently launched the fixture with control
`controller-loss`, inspected the map and supervisor/worker PID/process-group
state, sent `SIGTERM` only to the controller PID, then queried status and three
watch observations. Status remained an explicit `live`/`active` observation
after controller loss; the detached supervisor reached explicit host
`completed`, received a durable handoff, left an empty runtime-map `entries`
object, and reported false supervisor/worker/process-group health plus
`runtimeExists: false`. The owned temporary root was removed and a subsequent
exact process scan found no fixture worker or `--supervise` process. This proves
the generic supervisor/adapter/runtime-map/status/watch/controller-loss boundary
only. The adapter result explicitly records `openCodeEvidence: false`; no
OpenCode command, model, provider, network, session, or event bridge was used.

This fixture does not unblock the separate `opencode-host-integration` child:
the generic tool-mediated OpenCode call/verified parent evidence and real
SSH-equivalent host-loss evidence remain unavailable and blocked. Its
parent-linked fixture events remain generic-boundary evidence only.

### Durable accounting audit

The current version-2 accounting model is cumulative and component-local:
`spent` and `spent-seconds` carry actual or host-observed use across attempts,
while parent delegation checks child allocations against the parent's own
remaining allocation and reserve. Parent and child actual-use observations are
reported separately; no inclusive parent/root roll-up or cross-record
deduplication is implemented. The protocol clarification in
`component-task-record-protocol.md` records this boundary.

The supervisor has per-component durable `budget-observed` checkpoints with
attempt ordinals and runtime JobId diagnostics, source-labelled cost and
wall-clock values, unavailable values, and per-job accounting guards. That is
not a cross-session historical summary.
No append-only summary covering both money and time, unknown observations,
attempt/session identity, and cross-record double-count prevention was found in
the current design, records, implementation, tests, Git history, or
`change-log.md`. The retired cost-observability lineage remains recoverable from
Git and its concise cost facts remain in `change-log.md`; its private session
state was not byte-preserved. The bounded accounting and identity design is
recorded in `execution-accounting-design.md` and its current task record at
`execution-accounting-design/as-is.md`.

## Validation

`verification-discipline` selected end-to-end audit evidence because the request
is user-visible and operational. The record retains the following prior focused
evidence; it does not establish the missing host integration:

- `bun test subprocess-execution-foundation/supervisor.test.ts` reported `10
  pass`, `0 fail`, and `106 expect()` calls. The tests cover non-blocking launch,
  process groups, repeated `observe()` polling, stale/unknown classification,
  permission, cancellation, bounded recovery, attribution, handoff, and
  cleanup for harmless local fixtures.
- `bun test control-plane/control-plane.test.ts` reported `3 pass`, `0 fail`,
  and `28 expect()` calls. `bun --check` passed for both the supervisor and
  control-plane modules.
- `bun control-plane/control-plane.ts status .` returned JSON with
  `"active-tasks": []`, `"next-check-in": null`, and
  `"source": "repository task records only"`; it contained no job IDs, PIDs,
  process groups, session chain, or live host status. The repeated,
  parseable `general-question` command returned the same record-only boundary.
- Importing the supervisor module showed the exported observation API includes
  `launch` and `observe`, but no status CLI, component-path lookup, or watch
  operation.
  Executing the module directly is restricted to its internal `--supervise`
  mode.
- `opencode-adapter.md` and `control-plane.md` were read as authoritative
  adapter/boundary documentation. They explicitly leave OpenCode live control
  and host lifecycle wiring unimplemented; the current foreground invocation is
  synchronous.
- `git status --short --branch` reported `## master...origin/master [ahead 43]`
  and one pre-existing untracked file, `control-plane.md`. No implementation
  file was changed; `control-plane.md` remains untouched.
- `python3 schemas/task-record-validator/task_record_validator.py .` was also
  run and reported the repository's existing mixed agent/task-record shape,
  root-only `config` fields, legacy skill-record fields, and pre-existing
  aggregate delegation/budget violations. This audit does not reinterpret that
  result as pipeline evidence or repair unrelated records. The focused
  terminal component records remain the applicable prior evidence.

After this clarification, the focused checks reported:

- `python3 -m unittest -v
  schemas/task-record-validator/test_task_record_validator.py` passed all 6
  validator tests.
- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reported `VALID`. The same validator run on
  `.` reported `INVALID` only for the repository's pre-existing mixed
  agent-record shape, root-only `config`, legacy skill-record fields, and
  aggregate delegation/budget violations; no record was repaired for this
  documentation task.
- `bun control-plane/control-plane.ts status .` reported root `blocked`, no
  active tasks, `next-check-in: null`, and `source: repository task records
  only`. It exposed no live job/session/process observation, as required by the
  current blocked boundary.
- A fresh `opencode agent list` exposed `as-is (primary)`,
  `orchestrator (subagent)`, and `implementer (subagent)`; no role guard was
  weakened. The reference check passed for the layered boundaries, minimal
  envelope, query/delegation behavior, permission isolation, and blocked
  status.
- `git diff --check` passed. `control-plane.md` remained the pre-existing
  untracked file and was not changed; no implementation file under
  `subprocess-execution-foundation/` was changed.

The independently reviewed child handoff additionally reported:

- `bun test opencode-launch-adapter/adapter.test.ts` passed `2`, failed `0`,
  with `30 expect()` calls. Its delayed-worker fixture returned after the
  durable `launch-accepted` checkpoint, checked the minimal envelope and
  configured role, rejected duplicate/wrong-role/permission/foreground cases,
  and confirmed supervisor-owned cleanup.
- `bun --check opencode-launch-adapter/adapter.ts` and the accepted supervisor
  syntax check passed. The existing supervisor suite still reported `10 pass`,
  `0 fail`, and `106 expect()` calls.
- An independent harmless fixture rejected missing parent and wrong job
  component with durable `blocked` checkpoints and `noWorkerSubmitted: true`.
  The launch seam's generated JobId remained diagnostic-only in the envelope;
  no public lookup or watch surface was added.
- The child handoff is commit `94e3d04`; its host-reported monetary cost is
  unavailable and its focused monotonic validation interval is `1.178` seconds.
  An independent component-record validator invocation exposed the existing
  validator's inability to arithmetic-check an explicit `spent: unavailable`
  value; this is retained as a record/validator compatibility residual risk,
  not treated as launch success evidence.

These checks validate the changed Markdown and record references only; they do
not validate an OpenCode adapter, public status/watch surface, or detached
end-to-end host path.

The accounting audit additionally passed the six focused validator unit tests,
the focused supervisor and control-plane Bun tests, the control-plane Bun build,
focused version-2 record validation for the current component and retained
fixtures, and `git diff --check`. The repository-wide validator remains invalid
for the pre-existing mixed agent-record shape and aggregate budget/delegation
violations; those unrelated records were not repaired. No implementation code
was changed by this audit.

Host-reported monetary cost and cumulative task wall-clock for the root
orchestrator are unavailable. The delegated child records its own focused
host-observed validation interval and unavailable monetary cost; this root
record does not copy child actual use into its own budget fields.

The independent review of `component-status-watch` additionally observed:

- `bun test component-status-watch/status-watch.test.ts` reported `3 pass`,
  `1 fail`, and `43 expect()` calls on two consecutive runs. The failure is the
  active-fixture byte-preservation assertion at the watch test's line 257;
  the supervisor's durable checkpoint writes are visible in the received
  record. This prevents completion evidence for the child until its configured
  worker repairs or narrows that test without weakening the read-only and
  durable-authority requirements.
- `bun --check component-status-watch/status-watch.ts`, the accepted
  supervisor and launch-adapter syntax checks, and the focused supervisor
  (`10 pass`, `0 fail`, `106 expect()`) and launch-adapter (`2 pass`, `0 fail`,
  `30 expect()`) suites passed. The status CLI and two-line watch CLI emitted
  parseable JSON with explicit missing runtime state and
  `completionInferredFromPolling: false`.
- `python3 schemas/task-record-validator/task_record_validator.py
  component-status-watch` reported `VALID`, and the scoped child commit
  contains only `component-status-watch/as-is.md`, `status-watch.ts`, and
  `status-watch.test.ts`. The pre-existing root edits and untracked
  `control-plane.md` remain outside the child handoff.

The child reported a host-observed focused validation interval of `0.79`
seconds and unavailable monetary cost. Independent validation observed no
running supervisor after the checks; the host's shared `/tmp/as-is` parent
contains prior/test runtime directories and cannot be removed by this
repository-only orchestrator without explicit external-path authorization.

The authorized recovery recorded cumulative host-observed monotonic validation
time **3.57 seconds** (prior **0.79** seconds plus **2.781** seconds for the two
focused runs); monetary cost remains unavailable. The recovery worker's direct
cleanup observation found no owned detached fixture processes/groups or matching
temporary fixture roots, and did not alter the pre-existing external
`/tmp/as-is` tree. Its explicit persisted-runtime-map limitation remains honest:
the accepted supervisor has no `job-map.json` writer, so production runtime
diagnostics remain `missing`/`unavailable` while path/attempt lookup remains
usable; no map producer was added.

### Architectural-correction validation

- Focused reference assertions passed for the generic request/result contract,
  caller binding, derived parent, configured-role enforcement, stable identity,
  all required failure classes, adapter neutrality, optional OpenCode
  diagnostics, and the revised host-integration acceptance.
- `python3 schemas/task-record-validator/task_record_validator.py
  delegation-tool-boundary` and the same command for
  `opencode-host-integration` both reported `VALID`. The focused validator unit
  suite passed all 6 tests. The repository-wide validator remains blocked by
  pre-existing mixed-record/configuration and aggregate budget/delegation
  issues; no unrelated record was repaired.
- `python3 -m json.tool .opencode/opencode.json`, the focused agent
  front-matter/config check, fresh `opencode agent list`, and `git diff --check`
  all passed. Fresh discovery exposed `as-is (primary)`, `orchestrator
  (subagent)`, and `implementer (subagent)`; no role guard was weakened.
- These are design, record, syntax, discovery, and whitespace observations
  only. No worker was launched, no delegation tool implementation exists yet,
  and no real tool-mediated OpenCode smoke was attempted. Host-reported cost
  and root orchestrator wall-clock use remain unavailable.

### Explicit subprocess-method scope switch

The user has explicitly changed the next bounded implementation from the
blocked OpenCode custom-tool path to a subprocess-backed host integration that
must preserve the same caller/parent, configured-worker, non-blocking launch,
stable identity, runtime-map, status/watch, permission, cancellation, cleanup,
and controller-loss control-plane behavior. The existing
`opencode-host-integration/` record remains a distinct blocked descendant and
is not reopened or rewritten; its exact residual blocker is still the
unproven OpenCode custom-tool/permission host boundary and tool-mediated smoke.

The smallest new component record was created atomically at
`subprocess-host-integration/as-is.md` for the configured `implementer`. It
must reuse the accepted detached subprocess supervisor and adapter seams and
the completed generic delegation boundary without changing those components,
reviving systemd, touching untracked `control-plane.md`, or claiming actual
OpenCode custom-tool invocation.

The configured worker returned the component handoff in scoped commit
`1207bce`, but the orchestrator's independent `bun test
subprocess-host-integration/subprocess-host-integration.test.ts` rerun reported
**4 pass, 1 fail, 80 expects**: after same-host controller termination, the
detached child completed but cleanup returned `unavailable` rather than the
required `cleanup-complete` at test line 463. The component record was durably
re-blocked; the worker's earlier three passing runs do not override this fresh
contradiction. Accepted supervisor, launch-adapter, status/watch, and generic
delegation regressions passed independently. No completion commit is accepted
for the new scope until the configured implementer repairs this boundary and a
fresh independent rerun passes. The new child therefore remains non-terminal;
the original OpenCode custom-tool/permission blocker remains distinct and
unchanged.

## Result

The bounded adapter-to-supervisor launch slice is complete in child component
`opencode-launch-adapter`, but this parent task is not complete. The full
pipeline is ready only when a real user/as-is invocation can call the generic
delegation tool, the supervisor verifies the caller and derives parentage,
launches the configured implementer through the accepted detached supervisor,
returns before worker completion, and exposes repeated component-path status
(and optional attempt). A record-only task status or the supervisor's internal
typed API is not sufficient for that claim; a runtime JobId may supplement the
response but cannot authorize it. Nested OpenCode event attribution is optional
diagnostic evidence, not a required acceptance field.

## Blockers And Escalations

Current blockers are the not-yet-implemented generic delegation tool, the
missing supervisor job-map writer (the status/watch child reports map absence as
explicit unavailable runtime observation), the unproven tool-mediated fresh
OpenCode smoke, and the separate SSH-disconnect capability. The accepted
foundation, its scoped repair, launch adapter, and status/watch handoff do not
establish those host capabilities. The latest real smoke's absent nested event
attribution is retained as optional diagnostic evidence, not treated as a
requirement or as proof of the new tool boundary. Do not substitute a
foreground `opencode run`, direct `implementer` target, `general`/`explore`
fallback, private runtime inspection, automatic worker retry, or systemd
revival. The completed child handoffs do not make this parent complete; the
parent remains blocked on its own host-boundary acceptance conditions.

The new `opencode-host-integration` child is an additional non-terminal
`blocked` descendant. Its local map, detached wrapper, status/watch composition,
permission, cancellation, stale/unknown, duplicate/recovery, reconciliation,
and cleanup fixtures passed, but the worker could prove only OpenCode discovery,
not a live model/session event bridge or parent-linked task event. It also could
not observe a real connection-loss or SSH-equivalent host-loss boundary without
an external model/provider service and an authorized loss harness. These exact
capability gaps are recorded in the child record; no fixture-shaped event,
process exit, missing private state, or discovery result is completion evidence.

The new `delegation-tool-boundary` child is a `ready`, non-terminal design/task
record for the next authorized implementation. It is configured for
`implementer`, has no descendants, and was created without launching a worker
or changing implementation code. Its acceptance requires the generic request,
caller verification, derived parent, configured-role enforcement, attempt and
diagnostic JobId handling, explicit failure states, adapter neutrality, and the
focused real-smoke handoff described in the durable specifications.

This architectural correction is not a completed root handoff: the existing
host-integration descendant is blocked and the new tool-boundary descendant is
ready. The `committing-completed-work` precondition therefore is not satisfied;
no commit was attempted. The pre-existing untracked `control-plane.md` remains
untouched and outside this scope.

## Recovery

Recover this blocked integration task from this record and the terminal child
handoff at `opencode-launch-adapter/`,
`execution-contract.md`, `orchestration-design.md`, `configuration.md`,
`opencode-adapter.md`, and the accepted component at
`subprocess-execution-foundation/`. Historical completed migration state is in
Git commit `d6b03b7`; the accepted supervisor handoff is `e8fb1da`, its repair is
`57ed2d2`, and the separate status/watch repair handoff is `3a02974` (with the
implementation handoff at `85116d5`). Do not restore an archive folder, revive
systemd, infer host capability from process exit, or overwrite this record's
blocker without fresh evidence. `delegation-tool-boundary/as-is.md` is the next
implementation boundary; begin from it only after an authorized delegation.

## Next Action

The launch-seam child, supervisor repair, and status/watch repair are terminal
and have separate scoped handoffs (`94e3d04`, `57ed2d2`, and `3a02974`). The
`opencode-host-integration` child remains blocked with no completion commit, and
the new `delegation-tool-boundary` child is ready but has no worker attempt, so
the parent remains blocked and non-terminal. Stop here without launching an
implementer in this turn or substituting a role. The next authorized action is
the configured `implementer` implementation of the generic delegation tool;
only after that handoff may a fresh real OpenCode smoke prove tool-mediated
caller verification, derived parentage, configured child launch, and
component-path status. Do not expand into historical aggregation, public
status/watch implementation, full permission-event UI, unproven connection-loss
claims, or systemd revival.
