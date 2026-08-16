# Task

## Requirement
Implement `core/adapters/process:enforce-process-adapter-emitted-path-policy` at the process-adapter public result boundary only. Preserve private process, workspace, log, record, and recovery operands and all existing lifecycle mechanics while preventing direct or indirect filesystem paths from public handles, durable observations, host observations, diagnostics, recovery results, and nested structured values. Keep task-record authority in task control and do not change launcher/recovery projections, bounded-process-supervisor mechanics, tracer filtering, Git/worktree integration, handoff semantics, or completion authority.

## Plan
1. Read the process adapter record, selected backlog row, execution-contract privacy policy, supervisor implementation/tests, bounded-process-supervisor boundary, and recent evidence-tool enforcement.
2. Inventory exported result and handle surfaces, distinguish private operational inputs from emitted values, and define a supervisor-local fail-closed projection without creating a shared sanitizer.
3. Add provider-free fixtures for handles, durable observations, host observations, diagnostics, permission/cancellation/recovery/handoff/cleanup results, nested malformed values, and complete raw serialized-output absence.
4. Preserve and rerun lifecycle, cancellation, cleanup, recovery, stale, budget, handoff, task-record, and no-leftover regression tests; run no-bundle build, task/content/backlog validation, JSON parsing, diff-check, diagnostics, and final configured-large review.
5. Record completion evidence and clean exactly the selected backlog row and task artifacts in the scoped completion commit.

## Progress
Selected exact backlog identity `core/adapters/process:enforce-process-adapter-emitted-path-policy`. The supervisor currently exposes `JobHandle` fields containing `recordPath`, `runtimeDir`, `workspacePath`, and `statePath`; `DurableRecordObservation` exposes `path`, raw task Markdown, and arbitrary checkpoint details; `JobObservation` exposes logs; recovery returns the complete `LaunchRequest`; and several diagnostics preserve host error text. The bounded mechanical supervisor remains out of scope because its returned process result does not emit the private request operands. Scope is limited to `core/adapters/process/supervisor.ts`, its focused tests, this task record, and the owning backlog/changelog; no descendants are authorized.

## Validation
Pending. Acceptance requires focused process-adapter privacy and lifecycle tests, no-bundle build, task-record/content/backlog validation, JSON parsing, `git diff --check`, changed-file diagnostics, and final configured-large expert review. Residual risk must retain separately owned launcher/recovery, evidence-tool, tracer, registry/diagnostic, and host-adapter surfaces.

## Result
Pending.

## Blockers And Escalations
None.

## Recovery
Private handles and durable raw record operands must remain usable for internal lifecycle operations, but they must not cross emitted boundaries. If interrupted, restore the selected backlog/task pair from Git before retrying. Do not edit the bounded mechanical process supervisor, launcher/recovery projection, tracer, task-control authority, Git/worktree integration, or completion flow.

## Next Action
Implement the supervisor-local public projection, add provider-free privacy fixtures, run the required validation and final expert review, then complete the selected task through the two-commit lifecycle.
