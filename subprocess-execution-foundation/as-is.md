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
  - Inspect the named host-neutral execution contract, orchestration design,
    OpenCode adapter boundary, root task record, and current systemd fallback
    record before editing; record the exact implementation artifact set and any
    material departure before changing code.
  - Implement the smallest dependency-free subprocess-first supervisor or
    equivalently supported server-job foundation inside this component. A
    foreground child awaited by the submitting turn is explicitly not a valid
    implementation of this task.
  - Submit exactly one configured `as-is -> orchestrator -> implementer`
    attempt only after authority, allocation, and record checks; persist an
    atomic durable launch checkpoint before the submitting turn returns, and
    return before worker completion or process exit.
  - Establish machine-observable role attribution at every edge. Reject a
    direct top-level worker launch, `general` or `explore` substitution,
    unexpected task event, missing parent linkage, or unattributed return as a
    durable delegation blocker rather than treating it as success.
  - Make the detached supervisor or supported server job own the worker
    process group and remain independently addressable after submission. Capture
    source-labelled logs and lifecycle events and persist the state required for
    later observation without making private runtime state task authority.
  - Support later polling of both the durable component record and
    source-labelled process, session, or job health for running, completed,
    failed, unavailable, and waiting states. Process health, a handle, an event
    stream, or process exit must not replace durable validation or handoff.
  - Route cancellation through a durable request and checkpoint before asking
    the supervisor or host to stop the process group; later observation must
    confirm termination and preserve partial work, audit evidence, and recovery
    context.
  - Detect stale work from the durable `task.updated` checkpoint and effective
    check-in interval, distinguish unknown observations from stale state, and
    implement finite recovery attempts, cumulative backoff, escalation, and
    unavailable-worker handling without silently replacing `implementer`.
  - Preserve cumulative cost and wall-clock accounting across attempts with
    source-labelled unavailable values, retained reserves, no-double-counting
    aggregation, and admission/stop behavior at budget boundaries. Never turn
    an estimate or unavailable observation into actual zero use.
  - Save durable launch, observation, cancellation, failure, stale, recovery,
    budget, and handoff evidence before removing private runtime state; cleanup
    must leave no unowned process group, job, unit, log, or private runtime
    residue, as confirmed by an independent parent check.
  - Preserve the archived `task-archives/systemd-user-job-adapter/` record and
    its prior handoff as the later fallback/recovery baseline. Do not edit,
    retry, complete, retire, or integrate that deferred repair from this
    component; its recovery remains a separate same-component task using only
    `implementer` after this foundation is independently accepted.
   - Record focused validation, residual risk, recovery state, actual
     host-reported cost, and host-observed wall-clock use before any handoff.
   - Before launch, resume, or recovery, perform capability preflight; use a
     supervisor-owned approved private workspace; disable hidden interactive
     prompts; persist a structured `permission-needed` event and exact durable
     `awaiting-user-approval` permission state; surface user-visible escalation;
     and preserve scoped approval, denial, and resume semantics.
   - Enforce watchdog heartbeat/deadline and stale classification, finite
     recovery with repeated-blocker fingerprinting/no retry loop, and durable
     cancellation followed by process-group and cleanup confirmation. A host
     that cannot prove user-event bubbling must remain a durable blocker.
     Complete this component only after every listed acceptance condition and
    descendant-closure check has evidence, then use
    `committing-completed-work` for only this component's scoped handoff.
---

# Subprocess Execution Foundation

## Purpose

Own the cross-cutting, host-neutral launch foundation that can submit a bounded
worker attempt without making the submitting as-is/OpenCode/orchestrator turn
wait for worker completion. This component is the prerequisite for safely
delegating later work through the durable `as-is -> orchestrator -> implementer`
chain.

## Requirement

Implement and validate a supervisor-owned detached subprocess or equivalently
supported server-job boundary that satisfies the complete non-blocking execution
contract. The component must preserve task-record authority, component-only
worker context, configured-role mediation, durable lifecycle evidence,
cancellation, stale detection, bounded recovery, cumulative accounting, and
private-runtime cleanup. A subprocess API such as `Bun.spawn` is only a launch
primitive; an awaited foreground child does not satisfy this requirement.

