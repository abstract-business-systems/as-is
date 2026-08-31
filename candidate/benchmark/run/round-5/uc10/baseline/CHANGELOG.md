# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).
## 1.1.0 — count --stats summary option

- Added a `--stats` option to `wordstats count`: prints `[<counts object>, <summary object>]` as sorted 2-space-indent JSON, where the summary object contains `min`, `max`, `median` (mean of the two middle values for an even number of counts), and `unique` (distinct word count); empty input yields all zeros. Default output without `--stats` is unchanged.
- Added `src/wordstats/stats.py` implementing the summary computation; focused unit tests in `tests/test_stats.py`.
- Adopted as-is agent-workflow configuration (root and component records, `AGENTS.md`, worker/expert role files) per the benchmark setup; design decision recorded in `docs/design-notes.md`.
- Implemented by a delegated component-builder child within its recorded $0.02/180 s task budget; validated with `checks/validate.sh` (compile, 9 unit tests, CLI smoke diff) and an independent read-only expert review.
