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
  status: completed
  worker: implementer
  updated: 2026-07-26T19:39:00Z
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
  - Reconcile this root record with the actual working tree and existing
    component records, including the committed Bun child and the supported
    `control-plane/control-plane.ts` boundary; distinguish current facts from
    preserved historical observations without changing protected fixture
    content.
  - Record the ordered six-step remediation plan and its decision boundary;
    this checkpoint must not implement code, launch a worker, or create ready
    records for steps 2 through 6.
  - Reuse this repository-root record as the only immediate step-1 task record;
    retain `implementer` as the configured future worker, keep the root blocked
    while non-terminal descendants remain active, and complete it only after the
    authorized archive removes those descendants without marking them complete.
  - Preserve the two unscheduled planning records and the historical
    `validation-fixtures/increment-5-cost-observability` record through the
    explicitly authorized reversible archive described below. Keep the
    historical record's `blocked` and no-retry state; do not retry or silently
    complete any archived work.
  - Replace the ambiguous hybrid subprocess wording with an explicit non-blocking
    job model: the OpenCode/as-is/orchestrator turn submits or spawns a worker
    attempt, records a durable launch checkpoint, and returns without waiting for
    completion; a supervisor/job owns the worker process group, logs/events, and
    persisted state; later check-ins poll durable state and process/session health.
    A foreground child awaited by the submitting turn is not asynchronous.
  - Make safe host detachment or supported server-job submission a prerequisite
    backed by host capability evidence. If that evidence is unavailable, record a
    durable blocker and do not claim asynchronous support. Preserve role
    mediation, component-only context, cancellation, stale detection, bounded
    recovery, cumulative accounting, and no silent role substitution.
  - Validate the planning checkpoint with focused path/record assertions,
    protected-record comparison, and `git diff --check`; record unavailable
    host cost and wall-clock observations rather than estimates.
  - If this bounded checkpoint qualifies for completion, use the repository-local
    completion procedure for only its scoped durable documentation/task-context
    handoff; otherwise record the blocker and do not commit. In either case, do
    not amend, push, create a pull request, change branches, alter remotes, stage
    unrelated working-tree records, or invoke a worker in this task.
---

# as-is Project

## Purpose

Maintain the repository-root durable task context while the orchestration
remediations are recorded in order. The root is the nearest common ancestor for
the cross-cutting boundary; existing component records remain authoritative for
their own scopes.

## Requirement

Record, in order, the bounded remediation needed before resuming the previously
authorized initiatives. The immediate current task is a root-record and
supported-boundary reconciliation; it is a planning checkpoint only. It does
not implement code, launch a worker, create future component records, retry the
protected fixture, or turn the OpenCode server-mode question into an
implementation task.

## Decision Boundary

The current root record is the only immediate step-1 task record and is reused
at `/home/vc/dev/trial/as-is/as-is.md`; no speculative `root-integration/` or
other component directory is created. Its configured worker remains
`implementer`, but no worker is launched in this planning task. The root is now
`completed` only because the three non-terminal records were archived through
the authorized reversible operation above; no archived record was marked
completed. The root had been `blocked` before that operation, with no active
root attempt, and the archived historical fixture retains its blocked/no-retry
state.

Only step 1 is recorded as the next implementation boundary. Steps 2 through 6
remain ordered plan items without new ready records or launches. Future work
must use the canonical `as-is -> orchestrator -> implementer` mediation path;
the orchestrator may not substitute `general` or `explore`. The current
`config.scheduling.maxConcurrentTasks: 1`, higher-authority constraints,
protected records, and host-neutral OpenCode live-control boundary remain fixed.

The corrected execution decision is an explicit non-blocking job model. The
OpenCode/as-is/orchestrator turn may perform validation and job submission, then
must persist a durable launch checkpoint and return without waiting for worker
completion. A supervisor/job process or supported server job owns the long-running
worker, its process group, logs/events, and persisted runtime state. Later
orchestrator wake/check-in operations poll the durable records and source-labelled
job/process/session health; neither health nor process exit replaces durable
validation or completion evidence. A foreground child process that the
submitting turn waits on is synchronous and invalid for this boundary.

This decision is dependent on fresh host capability evidence demonstrating safe
detachment or server-job submission, ownership, event/log capture, persistence,
polling, and cancellation. OpenCode server mode remains only a possible
transport/job-submission mechanism; it is not evidence of nested navigation or
asynchronous execution. If the host cannot establish those capabilities, the
next task records a blocker and stops without claiming support.

## Authorized Archive Decision

