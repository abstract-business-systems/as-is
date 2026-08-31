# As-is setup plan (working artifact)

Reviewable dry-run plan recorded before setup writes, per the `as-is-setup` skill. It is a working/review artifact, not durable architecture context; it is intentionally not copied into any resulting `as-is.md` record.

## Mode, target, boundary

- Mode: whole-project mode (no directory argument; the arm request asks for workflow adoption in this project).
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-2/uc4/baseline` (the benchmark arm working directory; a standalone seed project, no enclosing project root is required or touched).
- Effective boundary: the target root and its descendants (`src/`, `tests/`, `checks/`, `docs/`, `records/`, `sample-data/`, root files). Excluded out-of-scope paths: everything under `candidate/benchmark/` outside this working directory, `/home/vc/dev/as-is/` harness and workflow files, and this project's `.git/` and `.as-is/`/`.pi/` runtime state (harness-owned, not modified by setup).

## Applicable instruction file

- No `AGENTS.md` or equivalent exists in the target. Plan includes creating `<target>/AGENTS.md` inside the boundary, containing the canonical as-is.md architecture instruction exactly once plus minimal declarative project facts. No enclosing instruction file is read for authority or modified.

## Root record

- `<target>/as-is.md` — create (disposition: new). Title `# as-is - as-is` per whole-project mode; `**Lineage**: **as-is**`; structural container view of the root with its approved immediate child.

## Candidate components (semantic evidence)

| Candidate | Path | Evidence | Confidence | Disposition |
| --- | --- | --- | --- | --- |
| `wordstats` | `src/wordstats/` | Distinct responsibility: word-count logic plus `count` CLI; stable public contract documented in `records/owners/core-utility.md`; own unit tests; the CLI is the user-facing surface named in `docs/design-notes.md` and the smoke check. | High | Create record at `src/wordstats/as-is.md` |
| excluded: tests/ | `tests/` | Unit tests for `wordstats`; no independent responsibility or authority boundary. | — | Not a component |
| excluded: checks/ | `checks/` | Deterministic validation harness; fixture-level tooling, no component boundary. | — | Not a component |
| excluded: docs/, records/, sample-data/ | — | Human-facing notes, mock ownership records, fixture data; not independently owned semantic components at this project scale. | — | Not components |

Decomposition is unambiguous: one semantic component (library + CLI with a documented contract and tests); everything else is validation, documentation, or fixture material. The arm request is the reviewable human request that authorizes this adoption; stopping for further human confirmation would add no information for a single-candidate, high-confidence decomposition of a seeded mock project. Names align with established vocabulary: `wordstats` is the package name used in `README.md`, `src/`, and the CLI `prog` string; paths are lowercase kebab-case.

## Planned writes

Setup phase: `records/as-is-setup-plan.md` (this plan), `AGENTS.md` (canonical instruction), `as-is.md` (root record), `src/wordstats/as-is.md` (component record).
Task phase: `docs/pipeline.md` (the bounded request), `README.md` (contents index line), `CHANGELOG.md` (changelog entry), `src/wordstats/as-is.md` (Links entry for the new reader-facing pipeline doc).

## Acceptance targets (expert plan review amendments)

Expert review verdict (round 1): FAIL with three required revisions, incorporated here:

1. As-is validator gate, runnable form: `bun /tmp/bench-r2/baseline-workflow/skills/managing-as-is-document/scripts/validate-as-is-diagrams-and-navigation.ts . --records=as-is.md,src/wordstats/as-is.md` (workflow skill tooling executed read-only from its absolute location; the target is the current directory). Pass condition: exit 0 with an empty `issues` array, covering the planned Mermaid diagrams and Markdown navigation. Expert diff review remains an additional gate, not a substitute.
2. Explicit link targets: root `as-is.md` → `src/wordstats/as-is.md#design`; `src/wordstats/as-is.md` Links → `../../records/owners/core-utility.md` and `../../docs/pipeline.md`; `README.md` contents bullet → `docs/pipeline.md`. New-document heading fixed as `# wordstats count pipeline`; no fragment links point into it.
3. `docs/pipeline.md` must state the supported token-edge punctuation exactly as the configured strip set `.,;:!?-"'()` (per `counter.py` and the core-utility owner record), not imply universal punctuation or Unicode normalization.

Also resolved by review: no stop-for-direction remains for `docs/pipeline.md` (the explicit human request names the exact path and content); no `docs/design-notes.md` entry is required because the change does not alter user-visible runtime behavior.

## Diagram layout plans (pre-render)

- Root structural container: `flowchart TB`, ELK layout, single child node inside the `as-is` subgraph; density 1 node / 0 edges; no residual render risk (source-level validation only in this host).
- `docs/pipeline.md` count-pipeline flow: supplementary view, `flowchart LR` progression matching the stated CLI → counter → JSON reading order; 4 nodes, labels kept under the 28-visible-character source-level threshold; no host render-surface constraint claimed. The `wordstats` component record's flow view uses the same direction and density budget.

## Excluded paths (explicit)

All paths outside the target root; `.as-is/` and `.pi/` (harness runtime state); no parent or sibling benchmark path is read or changed.