The implementation may read these explicit external dependencies, which remain
read-only from this component:

- `as-is.md` for the current decision, allocation, and local host-capability
  evidence;
- `execution-contract.md` for the authoritative lifecycle and recovery
  contract;
- `orchestration-design.md` for hierarchy, non-blocking job, and integration
  boundaries;
- `opencode-adapter.md` for the current synchronous mapping, role topology, and
  attribution limits; and
- `task-archives/systemd-user-job-adapter/record.md` for the retained
  fallback/recovery baseline and its deferred repair boundary.

The current root capability checkpoint directly observed the local
`systemd-run --user --no-block` facility, unit/process ownership, temporary
checkpoint persistence, polling, cancellation confirmation, failure
observation, and bounded recovery representation. That evidence is a host
facility dependency and candidate mapping only; it does not prove that this
repository has a safe detached supervisor, role-attributed worker launch, or
complete asynchronous lifecycle. If the implementation cannot establish those
facts, it must leave a durable capability blocker rather than weaken the
acceptance boundary.

## Plan

This record was created atomically by the root orchestrator as a new `ready`
component task. The semantically narrow path `subprocess-execution-foundation`
names both the subprocess-first mechanism and its foundational lifecycle
responsibility; it avoids the generic or overloaded `manager`/`utils` terms.
At the record-creation checkpoint, no worker had been launched and no
implementation artifact existed in this component; the later attempt and its
partial artifact are recorded below.

At a future explicitly authorized launch, the configured `implementer` must
first inspect the named dependencies, map each acceptance condition to an
observable check, and record the exact changed-artifact set. All implementation,
test, and local durable handoff artifacts must remain inside this component;
parent integration, the systemd repair, agent definitions, `AGENTS.md`, and
`control-plane.md` are outside its write boundary.

The implementation must then establish one bounded supervisor/job path, prove
submission-before-completion and durable checkpoint ordering, exercise the
role-attribution and lifecycle operations with harmless reversible local
evidence, and record any unsupported host capability as a blocker. It must not
claim that OpenCode server APIs, a process handle, or a passing subprocess probe
alone establish the contract.

## Progress

Created atomically at `2026-07-26T21:09:29Z` by the root orchestrator after
reading the repository instructions, design principles, component protocol,
root context, host-neutral contract, orchestration design, OpenCode adapter,
agent records, and the retained systemd fallback record. The record is `ready`,
configured for `implementer`, and has no attempt, implementation, validation,
host-reported cost, or host-observed wall-clock use. The numeric initial spent
values represent no started attempt; they are not a measured validation result
 or a claim of host billing.

The configured `implementer` attempt became `active` at
`2026-07-26T21:17:40Z` after rereading this record and all five explicitly
named dependencies. Before implementation, the exact planned changed-artifact
set is `supervisor.ts`, `supervisor.test.ts`, and this `as-is.md` record only.
The implementation choice is a dependency-free Bun/TypeScript detached
supervisor using a POSIX process-group boundary, atomic durable record
checkpoints, and disposable private runtime state. This is a material
implementation choice rather than a departure from the acceptance contract;
the archived systemd adapter remains read-only and is not retried.

The deferred `systemd-user-job-adapter/` repair remains preserved under
`task-archives/systemd-user-job-adapter/` and is not a dependency that
authorizes editing or retrying it. This new component is the ordered foundation
task; the systemd adapter can be recovered only after this handoff is
independently accepted and separately authorized.

At the recovery-observation checkpoint `2026-07-26T21:27:10Z`, the configured
`implementer` attempt had become `blocked` through the supported control-plane
question path. The record was active at `2026-07-26T21:17:40Z`, and the partial
`supervisor.ts` artifact is present, but no attributable implementer,
supervisor, or worker process was observable. No focused test, handoff, or
host-reported cost/wall-clock observation is recorded. This is a worker/session
loss blocker, not completion or permission to retry; the partial artifact,
allocation, configured worker, and exact acceptance boundary remain preserved.

