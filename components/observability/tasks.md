---
as-is-version: 2
task:
  status: ready
  worker: component-builder
  updated: 2026-08-06T05:00:00Z
  task-revision: session-reference-trace-e2e-1
  attempt: 0
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
Not started.

## Result
Not available.

## Blockers And Escalations
Stop if the test requires runtime producer changes, session-store access, external services, or raw-content capture. Record a blocker rather than crossing the component boundary.

## Recovery
Recover from this task, components/observability/tracer.ts, tracer.test.ts, and the integrated session-reference schema. No private session state is authoritative.

## Next Action
Launch one bounded component-builder attempt.
