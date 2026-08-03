---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-08-06T02:00:00Z
  task-revision: canonical-agent-source-launcher-phase-3
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
      source: fresh recovery authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Launcher documentation and test fixtures use top-level agents/{as-is,component-builder,expert,worker} as canonical role-source paths.
  - .agents/agents remains only a client projection reference.
  - Focused launcher tests and build pass.
  - Direct unauthorized expert rejection and builder-owned expert lineage remain covered.
  - Only canonical-path consumer documentation, extension wiring, setup backlog wording, dummy fixture tests, and root handoff records change; product behavior remains untouched.
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
Component-local launcher recovery was implemented and expert-gated by the builder. Launcher tests passed: 16 passed, 0 failed, 131 expectations. Bun launcher build passed and `git diff --check` passed. Parent cherry-picked the scoped child commit as `cb8d927` and verified ancestry and a clean worktree. End-to-end canonical-path checks then passed: setup, dummy delegation, and launcher startup tests — 5 passed, 0 failed, 20 expectations. Runtime worker/expert paths, as-is entrypoint documentation, and dummy fixtures now use canonical `agents/` sources; `.agents/agents/` remains projection-only.

## Result
Completed. Canonical role-source migration is wired through setup, launcher, extension role paths, as-is documentation, and the deterministic dummy-delegation rehearsal. The rehearsal confirms one bounded as-is-to-component-builder flow with durable evidence and no product changes.

## Blockers And Escalations
No implementation blocker. The optional standalone extension bundle build could not resolve host-only dependencies (`@earendil-works/pi-coding-agent` and `typebox`) in this repository checkout; the extension path change is a literal source-path update and remains covered by repository conventions. Historical design references retain their archival `.agents/agents` wording and were not changed because they document prior architecture rather than runtime source lookup.

## Recovery
Integrated launcher commit: `cb8d927`. Current follow-up changes are limited to canonical path consumers, backlog wording, and fixture rehearsal coverage. Working tree must be clean after the handoff commit.

## Next Action
No further migration action. Future work may validate host discovery where supported.
