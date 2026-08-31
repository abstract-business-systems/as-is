# Changelog

## 1.1.0 — `count --min-count N`

- Added `wordstats count --min-count N`: omits words with fewer than N occurrences; N must be a positive integer, otherwise the CLI exits 2 with a clear message. Default output without the option is unchanged.
- Added `src/wordstats/topwords.py` helper (`filter_min_count`) and focused unit tests for the helper, the CLI option, and its rejection behavior (`tests/test_topwords.py`, `tests/test_cli.py`).
- Adopted the as-is documentation convention (`as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `records/owners/topwords.md`, ownership-map rows, design note in `docs/design-notes.md`).

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).