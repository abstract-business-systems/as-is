# Changelog

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

## Unreleased — as-is adoption and validation documentation

- Adopted as-is documentation: root `as-is.md` plus component records `src/wordstats/as-is.md` and `checks/as-is.md`, and `AGENTS.md` with the canonical architecture instruction.
- Added `docs/validation.md`, a new-reader explanation of deterministic validation with a Mermaid sequence diagram of the validation flow. Documentation only; `checks/validate.sh` and validation semantics are unchanged.