At the explicitly authorized recovery checkpoint `2026-07-26T21:34:57Z`, the
orchestrator reused this blocked record and preserved the prior lost-attempt
lineage and partial `supervisor.ts`; no duplicate record or new component was
created. The recovery is ordinal `1` after the prior initial attempt and uses
only the recorded configured worker `implementer`, which fresh agent discovery
reported available. Allocation and sibling-independence checks passed before
delegation: the child retains `0.20` USD plus `0.04` reserve and `120` seconds
plus `30` seconds reserve, within the root's post-reserve `0.45` USD and `240`
seconds available budget. Prior host cost and wall-clock observations remain
unavailable and are not reset or represented as measured zero. The effective
concurrency limit is `1`; no active sibling exists, completed children are
terminal, the archived systemd repair is read-only fallback lineage, and no
mutable sibling dependency overlaps this component. The record is active for
this single bounded recovery launch; the next action is to delegate only to
`implementer` and stop if that attributable attempt stalls or fails again.

At the recovery implementation checkpoint `2026-07-26T21:36:27Z`, the
configured worker reconciled the existing component contents before editing.
The exact durable artifact set remains `supervisor.ts`,
`supervisor.test.ts`, and this `as-is.md` record only; no parent, sibling,
archive, host configuration, or runtime-state artifact is in scope. The
partial `supervisor.ts` is preserved as the implementation base. The material
choice remains the dependency-free Bun/TypeScript detached supervisor with a
POSIX process-group boundary, atomic task-record checkpoints, source-labelled
host observations, and disposable private runtime state. No material departure
from the recorded acceptance boundary or technology guidance is authorized;
the implementation will add only the planned focused test artifact and
component-local corrections needed to prove the complete boundary.

At the fresh recovery checkpoint `2026-07-26T21:53:21Z`, the orchestrator
reread this blocked lineage, the preserved partial `supervisor.ts`, the named
execution-contract/orchestration-design/OpenCode boundaries, the archived
systemd fallback, the configured agent definitions, and the actual Git state.
The prior initial implementer attempt remains durably blocked for unattributed
worker/session loss. Two subsequent recovery requests were also aborted before
an attributable implementer return; neither produced validation, a handoff, or
permission to substitute a role. These observations are preserved as lineage,
not converted into completion or a hidden reset. This checkpoint reuses the
same component record and partial artifact and authorizes one fresh bounded
recovery only through the configured `implementer`.

Fresh allocation and sibling-independence checks passed: the component retains
`0.20` USD plus `0.04` reserve and `120` seconds plus `30` seconds reserve;
root post-reserve availability is `0.45` USD and `240` seconds, and prior
host-reported cost and cumulative host wall-clock remain unavailable rather
than measured zero. The effective concurrency limit is `1`; no active mutable
sibling exists, the archived systemd adapter is read-only recovery lineage,
and this component's declared read-only dependencies do not require another
active sibling. `implementer` was freshly discovered and is available; no
`general`, `explore`, direct top-level worker, systemd adapter, or duplicate
component task is eligible. The root remains `blocked` while this child is
non-terminal; the next action is exactly one attributable implementer recovery,
with no silent retry if it stalls, fails, or cannot be attributed.

At the fresh implementation start checkpoint `2026-07-26T21:54:58Z`, this
configured `implementer` reread the record and all explicitly named
dependencies before editing. The record remains `active` for this one
authorized recovery. The exact changed-artifact set is still
`supervisor.ts`, `supervisor.test.ts`, and this `as-is.md` only. The partial
supervisor is the implementation base. The material implementation choice is
to complete its dependency-free Bun/TypeScript detached supervisor with a
POSIX `setsid` worker process-group boundary, atomic durable record
checkpoints, source-labelled private observations, and disposable runtime
state. This is a bounded completion of the recorded choice, not a departure:
the deferred systemd adapter remains read-only, no real implementer or
external service will be launched, and descendant delegation remains closed
(`maximum-children: 0`).

