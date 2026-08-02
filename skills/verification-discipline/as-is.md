---
as-is-version: 1
task:
  status: completed
  worker: implementer
  updated: 2026-07-26T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  boundaries:
    files:
      - SKILL.md
      - as-is.md
    inputs:
      - ../../AGENTS.md
      - ../../agent-skills.md
      - ../../docs/component-task-record-protocol.md
      - ../../docs/design-principles.md
  external-effects: require-current-turn-user-approval
acceptance:
  - Add a discoverable verification-discipline skill with matching directory,
    front matter, and heading.
  - Define reusable evidence and residual-risk guidance without duplicating
    specialist procedures or changing files outside this component.
---

# Verification Discipline

## Purpose

Provide a reusable method for establishing whether a bounded task satisfies its
acceptance conditions using appropriate evidence.

## Requirement

Create the `verification-discipline` skill as a bounded self-hosting task. It
must direct agents to use task-specific checks, distinguish observation from
inference, and report residual risk.

## Plan

Inspect local skill conventions, create the single-purpose skill, and validate
its structure and discoverability boundary.

## Progress

Completed with no descendants. `SKILL.md` was added with matching front matter,
heading, evidence method, and risk-tier guidance; no outside file was changed.

## Validation

- Directory, `name` field, and heading match.
- The skill resides under the configured `skills/` path. A running host may
  require restart before loading newly added project skills; this is residual
  host context, not a structure defect.
- No external service was contacted and no outside component changed.

## Result

The reusable verification skill is structurally valid and records supported
claims with evidence and residual risk.

## Blockers And Escalations

None for the component. Host skill discovery is startup-cached and requires a
fresh process or restart.

## Recovery

`SKILL.md` and this completed record are retained; no cleanup or private runtime
artifact is required.

## Next Action

None within this component; await the next bounded assignment.
