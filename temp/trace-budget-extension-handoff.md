# Trace and Budget-Extension Handoff

## Status and scope

This is a temporary, non-authoritative handoff document. It records the next
bounded planning items for budget-extension decisions and trace safety. It does
not authorize implementation, budget allocation, trace mutation, or task-state
changes.

The two concerns remain separate:

1. determine whether bounded evidence can support granting additional budget to
   a progressing task;
2. make trace handling append-only and safe so telemetry cannot alter decisions
   or durable task state.

Existing traces are historical evidence and must not be rewritten, normalized,
backfilled, or deleted as part of either item.

## Current observed behavior

### Budget and execution evidence

Current local evidence includes lifecycle events such as:

- `session.lifecycle`;
- `subprocess.launch`;
- `subprocess.exit`;
- `subprocess.handoff`;
- `delegation.lifecycle`;
- `worker.lifecycle`;
- `call_subagent`;
- `worker.result`.

These events can expose bounded identity, relationships, outcomes, durations,
exit classifications, handoff observations, and opaque session references.
The job registry can expose supplied wall-clock/cost limits and observed
wall-clock completion data.

The current evidence does not consistently expose the durable task revision,
attempt, checkpoint progress, remaining allocation, reserve consumption, or an
explicit extension request and decision. A trace therefore cannot currently
prove that an extension is justified merely because a later invocation has a
larger budget.

### Trace behavior

The tracer is best effort. `components/observability/tracer.ts` emits local
JSONL or configured external telemetry, applies configured retention/size
controls, and swallows telemetry failures so tracing does not block execution.
External session correlation carries only an opaque session ID. Trace events
are supplementary and are not task, job, budget, recovery, validation, or
completion authority.

The current implementation appends new local records. Historical records in
`.as-is/tracing.jsonl` may contain useful recovery and audit evidence and must
be preserved in place.

## Rules to preserve

### Rule 1 — Traces are observations, never decisions

A trace may report what happened, when it happened, and bounded source-labelled
resource observations. It must not authorize, extend, stop, resume, validate,
complete, cancel, or recover a task.

### Rule 2 — Durable records own budget authority

A budget extension is valid only when the task/control-plane authority records
an explicit decision against the current component path, task revision, and
attempt or lease. Trace evidence may inform that decision but cannot create it.

### Rule 3 — Existing traces are immutable historical evidence

Do not edit, rewrite, reorder, deduplicate, backfill, migrate, or retroactively
reinterpret existing trace lines. Do not use a new schema migration as a reason
to mutate `.as-is/tracing.jsonl`.

If a new event model is needed, write only new events using the new schema and
keep old events readable as historical records. Any historical analysis should
be performed by a separate read-only query or report.

### Rule 4 — Trace emission must be append-only

The trace writer may append a new bounded event, rotate according to configured
retention policy, or stop emitting when limits are reached. It must never edit
an existing event in place. Rotation/deletion is a separate retention concern,
not a mutation or correction mechanism.

### Rule 5 — Telemetry failure cannot change behavior

Serialization errors, unavailable sinks, full filesystems, malformed events,
query failures, and export failures must not change task status, budgets,
process control, recovery, or completion decisions.

### Rule 6 — No hidden control channel through traces

Trace fields must not be interpreted as commands, approvals, leases, or task
updates. A trace event named `budget.extension.decided` may record a decision
already made elsewhere; emitting that event must not itself grant the extension.

### Rule 7 — New events need bounded provenance

Future budget-related events should identify, where available:

- component path;
- task revision;
- attempt or lease identifier;
- caller and target role;
- parent relationship;
- event source;
- bounded reason class;
- observed wall-clock and cost fields with source labels.

Unknown values remain unknown. Estimates must not be represented as actual
spend.

## Simplified first approach

The first implementation should use the smallest workflow that tests whether
extension review is useful. It should not begin with a generalized budget
architecture, a universal budget envelope, detailed budget fields in every
trace, automatic adaptive reallocation, or historical trace migration.

The proposed first flow is:

```text
component receives an initial budget
→ component approaches or reaches the limit
→ component preserves a durable checkpoint
→ parent requests a bounded extension review
→ reviewer examines durable records, the caller's request, and bounded
  read-only session evidence
→ reviewer returns approve, reject, or insufficient-evidence
→ parent/control plane authorizes or rejects the recommendation
→ supervisor enforces an approved bounded continuation budget
```

The reviewer answers whether more budget appears justified; it does not own or
mutate the allocation. The parent or control plane remains the authority, and
the supervisor enforces only the approved continuation. If the review itself is
model-assisted, it should be a separate bounded action rather than an
unbounded operation inside the expiring component process.

### Concurrency assumption

At most one process may work on a given component at any time. The component
record and path therefore identify the active work for the initial design; no
parallel-attempt identifier, lease hierarchy, or separate checkpoint identity
is required merely to distinguish continuations of that component.

Parallel work on different components remains allowed. Their independent
component records identify their work, but they can still compete for a shared
parent budget. Parent extension admission must therefore read the current
parent record, check the aggregate remaining cost and wall-clock budget while
protecting the parent reserve, and record the decision atomically. A per-file
atomic replacement alone is not sufficient if two processes can approve
extensions against the same stale parent snapshot; use an existing lock or
optimistic revision check if the current control-plane write path permits such
concurrency.

The single-process rule must be enforced by the control plane or launcher, not
only by agent guidance. An exhausted component should move to a recoverable
state such as `blocked` or `awaiting-approval` before review, and only an
approved continuation may reactivate it. The smallest extension operation is
therefore:

```text
component record + bounded request
→ reviewer recommendation
→ atomic parent-budget admission
→ cumulative component allocation update
→ recoverable component reactivation
→ one bounded continuation process
```

