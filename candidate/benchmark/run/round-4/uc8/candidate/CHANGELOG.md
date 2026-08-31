# Changelog

## Unreleased

- Extracted tokenization (lowercasing, punctuation stripping) from `count_words` into `src/wordstats/tokenize.py`; behavior unchanged. Renaming `sample-data/` to `fixtures/` was requested but stopped for direction: no owner record authorizes it.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).