# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

## 2026-08-31 — count filters

- Completed the bounded `wordstats` filter task: `--rare N` keeps words occurring at most N times and `--top N` keeps the N most frequent words with alphabetical tie-breaking; both reject non-positive or non-integer N with argparse exit 2.
- Added `src/wordstats/rarewords.py`, `src/wordstats/topwords.py`, focused helper/CLI tests, and the corresponding design/as-is/task records. The two helper children ran concurrently with disjoint write sets; parent review recorded no-separate-integration dispositions.
- Validation: `bash checks/validate.sh` passed; 11 unit tests passed; `git diff --check` passed. Residual risk: no live external integration or rendered Mermaid check is in scope.