---
as-is-version: 2
task:
  status: ready
  worker: as-is
  revision: authority-alignment-2026-08-08-r1
  updated: 2026-08-08T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 3.00
    spent: 0.00
    reserve: 0.20
    source: host-reported
  delegation:
    maximum-depth: 1
    maximum-children: 1
  execution:
    wall-clock:
      allocated-seconds: 2400
      spent-seconds: 0
      reserve-seconds: 0
      source: host-enforced
    minimum-seconds:
      implementation: 600
      expert-plan: 600
      expert-final: 600
      handoff-integration: 600
  external-effects: require-current-turn-user-approval
acceptance:
  - Phase 2a is explicitly parked/deferred with its prior blockers preserved as history; no Phase 2a or migration implementation is started.
  - Create root and component planning backlog entries without putting active task state in backlog files.
  - Select and authorize one fresh component-builder task with one active attempt, 600-second minimum implementation/expert-plan/expert-final/handoff gates, and no nested implementation descendant.
  - The component-builder owns semantic completion, uses in-process call_subagent for same-component worker implementation and expert advice/final validation, and uses spawning-pi-subagents only for separately owned component boundaries.
  - Integrate only a terminal, expert-gated child commit after focused validation, scoped diff, and caller ancestry verification; otherwise record a durable blocker and leave work unintegrated.
---
# Task

## Requirement
Park the blocked Phase 2a implementation permanently for this revision and begin the highest-priority bounded authority-alignment task. The selected task is the component-builder follow-up recorded at `agents/component-builder/tasks.md`: align its contract with in-process `call_subagent` for same-component implementation and expert gates, reserving `spawning-pi-subagents` for separately owned component boundaries. Do not start Phase 2a, any migration phase, or recover prior uncommitted worktrees.

## Plan
1. Preserve the prior Phase 2a and launcher-prerequisite failures below as historical evidence, then authorize this new revision.
2. Add planning-only root and component backlog entries.
3. Launch exactly one configured `component-builder` child for the separately owned `agents/component-builder` component. The child must obtain in-process expert plan review before edits and fresh in-process expert final validation before commit; each implementation, plan, final, and handoff/integration gate is allocated at least 600 seconds.
4. Read the terminal child record, verify focused checks, changed scope, and ancestry, then integrate only the verified child commit. If the in-process extension/tool is unavailable or evidence is not durable, record a blocker and do not substitute subprocess worker/expert calls.

## Progress
Fresh revision authorized by the current user. Phase 2a is parked; no prior Phase 2a worktree or commit is being retried or integrated. Planning entries and the component task record are prepared before delegation.

## Validation
Pending child handoff. Required final checks: focused component checks selected by the child, `git diff --check`, scoped changed-path review, final `bun skills/as-is/scripts/orient.ts`, and `git merge-base --is-ancestor <child-commit> HEAD` after integration.

## Result
Pending. Completion requires terminal child record, attributable in-process expert plan/final evidence, scoped commit, caller ancestry integration, and descendant closure.

## Blockers And Escalations
If the Pi extension/tool path cannot provide in-process `call_subagent`, or if expert returns cannot be attributed and recorded in the component task record, stop and record that durable blocker. Do not revert to subprocess worker/expert calls, retry a failed attempt, or integrate unverified work.

Historical Phase 2a blocker (parked, not retryable): prior direct component-builder attempts returned without terminal records, expert gates, or commits; preserved evidence and job identifiers remain in the previous root task history and Git history. The authorized Phase 2a implementation is explicitly deferred and must not be restarted in this revision. Historical launcher-prerequisite blockers remain evidence only; no prior preserved worktree is an integration source.

## Recovery
A blocked or budget-stopped child remains non-terminal and must be accounted for here. Preserve its component worktree and record the exact missing gate, budget observation, and next safe action. Recovery requires a new task revision and explicit authorization; it must not retry Phase 2a.

## Next Action
Delegate the single ready `agents/component-builder/tasks.md` task through the configured `component-builder` role, subject to the in-process call_subagent gate and the recorded 600-second minimums.
