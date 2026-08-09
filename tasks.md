---
as-is-version: 2
task:
  status: active
  worker: as-is
  updated: 2026-08-12T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0
    reserve: 0.10
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Implement the bounded, non-authoritative append-only trace safety behavior and focused tests without modifying historical traces.
  - Add explicit repository agent guidance to prefer the smallest working, understandable solution and justify material complexity.
  - Implement a minimal durable budget-extension request/review/authorization seam or record the concrete blocker if a safe runtime continuation cannot be added within scope.
  - Preserve task-record authority, trace privacy, and existing component boundaries.
---
# Implement bounded trace safety, extension review, and simplicity guidance

## Purpose

Implement the smallest working slice described by `temp/trace-budget-extension-handoff.md`.

## Requirement

Keep traces supplementary and append-only, add explicit proportionate-solution guidance,
and provide a bounded extension-review seam without allowing telemetry or a reviewer
to grant budget directly.

## Plan

1. Add/clarify root agent guidance and observability policy.
2. Add focused append-only and failure-isolation tests.
3. Inspect the control-plane owner and implement only a minimal durable extension request
   and deterministic authorization seam if it can be done without a new parallel budget
   authority.
4. Validate focused tests, build/type checks, diff hygiene, and historical trace bytes.

## Progress

Intermediate commit `fe2b643` added repository guidance favoring the smallest
working understandable solution, documented the observability trace-safety
boundary, and added an append-prefix regression test. No historical trace file
was edited.

The budget-extension workflow was inspected against the existing control-plane
owner. The intended initial model assumes that at most one process works on a
given component at a time; separate components may run in parallel. A separate
attempt/lease hierarchy is therefore not required for the first implementation.
The remaining safe successor boundary was implemented in
`components/control-plane/control-plane.ts`: `extend()` accepts a bounded
review recommendation, rejects non-approval decisions without reactivation,
atomically locks the parent and component records, checks cumulative cost and
wall-clock allocation against the parent reserve, records the decision in the
parent and component records, updates the component allocation, and reactivates
one continuation. The control plane rejects root extensions because there is no
parent ceiling for them. The operation preserves the one-process-per-component
model; separate components can still compete through the parent admission
check.

## Validation

Passed:

- `bun test components/control-plane/control-plane.test.ts` — 7 passed, 40 expectations, including approval within reserve and reserve rejection.
- `bun test components/observability/tracer.test.ts components/observability/lifecycle-hierarchy.test.ts` — 9 passed, 46 expectations.
- `bun build components/control-plane/control-plane.ts --target bun --outfile /tmp/as-is-control-plane-build.js` — successful.
- `git diff --check` — passed.
- `bun test components/budget-control/budget.test.ts components/control-plane/control-plane.test.ts components/subprocess-execution-foundation/supervisor.test.ts` — 23 passed, 175 expectations.
- `bun build components/budget-control/budget.ts --target bun --outfile /tmp/as-is-budget-build.js` — successful.
- `bun test components/budget-control/budget.test.ts components/control-plane/control-plane.test.ts components/subprocess-execution-foundation/supervisor.test.ts skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` — 52 passed, 387 expectations.
- `bun build .pi/extensions/worker-tools.ts --target bun --outfile /tmp/as-is-worker-tools-build.js` — successful.
- `bun build skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts --target bun --outfile /tmp/as-is-launcher-build.js` — successful.

- `bun test components/observability/tracer.test.ts components/observability/lifecycle-hierarchy.test.ts` — 9 passed, 46 expectations.
- `bun test components/control-plane/control-plane.test.ts` — 5 passed, 31 expectations.
- `git diff --check` passed before the intermediate commit.
- The append-only test confirms that a later event preserves the exact bytes of
  the existing prefix.

Not yet run: final repository-wide checks and historical trace byte comparison.

## Result

Not yet available.

## Blockers And Escalations

The minimal extension path is implemented. A first consolidation slice now
lives in `components/budget-control/budget.ts`: shared remaining-budget,
exhaustion, and admission arithmetic is used by both control-plane delegation/
extension and supervisor exhaustion checks. It is an arithmetic helper only;
task records remain authoritative and unknown provider cost remains unknown.

The launcher now imports the same bounded-limit helper at the supervisor timer
boundary, and in-process `call_subagent` now caps requested timeouts by the
component record's remaining wall-clock allocation after reserve. Calls below
the 1-second minimum are rejected rather than silently consuming an exhausted
budget. The launcher still receives explicit effective limits from its caller;
record-to-launcher budget loading is not yet automatic.

Residual risk: the directory lock
is a small-process lock and reports busy rather than waiting; it protects the
parent/component update pair only when all writers use this control-plane path.
Provider monetary cost remains unavailable and is not hard-enforced. Root tasks
cannot request an extension through this child-budget operation.

## Recovery

Recover from this record, the temporary handoff, the observability component records,
and the control-plane tests. Keep any intermediate commits scoped and do not amend them.

## Next Action

Implement the guidance and trace-safety slice, then assess the smallest safe control-plane
extension seam.
