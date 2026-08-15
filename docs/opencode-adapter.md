# OpenCode Adapter

## Purpose

This host-specific document records how the current OpenCode dogfood adapter
maps the host-neutral as-is execution contract. It does not define orchestration
policy, task-record fields, authority, or completion behavior.

## Current Mapping

- OpenCode discovers agent skills from `.opencode/skills/<name>/SKILL.md` and
  compatible `.agents/skills/<name>/SKILL.md` locations.
- The installed wrapper currently recognizes `.agents/skills`; relative symlinks
  expose canonical repository skills without copying them.
- OpenCode agents may be primary or subagents with distinct prompts, models,
  permissions, and task-delegation permissions. The repaired topology is
  `as-is (primary)`, `orchestrator (subagent)`, and `implementer (subagent)`;
  `general` may remain an installed subagent but is not part of this handoff.
- The `as-is`, `orchestrator`, and `implementer` definitions under
  `.agents/agents/` map the user-facing entry, host-neutral orchestration, and
  component implementation roles. The OpenCode default agent is `as-is`.
- A host-managed OpenCode subagent is useful only when a detached supervisor or
  supported server job submits it without waiting for completion and exposes
  lifecycle, cancellation, process/session-health, and attributable-usage
  observations. The currently observed fallback is a foreground bounded
  top-level `opencode run` addressed only to the `as-is` primary; it is a
  synchronous invocation, not an asynchronous job boundary. Nested task
  mediation is still required to reach subagents.
- OpenCode 1.17.18 exposes a session-level `session.cost` and per-step
  `part.data.cost`, together with token counters, through its local SQLite
  database and JSON session export. This is a model/token-derived session
  charge reported by OpenCode, not provider billing. It can be attributed to a
  bounded child only when the session boundary is known; it must not be
  described as an invoice or billing observation.
- OpenCode 1.17.18 does not accept a subagent such as `implementer` as the
  top-level `opencode run --agent` target. It prints a warning and falls back
  to the default primary agent. The adapter must treat that as a delegation
  failure, not as configured-worker execution. Direct top-level
  `opencode run --agent implementer` is never a valid handoff.
- OpenCode configuration and skill discovery load at startup; validate changes
  in a fresh process or restart the host.

## Live Control Boundary

- A bounded `opencode run --format json` invocation is a one-run CLI request
  with emitted events. It is not a guaranteed live concurrent interaction
  channel for status queries, worker questions, cancellation, or parallel
  delegation. The default CLI must not be described as supporting parallel
  control yet.
- OpenCode server or SDK prompt, status, and event primitives are a possible
  future adapter mechanism for live control-plane interactions. They are not
  implemented or validated in this repository task and do not change the
  current bounded CLI mapping.
- Durable task records remain the source for status, questions, approvals,
  cancellation, and delegation. A CLI prompt, event stream, process exit, or
  direct private-worker message cannot replace a durable transition.

## Non-Blocking Job Capability Boundary

OpenCode sessions block while their nested subagents run. A foreground
`opencode run`, a task-tool call, or a subprocess started and awaited inside the
same synchronous OpenCode/as-is/orchestrator turn therefore remains synchronous;
wrapping the call does not make it asynchronous.

A valid non-blocking adapter must submit or spawn the worker attempt to a
supervisor-owned job or a supported OpenCode server job, receive a durable launch
checkpoint, and return the submitting turn before worker completion. The
supervisor/job must own the long-running worker and its process group, capture
logs and lifecycle events, persist state, and support later polling of durable
records plus process/session health and routed cancellation. A foreground child
that the submitting turn waits on is not an acceptable substitute.

OpenCode server mode is a possible transport or job-submission mechanism, not
proof that nested navigation, detached execution, job ownership, durable event
capture, polling, or asynchronous cancellation exists. The repository currently
has no validated evidence for those capabilities. Until fresh local capability
evidence establishes them, the adapter must record a durable host-capability
blocker and must not claim asynchronous support. Any future job must preserve the
`as-is -> orchestrator -> implementer` mediation and deliver the component's
`as-is.md` plus central read-only context, without silently substituting
`general` or `explore`.

## Supported Mediation Chain

The exact role mediation required for any supported OpenCode launch is:

1. The `as-is` primary receives the current request and must route it to the
   `orchestrator`; a host supervisor/job may start the enclosing OpenCode
   process, but the submitting turn must not wait for the worker job to finish.
2. The `as-is` primary must call the task tool with target `orchestrator`.
   `general` and `explore` are rejected fallback targets for this task.
3. The nested `orchestrator` subagent rereads the named component record and
   submits the worker attempt through the supervisor/job with its configured
   target `implementer`; it must return a durable launch checkpoint rather than
   waiting for worker completion.
4. The `implementer` subagent receives only the component record plus central
   read-only repository context, updates that component, and records its durable
   checkpoint and handoff in the supervisor-owned job.
