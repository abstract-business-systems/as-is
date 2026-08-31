# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

## Unreleased

- Adopted the as-is documentation convention: root `as-is.md`, component record `src/wordstats/as-is.md`, and the canonical architecture instruction in `AGENTS.md`.
- `wordstats count` now also reports a `"total"` key holding the sum of all word counts, alongside the per-word counts; smoke-check expectation updated to match.