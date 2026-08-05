# Changelog

- 2026-08-13: Added evidence-gated cleanup of implemented backlog rows by exact item ID and completion language in the owning changelog. Added deterministic cleanup tests for positive, ambiguous, and cross-component cases.
- 2026-08-13: Completion evidence for `backlog-table-schema`, `backlog-query-weighting`, and `backlog-response-shape-validation` is recorded in this changelog; these implemented planning items are eligible for cleanup.

- 2026-08-08: Added the stable backlog recording table, deterministic integer preference migration, query-time dependency-aware weighting, repository migration, and focused schema/query tests. Uncertain legacy dependency text is retained in notes.
- 2026-08-08: A fresh Pi “Show me the backlog, please.” validation exposed a presentation defect: the agent returned only weight, component, id, status, and purpose, and omitted description, dependencies, and notes. Added an exact representation-column validator and regression test; the deterministic query already emitted all requested columns.
