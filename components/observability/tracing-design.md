# All-in execution tracing design

## Status and scope

This is the design contract for supplementary execution telemetry. It does not
make telemetry an authority. The bounded `startSpan`/`finish` lifecycle and
`emitTrace` sink are the implementation boundary. The measured 207 ms dummy
launcher baseline (204 ms child wait) is a reference measurement, not a
performance target.

The design is staged: stabilize this event model and its capture boundaries;
then rehearse a dummy delegation flow. The tracer captures key execution
lifecycle events, including subprocess delegation, while Pi session stores
remain the source of conversational and tool payloads. External OTLP payloads
carry only an opaque session ID and never resolve the session store. No
launcher, session, tool, or output source is added by this document.

## Session correlation and local inspection

For conversational and tool detail, the external trace payload contains only
an opaque Pi session ID. It does not contain session content or a session-store
path. Other execution metadata may be exported, but the session-specific field
is the ID only. Local analysis is a separate operation and may retrieve the
selected session data needed for debugging.

Local session inspection follows data ownership rather than a tracer-specific
approval system. A process may inspect any valid session in the configured,
project-local session store that its effective user and file permissions can
read. The inspection surface remains read-only and exact-ID based; it must not turn
an opaque ID into an arbitrary filesystem path. Detail modes, paging, and role
or tool selectors control response volume. Missing, inaccessible, deleted, or
out-of-range sessions are reported as availability states.

Local trace files and local session files remain under the owning user's normal
filesystem permissions. The tracer and query tools do not grant, revoke, or
recheck ownership permissions, and a session reference does not itself grant
access. External export is a separate data-flow choice: when configured, it
exports the session ID only and never dereferences the local session store.
The configured Jaeger/OTLP endpoint and its operator are responsible for
access to the exported trace data; the tracer does not create a second
per-session authorization authority.

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

## Output and controls

The tracer captures execution metadata and event relationships, not Pi session
payloads. Session payloads remain in the local Pi session store and are
resolved separately by exact session ID under normal file permissions. Local
analysis may retrieve selected payloads when debugging requires them. Trace events
use deterministic field allowlists and bounded values; external sinks receive
only the opaque session ID for session correlation and never resolve the local
session store.

Retention is backend-specific and defines maximum age, maximum local size,
rotation, deletion behavior, and export buffering. Local JSONL is diagnostic
and may be deleted; it is not task or audit authority. Trace queries return
bounded fields with limits and no arbitrary filesystem or backend access. The
configured user-owned local files and explicitly configured external endpoint
are the data-ownership boundaries; the tracer does not grant or revoke access.

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
3. Confirm event field allowlists, retention, endpoint configuration, and the session-ID-only export boundary.
4. Implement only allowlisted execution metadata and bounded queries; raw
   conversational and tool payloads remain in the Pi session store and are not
   added as tracer sources or sink payloads.
5. Re-measure the stub baseline and retain regression evidence before enabling
   new event families.

The trace can explain what was observed and when, but cannot authorize work,
accept task status, allocate budget, validate a result, close descendants, or
replace durable records.
