# Changelog

## Unreleased

- Added `wordstats count --rare N` (keep words with N or fewer occurrences) backed by the new module `src/wordstats/rarewords.py`, implemented by a delegated child worker (component record `records/components/rarewords/`).
- Added `wordstats count --top N` (keep the N most frequent words, ties broken alphabetically) backed by the new module `src/wordstats/topwords.py`, implemented by a delegated child worker (component record `records/components/topwords/`).
- Both options validate N as a positive integer and exit 2 with a clear message otherwise; combined options compose rare-filter first, then top-selection.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).