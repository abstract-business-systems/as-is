# Task

## Requirement
Implement the explicitly authorized documentation-only reconciliation for `skills/spawning-pi-subagents:dynamic-expert-validation-access`. Compare the backlog item with the existing evidence-validator role, fixed inspection extension, launcher profile, focused tests, and task/validation authority contracts. Do not change runtime, capabilities, roles, or tests.

## Plan
1. Establish the selected backlog row and active task record in a task-start commit.
2. Obtain attributable read-only expert plan and final-diff validation gates.
3. Reconcile wording only where existing evidence proves the intended fixed read-only same-worktree capability; preserve capability-based dispatch, diagnostic metadata, authority boundaries, and worktree semantics.
4. Run focused documentation/content and diff checks, record evidence, and make one scoped completion handoff.

## Progress
The selected row is `dynamic-expert-validation-access`. Existing evidence confirms the fixed `read,grep,find,ls,git_inspect` profile, same-worktree operation, no session/approval/extensions, caller-metadata independence, and no mutation tools. The plan gate failed to prove the full acceptance because the extension does not execute focused checks and provider-backed behavioral cases are skipped. No implementation edits are authorized under that result.

## Validation
- Plan expert (`agents/evidence-validator`) returned `fail`: existing capability proves bounded Git inspection but not the backlog's full “focused checks” acceptance.
- Focused source evidence: `agents/evidence-validator/agent.md`; `scripts/evidence-validator-inspection-extension.ts`; `scripts/spawn-pi-subagent.ts:1007-1045`; `scripts/spawn-pi-subagent.test.ts` fixed-profile and caller-independence tests; `docs/component-task-record-protocol.md` validation-call authority clauses.
- `git diff --check` and documentation structure checks remain to be run after the bounded blocker decision.
- Residual risk: no live provider-backed validation invocation; current evidence is static/dry-run and focused tests are not enabled live.

## Result
Blocked. The existing fixed capability proves bounded attributable Git evidence and non-mutation, but does not prove execution/attestation of focused checks required by the backlog acceptance. Therefore do not remove the backlog row, do not claim completion, and do not alter runtime or tests.

## Blockers And Escalations
The required expert plan gate failed on the acceptance gap. To proceed, task authority must explicitly narrow the acceptance to bounded Git evidence or authorize a separate bounded focused-check evidence mechanism and coverage; neither is authorized here. The current task therefore remains blocked and is not eligible for completion or backlog cleanup.

## Recovery
Preserved `skills/spawning-pi-subagents/backlog.md` row and active task artifacts. Recovery starts by resolving the acceptance decision; no runtime or capability changes were made. No descendants were authorized or present.

## Next Action
Obtain an explicit task-authority decision to narrow the acceptance to the proven bounded Git evidence capability or create a separately authorized focused-check mechanism task. Until then, preserve the active task pair and backlog row; do not modify runtime, capability, role, or test behavior.