The current-turn user explicitly authorized dropping current blocked items only
when recovery is preserved. The root-scoped design documents cannot be separated
into a terminal documentation task without either creating a duplicate task
authority outside its component boundary or bypassing
`committing-completed-work`: this root record names their acceptance and scoped
handoff, while no separate documentation component record exists. The smallest
completion-safe route is therefore a reversible, tracked archive of the three
non-terminal records, followed by a root-only completed handoff. This is an
archive from the active task tree, not a completion transition for any archived
record.

The archive operation records these source and recovery facts before the move:

- `validation-fixtures/increment-5-cost-observability/as-is.md` and its
  `README.md` are historical, `blocked`, configured for `implementer`, and have
  an explicit no-retry boundary. Their current path was last carried by source
  commit `e9aaa10a65fd574d5814b7fceb705d0fe28f1309`; the README fixture began
  in `e9b740b`. The archived snapshots are owned by the root task for retention,
  while the original child ownership and worker identity remain `implementer`.
- `blocked-item-visibility/as-is.md` is an unlaunched `ready` planning record,
  configured for `implementer`, created at `2026-07-26T18:05:39Z`, with no
  attempt, validation, cost, or wall-clock observation. It has no source Git
  commit because it is untracked in the current checkout. Its original owner
  is the root orchestrator and its future worker remains `implementer`; it is
  not retried by this archive.
- `opencode-server-mode-observation/as-is.md` is likewise an unlaunched,
  untracked `ready` planning record created at `2026-07-26T18:05:39Z`, with no
  attempt or observations. Its bounded read-only evidence purpose, configured
  worker `implementer`, no-external-effects policy, and no-retry-on-role-failure
  boundary are preserved in the snapshot. The root orchestrator retains the
  archive; any future work requires a new explicit authorization.

The exact archive destinations are
`task-archives/validation-fixtures/increment-5-cost-observability/README.md`,
`task-archives/validation-fixtures/increment-5-cost-observability/record.md`,
`task-archives/blocked-item-visibility/record.md`, and
`task-archives/opencode-server-mode-observation/record.md`. Archive snapshots
are deliberately not named `as-is.md`, so they remain recoverable audit
artifacts without remaining active task descendants. Live navigation references
are updated to the archive destinations; historical record prose may retain old
paths as source-labelled lineage.

The scoped handoff artifact set is `as-is.md`,
`orchestration-design.md`, `execution-contract.md`, `opencode-adapter.md`,
`validation-fixtures/README.md`, and the four archive snapshots at the
destinations above, together with the tracked removal of the three former
record paths and the former historical README path. The untracked
`control-plane.md` file and all unrelated working-tree paths remain outside the
handoff.

To recover, use the archive commit as the source, restore each snapshot to its
recorded old path (`README.md` plus `as-is.md` for the historical fixture, and
`as-is.md` for either planning record), then restore this root to `blocked` and
reassess descendant closure. The historical fixture must return as `blocked` and
no-retry; the two planning records must return as `ready` and unscheduled. No
recovery means retrying, replacing, or marking the historical worker complete.

## Plan

The remediation order is explicit and sequential:

1. **Reconcile the root record and supported Bun boundary.** Compare the root
   record with the actual tree and existing records. Treat
   `control-plane/control-plane.ts` and
   `control-plane/control-plane.test.ts` plus the completed `control-plane/`
   record as the existing Bun child handoff. Correct the root's active/blocked
   wording and stale Python/integration claims without changing protected
   fixtures. This is the immediate root-owned task record and the only task
   eligible for a future launch from this checkpoint.
2. **Correct lifecycle and visibility.** Make blocked descendants conspicuous
   in record-only status, create a component record immediately before its
   future implementation, and classify read-only questions without creating
   implementation components. Reuse existing records or record a bounded
    cleanup decision; do not duplicate or destructively delete records. No new
    record is created now; the archived `blocked-item-visibility/` snapshot
    remains recoverable and was never launched.
3. **Establish and validate a non-blocking supervised job boundary.** The
   OpenCode/as-is/orchestrator turn must submit or spawn the configured
   `implementer` attempt to a supervisor-owned process group or supported server
   job, persist a durable launch checkpoint, and return without waiting for
   worker completion. The supervisor/job must capture logs/events and persist
   state for later orchestrator polling of durable records plus process/session
   health, cancellation, stale detection, and bounded recovery. A foreground
   child awaited by the submitting turn is not asynchronous. Host capability
   evidence is a prerequisite; if safe detachment or server-job submission is
   unavailable, record a blocker and do not claim support. Preserve the
   `as-is -> orchestrator -> implementer` mediation, component-only context,
   cumulative accounting, and no silent role substitution.
4. **Add cumulative cross-session accounting.** Future implementation must use
   append-only per-attempt observations, source-labelled measured/unknown
   states, reserves, no-double-counting aggregation, and admission/stop behavior
   when cost or wall-clock budgets are exceeded.
