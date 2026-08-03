# Adaptive Session Budgeting

## Status

Reviewed contract for the `adaptive-session-budgeting` backlog item in
[`backlog.md`](backlog.md). This document records the design boundary and
constraints; it does not authorize runtime implementation. The capability-gap
decision is explicit: the launcher currently has durable sessions and bounded
execution, but does not provide the control channel, checkpoint protocol,
session analysis, retention policy, or authorized resume/fork lifecycle needed
to implement this contract. Those capabilities remain a future, separately
authorized change.

## Purpose

Enable long-running Pi subagents to use budget allocations as revisable,
soft execution leases while preserving a hard host safety ceiling, durable
recovery, cumulative accounting, and human or parent authority over extensions.

The goal is better budget control, not unlimited execution. A parent should be
able to inspect bounded progress, decide whether additional work is justified,
and continue the same work without restarting its conversational context.

## Core model

Use four layers:

1. **Authorization** — the parent authorizes a task revision, attempt, hard
   maximum envelope, and initial allocation.
2. **Execution lease** — the child receives a temporary wall-clock and,
   where available, cost allocation for the current run segment.
3. **Checkpoint** — the child records durable progress, validation, blockers,
   changed-artifact scope, and next action, then becomes ready to resume or
   explicitly blocked.
4. **Reallocation** — the parent evaluates evidence and grants another lease
   within the original hard envelope, preserving cumulative accounting.

A soft allocation is a decision threshold, not an authority transition. A hard
ceiling remains mandatory even when the current allocation may be extended.

Example:

```text
initial wall-clock allocation: 120 seconds
soft review threshold:          90 seconds
hard safety ceiling:           300 seconds
initial cost allocation:       USD 0.20
hard cost ceiling:              USD 0.80
```

Host-reported monetary cost may remain unavailable. In that case, record
`spent: 0.00` with the source and use host-observed elapsed time plus any
child-reported estimate as clearly labelled supplementary evidence.

## Pause and continuation

The primary pause mechanism is **checkpoint and exit**, not OS process
suspension:

```text
running child
  -> checkpoint request
  -> durable task/session checkpoint
  -> clean exit
  -> bounded analysis
  -> revised authorization
  -> resume or fork
```

OS `SIGSTOP`/`SIGCONT` is not the primary mechanism because it can interrupt a
tool operation, retain locks, lose provider connectivity, and provide no
portable durable checkpoint.

A future launcher surface may expose pause, resume, and fork operations, but
those operations must be explicit and tied to a durable job/session record.

| Operation | Meaning | Budget semantics |
| --- | --- | --- |
| `pause` | Ask the child to checkpoint and exit at a safe boundary. | Consumes observed time; does not reset the attempt. |
| `resume` | Continue the same saved session and work line. | Uses a new lease; cumulative allocation and elapsed time remain. |
| `fork` | Create a new branch from a selected saved session entry. | Usually a new recovery branch/attempt decision; preserve the source session and account for both branches. |
| hard stop | Supervisor safety termination when the envelope is exhausted. | Records budget-stopped recovery evidence; never implies completion. |

A budget-stopped child may be resumed only if its session and worktree are
retained or durably recoverable. Session retention is therefore part of the
future implementation contract.

## Evidence and authority

Session analysis can inform a budget decision but cannot authorize one. The
analysis should prefer, in order:

1. the durable task record (`Progress`, `Validation`, `Blockers And Escalations`,
   `Recovery`, and `Next Action`);
2. changed-file scope and worktree state;
3. process/job state and exit classification;
4. validation results;
5. bounded session metadata and recent activity, only when separately
   authorized.

The child cannot extend its own budget by editing `tasks.md` or requesting more
time. A parent or task-management authority must record the revised
allocation before resumption. Telemetry is supplementary and cannot authorize
extension, status, recovery, validation, or completion.

Full session inspection is exceptional. Normal traces contain opaque,
scoped session references and bounded metadata, not prompts, responses, tool
arguments, tool results, secrets, or copied conversation excerpts. Session
inspection must enforce its own store, revision/range, access, retention, and
redaction controls.

A bounded analysis result may look like this without embedding raw session
content:

