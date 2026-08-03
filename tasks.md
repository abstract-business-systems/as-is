---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T10:00:00Z
  task-revision: canonical-agent-source-launcher-phase-1
  attempt: 0
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
      source: fresh phase authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Launcher documentation and test fixtures use top-level agents/{as-is,component-builder,expert,worker} as canonical role-source paths.
  - .agents/agents remains identified only as client host projection, not repository source.
  - Focused launcher tests and build pass, including direct expert rejection and builder-owned expert lineage.
  - No stale canonical .agents/agents role-source references remain in launcher artifacts.
  - Only skills/spawning-pi-subagents artifacts and root handoff records change; setup, role sources, product, and unrelated components remain unchanged.
  - Final expert validation reads the named changed files directly, a scoped commit is created, ancestry is verified, and the working tree is clean.
---
# Canonical Agent-Source Launcher Phase 1

## Requirement
Update launcher documentation and test fixtures to use the canonical top-level `agents/` role sources after the source-layout and setup migrations. Preserve `.agents/agents` only as the client projection destination and preserve all delegation authorization behavior.

## Scope
Only `skills/spawning-pi-subagents/` and root task/changelog handoff records. Do not modify `components/as-is-setup`, top-level role sources, product components, or unrelated documentation. Use only component-builder.

## Plan
Inspect launcher source, tests, and component records. Replace repository role-source references in launcher docs/tests with `agents/`; retain projection references where semantically required. Run focused launcher tests and Bun build, invoke expert with direct-file validation over the exact changed files, then create one scoped commit. Parent will cherry-pick and verify ancestry.

## Prior Evidence And Authorization
Canonical role sources are integrated in `82d8645`; setup source inventory is integrated in `cfe657f`. The previous setup validation blocker was resolved by direct-file expert validation. This fresh phase authorizes 600 seconds with monetary spent `0.00` because host cost is unavailable.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None for this fresh phase. If final expert validation cannot directly assess the named files or scope crosses the launcher boundary, stop and record a blocker without retrying.

## Recovery
Preserve any incomplete component-builder worktree and registry evidence. Do not alter setup, role sources, or product files.

## Next Action
Launch one bounded component-builder launcher migration phase.
