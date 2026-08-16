# Host-Neutral Execution Contract

## Purpose

This specification defines the host-neutral boundary between the orchestrator and a worker runtime. It describes how the orchestrator launches, resumes, observes, questions, cancels, and recovers a worker while keeping policy and durable authority in the filesystem task record. A host adapter maps this contract to its own sessions, processes, permissions, and measurement APIs; it does not redefine the contract.

## Readiness Ownership Inventory

This inventory is the readiness boundary for a future execution-contract module. It records current ownership and evidence without creating `core/modules/execution-contract/` or moving implementation.

| Concern | Current owner | Evidence | Boundary and gap | Recovery boundary |
| --- | --- | --- | --- | --- |
| Host-neutral lifecycle concepts and request/result vocabulary | This document, `docs/execution-contract.md` | `ExecutionRequest`, `ExecutionResult`, lifecycle operations, state/checkpoint rules, and recovery policy below | The document is the current conceptual authority; no standalone runtime contract module exists yet. | Preserve this document and current implementation owners until a replacement contract has consumer and behavior evidence; abandon an incomplete extraction without leaving split lifecycle authority. |
| Durable task status, checkpoints, questions, approvals, cancellation, completion, and descendant closure | `core/modules/task-control/` | `control-plane.ts`, `control-plane.test.ts`, task-record validator, handoff-eligibility tests | Task-control owns durable mutation and validation; it does not own host process or session mechanics. | Recover from the component `as-is.json` task and configured narrative; never infer a transition from a process handle or exit. |
| Detached process lifetime, process groups, signals, wall-clock stop, stdio, and exit observation | `core/adapters/process/bounded-process-supervisor.ts` | `bounded-process-supervisor.test.ts`; consumed by `core/adapters/process/supervisor.ts` | The bounded adapter owns mechanical process lifetime only; it does not interpret task completion or Git handoff. | Preserve the owned process-group and durable evidence boundary; if control is unavailable, return host-unavailable evidence rather than substitute a runtime. |
| Durable process-backed launch, observe, permission, cancellation, recovery, stale classification, budget observation, and handoff mapping | `core/adapters/process/supervisor.ts` | `supervisor.ts` and provider-free `supervisor.test.ts` | This is the current broad process-backed mapping of the conceptual contract and is the principal overlap to reconcile before extraction. | Keep task records authoritative, retain source-labelled private host observations, and preserve runtime state when termination or durable cleanup evidence is incomplete. |
| Pi command/session construction, model and thinking resolution, tool/skill admission, worktree/Git mechanics, registry projection, and launcher handoff observation | `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` and its skill record | Launcher tests, `skills/spawning-pi-subagents/as-is.md`, package and Pi-version fixtures | The launcher is a Pi adapter/procedure consumer of the contract, not the host-neutral contract owner; its Pi and repository mechanics must remain outside a future core module. | Preserve the current launcher and static registration path; a failed adapter extraction reverts only the adapter change and does not alter task authority or the working registration surface. |
| Budget arithmetic and launch admission | `core/modules/task-control/budget.ts` and `control-plane.ts` | Budget and control-plane tests, including retained-reserve admission and unavailable-observation cases | Arithmetic is reusable functionality; allocation, approval, and host observation remain with task control and callers. | Carry cumulative observations forward from durable records; unavailable cost remains unavailable and does not authorize a reset or automatic continuation. |
| Trace emission and session/evidence queries | `core/modules/observability/` and `tools/evidence/` | Tracer, lifecycle, session, and trace-query tests | Observability is supplementary and cannot authorize, complete, or replace a task record. | Telemetry failure degrades evidence to unavailable without blocking durable task recovery or inventing completion. |
| Worktree, Git ancestry, commit scope, and parent integration | Pi launcher and receiving `component-builder` authority | Launcher handoff fixtures and component-task protocol | Mechanical ancestry and scope evidence are distinct from semantic integration and execution lifecycle. | Preserve isolated worktrees with uncommitted recovery candidates; the receiving builder decides integration and the launcher never merges. |

