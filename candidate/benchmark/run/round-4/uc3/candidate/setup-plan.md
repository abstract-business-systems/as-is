# Setup plan — as-is documentation adoption (transient working artifact)

Reviewable plan produced by the `as-is-setup` procedure before any setup write. This file is working context, not canonical record content; it is not copied into any `as-is.md` record.

## Mode and boundary

- Mode: whole-project (no directory argument).
- Target path: `/home/vc/dev/as-is/candidate/benchmark/run/round-4/uc3/candidate` (git-init'd seed project root).
- Effective boundary: the target and all descendants (`src/`, `tests/`, `checks/`, `docs/`, `records/`, `sample-data/`, `.pi/`, `.as-is/`).
- Excluded out-of-scope paths: every ancestor, sibling, and enclosing-project artifact (`candidate/benchmark/**` outside this working directory, `/home/vc/dev/as-is/**` outside this boundary). No parent project root or sibling path is required or changed.

## Instruction file

- Applicable instruction path: `AGENTS.md` (does not exist in the target).
- Disposition: create `AGENTS.md` inside the boundary containing the single canonical as-is architecture statement exactly once. No existing guidance is replaced.

## Root record

- Root record path: `as-is.md` at the target root.
- Root component name: `wordstats` (the project's actual component name per `README.md` and package naming).
- Disposition: create with `# wordstats - as-is`, Purpose, Components, Design (structural container view), Relationships.

## Candidate components

| Candidate | Path | Evidence | Confidence | Disposition |
| --- | --- | --- | --- | --- |
| wordstats package | `src/wordstats/` | Distinct responsibility (word-count library + `count` CLI surface), stable public contract already recorded in `records/owners/core-utility.md`, own unit tests in `tests/`, one coherent change/ownership scope. Named from the actual package name (sibling vocabulary: `records/ownership-map.md` rows, CLI prog `wordstats`). | high | create record |

Rejected/deferred candidates: `checks/`, `sample-data/`, `docs/`, `records/` are validation fixtures, data, and mock records — not components (no distinct lifecycle, authority boundary, or independent change complexity). No further decomposition is justified at this project size.

- Approval basis: the benchmark task explicitly directs performing this setup in the seed project; the decomposition above is the minimal evidence-supported one. Recorded assumption: the task request stands in for the human component-approval step; any future human reviewer may merge, rename, reject, or defer candidates via the normal maintenance procedure.

## Planned writes (inside boundary only)

1. `AGENTS.md` — canonical-use instruction.
2. `as-is.md` — root record.
3. `src/wordstats/as-is.md` — component record (`# wordstats - as-is`).
4. `records/ownership-map.md` — extend ownership rows to directory scope (`src/wordstats/`, `tests/`) so upcoming new files resolve to an owner instead of stopping; `records/owners/core-utility.md` — widen the owned surface accordingly. This is the ownership-map discipline applied before the bounded feature change.

## Diagram layout plan

No critical or host-constrained render surface is in play. Both planned diagrams are small structural/flow views (≤ 6 nodes, low label density), top-to-bottom grouping, no routing constraints, no exceptions; residual risk is limited to renderer differences that do not affect the reader question.

## Validation

- Record titles use `# <component-name> - as-is`.
- Root record links the child via `src/wordstats/as-is.md#design` in both the structural diagram and the `Components` table.
- Canonical instruction appears exactly once in `AGENTS.md`.
- Before/after path snapshot proves all writes stayed inside the boundary (`git status --porcelain` before and after).
- `git diff --check` clean; existing content intact; `bash checks/validate.sh` still passes.