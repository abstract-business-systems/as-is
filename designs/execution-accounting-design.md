# Execution Accounting And Runtime Identity Design

## Purpose

This permanent specification defines how durable task identity, runtime job
handles, historical summaries, and resource observations relate. It is a
design boundary for a later implementation; it is not an implementation claim
and does not make the current supervisor or OpenCode adapter complete.

The design preserves the separation between the delegate protocol, the
host-neutral supervisor, and the selected host adapter. It also preserves the
retired systemd flow as historical lineage only: systemd is not a backend,
fallback, recovery path, or accounting exception here.

## Durable Identity

The repository-relative component path is the durable task and job identity.
Use a canonical path relative to the project root, with `.` for the root
component. The path selects the component directory, its `as-is.md`, its parent,
and its authority boundary. A runtime `JobId` never selects or authorizes a
task record.

Each task incarnation has a durable opaque `task-revision`. The revision is
created before its first attempt, remains unchanged through ordinary
checkpoints, retries, and recovery, and changes only when a completed or
cancelled record is replaced by a new bounded task. It is distinct from
`task.updated`: that timestamp orders checkpoints and supports stale detection,
but is mutable and is not an accounting identity.

An `attempt` is a one-based ordinal within a component path and task revision.
The first worker invocation is attempt 1. A retry or recovery that starts a new
worker invocation is the next ordinal and retains the earlier observations. A
supervisor restart or adapter reattachment that continues the same worker
invocation does not create another attempt. The canonical observation identity
is therefore:

```
component-path / task-revision / attempt
```

An observation also records its metric and attribution boundary. Repeated
polls, heartbeats, checkpoints, and runtime `JobId` aliases for one identity
update the same observation. They do not add cost, time, builds, or failures.
An implementation may use a private observation sequence to order updates, but
that sequence cannot replace the path/revision/attempt key.

Current `as-is.md` task context must not contain a `JobId` field as a required
task identity, lookup key, or completion authority. Existing historical
checkpoint payloads may contain a job identifier as a runtime observation; it
must be treated as diagnostic history only. A later implementation may expose
it as `runtime-job-id`, but it must not make a historical or current record
depend on it for recovery. The current durable path, task revision, attempt,
record status, validation, and handoff remain sufficient to resume without a
private handle.

## Change-Log Summary

The root `changelog.md` carries concise history. Any machine-readable cumulative
accounting summary belongs in `as-is.json` under an explicitly defined durable
configuration/data contract, never in Markdown front matter. Such a summary uses
these meanings:

- `cost.value` is cumulative canonical cost and carries an explicit currency
  (currently USD) and source. It is numeric only when every included canonical
  observation is numeric and currency-compatible.
- `wall-clock.value` is cumulative canonical elapsed time and carries the unit
  `seconds` and an observation source. It is numeric only when every included
  observation has compatible measured seconds.
- `build-count` counts unique observations explicitly classified as builds,
  regardless of outcome.
- `fail-count` counts unique observations with final durable outcome `failed`.
  A failed build is therefore included in both counts; a cancellation or block
  is not a failure unless it is explicitly classified as one.
- `unknown` is a deliberate incomplete aggregate, not zero. An individual
  host value that cannot be supplied is `unavailable` with its source. Neither
  spelling is converted to a numeric zero. A known numeric subset and the
  reason for an unknown aggregate remain in the relevant concise entry.

The summary is cumulative by stable observation identity and is scoped to the
`worker-subtree` attribution boundary. A full invocation is retained as a
non-additive diagnostic view. Parent allocations are not actual use, and child
actual use is not rolled into parent `spent` fields or counted again in a parent
summary. The summary is not a budget, runtime index, or replacement for a
current task record.

At a durable handoff, failure, cancellation, or retirement, the owner adds or
updates one concise entry per finalized observation identity. A correction
updates the existing identity and supersedes its prior value. It does not add a
second entry to the cumulative total. An entry that lacks a retained revision
or attempt remains a historical fact but is excluded from the deduplicated
aggregate until its identity can be established; it is never guessed or
retroactively remeasured. An explicitly stored cumulative summary therefore
remains incomplete while the historical measured values remain visible.

## Private Supervisor Job Map

The supervisor may maintain a private map keyed by generated runtime `JobId`.
Each entry may contain only runtime coordination and diagnostic data:

```text
JobId -> {
  component-path,
  task-revision,
  attempt,
  adapter,
  process-handles,
  session-handles,
  runtime-state,
  first-observed-at,
  last-observed-at,
  expiry-state
}
```

The map is not a task tree, approval store, accounting authority, or completion
source. Handles and session identifiers are source-labelled private data;
secrets and prompts are never stored in it.

For active attempts, the map is persisted so a supervisor restart can reconcile
live work and preserve diagnostic continuity. Its location is the private
user-level runtime area:

```
${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json
```

The directory is private (normally mode `0700`) and the file is written
atomically with restrictive permissions. It is runtime coordination metadata,
not a repository artifact. A host that cannot persist or reload it may still
answer the durable component-path status, but must report runtime diagnostics
as unavailable and cannot claim restart-time live-handle continuity.

On startup or supervisor recovery, the host loads the map, validates each
canonical component path and task revision against the repository record, and
asks the recorded adapter whether each process/session handle is live and
reattachable. It then records a source-labelled reconciliation result:

