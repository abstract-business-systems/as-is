# Changelog

## Unreleased

- Fixed the `## Usage` command in the README to the working CLI invocation (`python -m wordstats.cli count`, with `PYTHONPATH=src`); the documented `python -m wordstats` form never worked because the package has no `__main__` module.
- Added a unit test asserting tokens with internal hyphens (for example `well-known`) keep the hyphen and are counted as one word.
- Corrected the 1.0.0 entry: the `count` CLI emits alphabetically sorted JSON (`sort_keys=True`), not insertion-ordered JSON, as verified against `src/wordstats/cli.py`, `records/owners/core-utility.md`, and the smoke-check fixture.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as alphabetically sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).