At the permission/liveness prerequisite checkpoint `2026-07-26T22:07:41Z`, the
orchestrator reconciled the stale front-matter `active` value with the existing
supported question-path blocker and set this record to `blocked`. This is a
durable status correction, not a retry, recovery, reset, completion claim, or
worker return. The initial unattributed/lost implementer attempt, two aborted
recovery requests, allocation, configured worker, and partial `supervisor.ts`
remain preserved exactly as recovery lineage.

The current contract now requires capability preflight before every launch,
resume, or recovery; supervisor ownership of a private approved `0700`
workspace; no hidden prompts; a structured `permission-needed` event; the
schema-compatible `awaiting-approval` status carrying exact durable permission
state `awaiting-user-approval`; user-visible escalation with scoped approval,
denial, and resume; watchdog heartbeat/deadline; stale detection; finite
recovery; repeated-blocker fingerprinting that suppresses retry loops; and
durable cancellation followed by process-group and cleanup confirmation. No
component implementation code was changed and no worker was launched.

At the completed recovery handoff checkpoint `2026-07-27T07:23:55Z`, the
configured `implementer` completed the existing component-only lineage without
launching a real implementer, contacting an external service/model, delegating
a descendant, editing the parent, retrying the deferred systemd archive, or
creating runtime state in the repository. The partial `supervisor.ts` was
completed in place and the exact durable artifact set is
`supervisor.ts`, `supervisor.test.ts`, and this `as-is.md`. The implementation
is a dependency-free Bun/TypeScript detached supervisor with POSIX `setsid`
process-group ownership, atomic task-record checkpoints, approved private
workspace/preflight, explicit permission escalation/approval APIs, watchdog
heartbeats/deadlines, source-labelled observations, bounded recovery, durable
cancellation, and evidence-before-cleanup ordering. No material departure from
the recorded acceptance boundary was made.

## Validation

At the record-creation checkpoint `2026-07-26T21:11:07Z`, the lightweight
creation checks passed: `python3
schemas/task-record-validator/task_record_validator.py
subprocess-execution-foundation` reported `VALID`; `bun
control-plane/control-plane.ts status .` parsed the active tree and reported
this component `ready` with worker `implementer`, the root `blocked`, and the
systemd repair `blocked`; and tracked plus untracked-record whitespace checks
reported no diagnostics. No implementation validation, worker launch, host
lifecycle probe, or external effect ran at creation.

Before a completion claim, the configured worker and parent must collect at least
this focused evidence:

- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reports `VALID` for the component record;
- `bun control-plane/control-plane.ts status .` parses the active tree and
  reports the configured worker and durable statuses from records only;
- `bun --check` passes for every changed Bun/TypeScript artifact, and focused
  deterministic tests distinguish a foreground awaited child from a valid
  supervisor-owned detached job;
- a harmless reversible lifecycle probe observes the durable launch checkpoint
  before submitting-turn return, worker/process-group ownership, source-labelled
  logs/events, later record-plus-health polling, durable cancellation followed by
  confirmed termination, stale classification, bounded recovery/escalation,
  cumulative accounting, and cleanup;
- a role-attribution check observes the full
  `as-is -> orchestrator -> implementer` chain and rejects direct, wrong-role,
  missing-parent, and unattributed returns; and
- an independent parent check repeats no-leftover-process/group, unit/job,
  private-runtime, and evidence-retention assertions without modifying the
  blocked systemd repair or unrelated paths.

Validation must label host observations and OpenCode model/token accounting by
source, preserve unavailable values when they cannot be observed, and record
residual risk for any host capability not established by direct evidence.

No implementation validation has run for the blocked attempt. The component
record validator reported `VALID` before the blocker was recorded, and the
control-plane question durably transitioned this record from `active` to
`blocked`. No `supervisor.test.ts`, focused lifecycle test, `bun --check`,
handoff evidence, or independent no-leftover check exists in the record. Host
cost and host-observed wall-clock use remain unavailable; the numeric initial
spent fields are retained for schema compatibility and are not a measured-use
claim.

