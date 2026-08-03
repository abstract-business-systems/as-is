---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T06:45:00Z
  task-revision: backlog-completion-reconciliation-1
  attempt: 0
constraints:
  cost:
    currency: USD
    allocated: 0.35
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: host-observed elapsed-seconds only; not monetary cost
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0.00
      reserve-seconds: 40
      source: fresh bounded user authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Make the managing-backlog skill explicitly own removal of a selected backlog item after task-management verifies completion evidence and changelog handoff.
  - Define the completion reconciliation inputs: selected item, acceptance evidence, terminal task status, concise changelog summary, and scope/ownership check.
  - Require removal only after successful reconciliation; preserve open/deferred items and leave the item in place on incomplete or failed work.
  - Keep backlog planning non-authoritative and do not make the skill invent task status or validation evidence.
  - Update only skills/managing-backlog/; no product, component, or sibling skill changes.
  - Add focused deterministic content validation if appropriate; obtain expert plan/final review and create a scoped commit.
---
# Backlog completion reconciliation ownership

## Requirement
Clarify and strengthen the managing-backlog skill so task management, rather than the implementation worker, removes a selected backlog item after completion is durably verified. The skill must reconcile the selected item's acceptance against the completed task record, validation evidence, concise owning changelog summary, terminal descendant closure, and component scope before removal. It must not infer completion from process exit or silently invent evidence.

## Scope
Only `skills/managing-backlog/`. Expected files are `SKILL.md`, `as-is.md`, `changelog.md`, and an optional focused content test. Do not modify sibling skills, component records, or product files.

## Plan
Add a completion-reconciliation section to the skill describing task-management ownership, preconditions, failure behavior, and handoff ordering. Preserve the existing planning/selection contract. Validate required phrases and boundaries deterministically if a test is added, then obtain final expert validation before the scoped commit.

## Validation
Not started.

## Result
Not available.

## Blockers And Escalations
Stop if the change requires modifying the implementation or commit skill, changing task-record protocol authority, or crossing the component boundary. Record a blocker rather than expanding scope.

## Recovery
Recover from this record, `skills/managing-backlog/SKILL.md`, and the component `as-is.md`. No runtime state is authoritative.

## Next Action
Launch one bounded component-builder attempt.