The smallest candidate boundary is an observation contract: an operation-specific request names the component, durable record revision, normalized configuration, input, budget, and return condition; a result reports outcome, durable record observation, source-labelled host observation, question, and recovery. The request/result shape below is conceptual and does not authorize a serialization format, runtime API, or relocation.

The current evidence decision is to retain this candidate as a documented contract rather than create `core/modules/execution-contract/` or add a second runtime seam. Provider-free fixtures demonstrate launch admission, accepted launch observation, failure, cancellation or bounded recovery, stale-revision rejection, and unavailable host evidence, but the consumers still require materially different ownership: task-control owns durable mutation, process owns process-backed lifecycle mapping, the Pi launcher owns Pi and repository mechanics, and observability remains supplementary. Extracting a shared API now would duplicate request normalization, path/privacy projection, recovery locking, or task-record interpretation without a second independent host adapter to validate the abstraction. A future task may reopen this decision only when an additional host adapter or independent consumer supplies a concrete compatibility need and can preserve these boundaries.

Readiness evidence is retained in the existing owners: process-supervisor fixtures cover launch admission, accepted launch observation, failure, cancellation, bounded recovery, stale-revision rejection, and unavailable-host evidence; task-control fixtures cover durable admission and authority; launcher fixtures cover host mapping and handoff; observability fixtures cover supplementary failure behavior. These fixtures validate the decision above without authorizing a new shared runtime API.

Until that evidence exists, the current document, task-control module, process adapter, Pi launcher, observability owners, and receiving builder retain their existing responsibilities. This is a bounded deferment of physical extraction, not a claim that the conceptual contract is unneeded.

## Emitted Metadata Privacy

Raw absolute filesystem paths and unapproved host-specific filesystem operands remain private and are never emitted in logs, traces, registry events, handles, diagnostics, tool results, recovery observations, or other execution metadata. Trusted channels may emit one of the bounded reference forms defined below only after proving provenance, containment, normalization, and recipient context. Raw repository-relative strings, arbitrary temporary paths, session-store, worktree, task-record, configured-directory, host-state, traversal-bearing, malformed, ambiguous, and unproven values remain prohibited or are represented by an opaque logical reference, approved resource class, bounded availability state, or omission. A value that cannot be proven safe is omitted or causes the bounded emission to fail closed; it is never serialized for convenience. This policy is prospective: it authorizes reference forms for separately enforced owner boundaries and does not retroactively reinterpret completed implementations. It cannot be weakened by project configuration, host adapter, role, or diagnostic mode.

The readiness inventory for enforcing this invariant is intentionally split by existing owner: the observability tracer owns common event-attribute filtering and external export; the launcher and recovery owner owns handles, registry records, lifecycle diagnostics, and recovery observations; evidence tools own session-analysis and trace-query result projection; and each host adapter owns only its own emitted surface. A future implementation task must preserve internal path use while proving direct, nested, configured-directory, component-derived, project-context, and masked-runtime fixture coverage at each owner. No generic privacy authority or speculative cross-component framework is created by this contract. Existing documentation examples and internal launcher arguments may contain paths until each emitted projection is separately classified and enforced. Readiness work must not claim implementation-level privacy conformance from documentation alone.

### Project-context template reference grammar

An example project-context template is `<project-root>/relative/path`. The template base is a logical project-context marker, not a host path and must not be expanded in emitted data. The suffix uses forward slashes, contains no empty segment, `.` or `..` segment, URI scheme, encoded separator, NUL, backslash, or leading slash, and must normalize without escaping the emitting project root. The emitter records or carries an explicit project identity/provenance when a recipient or external trace store may contain more than one project. Only explicitly trusted project-context channels may emit this reference form; a raw relative string without the template base and provenance is not approved. This form identifies a project resource for recipient-side resolution and does not authorize access.

### Masked transient-runtime reference grammar

An example masked transient-runtime reference is `<tmp>/as-is/<project-key>/<run-id>/<component-key>/<job-id>[/runtime-relative-path]`. It is a navigable logical reference for trusted debugging and observation channels: `<tmp>` replaces only the proven host temporary-root prefix, while the approved `as-is` runtime hierarchy, project key, run ID, component key, job ID, and validated runtime-relative suffix remain visible. The attempt ordinal is carried as associated structured metadata rather than inserted into this path form. The displayed marker never expands to a host path in emitted data, and navigation does not authorize filesystem access, host discovery, task mutation, recovery, or completion.

