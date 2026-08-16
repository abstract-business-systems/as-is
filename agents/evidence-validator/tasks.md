# Task

## Requirement
Update the evidence-validator role contract and durable context for the integrated fixed parameterless `focused_check` capability. Add provider-independent role-owned behavioral coverage while preserving all read-only, task-denial, Git-inspection, same-worktree, no-session, no-approval, no-delegation, no-provider, and no-authority boundaries.

## Plan
- Update `agent.md` and `as-is.md` to describe the fixed code-owned focused suite as evidence collection, not command execution or authority.
- Update the role-owned behavioral test to expect the six fixed tools and verify focused-check admission/profile/report restrictions without editing launcher source/tests.
- Run role-focused tests and structural validation, then prepare the child handoff for root integration.

## Progress
- Created as the sequential evidence-validator child after launcher commits `d7c67ef`, `2c05675`, `88c02f9`, `fd1dd8f`, `8f6e666`, and `ddf221c` were integrated.
- The launcher child remains complete and must not be reopened.
- The configured worker was explicitly replaced from `evidence-validator` to `component-builder` because this child must edit role-owned files while the evidence-validator role is read-only; this is a bounded authority decision, not silent role substitution.

## Validation
Role-focused provider-independent validation passed: `bun test --timeout 20000 agents/evidence-validator/live-behavioral.test.ts` reported 5 tests with 49 expectations; `git diff --check` passed; Git status showed only the four authorized child files, and `git diff --name-status` listed only `agents/evidence-validator/agent.md`, `agents/evidence-validator/as-is.md`, `agents/evidence-validator/live-behavioral.test.ts`, and `agents/evidence-validator/tasks.md`. No provider/live tests were run.

## Result
Role contract, durable context, provider-independent behavioral coverage, and task evidence are complete. Fresh final read-only expert validation is pending one final revalidation against this exact four-file scope.

## Blockers And Escalations
The role contract describes `focused_check` narrowly and does not claim that role prose enforces launcher process safety. Launcher enforcement remains owned by `skills/spawning-pi-subagents`. The prior final reviews failed only because task scope evidence was incomplete; no semantic blocker was identified.

## Recovery
Checkpoint: the four authorized role-owned files are the only changed paths in the controlled child worktree. If final review fails, preserve the active pair and revert no unrelated files; do not edit launcher files or weaken task denial. No descendants are authorized.

## Next Action
Obtain fresh final read-only expert validation against the recorded four-file evidence, then complete the child handoff if it explicitly judges the scope safe to commit.
