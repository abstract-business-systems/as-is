# All-in execution tracing design

## Status and scope

This is the design contract for supplementary execution telemetry. It does not
change `tracer.ts`, enable broad capture, add queries, or make telemetry an
authority. The existing bounded `startSpan`/`finish` lifecycle and `emitTrace`
sink remain the initial implementation boundary. The measured 207 ms dummy
launcher baseline (204 ms child wait) is a reference measurement, not a
performance target or a reason to capture model content.

The design is staged: stabilize this event model and its capture boundaries;
then obtain approval and rehearse a dummy delegation flow. The tracer now
implements local-full raw payload retention and export-bounded capture: local
JSONL is controlled by retention/size limits, while OTLP payloads are filtered,
redacted, and byte-bounded only when explicitly enabled. No launcher, session, tool, or output source is added by this document.

## Session-reference-first policy

For conversational and tool detail, the normal trace payload is a reference,
not session content. Each trace may record an opaque Pi session ID and a
scoped session-store reference, plus the configured role, approved model and
provider metadata, job/delegation correlation, session revision and event
range, bounded message/tool/usage counts, byte counts, timing, and an explicit
missing-session status. These fields are correlation and measurement metadata;
they do not expose session contents or grant access.

Prompts, responses, tool arguments, and tool results are not normal trace
payloads, including in local-full capture. Full detail is retrieved only by a
separately authorized session inspection that enforces its own scope, access,
retention, and redaction controls. A reference must be scoped to the permitted
session store and event/revision range; it must not be an arbitrary path or
query. If the session is unavailable, inaccessible, deleted, or outside the
requested range, the trace records a bounded missing-session status and does
not retry, inline, or substitute raw content.

Session references are subject to the same least-privilege access, retention,
size, redaction, and failure controls as other sensitive correlation metadata.
Export carries only the allowlisted reference and bounded metadata, with the
existing filtering, redaction, and byte bounds; it never exports resolved
session content. Local-full/export-bounded remains a telemetry sink policy,
not authorization to add session sources or broaden normal trace capture.

## Authority and identity

| Concept | Required information | Authority rule |
| --- | --- | --- |
| Trace | `trace_id`, schema version, component path, task revision, attempt | Correlates observations only; task records remain authoritative. |
| Session/model | session class, provider/model label when approved, start/end timing | Descriptive metadata; never intent, status, or completion authority. |
| Task | canonical component path, task revision, attempt ordinal, status transition timing | The task record owns status, budget, recovery, and completion. |
| Job | diagnostic runtime job ID, phase timings, exit classification | The job runner owns process/job state; ID is not required for recovery. |
| Worker | configured worker role, invocation timing, parent span | Role metadata cannot grant permissions or redefine the record. |
| Supervisor | bounded phases (`setup`, `log`, `spawn`, `wait`, `handoff`), timing, child count | Supervisor state remains operational evidence, not task authority. |
| Descendant | parent component path, child task revision/attempt, dependency edge, depth | Delegation records and parent integration own dependency and closure. |
| Budget | authorized cost/wall-clock allocation, reserve, host-reported spend, observed duration | Accounting/task records own limits and spend; telemetry may report only copies. |
| Outcome | success/failure/cancelled/blocked, bounded reason class, end timing | A trace records the reported outcome; validators and task management decide completion. |
| Handoff | source commit, integration classification, validation names/results, residual risk | Durable task/changelog and Git history own the handoff. |

Identifiers are opaque, stable only for correlation, and never secrets. A span
has one parent and a trace has one root; independent siblings share a trace
only when an explicit delegation relationship exists. A retry gets a new
attempt and span while retaining the task revision. An event must be usable
without a private runtime `JobId`.

## Event envelope and boundaries

Every event has `schema_version`, `event_name`, `timestamp`, `trace_id`,
`span_id`, optional `parent_span_id`, component path, task revision/attempt,
phase, outcome (when finished), and bounded duration. Event names describe
facts (`worker.started`, `supervisor.phase`, `handoff.validated`), not commands
or policy decisions. Attributes are typed, allowlisted, size-limited, and
omitted when unknown.

The capture boundary is lifecycle metadata and caller-supplied bounded
attributes only: start/finish, phase, relationship, classification, timing,
and approved counters. Do not capture prompts, model responses, tool
arguments/results, environment dumps, filesystem contents, credentials,
access tokens, or arbitrary exception text. A failure to emit, serialize,
redact, export, or query is swallowed and must never alter execution, task
status, budget enforcement, recovery, or completion.

The minimum event families are:

- `task.started|status|finished` — record reference, status observation, and
  timing; status changes are not issued by telemetry.
- `job.started|phase|finished` — diagnostic job and bounded phase timing.
- `worker.started|finished` — configured role, attempt, outcome class.
- `supervisor.phase` — setup/spawn/wait/handoff phase and duration.
- `delegation.started|finished` — parent/child relationship, dependency edge,
  depth, and child outcome observation.
- `output.observed` — only an approved output class, byte/count metadata, and
  redacted digest if needed; never output payload by default.
- `handoff.validated|integrated` — validation class/result and source or
  integration commit reference after durable evidence exists.

Events are emitted at lifecycle boundaries, not for every internal operation.
Completion events require an explicit finish path; missing events are an
observability gap, never evidence of success.

## Output, privacy, and controls

Output is classified before any future implementation: **public** (already
intended for repository status), **project-internal** (task metadata and
bounded diagnostics), **sensitive** (paths, provider/model details, timing or
identifiers that enable correlation), and **secret/personal** (credentials,
private prompts/responses, tokens, user data). Secret/personal data is never
captured. Sensitive data is disabled by default and requires an explicit,
scoped policy; project-internal fields use allowlists.

Future capture must apply deterministic field allowlists, length/count limits,
structured redaction before persistence or export, and fail-closed behavior
for unknown classifications. Redaction must cover credentials, tokens,
secret-like headers, personal identifiers, and raw prompt/tool/model content.
Hashes or digests are permitted only when their correlation value is justified
and their input is already approved. Redaction is not a license to retain raw
values for debugging.

Retention is backend-specific but must define maximum age, maximum local size,
rotation, deletion behavior, and export buffering before implementation.
Local JSONL is diagnostic and may be deleted; it is not task or audit
authority. Access is least privilege: local files follow repository access
controls, exports use explicitly configured authenticated endpoints, and
trace queries return bounded, redacted fields with limits and no arbitrary
filesystem or backend access.

## Failure, cost, and rollout gates

Telemetry is best effort: unavailable backends, timeout, malformed events,
full disks, redaction errors, and query failures do not block instrumented
work. Export must have bounded timeout/retry and no unbounded queue. Recording
must not duplicate or mutate task records. Instrumentation overhead is measured
against the 207 ms baseline and bounded before rollout; budget and wall-clock
values are observations, never additional allocations.

Implementation gates:

1. Validate this schema against the existing tracer without runtime changes.
2. Rehearse a deterministic dummy delegation and confirm parent/child,
   attempt, phase, outcome, and handoff relationships, including failure and
   unavailable-backend paths.
3. Approve privacy classification, redaction, retention, and access policy.
4. Implement only allowlisted metadata and bounded queries; raw payload capture
   remains confined to the explicitly approved tracer local-full/export-bounded
   policy and is not broadened to new runtime sources.
5. Re-measure the stub baseline and retain regression evidence before enabling
   new event families.

The trace can explain what was observed and when, but cannot authorize work,
accept task status, allocate budget, validate a result, close descendants, or
replace durable records.
