---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T10:35:00Z
  task-revision: canonical-agent-source-launcher-phase-2
  attempt: 1
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: host-observed elapsed-seconds only; not monetary cost
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0.00
      reserve-seconds: 60
      source: fresh component-local phase authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Launcher documentation and test fixtures use top-level agents/{as-is,component-builder,expert,worker} as canonical role-source paths.
  - .agents/agents remains identified only as client host projection, not repository source.
  - Focused launcher tests and build pass, including direct expert rejection and builder-owned expert lineage.
  - No stale canonical .agents/agents role-source references remain in launcher artifacts.
  - Only this component's artifacts change; setup, role sources, product, and unrelated components remain unchanged.
  - Final expert validation directly reads named changed files, a scoped commit is created, and parent verifies ancestry.
---
# Canonical Agent-Source Launcher Phase 2

## Requirement
Update this launcher component's documentation and test fixtures to use canonical top-level `agents/` role sources after the source-layout and setup migrations. Preserve `.agents/agents` only as the client projection destination and preserve delegation authorization behavior.

## Scope
Only `skills/spawning-pi-subagents/`. Do not modify root tasks, setup, role sources, product components, or unrelated documentation. The parent owns root handoff records and will integrate this component commit.

## Plan
Inspect the launcher source, tests, and durable component records. Replace repository role-source references in launcher docs/tests with `agents/`; retain projection references where semantically required. Run focused launcher tests and Bun build, invoke expert with direct-file validation over the exact changed files, then create one scoped commit. Parent will cherry-pick and verify ancestry.

## Prior Evidence And Authorization
Attempt 1 of the root-scoped revision was stopped during plan review because this directory is a separate component boundary and lacked a component-local task record; no launcher implementation was produced. This new component-local revision authorizes one fresh 600-second phase with monetary spent `0.00` because host cost is unavailable.

## Validation
Implementation checks passed in the preserved builder worktree: focused launcher tests — 16 passed; Bun build — passed; `git diff --check` — passed. Mandatory final expert validation was attempted through the repaired builder lineage but returned failure, so commit safety was not established.

## Result
Blocked attempt 1. Launcher implementation remains uncommitted in `/tmp/as-is-child-CZc13w/worktree`; no parent integration occurred.

## Blockers And Escalations
- Final configured expert validation failed despite the required caller and propagated parent job ID.
- Do not bypass the expert gate, substitute a role, or retry this revision.
- A new recovery authorization and compliant expert-validation path are required before integration.

## Recovery
Preserve `/tmp/as-is-child-CZc13w/worktree` and registry evidence. The reported implementation is limited to this component, but remains uncommitted. Do not alter setup, role sources, or root records.

## Next Action
Resolve the expert-validation failure and authorize a fresh component-local recovery revision.
