---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T10:50:00Z
  task-revision: canonical-agent-source-launcher-phase-3
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
      source: fresh recovery authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Launcher documentation and test fixtures use top-level agents/{as-is,component-builder,expert,worker} as canonical role-source paths.
  - .agents/agents remains only a client projection reference.
  - Focused launcher tests and build pass.
  - Direct unauthorized expert rejection and builder-owned expert lineage remain covered.
  - Only skills/spawning-pi-subagents artifacts and component-local task/changelog records change.
  - Expert directly reads the exact changed files and returns an attributable pass before commit.
---
# Canonical Agent-Source Launcher Phase 3

## Requirement
Recover the preserved launcher implementation and complete the canonical source-reference migration. The implementation must use top-level `agents/` for repository role sources and retain `.agents/agents` only as client projection terminology.

## Scope
Only `skills/spawning-pi-subagents/` and its component-local task/changelog records. Do not modify root task records, setup, role sources, product, or unrelated files.

## Recovery
Previous component-local attempt produced the implementation in `/tmp/as-is-child-CZc13w/worktree` and passed 16 focused tests, build, and diff checks, but final expert validation failed. Recover its four launcher files or reproduce the same minimal changes. Do not trust the prior commit gate.

## Validation Plan
Run focused tests and Bun build. Invoke exactly one configured expert through the repaired builder lineage with a strict instruction to use only direct file reads on the named changed files, not Git/subprocess inspection. Provide the exact changed-file list, expected old/new path semantics, and acceptance mapping. Record the expert result before committing. Update component changelog, remove this transient task record, and create one scoped commit. Parent will cherry-pick and verify ancestry.

## Authorization
Fresh 600-second phase, monetary spent `0.00` because host cost is unavailable. This is a new revision after the prior expert failure; no silent retry.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
Stop if direct-file expert validation does not return pass or if scope expands. Preserve evidence; do not bypass the gate.

## Next Action
Launch one bounded component-builder recovery attempt.