5. **Treat OpenCode server-mode observation as read-only evidence work.** Do not
    create an implementation component for it unless a later answer demonstrates
    a concrete implementation need. The archived
    `opencode-server-mode-observation/` snapshot remains unscheduled and
    recoverable; no host change or external observation is authorized now.
    Server mode may later supply a transport or job-submission mechanism, but it
    cannot be treated as proof of nested navigation or asynchronous execution
    without the capability evidence required by step 3.
6. **Resume the previously authorized initiatives only after these remediations
   are accepted and committed.** Preserve their original order: finish the
   control-plane foundation at its supported boundary, then the future
   `maxConcurrentTasks: 3` concurrency work, then the bounded wrong-role/general
   adapter decision, then the agent/skill maintenance initiative. Do not raise
   concurrency or launch any later initiative from this checkpoint.

## Progress

At the planning checkpoint `2026-07-26T19:25:00Z`, the root record was
reconciled against the actual tree and changed from the stale `active` wording
to `blocked`. No worker attempt, implementation, delegation, or new component
record was created in this task. The root record itself is the reused immediate
step-1 record.

At the design-correction checkpoint `2026-07-26T19:29:57Z`, the permanent
orchestration, execution-contract, and OpenCode adapter documents were aligned
on the non-blocking job model. The correction distinguishes a submitting
OpenCode/as-is/orchestrator turn from the supervisor/job lifetime, requires a
durable launch checkpoint before the turn returns, assigns process-group and
log/event ownership to the supervisor/job, and requires later durable-record and
health polling. The historical foreground `opencode run` mapping is not treated
as asynchronous support, and OpenCode server mode remains a capability-evidence
question rather than proof. No worker was launched, no implementation started,
and no ready component record was created or changed.

The actual supported Bun handoff is present at
`control-plane/control-plane.ts` and
`control-plane/control-plane.test.ts`, with the completed child record at
`control-plane/as-is.md` and scoped implementation commit `800e7de`. The root
Python paths `control_plane.py` and `test_control_plane.py` are absent from the
actual tree; they are not current supported consumers. The working tree also
contains the untracked `control-plane.md` Bun contract, but this planning
checkpoint does not claim that documentation or a root integration commit is
complete. The root record no longer treats the old Python/integration wording as
current fact.

The former `blocked-item-visibility/` and
`opencode-server-mode-observation/` records were unlaunched `ready` planning
records. They are preserved as non-task archive snapshots and were not
activated, retried, or completed. The former
`validation-fixtures/increment-5-cost-observability/as-is.md` record is
preserved byte-for-byte as a `blocked` archive snapshot with its explicit
no-retry boundary; it was not retried, edited, recovered, or used as a
substitution reason. No records for remediation steps 2 through 6 were created.
Step 5 remains explicitly classified as a read-only evidence question rather
than an implementation component.

At the archive checkpoint `2026-07-26T19:39:00Z`, the orchestrator applied the
authorized reversible tracked archive. The two unlaunched ready records and the
historical blocked fixture were removed from active task-record discovery and
preserved as four archive snapshots under `task-archives/`; the historical
fixture snapshots are byte-exact, and the two planning snapshots preserve the
inspected records without being retried or marked completed. The live
validation-fixtures navigation entry was updated to the archived historical
README. With no non-terminal active descendant remaining, this root record
advanced to `completed` for the durable documentation/task-context handoff only.
The untracked `control-plane.md` artifact remains untouched and outside this
scoped handoff.

The following prior implementation and review material remains historical
evidence, not current tree state. Its earlier claims about root Python files and
an open root integration boundary are superseded by the actual-tree observations
above; the completed child handoff and protected fixture status remain
authoritative in their own records and Git history.

### Preserved historical progress

Initiative 1 was authorized in the current turn and this record was replaced
from the prior completed maintenance task before delegation. At the fresh
implementation checkpoint `2026-07-26T17:47:54Z`, the record advanced from
`ready` to `active`. The prior fixture migration remains preserved in Git
history and in its retained records. The four historical validation fixtures
remain under `validation-fixtures/`; the Increment 5 cost-observability record
remains blocked/no-retry and is not a candidate for recovery or substitution.
The existing durable specifications and dependency-free task-record validator
were the local patterns considered. The bounded implementation now consists of
the root-owned `control_plane.py` executable boundary, its focused
`test_control_plane.py` checks, and the `control-plane.md` contract. The module
uses repository-backed records only, appends durable control-plane events before
state transitions, creates independently allocated queued child records only
through an explicit parent-orchestrator request, enforces the current one-leaf
limit, and performs descendant closure checks. No dependency, host adapter,
OpenCode live-control path, or retained runtime state was introduced. No child
record was created for this root task.

