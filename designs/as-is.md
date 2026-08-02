---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Group the repository's independent design documents under `designs/` when justified.
  - Preserve discoverable entry points and update references.
  - State that relevant designs move into built components and link from their records.
---

# Designs

## Purpose
Provide a discoverable component for enduring architecture, protocol, and
execution design documents.

## Requirement
Resolve the independent-delegation design's remaining budget-holder decision.
The per-child detached supervisor is authoritative for wall-clock enforcement
and budget-stop ownership; update the subject design and any directly stale
design cross-references without implementing runtime behavior. Preserve the
design component's grouping and authority rules.

## Plan
1. Inspect the independent-delegation open decision and related execution
   design language.
2. Resolve budget ownership in the subject design and remove contradictory
   open-decision wording.
3. Validate references and whitespace, then commit the bounded design handoff.

## Progress
The independent-delegation specification already describes a per-child
supervisor as the recommended budget holder and the execution-foundation
component records detached supervisor budget observations. The remaining work
is to promote that recommendation to the authoritative design decision and
ensure the grouped design entry point records the resolution.

## Validation
Focused design-reference searches found no active `as-is -> orchestrator ->
implementer` chain in the grouped designs after updating the remaining
orchestration reference. `git diff --check` passed. No runtime files or sibling
component records are changed.

## Result
The per-child detached supervisor is the authoritative budget holder for
independent delegation. The prior open decision is closed, with cost
self-limiting explicitly retained as a host-observability limitation.

## Blockers And Escalations
None. Residual risk is limited to historical prose that may require canonical
terminology updates.

## Recovery
Use this record and the moved design documents. A design that becomes part of a
built component should be relocated only through a bounded maintenance record.

## Links
- `execution-accounting-design.md` — execution accounting design.
- `orchestration-design.md` — orchestration design.
- `independent-delegation.md` — independent delegation design.

## Next Action
None within this component; the resolved design is ready for root integration.

## Changelog

- 2026-08-02: merged the completed execution-accounting design task into this
  design-component record; the design remains under `designs/` until its
  implementation is authorized.
- 2026-07-30: resolved independent delegation's budget holder as the per-child
  detached supervisor; retained child self-limiting for unobservable provider
  cost.

## Accounting Design Task History

The completed execution-accounting design task was previously recorded at
`execution-accounting-design/as-is.md`. Its task-specific acceptance and
validation evidence is preserved here as historical component context; the
permanent design remains authoritative at
`execution-accounting-design.md`.

### Purpose

Define durable accounting identity, runtime JobId diagnostic handling, resource
attribution, parent/child ownership, retry/recovery reconciliation, and the
fixture matrix required before implementation.

### Acceptance and evidence

- Defined `component-path/task-revision/attempt` as durable observation identity
  and removed runtime JobId authority from current task context.
- Defined private supervisor JobId-map persistence, restart reconciliation,
  expiry, component-path status, and diagnostic-only JobId behavior.
- Defined cost, wall-clock, build/failure, parent/child, retry/recovery, and
  full-invocation versus worker-subtree ownership.
- Preserved the OpenCode adapter/generic supervisor separation and retired
  systemd lineage without modifying runtime implementation.
- Recorded design fixtures for two attempts, retry/recovery, unavailable money,
  measured time, parent/child delegation, build outcomes, overlapping
  attribution boundaries, and JobId-map restart.
- Validation passed the task-record validator, focused supervisor and
  control-plane tests, reference checks, and `git diff --check`. Historical
  measured values remained source-labelled; unavailable values were not
  converted to zero.

The task was design-only. Future implementation must create a new bounded task
under the responsible component and must not infer implementation completion
from this historical design record.
