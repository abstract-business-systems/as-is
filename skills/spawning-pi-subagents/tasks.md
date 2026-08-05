---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  revision: launcher-scope-gate-prerequisite-recovery-2026-08-06
  updated: 2026-08-06T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.10
    source: host-reported
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 0
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
Fresh recovery revision authorized from caller HEAD 7b24483 after inspecting the prior preserved worktree `/tmp/as-is-child-vdlCrC/worktree`; its record-only blocker is not duplicated. Exactly one direct component-builder attempt is authorized. The attempt must reserve the 600-second child budget across implementation, expert plan, expert final, and handoff/integration.

## Attempt
- id: launcher-scope-gate-prerequisite-recovery-2026-08-06-attempt-1
- status: blocked
- parent-head: 7b24483
- descendants: exactly one direct `component-builder`; no nested descendants
- child-budget: 600 wall-clock seconds minimum, reserved for implementation, expert plan, expert final, and handoff/integration
- recovery: budget excess or any failed gate is a durable blocker; do not retry without a new revision

## Changed-Path Allowlist
- `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`
- the existing focused launcher test file only
- `skills/spawning-pi-subagents/tasks.md` terminal handoff cleanup only

## Validation
Parent validation required: terminal component record; expert plan and fresh expert final-diff evidence; exact changed-path scope; `git diff --check`; ancestry gate with `git merge-base --is-ancestor <child-commit> HEAD` before integration; and one final `bun skills/as-is/scripts/orient.ts` orientation. Never integrate unverified work.

## Result
Blocked: the exactly-one child attempt `j-mseivkuw-r7dvmv` exited successfully but did not operate on this component record. Its preserved worktree is `/tmp/as-is-child-MACitY/worktree`; it changed `changelog.md` and `tasks.md`, not the authorized launcher or focused tests. The child record was non-terminal/active for a different root task and no valid component commit or handoff exists. No implementation was integrated.

## Blockers And Escalations
Durable blocker recorded on the caller branch. The delegated result failed the actual-record, terminal-record, exact-scope, expert-gate, and handoff requirements; its source worktree is preserved for recovery evidence. Do not retry this revision or integrate the unrelated changes. A new revision is required to recover the launcher prerequisite.

## Recovery
Attempt `j-mseivkuw-r7dvmv` is terminally blocked at the parent because no valid component-builder handoff was produced. Preserve `/tmp/as-is-child-MACitY/worktree` until recovery is assessed; do not copy or integrate its unrelated changes. Recovery requires a new revision with corrected record routing and fresh authorization, while preserving the minimum 600-second allocation.
