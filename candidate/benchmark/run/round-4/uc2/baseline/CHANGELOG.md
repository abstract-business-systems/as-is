# Changelog

## Unreleased

- Fixed the stale `## Installation` section in README.md: the project publishes no package, so the section now documents running the CLI from a checkout with `PYTHONPATH=src python3 -m wordstats.cli count <path>` (decision recorded in `docs/design-notes.md`).
- Adopted as-is documentation: root `as-is.md` component map, `core-utility` component record, and the canonical architecture instruction in `AGENTS.md`.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).