The emitter may produce this form only when trusted runtime provenance proves that the source operand is a canonical path contained by the approved secure temporary runtime root for the stated project, run, component, job, and attempt context. The post-prefix layout must match the known runtime structure. Each visible identifier segment (`project-key`, `run-id`, `component-key`, and `job-id`) is 1–128 ASCII letters, digits, `-`, `_`, or `.`, and the associated attempt ordinal is a positive decimal integer no greater than 128 digits. Each runtime-relative suffix segment is 1–255 ASCII letters, digits, `-`, `_`, `.`, or approved single-character separators used by the known layout. No segment may be `.`, `..`, empty, leading-slash rooted, backslash-containing, NUL-containing, URI-like, encoded-separator-bearing, or normalized in a way that escapes the approved runtime root. The runtime root, project/run/component/job/attempt association, and recipient-resolvable source context must be explicit. A recipient without authorized source context treats the value as an opaque logical reference, not a local pathname.

Raw temporary-root paths, arbitrary `/tmp` paths, values outside the approved runtime root, project-root/task-record/log/configured-directory/session/worktree operands not proven to belong to the approved runtime layout, arbitrary nested strings, mismatched identifiers, and unproven or malformed suffixes remain prohibited or fail closed. The masked form is not a generic sanitizer and does not retroactively authorize completed owner implementations; each owner requires a separate enforcement task and provider-free fixtures.

## Authority And Context

- The launching client's current working directory is the project-context
  origin. The host resolves the project root from that origin and supplies
  applicable repository instructions and project configuration to the worker.
  The requested component `cwd` identifies the worker's target and default
  relative execution context; it does not redefine the project root or act as a
  security sandbox. Git metadata is not required for project-context discovery.
- A component task's authoritative state is its local `task` object in
  `as-is.json` plus its configured front-matter-free Markdown task narrative. Root
  and component `as-is.md` records remain durable human context. No runtime
  index or backlog is a second authority. The orchestrator supplies the worker
  those task artifacts plus centrally supplied repository instructions,
  applicable design principles, and permitted skills.
- The worker receives the component record, not a copied root record, a
  repository-wide prompt, or a private runtime snapshot. The record's
  `Requirement` names any necessary external dependency explicitly.
- The effective configuration and higher-authority constraints are normalized
  before launch and remain stable for an attempt. A worker or host cannot
  silently change authorization, budgets, status semantics, or the active
  configuration snapshot.
- The component directory is the default worker read/write boundary. The
  worker may update its own record and declared component artifacts; the
  receiving parent component-builder owns semantic parent integration and
  delegation state. The launcher or host adapter may observe Git ancestry and
  report integration status, but does not merge or resolve the child result.
- Runtime handles, leases, prompts, caches, logs, and secrets are private host
  state. They may support an active attempt or recovery, but they are not
  required inputs to resume and are never authoritative over the task record.
- The canonical durable identity for a task and its observations is the
  repository-relative component path plus durable task revision and one-based
  attempt ordinal. A generated `JobId` is an operational handle only. It may
  be returned as source-labelled diagnostic data, but it is not a required task
  record field, stable public lookup key, or completion authority.
- Historical committed task state is recovered from Git history and concise
  the canonical `Changelog` section entries. This contract does not create or depend on a
  `task-archives/` tree or a separate host-specific historical recovery path.
  Uncommitted evidence is not presumed to be in Git; its necessary facts must
  be preserved in the current record/change log or in an authorized scoped
  evidence commit before removal.
- At most one active worker attempt may modify a component at a time. A
  parent component-builder or other explicitly authorized receiving orchestrator
  may update its own or root record and observe child records, but
  it integrates at the nearest common ancestor only after children finish and
  does not edit active sibling component files. The receiving authority owns
  the integration decision; the host adapter only supplies mechanical ancestry
  evidence.

## Private Transient Runtime State

A host may place private transient state at
`${TMPDIR:-/tmp}/as-is/<project-key>/<run-id>/<component-key>/<job-id>/`, or under an
equivalent secure host temporary root. The path must be collision-resistant,
private, disposable, and cleaned after the durable checkpoint, observations,
and handoff evidence are saved. It is never task authority, history, approval
state, or completion evidence.

