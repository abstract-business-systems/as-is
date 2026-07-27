---
as-is-version: 2
task:
  status: blocked
  worker: implementer
  updated: 2026-07-27T14:07:42Z
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
  - Expose the supervisor-provided generic delegation tool to an OpenCode-hosted
    agent. Accept the agent's semantic caller identity only after the
    supervisor verifies it against the active caller binding and durable caller
    record; derive parent identity from the active supervisor job/tool context,
    resolve the child component and configured implementer from durable records,
    and reject direct, wrong-role, duplicate, stale, or unattributed
    submissions without fallback.
  - Connect the accepted opencode-launch-adapter to an actual OpenCode-hosted
    delegation-tool call through the accepted generic supervisor, without
    adding OpenCode assumptions to the generic supervisor core. The supervisor
    assigns the attempt and diagnostic-only JobId, launches the configured
    child through the adapter, and returns after a durable launch-accepted
    checkpoint before worker completion. Nested OpenCode agent/session events
    are optional diagnostics, not required attribution evidence.
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
  - Validate a fresh harmless real-host smoke in which an OpenCode-hosted agent
    calls the generic delegation tool and the supervisor evidence proves the
    verified caller, derived parent, configured child launch, durable
    component-path/task-revision/attempt status, and return after launch
    acceptance. Also validate local lifecycle evidence for running and
    terminal states, cancellation, cleanup with no leftover process/groups or
    private runtime, stale/unknown state, duplicate/recovery handling, and map
    reconciliation/reload. Validate connection loss or SSH-equivalent host
    loss separately; if this host cannot prove it, record an explicit durable
    capability blocker and do not infer success.
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

Provide the smallest real host-integration slice that exposes the
supervisor-provided generic delegation tool through OpenCode and composes the
accepted generic supervisor, `opencode-launch-adapter`, and
`component-status-watch` into one detached job lifecycle. This component owns
only the OpenCode tool/host bridge and its runtime-map/reconciliation evidence;
durable task records remain authoritative and the generic supervisor remains
host-neutral. OpenCode nesting events are optional diagnostics.

## Requirement

Implement and validate one supported non-blocking OpenCode mediation path. The
path must let an OpenCode-hosted agent call the generic delegation tool, state
its semantic identity, and receive a supervisor result that proves caller
verification, derived parentage, durable child resolution, configured
`as-is -> orchestrator -> implementer` role enforcement, attempt/JobId
assignment, and launch acceptance. It must reread a real component record,
submit through the accepted launch adapter and supervisor, persist the
documented private JobId map, and remain addressable by component path and
optional attempt after the submitting call and a runtime reload. The bridge may
use a component-local host wrapper to start the real OpenCode command inside the
supervisor-owned detached process, but OpenCode command, session, optional
diagnostic event, and permission behavior must stay at this adapter boundary
rather than enter the generic supervisor. A missing nested OpenCode event is
not a delegation failure when the supervisor's normalized tool evidence is
complete.

The named read-only dependencies are `subprocess-execution-foundation/`,
`opencode-launch-adapter/`, `component-status-watch/`, `opencode-adapter.md`,
`execution-contract.md`, `orchestration-design.md`, `configuration.md`,
`execution-accounting-design.md`, `component-task-record-protocol.md`, and the
new `delegation-tool-boundary/` handoff. Repository instructions, design
principles, and permitted skills are centrally supplied read-only context. No
child delegation is permitted. A host limitation
that prevents proving the generic tool call, supervisor binding, safe
reconciliation, or the separately required connection-loss boundary is a
durable blocker, not a reason to claim support or use a foreground fallback.
Missing nested OpenCode attribution alone is not a blocker under this corrected
design.

## Plan

1. Inspect the accepted adapter, supervisor, status/watch contracts, fresh
   OpenCode discovery, and local tool/command/session capabilities. Define the
   component-local delegation-tool bridge and exact map schema without changing
   dependencies; do not make nested OpenCode events the semantic source.
2. Implement the detached real-OpenCode tool-mediated launch, atomic runtime-map
   lifecycle, reload/reconciliation, path/attempt status/watch composition, and
   explicit permission/unknown/connection-loss outcomes. Keep all host-specific
   behavior in this component and preserve the minimal launch envelope.
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

The component-local bridge and tests are present from the prior bounded attempt.
That implementation keeps OpenCode command/session/event handling in
`opencode-bridge.ts`, submits only through `launchComponent`, and uses the
accepted supervisor for detached ownership, cancellation, and cleanup.
`opencode-host-integration.ts` resolves the canonical component path, derives
the stable revision from the immutable record definition, carries attempt 1 and
the current record revision, persists the private XDG runtime map atomically,
and joins path/attempt status and watch. It does not implement or prove the
generic delegation tool; its prior session-chain check is retained as
historical adapter evidence only.

