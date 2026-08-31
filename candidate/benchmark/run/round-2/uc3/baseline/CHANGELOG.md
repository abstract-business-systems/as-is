# Changelog

## 1.1.0 — count --min-count option

- Added `wordstats count --min-count N`: omits words with fewer than N occurrences; N must be a positive integer, otherwise the CLI exits 2 with `--min-count must be a positive integer`. Option and validation live in `src/wordstats/cli.py`; filtering lives in the new helper `src/wordstats/topwords.py` (`filter_min_count`). Default behavior without the option is unchanged.
- Added unit tests: `tests/test_cli.py` (option filtering, unchanged default, rejection exit 2 and message) and `tests/test_topwords.py` (>= filtering, order, ValueError branch); `checks/validate.sh` passes (compile, 18 unit tests, CLI smoke).
- As-is setup performed: root `as-is.md`, component record `src/wordstats/as-is.md`, canonical instruction in `AGENTS.md`, and local `agents/` role sources.
- Delegation record (durable summary; transient task records removed at completion per the component task-record protocol): the helper module was implemented by a delegated child component-builder for the component `src/wordstats`; forwarded budgets wall-clock 780 s / cost 0.7 USD (normalized by `admit-launch`); launcher job `j-mtgfyvrs-tcnwei` is mechanical evidence only, the child's component task record was the record of authority and reached `completed` with its own expert gates (plan review call 65801e53476b48218b9c1739e238b167, final validation call 696a3b2e19a04ab9aebee2d26a4e7e31, focused validation 6/6 topwords tests OK); no-separate-integration disposition (shared `--no-worktree` worktree, no child commit; parent owns the scoped commit). Parent expert gates: plan review call 56f091e16bd141ce8b2d31cb9635e133 (PASS), final-diff validation call 7369e81bc40c4664a5a5d43db55c4f9a (SAFE TO COMMIT).

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).