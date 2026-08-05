---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  revision: launcher-worker-extension-recovery-2026-08-08-r10
  updated: 2026-08-08T00:00:00Z
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
Fresh focused prerequisite recovery from caller HEAD 942a3eb. R9 corrected duplicate extension discovery but the child still lacked `call_subagent` because normal tool forwarding omitted the extension tool. R10 adds `call_subagent` to normal component-builder tool forwarding while retaining the fixed expert profile. First inspect the launcher/session/result protocol and preserved prior result/session/worktree evidence. Do not start Phase 2a, migration, or authority-alignment implementation. Exactly one direct component-builder attempt is authorized for this prerequisite. The child must commit launcher/control-plane corrections and its terminal component record; the parent independently reads preserved child record/session/result and verifies expert gates, scope, ancestry, diff-check, and caller integration. If evidence remains unavailable, do not integrate and commit a concrete durable blocker on the caller branch.

## Plan
First establish attributable evidence capture: every direct child handle/result must carry parent job id, task revision/attempt, record path, session path/reference, base and commit ancestry, and durable result location; expert plan/final returns must be recorded with job id and task revision in the component record rather than relying on opaque provider output. Then exactly one direct `component-builder` descendant may own the component boundary, with no nested implementation descendants. It must obtain a read-only expert plan review before edits, implement only the smallest launcher/control-plane correction and focused tests, obtain a fresh expert final-diff review, and commit the correction plus terminal component record. Each implementation, expert-plan, expert-final, and handoff/integration subtask has a minimum 600-second allocation.

## Progress
Fresh r10 recovery is authorized from caller HEAD `942a3eb`. Normal child launches disable extension discovery, explicitly load `.pi/extensions/worker-tools.ts`, and now append `call_subagent` to the component-builder tool allowlist. Expert launches retain the fixed `read,grep,find,ls,git_inspect` profile. No Phase 2a, migration, or authority-alignment implementation is included.

Prior progress: Recovery starts at caller HEAD fe7ba74. Protocol, launcher, component-builder role, expert profile, and prior registry/session/result evidence were inspected. The authorized single child launch used caller `as-is`, parent job `caller-fe7ba74`, this record, revision `attributable-delegation-handoffs-2026-08-07-r5`, and a 2400-second budget. Phase 2a and migration artifacts remain untouched.

## Attempt
- id: launcher-worker-extension-recovery-2026-08-08-r10-attempt-1
- status: active
- parent-head: 942a3eb
- descendants: exactly one direct `component-builder`; no nested implementation descendants
- child-budget: 3600 seconds allocated; each implementation, expert-plan, expert-final, and handoff/integration subtask has a 600-second minimum
- observed: focused launcher correction is uncommitted; fresh expert gate and commit pending
- recovery: stop on missing in-process tools, missing expert gates, or unavailable handoff; do not retry r10

Prior r9 attempt:
- id: launcher-worker-extension-recovery-2026-08-08-r9-attempt-1
- status: blocked
- parent-head: c7fabce
- observed: job `j-msetlepx-pqo1j2`, exit 0 after 22.832 seconds, no commit; child lacked `call_subagent` in its normal tool allowlist

Prior attempt:
- id: launcher-task-context-delivery-2026-08-06-r3-attempt-1
- status: blocked
- parent-head: 62147f3
- descendants: exactly one direct `component-builder`; no nested implementation descendants
- child-budget: 3600 seconds allocated; each implementation, expert-plan, expert-final, and handoff/integration subtask has a 600-second minimum
- observed: job `j-msek9lgq-0e9iou`, base `62147f3`, exit 0, 81.871 seconds, no commit, preserved worktree `/tmp/as-is-child-unmNir/worktree`; changed path was only this task record
- recovery: required expert plan return was opaque/unattributable (`agent_settled` only). Do not integrate or retry this revision; a new revision must resolve attributable expert validation.

## Changed-Path Allowlist
- `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`
- the existing focused launcher test file only
- `skills/spawning-pi-subagents/tasks.md` terminal handoff cleanup only

## Validation
Parent validation required: terminal component record; expert plan and fresh expert final-diff evidence; exact changed-path scope; `git diff --check`; ancestry gate with `git merge-base --is-ancestor <child-commit> HEAD` before integration; and one final `bun skills/as-is/scripts/orient.ts` orientation. Never integrate unverified work.

