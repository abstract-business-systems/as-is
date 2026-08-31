# Changelog

## Unreleased

- Fixed the README `## Usage` command to the working invocation `PYTHONPATH=src python3 -m wordstats.cli count <file>`; the previously shown `python -m wordstats <file>` never worked (no `__main__.py`, missing `count` subcommand, and `src/` not on the module path).
- Added a unit test pinning that tokens with internal hyphens (for example `well-known`) keep the hyphen and are counted as one word; edge punctuation is still stripped.
- Corrected the 1.0.0 entry's claim that the CLI reports frequencies as insertion-ordered JSON: the implementation has always used `sort_keys=True`, so the output is key-sorted. Documentation-only correction; no runtime behavior changed. The 1.0.0 validation-script claim was verified correct against the repo.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as key-sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).
