# Changelog

- 2026-08-03: Recovered the prior backlog-policy handoff as scoped commit `a3ec945`; added explicit parent integration/handoff, as-is-routed delegation, and all-in tracing design backlog items. Tracing remains supplementary and best-effort; privacy, security, redaction, retention, and access controls remain explicit future work. Focused tests (6 passed) and `git diff --check` passed; read-only expert validation completed.

- 2026-08-03: Fixed control-plane orientation to use durable `as-is.md` context with transient `task.md` task authority; added writable non-committing worker and large read-only expert roles, project-controlled worker|expert subagent allowlist, and expert-before-commit builder gate. Focused tests and extension build passed.

- 2026-08-02: clarified `as-is.md` as durable component purpose, design, boundary, and links; introduced transient component-level `task.md` records with completion summaries written here before task-file removal; established skill-driven system functionality.
