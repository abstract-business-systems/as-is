# Changelog

## Unreleased

- 2026-09-03: Added optional `wordstats count --stats` output backed by `src/wordstats/stats.py`; the reserved `stats` object reports minimum, maximum, median, and unique-word counts while default output remains unchanged. Added focused summary and CLI tests, and updated component ownership records. Validation: `bash checks/validate.sh` passed with compile, 8 unit tests, and CLI smoke output. The delegated `worker` child was launched once with $0.05/180-second limits and stopped at the wall-clock budget after creating the module; the parent preserved that partial result, completed the remaining integration, and did not re-roll the child. Residual process risk: launcher handoff is incomplete and the child narrative remains pending despite its terminal JSON status.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).