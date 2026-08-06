# Observability Backlog

Open or deferred planning items owned by this component. Completed items are
removed after their concise summary is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| jaeger-support | open | 2 | 1 | Provide bounded local Jaeger support for observability | Configure and verify local Jaeger support and bounded trace queries. | - | Local Jaeger path and bounded queries are exercised, with unavailable-backend behavior recorded. | Original dependency text: Current tracer and approved endpoint configuration. |
| trace-retention | open | 1 | 1 | Bound local trace retention and storage cost | Add local JSONL rotation, retention, and size limits. | - | Limits are deterministic, tested, and fail safely without affecting task authority. | Original dependency text: Retention and privacy policy. |

| jaeger-collector | Deferred | Add a Collector only if direct export demonstrates a concrete need. | `jaeger-support` evidence. | Collector is added only with documented need, bounded deployment, and validation. | deferred |
| richer-trace-observability | Medium | Extend trace observability with execution context and useful session queries. | `all-in-tracing-design` approval and successful dummy delegation rehearsal. | Record session IDs on every relevant lifecycle event; local `analyze_session` supports summary, full selected entries, paging, and role/tool filters; external sinks carry only opaque session IDs and never local session data. | open |
| session-jsonl-replacement | Medium | Evaluate whether repository-local traces can replace Pi session JSONL for bounded execution diagnostics. | Existing local JSONL tracer, event schema, documented session-reference mapping, and effective user/file ownership of local session data. | Evaluate reference-based launch, model, tool, usage, delegation, handoff, outcome, and timing diagnostics without making session content an external trace payload; local session files remain the readable evidence source unless a future approved migration proves otherwise. | open |
