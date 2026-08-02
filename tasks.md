---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-08-06T01:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.40
    spent: 0.00
    reserve: 0.05
    source: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - pending-parent-integration is a hard completion blocker in the parent-agent/orchestration contract.
  - Integration is performed from the caller repository, and completion reporting verifies commit ancestry.
  - Focused regression coverage proves pending-parent-integration becomes integrated only after caller-worktree integration.
  - Relevant tests pass and evidence is recorded here and in changelog.md.
---

# Parent integration contract hardening

## Scope and plan

Inspect the launcher, orchestration skill, execution contract, and existing handoff tests. Expected changes are limited to the root orchestration contract and focused launcher regression tests, plus this record and changelog. No child component or external dependency is involved. Obtain read-only expert plan review before edits. Implement the smallest contract/test change, run focused Bun validation, obtain fresh read-only expert validation of the actual diff, and commit this component handoff. The parent orchestrator must integrate the resulting commit in the caller repository; this task does not claim integrated completion.

## Progress

Implementation and caller-worktree integration are complete. The source handoff
was integrated into `master`; this record is now closed.

## Validation and handoff

Implementation changed only `skills/spawning-pi-subagents/SKILL.md`,
`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`,
`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts`, this record,
and `docs/execution-contract.md`. The launcher now derives status by
`merge-base --is-ancestor` in the caller repository, while the orchestration
contract makes pending-parent-integration a hard blocker and requires caller
integration plus ancestry verification. The focused regression creates a
caller repository, observes the child commit as an ancestor, resets the caller
branch to make it pending, then cherry-picks in the caller worktree and observes
integrated.

Validation: with inherited `AS_IS_IDENTITY`/`AS_IS_JOB_ID` unset,
`bun test skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts`
passed: **15 pass, 0 fail, 128 expect() calls**. `git diff --check` passed.
The first run while the parent-agent environment variables were inherited
failed existing authorization-sensitive tests; that environment issue was
corrected and the authoritative focused run passed. Expert plan review was
requested; it returned a blocker because its isolated worktree could not see
this uncommitted root record. Fresh expert validation likewise could not
observe this controlled worktree's uncommitted diff, so it did not provide a
passing commit gate; this is recorded as a validation-path limitation, not
silently treated as approval.

Actual host-reported cost is unavailable. Host-observed focused validation was
7.35 seconds. Residual risk: the regression exercises ancestry mechanics and
launcher status computation but does not execute a real parent orchestrator
integration workflow. The caller branch contains the integrated handoff and
ancestry verification is recorded in `changelog.md` and Git history.

## Next action

No further action for this task. Future orchestration work must create a new
bounded task record.
