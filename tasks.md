---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-03T07:00:00Z
  task-revision: canonical-agent-source-migration-3
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
    maximum-children: 3
  execution:
    wall-clock:
      allocated-seconds: 900
      spent-seconds: 0.00
      reserve-seconds: 90
      source: fresh authorization; prior attempts retained as historical evidence
  external-effects: require-current-turn-user-approval
acceptance:
  - Top-level agents/ is the canonical role-source tree; .agents/agents remains host projection only.
  - Setup reads canonical agents/ sources and projects them into host .agents/agents without creating a second source.
  - Launcher, focused tests, and scoped documentation use canonical top-level agent paths while preserving host projection semantics.
  - Product components are unchanged and all implementation children use component-builder.
  - Required expert plan/final validation, focused setup/launcher tests, builds, diff checks, ancestry, and clean-worktree evidence pass.
---
# Canonical Agent-Source Migration

## Requirement
Proceed with approved Option B: make top-level `agents/` the sole canonical role-source tree, retain `.agents/agents/` as host projection only, and update setup, launcher references, focused tests, and scoped documentation.

## Scope
Root coordination plus `.agents/`, `components/as-is-setup/`, and `skills/spawning-pi-subagents/` boundaries. Do not modify product components or unrelated backlog items. Use only `component-builder` implementation children and the repaired builder-owned expert path.

## Plan
Resume from preserved migration evidence only after rereading current records. Delegate bounded source-layout, setup, and launcher work through component-builder, obtain expert plan and final validation, integrate scoped child commits in the caller repository, and verify source/projection references, focused tests, builds, ancestry, and clean worktree.

## Prior Evidence And Authorization
Earlier migration attempts were blocked before implementation because the launcher could not attribute builder-owned expert validation. That path is now repaired and validated in commits `c88cdad` and `19f803a`. Prior elapsed observations remain historical and are not treated as current cost. This fresh revision authorizes one bounded 900-second attempt with monetary spent `0.00` because host cost is unavailable.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
None for this fresh revision. Preserve separate elapsed-time and cost accounting if any child or validation gate blocks; do not silently retry.

## Recovery
Inspect prior recovery evidence at `/tmp/as-is-child-y8gx0I/worktree` only as historical context. Preserve any new incomplete child worktree and registry evidence. Do not delete either source tree until all consumers and projection behavior are verified.

## Next Action
Launch one bounded component-builder migration attempt using the repaired as-is → component-builder → expert path.
