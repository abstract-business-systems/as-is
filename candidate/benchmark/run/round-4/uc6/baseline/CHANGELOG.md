# Changelog

## 1.1.0 — total key in count output

- `wordstats count` now also reports a `"total"` key holding the sum of all per-word counts, alongside the word keys (decision in `docs/design-notes.md`; known limitation: a literal input word `total` is overwritten by the sum).

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).