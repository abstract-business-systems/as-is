# Changelog

- 2026-08-15: Completed `launcher-regression-fixtures`. Reconciled the launcher thinking-level fixture with current canonical `medium` agent declarations while preserving the validation fixture's intentional `max`; corrected the late-success budget stub to emit valid shell newlines while retaining SIGTERM-ignore escalation coverage; and updated the caller-worktree fixture to validate the distinct integrated commit produced by cherry-pick and its preserved content. The three repaired tests and full launcher suite passed: 47 tests, 0 failures, 295 expectations. Task-record validation, as-is/content navigation (52 records, 50 diagrams), backlog, JSON, and whitespace checks passed. No production launcher, task authority, Pi/provider, extension-placement, or host-integration behavior changed.

- 2026-08-15: Completed `pi-version-aligned-subagent-tools`. Added a manifest-derived exact Pi `0.84.0` contract and launcher preflight for explicit binaries, `PI_BIN`, the discovered skill-local binary, and the package fallback. Each probe uses `--version --no-extensions` before dry-run output or child launch and fails closed on unavailable, nonzero, malformed, ambiguous, mismatched, or incompatible package selections. Focused version tests passed (6 tests, 24 expectations), package launcher build passed, and task/content/backlog/JSON/whitespace checks passed. Final expert validation used only configured `large` (`@preset/abs-large`) and judged the change safe to complete. The broader launcher suite retains three unrelated baseline failures: repository thinking declaration, late-success budget fixture timeout, and caller-worktree ancestry fixture. Extension relocation, host integration, provider behavior, task authority, browser capability, and broader launcher redesign remain separately bounded.

- 2026-08-15: Completed `skill-owned-package-dependencies`. Confirmed that the private `spawning-pi-subagents` package owns its direct `@earendil-works/pi-coding-agent@0.84.0` and `typebox@1.3.7` dependencies through the committed manifest and lockfile, and added bounded package-local launcher and evidence-extension build commands. Frozen offline installation, both builds, and the worker-tool suite (11 tests, 51 expectations) passed; task-record, content/navigation, backlog, JSON, and whitespace checks passed. The repository-wide launcher suite intentionally retains its repository-root fixture contract because it exercises canonical repository resources outside the package. Final expert validation used only the configured `large` preset (`@preset/abs-large`) and judged the scoped change safe to complete. Pi-version preflight, extension relocation, host integration, launcher-test portability, and task/runtime authority remain separately bounded work.

- 2026-08-23: Began Phase 5A configuration-resolution consolidation. Launcher and worker model/configuration adapters now consume reusable configuration-resolver views while preserving project-root, task-record, model, thinking, provider, and tracer behavior. No linked-context or instruction-resolution security behavior changed.

- 2026-08-23: Began Phase 1 of the subagent-first migration by extracting shared agent-resolution functionality into `core/modules/agent-resolution/agent-resolution.ts`. The launcher and in-process worker adapter now consume one parser for agent front matter, declared tools, canonical role lookup, and identity extraction. Added focused `agent-resolution.test.ts` coverage; it passed 4 tests and 10 expectations. Existing launcher and worker behavioral suites remain the validation anchor: 49 passed, with two pre-existing failures for repository thinking declarations and a caller-worktree ancestry fixture. No unrelated runtime behavior or agent contract was changed.
- 2026-08-23: Completed the bounded Phase 4B handoff-eligibility ownership extraction. The pure decision moved from the launcher into the control-plane boundary; the launcher retains all Git, durable-record, descendant, commit-scope, and caller-ancestry observation and only consumes the decision. The implementation was later relocated with the task-control family; direct focused tests cover complete facts and blocker families. No task mutation or integration authority moved.
- 2026-08-23: Completed the bounded Phase 2 process-boundary extraction by moving the launcher supervisor's mechanical child spawn, process-group signalling, wall-clock timer, stdio setup, and exit observation into `core/adapters/process/bounded-process-supervisor.ts`. Pi prompt/profile construction, worktree and Git handling, registry projection, tracing, task evidence, and handoff eligibility remain launcher-owned. Validation passed: `bun test core/adapters/process/supervisor.test.ts` (12 tests, 119 expectations); launcher, worker, and agent-resolution suites reported 53 passed with the two existing thinking-declaration and caller-worktree fixture failures; `git diff --check` passed. No task-record authority or setup behavior changed.
- 2026-08-23: Completed the bounded Phase 3 extraction of session analysis and trace query functionality into `tools/evidence/worker-tools-observability.ts`. The Pi extension remains the thin registration adapter; explicit role admission, `call_subagent`, component-context authority, model/thinking resolution, and tracing emission remain in `tools/agent/subagent-tools.ts`. Removed the global session-store fallback so exact IDs outside current, inherited, or project scopes remain unavailable, and made the `call_subagent` target role explicit to avoid silent role substitution. Direct focused tests cover summary/detail privacy, unrelated-store isolation, malformed trace tolerance, and bounded trace matching. Validation passed: focused observability tests 3 passed and 9 expectations; worker extension tests 11 passed and 57 expectations; the affected linked-context, tracer, session-reference policy, and lifecycle tests passed; content, task-record, syntax, and whitespace checks passed. No physical tools relocation or task authority changed.

