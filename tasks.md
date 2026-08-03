---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-03T09:20:00Z
  task-revision: canonical-agent-source-setup-phase-1
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
      source: fresh phase authorization; prior migration history retained separately
  external-effects: require-current-turn-user-approval
acceptance:
  - components/as-is-setup/setup.ts inventories canonical agents/ sources.
  - Client projection remains .agents/agents and preserves collision/idempotence behavior.
  - Focused setup tests and build pass.
  - Only components/as-is-setup artifacts and root handoff records change; launcher, role sources, product, and unrelated components remain unchanged.
  - Expert plan/final validation, scoped commit, ancestry, and clean-worktree evidence are recorded.
---
# Canonical Agent-Source Setup Phase 1

## Requirement
Update `components/as-is-setup` to read canonical role sources from top-level `agents/` while continuing to project them into client-local `.agents/agents/`. Preserve skill wiring, collision behavior, idempotence, and host detection.

## Scope
Only `components/as-is-setup/` and root task/changelog handoff records. Do not modify `skills/spawning-pi-subagents`, role source files, product components, or unrelated documentation. Use only component-builder.

## Plan
Reread the setup component record and tests plus the canonical source-layout decision. Change the bundle source path from `.agents/agents` to `agents`, update deterministic fixtures/tests and component documentation as needed, obtain expert plan and final validation through the repaired lineage, run focused setup tests/build/diff checks, and commit one scoped handoff.

## Prior Evidence And Authorization
Canonical role sources were moved and integrated in `82d8645`; `.agents/agents` is now projection-only. This fresh phase authorizes 600 seconds with monetary spent `0.00` because host cost is unavailable. The launcher phase and role-source phase are complete and must remain unchanged.

## Validation
Implementation validation passed in the preserved child worktree: `bun test components/as-is-setup/setup.test.ts` — 3 passed; `bun build components/as-is-setup/setup.ts --outdir /tmp/as-is-setup-build` passed; `git diff --check` passed. The required final expert validation was blocked because the read-only expert could not inspect the actual uncommitted diff/status under its tool contract.

## Result
Blocked; setup changes appear behaviorally correct but are not safe to integrate without the required passing final expert gate. No commit was created.

## Blockers And Escalations
- Final configured expert validation returned BLOCKED on inability to inspect actual diff/status.
- Do not substitute a role or bypass the required commit gate.
- Preserve the implementation worktree and obtain a compliant validation path before retrying integration.

## Recovery
Preserve implementation worktree `/tmp/as-is-child-XNPTJh/worktree` and registry evidence. Its changes are limited to `components/as-is-setup` plus the root task record. Do not alter canonical role sources or launcher files. Resume only after a compliant final expert validation path is available.

## Next Action
Resolve the final expert-validation blocker; do not integrate or retry silently.
