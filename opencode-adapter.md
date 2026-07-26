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
- A host-managed OpenCode subagent is preferable when it exposes lifecycle,
  cancellation, and attributable-usage observations. The current fallback is
  a bounded top-level `opencode run` addressed only to the `as-is` primary;
  nested task mediation is required to reach subagents.
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

## Supported Mediation Chain

The exact OpenCode launch and mediation chain for this repository is:

1. Start a fresh process with `opencode run --format json --agent as-is
   --dir <project> <request>`.
2. The `as-is` primary must call the task tool with target `orchestrator`.
   `general` and `explore` are rejected fallback targets for this task.
3. The nested `orchestrator` subagent rereads the named component record and
   calls the task tool with its configured target `implementer`.
4. The `implementer` subagent receives only the component record plus central
   read-only repository context, updates that component, and returns its
   durable checkpoint and handoff.
5. The parent process rereads the child record and accepts completion only when
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

## Increment 6 Recovery Mapping

The host-neutral recovery policy remains authoritative. The OpenCode mapping is
limited to these host observations and invocation rules:

- The orchestrator reads `task.updated` from the component record in a fresh
  process and compares it with the effective `checkInSeconds` using its current
  UTC observation clock. The record timestamp, configuration value, and clock
  source are retained as the stale decision evidence; a session timestamp is
  not substituted for `task.updated`.
- Each recovery attempt uses a fresh bounded
  `opencode run --format json --agent as-is --dir <project> <request>` and
  follows the supported `as-is -> orchestrator -> implementer` mediation chain.
  It rereads the component record rather than replaying a private prompt or
  requiring a prior OpenCode session.
- A parent wrapper may stop an attempt at its authorized boundary and report
  the process status and monotonic duration. Exit status, timeout, absent
  session, or missing private state is never a completion transition. The
  orchestrator records the durable checkpoint and cumulative observations
  before deleting private OpenCode sessions or temporary exports.
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

Increment 5 selected the bounded `opencode run` subprocess fallback. The host
exposes session-level model/token cost and process timing observations, while
the component record remains authoritative for lifecycle state and completion.
The historical direct-subagent and wrong-role mediation attempts below remain
blocked evidence; the new topology and supported mediation chain are validated
only by the fresh task recorded in the current root `as-is.md`.

| Contract operation | OpenCode mapping | Durable requirement |
| --- | --- | --- |
| `launch` | `opencode run --format json --agent as-is --dir <project> <request>`, then `as-is -> orchestrator -> implementer`; a direct subagent target is rejected/falls back to the default primary | Create the child record in `ready`, notify delegation, then require task events and parent-linked sessions naming `orchestrator` and `implementer`; a fallback, `general`, or `explore` task is not a valid handoff. |
| `resume` | A fresh bounded `opencode run` with the reread component record | Do not depend on a prior session or replay a private prompt. |
| `observe` | Read root and component `as-is.md`; CLI output is supplementary and source-labelled | Report status, checkpoint, budget, blockers, and next action from durable records only. |
| `question` | Record the question or approval requirement before presenting it; a CLI prompt is not authoritative | Keep the record `blocked` or `awaiting-approval` until a durable answer exists. |
| `cancel` | Record the user-authorized cancellation and checkpoint, then stop the subprocess if still running | A process stop alone cannot create a cancelled task. |
| `recover` | Reread the configured worker and delegate a fresh bounded `opencode run` | Preserve remaining budget, descendants, and acceptance conditions; no replacement or stale-task policy is introduced here. |

For the historical dogfood run, the orchestrator created
`increment-5-dogfood/as-is.md` atomically, emitted the delegation notification
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
cost is model/token-derived OpenCode accounting, not provider billing.

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
