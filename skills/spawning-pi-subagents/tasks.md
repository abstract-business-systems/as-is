---
as-is-version: 2
task:
  status: blocked
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
Fresh recovery revision authorized from caller HEAD 4960005 after inspecting `/tmp/as-is-child-MACitY/worktree`; preserved work is evidence only and must not be integrated. Exactly one direct component-builder attempt was authorized. The launcher registry proves the attempt was attributed to `component-builder`, used record path `skills/spawning-pi-subagents/tasks.md`, inherited caller `as-is`, and received the 3600-second budget. The child nevertheless returned after 101.055 seconds with no commit and only an uncommitted change to this task record; it did not produce the required pre-edit context verification, expert plan, implementation, final expert gate, or terminal handoff.

## Attempt
- id: launcher-task-boundary-recovery-2026-08-06-r2-attempt-1
- status: blocked
- parent-head: 4960005
- descendants: exactly one direct `component-builder`; no nested implementation descendants
- child-budget: 3600 seconds allocated; each implementation, expert-plan, expert-final, and handoff/integration subtask has a 600-second minimum
- observed: job `j-msejytir-jj7c7o`, base `386f96f`, exit 0, 101.055 seconds, no commit, preserved worktree `/tmp/as-is-child-RU1mpn/worktree`; changed path was only this task record
- recovery: context delivery is not reliable through the current launcher/task handoff. Do not retry or implement launcher behavior in this revision; a new revision must first authorize a minimal delivery correction and focused tests.

## Changed-Path Allowlist
- `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`
- the existing focused launcher test file only
- `skills/spawning-pi-subagents/tasks.md` terminal handoff cleanup only

## Validation
Parent validation required: terminal component record; expert plan and fresh expert final-diff evidence; exact changed-path scope; `git diff --check`; ancestry gate with `git merge-base --is-ancestor <child-commit> HEAD` before integration; and one final `bun skills/as-is/scripts/orient.ts` orientation. Never integrate unverified work.

## Result
Blocked. The fresh direct component-builder attempt was correctly attributed and received the named record path and budget, but did not establish the required task-boundary context or gates. No launcher implementation or Phase 2a work was performed, and no child work was integrated. The preserved worktree `/tmp/as-is-child-RU1mpn/worktree` contains only an uncommitted task-record edit and remains evidence only.

## Blockers And Escalations
The task-boundary failure remains unresolved: passing `--record skills/spawning-pi-subagents/tasks.md` and a task string naming the path was insufficient to cause the child to read and verify the exact component record before work. The child returned without the required expert gates, terminal record, commit, or handoff. This revision is durably blocked. Do not integrate `/tmp/as-is-child-RU1mpn/worktree`, do not retry this revision, and do not begin launcher implementation. A new revision must authorize the smallest control-plane/launcher correction that makes exact task-record context delivery reliable, with focused deterministic tests.

## Recovery
The preserved attempts `/tmp/as-is-child-MACitY/worktree` and `/tmp/as-is-child-RU1mpn/worktree` remain non-integrated evidence. Recovery requires a new current-turn authorization and task revision. Before any implementation, prove exact task-record content delivery (not only a record path), role/path/boundary verification, one active attempt, descendant plan, and budget admission. If that proof needs launcher changes, implement only that correction with focused tests; otherwise do not proceed. Require terminal record, expert plan/final gates, diff/scope/ancestry checks, and caller integration.