At the parent review checkpoint `2026-07-26T17:57:28Z`, the orchestrator
independently reread the changed artifacts and reran the focused checks listed
below. The implementation evidence is accepted for the bounded initiative; the
root task remains non-terminal solely because the preserved blocked historical
record prevents descendant closure under the protocol.

Owning component: the repository root, because the initiative spans the
host-neutral design, durable record protocol usage, control-plane interaction,
and adapter boundary with no narrower existing component that can own the
combined result. At the original implementation checkpoint no child record
was created for this root-owned task; the current process/tooling checkpoint
adds only the three explicitly named child records documented above.

## Validation

This planning-only checkpoint used `verification-discipline` to select
lightweight repository checks. Direct inspection confirmed the Bun child files
and child record exist, the root Python paths are absent, and the three archived
snapshots preserve the two unlaunched ready records plus the protected blocked/
no-retry fixture.
`git diff --check -- as-is.md` reported no whitespace diagnostics before this
commit. No worker was launched, so no implementation or host lifecycle check
was performed. Actual host-reported monetary cost is unavailable; the root
record retains `spent: 0.00` with source `unavailable` and does not claim zero
actual cost. Host-observed cumulative wall-clock use is unavailable; no
validation elapsed time is treated as a task-budget observation.

At the design-correction validation checkpoint `2026-07-26T19:34:36Z`,
`verification-discipline` selected and passed the smallest relevant checks:

- `git diff --check -- as-is.md orchestration-design.md execution-contract.md
  opencode-adapter.md` exited 0 with no whitespace diagnostics.
- `python3 schemas/task-record-validator/task_record_validator.py control-plane`
  reported `VALID` for the existing supported child record.
- A focused read-only assertion parsed the root front matter, confirmed the
  root is `completed` with configured worker `implementer` and
  `maxConcurrentTasks: 1`, checked the required non-blocking/capability wording
  in all four changed files, and confirmed the archived historical snapshot
  retains `Do not retry`; it reported `DESIGN_CORRECTION_ASSERTIONS: PASS`.
- A byte-preservation assertion compared the tracked historical fixture files
  with their archive snapshots and reported `EXACT` for both files. The two
  untracked ready records were archived from the directly inspected working
  tree; no source commit exists for a byte-level Git comparison. No worker,
  component record creation, or host lifecycle check was performed.
- `bun control-plane/control-plane.ts can-complete . .` reported
  `eligible: true`, with no non-terminal descendants and no unaccounted failed
  or cancelled descendants. The active supported `control-plane/` record still
  reported `VALID`; archive snapshots were intentionally checked with path,
  content, status, and discovery assertions rather than treated as active task
  records.

These checks validate durable wording, record shape, and protected-path
preservation only. They do not establish safe host detachment, server-job
submission, process-group ownership, asynchronous cancellation, or nested
OpenCode navigation; those remain the explicit host-capability dependency and
residual risk. Actual host-reported monetary cost and cumulative task
wall-clock use remain unavailable, so `spent` and `spent-seconds` retain their
source-labelled unavailable state rather than claiming zero actual use.

The whole-tree task-record validator remains a known non-gating observation for
this checkpoint because `.agents/agents/as-is.md` and related legacy agent
definition records are not task records, while the root's mixed tree has
pre-existing scope/aggregation conditions. It reported `INVALID` for those
legacy shapes, but `bun control-plane/control-plane.ts can-complete . .`
reported `eligible: true` with no non-terminal task descendants. The archived
snapshots are intentionally not named `as-is.md` and therefore are not active
descendants; this does not rewrite their statuses or manufacture validation
evidence.

### Preserved historical validation

The prior focused control-plane, Bun build, Python, and task-record validation
observations remain below as historical evidence. They are not re-presented as
fresh validation for this planning checkpoint.

## Historical Validation (preserved; superseded)

Focused deterministic checks selected with `verification-discipline` reported:

- `python3 -m unittest -v test_control_plane.py` exited 0; all 3 control-plane
  tests passed. They exercised record-only status/general questions, unavailable
  cost and wall-clock observations, durable question/answer/approval/cancel
  ordering, higher-authority rejection, queued parent delegation, the one-leaf
  limit, and failed/cancelled descendant accounting.
- `python3 -m py_compile control_plane.py test_control_plane.py` exited 0.
- `python3 schemas/task-record-validator/task_record_validator.py
  schemas/task-record-validator` reported `VALID`.
- `python3 -m unittest -v
  schemas/task-record-validator/test_task_record_validator.py` exited 0; all 6
  existing validator tests passed.