```json
{
  "decision": "extend",
  "reasonClass": "validation-nearly-complete",
  "additionalWallClockSeconds": 120,
  "additionalCostUsd": 0.20,
  "preserveSession": true,
  "preserveWorktree": true,
  "evidence": [
    "task-status=active",
    "changed-files-within-scope",
    "focused-tests-passed",
    "next-action-is-specific"
  ]
}
```

## Cumulative accounting

Resumption does not reset the task revision, attempt, or prior observations.
Each lease and decision should preserve:

```text
authorized hard ceiling
initial allocation
additional allocations
cumulative allocation
observed elapsed time
remaining hard ceiling
host-reported spend or unavailable source
child-reported cost estimate, if any
```

A continuation remains the same attempt unless task management explicitly
creates a new recovery revision. A fork must preserve the source attempt and
state why the new branch is authorized.

## Checkpoint triggers

A checkpoint review may be requested:

- before the soft allocation expires;
- after a validation failure or successful durable checkpoint;
- when progress is absent for a bounded interval;
- when the child reports blocked or awaiting approval;
- before the hard safety ceiling.

The child should checkpoint cooperatively, but the supervisor and registry must
retain enough external job evidence to recover if the child crashes or fails to
cooperate.

## Durable record schema contract

The following records are the minimum durable boundary for a future
implementation. They are documentation contracts, not a request to create
runtime files or a session store. Unknown fields are rejected unless a later
schema revision explicitly adds them; references are opaque and never contain
session content.

### Authorization and lease record

One authorization record owns a task revision and hard envelope; each lease is
one bounded run segment within that record. The stable identity is
`component-path/task-revision/attempt/lease-id`; a runtime JobId may appear only
as a source-labelled diagnostic.

| Field | Required shape and constraint |
| --- | --- |
| `schemaVersion` | Positive integer; starts at `1`. |
| `recordId` | Opaque unique authorization-record identifier. |
| `componentPath` | Canonical repository-relative component path. |
| `taskRevision` / `attempt` | Durable revision and one-based invocation ordinal; never reset by continuation. |
| `authority` | Opaque parent/task-management identity plus authorization timestamp; child cannot self-authorize. |
| `state` | `authorized`, `running`, `checkpointing`, `paused`, `exhausted`, `revoked`, or `closed`. |
| `hardWallClockSeconds` / `hardCostUsd` | Immutable ceilings; cost ceiling may be `unavailable` with source. |
| `initialWallClockSeconds` / `initialCostUsd` | Initial lease allocation, each no greater than its ceiling. |
| `cumulativeWallClockSeconds` / `cumulativeCostUsd` | Sum of recorded allocations; cost remains source-labelled and never treats estimates as actual. |
| `observedElapsedSeconds` / `observedCostUsd` | Cumulative observations; unavailable values retain source and do not imply enforcement. |
| `remainingWallClockSeconds` / `remainingCostUsd` | Derived non-negative remainder after allocations and observations, never exceeding the hard ceiling. |
| `leaseId` / `issuedAt` / `expiresAt` | Opaque unique lease identity and bounded validity interval. |
| `leaseWallClockSeconds` / `leaseCostUsd` | This segment's allocation; must fit remaining hard envelope and retained reserve. |
| `parentLeaseId` | Optional opaque predecessor for continuation; required for a reallocation chain, absent for the first lease. |
| `sessionRef` / `worktreeRef` | Optional opaque, scoped retention references; no path outside the approved store, URL, prompt, response, or tool data. |
| `decisionEvidence` | Bounded reason class and references to durable task/checkpoint evidence, never raw session content. |

A lease is admitted only when its interval is bounded, its identity is unique,
its authorization is current, and both cumulative allocation plus the new lease
(and any required reserve) fit the immutable hard ceilings. Admission is
atomic: reject rather than clamp, overdraw, or implicitly extend. A missing
monetary observation can never authorize cost admission; wall-clock admission
uses the host observation, with unavailable enforcement recorded explicitly.
Only the authority may issue, renew, revoke, or close a lease.

Lease transitions are `authorized -> running -> checkpointing -> paused`, with
`running -> exhausted` on a hard stop, `running -> revoked` on authority
revocation, `paused -> running` only after a newly admitted lease, and
`paused -> closed`, `exhausted -> closed`, or `revoked -> closed` only after the
authority records final accounting and retention disposition. `exhausted`,
`revoked`, and `closed` are terminal for that lease. A continuation
keeps the task revision and attempt; a new worker invocation increments attempt.
A fork must create a separately authorized branch retaining the source record.

