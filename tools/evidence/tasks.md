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
- `bun test tools/evidence/worker-tools-observability.test.ts tools/agent/subagent-tools.test.ts`: 22 passed, 0 failed, 107 expectations.
- `bun core/modules/task-control/task-record-validator.ts .`: `VALID`.
- `bun build --no-bundle --target bun --outfile /tmp/as-is-evidence-tools.ts tools/evidence/worker-tools-observability.ts`: passed.
- VS Code diagnostics for `worker-tools-observability.ts` and its tests: none.
- `git diff --check`: passed.
- Final expert reviews: initial blockers for parent/child derivation, selector propagation, unavailable classification, and trace privacy were addressed with implementation and fixture coverage.

## Result

The evidence tools now provide bounded trace filters for task/session/call/worker/revision/attempt/outcome/phase/time, derive parent-child and retry summaries, distinguish missing/inaccessible/malformed/invalid evidence, and preserve exact-ID session inspection scope and detail selectors. Trace query output applies bounded privacy projection that removes path, secret, prompt, tool, content, and exception-bearing fields; session conversational/tool detail remains available only behind exact readable-session selectors.

Completed trace and session debug queries. Added bounded trace filters for task-derived session name, local session ID, trace ID, call ID, worker role, task revision, attempt, outcome, phase, and time range. Added parent-child and retry correlation summaries, explicit malformed/missing/inaccessible/invalid availability, and bounded privacy projection removing paths, secrets, prompts, tools, content, and exceptions from trace results. Preserved exact-ID Pi session scope, paging, detail selectors, and supplementary authority. Validation: 22 focused evidence/agent tests passed with 109 expectations; task-record validator VALID; no-bundle evidence build passed; VS Code diagnostics clear; git diff check passed. No descendants were authorized or launched. Residual risk: live external trace backends and provider-session runtime behavior remain outside this task.
## Blockers And Escalations
None. The selected backlog row is `tools/evidence:trace-and-session-debug-queries`.

## Recovery
If interrupted, preserve this task pair and evidence-only changes. Do not modify observability, launcher, session-directory, task-control, or parent records. Recover from the last committed checkpoint and keep unrelated session-directory changes untouched.

## Control Plane

- control-plane: {"checkpoint":"2026-08-18T22:43:05Z","event":"completion-result","result":"Completed trace and session debug queries. Added bounded trace filters for task-derived session name, local session ID, trace ID, call ID, worker role, task revision, attempt, outcome, phase, and time range. Added parent-child and retry correlation summaries, explicit malformed/missing/inaccessible/invalid availability, and bounded privacy projection removing paths, secrets, prompts, tools, content, and exceptions from trace results. Preserved exact-ID Pi session scope, paging, detail selectors, and supplementary authority. Validation: 22 focused evidence/agent tests passed with 109 expectations; task-record validator VALID; no-bundle evidence build passed; VS Code diagnostics clear; git diff check passed. No descendants were authorized or launched. Residual risk: live external trace backends and provider-session runtime behavior remain outside this task."}

## Next Action
Complete the task through task control and the scoped completion commit.
