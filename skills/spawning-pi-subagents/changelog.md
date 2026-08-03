# Changelog

- 2026-08-03: Repaired builder-owned expert attribution by requiring a propagated parent job id for worker/expert launches, while preserving rejection of direct expert launches. Added focused authorization regression coverage; 16 launcher tests passed, Bun build passed, and `git diff --check` passed. Fresh read-only expert plan and implementation validations were launched through the launcher; residual risk is limited to no live provider execution.

- 2026-08-06: Added exactly one `worker.lifecycle` span around the bounded
  child spawn-to-exit run, deterministically parented to `delegation.lifecycle`.
  It records only worker role, bounded outcome class, and span outcome; tests
  cover success, failure, budget-stop, parentage, and raw-content exclusion.
  Focused lifecycle test, Bun build, and `git diff --check` passed. Full launcher
  suite retains unrelated fixture failures; no implementation children were
  delegated.

- 2026-08-05: Added exactly one best-effort `session.lifecycle` span at the launcher boundary. It records only bounded session class, launcher mode, and outcome metadata through the existing tracer; prompts, responses, tool data, privacy boundaries, and runtime authority are unchanged. Validation: launcher tests (13 passed), tracer tests (4 passed), Bun build, and `git diff --check`. One attempt, no descendants; residual risk is limited to no live external backend test.
