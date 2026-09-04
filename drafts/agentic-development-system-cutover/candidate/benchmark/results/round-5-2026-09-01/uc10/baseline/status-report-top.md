## Status report — round-5 uc10 baseline (arm budget: ~$0.01 observed spend, ~22 min wall clock of 3600 s; no budget stop occurred)

### Setup performed and where its records live

Performed per the `as-is-setup` skill (whole-project mode) plus the launcher/role files the pinned harness requires. The reviewable setup plan lives at `.as-is/setup-plan-round5-uc10.md` (working artifact); a before/after path-snapshot diff proved all writes stayed inside the working directory, and `AGENTS.md` contains the canonical as-is architecture statement exactly once. Records now live at:

- `as-is.md` (root map) + `as-is.json` (configuration: records filenames, `provider: openrouter`, model policy, session directory) — commit `bc7b13e`
- `src/wordstats/as-is.md` (component record, `# wordstats - as-is`) + `AGENTS.md` + `agents/component-builder/agent.md` and `agents/expert/agent.md` (launcher-required role files with non-empty `tools:` declarations; copied from the canonical repository with two recorded deviations: model `z-ai/glm-5.3-flash`, thinking `low`) + `.gitignore`
- Seed preserved verbatim in commit `15e80e5`; `.pi/` left untracked (host projection)

### Files changed

- Setup: `AGENTS.md`, `as-is.md`, `as-is.json`, `src/wordstats/as-is.md`, `agents/{component-builder,expert}/agent.md`, `.gitignore`
- Task records + authorization: `docs/design-notes.md` (newest-last note "count --stats summary option"), `tasks.md`, `as-is.json` (root task object), `src/wordstats/as-is.{json,md}` — commit `a38ff4e`
- Child worker handoff: `src/wordstats/stats.py` (new `summarize_counts`), `src/wordstats/cli.py` (`--stats` flag), `tests/test_stats.py` (5 tests) — commit `35280d7`
- Completion: `CHANGELOG.md` entry, `src/wordstats/as-is.md` diagram/prose alignment, paired removal of both `tasks.md` narratives and both `task` objects — commit `3122204`

### Check results (verbatim, exit codes)

`bash checks/validate.sh` — run three times (post-child, pre-commit, final), each exit **0**, final output ends: `compile: OK` … `Ran 9 tests in 0.051s / OK / unit tests: OK / cli smoke check: OK / All checks passed.` The `expected-count.json` smoke diff stayed green (default output unchanged). `git diff --cached --check` exit **0**. Live demo above shows `[counts, summary]` output, empty-input zeros, and unchanged default output. Control plane: `admit-launch` returned `{wallClockSeconds: 180, costUsd: 0.02}`; child and root both reconciled to `completed`; `git merge-base --is-ancestor 35280d7 HEAD` verified.

### How the bounded scope was resolved

Setup → design note → paired task records (root $2/3600 s host-reported; child exactly **$0.02/180 s**, reserve 0) → control-plane `activate` + `admit-launch` → delegation via `spawn-pi-subagent.ts` (`--agent agents/component-builder/agent.md`, `--no-worktree`, `--model z-ai/glm-5.3-flash`, `--budget-wall-clock-seconds 180`, `--budget-cost-usd 0.02`, job `j-mthpj6bs-g72yag`). The **child completed within budget (~$0.004, ~27 s)** — the budget-stop path was armed but not exercised, so no stop-for-direction occurred and no re-roll was needed. Parent-side integration: child ran in the parent worktree (`--no-worktree`), so its commit was already an ancestor; explicit no-separate-integration disposition recorded; parent completed the remaining record alignment the child deferred for budget. One attributable expert plan review (initially failed with ENOENT because the seed ships no `agents/` — resolved by making role files part of setup, then re-run) and one fresh read-only expert final-diff validation (returned **safe to commit**; its shell-less limitation and residual risks recorded in the root result).

### Unresolved questions / residual risk

1. The seed's owner records (`records/`) are mock fixtures and were not reconciled with the new as-is records; they remain as preserved seed material.
2. `CHANGELOG.md` (seed's existing file) was used for the durable history instead of creating a new `changelog.md`, matching the project's established convention.
3. The empty-input `--stats` CLI path is covered at unit level only (`summarize_counts({})`), demonstrated manually above; the expert flagged this as acceptable under the design note's authorization.