---
as-is-version: 2
task:
  status: blocked
  worker: as-is
  revision: phase-2a-2026-08-06
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
    implementation-delegations: 1
    nested-implementation-delegation: false
  execution:
    wall-clock:
      source: host-reported
    minimum-seconds:
      implementation: 600
      expert-plan: 600
      expert-final: 600
      handoff-integration: 600
  external-effects: require-current-turn-user-approval
acceptance:
  - Execute only Phase 2a of the approved skills-agents-separation-migration.
  - Preserve agent authority, skill non-calling boundaries, generalized subagent flows, explicit dependencies, and durable task-record evidence.
  - Validate the direct component-builder descendant with expert plan and final-diff gates, integrate only verified commits with caller ancestry evidence, and account for residual risk or blockers.
  - Stop after Phase 2a; do not start later phases.
---
# Task

## Requirement
Implement Phase 2a of the approved `skills-agents-separation-migration` in one direct component-builder descendant. The approved planning handoff is commit `29ce77b`; Phase 1 is integrated through the chain `ea4f032 -> 50fe83c -> 1992ae6`. Root `tasks.md` is the current task authority; backlog entries remain planning indexes.

## Baseline reconciliation
- Baseline HEAD is `1992ae6`.
- Integrated Phase 1 chain is `ea4f032 -> 50fe83c -> 1992ae6`; these are the authoritative current ancestors for this retry.
- Old reference `21fcb08` is historical only and must not be used as a current parent, integration target, or completion proof.
- This reconciliation is authorized by the current user and must be committed on the caller branch before preflight or delegation.

## Phase 2a scope
Direct component-builder implementation only; no nested implementation delegation.

Exact allowlist:
- `agents/as-is/agent.md`
- `skills/as-is/SKILL.md`
- `skills/spawning-pi-subagents/SKILL.md`
- `skills/changelog.md` (only the Phase 2a entry)
- this root `tasks.md` for durable task evidence only

Exact checks:
- `git diff --check`
- `git diff --name-only` and allowlist enforcement
- `git diff --unified=0` review for scope and authority boundaries
- `bash skills/as-is/scripts/orient.ts` once for final repository orientation
- expert plan review before implementation
- fresh expert final-diff review after implementation
- terminal child record, commit parent, commit scope, and caller ancestry verification

Forbidden: runtime code changes, Phase 2b or later work, changes outside the allowlist, nested implementation delegation, and use of `21fcb08` as current evidence.

## Progress
Reconciled for the authorized Phase 2a retry. No implementation has been delegated. The caller-side reconciliation commit must be the parent of the preflight and implementation flow. The preflight must receive this actual root record and explicit ancestry command results, not an unavailable `agents/as-is/tasks.md` or child `as-is` record.

## Validation
Reconciliation preflight evidence: caller commit `0c2dcd0d4583e71753432d9dc5c360e329e7e66d` has parent `1992ae6c6ce61bcc78ba22f5af8be9cb74695ee1`; `git merge-base --is-ancestor` passed for `ea4f032`, `50fe83c`, and `1992ae6`; `git diff --check` passed; status was clean. The direct child launch returned a preflight failure before implementation. No implementation child, final expert validation, terminal child record, or integration occurred.

## Result
Blocked before Phase 2a implementation. No unverified implementation integrated. Stop after Phase 2a as required.

## Blockers And Escalations
The prior Phase 1 attempt and reference `21fcb08` are historical evidence only. The one authorized Phase 2a attempt was stopped because preflight did not pass: required child budget-admission and handoff/rehearsal evidence were not recorded. The child reported no implementation delegation, no nested work, no later-phase work, and no new commit. This blocker is now durable on the caller branch; do not retry beyond the one authorized Phase 2a attempt.

## Recovery
Inspect this revision and the delegation registry before any recovery. The single authorized Phase 2a attempt is closed as preflight-blocked; there is no implementation commit or child terminal record to integrate. A future recovery requires fresh user authorization and a new task revision; do not infer completion or retry this attempt.

## Next Action
Remain blocked at Phase 2a. The reconciliation commit and this durable blocker must remain on the caller branch. Do not start later phases or integrate implementation.
