# Task

## Requirement
Implement the launcher-owned half of the root focused-check coordination task. Add only a fixed, parameterless `focused_check` capability to the evidence-validator profile, backed by a code-owned literal deterministic suite and bounded fail-closed evidence. Preserve existing read-only Git inspection and all authority, privacy, session, provider, worktree, and dispatch boundaries.

## Plan
- Implement a parameterless fixed-check tool in the inspection extension with literal identifier, argv/file set, timeout, output caps, and minimal environment.
- Extend only the evidence-validator profile and preserve existing `git_inspect` and all safety restrictions.
- Add focused provider-independent extension/launcher tests, build the extension/launcher, validate the child scope, and prepare the scoped handoff.

## Progress
- Created as the sequential launcher child of the root focused-check implementation task.
- Unrelated pre-existing launcher/process/usage-accounting edits are preserved outside this task and are not in scope.

## Validation
Pending implementation and focused fail-closed tests.

## Result
Pending.

## Blockers And Escalations
The exact deterministic suite file set, fixed argv, timeout, output caps, and minimal environment must remain code-owned and parameterless. No generic command runner or caller-controlled selector is authorized.

## Recovery
Checkpoint: active child task pair exists under the root coordinator. If implementation or validation fails, retain this task and the root backlog row, restore only this child scope, and do not expose a partial focused-check capability. No descendants are authorized.

## Next Action
Implement the fixed extension capability and run focused validation.
