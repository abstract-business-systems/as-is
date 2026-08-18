# Task

## Requirement
Implement `core/modules/observability:trace-execution-observations` as the next bounded component task. Extend the supplementary fail-closed trace envelope with the minimum bounded debugging context needed to reconstruct delegated execution: task revision, attempt, component identity, worker role, session label/reference, call and relationship identifiers, phase, outcome, duration, wall-clock observations, and source-labelled usage/cost observations with explicit unavailable states. Preserve task authority, privacy, local JSONL behavior, and session-ID-only external projection.

## Plan
1. Read the observability record, tracing design, completed provider-correlation contract, tracer implementation/tests, and selected backlog row.
2. Define the smallest typed allowlisted event attributes and outcome/phase domains without adding provider mapping or task authority.
3. Add provider-free lifecycle and projection fixtures for delegated flow, retries, unavailable measurements, malformed telemetry, and privacy boundaries.
4. Validate focused observability suites, task record, diagnostics, and diff; obtain final expert review before completion.

## Progress
Task-start pair created. The provider-correlation contract is complete and establishes that provider request identity remains unavailable unless explicitly observed. This task owns trace envelope/projection behavior only; launcher, evidence-query, provider, session, and Collector work remain separate.

## Validation
Pending.

## Result
Not yet available.

## Blockers And Escalations
None. The selected backlog row is `core/modules/observability:trace-execution-observations`.

## Recovery
If interrupted, preserve this task pair and any observability-only changes. Do not modify launcher, evidence, task-control, or parent records. Recover from the last committed checkpoint and keep unrelated session-directory changes untouched.

## Next Action
Implement the bounded trace observations and focused tests.
