---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0
    reserve: 0.02
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 60
      spent-seconds: 0
      reserve-seconds: 10
      source: host-reported
  external-effects: prohibited
acceptance:
  - Shared budget arithmetic remains source-qualified and does not become budget authority.
---
# Budget Arithmetic

## Purpose

Provide the smallest shared arithmetic seam for durable parent admission and
runtime budget exhaustion checks.

## Boundary

Task records and the control plane remain budget authority. This component does
not store allocations, approve extensions, or enforce monetary cost. Unknown
provider observations remain unavailable/unknown.

## Validation

See `budget.test.ts` and the consuming control-plane and supervisor tests.
