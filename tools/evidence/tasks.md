# Task

## Requirement
Implement `tools/evidence:trace-and-session-debug-queries` as a bounded read-only query surface over the new trace observation envelope and exact-ID Pi session evidence. Add practical bounded trace filters for task/session/correlation/worker/revision/attempt/outcome/phase/time, plus parent-child and retry correlation summaries. Preserve session ownership scope, exact-ID detail selectors, privacy projection, limits, supplementary authority, and unavailable/malformed states.

## Plan
1. Read the evidence record/design, completed trace observation contract, existing implementation/tests, and selected backlog row.
2. Extend the trace parser and tool schemas with bounded filters and a correlation summary without duplicating observability or session authority.
3. Add provider-free fixtures for multi-field retrieval, parent/child and retry relationships, unavailable/malformed evidence, privacy, and output limits.
4. Validate focused evidence/agent suites, task record, diagnostics, and diff; obtain final expert review before completion.

## Progress
Task-start pair created after the observability dependency completed in commit `6ac9952`. Trace observations are versioned and fail-closed; readable sessions remain the source for provider/model and detailed usage evidence. No cleanup, launcher, provider, Collector, or task-control implementation is in scope.

## Validation
Pending.

## Result
Not yet available.

## Blockers And Escalations
None. The selected backlog row is `tools/evidence:trace-and-session-debug-queries`.

## Recovery
If interrupted, preserve this task pair and evidence-only changes. Do not modify observability, launcher, session-directory, task-control, or parent records. Recover from the last committed checkpoint and keep unrelated session-directory changes untouched.

## Next Action
Implement bounded trace filters and correlation summaries.
