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
  updated: 2026-07-26T19:25:00Z
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
    preserved historical observations without editing protected fixtures.
  - Record the ordered six-step remediation plan and its decision boundary;
    this checkpoint must not implement code, launch a worker, or create ready
    records for steps 2 through 6.
  - Reuse this repository-root record as the only immediate step-1 task record;
    retain `implementer` as the configured future worker and keep the root
    blocked because the protected descendant is non-terminal, not active because
    no worker attempt is running.
  - Keep `blocked-item-visibility/` and
    `opencode-server-mode-observation/` intact and unscheduled, classify the
    OpenCode server-mode item as read-only evidence work, and preserve
    `validation-fixtures/increment-5-cost-observability` exactly as blocked and
    no-retry.
  - Validate the planning checkpoint with focused path/record assertions,
    protected-record comparison, and `git diff --check`; record unavailable
    host cost and wall-clock observations rather than estimates.
  - Commit only the scoped durable planning/root-record checkpoint. Do not
    amend, push, create a pull request, change branches, alter remotes, stage
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
`implementer`, but no worker is launched in this planning task. The root status
is `blocked`: no root attempt is active, and the protected
`validation-fixtures/increment-5-cost-observability` descendant remains a
non-terminal blocked/no-retry record. This distinguishes the root's current
blocked task-tree state from an active worker attempt and from completion.

Only step 1 is recorded as the next implementation boundary. Steps 2 through 6
remain ordered plan items without new ready records or launches. Future work
must use the canonical `as-is -> orchestrator -> implementer` mediation path;
the orchestrator may not substitute `general` or `explore`. The current
`config.scheduling.maxConcurrentTasks: 1`, higher-authority constraints,
protected records, and host-neutral OpenCode live-control boundary remain fixed.

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
   record is created now; the existing `blocked-item-visibility/` record stays
   ready and unscheduled.
3. **Supervise worker attempts through an orchestrator-owned asynchronous
   subprocess boundary.** Future implementation must provide durable launch and
   checkpoint state, process and log observation, timeout and stale handling,
   bounded recovery, and explicit blocked escalation. Semantic subagent roles
   remain unchanged; the subprocess is only the supervised execution envelope.
4. **Add cumulative cross-session accounting.** Future implementation must use
   append-only per-attempt observations, source-labelled measured/unknown
   states, reserves, no-double-counting aggregation, and admission/stop behavior
   when cost or wall-clock budgets are exceeded.
5. **Treat OpenCode server-mode observation as read-only evidence work.** Do not
   create an implementation component for it unless a later answer demonstrates
   a concrete implementation need. The existing
   `opencode-server-mode-observation/` record remains intact and unscheduled;
   no host change or external observation is authorized now.
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

The existing `blocked-item-visibility/` and
`opencode-server-mode-observation/` records are still `ready`, untouched, and
unscheduled. The protected
`validation-fixtures/increment-5-cost-observability/as-is.md` record is still
`blocked` with its explicit no-retry boundary; it was not read as a retry
candidate, edited, recovered, or used as a substitution reason. No records for
remediation steps 2 through 6 were created. Step 5 is explicitly classified as
a read-only evidence question rather than an implementation component.

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
and child record exist, the root Python paths are absent, the two existing ready
records remain present, and the protected fixture remains blocked/no-retry.
`git diff --check -- as-is.md` reported no whitespace diagnostics before this
commit. No worker was launched, so no implementation or host lifecycle check
was performed. Actual host-reported monetary cost is unavailable; the root
record retains `spent: 0.00` with source `unavailable` and does not claim zero
actual cost. Host-observed cumulative wall-clock use is unavailable; no
validation elapsed time is treated as a task-budget observation.

The whole-tree task-record validator remains a known non-gating observation for
this checkpoint because existing mixed legacy records and the protected
historical fixture have pre-existing scope/budget conditions. This checkpoint
does not alter those records to manufacture `VALID`; the durable blocker and
residual validation risk are recorded below.

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
root record is blocked and non-terminal, the immediate step-1 record is the
reused repository-root `as-is.md`, and no worker or later component task was
launched. The root does not claim that a Python implementation exists or that
the Bun child has already been integrated at the repository root. The protected
fixture remains blocked/no-retry, and the two existing ready records remain
unscheduled.

This is a durable planning checkpoint, not a completed implementation handoff.
Because a descendant is non-terminal, the root is not eligible for
`completed` or for the completion-only `committing-completed-work` procedure.
The user-authorized checkpoint commit is scoped to this root record only.

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

The protected `validation-fixtures/increment-5-cost-observability` descendant
is `blocked` and explicitly no-retry; this non-terminal descendant prevents
root completion. It is preserved exactly and is not a reason to retry, recover,
edit, substitute a worker, or broaden any remediation.

The root is also not active because no worker attempt is running. Future step-1
implementation remains a separate bounded recovery/launch decision after this
checkpoint. Any configured-worker unavailability, wrong-role event, or
unattributed return must be recorded as a durable blocker and must stop without
substitution. No blocker authorizes implementing steps 2 through 6 now.

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
`2026-07-26T19:25:00Z`, the committed `control-plane/` child handoff, the
actual Bun paths, and the untouched existing ready/blocked records. On
resumption, reread this record and inspect the actual tree before deciding
whether to recover step 1. Preserve cumulative observations, do not infer
worker activity from process absence, and do not retry or edit the protected
fixture. Before any future launch, keep the root record's configured worker as
`implementer`, create no step-2-through-6 record, and record the launch
checkpoint first.

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

Commit this durable planning checkpoint with only the root `as-is.md` change.
Do not launch the root step-1 worker in this task. After the checkpoint is
committed and a later implementation turn is authorized, recover/launch only
the root step-1 task through the configured `implementer`; then independently
reconcile its handoff before any later remediation is recorded or launched.

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
- Remediation step 3: implement the orchestrator-owned asynchronous subprocess
  supervision boundary with durable launch/checkpoint state, observation,
  timeout/stale handling, bounded recovery, and explicit escalation.
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
evidence, and `validation-fixtures/increment-5-cost-observability` is blocked
historical evidence with an explicit no-retry boundary. Their statuses and
historical references remain authoritative.

## Change Log

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