### Checkpoint record

A checkpoint is append-only by `checkpointId`; later records supersede it by an
explicit `supersedes` reference rather than rewriting history. Required bounded
fields are:

| Field | Required shape and constraint |
| --- | --- |
| `schemaVersion` / `checkpointId` | Version and opaque unique identifier. |
| `recordId` / `leaseId` | Authorization record and lease identity being checkpointed. |
| `taskRevision` / `attempt` / `createdAt` | Stable accounting key and ordering timestamp. |
| `state` | `requested`, `writing`, `ready`, `blocked`, `failed`, `budget-stopped`, or `superseded`. |
| `progress` | Bounded summary of completed work and current phase; no transcript or raw tool data. |
| `validation` | Bounded check names/results and timestamps, or explicit `not-run` reason. |
| `blockers` | Bounded blocker codes and approval-needed scope, if any. |
| `changedArtifacts` | Repository-relative paths or bounded scope patterns, constrained to authorized component scope. |
| `nextAction` | One bounded, specific action or explicit terminal/no-action value. |
| `accounting` | Snapshot of cumulative allocations, observations, remaining ceilings, and source labels from the lease record. |
| `sessionRef` / `worktreeRef` | Opaque retention references with store, revision/range, access class, expiry, and integrity marker; references only. |
| `failure` | Required for `failed`: failure class, safe recovery boundary, cleanup status, and whether retry is permitted. |
| `supersedes` | Optional prior checkpoint ID; no deletion or in-place mutation. |

The normal lifecycle is `requested -> writing -> ready`; `ready -> blocked` or
`ready -> superseded` is allowed. A validation or persistence failure enters
`failed`; a hard ceiling enters `budget-stopped`. A failed checkpoint must
preserve the last known valid checkpoint, observed accounting, changed-file
scope, and cleanup boundary, and must not claim completion. Recovery either
resumes from that valid checkpoint under a newly admitted lease or records an
explicitly authorized fork; it never guesses from process exit or missing
private session state.

Retention references must be scoped to an approved session/worktree store,
carry an expiry and access policy, and support integrity/revision checking.
Cleanup may remove only expired references after recording the checkpoint's
recovery consequence. A missing, expired, inaccessible, or integrity-failing
reference makes the record non-resumable and produces a recovery candidate;
it does not authorize recreation, resume, fork, extension, or completion.

### Checkpoint operation and control-channel contract

This section defines the durable operation boundary for a future implementation.
It is a schema and protocol contract only: it does not authorize a launcher
command, IPC transport, signal handling, supervisor behavior, session-store
read, automatic continuation, or extension.

#### Operation envelope

A checkpoint request is an authority-issued operation with an opaque
`operationId`. Its request envelope is append-only and contains exactly these
fields:

| Field | Required shape and constraint |
| --- | --- |
| `schemaVersion` | Positive integer; starts at `1`. |
| `operationId` | Opaque unique idempotency key; never reused for another operation. |
| `operation` | `checkpoint` only in this contract. `resume`, `fork`, `extend`, and `cleanup` are separate future operations and are rejected here. |
| `recordId` / `leaseId` | Authorization record and current lease being addressed. |
| `taskRevision` / `attempt` | Must exactly match the authorization and lease records; continuation does not reset either value. |
| `authority` | Opaque authorized parent/task-management identity, authorization timestamp, and authorization revision; the child cannot issue or broaden it. |
| `requestedAt` / `deadlineAt` | Ordered timestamps; the deadline is bounded by the current lease expiry and hard ceiling. |
| `reasonClass` | Closed, bounded reason code such as `soft-threshold`, `validation-failure`, `blocked`, or `pre-hard-stop`; no raw session content. |
| `requiredEvidence` | Bounded names or opaque references to task/checkpoint evidence; never prompts, responses, or tool data. |
| `responseDeadlineAt` | Optional bounded acknowledgement deadline, no later than `deadlineAt`. |

The control channel carries only this structured envelope and structured
acknowledgement/outcome records. Transport, endpoint, authentication
mechanism, and delivery implementation are intentionally unspecified. A
receiver must reject unknown fields, mismatched identity keys, stale
authorization revisions, wrong task/attempt/lease identities, expired
requests, and requests whose deadline exceeds the lease or hard ceiling.
Authentication and authorization are distinct: a valid identity does not grant
permission to request a checkpoint.