1. A live reattachable handle remains associated with the same path, revision,
   and attempt; a new `JobId` is an alias update, not a new attempt.
2. A dead or unreattachable handle becomes `unknown` or `unavailable` runtime
   state. The host rereads the durable record and never infers failure,
   completion, cleanup, or a retry from the missing handle alone.
3. A terminal record with confirmed process and workspace cleanup may have its
   map entry marked expired after the configured runtime retention period. An
   active or non-terminal record is not expired merely because private state is
   missing; it remains a durable recovery or capability blocker.
4. An entry whose path, revision, or attempt no longer matches the current
   record is quarantined as an orphan diagnostic and excluded from accounting.
   It is removed only after the reconciliation evidence and configured audit
   retention are satisfied.

The map is thus persisted for restart/reconciliation, but safe to rebuild from
durable records plus host observations. Losing it reduces runtime visibility;
it does not change task authority.

## Stable Public Status

The public read-only status interface accepts a canonical `component-path` and
an optional `attempt`. With no attempt, it resolves the current task revision's
latest durable attempt. With an attempt, it resolves that attempt within the
current task revision. A caller does not need to know or submit a `JobId`.

The response always includes the durable record status, revision, attempt,
validation/result/checkpoint evidence, source-labelled accounting, blockers,
descendant state, and next action. Runtime diagnostics may additionally include
`runtime-job-id`, adapter, process/session handles, and host state, each marked
as optional and source-labelled. If the private map or handle is unavailable,
the stable path query still returns the durable observation and reports runtime
fields as unavailable; it never treats missing private state as completion.

The supervisor and OpenCode adapter may continue to use `JobId` internally for
control and correlation. A JobId-only public lookup is diagnostic compatibility
at most, not the stable status contract. OpenCode session/event behavior remains
inside `designs/opencode-adapter-readiness.md`; the generic supervisor only consumes normalized,
source-labelled adapter observations.

## Accounting Ownership And Reconciliation

### Attribution boundaries

Every resource observation declares one boundary:

- **Worker subtree:** The canonical accounting boundary for task cost,
  worker-attempt wall-clock, build observations, and durable task failures. The
  component that owns the worker attempt owns this observation.
- **Full invocation:** The end-to-end as-is/orchestrator invocation, including
  control-plane and adapter overhead. It is retained for latency and
  operational analysis, but is non-additive when worker-subtree observations
  are present.

The two views may describe the same real-world execution, but are not summed.
The summary's canonical total uses worker-subtree values only. A full-invocation
entry must say `non-additive` when it overlaps a worker-subtree entry.

### Parent and child ownership

The parent owns its own orchestration, validation, integration, and any direct
work at the parent component path. A child owns its worker-subtree observations
at the child path. The parent reserves and authorizes child allocations, but it
does not copy child actual cost, time, builds, or failures into its own
`spent`, `spent-seconds`, or canonical summary. A parent result must still
account for every failed or cancelled descendant for completion purposes. That
completion evidence is not a second accounting observation.

### Attempts, retry, and recovery

Each new worker invocation gets the next attempt ordinal and a new canonical
key. Attempt 1's measured time and unavailable cost remain in the record when
attempt 2 is scheduled. A retry or recovery cannot reset cumulative task
observations, spend the reserve without authorization, or replace the
configured worker. A supervisor restart that observes the same invocation
updates attempt 1 rather than creating a duplicate. A host `JobId` change never
changes this rule.

### Measurements and unavailable values

Cost is actual only when the named host or adapter source reports it. A
model/token-derived value is labelled as such and is not called provider
billing. Wall-clock is measured only when a named clock and boundary are
available; monotonic worker-subtree duration and full-invocation elapsed time
are distinct observations. Unknown or unavailable values remain visible and do
not authorize automatic budget enforcement or become zero.

For each metric, reconciliation is an upsert by path/revision/attempt,
boundary, and metric kind. A repeated observation replaces the current value
only when its source and sequence are newer. A numeric cumulative value is
produced only after all included canonical observations are resolved and
compatible. Otherwise the aggregate value is `unknown`, with known values and
unresolved identities retained for later reconciliation.

### Builds and failures

A build observation is a deliberately classified build/typecheck/package
invocation, not every test command. Its unique attempt key is counted once
regardless of repeated polling. A successful build increments `build-count`; a
failed build increments both `build-count` and `fail-count`. A durable task
attempt ending in `failed` increments `fail-count` once even if it did not run a
build. Nonzero process exit alone is supplementary evidence and does not create
a durable task failure without the applicable adapter or record classification.

## Implementation Boundary And Non-Goals

This design task changes durable specifications and verification fixtures only.
It does not add a runtime map, public status endpoint, accounting ledger, JobId
migration, OpenCode adapter, or build/failure instrumentation. Those are later
bounded implementation tasks. Any such task must preserve this identity and
attribution boundary, keep OpenCode-specific behavior at the adapter boundary,
and must not revive systemd.

The design is independently verifiable through the fixture matrix in the
the merged design-component record at `designs/as-is.md` and through
focused reference, record/schema, accounting, and whitespace checks. The
fixtures are expected observations and acceptance cases, not measurements from
the current design-only task.
