# Changelog

## 1.1.0 — unreleased

- Added `wordstats count --rare N` keeping only words with N or fewer occurrences; N must be a positive integer, otherwise the CLI exits 2 with a clear message. Filtering logic lives in new pure helper `src/wordstats/rarewords.py` (`filter_rare`), implemented by a delegated child worker (child component task record: `src/wordstats` task pair, terminal `completed`). Added unit tests for the helper, the `--rare N` option, and its rejection behavior; design decision recorded in `docs/design-notes.md`.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).