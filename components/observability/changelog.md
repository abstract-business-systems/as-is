# Changelog

- 2026-08-04: Added a reusable `startSpan`/`finish` lifecycle helper with deterministic IDs and clocks, parent-child relationships, duration and success/failure outcomes, idempotent completion, and telemetry-failure isolation. Added focused tests; file and OTLP backends remain on the existing `emitTrace` path. No raw model/tool output is captured. Parent integration handoff is the scoped component commit; no descendants were permitted or launched.
  Acceptance evidence: `bun test components/observability/tracer.test.ts` reported 4 passed, 0 failed, 12 expectations, covering relationships, 8ms/35ms duration, outcomes, sink failure isolation, file output, and OTLP payload compatibility. Ancestry validation: task delegation limits were depth 0/children 0, so enriched launcher registry and descendant commit evidence are inapplicable; no descendants or nested delegation occurred. Residual risk: no live external OTLP endpoint test. Cleanup: transient `tasks.md` removed after this durable handoff. Parent integration: consume commit `2e326ce` and run cross-component checks.

- 2026-08-04: Validated the existing narrow OTLP `durationMs` behavior with `bun test components/observability/tracer.test.ts` (2 passed, 0 failed, 7 expectations); the focused assertion confirmed a 4ms nanosecond end-time offset. No implementation or capture-scope changes were made.
- 2026-08-04: Established the observability component context and moved the
  Jaeger, retention, end-to-end tracing, Collector, all-in design, and richer
  observability planning items from the root index. No backlog item was
  implemented.