- `python3 control_plane.py status .` exited 0 and reported the root task as
  `blocked` at final handoff, delegated historical records, configured
  `maxConcurrentTasks` as `1`, source-labelled unavailable observations, and
  no next check-in because no task was active. The command reads task records
  only; it does not inspect private host state.
- A protected-record assertion exited 0, observed
  `validation-fixtures/increment-5-cost-observability` as `blocked`, observed
  `config.scheduling.maxConcurrentTasks: 1`, retained its `Do not retry`
  instruction, and found no diff under `validation-fixtures/`, `.agents/`,
  `.opencode/`, `skills/`, or `schemas`.
- `git diff --check -- as-is.md` exited 0 with no output; the equivalent
  `git diff --no-index --check /dev/null <new-root-artifact>` checks for each
  untracked root artifact produced no whitespace diagnostics (the expected
  no-index difference exit was handled separately).

Independent parent review then observed the same 3 focused control-plane tests,
the same 6 existing validator tests, successful Python compilation, `VALID` for
the focused task-record-validator component, successful `control_plane.py status
.` output, and `git diff --check`. `python3 control_plane.py can-complete . .`
reported `eligible: false` with exactly one non-terminal descendant,
`validation-fixtures/increment-5-cost-observability`, and no unaccounted failed
or cancelled descendants. A whole-root validator run remained `INVALID` for
the pre-existing mixed legacy records, preserved blocked fixture budget
violation, and root-scope aggregation; those observations do not authorize
changing protected historical content.

The host-observed monotonic elapsed time for the final validation command set
was `0.724272` seconds (individual command observations were
`0.084339`, `0.049584`, `0.052992`, `0.387378`, `0.061610`, `0.085316`, and
`0.002893`
seconds). This is validation-process elapsed time, not cumulative task wall
clock and not a cost estimate. Actual host-reported monetary cost is
unavailable; `constraints.cost.spent` remains `0.00` with the fallback metric
labelled above. Cumulative task wall-clock is also unavailable and remains
source-labelled unavailable. These observations establish the worker-side
implementation evidence and the independent parent review. The review did not
inspect private host state and did not authorize a host adapter or runtime-
control claim.

At the current process/tooling checkpoint `2026-07-26T18:05:39Z`, the user
provided explicit direction to preserve the historical blocked fixture while
preparing the next bounded work. The root has a depth-one delegation envelope
that accommodates its existing direct component records and the three newly
created child records; this is a task-specific delegation allocation and does
not raise `config.scheduling.maxConcurrentTasks`, relax the blocked/no-retry
boundary, or authorize initiatives 2 through 4. Three distinct child component
records were created: `control-plane/` for the implementation conversion,
`blocked-item-visibility/` for the later durable-status visibility improvement,
and `opencode-server-mode-observation/` for the local evidence decision. Only
the first child is eligible for launch in this checkpoint; the latter two are
`ready` and deliberately unscheduled so no sibling runs concurrently.

The configured `implementer` returned the first child at
`2026-07-26T18:12:08Z` with status `completed` and scoped commit `800e7de`
(`feat(control-plane): add Bun implementation`). The child produced the
dependency-free Bun/TypeScript implementation and focused tests at
`control-plane/control-plane.ts` and `control-plane/control-plane.test.ts` and
left its own record terminal. It explicitly left the named root Python files
and root documentation untouched, identifying their nearest-common-ancestor
integration as parent work. The return is attributed to the configured
`implementer`; no wrong-role or unavailable-worker event occurred.

Residual risk: the focused checks exercise deterministic temporary record trees,
not a host lifecycle, concurrent runtime, external effect, or OpenCode live
control. The intentionally small record parser follows the repository's local
validator pattern and does not claim arbitrary YAML compatibility. Parent review
must assess those boundaries without broadening this initiative.

Independent parent review at `2026-07-26T18:13:45Z` reran `bun test
control-plane/control-plane.test.ts` (3 pass, 0 fail, 28 expect calls),
`bun build control-plane/control-plane.ts --target bun --outfile /dev/null`
(one module bundled), the component task-record validator (`VALID`), and
whitespace checks for the child artifacts. The protected historical fixture had
no diff. The child-reported `0.05` seconds is validation-process elapsed time,
not cumulative task wall-clock; actual monetary cost and cumulative wall-clock
remain unavailable and are not represented as estimates.

### Root integration inspection and pre-edit decision

At `2026-07-26T18:16:46Z`, before changing any substantive artifact, direct
repository inspection produced these observations:

- `control_plane.py` has no consumer outside itself and the root
  `test_control_plane.py` import. The only other references are historical or
  current task-record prose and the `control-plane.md` contract; no package
  script, executable wrapper, or host configuration invokes it.
