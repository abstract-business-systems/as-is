---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  revision: launcher-scope-gate-prerequisite-2026-08-06
  updated: 2026-08-06T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.10
    source: host-reported
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 60
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Implement only the launcher post-child changed-path allowlist and ancestry gate.
  - Preserve existing behavior when no allowlist is requested.
  - Add focused deterministic tests for the new gate.
  - Require expert plan and fresh expert final-diff validation before commit.
  - Produce a terminal component record and commit; parent must verify scope, diff-check, and ancestry.
  - Do not implement Phase 2a or create migration artifacts.
---
# Task

## Requirement
Implement the smallest launcher post-child changed-path allowlist and ancestry gate in `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`, with focused tests in the existing launcher test file. The gate must enforce an explicitly requested allowlist after the child exits and reject a child result that is not an ancestor of the caller branch. When no allowlist is requested, preserve current behavior. This is a focused prerequisite only; no Phase 2a or migration artifacts.

## Plan
One direct `component-builder` descendant owns the component boundary. It must obtain a read-only expert plan review before edits, implement the smallest API-compatible launcher gate and focused tests, run the smallest relevant checks, obtain a fresh expert final-diff review, and commit the completed handoff. No nested implementation descendants are authorized.

## Progress
New prerequisite revision authorized from caller HEAD e59a120. Component task record is at `skills/spawning-pi-subagents/tasks.md`; no child attempt has started.

## Validation
Parent validation required: terminal child record; expert plan and final evidence; changed paths limited to launcher script, focused launcher tests, and this component record cleanup; `git diff --check`; and `git merge-base --is-ancestor <child-commit> HEAD` after integration. Run orientation once for final repository state.

## Result
Pending delegated component-builder handoff.

## Blockers And Escalations
None at authorization. If the child handoff is incomplete, out of scope, non-terminal, lacks expert gates, or fails ancestry/diff checks, record a durable blocker on the caller branch and do not integrate it.

## Recovery
One active attempt is authorized for this revision. A failed or budget-stopped attempt is not retried without a new revision and durable recovery decision. Preserve incomplete child worktree evidence for recovery.

## Next Action
Launch exactly one bounded component-builder descendant with a 600-second wall-clock budget and actual component task-record context.
