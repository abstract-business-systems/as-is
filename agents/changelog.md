# Changelog

- 2026-08-12: Updated the Agents container diagram to show independent role routing: component work routes to component-builder, evidence analysis routes to execution-advisor, and bounded report-only advice routes to worker. Clarified that arrows are supported relationships rather than a mandatory delegation chain. Validation: direct role-link and Mermaid structure checks plus `git diff --check` passed. Residual risk: the diagram does not model host admission or durable task-record details as separate nodes.

- 2026-08-22: Removed the `Design` sections from the agents and worker component records at the user's request. Runtime role contracts remain unchanged.

- 2026-08-22: Refined the agents design view to distinguish independent role contracts, host admission, durable repository context, and reusable skills. Updated the diagram and surrounding explanation without changing runtime behavior; `git diff --check` and direct role-link inspection passed.

- 2026-08-15: Completed `agent-owned-tool-capabilities`. Canonical agent contracts remain the source of ordinary tool declarations; launcher admission validates and forwards them without identity-based injection, while the owning host/package provides implementations and read-only safety profiles remain explicit caps. Removed the completed backlog row. Focused launcher admission and non-mutation coverage remains the validation evidence.

## 2026-08-15 — Legacy record migration

- **Component:** Agents.
- **Result:** Completed the agents-scope documentation record and future maintenance rule.
- **Validation retained:** Root integration should validate record structure, links, naming, and `git diff --check`. No runtime behavior is changed.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.