The project key alone does not distinguish concurrent or retried runs for the
same project, so the run ID is required to prevent collisions and accidental
cross-run reuse; the component key preserves the component boundary. `/tmp` is
not suitable for durable records because it is a temporary, potentially shared
location that may be cleaned, unavailable, or lost across host-lifetime
boundaries. A secure host temporary root may provide the same disposable
semantics with stronger isolation.

For active attempts, a supervisor that claims restart/recovery diagnostics must
persist its private `JobId` map at
`${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json`.
The map associates each JobId with component path, task revision, attempt,
adapter, private process/session handles, and runtime state. It is atomically
written private runtime metadata, not a second task tree. Restart reconciliation
reattaches live handles to the same path/revision/attempt, marks dead or
unavailable handles unknown without inferring a durable outcome, and expires
terminal/cleaned entries only after configured retention. A missing map reduces
runtime diagnostics to unavailable; it does not invalidate path-based durable
status or authorize completion.

## Permission And Liveness Boundary

Permission is a launch prerequisite, not an exception discovered by a worker
after an opaque attempt has started. Before `launch`, `resume`, or `recover`,
the host adapter performs a capability preflight for the normalized command,
configured worker, record and checkpoint paths, process-group controls,
approved workspace, standard-input policy, event persistence, and watchdog
deadline. A failed preflight returns or records `rejected` or `unavailable`
before starting the worker; it does not wait for a prompt or consume an
unbounded attempt.

The supervisor creates and owns one collision-resistant approved workspace for
the attempt. It is private to the run, has restrictive permissions (normally
`0700`), is inside the host's disposable runtime root, and is the only transient
workspace exposed to the worker. The supervisor records the workspace class,
ownership, permission mode, and component/attempt association in a durable
checkpoint. A workspace handle or private state remains supplementary evidence;
the component task artifacts remain task authority. The worker must not silently widen
the approved path or use an unrecorded workspace.

The worker receives no hidden interactive prompt. The adapter closes or safely
disables standard input for a non-interactive attempt and treats a permission,
capability, or input refusal as a structured event. A `permission-needed` event
contains, at minimum, the operation and capability class, a non-secret resource
class, source, attempt/job and record revision, observed time, reason, and the
approval decision state. It is written to the durable task record before the
host presents an escalation. A transient prompt, stderr line, or host reply is
not an approval and cannot advance the task.

The schema-compatible durable task status for this condition is
`awaiting-approval`; its checkpoint payload must additionally carry the exact
permission state `awaiting-user-approval`. The orchestrator exposes the
structured event and required decision to the user through a supported,
machine-observable control-plane event path. If the host cannot prove that
permission-needed events bubble to that path and that an answer returns to the
durable record, it records a capability blocker and must not simulate a user
event or claim approval support.

Approval is scoped to the recorded operation, resource class, record revision,
and unchanged effective configuration. The orchestrator durably records the
approval before the supervisor retries or resumes; the resumed worker may use
only the approved workspace and configured role. A denial is durably recorded,
leaves the task blocked (or failed when the task cannot safely continue), and
does not trigger an automatic retry. Resume requires a new explicit direction
or approval and rereads the current record; it may continue, clean up, or start
an atomic unit again without reusing a transient prompt or stale handle.

The supervisor emits a durable heartbeat/checkpoint and enforces a bounded
deadline for each attempt. The observer records the heartbeat source, deadline,
observation clock, and age. Missing, malformed, or clock-inconclusive data is
`unknown`, not stale. An active task is a stale candidate only when its durable
checkpoint is older than the effective check-in interval or its watchdog
deadline has elapsed with no newer heartbeat; process health cannot override
that durable classification. Recovery is finite, preserves cumulative budget
and partial evidence, records backoff before waiting, and escalates after the
configured bound.

