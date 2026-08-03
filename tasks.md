---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T07:20:00Z
  task-revision: canonical-agent-source-migration-3
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
Blocked by the bounded 900-second parent attempt. The repaired expert path was exercised: expert launches were attributable to `component-builder` and returned successfully. The component-builder produced no migration handoff or scoped commit before the parent budget stopped (`as-is budget-stopped: limit=wall-clock seconds=900 exit=124`). No focused migration tests or final integrated-diff validation were completed.

## Result
Incomplete; Option B was not implemented or integrated. No product components were changed and no silent retry occurred.

## Blockers And Escalations
- Parent attempt 1 consumed its 900-second wall-clock allocation and budget-stopped.
- The component-builder worktree was preserved as `/tmp/as-is-child-XNv75J/worktree` with only task-record changes observed; no migration commit exists.
- Expert launches were authorized and attributable, so the prior authority defect is not the current blocker.
- Do not retry until a new task revision records a bounded recovery plan and sufficient allocation.

## Recovery
Inspect `/tmp/as-is-child-XNv75J/worktree` and its child task record before any future attempt; preserve the worktree and registry evidence. Do not delete either source tree until all consumers and projection behavior are verified. A future attempt requires a new task revision and explicit authorization; do not silently retry.

## Next Action
Escalate the budget-stopped migration attempt. The canonical source migration remains deferred.
