# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

## Unreleased

- Added `wordstats count --rare N` for retaining words at or below a positive frequency threshold.
- Added `wordstats count --top N` for retaining the N most frequent words with alphabetical tie-breaking.
- Added focused CLI tests covering filtering composition and invalid option values.