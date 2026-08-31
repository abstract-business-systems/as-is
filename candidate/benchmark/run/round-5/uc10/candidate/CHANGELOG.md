# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

## Unreleased

- Added `wordstats count --stats`: appends a summary JSON object (min, max, median of the counts, plus the number of unique words) after the counts object; default output unchanged. Summary logic lives in new `src/wordstats/stats.py` (`summarize_counts`); implemented by a delegated child worker (see `src/wordstats/as-is.json`), option integrated in `cli.py`.
- Added focused unit tests for the summary helper (`tests/test_stats.py`) and the CLI option (`tests/test_cli.py`).
- Adopted as-is records: root `as-is.md` map, `src/wordstats/as-is.md` component record, `AGENTS.md` canonical instruction, owner records and setup plan.