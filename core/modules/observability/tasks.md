# Task

## Requirement
Implement `core/modules/observability:trace-execution-observations` as the next bounded component task. Extend the supplementary fail-closed trace envelope with the minimum bounded debugging context needed to reconstruct delegated execution: task revision, attempt, component identity, worker role, session label/reference, call and relationship identifiers, phase, outcome, duration, wall-clock observations, and source-labelled usage/cost observations with explicit unavailable states. Preserve task authority, privacy, local JSONL behavior, and session-ID-only external projection.

## Plan
1. Read the observability record, tracing design, completed provider-correlation contract, tracer implementation/tests, and selected backlog row.
2. Define the smallest typed allowlisted event attributes and outcome/phase domains without adding provider mapping or task authority.
3. Add provider-free lifecycle and projection fixtures for delegated flow, retries, unavailable measurements, malformed telemetry, and privacy boundaries.
4. Validate focused observability suites, task record, diagnostics, and diff; obtain final expert review before completion.

## Progress
Task-start pair created. The provider-correlation contract is complete and establishes that provider request identity remains unavailable unless explicitly observed. This task owns trace envelope/projection behavior only; launcher, evidence-query, provider, session, and Collector work remain separate. Added a versioned bounded observation envelope and shared local/OTLP projection. Added provider-free delegated-flow, retry, outcome, measurement, malformed-input, and privacy fixtures. No descendants were authorized or launched.

## Validation
- `bun test core/modules/observability/tracer.test.ts core/modules/observability/lifecycle-hierarchy.test.ts core/modules/observability/provider-correlation.test.ts core/modules/observability/session-reference-policy.test.ts`: 35 passed, 0 failed, 196 expectations.
- `bun core/modules/task-control/task-record-validator.ts .`: `VALID`.
- `bun build --no-bundle --target bun --outfile /tmp/as-is-observability-tracer.ts core/modules/observability/tracer.ts`: passed.
- VS Code diagnostics for `tracer.ts` and `tracer.test.ts`: none.
- `git diff --check`: passed.
- Final expert review: conditionally safe pending complete fixture coverage; the requested fixture coverage was then added and focused tests passed.

## Result

The tracer now accepts only fixed, bounded observation kinds, sources, availability states, units, reasons, and values. It records schema version 1, task/attempt/component/role/session/job/call/relationship/phase/outcome/timing/usage observations, preserves explicit unavailable measurements, and drops malformed telemetry without affecting execution. Local JSONL and OTLP share fail-closed projection; OTLP excludes session label/local-session observations and exports only validated `session.id`. Task records remain authoritative.

Completed trace execution observations. Added a versioned fail-closed bounded observation envelope and shared local/OTLP projection for task revision, attempts, component and worker identity, session correlation, jobs/calls/relationships, phases, outcomes, timing, and source-labelled usage/cost observations with explicit unavailable states. Added provider-free delegated-flow, retry, outcome, measurement, malformed-input, privacy, and session-ID-only export fixtures. Validation: 35 focused tests passed with 196 expectations; task-record validator VALID; no-bundle tracer build passed; VS Code diagnostics were clear; git diff --check passed. No descendants were authorized or launched. Residual risk: runtime producer coverage, live collector interoperability, and dependent evidence queries remain separate work.
## Blockers And Escalations
None. The selected backlog row is `core/modules/observability:trace-execution-observations`.

## Recovery
If interrupted, preserve this task pair and any observability-only changes. Do not modify launcher, evidence, task-control, or parent records. Recover from the last committed checkpoint and keep unrelated session-directory changes untouched.

## Control Plane

- control-plane: {"checkpoint":"2026-08-18T22:37:52Z","event":"completion-result","result":"Completed trace execution observations. Added a versioned fail-closed bounded observation envelope and shared local/OTLP projection for task revision, attempts, component and worker identity, session correlation, jobs/calls/relationships, phases, outcomes, timing, and source-labelled usage/cost observations with explicit unavailable states. Added provider-free delegated-flow, retry, outcome, measurement, malformed-input, privacy, and session-ID-only export fixtures. Validation: 35 focused tests passed with 196 expectations; task-record validator VALID; no-bundle tracer build passed; VS Code diagnostics were clear; git diff --check passed. No descendants were authorized or launched. Residual risk: runtime producer coverage, live collector interoperability, and dependent evidence queries remain separate work."}

## Next Action
Complete the task through task control and the scoped completion commit; then begin the dependent evidence-query task.
