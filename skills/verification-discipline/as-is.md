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
      - ../../component-task-record-protocol.md
      - ../../design-principles.md
  external-effects: require-current-turn-user-approval
acceptance:
  - Add a discoverable verification-discipline skill with matching directory,
    front matter, and heading.
  - Define a reusable method for selecting task-specific checks, collecting
    evidence, and recording supported completion claims and residual risk.
  - Do not duplicate specialist test procedures or change files outside this
    component.
---

# Verification Discipline

## Purpose

Provide the reusable cross-cutting method that lets agents establish whether a
bounded task satisfies its acceptance conditions using appropriate evidence.

## Requirement

Create the `verification-discipline` skill as a bounded self-hosting dogfood
task. It must direct agents to use task-specific tools, distinguish observation
from inference, and report supported completion claims with residual risk.

## Plan

1. Inspect the declared inputs and nearby skill conventions.
2. Create `SKILL.md` with one primary verification responsibility.
3. Validate the skill's discoverability and record the outcome.

## Progress

- Advanced task record from `ready` to `active`.
- Created `SKILL.md` with front matter (`name: verification-discipline`,
  `description: ...`), heading `# Verification Discipline`, and a reusable
  method for selecting task-specific checks, collecting evidence, and recording
  supported completion claims and residual risk.
- Did not duplicate specialist test procedures or modify files outside this
  component.

## Validation

- Structural check: directory `verification-discipline/` matches front matter
  `name` field — PASS.
- Structural check: heading `# Verification Discipline` matches skill name —
  PASS.
- Discoverability check: `SKILL.md` resides in the `skills/` directory
  configured via `.opencode/opencode.json` `skills.paths: ["skills"]`. The
  running opencode session has cached global paths
  (`/shared/store/ai-scaffold/skills`, `.agents/skills`) and does not yet list
  the skill; a host restart is required to load the project `skills` path.
  This is a runtime caching limitation, not a skill structure defect.
- No external services contacted; no files outside this component changed.

## Result

- `SKILL.md` created and structurally validated against the OpenCode skill
  loader conventions (directory, front matter, heading). The skill defines a
  reusable verification method with risk tiers, evidence recording guidance,
  and quality checks. Acceptance conditions 1 and 2 are satisfied. Condition 3
  (no duplication, no external changes) is satisfied by construction.

## Blockers And Escalations

- Per-component cost is unavailable from the current OpenCode CLI. No estimate
  recorded as actual cost; `spent` remains 0.00.
- Runtime skill discovery requires a host restart to load the project
  `skills.paths` configuration. Not a blocker for this component; recorded as
  residual infrastructure context.

## Recovery

- Last durable checkpoint: `SKILL.md` created and structurally validated;
  task record advanced to `completed`.
- Incomplete work: none.
- Cleanup required: none.
- Next safe action: none within this component; await next assigned task.

## Next Action

Task complete. No further action required in this component.