5. A later orchestrator wake/check-in polls the child record and source-labelled
   supervisor/process/session health. The parent accepts completion only when
   the worker record, validation, terminal descendants, and scoped commit are
   present.

The mediation evidence must visibly identify the role at each edge. A task
event naming `general`, `explore`, or another role, a session graph without the
expected parent-linked roles, a direct subagent launch, or a missing worker
checkpoint is a durable delegation blocker. The adapter must not treat a
primary-agent fallback as success and must not retry speculatively.

## Fresh Discovery And Attribution

Run `opencode agent list` in a fresh process after changing definitions. The
required discovered entries are `as-is (primary)`, `orchestrator (subagent)`,
and `implementer (subagent)`. A running interactive process may retain startup
configuration and is not sufficient evidence of the new topology.

For a validation run, capture the machine-readable JSON task events before
cleanup, including each event's session ID, parent ID, task/subagent target,
agent name, model, and token-derived usage where present. Inspect the session
graph and OpenCode database/export before deleting private sessions:

- **Worker subtree:** the `implementer` session and any descendants linked by
  parent ID. This is the component-worker attribution boundary.
- **Orchestration overhead:** the top-level `as-is` session and the nested
  `orchestrator` session. These are reported separately and are not silently
  assigned to the implementer.
- **Task budget boundary:** the complete fresh invocation, including both
  worker subtree and orchestration overhead, is compared with the current-turn
  allocation so mediation overhead cannot disappear from budget accounting.

OpenCode 1.17.18 exposes session-level `session.cost` and per-step
`part.data.cost`, plus model and token counters, through the local SQLite
database and JSON session export. These are OpenCode model/token-derived
charges, not provider billing and not a call to a provider billing API. Record
the source and attribution boundary; never represent unavailable observations
as zero or as an estimate.

Process elapsed time is captured around the fresh `opencode run` by a parent
wrapper using a monotonic timer (`time.monotonic_ns()` or an equivalent host
monotonic clock). Session and message timestamps, and a non-monotonic shell
realtime delta, are not substitutes for this observation. The observed
monotonic duration is evidence for the attempt, but this adapter does not claim
automatic cumulative budget enforcement or implement Increment 6 retry,
backoff, stale-task, or worker-replacement policy.

This foreground timing observation describes the historical synchronous CLI
mapping only. A future non-blocking mapping must have the detached supervisor or
server job measure and persist the job lifetime while the submitting turn records
only its bounded submission/launch checkpoint; a wrapper that waits for the
foreground command is not asynchronous evidence.

## Increment 6 Recovery Mapping

The host-neutral recovery policy remains authoritative. The OpenCode mapping is
limited to these host observations and invocation rules:

- The orchestrator reads `task.updated` from the component record in a fresh
  process and compares it with the effective `checkInSeconds` using its current
  UTC observation clock. The record timestamp, configuration value, and clock
  source are retained as the stale decision evidence; a session timestamp is
  not substituted for `task.updated`.
- Each recovery attempt must be submitted to a validated supervisor-owned job or
  supported server job, reread the component record, and follow the
  `as-is -> orchestrator -> implementer` mediation chain. A fresh bounded
  `opencode run --format json --agent as-is --dir <project> <request>` is the
  currently observed foreground command, but it is only a synchronous evidence
  path and is not supported asynchronous recovery.
- A detached supervisor may stop an attempt at its authorized boundary and
  report process-group status and monotonic duration. A parent wrapper that
  waits on the foreground command is not a non-blocking launch. Exit status,
  timeout, absent session, or missing private state is never a completion
  transition. The orchestrator records the durable checkpoint and cumulative
  observations before deleting private OpenCode sessions or temporary exports.
- Backoff and the `maxRecoveryAttempts` bound are orchestrator policy recorded
  in the task record; this CLI mapping does not claim that OpenCode enforces
  either one automatically. OpenCode session costs remain model/token-derived
  observations, and unavailable measurements remain unavailable rather than
  being estimated.
- A task event naming `general`, `explore`, an unexpected role, or a direct
  top-level subagent fallback is an unavailable/wrong-role delegation blocker.
  A wrong-role fallback is not an approved replacement and cannot silently
  become one. A replacement requires the explicit durable direction or approval
  required by the host-neutral policy.
- Cleanup is limited to private OpenCode sessions, exports, prompts, and timing
  captures after durable evidence is saved. Component records, declared
  project artifacts, and evidence required for recovery or audit remain.

## Increment 5 Mapping

Increment 5 historically selected the foreground bounded `opencode run`
subprocess mapping. It exposes session-level model/token cost and process timing
observations, while the component record remains authoritative for lifecycle
state and completion, but it is not a non-blocking job boundary. The corrected
adapter requires a supervisor-owned detached job or supported server job that
returns a launch checkpoint before worker completion; no such capability is
validated here. The historical direct-subagent and wrong-role mediation attempts
below remain blocked evidence; the role topology and supported mediation chain
are validated only by the fresh root `as-is.json` `task` metadata and its configured Markdown task narrative.