Every permission or liveness blocker has a stable fingerprint made from its
non-secret capability, operation, resource class, and failure class. A repeated
fingerprint within the same bounded task suppresses an automatic retry loop and
records escalation/next action instead. Cancellation first writes a durable
request, then asks the supervisor to stop the owned process group; confirmation
requires an observed terminated group and a durable cancellation transition.
Cleanup is allowed only after the cancellation, failure, approval-wait, or
handoff evidence is durable and confirms that no owned process, supervisor, or
workspace remains. The durable record and evidence needed for recovery are
retained.

## Contract Shape

Each operation has a normalized request and result. The names below describe
concepts, not a required serialization format or host API.

An `ExecutionRequest` contains:

- `operation`: one of `launch`, `resume`, `observe`, `question`, `cancel`, or
  `recover`;
- `component`: the filesystem component path and its task-record path;
- `record-revision`: the durable record revision or equivalent freshness
  marker observed by the orchestrator;
- `record`: the component task record supplied as the worker's task-specific
  context for `launch`, `resume`, and `recover`;
- `configuration`: the normalized effective configuration and constraints for
  this attempt, excluding secrets and host-specific settings;
- `input`: operation-specific direction, question, cancellation reason, or
  recovery reason, when applicable;
- `budget`: the remaining authorized cost and wall-clock allocation, including
  reserve handling from the task record; and
- `return-condition`: the durable state or checkpoint the operation must
  report before returning.

An `ExecutionResult` contains:

- `outcome`: `started`, `progressed`, `waiting`, `completed`, `failed`,
  `cancelled`, `unavailable`, or `rejected`;
- `record-observation`: the latest durable task status, `task.updated`,
  progress/checkpoint, budget observations, blockers, decisions, result, and
  next action observed after the operation;
- `runtime-observation`: optional host-provided lifecycle and usage facts,
  clearly identified by source; unavailable values remain unavailable;
- `question`: a durable question or decision request when the worker cannot
  safely continue without input; and
- `recovery`: the safe next action and whether private runtime state may be
  discarded, retained, or is required for the next attempt.

The result is an observation and handoff, not permission to infer success from
process exit, an absent host handle, or a missing private runtime artifact.
The orchestrator rereads the durable record before interpreting the result and
must reject a stale result that would overwrite a newer checkpoint.

## Non-Blocking Job Boundary

The submitting as-is/OpenCode/orchestrator turn and the worker job have separate
lifetimes. A `launch` operation performs only bounded control-plane work: after
authority, allocation, and record checks, it submits or spawns one attempt to a
supervisor-owned job or supported server job, records the durable launch
checkpoint, and returns without waiting for worker completion or process exit.
The `started` outcome means that the job accepted the attempt and the launch
checkpoint is durable; it does not mean that the worker completed.

The supervisor or server job owns the long-running worker and its process group.
It captures logs and lifecycle events, persists the state needed for later
observation, and remains independently addressable after the submitting turn
returns. A later orchestrator wake or check-in polls both the component record
and source-labelled process/session or job health. Health, a handle, an event
stream, or process exit is supplementary evidence and cannot replace a durable
status transition, validation, handoff, or descendant-closure check.

A foreground child process awaited by the submitting turn is synchronous, even
when it was started through a subprocess API. Wrapping a nested subagent call in
such a child is not a valid asynchronous implementation. If a host cannot safely
detach or submit a job, retain ownership of its process group, capture and
persist observations, and support later polling and cancellation, the adapter
returns or records `unavailable` and the orchestrator records a capability
blocker. It must not claim asynchronous support from a process that merely runs
in the foreground.

## Lifecycle Operations

### Launch

`launch` is valid only for a `ready` record whose allocation and authority have
been checked. The orchestrator creates a missing component record atomically
before this operation and supplies the record directly to the worker. The
supervisor/job and worker advance the record to `active`, record the launch
checkpoint, and begin one bounded attempt. The launch result must identify
whether the job accepted the worker, was rejected, or became unavailable, and it
returns after that checkpoint rather than waiting for the attempt to finish. It
must not claim completion without the durable completed record and validation
evidence.

Launch does not prescribe a particular process, session, transport, model, tool
set, or supervisor implementation. Those are adapter concerns, but the adapter
must satisfy the non-blocking job boundary above. A foreground child that the
submitting turn waits on is not a valid launch mapping.

### Resume

