# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`.

| id | priority | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- |
| jaeger-support | Medium | Configure and verify local Jaeger support and bounded trace queries. | Current tracer and approved endpoint configuration. | Local Jaeger path and bounded queries are exercised, with unavailable-backend behavior recorded. | open |
| trace-retention | Low | Add local JSONL rotation, retention, and size limits. | Retention and privacy policy. | Limits are deterministic, tested, and fail safely without affecting task authority. | open |
| trace-e2e | Low | Add end-to-end tracing coverage across sessions, workers, and detached subprocesses. | Stable event model and test fixtures. | Cross-boundary trace assertions pass without making telemetry authoritative. | open |
| jaeger-collector | Deferred | Add a Collector only if direct export demonstrates a concrete need. | `jaeger-support` evidence. | Collector is added only with documented need, bounded deployment, and validation. | deferred |
| all-in-tracing-design | High | Design an all-in execution trace model covering useful lifecycle, task, job, worker, supervisor, and outcome information while preserving authority distinctions. | Design review and privacy/security/retention/redaction controls. | Design explicitly defines useful fields, privacy, security, redaction, retention, access, and failure-mode controls before implementation. | open |
| richer-trace-observability | Medium | Extend trace observability to expose complete useful execution context and bounded queries. | `all-in-tracing-design` approval. | Acceptance criteria for privacy, security, retention, redaction, and bounded queries are approved and tested. | open |
