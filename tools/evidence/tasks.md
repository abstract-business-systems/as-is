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
- `bun test tools/evidence/worker-tools-observability.test.ts tools/agent/subagent-tools.test.ts`: 26 passed, 127 expectations.
- `bun build --no-bundle --target bun --outfile /tmp/as-is-evidence-tools.ts tools/evidence/worker-tools-observability.ts`: passed.
- `bun core/modules/task-control/task-record-validator.ts .`: `VALID`.
- VS Code diagnostics for the affected implementation and tests: none.
- `git diff --check`: passed.
- Focused fixtures cover nested registry/trace joins, retry attempts, malformed/missing/inaccessible registry evidence, duplicate and mismatched records, missing parents, cycles, node/depth bounds, explicit source selection, and privacy.

## Result

Implemented a bounded `correlate_job_registry` read-only evidence tool with an explicitly supplied public registry source, strict public-record normalization, opaque job/parent-job and trace correlation, bounded nested nodes and relationships, retry grouping, and explicit unavailable/inconsistency states. Existing session and trace query behavior remains unchanged. Registry paths and unsafe fields are not returned. No provider, external service, launcher lifecycle, observability vocabulary, task authority, or session ownership behavior changed. Residual risk: the append-only public registry remains best-effort evidence and cannot prove complete runtime history; live registry races and external backends remain unvalidated.

Completed correlate-job-registry-with-traces; no descendants; 26 evidence/agent tests passed with 127 expectations, no-bundle evidence build passed, task validator VALID, diagnostics clear, and git diff --check passed. Added bounded public-registry normalization and trace join with nested relationships, retries, explicit missing/malformed/inaccessible/inconsistent states, cycle/limit handling, and privacy-safe output. Existing session and trace query behavior remains unchanged; live registry races and external backends remain residual risk.
## Blockers And Escalations
None. No provider, external service, runtime registry, or live session is required; fixtures will supply bounded public registry records directly.

## Recovery
If interrupted, preserve this task pair and evidence-only changes. Do not modify the launcher, observability, session-directory, task-control, or parent records. Recover from the last committed checkpoint and keep registry reading limited to the explicitly selected public source.

## Control Plane

- control-plane: {"checkpoint":"2026-08-18T23:59:55Z","event":"completion-result","result":"Completed correlate-job-registry-with-traces; no descendants; 26 evidence/agent tests passed with 127 expectations, no-bundle evidence build passed, task validator VALID, diagnostics clear, and git diff --check passed. Added bounded public-registry normalization and trace join with nested relationships, retries, explicit missing/malformed/inaccessible/inconsistent states, cycle/limit handling, and privacy-safe output. Existing session and trace query behavior remains unchanged; live registry races and external backends remain residual risk."}

## Next Action
Record the completion result, remove the selected backlog row and transient task pair, and create the scoped completion commit.
