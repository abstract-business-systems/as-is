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
  permissions, and task-delegation permissions.
- The `as-is`, `orchestrator`, and `implementer` definitions under
  `.agents/agents/` map the user-facing entry, host-neutral orchestration, and
  component implementation roles. The OpenCode default agent is `as-is`; it
  routes substantive work to `orchestrator`.
- A host-managed OpenCode subagent is preferable when it exposes lifecycle,
  cancellation, and attributable-usage observations. A bounded `opencode run`
  process is the current fallback.
- The current CLI does not expose reliable per-component actual cost. A task
  record must name the unavailable measurement rather than present an estimate
  as actual cost.
- OpenCode configuration and skill discovery load at startup; validate changes
  in a fresh process or restart the host.

## Increment 5 Mapping

Increment 5 selects the bounded `opencode run` subprocess fallback. The current
host does not expose the lifecycle and attributable-usage observations required
for a host-managed child worker, so this mapping reports those observations as
unavailable and keeps the component record authoritative.

| Contract operation | OpenCode mapping | Durable requirement |
| --- | --- | --- |
| `launch` | `opencode run --agent <worker> --dir <project> <request>` | Create the child record in `ready`, notify delegation, then require the worker to checkpoint `active`. |
| `resume` | A fresh bounded `opencode run` with the reread component record | Do not depend on a prior session or replay a private prompt. |
| `observe` | Read root and component `as-is.md`; CLI output is supplementary and source-labelled | Report status, checkpoint, budget, blockers, and next action from durable records only. |
| `question` | Record the question or approval requirement before presenting it; a CLI prompt is not authoritative | Keep the record `blocked` or `awaiting-approval` until a durable answer exists. |
| `cancel` | Record the user-authorized cancellation and checkpoint, then stop the subprocess if still running | A process stop alone cannot create a cancelled task. |
| `recover` | Reread the configured worker and delegate a fresh bounded `opencode run` | Preserve remaining budget, descendants, and acceptance conditions; no replacement or stale-task policy is introduced here. |

For the dogfood run, the orchestrator created
`increment-5-dogfood/as-is.md` atomically, emitted the delegation notification
through the durable parent transition, and used the configured 120-second /
USD 0.10 child allocation with reserve. The worker completed the local README
task and recorded a check-in, validation, result, unavailable cost and
wall-clock observations, and cleanup. The parent reread the child record before
accepting completion and deleted the two private OpenCode session records after
the handoff; the child record and README were retained.

The CLI's session output exposed internal usage metadata for the overall run,
but not reliable per-component actual cost or host-observed elapsed time. The
child record therefore retains `source: unavailable` and does not convert that
metadata into actual component measurements. This adapter does not implement
Increment 6 stale-task detection, retry/backoff, or worker replacement.

## Boundaries

- Host permissions and sandboxing are adapter mechanisms, not replacements for
  deterministic core constraint validation.
- Worktrees isolate branch checkouts and uncommitted changes but are not a full
  filesystem or context-security boundary.
- The adapter must report unsupported lifecycle or measurement capabilities to
  the orchestrator rather than silently weakening a task constraint.