#### Request, acknowledgement, and lifecycle

The operation state is one of `requested`, `acknowledged`, `checkpointing`,
`ready`, `blocked`, `non-cooperative`, `timed-out`, `failed`, `budget-stopped`,
`rejected`, or `superseded`. State transitions are append-only and must carry
`operationId`, actor, timestamp, and a bounded reason or evidence reference:

```text
requested -> acknowledged -> checkpointing -> ready
                                      \-> blocked
requested -> rejected | timed-out | non-cooperative | failed | budget-stopped
acknowledged -> timed-out | non-cooperative | failed | budget-stopped
checkpointing -> failed | budget-stopped
ready | blocked -> superseded
```

`acknowledged` means only that the authorized request was received and
admitted; it is not evidence that a checkpoint was written. `checkpointing`
means the child has entered a safe boundary and is attempting durable writes.
The child should acknowledge promptly, but acknowledgement must not interrupt
an in-flight tool operation. The safe boundary is the earliest point at which
that operation has returned or otherwise has a documented recovery boundary;
no operation may claim `ready` or `blocked` before the checkpoint record,
accounting snapshot, and required retention references are durable.

If the child cannot cooperate before `responseDeadlineAt`, the supervisor or
registry records `non-cooperative` with the last external observation, lease
accounting, changed-artifact scope, and safe recovery boundary. It must not
infer progress, completion, resumability, or a missing checkpoint from silence.
A cooperative refusal is likewise `non-cooperative` with a bounded reason.
`timed-out` means the operation deadline elapsed before a valid checkpoint
outcome; `budget-stopped` means the hard lease/envelope stopped execution.
Neither outcome implies completion. `rejected` means admission failed before
checkpointing and must include a bounded rejection class.

#### Durable ordering and outcome record

The operation outcome is a separate append-only record with required fields
`schemaVersion`, `operationId`, `recordId`, `leaseId`, `taskRevision`, `attempt`,
`state`, `actor`, `createdAt`, `accounting`, `checkpointRef`, `sessionRef`,
`worktreeRef`, and `failure` when applicable. References are opaque and must
satisfy the retention contract below; absent references are represented by an
explicit bounded reason, never by an inferred path.

The required write order is:

1. validate identity, authorization, lease state, idempotency key, and bounded
   deadline;
2. append the admission/acknowledgement event;
3. enter the safe boundary and append `checkpointing`;
4. persist the checkpoint, cumulative accounting, changed-artifact scope,
   validation, blockers, next action, and required retention references;
5. verify persistence and reference integrity;
6. append exactly one terminal outcome and only then permit a clean child exit.

A failed persistence or verification step records `failed` and preserves the
last known valid checkpoint plus observed accounting and cleanup boundary. It
never overwrites a prior checkpoint or claims completion. If the child exits
before step 6, the external record is `non-cooperative`, `timed-out`, or
`budget-stopped` according to observed evidence; process exit alone is not a
successful outcome.

#### Idempotency, expiry, and recovery

For a repeated `operationId`, the authority returns the original admitted or
terminal outcome without replaying the checkpoint request. A payload mismatch
for an existing id is an `idempotency-conflict` rejection, not a new request.
Idempotency records must outlive the operation's response timeout for the
retention period required by the authority, and may not be silently reused.

Admission fails closed when the lease is expired, revoked, exhausted, or does
not leave the required reserve. A request admitted before expiry may finish
only within the bounded safe-boundary deadline; it cannot renew or extend the
lease. At hard stop, record `budget-stopped`, cumulative accounting, the last
valid checkpoint, changed-artifact scope, retention disposition, and whether
the recovery candidate is resumable. If any required reference is missing,
expired, inaccessible, or integrity-failing, record `non-resumable` and the
safe recovery boundary. No timeout, non-cooperation, hard stop, or reference
failure authorizes automatic resume, fork, extension, cleanup, or completion.
Only a separately authorized future operation may make that decision while
preserving the source record and cumulative accounting.

#### Control-channel authority and access boundary