The resolved durable identity for this record is
`opencode-host-integration/record-dd31b37d5838124cfbebc921/1`; the configured
worker is `implementer`. The adapter's historical minimal launch envelope
carries the record revision `2026-07-27T12:26:47Z` and parent/session
attribution; the generated JobId is stored only as a diagnostic map key. No
generic-tool caller verification or derived-parent launch was observed, and no
descendants were delegated.

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

### Historical Option C live smoke test

The user authorized one real external-service smoke attempt. The orchestrator
used a disposable isolated project with a temporary OpenCode configuration,
local agent/skill definitions, a fresh `as-is.md`, and one `fixture-component`
record whose only permitted result was a reversible marker file. The host's
pre-created `/tmp/opencode` directory was root-owned and not writable by the
invoking user, so the disposable root used a unique `/tmp` directory instead;
no tracked file or credential was placed there. The temporary configuration
used the host's existing authentication and the configured low-cost
`openrouter/mini` model, denied web/external-directory access, and used a
90-second root / 60-second component budget in the prompt and records.
OpenCode's CLI exposed no per-run monetary cap.

The exact historical adapter path was
`launchOpenCodeComponent -> opencode-launch-adapter -> subprocess-execution-foundation
supervisor -> opencode-bridge.ts -> opencode run --format json --agent as-is`.
The adapter returned `started` after its durable `launch-accepted` checkpoint;
the host-monotonic submission interval was **0.069574 seconds**, while the
detached worker was still live. Initial status, repeated three-observation
watch, and runtime-map reconciliation resolved the stable
`fixture-component/task-revision/1` key. The runtime JobId was exposed only as
diagnostic data. The launch envelope recorded the passing proactive permission
profile and `workerRole: implementer`.

The real OpenCode process exited zero and emitted eight sanitized structured
JSON event summaries, but the adapter boundary observed only one session with
no agent name, no parent ID, and no task events. Those missing nested events
are not a failure under the corrected design, but this run also did not call a
supervisor-provided generic delegation tool, so it proved neither caller
verification nor derived parentage/configured-child launch. The bridge
durably recorded `opencode-mediation-blocked` with the historical blocker
`OpenCode session event did not identify the requested as-is primary`; process
exit and non-empty events were not promoted to success. The fixture marker was
not created. No implementer recovery was launched.

The corrected acceptance therefore supersedes the old event-attribution
blocker: a future smoke must capture the normalized generic-tool request and
result, verified caller, derived parent, configured child launch, durable
launch checkpoint, and component-path status. OpenCode session events remain
optional diagnostics. No generic delegation-tool implementation is claimed in
this record or its existing bridge.

For the connection-loss check, the controller process alone was terminated
after launch acceptance. Later component-path/attempt status and watch remained
addressable; reconciliation observed the detached job's explicit failed
terminal state, dead supervisor/worker handles, and cleanup pending. The
component-local cleanup then completed, the private OpenCode session was
deleted, and no owned controller, bridge, supervisor, worker, process group, or
runtime directory remained. This is evidence for the failed-attribution job's
controller-loss cleanup boundary, not successful OpenCode mediation or a
general SSH-loss guarantee.

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
  `implementer (subagent)`. This proves discovery only, not the generic
  delegation tool, a live model connection, or supervisor caller evidence.
- Independent post-suite process checks found no owned `opencode-bridge.ts`,
  `opencode-host-integration.ts`, or detached `supervisor.ts --supervise`
  process, and glob checks found no `as-is-opencode-host-*`,
  `as-is-opencode-adapter-*`, or `as-is-status-watch-*` fixture roots.

### Historical live smoke validation

- Fresh temporary agent discovery exposed `as-is (primary)`,
  `orchestrator (subagent)`, and `implementer (subagent)`. The historical real
  launch command was submitted only through the component adapter/bridge and
  returned before worker completion
  (`host:monotonic-controller-launch`, **0.069574 seconds**). It did not expose
  or call the not-yet-implemented generic delegation tool.
- The adapter-bound redacted event capture contained **8** events and one
  session record, but no agent attribution, parent ID, or task/subagent event.
  The historical structured mediation result was `blocked`, with blocker
  `OpenCode session event did not identify the requested as-is primary`.
  Missing nested event attribution is optional under the corrected design, so
  this is retained as a diagnostic observation rather than the new acceptance
  condition. No normalized delegation-tool request/result, verified caller, or
  derived parent was captured.
  OpenCode exit code `0` was retained only as a host observation and was not
  treated as mediation or completion evidence. No session/token cost was
  exposed by the boundary; provider billing and model/token cost are
  **unavailable**, not zero.
- Immediately after the historical submit, path/attempt status was `active`/`live` with a
  persisted runtime map, stable identity, diagnostic-only JobId, live
  supervisor and worker PID/process-group health, and the accepted adapter
  execution mode. Three subsequent watch observations remained independently
  parseable with polling not treated as completion. After controller loss,
  status/watch resolved the same path/attempt to terminal `failed`, and reload
  reconciliation classified the runtime `terminal`/`dead`; cleanup changed
  the map to `cleanup`/`complete` with no live handles.
