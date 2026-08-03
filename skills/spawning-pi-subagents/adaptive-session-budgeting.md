# Adaptive Session Budgeting

## Status

Proposed design linked from the `adaptive-session-budgeting` item in
[`backlog.md`](backlog.md). This document records the design discussion and
constraints; it does not authorize implementation.

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