No implementation validation or handoff was produced by either of the two
aborted recovery requests preceding the fresh checkpoint. Their host cost and
wall-clock observations remain unavailable and are not represented as measured
zero use. The preserved `supervisor.ts` is therefore still partial evidence
only until the configured worker records focused lifecycle validation.

At the permission/liveness host-boundary checkpoint, a harmless inline local
probe used only a temporary `0700` state root and an approved `0700` workspace;
it did not use `implementer`, contact an external service, or modify component
implementation code. The probe directly observed:

- a permitted write inside the approved workspace;
- a deliberately denied write to a `0400` local target, returning in
  `0.036255` seconds and classified as structured `permission-needed` rather
  than a hang, with no target modification;
- atomic checkpoint persistence and reload, with `13` durable events including
  `permission-needed` and `awaiting-user-approval`;
- a `0.10` second watchdog deadline, timeout, and stale classification from the
  durable heartbeat age;
- process-group cancellation with a confirmed `-15` return code; and
- cleanup confirmation after the checkpoint was saved, with the temporary root
  absent.

The probe's host-observed monotonic wall-clock was `0.239093` seconds. Monetary
cost is unavailable from the host and remains unavailable, not measured zero.
The probe recorded `user-visible-escalation-unproven`: this host provided no
supported user-event bubbling channel for carrying the durable permission event
to a user and returning an approval/denial decision, and no user event was
simulated. Ownership was demonstrated only for the harmless probe process, not
for the preserved partial supervisor. These observations are a capability
checkpoint, not implementation or handoff evidence.

Focused record validation after this checkpoint again reported `VALID`, and
the supported control-plane status query reported this component `blocked` with
configured worker `implementer`, the root `blocked`, and no active task. Git
whitespace validation reported no diagnostics. No implementation test,
supervisor handoff, or completion evidence was produced.

Current recovery validation is complete and evidence-backed:

- `bun --check supervisor.ts` passed; `bun build supervisor.test.ts --target
  bun --outfile /dev/stdout >/dev/null` passed as the test-artifact build
  check; and `bun test supervisor.test.ts` passed with `10 pass`, `0 fail`, and
  `106 expect()` calls.
- The focused test covered durable launch acceptance before worker start and
  return-before-completion, supervisor-owned `setsid` worker groups,
  supervisor-created `0700` runtime/workspace modes, disabled stdin and the
  `AS_IS_NO_INTERACTIVE_PROMPT=1` boundary, source-labelled logs/events,
  running/waiting/completed/failed/unavailable polling, watchdog heartbeat and
  deadline failure, stale/fresh/unknown classification, durable cancellation,
  confirmed process-group and supervisor cleanup, bounded backoff/escalation,
  repeated-blocker fingerprint suppression, cumulative wall-clock accounting,
  unavailable cost accounting, handoff evidence, and no-leftover assertions.
- Role tests accepted only the machine-observable
  `as-is -> orchestrator -> implementer` chain and rejected direct, `general`,
  wrong-parent, missing-source, and unattributed events. The launch request
  rejects a non-`implementer` configured worker.
- Permission tests durably wrote structured `permission-needed` with exact
  `permissionState: awaiting-user-approval` before invoking a local
  user-event bridge, exercised scoped approval, denial, and resume, and left a
  `worker-loss/capability` blocker when the bridge was absent. No hidden prompt
  or simulated user event was used.
- `python3 schemas/task-record-validator/task_record_validator.py
  subprocess-execution-foundation` reported `VALID`. The supported
  `bun control-plane/control-plane.ts status .` query reported this configured
  `implementer` component `active` before the terminal transition; it reads
  repository records only.
- The final test command was wrapped by a host monotonic timer and directly
  reported `host_monotonic_wall_clock_seconds=7.879676`. Monetary cost is not
  reported by Bun or the local host and remains unavailable; the numeric cost
  compatibility field is not a measured zero-use claim. Prior lost-attempt and
  failed-to-return recovery wall-clock/cost observations remain unavailable and
  were not reset or converted to zero.
- An independent parent-side process check reported
  `NO_FOUNDATION_SUPERVISORS`, and the disposable `/tmp/as-is` runtime glob
  contained no files after the focused tests. These checks were observational
  only and did not modify the archived systemd repair or unrelated paths.