- `test_control_plane.py` has no consumer outside its own import and the
  historical validation commands in root task context. The completed child
  test is self-contained at `control-plane/control-plane.test.ts` and imports
  `./control-plane.ts`.
- `control-plane.md` is the sole user-facing control-plane contract found by
  the reference search. It names the Python module and its CLI but does not
  establish an independent runtime entry point.
- The completed child artifacts are dependency-free Bun/TypeScript files. The
  child test uses `bun:test` and Node standard-library APIs, and the child
  handoff already records the focused `bun test` and `bun build` commands. No
  root `package.json` or root Bun script exists; `.opencode/package.json` is
  only an unrelated host-plugin dependency manifest. The local task-record
  validator remains the established Python validator pattern and is not an
  implementation consumer.

Supported-boundary decision: make `control-plane/control-plane.ts` the sole
supported executable boundary, keep `control-plane/control-plane.test.ts` as
the focused supported test, and update `control-plane.md` to document direct
Bun invocation and the exported TypeScript API. The evidence confirms that
the root Python files are obsolete unsupported consumers, so they will be
removed rather than retained as a second authoritative implementation. No
wrapper, package manifest, dependency, host lifecycle integration, or live
OpenCode control path is justified by the inspected patterns.

The exact declared changed-artifact set is:

- `as-is.md` — this root task record and its integration evidence;
- `control-plane.md` — the supported Bun boundary contract and executable
  references;
- `control_plane.py` — remove the obsolete root implementation;
- `test_control_plane.py` — remove the obsolete root Python test.

The completed child artifacts are consumed in place and are not re-edited by
this root task. Material departure: the supported root executable and focused
test move from the unconsumed Python paths to the completed Bun paths; this is
the explicitly required child conversion, with no compatibility reason for
duplicate Python authority. Concrete acceptance need: the child result is not
integrated until the repository contract and executable/test references point
to Bun, the obsolete Python paths are absent from the supported path, and the
focused Bun behavior/build plus record and protected-boundary checks pass.

## Result

The ordered remediation plan and decision boundary are durably recorded. The
root record is now `completed` after the authorized archive removed the three
non-terminal records from the active task tree; the immediate step-1 record is
the reused repository-root `as-is.md`, and no worker or later component task
was launched. The root does not claim that a Python implementation exists or
that the Bun child has already been integrated at the repository root. The
historical fixture remains available as a byte-exact `blocked`/no-retry archive
snapshot, and the two speculative ready records remain available as
recoverable snapshots without being treated as completed work.

The durable design correction is recorded in the scoped files
`as-is.md`, `orchestration-design.md`, `execution-contract.md`, and
`opencode-adapter.md`. They now require submission to a supervisor-owned or
supported server job, a launch checkpoint returned before worker completion,
later polling of durable state and process/session health, explicit cancellation
and recovery ownership, and a capability blocker when safe detachment is not
evidenced. The foreground OpenCode subprocess mapping is explicitly
synchronous, and server mode is explicitly only a possible transport/job
mechanism.

This is a completed durable documentation/task-context handoff, not a worker
implementation or an asynchronous host-capability claim. The non-terminal
records were archived rather than silently completed, and the archive decision,
old paths, source commits, statuses, ownership, no-retry boundary, and recovery
instructions are recorded above. The root now has no active descendants, so it
is eligible for the completion-only `committing-completed-work` procedure. The
unproven host capability remains a blocker for any future asynchronous
implementation and is not resolved by this commit.

## Historical Result (preserved; superseded)

The host-neutral durable control-plane foundation is implemented in the three
root-owned artifacts named in Progress. Status queries and read-only general
questions are separate record-only operations; durable questions, answers or
directions, approval requirements, approvals, and cancellation checkpoints are
persisted before their transitions; parent-orchestrator delegation creates
independent queued child records and exposes descendant observation and
terminal-closure checks; and answers cannot relax the effective external-effect
or concurrency constraints. The OpenCode live-control boundary remains
explicitly documented and unimplemented, and `maxConcurrentTasks` remains `1`.
The current child records are a staged process/tooling checkpoint, not
authorization to begin the later four initiatives.

The first child handoff is accepted as a scoped component result, but the
nearest-common-ancestor integration boundary remains open: the root still has
the previously reported `control_plane.py`, `test_control_plane.py`, and
`control-plane.md`, while the Bun artifacts live under `control-plane/`. This
orchestrator has not implemented or researched that domain result; an explicit
integration decision or separately authorized implementer-owned integration
task is required before claiming the root-level conversion.