`resume` is valid for an active, blocked, approval-waiting, or failed task when
the orchestrator has a durable reason to continue it. The orchestrator rereads
the record and supplies that record rather than replaying a previous prompt or
requiring a prior runtime handle. The configured worker decides whether to
continue an atomic partial result, clean it up, or start the bounded unit
again. It preserves useful durable work and records a new checkpoint before
returning.

Resume does not mean that the same runtime instance or host session is reused.
Any reuse is an optimization that cannot change recovery behavior.

### Observe

`observe` obtains the current state without granting the worker new authority
or changing its task. The orchestrator observes the root and component
records, task status, configured worker, budget allocation and host-reported
use, blockers, required decisions, checkpoint freshness, and next action. A
host may additionally report lifecycle or measurement facts, but the source
and availability of each fact must be preserved.

For an active attempt, a later wake or check-in also polls the supervisor/job and
its process group or session health. A healthy process does not establish a
current durable checkpoint, and an exited or missing process does not establish
failure or completion by itself. The orchestrator records the durable and host
observations separately and routes stale detection, cancellation, or bounded
recovery from the durable record.

Observation must not inspect worker-private state to answer a durable task
query. A host can report a private runtime fact as supplementary evidence, but
it cannot use that fact to replace a missing durable checkpoint, cost
observation, or status transition.

### Question

`question` carries a worker question or an orchestrator direction that requires
human input or a materially different safe action. The orchestrator records
the question, its blocking decision, or its approval requirement in the task
record before presenting it. The worker remains `blocked` or
`awaiting-approval` until the durable answer, direction, or approval is
recorded; a host reply or transient prompt alone is not an answer.

An answer is scoped to the recorded question and current configuration. It may
provide direction or approve the recorded external effect, but it cannot
weaken a higher-authority constraint, retroactively authorize an unrecorded
effect, or alter the active configuration snapshot. Read-only queries are not
questions and must not change task state.

### Cancel

`cancel` is an orchestrator-routed control action. The orchestrator records the
user-authorized cancellation reason and a durable checkpoint, then asks the
host or supervisor/job to stop the attempt and its process group when possible.
The submitting turn need not wait for process termination, but it must return
only after the cancellation request and checkpoint are durable. The task becomes
`cancelled` only after the record contains the cancellation transition and
recovery/result context; a host stop signal alone is insufficient. Later
observation confirms process-group termination and records any residual cleanup
or recovery requirement.

Cancellation is bounded and observable: it must not silently delete durable
partial work, child records, audit evidence, or artifacts needed for recovery.
Private runtime state may be cleaned after the durable cancellation is safely
recorded, subject to the configured retention or audit boundary. A cancelled
task is terminal until a new bounded task replaces it; it is not resumed by
silently treating cancellation as interruption.

### Recover

`recover` starts from the durable record after interruption, stale work,
unavailability, failed handoff, or an incomplete host attempt. The
orchestrator identifies the configured worker in the record, verifies the
record is still recoverable, records the recovery checkpoint/reason, and
delegates to that worker. The worker owns the domain decision to continue,
clean up, or restart its atomic partial result. When a child handoff is
returned, the receiving component-builder owns semantic review and any
nearest-common-ancestor integration; the host adapter reports only mechanical
ancestry evidence.

Recovery must preserve the task's authority, remaining budget, descendants,
and acceptance conditions. A failed or unavailable runtime does not justify
resetting spent observations, replacing the configured worker silently, or
marking the task complete. If the configured worker is unavailable, the
orchestrator records that blocker and follows a later replacement policy;
this contract does not choose the replacement, retry, backoff, or scheduling
policy. A recovery launch uses the same non-blocking supervisor/job boundary as
the initial launch and preserves the configured agent authority and worker
selection; it does not turn a foreground child or a wrong-role host fallback
into an asynchronous attempt.

## Control-Plane Communication

- Status queries read the root and component task records. They do not steer a
  worker or depend on private runtime state.
- General questions use a separate read-only as-is/orchestrator interaction or
  a durable question in the affected record. A transient worker prompt or
  direct private-worker message is not authoritative.
- New parallel work is requested through parent-orchestrator delegation and a
  durable child record, not through a direct worker instruction.
