---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T09:40:00Z
  task-revision: canonical-agent-source-setup-phase-2
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
      source: fresh recovery authorization; prior elapsed history retained separately
  external-effects: require-current-turn-user-approval
acceptance:
  - components/as-is-setup/setup.ts inventories canonical agents/ sources.
  - Client projection remains .agents/agents and preserves collision/idempotence behavior.
  - Focused setup tests and build pass.
  - Only components/as-is-setup artifacts and root handoff records change.
  - Final expert validation reads the named changed files in the controlled worktree and explicitly assesses scope and safety; it need not use subprocesses.
---
# Canonical Agent-Source Setup Phase 2

## Requirement
Recover and complete the setup phase: source role inventory from top-level `agents/`, project to client `.agents/agents/`, preserve existing behavior, and validate the actual named files before commit.

## Scope
Only `components/as-is-setup/` and root task/changelog handoff records. Do not modify role sources, launcher files, product components, or unrelated documentation. Use only component-builder.

## Recovery And Validation Decision
The previous implementation passed focused tests/build but its final expert call was blocked because the expert attempted to inspect Git status/diff using prohibited subprocesses. This recovery explicitly requires the builder to pass the expert the exact changed-file list and acceptance mapping; the expert must read those files directly in the controlled worktree and assess the implementation without subprocesses. The expert result must be attributable and passing before commit.

## Plan
Reimplement the minimal setup source-path change in the builder worktree, update its fixture/docs, run focused tests/build/diff check, invoke expert with direct file-read validation instructions, then commit one scoped handoff. Parent will cherry-pick the child commit and verify ancestry.

## Prior Evidence And Authorization
The canonical role-source move is integrated in `82d8645`. The previous setup attempt is preserved at `/tmp/as-is-child-XNPTJh/worktree` as recovery evidence but was not committed. This is a fresh 600-second phase authorization with monetary spent `0.00` because host cost is unavailable.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None for this fresh recovery phase. If the expert cannot complete direct file-read validation or the task crosses scope, stop and record a blocker without retrying.

## Recovery
Preserve any incomplete worktree and registry evidence. The prior uncommitted recovery candidate remains `/tmp/as-is-child-XNPTJh/worktree`; do not delete it.

## Next Action
Launch one bounded component-builder recovery attempt with explicit direct-file expert validation.
