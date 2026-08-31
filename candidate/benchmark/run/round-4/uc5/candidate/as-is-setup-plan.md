# As-is setup plan (working artifact; not part of the canonical records)

Reviewable dry-run plan produced by the `as-is-setup` skill before any write.

- Mode: whole-project mode (no directory argument; the request targets adopting the workflow in this existing project).
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc5/candidate` (project root; git-init'd seed with no initial commit).
- Effective boundary: the target directory and its descendants. No parent project root or sibling path is required or changed.
- Applicable instruction path and disposition: `AGENTS.md` does not exist (the seed intentionally ships no agent-workflow configuration). Plan: create it at the target root containing only the single canonical `as-is.md` architecture instruction; no existing guidance is replaced.
- Root record path and disposition: `as-is.md` (create; root record, lineage `**as-is**`).
- Candidate components (semantic evidence, not directory names):
  - `wordstats` at `src/wordstats/` — high confidence. Evidence: distinct responsibility (word-count logic plus `count` CLI surface), a documented public contract (lowercased tokens, edge punctuation stripped, punctuation-only tokens ignored, sorted JSON CLI output), and an existing component-scoped owner record (`records/owners/core-utility.md`) that treats `src/wordstats/` as one change-scope unit.
  - No other candidates: `checks/` (one validation script, no independent lifecycle or complexity), `tests/`, `sample-data/`, `docs/`, `records/` (artifact-level ownership records already exist for docs; records are governance artifacts, not components), `.pi/`, `.as-is/` (host configuration/tracing).
- Approval disposition: this setup was requested by an explicit, reviewable task ("perform the setup your workflow prescribes for adopting it in an existing project"). Operating autonomously, that request is treated as the approval required by the skill; this treatment is recorded as an assumption in the arm status report rather than silent discretion.
- Planned writes (all inside the effective boundary): `as-is-setup-plan.md` (this working artifact), `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`.
- Excluded out-of-scope paths: everything else, in particular `records/backlog.md`, `records/owners/*`, `records/ownership-map.md`, `src/`, `tests/`, `checks/`, `sample-data/`, `docs/`, `CHANGELOG.md`, `README.md` content.
- Diagram disposition: no critical or host-constrained planned diagram. The root structural container and the component pipeline view are supplementary views with short labels; smallest supported source-level check applies. Density budget: root container 1 node + 1 subgraph; component view 3 short-labeled nodes.
- Validation: record headings `# <name> - as-is`, resolving links, Mermaid source-level check, target-local record placement, before/after `git status --porcelain` path comparison (all changed paths inside the boundary; parent/sibling paths outside the boundary do not exist and are not touched), and `git diff --check`.