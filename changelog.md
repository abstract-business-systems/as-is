# Changelog

- 2026-08-06: Closed `parent-integration-handoff` after validating the delegated handoff flow end to end: child task records and validation evidence are required; child commit and base SHA ancestry are checked; integration status distinguishes integrated, pending-parent-integration, and not-committed; related work is consolidated into a scoped parent commit; unrelated changes remain unstaged; and failed or incomplete work remains recoverable. Trace output remains supplementary and does not replace task records, logs, or durable Git evidence.

- 2026-08-02: Added supervisor-owned `delegation.lifecycle` tracing for detached execution while preserving `session.lifecycle`; recorded bounded relationship, attempt/depth, handoff, and outcome metadata. Added deterministic success, failure, budget-stop, relationship, handoff, privacy, and session-tracing coverage. Focused validation passed (18 tests); read-only expert validation passed.

- 2026-08-04: Aligned root planning with component ownership: configured record
  filenames under `config.records.filenames`, moved skills, validator, and
  observability items to owning backlogs, corrected deterministic-skills
  semantics, and documented an approach for the remaining root item. No
  backlog item was implemented; open/deferred items and completed-item removal
  policy were preserved.

- 2026-08-03: Recovered the prior backlog-policy handoff as scoped commit `a3ec945`; added explicit parent integration/handoff, as-is-routed delegation, and all-in tracing design backlog items. Tracing remains supplementary and best-effort; privacy, security, redaction, retention, and access controls remain explicit future work. Focused tests (6 passed) and `git diff --check` passed; read-only expert validation completed.

- 2026-08-03: Fixed control-plane orientation to use durable `as-is.md` context with transient `task.md` task authority; added writable non-committing worker and large read-only expert roles, project-controlled worker|expert subagent allowlist, and expert-before-commit builder gate. Focused tests and extension build passed.

- 2026-08-02: clarified `as-is.md` as durable component purpose, design, boundary, and links; introduced transient component-level `task.md` records with completion summaries written here before task-file removal; established skill-driven system functionality.