This handoff is not terminal. The protected historical
`validation-fixtures/increment-5-cost-observability` record remains `blocked`
and is a non-terminal descendant of the root filesystem task tree. The task
record protocol therefore prevents this root record from becoming `completed`,
even though the bounded implementation evidence is present. The fixture is
preserved and must not be retried, edited, or used as a substitution reason.

## Blockers And Escalations

The archived
`task-archives/validation-fixtures/increment-5-cost-observability/record.md`
retains the historical `blocked` status and explicit no-retry boundary. It is
not a reason to retry, recover, edit, substitute a worker, or broaden any
remediation, and it is no longer an active descendant after the reversible
archive.

The root completed without an active worker attempt. Any future recovery of an
archived ready record or the historical fixture requires explicit direction,
preserves its original configured `implementer`, and must stop without
substitution on unavailable, wrong-role, or unattributed return. No blocker
authorizes implementing steps 2 through 6 now.

The non-blocking host capability required by the corrected step 3 is not yet
established. The current foreground `opencode run`/parent-wrapper mapping is
synchronous, and the repository has no validated evidence that OpenCode server
mode can safely submit a detached job, own its process group, persist its
events, poll its health, and cancel it after the submitting turn returns. This
is a capability blocker for any asynchronous implementation, not permission to
wrap a foreground child or to claim server-mode support. The next task must
obtain or record this host evidence before creating an implementation record or
launching a worker.

## Historical Blockers And Escalations (preserved; superseded)

The implementation has no code or dependency blocker, and independent parent
review is complete. Completion is blocked by the preserved non-terminal
`validation-fixtures/increment-5-cost-observability` descendant. Its
`blocked`/no-retry state is historical evidence and is explicitly out of scope;
it must not be retried, rewritten, or used to substitute a worker. A
configured-worker unavailability, wrong-role task event, or unattributed return
remains a durable delegation blocker and stops this task without substitution.
The parent integration boundary is an additional non-terminal blocker for the
root-level conversion. It must not be resolved by retrying or editing the
historical fixture, by changing task authority, or by an orchestrator domain
implementation.

## Recovery

The recovery checkpoint is this root record at
`2026-07-26T19:39:00Z`, the committed `control-plane/` child handoff, the
actual Bun paths, and the four tracked archive snapshots. On resumption,
reread this record and inspect the archive and active task tree before deciding
whether to recover anything. Preserve cumulative observations, do not infer
worker activity from process absence, and do not retry or edit the archived
historical fixture. To recover an archived record, restore its exact snapshot
to the old path listed above, return the root to `blocked`, and reassess
descendant closure; the historical fixture must remain `blocked`/no-retry and
the two planning records `ready`/unscheduled. Before any future launch, keep
the configured worker as `implementer`, create no step-2-through-6 record, and
record the launch checkpoint first. A future worker launch is permitted only
after a host capability check establishes the non-blocking supervisor/job
boundary; the submitting turn must return after that checkpoint rather than
wait for worker completion.

## Historical Recovery (preserved; superseded)

The durable checkpoint is this `blocked` root record at
`2026-07-26T18:13:45Z`, the completed `control-plane/` child handoff and its
scoped commit, the three root-owned control-plane artifacts, and the
validation observations above. On interruption, reread this record and inspect
only the scoped artifacts and protected-record boundary. Preserve cumulative
budget observations, do not retry or edit the blocked historical fixture, and
do not infer completion from process exit, a missing session, or private runtime
state. If parent review is interrupted, rerun the listed deterministic checks
 before changing status; do not create runtime state. The current user direction
 authorizes the three named child records but does not authorize retrying or
 editing that historical descendant.

## Next Action

The next ordered task is to obtain fresh local host capability evidence for a
safe detached supervisor/job or supported server-job submission. The evidence
must cover return-before-completion, process-group ownership, log/event capture,
durable state persistence, later polling of durable state and process/session
health, and routed cancellation while preserving the `as-is -> orchestrator ->
implementer` chain. If the host cannot establish those facts, retain this
durable blocker and do not claim asynchronous support. If it can, create or
reuse the bounded step-3 implementation record immediately before a separately
authorized launch; do not launch a worker in this task. The protected fixture
and both planning records remain recoverable in `task-archives/`; do not
restore or launch them without separate authorization.

## Historical Next Action (preserved; superseded)

The smallest next action is to obtain an explicit, bounded integration decision
for the completed `control-plane/` handoff at the repository root. Preserve the
blocked historical descendant exactly; do not retry, edit, or substitute that
fixture. Keep `blocked-item-visibility/` and
`opencode-server-mode-observation/` ready but unscheduled until the integration
boundary is resolved and the orchestrator has reassessed the root. Do not begin
initiatives 2 through 4, raise `maxConcurrentTasks`, implement OpenCode live
control, or claim root completion or a root integration commit.

