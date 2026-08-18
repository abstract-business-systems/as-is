# Task

## Requirement
Implement `tools/evidence:correlate-job-registry-with-traces` as a bounded read-only join over trace events and one explicitly selected public job-registry source. Reconstruct nested execution and retries through opaque job and parent-job identifiers while preserving trace/session/registry separation, privacy, unavailable states, and supplementary authority.

## Plan
1. Add a provider-free normalized registry reader and pure trace/registry correlation core within the evidence component.
2. Expose one bounded evidence tool without changing existing exact-ID session or trace query behavior.
3. Add deterministic fixtures for nested launches, retries, missing/malformed/inaccessible/inconsistent registry evidence, trace mismatches, cycles, duplicate IDs, privacy, and limits.
4. Validate focused evidence/agent suites, task record, no-bundle build, diagnostics, whitespace, and final diff review.

## Progress
Task selected after the launcher producer dependency completed in `30b8e1d`. The evidence boundary owns the join/query surface; launcher registry lifecycle and observability vocabulary remain external authorities. The plan review recommended a pure join core, one explicit registry source, strict normalization, bounded tree construction, and explicit inconsistency reporting.

## Validation
Pending implementation.

## Result
Pending implementation and validation.

## Blockers And Escalations
None. No provider, external service, runtime registry, or live session is required; fixtures will supply bounded public registry records directly.

## Recovery
If interrupted, preserve this task pair and evidence-only changes. Do not modify the launcher, observability, session-directory, task-control, or parent records. Recover from the last committed checkpoint and keep registry reading limited to the explicitly selected public source.

## Next Action
Implement the normalized registry reader, pure correlation core, bounded query tool, and focused fixtures.
