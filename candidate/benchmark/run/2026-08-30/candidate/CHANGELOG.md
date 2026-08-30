# Changelog

## 1.1.0 — `count --top N`

- Added `--top N` to `wordstats count`: prints only the `N` most frequent words as a JSON object with alphabetically sorted keys; ties break alphabetically; default output unchanged; zero, negative, or non-integer `N` rejected with exit code 2.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).