- Approval and cancellation decisions are written to the durable record before
  the host performs the approved action or attempts to stop the worker.

## Concurrency Preconditions

- The current effective concurrency remains `1`. Future
  `maxConcurrentTasks: 3` counts leaf worker attempts, not parent
  control-plane orchestrators.
- A later runtime must acquire a per-component exclusive lease or lock before
  an attempt can modify that component and must account for active leaf slots
  globally. These coordination mechanisms do not replace task-record authority.
- Each leaf attempt retains an independent cost and wall-clock budget. Sibling
  attempts remain isolated by component scope and external dependencies; a
  parent observes child records on later wake/check-in operations before
  integrating their results.
- An ancestor cannot complete until every descendant is terminal and its result
  accounts for each failed or cancelled descendant.

These are design prerequisites only. This contract does not implement the
three-leaf runtime or raise the configured limit.

## Recovery Policy

Increment 6 supplies the conservative policy used by the lifecycle operations
above. It is host-neutral; an adapter reports observations and invokes bounded
attempts but does not redefine these decisions.

### Stale Detection

- An active record is a stale candidate only when the durable `task.updated`
  checkpoint exists and the observer's current UTC clock is later than that
  checkpoint by more than the effective `configuration.scheduling.checkInSeconds`.
  The checkpoint, configured interval, and observation clock are recorded as
  the sources of the decision.
- A missing or malformed checkpoint, an unavailable observation clock, or a
  clock result that cannot establish the interval produces `unknown`, not
  `stale`. The orchestrator records the reason and does not infer interruption
  or completion from it.
- An active record may also be recovered after a durable failed handoff,
  unavailable runtime, or controlled interruption. The durable reason is
  recorded before recovery; a process exit, missing handle, or absent private
  artifact is supplementary evidence only.

### Attempts, Backoff, And Budget

- `configuration.scheduling.maxRecoveryAttempts` is the finite maximum number of
  recovery attempts after the initial launch. The default effective value for
  this increment is `2`; a host must not start a further attempt after that
  bound, even if private state suggests that one might help.
- Before recovery attempt `n` (where the first recovery is `n = 1`), the
  orchestrator records a delay of
  `retryBackoffSeconds * 2^(n - 1)`. The delay is a scheduling wait, not a
  worker result; its due time and source are durable in `Recovery` or `Next
  Action` before the host waits or launches.
- Every attempt rereads the record and carries forward cumulative
  `constraints.cost.spent` and
  `constraints.execution.wall-clock.spent-seconds`. Neither value may be
  reset, replaced by a per-attempt value, or represented as zero when the host
  cannot observe it. The reserve remains unavailable for ordinary work and is
  consumed only by the task's configured validation, recovery, or handoff
  policy.
- A recovery attempt is not authorized when the remaining allocation after
  current spent use and reserve is exhausted. The record becomes a durable
  budget blocker requiring direction rather than silently spending the
  reserve. Unavailable cost or duration observations remain unavailable and do
  not justify a claim of automatic enforcement.
- Each attempt records its ordinal, reason, source-labelled observations,
  cumulative budget values, checkpoint, and next action in the existing task
  record. This preserves attempt history without adding a runtime log or a new
  front-matter field.
- The accounting identity for each attempt is the component path, durable task
  revision, and attempt ordinal. A retry or recovery that starts a new worker
  invocation gets the next ordinal; a supervisor restart observing the same
  invocation updates the same identity. Parent allocations remain separate
  from child actual use. The canonical summary uses worker-subtree observations;
  full-invocation elapsed/cost observations are retained as non-additive views.

### Pi Adapter Readiness Boundary

A future Pi adapter may own only Pi-specific session and subprocess invocation, exact-version preflight, explicit extension loading and registration, Pi model/session details, and host approval-flag mapping. It must not own task records, durable approvals or questions, task transitions, budget authority, process-group mechanics, host-neutral request/result vocabulary, semantic handoff or completion, Git/worktree integration, or the fixed emitted-path privacy policy. The current static `.pi` registration surface, package-owned registration export, and launcher remain the recovery path until a separately bounded adapter implementation proves compatibility.

