# Changelog

## Unreleased

- Added `--rare N` option to `wordstats count`: keeps only words with N or fewer occurrences; N must be a positive integer (otherwise exit 2 with a clear message). Filtering logic lives in the new `src/wordstats/rarewords.py` helper module.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).