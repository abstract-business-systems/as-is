---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T05:18:00Z
  task-revision: canonical-agent-source-migration-2
  attempt: 1
constraints:
  cost:
    currency: USD
    allocated: 0.50
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 1
    maximum-children: 3
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 244.898
      reserve-seconds: 60
      source: host-observed prior attempt; new authorization adds 600 seconds
  external-effects: require-current-turn-user-approval
acceptance:
  - Top-level agents/ is the canonical role-source tree; .agents/agents remains host projection only.
  - Setup reads canonical agents/ sources and projects them into host .agents/agents without copying or creating a second source.
  - Launcher, focused tests, and scoped documentation use canonical top-level agent paths while preserving host projection semantics.
  - Product components are unchanged and all child work is delegated only to component-builder.
  - Focused setup and launcher tests, relevant builds, and diff checks pass; handoff summary and integration evidence are recorded.
---
# Canonical Agent-Source Migration

## Requirement
Proceed with the approved Option B migration. Make top-level `agents/` the sole canonical role-source tree, retain `.agents/agents/` as host projection only, and update setup, launcher references, focused tests, and scoped documentation.

## Scope
Root coordination plus the `.agents/`, `components/as-is-setup/`, and `skills/spawning-pi-subagents/` component boundaries. Do not modify product components or unrelated backlog items. Use only `component-builder` for implementation children.

## Prior Attempt And Authorization
The prior attempt was blocked before implementation when required expert plan validation was budget-stopped after approximately 20 seconds; observed parent/child elapsed time was approximately 244.898 seconds. The user now authorizes a fresh bounded attempt with a 600-second wall-clock allocation. This is attempt 1 of revision 2, not an unrecorded retry.

## Plan
Resume from the preserved recovery evidence only after rereading the current records. Delegate bounded component work through `component-builder`, obtain required expert plan/final validation, integrate only scoped child handoffs in the caller repository, and verify ancestry, focused tests, references, and clean worktree.

## Progress
Attempt 1 was authorized and launched through the configured `component-builder` path with the fresh 600-second allocation. The launcher returned without an attributable child handoff, implementation commit, or validation evidence. No migration edits were integrated.

## Validation
Blocked before implementation. The mandatory expert plan review was rejected by launcher authority (`as-is cannot launch expert; delegation decisions belong to as-is`), and no attributable component-builder result was produced. No focused migration tests, builds, diff, or ancestry checks were run.

## Result
Blocked; Option B was not completed. Prior observed 244.898 seconds remains preserved in cumulative accounting; the fresh attempt was consumed as a bounded attempt. No silent retry occurred.

## Blockers And Escalations
- Required expert plan validation is unavailable from the current caller path under launcher authority.
- The component-builder launch returned without a child record, scoped commit, or validation evidence.
- Do not substitute another role or retry without an authorized launcher-path repair and new task revision.

## Recovery
The prior recovery candidate is `/tmp/as-is-child-y8gx0I/worktree`; inspect it only as historical recovery evidence. Preserve any new incomplete worktree and record its path. Do not delete either source tree until migration consumers and projection behavior are verified.

## Next Action
Stop and escalate the launcher-authority blocker. Do not alter the canonical layout or retry attempt 1 silently.
