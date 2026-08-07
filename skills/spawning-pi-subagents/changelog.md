# Changelog

- 2026-08-07: Restored focused worker-tools extension coverage by adding a
  skill-owned private package manifest and offline Bun lockfile with
  `@earendil-works/pi-coding-agent@0.84.0` and `typebox@1.3.7`. The existing
  project extension now resolves these direct dependencies through the
  skill-owned tree, while the focused package script runs from the repository
  root to preserve canonical-agent fixture paths. Validation passed: the
  worker-tools suite passed 6 tests with 31 assertions; launcher regression
  passed 29 tests with 212 assertions; adaptive-session checks passed 2 tests
  with 11 assertions; Bun builds passed for the extension and launcher; and
  `git diff --check` passed. No root manifest, generated dependency tree,
  launcher behavior, extension logic, role contract, or test assertion changed.
  No descendants were authorized; closure was vacuously terminal. The package
  version is intentionally not claimed to align with the shared 0.83.0 Pi host;
  that remains the separate `pi-version-aligned-subagent-tools` backlog item.
  Final read-only validation remains required before commit.

- 2026-08-14: Completed capability-based no-holds-barred delegation. Removed
  launcher caller/identity/parent authorization gates; those values remain
  diagnostic lineage only. The launcher and Pi extension now allow any agent
  with the declared `call_subagent` capability to target any canonical
  `agents/<role>/agent.md`, with bounded canonical role validation and target
  contract/tool resolution. Preserved the expert fixed read-only profile and
  task, budget, session, worktree, and completion boundaries. Updated durable
  `as-is.md` and `SKILL.md` to record the design. Focused launcher validation
  passed with 29 tests and 212 assertions; launcher and extension Bun builds
  and `git diff --check` passed. Source-level extension coverage verified
  canonical target inventory and removal of the old role map. No implementation
  descendants were authorized; closure was vacuously terminal. Final
  read-only validation passed and judged the implementation safe to commit.
  Residual risk: the extension runtime test could not run because this
  checkout has no local `@earendil-works/pi-coding-agent` installation; live
  provider/Pi behavior and broader runtime budget enforcement remain untested.

- 2026-08-13: Added a direct, explicitly authorized parent-side handoff eligibility gate. Finished launcher jobs now remain `incomplete` unless durable task completion, validation, expert/result evidence, terminal descendant closure, scoped commit, and caller-HEAD ancestry all pass; pending-parent-integration and unreachable ancestry remain blockers. Validation: focused launcher tests passed (28 tests, 197 assertions), Bun build passed, and `git diff --check` passed. Residual risk: launcher evidence extraction is bounded text evidence; full task schema and descendant validation remain owned by task management and parent procedures. No descendants were launched.

- Completed backlog dependency normalization for `agent-agnostic-launcher-dispatch`, `skill-owned-package-dependencies`, `pi-version-aligned-subagent-tools`, and `package-owned-subagent-extension`; structured cells now use `component:id` or `-`, with uncertain original prose retained in notes. Validation: `bun test skills/managing-backlog/query.test.ts` (10 passed) and `git diff --check` passed. Parent integration remains pending.
