---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-07-29T17:35:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 2
    maximum-children: 8
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Trim the as-is agent contract so a status or routing turn does not perform
    multi-source orientation itself; remove the "read and summarize relevant
    root/component as-is.md status, recover historical committed facts from Git"
    clauses that induced five-to-seven sequential read turns before delegation.
  - Replace them with a direct-path budget rule: as-is answers directly only when
    the work fits within one read, one command, current-session summarization, a
    relay of a result already in context, or a clarify/acknowledge reply; any
    need for more than one read, more than one command, or synthesis across
    multiple sources delegates immediately to component-builder.
  - Preserve delegate-by-default as the operational posture for multi-hour
    sessions, so per-turn reasoning tokens do not accumulate in as-is's context;
    records are durable memory and the conversation is ephemeral routing.
  - Keep the existing boundary clauses (use only component-builder for
    delegation; never substitute general or explore; do not implement
    component-domain changes; never create task-archives/).
  - Do not add intent-classification or complexity-prediction logic that itself
    requires reasoning; the budget is a stop condition, not a predictor.
---

# as-is Agent Contract

## Purpose

The user-facing entry point that routes intent through durable as-is
orchestration. In a multi-hour session as-is must stay cheap per turn: it holds
durable records as memory and treats the conversation as ephemeral routing, so
per-turn reasoning tokens do not compound and bloat the main session.

## Requirement

Trim and refocus `.agents/agents/as-is/agent.md` so a status or routing turn
does not perform multi-source orientation itself. as-is delegates substantive or
multi-source work to `component-builder` and answers directly only within a
strict direct-path budget. This removes the startup latency observed when as-is
read five-to-seven records before it could answer "what is the next open task".

## Plan

Edit `.agents/agents/as-is/agent.md`:

1. Remove the "read and summarize relevant current root/component as-is.md
   status concisely, recover historical committed facts from Git and concise
   change-log.md entries, and synthesize results for the user" sentence and any
   clauses that instruct multi-record orientation by as-is itself.
2. Add the direct-path budget rule as a short, concrete list: direct only when
   the reply needs at most one read, one command, current-session
   summarization, a relay of an in-context result, or a clarify/acknowledge.
   State the ceiling: anything needing more than one read, more than one
   command, or synthesis across multiple sources delegates immediately.
3. State delegate-by-default as the posture for multi-hour sessions, with
   records as durable memory and conversation as ephemeral routing.
4. Preserve the existing boundary clauses (component-builder only; no general
   or explore substitution; no component-domain self-implementation; no
   task-archives/).

Keep the contract short. Do not add intent-classification heuristics; the
budget is a stop condition the agent checks after attempting a direct answer,
not a predictor it must evaluate before acting.

## Progress

Contract edits applied directly (not delegated): the multi-read orientation
clauses were replaced with the direct-path budget rule and the
delegate-by-default posture; the commit-on-complete / preserve-on-incomplete
line was added for as-is's direct-work slice. The duplicated front-matter
fragment from the directory-layout migration was fixed.

## Validation

- The contract file contains the direct-path budget list and the
  delegate-by-default posture.
- The multi-read orientation clauses are absent.
- The existing boundary clauses remain.
- `opencode agent list` discovers `as-is (primary)` after the edit.
- The agent file front-matter is valid (name, mode, permission) with no
  duplicated fragment.

## Result

The as-is agent contract now biases hard to delegation with a strict
budget-gated direct path, preventing the multi-read startup latency and
session bloat. Completed directly.

## Blockers And Escalations

None. Residual risk: a pure-router as-is (even status queries delegate) was
considered and rejected in favor of the budget rule, because the budget
preserves a narrow direct path for trivial one-liners without reintroducing
intent-detection bloat. The budget is a ceiling, not a predictor, so wrong-way
cost is bounded to at most one read or one command of tokens.

## Recovery

Recover from this record, the as-is agent file at
`.agents/agents/as-is/agent.md`, and the alignment captured in
`change-log.md`. The contract direction is self-contained in this record; no
private runtime state is required.

## Next Action

None within this component; the contract edits are complete.