| Contract operation | OpenCode mapping | Durable requirement |
| --- | --- | --- |
| `launch` | No supported non-blocking mapping is established. A foreground `opencode run` is synchronous; a future supervisor/server job may submit it and preserve `as-is -> orchestrator -> implementer` | Create the child record in `ready`, write a durable launch checkpoint before returning, then require job ownership, task events, and parent-linked sessions naming `orchestrator` and `implementer`; a fallback, `general`, or `explore` task is not a valid handoff. |
| `resume` | Submit a fresh attempt through the same validated supervisor/server job; a fresh bounded foreground `opencode run` is historical evidence only | Reread the component record; do not depend on a prior session or replay a private prompt. |
| `observe` | Read root and component `as-is.md` context plus local `as-is.json` `task` metadata and configured task narrative, then poll supervisor/job and process/session health; CLI output is supplementary and source-labelled | Report status, checkpoint, budget, blockers, and next action from durable task artifacts; keep health observations separate. |
| `question` | Record the question or approval requirement before presenting it; a CLI prompt is not authoritative | Keep the record `blocked` or `awaiting-approval` until a durable answer exists. |
| `cancel` | Record the user-authorized cancellation and checkpoint, then ask the supervisor/job to stop the process group; the foreground CLI has no validated non-blocking mapping | A process stop alone cannot create a cancelled task; later observation confirms termination. |
| `recover` | Reread the configured worker and submit a fresh attempt through the validated supervisor/server job; otherwise record a capability blocker | Preserve remaining budget, descendants, and acceptance conditions; no role replacement or silent stale-task inference is permitted. |

For the historical dogfood run, the orchestrator created
`validation-fixtures/increment-5-dogfood/as-is.md` atomically, emitted the delegation notification
through the durable parent transition, and used the configured 120-second /
USD 0.10 child allocation with reserve. The worker completed the local README
task and recorded a check-in, validation, result, unavailable cost and
wall-clock observations, and cleanup. The parent reread the child record before
accepting completion and deleted the two private OpenCode session records after
the handoff; the child record and README were retained.

The historical CLI session output exposed internal usage metadata for the
overall run, but the child record retained unavailable measurements. This
adapter does not implement Increment 6 stale-task detection, retry/backoff, or
worker replacement.

## Measurement Follow-up

The installed OpenCode package is version `1.17.18`. The local machine-readable
surfaces are:

- `opencode run --format json`, which emits session events but does not itself
  provide a process elapsed-time field.
- `opencode export <sessionID>`, which exports session and per-step cost,
  token, and message timestamp data.
- `opencode db`, whose `session` table exposes `cost`, token counters, agent,
  model, `time_created`, and `time_updated`; its `part` table exposes per-step
  `cost`, token, and step timing data.

The bounded follow-up observed a session cost of `0.0262488` USD, matching the
sum of 12 `step-finish` part costs, and a parent shell realtime nanosecond
subprocess measurement of `21.915` seconds. The latter is the adapter's
elapsed wall-clock observation; `time_created`, `time_updated`, and message
timestamps remain session/message timestamps and are not substituted for it.
The shell delta was not monotonic, so it is evidence of observed elapsed
wall-clock only and is not sufficient for automatic budget enforcement. The
cost is model/token-derived OpenCode accounting, not provider billing. These
measurements describe a foreground historical run and do not establish that an
OpenCode/as-is/orchestrator turn can submit a detached job and return before
worker completion.

The same run also demonstrated the current delegation limitation: requesting
`--agent implementer` emitted the CLI warning that `implementer` is a subagent
and fell back to the default `as-is` primary agent. The follow-up component is
therefore blocked rather than marked completed. A primary-agent mediation path
must be separately validated before this adapter claims configured-worker
dogfood completion or automatic budget enforcement.

## Mediated Recovery Attempt

One explicitly approved recovery attempt invoked the `as-is` primary and asked
it to route the component through `orchestrator` to `implementer`. OpenCode
created an `as-is` session with a parent-linked `general` task session; the
machine-readable task event recorded `subagent_type: general`, not
`orchestrator`. No session in the attempt window had agent `orchestrator` or
`implementer`, and no durable implementer checkpoint or completion was
produced. The process timed out with status `124` after `60.079` seconds from a
monotonic timer.

The attempt's four session cost fields totalled `0.0718991` USD, and the
cumulative task observation became `0.0981479` USD including the prior
`0.0262488` USD. These remain OpenCode model/token-derived session charges, not
provider billing. The attempt consumed the reserved budget and did not
establish a supported mediation mapping. No retry or automatic budget
enforcement is claimed.

## Boundaries

- Host permissions and sandboxing are adapter mechanisms, not replacements for
  deterministic core constraint validation.
- Worktrees isolate branch checkouts and uncommitted changes but are not a full
  filesystem or context-security boundary.
- The adapter must report unsupported lifecycle or measurement capabilities to
  the orchestrator rather than silently weakening a task constraint.
