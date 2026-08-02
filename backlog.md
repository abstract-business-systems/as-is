# Backlog

This is a planning index, not task authority. Active work remains owned by
the relevant root or component `as-is.md` record.

## Open Items

- **Configure and verify Jaeger support for universal tracing.**
  - Resolve the tracer configuration from the base project `as-is.md` for both
    in-process `call_subagent` workers and detached component-building
    subprocesses.
  - Provide a local Jaeger deployment/setup path under ignored
    `.as-is/` without committing generated state or credentials.
  - Verify OTLP HTTP export, Jaeger UI visibility, retention expectations, and
    graceful behavior when Jaeger is unavailable.
  - Ensure `search_traces`, `get_trace`, `summarize_trace`, and
    `compare_traces` can use the configured backend or the shared local file
    fallback with bounded, redacted results.
  - Record the configuration and validation evidence in a bounded component
    task record before marking this item complete.

- Add trace rotation/retention and size limits for the local JSONL fallback.
- Add an end-to-end test covering user session → `call_subagent` → worker trace
  query and user session → detached subprocess → supervisor trace query.
- Add a Collector only if direct Jaeger export demonstrates a need for
  buffering, retry, redaction routing, or multi-user local observation.

## Decisions And Boundaries

- Tracing is universal: it covers control-plane, model/agent, tool,
  subprocess, validation, recovery, and other runtime operations. Subagent
  calls are one important traced flow, not the scope boundary.
- The base project `as-is.md` is the authoritative authored configuration for
  tracer selection. Runtime environment variables may carry a resolved copy to
  detached processes but do not replace that authority.
- The supervisor may pass the resolved tracer configuration and trace identity
  to detached subagent processes. It should not own or reinterpret project
  policy; it is a propagation boundary.
- In-process workers should resolve the same base configuration directly when
  the host does not provide an explicit resolved configuration.
- Telemetry remains supplementary and must never replace task records,
  validation, recovery state, or completion authority.
