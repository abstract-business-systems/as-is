---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  updated: 2026-08-06T05:45:00Z
  task-revision: session-reference-trace-e2e-recovery-2
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
Builder-reported checks passed: `bun test components/observability/tracer.test.ts` — 9 passed, 84 expectations; Bun tracer build passed; `git diff --check` passed. The expert read the named files and confirmed no scope expansion, but returned `fail / not safe-to-commit` because the durable handoff cleanup had not yet been completed.

## Result
Blocked attempt 1. The deterministic test change remains uncommitted in the preserved builder context; no parent integration occurred.

## Blockers And Escalations
The expert had sufficient read-only permissions. The failure was a handoff-state failure, not a missing permission: the builder invoked final validation before updating the changelog and preparing the required task-record cleanup. Do not retry this revision or bypass the gate. A new recovery revision must explicitly sequence validation evidence, changelog update, task-record removal, and commit, while ensuring the expert reviews the final changed-file set.

## Recovery
No parent files beyond this task record changed. Preserve any builder worktree and registry evidence if available. Prior validation evidence is supplementary and does not establish completion.

## Next Action
Authorize a fresh recovery revision with explicit final-handoff sequencing.