This is intentionally a smaller first slice than a full budget-control redesign.
Keep the existing task allocation, parent/child checks, wall-clock supervisor,
job registry, and trace files. Add only the reviewer contract, bounded evidence
input, deterministic approval checks, continuation invocation, and focused
approve/reject/insufficient-evidence tests. Generalized budget envelopes,
adaptive reallocation, detailed budget telemetry, and provider-specific cost
enforcement remain deferred until implementation evidence shows they are needed.

## Separate follow-up item A: budget-extension evidence

### Objective

Define and validate a bounded decision procedure for granting additional budget
when a task has a durable checkpoint and evidence indicates likely completion.

### Candidate event vocabulary

These are proposed observations, not commands:

- `budget.checkpoint.observed`;
- `budget.extension.requested`;
- `budget.extension.decided`;
- `budget.lease.issued`;
- `budget.observation.recorded`.

The authority decision must also be recorded in the durable task/control-plane
record. Traces only correlate the request, evidence, decision, and resulting
execution lease.

### Minimum admission conditions

An extension should be considered only when:

- the current task record is active and fresh;
- the checkpoint is durable;
- progress is bounded and not stalled or repeating;
- remaining acceptance work is identified;
- no unresolved blocker invalidates the plan;
- the requested extension fits the hard parent/task ceiling;
- validation and handoff reserve remains protected;
- cost availability and source are explicit.

The first implementation should be parent-authorized and deterministic. It
should not automatically infer completion likelihood from model text or a
successful process exit.

### Acceptance evidence

A bounded implementation of this item should prove that:

- an extension request is distinct from an approval;
- approval is impossible from trace data alone;
- cumulative allocation and remaining reserve are preserved;
- the supervisor receives only the approved lease;
- a budget-stopped or rejected extension is recoverable;
- historical traces are untouched;
- unavailable cost remains unavailable rather than becoming zero actual spend.

## Separate follow-up item B: append-only trace safety

### Objective

Make the trace safety boundary executable and testable without changing the
meaning of historical traces.

### Candidate implementation boundary

The primary rule belongs at the tracer write boundary:

- `components/observability/tracer.ts` owns append-only emission and failure
  isolation;
- trace event producers provide only allowlisted bounded metadata;
- query tools remain read-only;
- task/control-plane code remains the sole authority for budget decisions.

The rule should be reinforced by tests rather than only by agent instructions.

### Acceptance evidence

A bounded implementation of this item should prove that:

- a new event appends without changing existing bytes;
- malformed or oversized events are rejected or omitted without mutating prior
  records;
- telemetry failure does not alter task or process outcomes;
- external export receives no session payload or filesystem path;
- trace queries cannot write traces or task records;
- retention behavior is explicit and separate from event mutation;
- historical `.as-is/tracing.jsonl` remains byte-for-byte unchanged during the
  focused test.

### Non-goals

This item does not:

- rewrite existing trace files;
- migrate historical event schemas in place;
- make traces authoritative;
- implement automatic budget extension;
- add a second task or approval record;
- infer progress from unbounded prompts, responses, or reasoning.

## Separate follow-up item C: understandable-solution guidance

### Objective

Record an explicit repository-local instruction telling agents to prefer
working, understandable, proportionate solutions over sophisticated,
enterprise-grade solutions when both satisfy the acceptance conditions.

The instruction should be placed in the relevant agent guidance file or other
applicable agent-policy document, not hidden only in this temporary handoff.
The exact location must be selected according to the agent hierarchy and
scope: a repository-wide rule belongs in the applicable root agent guidance;
a component-specific rule belongs in that component's agent guidance. Do not
silently duplicate or weaken higher-authority repository constraints.

### Proposed rule

> Prefer the smallest working, understandable solution that satisfies the
> acceptance conditions. Do not introduce sophisticated or enterprise-grade
> interfaces, abstractions, configuration, or operational machinery unless the
> requirement or evidence demonstrates that they are necessary. If a more
> complex design is proposed, state the concrete requirement, evidence, and
> material trade-off that justify it.

This is guidance toward proportionate engineering, not permission to ignore
reliability, security, privacy, recovery, validation, or other fixed
constraints. A simple solution must still be correct, observable where
required, and safe within its authority boundary.

### Acceptance evidence

A bounded implementation of this item should prove that:

- the rule is present in the relevant agent guidance document;
- its scope and authority are clear;
- it does not contradict the design principles or fixed safety constraints;
- at least one applicable task or design review can use it to reject needless
  complexity without rejecting necessary behavior;
- the temporary handoff remains non-authoritative after the rule is adopted.

## Suggested sequencing

1. Preserve this handoff as planning context only.
2. Create a separately bounded task for append-only trace safety and focused
   tests, if implementation is authorized.
3. Create a separate task for budget-extension evidence and durable decision
   recording.
4. Validate trace safety before adding new budget-decision event producers.
5. Analyze new events alongside historical traces without modifying historical
   data.
6. Move accepted work into the owning component record; this temporary document
   is not a backlog or task authority.

## Residual risks and unknowns

- The current trace schema does not consistently carry task revision and
  attempt identity.
- Cost is unavailable or source-dependent in many current runs.
- Existing trace retention may delete old files according to configuration;
  preservation here means no implementation-time rewriting or correction.
- A future append-only writer must define how rotation and size limits coexist
  with the requirement to preserve evidence.
- No extension decision should be inferred from the current historical traces.

## Safe next action

Review this handoff with the owning observability and control-plane components,
then authorize two independent bounded tasks: one for append-only trace safety,
and one for evidence-backed budget extension. Do not modify `.as-is/tracing.jsonl`
while performing either task.
