# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`.

| id | priority | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- |
| jaeger-support | Medium | Configure and verify local Jaeger support and bounded trace queries. | Current tracer and approved endpoint configuration. | Local Jaeger path and bounded queries are exercised, with unavailable-backend behavior recorded. | open |
| trace-retention | Low | Add local JSONL rotation, retention, and size limits. | Retention and privacy policy. | Limits are deterministic, tested, and fail safely without affecting task authority. | open |
| trace-e2e | Low | Add end-to-end tracing coverage across sessions, workers, and detached subprocesses. | Stable event model and test fixtures. | Cross-boundary trace assertions pass without making telemetry authoritative. | open |
| jaeger-collector | Deferred | Add a Collector only if direct export demonstrates a concrete need. | `jaeger-support` evidence. | Collector is added only with documented need, bounded deployment, and validation. | deferred |
| richer-trace-observability | Medium | Extend trace observability with approved bounded execution context and queries. | `all-in-tracing-design` approval and successful dummy delegation rehearsal. | Capture only approved model/session/delegation/output/handoff metadata and timing, preserve the 207ms stub baseline, and test bounded queries; session-reference-first is the default and does not authorize raw conversational/tool payloads. | open |
| session-jsonl-replacement | Medium | Evaluate whether repository-local traces can replace Pi session JSONL for bounded execution diagnostics. | Existing local JSONL tracer, event schema, redaction/privacy policy, documented session-reference mapping, and separately authorized session inspection. | Evaluate reference-based launch, model, tool, usage, delegation, handoff, outcome, and timing diagnostics without making session content a normal trace payload; session logs remain host-managed evidence unless a future approved migration proves otherwise. | open |
