# Task

## Requirement
Implement deterministic local JSONL segment rotation, age retention, and bounded segment count for the file tracer while preserving configured filename/directory compatibility, fail-closed projection, opaque session-ID-only export, and telemetry-only authority.

## Plan
- Extend only the observability tracer configuration and file-backend path with an optional bounded `max-files` setting and deterministic managed-segment rotation.
- Preserve the active configured filename/directory forms, complete JSONL segments, exact-size admission, oversized-record drop behavior, age-based opportunistic cleanup, and unrelated-file safety.
- Add focused temporary-directory tests for rotation, count/age retention, invalid settings, boundary records, failure isolation, and existing privacy/lifecycle/OTLP behavior.
- Run focused observability suites, task-record/content/JSON/whitespace checks, and fresh final expert validation before completion cleanup.

## Progress
- Task selected as `core/modules/observability:trace-retention`; exact backlog identity and active task pair are present.
- Plan gate reviewed current append-only size admission and opportunistic age cleanup. The safe implementation boundary is limited to `tracer.ts`, focused tracer tests, and task artifacts; no sibling component or external backend changes are authorized.
- No descendants are authorized; closure will be vacuously terminal.

## Validation
Pending implementation and focused retention checks.

## Result
Pending.

## Blockers And Escalations
None at start. Cross-process concurrent rotation correctness is residual risk and is not part of this task. Live external collector validation is not required for the local-file-only change.

## Recovery
Checkpoint: selected backlog row and active task pair are present; implementation has not started. If interrupted, preserve the task pair and selected row, inspect any retained scoped edits, and restore or continue from the last validated checkpoint. Trace segments are supplementary and never task recovery authority.

## Next Action
Implement the smallest bounded file-backend rotation and retention change, then add focused deterministic tests.
