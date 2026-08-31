# Changelog

## Unreleased

- Adopted the as-is agent workflow: added the durable component record `as-is.md`, the machine companion `as-is.json` with local task metadata, and the task narrative `tasks.md`; the ownership map and README now point to the adopted records.
- Added `docs/pipeline.md` explaining the count pipeline for new readers, with a Mermaid flowchart of the CLI → counter → JSON output flow.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).