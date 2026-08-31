# as-is setup plan (working artifact)

Reviewable setup plan produced before any setup write, per the `as-is-setup` procedure. This plan is a working artifact and is intentionally not copied into any `as-is.md` record.

## Mode and boundary

- Mode: whole-project mode (no directory argument; the benchmark task directs setup inside this consumer directory).
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-2/uc2/candidate` (the project root).
- Effective boundary: the target and its descendants. No parent, sibling, or enclosing-project path is inspected for change; the benchmark harness forbids writes outside this directory.
- Applicable instruction path: `<target>/AGENTS.md` — does not exist in the seed (by design); its creation with the single canonical instruction is included in this plan.
- Root `as-is.md` path and disposition: create `<target>/as-is.md`.

## Candidate components (semantic evidence)

| Candidate | Evidence | Disposition | Confidence |
| --- | --- | --- | --- |
| `wordstats` (`src/wordstats/`) | Distinct responsibility: word counting plus a documented CLI contract (`records/owners/core-utility.md`); own unit tests; stable public contract (lowercased tokens, JSON output, sorted keys). Seed ownership map gives it component change scope. | Approved as the single child component. Record at `src/wordstats/as-is.md`. | High |
| `tests/`, `checks/`, `sample-data/` | Test, validation, and fixture support; no independent authority or lifecycle. | Excluded from decomposition; recorded as support material in the root record. | High |
| `docs/`, `records/` | Documentation and mock ownership records (artifact scope per `records/ownership-map.md`). | Excluded from decomposition; recorded as support material. | High |

No other decomposition is materially supported by the evidence for a project this small; per the skill, not every directory is a component. Names align with the existing seed vocabulary (`wordstats`, `count`, `core utility` owner record).

## Human disposition

The benchmark task is the reviewable, human-issued instruction directing adoption of the workflow in this seed, and the request constrains later work to non-component scope. It is treated as approval for the minimal decomposition above; no mid-run human confirmation channel exists in this arm. Recorded as an assumption.

## Planned writes (all inside the effective boundary)

1. `docs/as-is-setup-plan.md` — this plan (new).
2. `as-is.md` — root record, title `# as-is - as-is`, structural container view, `Components` table linking `src/wordstats/as-is.md#design` (new).
3. `src/wordstats/as-is.md` — child record, title `# wordstats - as-is`, count-command flow view, lineage `**Lineage**: [as-is](../../as-is.md#design) / **wordstats**` (new).
4. `AGENTS.md` — target-local instruction file with the single canonical `as-is.md` architecture statement (new).

## Excluded out-of-scope paths

Everything outside `/home/vc/dev/as-is/candidate/benchmark/run/round-2/uc2/candidate`, including the enclosing `as-is` repository, sibling benchmark arms, and any other use case's directory. No parent or sibling path is required or changed.

## Diagram layout plan

- Root structural container: single subgraph labeled `as-is` containing one linked child node `wordstats`; TB direction, ELK layout, density well under budget. Rendering is not critical to any acceptance condition here; source-level syntax validation is sufficient.
- Child flow view: 4-node linear progression (file → CLI → counter → JSON output); TB direction, ELK layout. Supplementary view; source-level check only.

## Validation planned

- Resolving links checked by path resolution from each record's directory.
- Mermaid fences checked for syntax (fence structure, declared config, node/edge shape); no local renderer is configured in the seed.
- `git diff --check` (via intent-to-add, since the seed has no initial commit) plus before/after `git status --porcelain` path comparison proving writes stay inside the effective boundary.