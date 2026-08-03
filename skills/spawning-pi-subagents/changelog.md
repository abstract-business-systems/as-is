# Changelog

- 2026-08-06: Added an implementation-ready adaptive session budgeting schema contract for authorization/lease and checkpoint records, including bounded lifecycle, cumulative hard-ceiling admission, failure recovery, and scoped retention references. Runtime control, session inspection, automatic extension, and resume/fork remain unimplemented; dynamic expert validation access remains open.

- 2026-08-06: Added the open `dynamic-expert-validation-access` backlog item and temporarily enabled read-only inspection tools (`read,grep,find,ls,bash`) in the expert role so builder-controlled validation can inspect Git status, exact diffs, and focused checks. The expert contract explicitly prohibits mutating commands, delegation, web access, and authority changes; runtime launcher behavior is unchanged.

- 2026-08-06: Reviewed the `adaptive-session-budgeting` contract and recorded its capability gap: soft execution leases, hard safety ceilings, checkpoint-and-exit, authorized resume/fork, bounded session analysis, and cumulative accounting are documented, while control-channel, retention, analysis, and runtime continuation remain separately authorized future work. No launcher behavior changed.

- 2026-08-06: Recovered the authorized phase-3 canonical launcher-source updates in `SKILL.md`, `as-is.md`, and the focused test fixture, using top-level `agents/{as-is,component-builder,expert,worker}` while retaining `.agents/agents` only as client projection terminology. Focused launcher tests (16 passed), Bun build, and `git diff --check` passed; final expert validation was required before commit. Residual risk: no live provider execution.

- 2026-08-03: Repaired builder-owned expert attribution by requiring a propagated parent job id for worker/expert launches, while preserving rejection of direct expert launches. Added focused authorization regression coverage; 16 launcher tests passed, Bun build passed, and `git diff --check` passed. Fresh read-only expert plan and implementation validations were launched through the launcher; residual risk is limited to no live provider execution.

- 2026-08-06: Added exactly one `worker.lifecycle` span around the bounded
  child spawn-to-exit run, deterministically parented to `delegation.lifecycle`.
  It records only worker role, bounded outcome class, and span outcome; tests
  cover success, failure, budget-stop, parentage, and raw-content exclusion.
  Focused lifecycle test, Bun build, and `git diff --check` passed. Full launcher
  suite retains unrelated fixture failures; no implementation children were
  delegated.

- 2026-08-05: Added exactly one best-effort `session.lifecycle` span at the launcher boundary. It records only bounded session class, launcher mode, and outcome metadata through the existing tracer; prompts, responses, tool data, privacy boundaries, and runtime authority are unchanged. Validation: launcher tests (13 passed), tracer tests (4 passed), Bun build, and `git diff --check`. One attempt, no descendants; residual risk is limited to no live external backend test.
