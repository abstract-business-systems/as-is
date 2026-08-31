# Changelog

## 1.1.0 — rare-word filtering

- Added `--rare N` to `wordstats count`: keeps only words with N or fewer occurrences (inclusive); N must be a positive integer, otherwise the CLI exits 2 with a clear message. Default (no-flag) output is unchanged.
- Added `src/wordstats/rarewords.py` with the non-mutating `filter_rare(counts, max_occurrences)` helper, implemented by a delegated component-builder child worker (bounded launcher job `j-mth9rbgd-s60gpg`, model `z-ai/glm-5.3-flash`, 0.5 USD / 900 s forwarded budget, ~8 s observed; no child commit, parent-owned worktree, explicit `no-separate-integration` disposition). The child's component task record (`src/wordstats/as-is.json` + `src/wordstats/tasks.md`, now cleaned up per protocol; evidence retained in this commit's history) was the record of authority; the launcher registry is mechanical evidence only.
- Added unit tests for the option and its rejection behavior (`tests/test_rarewords.py`); `bash checks/validate.sh` passes.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).