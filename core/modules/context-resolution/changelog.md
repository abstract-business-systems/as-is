# Changelog

- 2026-08-15: Migrated the configuration, instruction, and linked-context resolvers and focused tests into the documented `core/modules/context-resolution/` family. Proven repository-local imports and durable navigation were updated atomically; the three security-distinct APIs, provenance, containment, task-record isolation, untrusted-content, and authority boundaries were preserved. No setup, host projection, browser/environment capability, target write, or unrelated physical relocation changed. The former component records were retired after validation.

- 2026-08-23: Added reusable synchronous and asynchronous configuration-resolution views, including nested client-cwd project-root lookup. The launcher and worker-tools adapter now consume the shared root-to-target cascade instead of duplicating project configuration traversal; local task data remains non-cascading and source provenance/diagnostics remain available. Focused as-is-data, launcher, worker, and affected task-control validation is recorded in the Phase 5A handoff. No source configuration or task authority changed.

- Initial resolver component added for distributed `as-is.json` data.