Residual risk: the supervisor depends on a POSIX `setsid` facility and on the
host adapter's truthful, machine-observable `userEventBubbling` capability
claim. OpenCode's current synchronous CLI is not claimed as the bridge or as a
production worker launch. The host supplies no provider/model billing surface,
so cost remains unavailable; durable records and source-labelled host health
remain authoritative over private state and process exit.

## Result

The subprocess execution foundation is `completed` for the explicitly
authorized recovery of the existing lineage. The prior unattributed/lost
configured-worker attempt and two failed-to-return recovery requests remain
preserved as historical blockers; they were not retried, erased, or converted
to success. The dependency-free supervisor and focused tests are complete in
the declared component-only artifact set, with no descendants to close. The
deferred systemd archive remains read-only recovery baseline and was not edited,
retried, completed, retired, or integrated.

## Blockers And Escalations

Current disposition: the worker-loss and permission/liveness blockers above are
preserved as prior lineage and were resolved for this single authorized
recovery only by implementing explicit durable capability/permission boundary
behavior and validating it with harmless local fixtures. The implementation
still refuses an unproven user-event bridge, wrong-role attribution, exhausted
budget, stale/unavailable evidence without a bounded recovery decision, or
cleanup before termination confirmation. No current blocker remains for this
component handoff; the host's unavailable monetary-cost source and OpenCode
synchronous-CLI limitation remain residual risks, not invented evidence.

Historical initial configured `implementer` attempt was blocked: the durable record became
active at `2026-07-26T21:17:40Z`, but the host observation at
`2026-07-26T21:27:10Z` found no attributable implementer, supervisor, or worker
process. The partial implementation has no focused validation or handoff
evidence. The complete detached supervisor/job capability, machine-observable
role attribution, durable checkpoint ordering, and cleanup boundary therefore
remain unproven. Do not substitute `general`, `explore`, a foreground child, or
the systemd repair, and do not silently retry this attempt.

Historical two recovery requests aborted before returning an attributable worker
result. They remain failed-to-return recovery history with no validation or
handoff evidence; they do not authorize a role replacement and do not erase the
initial worker-loss blocker. The fresh recovery checkpoint may launch only the
configured `implementer` once, and any new unattributed return or stall must be
recorded as a durable blocker without another retry in this turn.

The deferred systemd repair remains independently blocked for worker/session loss and
record-validation/cleanup findings. Its archive does not authorize a retry or
parent edit, and it remains a later fallback/recovery task.

The historical permission/liveness probe left a separate host capability blocker: no
supported machine-observable channel was available to bubble the durable
`permission-needed` escalation to a user and return a scoped approval or denial.
The exact limitation was recorded as `user-visible-escalation-unproven`; no
interactive prompt or simulated approval was used. The probe also proves only
the local process's temporary workspace ownership, not ownership by the partial
supervisor. These gaps prevent a permission-aware recovery claim and must be
resolved before recovering the configured worker.

## Recovery

On interruption, reread this record and the named dependency contracts. Preserve
the configured `implementer`, all cumulative budget observations, durable
checkpoints, partial component artifacts, and the exact acceptance boundary.
Decide from durable evidence whether an atomic partial result can continue, be
cleaned, or must restart. Do not infer completion or failure from process exit,
missing private state, a lost handle, or a cleaned temporary directory. Any
recovery uses the same supervisor-owned non-blocking boundary and finite
backoff/attempt policy; an unavailable configured worker is a durable blocker.

The current recovery checkpoint is `2026-07-26T22:07:41Z`: the initial lost
attempt and two aborted recovery requests remain preserved, the partial
`supervisor.ts` remains the implementation base, and cumulative cost and
wall-clock observations remain unavailable. The configured worker is
`implementer`; no replacement, foreground wait, or deferred systemd launch is
permitted. Before any recovery, the host must prove user-event bubbling for the
permission-needed escalation and the supervisor-owned approved-workspace/
preflight boundary, then receive explicit recovery authorization. A later
worker must reread this record and leave the component's durable validation,
cleanup, and handoff evidence in place.

