# As-is setup plan (working artifact)

Working setup artifact for the `as-is-setup` adoption procedure. This plan is not copied into the resulting `as-is.md` record.

- Mode: whole-project mode (no directory argument; the benchmark task directs setup inside this consumer directory).
- Target path: `/home/vc/dev/as-is/candidate/benchmark/run/round-5/uc10/candidate` (the project root for this work).
- Effective boundary: the target and its descendants only. No enclosing project root, sibling directory, or other benchmark arm/use-case path is read or changed.
- Applicable instruction path and disposition: no target-local instruction file exists; `AGENTS.md` is created inside the boundary with the single canonical as-is architecture instruction plus minimal local pointers.
- Root `as-is.md` path and disposition: created at `<target>/as-is.md`; title `# wordstats - as-is` (project's actual name from `README.md`).
- Candidate components and evidence:
  - `wordstats core` (`src/wordstats/as-is.md`) — distinct responsibility (word-count library plus `count` CLI), stable public contract documented in `records/owners/core-utility.md`, independent tests and validation. Confidence: high. Name aligns with the established `core-utility` owner-record vocabulary.
  - No further decomposition: `tests/`, `checks/`, `docs/`, `records/`, `sample-data/` are support artifacts of the same tiny utility, not independently owned components.
- Human disposition: the benchmark task is the reviewable, human-issued instruction directing adoption of the workflow in this seed, and it also directs the subsequent bounded feature work. It is treated as approval for the minimal decomposition above; no mid-run human confirmation channel exists in this arm. Recorded as an assumption.
- Planned writes: `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `docs/as-is-setup-plan.md`, `records/owners/stats.md`, edits to `records/ownership-map.md` and `docs/design-notes.md`. Task pairs (`as-is.json` + `tasks.md` at root and at `src/wordstats/`) are created by task management when the bounded task starts, per `core/contracts/component-task-record-protocol.md`.
- Excluded out-of-scope paths: everything under the enclosing `candidate/benchmark/` tree outside this working directory; no other project files are modified during setup.
- Diagrams: none planned. The map has a single documented component child; the Components table carries navigation, which avoids unvalidated diagram risk under this arm's budget. Residual risk: none material.
- Validation: record headings (`# <component-name> - as-is`), link targets, canonical instruction present exactly once, and `git diff --check` after writes; before/after path comparison confined to the effective boundary.