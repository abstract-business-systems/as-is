---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-06T06:15:00Z
  task-revision: session-reference-trace-e2e-recovery-3
  attempt: 1
constraints:
  cost:
    currency: USD
    allocated: 0.45
    spent: 0.00
    reserve: 0.08
    source: unavailable
    fallback-metric: host-observed elapsed-seconds only; not monetary cost
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 360
      spent-seconds: 0.00
      reserve-seconds: 60
      source: fresh bounded user authorization
  external-effects: require-current-turn-user-approval
acceptance:
  - Add deterministic observability end-to-end coverage for session-reference producer behavior without live providers or session-store access.
  - Verify parent session reference appears only as bounded typed metadata on call_subagent and worker.result success/failure traces.
  - Verify trace/span/delegation relationships and absence of raw prompt, response, tool argument/result, absolute path, URL, or secret content.
  - Verify absent/invalid session IDs omit the reference without blocking worker behavior or telemetry.
  - Keep changes strictly inside components/observability/; do not modify .pi extensions, launcher, setup, roles, session storage, or product components.
  - Expert plan and final direct-file validation pass before a scoped commit.
---
# Session-reference trace end-to-end validation

## Requirement
Add deterministic end-to-end observability coverage for the approved session-reference runtime contract. Since runtime producer code is outside this component boundary, model the producer event inputs at the tracer boundary and validate serialization/export behavior, relationship fields, raw-content exclusion, and invalid/missing reference handling. Do not call a live provider, read a Pi session store, or modify runtime producers.

## Scope
Only components/observability/. Expected changes are tracer tests and component task/changelog records. Existing schema and sink behavior must remain compatible.

## Plan
Extend focused tracer tests with representative parent `SessionReference` events for start, success, and failure, assert local JSONL and OTLP contain only bounded session-reference metadata, assert trace/span/parent relationships remain intact, and assert invalid or absent references are omitted atomically. Include forbidden-content and path/URL cases. Preserve existing local-full/export-bounded raw-payload tests as legacy sink-policy coverage; do not broaden capture.

## Validation
Builder-reported checks passed: `bun test tracer.test.ts` — 9 passed, 60 expectations; tracer Bun build passed; `git diff --check` passed; scoped status contained only the expected component files. Final expert direct-file validation failed: it identified no explicit absent-reference assertion and could not independently verify Git scope with read-only tools.

## Result
Blocked attempt 1. The deterministic test changes remain uncommitted; no parent integration occurred.

## Blockers And Escalations
The expert had sufficient direct-file permissions. This is an evidence/coverage blocker, not a permission blocker. Do not retry this revision, remove tasks.md, or commit without fresh authorization. A new recovery must add the explicit absent-reference assertion and use host executable checks as separate evidence while the expert reviews content and scope.

## Recovery
Preserve the current builder worktree and registry evidence if available. No runtime producer or cross-component edits are authorized. Prior revisions `e1293f0`, `7365ae1`, and `f821f61` remain recovery evidence and are not retried.

## Next Action
Await fresh authorization to address the missing assertion and repeat the final handoff sequence.
