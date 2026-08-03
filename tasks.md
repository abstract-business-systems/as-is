---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T08:25:00Z
  task-revision: canonical-role-source-phase-1
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
      source: fresh phase authorization; prior migration elapsed history retained separately
  external-effects: require-current-turn-user-approval
acceptance:
  - Four role source directories are moved to top-level agents/ as the sole canonical source.
  - .agents/agents is documented as host projection only; no duplicate source is maintained.
  - Only the .agents component and its records/docs change in this phase; setup, launcher, and product components remain untouched.
  - Focused source-layout/reference checks and diff checks pass, with a scoped committed handoff.
---
# Canonical Role-Source Phase 1

## Requirement
Begin Option B with only the canonical role-source move. Move `.agents/agents/{as-is,component-builder,expert,worker}` to top-level `agents/`, document `.agents/agents/` as host projection only, and update only `.agents`-component links and references.

## Scope
`.agents/` and top-level `agents/` only, plus this root task handoff. Do not modify `components/as-is-setup`, `skills/spawning-pi-subagents`, product components, or unrelated documentation. Use only component-builder.

## Plan
Reread `.agents/as-is.md`, `.agents/backlog.md`, and the preserved prior recovery evidence. Move the four role directories without maintaining duplicate source files, update `.agents` durable links and source-layout documentation, run focused path/reference checks and `git diff --check`, obtain expert plan/final validation through the repaired lineage, and commit one scoped handoff.

## Prior Evidence And Authorization
The monolithic migration was budget-stopped after 900 seconds without implementation. This is a newly bounded phase with a fresh 600-second wall-clock allocation; prior elapsed time remains historical and host monetary cost remains unavailable (`spent: 0.00`). This phase does not authorize setup or launcher changes.

## Validation
The repaired expert lineage ran the required plan review and returned **fail**. It found that the requested move crosses the `.agents/` component and role subcomponent boundaries without explicit ownership, projection representation, acceptance-mapped checks, or rollback boundaries. It also identified a budget-policy discrepancy between the 600-second phase allocation and the root 300-second unit budget. No implementation or focused checks were authorized.

## Result
Blocked before implementation. No role directories moved; the caller worktree remains unchanged.

## Blockers And Escalations
- Clarify and explicitly authorize ownership of top-level `agents/` and moved role components.
- Define `.agents/agents/` host-projection representation and owner.
- Enumerate acceptance-mapped checks and rollback boundary.
- Reconcile the phase budget with root policy.
- Do not retry or substitute a worker until these are resolved.

## Recovery
Preserve the unchanged `.agents/agents/` source layout and the delegated recovery evidence at `/tmp/as-is-child-lw2fU3/worktree`. Resume only after the bounded authorization is updated and the repaired expert lineage returns a passing plan review.

## Next Action
Resolve the expert scope and authorization blocker before any retry.