Readiness evidence must distinguish exact Pi `0.84.0` version/launch preflight from provider compatibility, extension-loader behavior, project trust, package distribution, and standalone installed-package support. Provider-free fixtures must cover static interactive settings loading, explicit `--no-extensions --extension` loading, registration failure and unsupported service versions, exact-version mismatch/unavailability and malformed probes, approval-mode mapping including forced read-only denial, package manifest/lock consistency, candidate rollback, and every emitted metadata surface. The path-emission invariant remains an unresolved enforcement prerequisite: internal launcher arguments and documentation examples may contain paths, but handles, registry lines, diagnostics, traces, recovery observations, and tool results must not emit them after their owning implementation tasks pass.

### Worker Availability And Replacement

- Recovery always identifies the worker from the reread component record. An
  unavailable configured worker becomes a durable blocker naming that worker;
  the orchestrator does not silently substitute another role or runtime.
- A replacement is permitted only after explicit direction or approval names
  the replacement and the record captures the decision, authority, reason,
  affected attempt, and applicable policy. The original configured worker and
  its failed availability observation remain in recovery history.
- A host fallback, wrong-role task event, or unattributed return is not an
  approved replacement. It is a delegation blocker and cannot advance the
  record or consume a completion transition.

### Completion, Descendants, And Cleanup

- Recovery rereads the record before every status transition and rejects an
  older revision. A terminal record is not reopened by recovery, and a
  completed record cannot receive a duplicate completion transition.
- Completion still requires validation evidence, terminal descendants, and
  explicit accounting for every failed or cancelled descendant. Recovery may
  not close a parent while a descendant is active, blocked, awaiting approval,
  or otherwise non-terminal.
- After the durable checkpoint, observations, blocker or approval, result, and
  next action are saved, the host may remove only private transient runtime
  artifacts that are not required by the configured audit or recovery
  boundary. Component records, declared project artifacts, and evidence needed
  to recover or explain the attempt are retained.
- Task lifecycle has two intentional Git handoffs: the task-start commit
  records the selected backlog status and active task metadata/narrative; the
  second completion commit records the owning changelog summary, exact
  evidence-gated backlog-row removal, configured task-artifact cleanup, and
  declared durable result together. A task-deletion-only or backlog-clearance-
  only commit is not a valid completion state; interruption preserves or
  restores the unreconciled task/backlog pair and task artifacts for retry.

## State And Checkpoint Rules

- Every operation that changes durable state records `task.updated` and the
  relevant progress, result, blocker, decision, recovery, or next-action
  information before reporting the transition.
- Operations honor the task protocol transitions: `ready` to `active`, and
  from active to `blocked`, `awaiting-approval`, `completed`, `failed`, or
  `cancelled`; recoverable blocked, approval-waiting, and failed work may
  return to `active` through `recover` or an explicitly recorded resume.
- Completion requires validation evidence, terminal descendants, and explicit
  accounting for failed or cancelled descendants. No operation may turn a
  non-terminal task into `completed` based only on runtime exit.
- Budget observations are cumulative across attempts. Cost and wall-clock use
  are actual only when reported by the host; otherwise the record retains the
  unavailable source and does not claim automatic enforcement.
- Repeated checkpoints and runtime JobId aliases for one path/revision/attempt
  are reconciled as one observation. An unavailable value is not zero, and an
  incomplete cumulative summary is `unknown` with its source and unresolved
  observation preserved in the canonical `Changelog` section.
- The orchestrator treats a changed record revision as authoritative. An
  operation returning against an older revision must be discarded or reconciled
  through a new durable checkpoint rather than overwriting newer work.

## Boundary Of This Contract

This specification does not select a host adapter, define a CLI or wire
protocol, implement host scheduling or wake timing, choose a runtime process or
session model, or promise host cost attribution. Increment 5 maps this contract
to a selected host and validates the required non-blocking job capability;
without safe detachment or server-job submission, the adapter records a blocker
instead of claiming support. Increment 6 defines the host-neutral stale, retry,
budget, replacement, and cleanup policy above; future adapters may map it
without changing lifecycle authority. The accepted subprocess foundation is the
current repository mapping; the retired systemd flow is historical lineage only
and is not a supported fallback or recovery path.