The authority may issue a checkpoint request and record its outcome; the child
may acknowledge, checkpoint, refuse, or report failure but cannot change the
lease, hard ceiling, task status, retention policy, or operation identity. A
parent may observe bounded operation metadata and durable records, but control
channel access does not grant raw session access. `dynamic-expert-validation-access`
remains open as a separate, read-only validation dependency: it may inspect
these schemas and bounded evidence only, cannot send requests, acknowledge,
write or alter checkpoints, inspect raw sessions, issue leases, or change
authority. This contract does not define its admission or implementation.

## Resume and fork admission contract

This contract makes **resume** the normative default recovery mechanism. A
resume preserves the task revision, attempt, source checkpoint, and work line;
it is not a new invocation and must not reset identity or accounting. A
**fork** is a divergent recovery branch, never an implicit fallback: it requires
separate explicit authorization and must preserve the source as immutable audit
evidence.

### Admission inputs and ceilings

A resume request must identify the exact `taskRevision` and `attempt`, source
`checkpointRef`, authorization `recordId`, predecessor `leaseId`, and opaque
`sessionRef` and `worktreeRef`. Each reference must include or resolve to its
store scope, revision/range, access policy, expiry, and integrity marker. The
request must also carry the bounded validation result for the source checkpoint,
changed-artifact scope, recovery boundary, and a newly issued unique lease.

Admission validates identity, authority, source references, checkpoint state,
lease state, scope, integrity, and that the new lease fits the immutable hard
wall-clock and cost ceilings (including required reserve). It rejects rather
than clamps, overdraws, or extends a ceiling. Cumulative allocations,
observations, and remaining envelope are carried forward across every resume;
missing monetary observations remain explicitly unavailable and never become
permission to admit cost.

Admission is idempotent. A unique operation or lease identity may be admitted
only once; a repeated identity returns the original outcome without replaying
work, while a payload mismatch is an idempotency conflict. Source checkpoints,
lease records, and fork lineage are append-only, so duplicate admission cannot
silently create a second continuation or mutate the source.

### Recovery outcomes and fork authorization

A stale, revoked, expired, exhausted, superseded, integrity-failing, or
otherwise non-resumable source is rejected for resume. The authority records
the failure class, last valid checkpoint, cumulative accounting, and safe
recovery boundary. A missing, invalid, inaccessible, or mismatched reference
has the same fail-closed result: it does **not** authorize automatic
fork/recreation, automatic resume, lease extension, or completion.

A fork may be admitted only through a separate authorization that names the
reason, authority, source `recordId`/`taskRevision`/`attempt`, source
checkpoint and session/worktree references, and the new branch identity and
attempt/revision policy. The resulting branch must retain explicit source
lineage, independent lease/accounting records, changed-artifact scope, and
validation evidence; the source remains preserved and is not rewritten. Fork
authorization does not imply extension or completion, and a missing or invalid
source reference still requires an explicit recovery decision rather than
automatic recreation.

This is a documentation/schema contract only. It does not implement launcher
flags, session reopening, session-store reads, runtime branching, automatic
continuation, or extension. `dynamic-expert-validation-access` remains open
as a separate bounded, read-only validation dependency and cannot authorize
resume, fork, lease, extension, or completion.

### Retention, cleanup, and worktree contract

This is a documentation/schema boundary for future implementation. It does not
authorize a store, cleanup worker, launcher operation, or process behavior.

**Approved stores and references.** A retention reference identifies an entry
in an explicitly approved, project-controlled session store or worktree
retention store. The approved scope is the store named by future
authorization/configuration; an arbitrary host path, provider URL, network
location, temporary directory, or caller-selected store is not approved here.
`store` is a closed policy label, not a path. `sessionRef` and `worktreeRef`
are opaque identifiers (including revision/range and access class where
required), and must not encode prompts, responses, tool arguments/results,
secrets, absolute paths, URLs, credentials, or serialized session content. A
reference is useful only with store, task revision/attempt, access policy,
expiry, and integrity/revision marker; none grants authority.

**Retention lifecycle.** Retention begins only when an authorized checkpoint or
lease record publishes a valid reference and expiry. The reference is retained
until expiry, then `expired-pending-disposition`; it may be `released` only by
an authorized disposition. Expiry is a reference state, not proof the
underlying artifact was deleted. A future implementation must record a
disposition (reference, checkpoint/lease, observed expiry, actor, time, reason,
artifact outcome, and recovery state) before deleting, releasing, or losing
access to an artifact. An unexpired reference is never cleanup-eligible.
Retention may be extended only by the authority controlling lease/checkpoint
policy, with a new bounded expiry and durable reason; the child cannot extend
it.