- 2026-08-08: Added explicit normal-session loading of the project-local `tools/agent/subagent-tools.ts`, disabled duplicate extension discovery, and forwarded `call_subagent` in normal component-builder tool profiles. Bounded in-process expert `git_inspect` access remains expert-only; subprocess expert validation retains its separate restricted inspection profile. Focused launcher tests (18), Bun build, diff-check, and a fresh in-process expert final gate passed. Residual risk: live provider execution and caller ancestry integration are outside this component's focused prerequisite evidence.
- Kept the launcher/worktree/observation follow-ups here after ownership review.
- Moved cumulative-accounting follow-up ownership to `designs/as-is.md` and `designs/execution-accounting-design.md`.
- Historical investigation found that synchronous nested delegation, repeated recovery, blind waiting, and missing supervisor-owned enforcement caused excessive elapsed time; retain this as rationale only, not as a current handoff or runtime log.

- 2026-08-15: Added a focused parent-side handoff regression test proving that
  otherwise complete facts are eligible when the child commit is integrated,
  but remain ineligible with the `pending-parent-integration` blocker before
  parent integration. No production behavior changed. Validation: the new
  test passed and `git diff --check` passed; the focused launcher suite had 35
  passes and one pre-existing child-commit fixture failure (`committed` was
  false). Expert final review judged the scoped test safe to commit. No
  descendants were authorized; closure was vacuously terminal. Residual risk:
  the existing live handoff fixture failure remains unresolved.

- 2026-08-15: Completed `parent-integration-ownership`. Contracts now make the
  receiving component-builder responsible for semantic handoff review and
  nearest-common-ancestor integration; the launcher only performs mechanical
  handoff and ancestry observation. Isolated commits remain pending until
  integrated, while parent-owned, in-process, and no-change work requires an
  explicit no-separate-integration disposition. Removed the completed backlog
  row. Focused contract and launcher checks remain the validation evidence.

- 2026-08-15: Completed `agent-agnostic-launcher-dispatch` reconciliation. The
  launcher continues to derive ordinary role capabilities from declarative
  agent front matter without per-agent admission branches; the
  `evidence-validator` identity branch remains a fixed read-only host safety
  cap. Added a bounded table-driven dispatch test matrix covering declared
  tools and skills, caller metadata separation, missing and invalid
  declarations, and session/worktree defaults. Focused validation passed: 42
  tests, 268 assertions, and `git diff --check`. No production launcher
  behavior changed.

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

## 2026-08-15 — Legacy record migration

- **Component:** Launcher Host-Config Resolution And Run Observability.
- **Result:** Completed. Validation evidence: Bun build succeeded; dry-run resolved the root `small` preset with explicit provider/model args; unknown literal model values pass through; and `git diff --check` was clean.
- **Validation retained:** - `--dry-run` shows `model` resolved from the root `small` preset and an explicit provider field. - A non-alias model value passes through literally without error. - A child launch runs with `PI_PROVIDER` and `PI_MODEL` unset in the inherited environment (provider+model come from config/agent file). - A real run writes a session file by default; `--no-session` opts out. - `bun build` and the launcher test suite pass; `opencode agent list` still…
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.
