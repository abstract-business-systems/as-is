# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`.

| id | priority | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- |
| jaeger-support | Medium | Configure and verify local Jaeger support and bounded trace queries. | Current tracer and approved endpoint configuration. | Local Jaeger path and bounded queries are exercised, with unavailable-backend behavior recorded. | open |
| trace-retention | Low | Add local JSONL rotation, retention, and size limits. | Retention and privacy policy. | Limits are deterministic, tested, and fail safely without affecting task authority. | open |
| trace-e2e | Low | Add end-to-end tracing coverage across sessions, workers, and detached subprocesses. | Stable event model and test fixtures. | Cross-boundary trace assertions pass without making telemetry authoritative. | open |
| jaeger-collector | Deferred | Add a Collector only if direct export demonstrates a concrete need. | `jaeger-support` evidence. | Collector is added only with documented need, bounded deployment, and validation. | deferred |
| richer-trace-observability | Medium | Extend trace observability to expose complete useful execution context and bounded queries. | `all-in-tracing-design` approval and successful dummy delegation rehearsal. | Capture model/session/tool/delegation/output/handoff timing, preserve the 207ms stub baseline, and test bounded queries; privacy controls gate broad raw capture but are not built before the event model is stable. | open |
| session-jsonl-replacement | Medium | Make the repository-local trace file the supported source for bounded execution diagnostics, so Pi session JSONL is no longer required for routine lifecycle and performance investigation. | Existing local JSONL tracer, event schema, redaction/privacy policy, and a documented mapping of currently useful session fields. | Local traces expose the required bounded launch, model, tool, usage, delegation, handoff, outcome, and timing data; focused queries and tests reproduce the current investigation without reading Pi session JSONL; session logs remain only as host-managed fallback evidence during migration. | open |
