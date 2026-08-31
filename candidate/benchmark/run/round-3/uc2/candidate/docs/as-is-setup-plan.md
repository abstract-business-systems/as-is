# As-is setup plan (reviewable working artifact, not copied into the root record)

## Mode and target

- Mode: whole-project mode (no directory argument given; the request to adopt the workflow names this seed project).
- Target: `/home/vc/dev/as-is/candidate/benchmark/run/round-3/uc2/candidate` (independent benchmark working copy; treated as the project root).
- Effective boundary: the target and its descendants only. Excluded (out of scope, not inspected for candidates, not written): the enclosing `candidate/` workflow project, all sibling benchmark arms, and every path outside the target.
- Parent/sibling statement (whole-project mode): the enclosing repository root and sibling directories are outside the setup boundary and are not required or changed.

## Instruction file disposition

- No `AGENTS.md` (or established equivalent) exists inside the target. Plan: create `<target>/AGENTS.md` containing exactly the single canonical `as-is.md` architecture instruction, plus minimal framing.

## Root record disposition

- No root `as-is.md` exists (`.as-is/` holds only runtime tracing spans and is not a record). Plan: create `<target>/as-is.md` titled `# wordstats - as-is` (the project's actual name from `README.md`/`src/wordstats`).

## Candidate evidence and disposition

- Candidate `wordstats` (project root, single component): distinct responsibility (word-count library plus `count` CLI), single ownership area in `records/ownership-map.md` for code, one deterministic validation surface (`checks/validate.sh`). Evidence supports one component; no directory inside the target shows a distinct ownership boundary, lifecycle, or independent change authority that would justify a child record.
- Deferred child candidate: `src/wordstats` split into library vs CLI. Rejected for setup: shared owner record, shared tests, no independent change/operational complexity; would turn directories into components. Human disposition of any finer decomposition is deferred (see Unresolved approvals).

## Human disposition

- The delegating request authorized performing the prescribed setup and explicitly disclaimed component task work. Approval therefore covers only the single-root decomposition above; finer decomposition requires human approval and is not executed.

## Planned writes

1. `AGENTS.md` (new) — canonical instruction only.
2. `as-is.md` (new) — root record: Purpose, Design, lineage, one supplementary flow view.
3. This plan file (already written as the reviewable pre-write artifact).

## Excluded paths

- All benchmark siblings, the enclosing `candidate/` directory, `checks/`, `src/`, `tests/`, `sample-data/`, `records/`, `.as-is/`, `.pi/` (no writes; existing content preserved).

## Validation plan

- Before/after `git status --porcelain` path snapshot proves writes stay inside the target.
- `git diff --check` for whitespace; link/heading source-level inspection; `bash checks/validate.sh` remains the deterministic validation for the later README change.
- No local Mermaid renderer is configured in the seed; the flow view is supplementary, so a source-level check only, with residual render risk recorded.

## Unresolved questions

- Component decomposition beyond the single root (none approved) is deferred to human architectural review; no child records created.