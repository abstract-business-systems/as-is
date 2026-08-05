---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  revision: launcher-task-boundary-recovery-2026-08-06-r2
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
      allocated-seconds: 3600
      spent-seconds: 0
      reserve-seconds: 600
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Diagnose and correct the component-builder task-boundary delivery failure before launcher implementation.
  - Verify exact authorized role, skills/spawning-pi-subagents/tasks.md record, task path, and component boundary before edits.
  - If delivery is unreliable, make only the smallest launcher/control-plane correction needed to ensure it, with focused deterministic tests.
  - Otherwise implement only the launcher changed-path allowlist and caller ancestry gate.
  - Use at least 600 seconds for implementation, expert-plan, expert-final, and handoff/integration subtasks.
  - Require terminal record, expert gates, scope, diff-check, ancestry, and caller integration.
  - Do not implement Phase 2a or create migration artifacts.
---
# Task

## Requirement
Fresh recovery from caller HEAD 4960005. First diagnose the component-builder task-boundary failure by inspecting the protocol, agents/component-builder/agent.md, launcher task-record construction, and preserved worktree `/tmp/as-is-child-MACitY/worktree`. Do not begin launcher implementation until exact role, task path, record, and component boundary delivery is verified. If unreliable, make only the smallest delivery correction with focused tests; otherwise implement only the launcher changed-path allowlist and caller ancestry gate. No Phase 2a or migration artifacts.

## Plan
One direct `component-builder` descendant owns the component boundary. It must obtain a read-only expert plan review before edits, implement the smallest API-compatible launcher gate and focused tests, run the smallest relevant checks, obtain a fresh expert final-diff review, and commit the completed handoff. No nested implementation descendants are authorized.

## Progress
Fresh recovery revision authorized from caller HEAD 4960005 after inspecting `/tmp/as-is-child-MACitY/worktree`; preserved work is evidence only and must not be integrated. Exactly one direct component-builder attempt is authorized. Each implementation, expert-plan, expert-final, and handoff/integration subtask requires at least 600 seconds.

## Attempt
- id: launcher-task-boundary-recovery-2026-08-06-r2-attempt-1
- status: ready
- parent-head: 4960005
- descendants: exactly one direct `component-builder`; no nested implementation descendants
- child-budget: 3600 seconds allocated; each implementation, expert-plan, expert-final, and handoff/integration subtask has a 600-second minimum
- recovery: budget excess or any failed gate is a durable blocker; do not retry without a new revision

## Changed-Path Allowlist
- `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`
- the existing focused launcher test file only
- `skills/spawning-pi-subagents/tasks.md` terminal handoff cleanup only

## Validation
Parent validation required: terminal component record; expert plan and fresh expert final-diff evidence; exact changed-path scope; `git diff --check`; ancestry gate with `git merge-base --is-ancestor <child-commit> HEAD` before integration; and one final `bun skills/as-is/scripts/orient.ts` orientation. Never integrate unverified work.

## Result
Pending fresh preflight and one authorized direct component-builder attempt. The preserved worktree `/tmp/as-is-child-MACitY/worktree` is recovery evidence only; no files from it may be integrated.

## Blockers And Escalations
Previous revision was blocked because the returned child did not operate on this component record. This revision stops durably on any failed context, expert, terminal-record, scope, ancestry, or integration gate.

## Recovery
The preserved attempt and worktree remain non-integrated evidence. Launch only after preflight verifies exact task context delivery, one active attempt, role attribution, descendant plan, and the 3600-second allocation. Any failure is recorded as a durable blocker; do not retry this revision.
