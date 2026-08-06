# Changelog

- Completed backlog dependency normalization for `agent-agnostic-launcher-dispatch`, `skill-owned-package-dependencies`, `pi-version-aligned-subagent-tools`, and `package-owned-subagent-extension`; structured cells now use `component:id` or `-`, with uncertain original prose retained in notes. Validation: `bun test skills/managing-backlog/query.test.ts` (10 passed) and `git diff --check` passed. Parent integration remains pending.

- Completed `tool-contract-and-completion-gates`: declared the exact ordinary
  tool sets for `as-is` and `component-builder`, removed stale caller tool
  overrides from the as-is launcher examples, and strengthened task lifecycle
  ordering so acceptance validation and terminal descendant closure precede
  changelog handoff, task-record removal, and scoped commit. Focused launcher
  tests (26 passed), both Bun builds, role/reference checks, `git diff --check`,
  and fresh read-only expert validation passed; no implementation descendants
  were launched. Residual risk: the final handoff uses a temporary local
  signing identity because this checkout has no configured signing key.

- Completed `frontmatter-authoritative-tool-admission`: ordinary launcher tool
  admission now comes from agent front matter, conflicting caller overrides and
  unsupported/empty declarations are rejected, missing declarations emit an
  explicit empty tool set, identity-based injection was removed, and the fixed
  expert profile remains launcher-owned. Focused launcher tests (26 passed),
  Bun build, `git diff --check`, and a real configured-provider smoke call all
  passed. Residual risk: roles without declarations need separate contract
  updates to gain tools; real validation used a harmless model call only.

- 2026-08-06: Replaced the temporary expert bash allowance with a launcher-owned bounded inspection profile. Builder-attributed experts now validate the actual same worktree through only the fixed `git_inspect` status/scoped-diff/diff-check/HEAD operations, with no shell, mutation, web, raw session, delegation, authority, or caller capability overrides. Added deterministic profile/authorization coverage; 17 focused launcher tests passed, Bun build and `git diff --check` passed. Same-worktree expert plan and final validations passed; final validation marked the implementation safe to commit. Residual risk: no live provider execution.

- 2026-08-03: Added a dependency-free adaptive-session-budgeting record validation and lifecycle-transition module for authorization/lease, checkpoint, and checkpoint-operation records. It enforces closed fields, core identity/schema/accounting bounds, required failure data, and documented fail-closed transitions without process control, IPC, session reads/analysis, resume/fork, extension, or cleanup behavior. Focused tests (2 passed), Bun build, and `git diff --check` passed; same-worktree expert plan/final validations passed, with final validation declaring the implementation safe to commit. Residual risk: persistence, temporal semantics, idempotency storage, retention-reference checks, and runtime integration remain future work; dynamic-expert-validation-access remains read-only and open.

- 2026-08-06: Added the documentation/schema-only adaptive-session-budgeting checkpoint operation and control-channel contract. It defines authority-bound request identity, append-only lifecycle and acknowledgements, safe-boundary/non-cooperation outcomes, idempotency, lease expiry and hard-stop distinctions, durable-before-exit ordering, fail-closed recovery, and opaque retention references. `dynamic-expert-validation-access` remains open and read-only; no launcher/runtime, IPC, session analysis, resume/fork, extension, or cleanup behavior changed. Residual risk: future transport, persistence, retention enforcement, and runtime behavior remain unimplemented. Same-worktree expert final validation passed and explicitly marked the diff safe to commit.

- 2026-08-06: Defined the adaptive-session-budgeting retention/worktree contract: approved project-controlled store scope, opaque non-content references, expiry versus artifact deletion, authority-gated cleanup with audit/disposition evidence, ownership boundaries, fail-closed resumability, and lease/checkpoint state interactions. Documentation/schema only; runtime, store reads, analysis, automatic continuation, and cleanup behavior remain unimplemented. Residual risk: no runtime store or validator exists; dynamic-expert-validation-access remains open.

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