**Cleanup authorization and evidence.** Cleanup is an explicit,
authority-controlled operation, separate from lease issuance and checkpoint
writing. It must re-check expiry, store scope, revision, access policy, and
integrity atomically; ambiguity, races, access failure, or integrity mismatch
is a no-delete outcome. It may act only on the named expired reference, never
on a directory, worktree, session family, or unreferenced neighbor by
inference. Before destructive disposition, the authority must audit tracked,
untracked, and ignored worktree contents, ownership, consumers, recovery/audit
value, and recreation cost, and preserve the last valid checkpoint, cumulative
accounting, changed-artifact scope, and cleanup consequence. If those facts
cannot be recorded durably, cleanup is not authorized. Artifact deletion and
reference removal are separate outcomes and must each be recorded; this
contract implements neither.

**Worktree ownership boundary.** A retained worktree remains owned by the
worker/job isolation owner until a committed handoff, explicit authority
transfer, or authorized terminal disposition is recorded. A parent may inspect
bounded state and decide retention, but may not mutate or remove the child's
worktree implicitly. A child may write only within its assigned component and
may not claim ownership of the retention store, lease, or cleanup decision.
Shared or caller worktrees are not resumable by a reference alone: ownership,
scope, dirty state, and commit/recovery boundary must be recorded. Cleanup
must not remove a worktree with uncommitted changes unless its recovery
consequence and exact disposition are explicitly authorized.

**Resumability outcomes.** Resolution is fail-closed. A `missing`, `expired`,
`inaccessible`, or `integrity-failing` session or worktree reference marks the
checkpoint/lease recovery candidate `non-resumable` and records a bounded
failure class and safe recovery boundary. It does not permit guessing,
recreating content, automatic resume, automatic fork, extension, or completion.
A valid reference must match task revision/attempt and integrity marker; a
mismatch is integrity failure, not a new branch. Only a separately authorized
future operation may choose a new checkpoint, resume, or fork, preserving the
source record and cumulative accounting.

**Interaction with states.** `authorized`/`running` leases require references
only when their retention policy says they are needed; `checkpointing` cannot
become `paused` until required references and checkpoint evidence are valid.
`paused` requires an unexpired, accessible, integrity-valid recovery boundary or
is a recovery candidate. `exhausted`, `revoked`, and `closed` retain accounting
and disposition evidence; closure alone does not authorize cleanup.
`requested`/`writing` checkpoints must not publish resumability. `ready` and
`blocked` are resumable only while required references validate. `failed` and
`budget-stopped` preserve the last valid boundary and are non-complete;
reference failure makes them non-resumable until an authority records a
separate recovery plan. `superseded` checkpoints remain audit evidence and are
not silently cleaned up.

`dynamic-expert-validation-access` remains an open separate dependency. It may
validate these records and their evidence only through bounded read-only access;
it cannot issue leases, alter checkpoints, inspect raw sessions, or change
authority.

## Capability-gap decision

The gap is architectural rather than a documentation defect. Existing durable
session output and detached wall-clock enforcement are useful evidence, but they
cannot safely provide cooperative checkpointing, continuation identity, bounded
analysis, retention, or authorization. In particular, a session reference or
telemetry event must never become authority for extending a lease, resuming a
record, selecting a fork, or declaring completion.

Therefore this revision authorizes only this reviewed contract documentation.
It does not authorize launcher commands, a supervisor/control channel, session
store reads, session-content analysis, retention or cleanup changes, automatic
extension, or cost enforcement. A future implementation task must first define
and validate the durable operation and record schemas, admission checks against
the hard envelope, checkpoint failure recovery, and safe session/worktree
retention before changing runtime behavior.

## Non-goals and open implementation questions

This design does not yet implement:

- launcher pause/resume/fork commands;
- a control channel;
- a session analyzer;
- session retention policy or cleanup changes;
- process suspension;
- automatic budget extension;
- cost enforcement where the host cannot observe cost;
- a change to task, validation, recovery, or completion authority.

Implementation must later decide how to retain session/worktree artifacts,
how to send a checkpoint request, how to identify a resumable session safely,
and how to authorize and record revised leases without resetting cumulative
budget evidence.
