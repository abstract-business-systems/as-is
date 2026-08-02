---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.0525789
    reserve: 0.04
    source: sum of OpenCode session.cost values for the complete fresh mediated invocation (model-token-derived; not provider billing)
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 50.502114668
      reserve-seconds: 30
      source: parent monotonic timer around the complete fresh mediated invocation (includes orchestration overhead; not automatic cumulative enforcement)
  external-effects: prohibited
acceptance:
  - Add a harmless local README identifying this directory as an OpenCode
    mediation validation fixture.
  - Keep changes inside this component and do not create runtime state.
  - Record validation and host observations only when directly available.
---

# OpenCode Mediation Dogfood

## Purpose

Provide a fresh harmless child component proving that explicit primary-agent
mediation reaches the configured implementer.

## Requirement

Add the local README fixture, work only within this component, and leave parent
integration to the orchestrator.

## Plan

Add the README, validate the fixture and durable handoff, and retain source
labels and measurement limitations.

## Progress

Completed with no descendants. The supported chain
`as-is -> orchestrator -> implementer` reached the worker and the parent
reconciled the complete invocation before private cleanup.

## Validation

- Machine-readable role evidence identified `orchestrator` and a parent-linked
  `implementer`; no `general` or `explore` mediation occurred.
- README content and staged/unstaged whitespace checks passed.
- OpenCode model/token-derived cost was `0.0525789` USD and the parent monotonic
  duration was `50.502114668` seconds. These are not provider billing or
  automatic cumulative budget enforcement.
- This component has no descendants and its worker handoff is terminal.

## Result

The README was added and the configured mediation path completed the harmless
child handoff. Worker commit: `2e9d4fd`; parent reconciliation: `c4f0181`.

## Blockers And Escalations

None for this completed validation. The adapter's measurement and enforcement
limitations remain documented in `docs/opencode-adapter.md`.

## Recovery

The durable record and README remain after role, cost, and timing evidence was
captured. Private host state was cleaned; no recovery artifact is required.

## Next Action

None; the component is terminal.