- Full smoke wall-clock use is **unavailable**: only the monotonic launch
  submission interval above was measured. The existing component validation
  observation remains cumulative **12.380705 seconds**; it is not combined
  with the unmeasured live invocation. No retry or paid second attempt was
  made.

Host-reported monetary cost is unavailable. No OpenCode model/token charge or
provider billing value was observed, and `spent: 0.00` remains the supplied
non-billing placeholder rather than an actual-cost claim. The host-observed
monotonic validation use recorded here is **12.380705 seconds**, below the
300-second allocation; overlapping dependency-check intervals were not added a
second time.

Residual risk is limited to the unimplemented/unproven generic delegation-tool
boundary and its real OpenCode smoke, the unproven connection-loss/SSH-
equivalent observation, unavailable provider billing, and POSIX host process
semantics outside the harmless local fixtures. Nested OpenCode event
attribution is intentionally not a residual acceptance requirement.
Descendant closure is satisfied: no child records were created, so there are no
failed or cancelled descendants to account for.

## Result

The prior bounded component implementation is complete as far as the local host
capabilities prove: it composes the accepted adapter and host-neutral
supervisor, starts a real `opencode run --format json --agent as-is` command
only inside the detached supervisor wrapper, persists the documented private
JobId map with stable path/revision/attempt identity, exposes reloadable
component-path status/watch, records explicit permission and reconciliation
outcomes, and preserves supervisor-owned cancellation and cleanup. It does not
expose the generic delegation tool or prove its caller/parent contract. The map
is atomically updated for launch-accepted, running, terminal, cancellation,
cleanup, and reconciliation transitions. No public historical aggregation,
full permission-event UI, retired systemd recovery, accounting changes, or root
completion is implied.

This record is intentionally **not completed** because the required live-host
evidence is unavailable. No completion or commit claim is made.

## Blockers And Escalations

Durable capability blocker: this host proves only local OpenCode discovery
(`opencode --version` and `opencode agent list`) plus the historical detached
bridge. The generic delegation tool is not implemented, and the historical
`opencode run` did not call it, so no real supervisor-verified caller, derived
parent, configured child launch, or tool-mediated component-path status exists.
A future live `opencode run` would require a model/provider connection, which is
an external service effect requiring authorization in that turn. The host also
exposes no local SSH-equivalent transport boundary that can be deliberately
severed and observed through the adapter. Therefore the tool-mediated smoke and
real connection-loss/host-loss evidence remain unproven. The local fixture must
not be promoted to real-host tool evidence, and a missing event, process exit,
or unavailable private state must not be inferred as success.

The accepted generic mock boundary is evidence for the reusable supervisor and
adapter contract only. It does not satisfy this component's real OpenCode
delegation-tool call, verified caller/derived parent, configured child launch,
or real host-loss acceptance conditions; this record remains `blocked` and must
not be marked completed.

The historical real smoke reached the actual adapter and supervisor and
produced a live OpenCode session, but it did not expose or call the generic
delegation tool. Eight structured events yielded no identified `as-is` agent,
no `orchestrator` or `implementer` task event, and no parent links. The exact
current blocker is therefore **the generic delegation tool is not implemented
and the historical bridge produced no supervisor-verified caller/parent
evidence**. The absent nested event attribution is retained as optional
diagnostic evidence, not a required acceptance failure. The zero process exit,
empty task-event set, and model availability are not tool evidence. The
configured implementer was not recovered after this smoke; no role substitution
or retry is permitted.

The task stops at this blocker without retrying, substituting `general` or
`explore`, direct-launching a worker, using a foreground fallback, contacting an
external service, or modifying an accepted dependency.

## Recovery

Recover from this record and the scoped bridge/map implementation. Reread the
record, preserve the cumulative **12.380705-second** host observation and
unavailable cost source, and first implement the generic delegation-tool
boundary in its separate authorized component. Then obtain an explicitly
authorized local OpenCode tool bridge or model connection and an SSH-equivalent
loss harness before attempting the blocked validation. Reuse the stable identity
`opencode-host-integration/record-dd31b37d5838124cfbebc921/1`; do not create a
new attempt merely because the map or JobId is reloaded. Never treat a JobId,
missing map entry, process exit, or lost private session as completion. Do not
modify parent, sibling, accepted dependency, retired systemd, accounting,
root-audit, or `control-plane.md` artifacts.

## Next Action

Stop this smoke attempt without retry or worker recovery. A future explicitly
authorized bounded task must first implement and expose the generic delegation
tool, then prove through supervisor/durable evidence the verified caller,
derived parent, configured child launch, and component-path status. Nested
OpenCode task/session events are optional diagnostics. The configured
`implementer` may recover this same blocked record exactly once after that
handoff and the separately authorized loss harness are available. The observed
controller-loss result is not a substitute for successful tool mediation or a
general SSH-loss claim. There is no completion commit for this attempt because
the corrected live acceptance boundary failed; this component cannot claim root
completion.
