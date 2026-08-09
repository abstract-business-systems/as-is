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

Task record created before implementation. No historical trace file is to be edited.

## Validation

Not yet run.

## Result

Not yet available.

## Blockers And Escalations

None.

## Recovery

Recover from this record, the temporary handoff, the observability component records,
and the control-plane tests. Keep any intermediate commits scoped and do not amend them.

## Next Action

Implement the guidance and trace-safety slice, then assess the smallest safe control-plane
extension seam.