Current recovery closure at `2026-07-27T07:23:55Z`: the one explicitly
authorized configured-`implementer` recovery completed with no descendants.
The prior unavailable cost/wall-clock observations remain preserved, while the
  focused validation directly observed `7.879676` seconds of host monotonic
wall-clock and no host monetary-cost source. The durable result, validation,
residual risk, cleanup evidence, and next action are recorded above; no further
component recovery or retry is authorized.

## Control Plane

- control-plane: {"approval-required":false,"checkpoint":"2026-07-26T21:27:10Z","event":"question","id":"q-8f7f1ec394b0","kind":"worker-question","question":"The configured implementer attempt is durably active but no attributable implementer, supervisor, or worker process is observable on the host; partial supervisor.ts exists, but no focused validation or handoff is recorded. Block this attempt for worker/session loss, preserve the partial artifacts and allocation, and await explicit recovery; do not retry, substitute a role, or treat process absence as completion.","status-before":"active"}

## Next Action

At the explicitly authorized recovery implementation checkpoint
`2026-07-27T07:14:30Z`, this configured `implementer` resumed the existing
blocked lineage and advanced the durable task status to `active`. The initial
lost attempt and two failed-to-return recovery requests remain preserved, as do
the partial `supervisor.ts`, allocation, unavailable accounting, configured
worker, and component-only write boundary. The exact changed-artifact set is
still `supervisor.ts`, `supervisor.test.ts`, and this `as-is.md` only. No
descendant delegation, direct worker launch, role substitution, external
service/model request, host configuration, or archive edit is authorized. The
next action is to complete and focus-test the dependency-free supervisor; any
unsupported capability or attribution/event-boundary observation remains a
durable blocker with no further attempt.

The current next action is parent-side independent review and nearest-common-
ancestor integration only after this scoped durable handoff is committed. This
component must not edit the parent, the deferred systemd archive, or unrelated
paths, and must not reopen the terminal record.

The fresh recovery decision remains superseded by the permission/liveness
checkpoint at `2026-07-26T22:07:41Z`. Do not delegate an attempt yet. First
obtain the missing user-event bubbling and supervisor-owned workspace/preflight
evidence, record the decision and exact host capability result, and obtain
explicit recovery authorization. Only then may exactly one attempt use the
configured `implementer`, reusing the partial `supervisor.ts` and this record.
Do not launch the deferred systemd adapter, substitute a role, create a
duplicate task, infer completion from process exit, or commit while the focused
implementation and full permission/liveness boundary remain unproven. If a
future authorized attempt stalls, fails, or returns without a durable handoff,
record the exact blocker and stop without silently retrying.

At the restarted recovery authorization checkpoint, the existing blocked record
was reused without overwriting its initial lost-attempt or two aborted
failed-to-return recovery lineage, partial `supervisor.ts`, allocation, or
configured worker. The host had no attributable prior probe or foundation
worker/supervisor left live. The corrected disposable all-permissions diagnostic
loaded an isolated OpenCode wildcard permission policy, demonstrated approved
workspace access, explicitly classified a filesystem denial as
`permission-needed`/`awaiting-user-approval` without a hidden prompt, observed
`/tmp` access, durable checkpoint reload, return-before-completion, polling,
cancellation, lifecycle/event capture, and cleanup, and left no process, unit, or
temporary root. It did not invoke a model and does not solve the production
permission-aware or OpenCode user-event-bubbling contract.

Fresh repository agent discovery reported `as-is (primary)`, `orchestrator
(subagent)`, and the configured `implementer (subagent)`. This is the one
explicitly authorized recovery launch of this existing component lineage. The
worker must reread this record and its named dependencies, preserve the exact
component-only write boundary and partial artifact, validate all acceptance
conditions, record actual host cost/wall-clock observations or unavailable
sources, and stop with a durable blocker on any unattributed return, session
loss, wrong-role event, or unsupported permission boundary. No retry,
substitution, deferred systemd launch, parent integration, or unrelated edit is
authorized.
