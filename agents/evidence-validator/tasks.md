# Task

## Requirement
Update the evidence-validator role contract and durable context for the integrated fixed parameterless `focused_check` capability. Add provider-independent role-owned behavioral coverage while preserving all read-only, task-denial, Git-inspection, same-worktree, no-session, no-approval, no-delegation, no-provider, and no-authority boundaries.

## Plan
- Update only `agent.md` and `as-is.md` to describe the fixed code-owned focused suite as evidence collection, not command execution or authority.
- Update the role-owned behavioral test to expect the six fixed tools and verify focused-check admission/profile/report restrictions without editing launcher source/tests.
- Run role-focused tests and structural validation, then prepare the child handoff for root integration.

## Progress
- Created as the sequential evidence-validator child after launcher commits `d7c67ef`, `2c05675`, `88c02f9`, `fd1dd8f`, `8f6e666`, and `ddf221c` were integrated.
- The launcher child remains complete and must not be reopened.
- The configured worker was explicitly replaced from `evidence-validator` to `component-builder` because this child must edit role-owned files while the evidence-validator role is read-only; this is a bounded authority decision, not silent role substitution.

## Validation
Pending role-contract updates and provider-independent behavioral coverage.

## Result
Pending.

## Blockers And Escalations
The role contract must describe `focused_check` narrowly and must not claim that role prose itself enforces launcher process safety. Launcher enforcement remains owned by `skills/spawning-pi-subagents`.

## Recovery
Checkpoint: active evidence-validator task pair exists with `component-builder` as the explicitly authorized worker and no descendants. If role coverage cannot remain provider-independent and role-owned, retain this task blocked, preserve the root selected identity, and do not edit launcher files or weaken task denial.

## Next Action
Update the role contract and role-owned behavioral test, then run focused validation.
