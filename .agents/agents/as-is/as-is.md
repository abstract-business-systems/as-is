---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-07-29T18:35:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.35
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Keep `model: small` in `.agents/agents/as-is/agent.md` front-matter so the
    as-is role runs on the root-configured small preset by default.
  - Add orientation-script guidance to `.agents/agents/as-is/agent.md`: for any
    status or routing turn that needs repository state, run
    `bun skills/as-is/scripts/orient.ts` once and synthesize/relay from that
    snapshot instead of performing multiple sequential record reads; this
    collapses the multi-read orientation that caused the 18s "what's next"
    latency.
  - Keep the direct-path budget rule intact (at most one read, one command,
    current-session summarization, in-context relay, or clarify/acknowledge
    for a direct reply; otherwise delegate). The `orient.ts` call is the one
    command a status turn spends before synthesizing — it does not widen the
    budget.
  - Keep the existing boundary clauses (use only component-builder for
    delegation; never substitute general or explore; do not implement
    component-domain changes; never create task-archives/; commit completed
    work; on incomplete work leave it uncommitted and report).
  - Do not add intent-classification heuristics; the orient.ts call is a
    mechanical one-command orientation, not a complexity predictor.
  - Validate with `opencode agent list` (as-is still discovered, front-matter
    valid with `model:`), `bun build` of any touched script, and
    `git diff --check`; record residual risk in this record.
---

# as-is Agent Fast Path: Orientation Snapshot And Fast Model

## Purpose

The user-facing as-is router must stay cheap per turn in a multi-hour session.
A "what's next" status query took ~18s because as-is re-derived repository
state through five-to-seven sequential record reads, and its contract did not
mention the orientation snapshot script that already returns that state in
~50ms. This task wires the small model preset and one-call snapshot into the
as-is contract.

## Requirement

Edit `.agents/agents/as-is/agent.md` to (1) pin the root-configured `small`
preset in the front-matter, and (2) direct as-is to run `skills/as-is/scripts/orient.ts`
once for status/orientation turns and synthesize from its snapshot, instead of
multi-read orientation. The model alias resolves through the launcher's
config-driven resolution (see `skills/spawning-pi-subagents/as-is.md`).

## Plan

1. Keep `model: small` in the as-is agent front-matter (after `mode: primary`);
    the launcher resolves it using the root `as-is.md` model map.
2. Add a short orientation clause to the contract body: for a turn that needs
    repository state (status, next-open-task, routing context), run
    `bun skills/as-is/scripts/orient.ts` once and synthesize/relay from its
    JSON snapshot; do not perform multiple sequential reads of root/component
    records, the change log, and specs to assemble the same picture by hand.
3. State that the `orient.ts` call is the single command a status turn spends
    within the direct-path budget; it does not widen the budget or replace
    delegation for substantive work.
4. Preserve the direct-path budget rule and all boundary clauses; do not add
    intent-classification heuristics.

Keep the contract short. The orientation clause is a mechanical one-command
shortcut, not a complexity predictor.

## Progress

Activated the task record and updated `.agents/agents/as-is/agent.md` with the
`small` model preset and one-command orientation snapshot guidance. No child
work was delegated because this record permits zero children.

## Validation

- `.agents/agents/as-is/agent.md` front-matter contains `model: small`.
- The contract body contains the orientation-script clause naming
  `skills/as-is/scripts/orient.ts`.
- The direct-path budget rule and boundary clauses remain; no
  intent-classification heuristics were added.
- `opencode agent list` discovers `as-is (primary)` with the new front-matter.
- `opencode agent list` passed and discovered `as-is (primary)` with valid
  front-matter including `model: small`.
- Bare `bun build` was attempted but correctly reported that this repository
  has no default entrypoint. The touched artifact is Markdown, so no script
  build was applicable; the repository orientation script was independently
  runnable during orientation.
- `git diff --check` passed.
- Host-observed wall-clock use: approximately 45 seconds; host-reported cost
  unavailable.

Residual risk: the `mini` alias depends on the launcher's config-driven
resolution at runtime, and orientation synthesis is only as fresh as the
records and Git facts returned by the snapshot script.

## Result

Completed the as-is fast path contract update: `model: small` is pinned in the
role front-matter, and status/routing turns use one orientation snapshot command
without widening the direct-path budget or changing existing boundaries.

## Blockers And Escalations

Depends on `skills/spawning-pi-subagents/as-is.md` for alias resolution. If the
launcher task has not landed, the `mini` pin is a no-op (passed literally) until
it does; implement the orientation clause regardless (it works independently of
the model). Residual risk: the orientation snapshot is only as current as the
durable records and git facts it reads; a stale or non-completed record surface
could mislead synthesis, but this is bounded by the snapshot's own sources.

## Recovery

Recover from this record, the as-is agent file at
`.agents/agents/as-is/agent.md`, and the orientation script at
`skills/as-is/scripts/orient.ts`. If interrupted, reread this record before
resuming; do not re-create `task-archives/`.

## Next Action

Commit the completed scoped handoff. Future runtime behavior continues to
depend on the launcher's config-driven `mini` alias resolution.
