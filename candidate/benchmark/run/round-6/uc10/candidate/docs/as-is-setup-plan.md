# As-is setup plan

Working setup artifact for adopting the as-is documentation convention before the bounded feature change. This plan is not copied into the resulting `as-is.md` records.

- Mode: whole-project mode; the benchmark consumer directory is the selected project root.
- Target path: the current working directory (`candidate/benchmark/run/round-6/uc10/candidate`).
- Effective boundary: the selected project root and descendants only; no enclosing project root, sibling directory, or other benchmark arm/use-case path is read or changed.
- Applicable instruction path and disposition: no target-local `AGENTS.md` exists; create it inside the boundary with the canonical as-is instruction and the seed's existing scope, design-note, and validation pointers.
- Root `as-is.md` path and disposition: create `as-is.md` with the project name `wordstats` from `README.md`.
- Candidate component and evidence: `src/wordstats` as `wordstats core`, because it owns the word-count library and CLI, has a stable public contract in `records/owners/core-utility.md`, and has independent tests and deterministic checks. Confidence: high.
- Candidate rejection: `tests/`, `checks/`, `docs/`, `records/`, and `sample-data/` are support artifacts of this small utility rather than independently owned components; no additional component record is proposed.
- Human disposition: the user's benchmark task is treated as approval for this minimal, reviewable decomposition; no separate approval channel is available in this bounded run. This is an explicit assumption.
- Planned setup writes: `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`, and this plan. Feature-specific task pairs, design note, ownership changes, and changelog updates are deferred to the bounded implementation workflow after setup.
- Diagram plan: no critical diagram is planned; the root record will use a single structural container view with one child, and the child record will use a small responsibility view. The source-level record checks and `git diff --check` are the validation surface; residual rendering risk is low.
- Excluded paths: all paths under the enclosing `candidate/benchmark/` tree outside this working directory, and all unrelated seed artifacts.
- Validation plan: compare changed paths with the effective boundary, verify canonical instruction count and record headings/links, and run `git diff --check` before beginning feature work.
