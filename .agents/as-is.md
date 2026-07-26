---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-26T14:08:14Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add a discoverable OpenCode primary agent named `as-is` under `agents/`.
  - The agent routes substantive work through `orchestrator` and does not
    implement component-domain changes itself.
  - Keep artifacts within this component and validate local agent conventions.
---

# Primary Agent

## Purpose

Provide the user-facing entry point that routes substantive work through the
durable as-is orchestration model.

## Requirement

Add the bounded `as-is` primary-agent definition at `agents/as-is.md`, using the
local agent-definition convention and least required permissions.

## Plan

Inspect local definitions, add the primary agent, and run focused discovery and
whitespace checks before handoff.

## Progress

Completed with no child records. The definition delegates substantive work to
`orchestrator`, keeps web access denied, and leaves host-default integration to
the root.

## Validation

- Local front-matter comparison with `agents/implementer.md` and
  `agents/orchestrator.md` passed.
- A fresh `opencode agent list` discovered `as-is (primary)` with task
  delegation allowed and web access denied.
- Component whitespace and zero-descendant checks passed.

## Result

The discoverable `as-is` primary agent was added and is scoped to intent,
durable status, delegation, and synthesized results. Scoped handoff commit:
`ddd9227`.

## Blockers And Escalations

None. Residual risk: host-default selection requires a fresh process after root
integration.

## Recovery

The completed definition and validation are retained; no cleanup or recovery
artifact is required. Parent integration may consume this terminal handoff.

## Next Action

None within this component; a future root integration must validate host-default
selection in a fresh process.