R10 focused evidence: `bun test skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` passed (18 tests); launcher Bun build passed; and `git diff --check` passed. Fresh parent in-process expert final gate used `git_inspect`, verified the exact three-file scope and HEAD `942a3eb`, and returned pass / safe-to-commit within scope.

Final expert gate: fresh parent Pi session `pi --no-extensions --extension .pi/extensions/worker-tools.ts` invoked exactly one in-process `call_subagent` expert with `timeoutMs: 900000`. The expert used `git_inspect` and returned `Finding (pass)` / `safe-to-commit decision: Yes—safe to commit within the recorded focused scope`; it verified the five-path scope, normal worker-tools loading, in-process expert restrictions, subprocess expert restrictions, absence of prohibited implementation, diff-check, and HEAD. Residual risk: tests/builds were accepted from recorded focused evidence rather than rerun by the read-only gate.

Current r9 local evidence: `bun test skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` passed (18 tests); the launcher Bun build passed; and `git diff --check` passed. The r8 child failed mechanically before model execution due to duplicate extension registration. A fresh r9 component-builder attempt and its attributable in-process expert plan/final gates remain required.

## Result
Completed r10 within the three-file allowlist. Normal component-builder launches now receive `call_subagent` in addition to their requested tools, while expert validation remains fixed and read-only. Focused validation and the fresh in-process expert final gate passed. The record is ready for scoped commit and removal after changelog handoff.

Prior result: Blocked after the single authorized prerequisite child return. The child handoff did not produce caller-verifiable implementation, terminal record, expert gates, commit, or ancestry evidence. No launcher or settings change was integrated. Job `j-msel4uj5-gu9dgz` exited 0 after 488.394 seconds, but produced no commit (`commitSha` equals caller base `fe7ba745211b4113d007877bc0a16ef9a836dc3f`), no terminal task-record handoff, and preserved uncommitted worktree `/tmp/as-is-child-DQRNC4/worktree`. The parent cannot verify expert plan/final gates, scope, diff-check, or caller-ancestral integration. No child work is accepted or integrated.

## Blockers And Escalations
No active blocker for r10. R9 remains preserved as historical evidence. Residual risk: the final expert accepted recorded test/build evidence rather than rerunning them; the parent must still create the scoped commit and verify caller state.

Historical r8 blocker: duplicate registration was corrected by disabling normal extension discovery.

Historical blockers:
Durable caller-branch blocker: job `j-msel4uj5-gu9dgz` was attributable at launch (caller `as-is`, parent `caller-fe7ba74`, record path, session path, and base SHA were recorded), but the child returned without the required durable implementation handoff. Its result `/tmp/as-is-child-DQRNC4/result.json` records exit 0, 488.394 seconds, base/commit `fe7ba745211b4113d007877bc0a16ef9a836dc3f`, `committed: false`, and preserved worktree `/tmp/as-is-child-DQRNC4/worktree`; the launched session reference is `/tmp/as-is-child-DQRNC4/sessions`. Required expert plan/final outcomes and terminal child record are unavailable in caller-verifiable durable form. Do not integrate or retry this revision. Historical evidence: no child launch in revision r4 because attribution preflight failed. Concrete evidence: job `j-msek9lgq-0e9iou` result `/tmp/as-is-child-unmNir/result.json` records caller cwd `/tmp/as-is-child-hxX0A8/worktree`, record `skills/spawning-pi-subagents/tasks.md`, base `62147f3`, exit 0, 81.871s, no commit, preserved `/tmp/as-is-child-unmNir/worktree`; its session directory `/tmp/as-is-child-unmNir/sessions/` is not referenced by result and required expert output was opaque `agent_settled`. Earlier job `j-mseivkuw-r7dvmv` result `/tmp/as-is-child-vdlCrC/result.json` records record `skills/spawning-pi-subagents/as-is.md`, base `4454998`, exit 0, 90.006s, no commit, preserved `/tmp/as-is-child-vdlCrC/worktree`; its `/tmp/as-is-child-vdlCrC/sessions/` is likewise not attributable in result. Missing: task revision/attempt linkage, session/result durable references in child record, attributable expert plan/final gates, terminal child record, scope, diff-check, ancestry, and caller integration. Do not integrate, retry, substitute a role, or touch Phase 2a/migration artifacts.

## Recovery
R10 has terminal validation and final expert approval. Commit only the three allowed paths, verify the resulting caller ancestry and clean worktree, then authorize a fresh component-builder authority-alignment revision. Do not retry r9 or touch Phase 2a/migration.
