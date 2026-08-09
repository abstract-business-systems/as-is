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
The remaining safe successor boundary is a bounded extension operation that
preserves that single-process invariant, atomically checks shared parent budget
and reserve, cumulatively updates the component allocation, and reactivates one
continuation. Mutating allocation without those checks would create an unsafe
budget authority, so the extension contract remains a separate bounded
successor task rather than being simulated here.

## Validation

Passed:

- `bun test components/observability/tracer.test.ts components/observability/lifecycle-hierarchy.test.ts` — 9 passed, 46 expectations.
- `bun test components/control-plane/control-plane.test.ts` — 5 passed, 31 expectations.
- `git diff --check` passed before the intermediate commit.
- The append-only test confirms that a later event preserves the exact bytes of
  the existing prefix.

Not yet run: final repository-wide checks and historical trace byte comparison.

## Result

Not yet available.

## Blockers And Escalations

The budget-extension runtime remains blocked for this task by missing durable
attempt/lease and parent-ceiling semantics. Do not add allocation mutation or
claim extension enforcement without those authority records. Preserve the
simplified reviewer flow as a successor task in the control-plane backlog.

## Recovery

Recover from this record, the temporary handoff, the observability component records,
and the control-plane tests. Keep any intermediate commits scoped and do not amend them.

## Next Action

Implement the guidance and trace-safety slice, then assess the smallest safe control-plane
extension seam.
