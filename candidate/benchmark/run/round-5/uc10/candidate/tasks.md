# Task

## Requirement

Add a `--stats` option to `wordstats count` that appends a summary object to the output containing the minimum count, maximum count, median count, and number of unique words. The summary logic lives in a new module `src/wordstats/stats.py`; the option is integrated in `src/wordstats/cli.py`. The `stats.py` module and its focused unit tests are implemented through a delegated child worker whose child task record budgets it at most $0.02 and 180 seconds (a deliberately tight cap on deliberately nontrivial work). If the child stops on budget, record the stop as a result per the recovery contract, complete remaining work from the parent, and do not re-roll the child. Add unit tests for the summary values and the option, follow the design-note and records conventions, run the checks, and report status.

## Plan

1. Setup (done): as-is adoption per `docs/as-is-setup-plan.md` (root `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `records/owners/stats.md`, ownership-map row, `--stats` design note recorded before implementation).
2. Prepare the child task pair at `src/wordstats/` and launch the leaf worker through the governed launcher (`--agent /home/vc/dev/as-is/candidate/agents/worker/agent.md --cwd <this dir> --no-worktree --model z-ai/glm-5.3-flash`), forwarding the mandated tight budget ($0.02, 180 s).
3. After the child returns (including a budget-stopped return): validate child output against the child record's acceptance; complete any remaining work from the parent; integrate the option in `src/wordstats/cli.py` with CLI tests in `tests/test_cli.py`.
4. Close the child record (terminal status), then this record; summarize in `CHANGELOG.md`.
5. Run `bash checks/validate.sh` and report status.

## Progress

- Setup complete: `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `docs/as-is-setup-plan.md`, `records/owners/stats.md`, ownership-map row for `src/wordstats/stats.py`, and the `--stats` design note in `docs/design-notes.md` (recorded before implementation).
- 2026-08-31T20:40:00Z: task activated; child task pair prepared at `src/wordstats/as-is.json` + `src/wordstats/tasks.md` (budgets: $0.02, 180 s, as mandated by the request).
- 2026-08-31T20:48:00Z: child launched through the governed launcher (blocking, `--no-worktree`, `--model z-ai/glm-5.3-flash`, agent `/home/vc/dev/as-is/candidate/agents/worker/agent.md` with a declared non-empty tool set, budgets 180 s / $0.02 forwarded). Child terminal: `src/wordstats/as-is.json` status `completed` within budget (launcher-reported usage ≈ $0.0027, ~13% of the $0.02 cap; no budget stop occurred, so no stop-for-direction or parent takeover of the child scope was needed). Child output (`src/wordstats/stats.py`, `tests/test_stats.py`) independently validated by the parent against `records/owners/stats.md` before integration — contract match confirmed.
- Parent implemented `src/wordstats/cli.py` (`--stats` flag printing the summary object after the counts object) and `tests/test_cli.py`; descendant closure verified (single terminal child, no failed or cancelled descendants).

## Validation

`bash checks/validate.sh`: compile OK, 12 unit tests OK, CLI smoke check OK, "All checks passed.", exit 0. Manual CLI evidence: `count sample-data/words.txt --stats` prints the counts object then `{"max": 3, "median": 1.0, "min": 1, "unique": 6}` (exit 0); empty input with `--stats` gives `{}` then `{"max": null, "median": null, "min": null, "unique": 0}`; default output without the option is unchanged (smoke check diffs clean). `git diff --check` clean (exit 0). Before/after path comparison confined to the effective boundary. Residual risk: none material; child-reported cost is a launcher usage summary, not a host invoice.

## Result

Completed 2026-08-31T20:50:00Z. All acceptance conditions evidenced: `--stats` appends a summary object (min, max, median, unique) after the counts object, default output unchanged, summary logic in delegated child-built `src/wordstats/stats.py` (child record is the record of authority for the delegation; no budget stop, no re-roll, no parent takeover of the child scope), option integrated in `cli.py` by the parent, focused unit tests for summary values and the option, design note recorded before implementation, ownership map covers all changed areas, all checks pass. No commit was made (no explicit commit request in this turn; working tree left uncommitted by design of the benchmark arm).

## Blockers And Escalations

None. Recorded assumptions: the benchmark task text is the human approval for setup decomposition and for this bounded change (no mid-run confirmation channel exists in this arm); child task-record filenames are set by this acting task-management consumer (`src/wordstats/as-is.json` + `src/wordstats/tasks.md`) per the protocol's placement rules; no commit was requested, so the validated working tree is left uncommitted.

## Recovery

If interrupted: reread this file and `as-is.json`; do not reset cumulative observations. Child state lives in the child record pair; launcher registry output is mechanical evidence only. A failed step is a recorded result, not a re-roll.

## Next Action

None; task terminal. See Result.