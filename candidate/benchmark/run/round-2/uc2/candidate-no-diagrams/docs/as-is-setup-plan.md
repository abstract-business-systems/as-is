# As-is setup plan (benchmark arm: candidate-no-diagrams)

Working setup artifact for the `as-is-setup` adoption procedure. This plan is not copied into the resulting `as-is.md` record.

## Mode, target, boundary

- Mode: whole-project mode (the benchmark arm fixed the working directory as the project root).
- Target: the benchmark arm working directory (`candidate/benchmark/run/round-2/uc2/candidate-no-diagrams`).
- Effective boundary: the target directory and its descendants; no ancestor, sibling, or enclosing-project path is required or changed. The enclosing benchmark tree is out of scope.
- Applicable instruction file: none exists at the target root; the plan proposes creating `<target>/AGENTS.md` inside the boundary (permitted for a missing target-local instruction file).

## Candidate evidence and disposition

Semantic candidates considered within the boundary:

| Candidate | Evidence | Disposition |
| --- | --- | --- |
| whole-project record only | Tiny mock fixture: one library/CLI (`src/wordstats/`), one validation script, tests, sample data, docs, ownership records | Accepted — root record only, no child components |
| `src/wordstats` as a child component | Distinct responsibility and public contract, but no other component to form a boundary against; splitting would fabricate hierarchy in a fixture | Deferred — no separate child record without human approval of a multi-component decomposition |

Decomposition beyond the root-only boundary is not silently chosen; it is deferred and reported. The benchmark request (fix the README usage example) is the reviewable request driving this adoption; no mid-run human confirmation channel exists in this arm, so the minimal boundary keeps the unapproved decision surface smallest.

## Planned writes (all inside the boundary)

- `as-is.md` — create root record (`# wordstats - as-is`), root-only, no children.
- `AGENTS.md` — create with the single canonical as-is architecture instruction.
- `docs/as-is-setup-plan.md` — this working plan artifact.
- Excluded paths: every path outside the target; no changes to `src/`, `tests/`, `checks/`, `records/`, `sample-data/`, `CHANGELOG.md`, or `.pi/` during setup.

## Pre-render layout plan (only planned diagram)

- Render-surface constraint: plain Markdown host; no local Mermaid renderer configured in this seed; render validation is unavailable.
- Intended shape: `flowchart LR`, progression layout for the `count` command data flow; 4 nodes, no subgraphs, no styling.
- Density budget: short labels only; no numeric dimensions claimed absent host authority.
- Residual risk: diagram validated by source-level reading only; rendering risk accepted for a non-critical supplementary view in a fixture project.

## Validation gates

- Root record title `# wordstats - as-is`; lineage line `**Lineage**: **wordstats**` (root, no self-link).
- Canonical instruction appears exactly once in `AGENTS.md`.
- Links resolve repository-relative; `git diff --check` clean; before/after path comparison proves writes stay inside the boundary.