## Pending Work

This section is the sole authoritative finite inventory of project work after
this planning checkpoint. It is ordered and does not authorize work outside the
current decision boundary.

- Remediation step 1 (immediate, root record reused): reconcile the actual tree,
  supported Bun boundary, root status wording, and stale Python/integration
  claims. No worker is launched by this checkpoint.
- Remediation step 2: correct lifecycle and blocked-descendant visibility;
  create/reuse a component record immediately before future implementation and
  keep read-only questions record-free. No new record is created now.
- Remediation step 3: after host capability evidence is accepted, implement and
  validate the non-blocking supervisor-owned job or supported server-job
  boundary. The submitting OpenCode/as-is/orchestrator turn must persist a
  launch checkpoint and return before worker completion; the job owns the
  process group, logs/events, and persisted state for later durable and
  process/session-health polling, cancellation, timeout/stale handling, bounded
  recovery, cumulative accounting, and explicit escalation. A foreground child
  awaited by the submitting turn is not asynchronous; absent safe detachment or
  server-job evidence remains a blocker.
- Remediation step 4: implement cumulative cross-session cost and wall-clock
  accounting with append-only observations, source labels, reserves,
  no-double-counting aggregation, and budget admission/stop behavior.
- Remediation step 5: answer the OpenCode server-mode question as read-only
  evidence; create no implementation component unless a later answer proves a
  concrete need.
- Remediation step 6: after steps 1 through 5 are accepted and committed,
  resume the previously authorized initiatives below in their original order.

After the remediation gate:

- Initiative 1: finish and validate the durable control-plane foundation at the
  supported Bun boundary while preserving the record-only semantics and the
  unimplemented OpenCode live-control boundary.
- Initiative 2 (after initiative 1 is accepted and committed): separately
  implement and validate future `maxConcurrentTasks: 3` leaf-worker behavior
  with leases/locks, global slots, independent budgets, sibling isolation,
  parent observation, and descendant closure. Do not raise the current value
  here.
- Initiative 3 (after initiative 2 is accepted and committed): resolve the host
  adapter's wrong-role/general fallback only through a new bounded design and
  explicit authorization; do not retry the blocked record.
- Initiative 4 (after initiative 3 is accepted and committed): map and maintain
  the agent/skill system through one bounded initiative. Use the direct
  [agent-skills.md](agent-skills.md) catalog link, select only an explicitly
  authorized addition or change, verify ownership and host exposure, implement
  the bounded change, and validate fresh discovery and the affected behavior.

No other project work is pending unless it is added by a new authorized task.
The historical `validation-fixtures/opencode-mediation-dogfood` and
`validation-fixtures/increment-5-dogfood` records are completed evidence, the
`validation-fixtures/increment-6-recovery-fixture` record is completed recovery
evidence, and
`task-archives/validation-fixtures/increment-5-cost-observability/record.md` is
the preserved blocked historical evidence with an explicit no-retry boundary.
The two unscheduled planning snapshots are under `task-archives/` and are not
current initiatives. Their statuses and historical references remain
authoritative; restoring any of them requires a new authorized task.

## Change Log

- `2026-07-26 | completed` - Preserved the historical blocked/no-retry fixture
  and two unlaunched ready planning records as tracked, reversible non-task
  archive snapshots after recording old paths, source history, ownership, and
  recovery. Updated live navigation and completed only the scoped durable
  documentation/task-context handoff; no worker was launched or retried.
- `2026-07-26 | blocked` - Replaced the ambiguous foreground/subprocess hybrid
  wording with the explicit non-blocking supervisor/job model, recorded the
  host-capability dependency and ordered next task, and preserved the role,
  context, cancellation, recovery, accounting, no-substitution, ready-record,
  and blocked/no-retry boundaries without launching a worker.
- `2026-07-26 | blocked` - Reconciled the root record with the actual Bun child
  tree, recorded the ordered remediation plan and decision boundary, reused the
  root record for step 1, and preserved the ready/unscheduled siblings and the
  blocked/no-retry fixture without launching a worker.
- `2026-07-26 | ready` - Established initiative 1 from the authorized pending
  sequence, defined concrete acceptance conditions and root ownership, kept
  `maxConcurrentTasks: 1`, and preserved initiatives 2 through 4 as ordered
  durable next work.
- `2026-07-26 | completed` - The prior maintenance-time fixture migration was
  accepted and committed as `e9aaa10`; its completed records, historical
  references, and blocked/no-retry exception remain preserved.
- Earlier closed work remains referenced by its scoped commits in Git history,
  including mediation, recovery, validator, and fixture handoffs.
