# Task

## Requirement

Benchmark bounded task, two phases. (1) Perform the workflow's setup for adopting it in an existing project: create the target root `as-is.md`, the component `src/wordstats/as-is.md`, the target instruction file `AGENTS.md` with the canonical architecture instruction, and the local task pair (`src/wordstats/as-is.json`, this narrative). (2) Implement the feature request verbatim: add `--top N` to `wordstats count` printing only the N most frequent words as a JSON object with alphabetically sorted keys, default output unchanged, positive-integer validation with nonzero-exit rejection; design note first, focused tests (tie-breaking + rejection), all `checks/validate.sh` checks passing.

## Plan

- Setup (`as-is-setup` skill, whole-project mode): target = this working directory; effective boundary = this directory and descendants. No target-local instruction file exists, so `AGENTS.md` is created inside the boundary. Candidate components: `wordstats-core` (`src/wordstats/`) only — semantic evidence: single responsibility (counting + CLI), one owner record (`records/owners/core-utility.md`), own tests and CLI smoke check. Excluded from decomposition: `checks/`, `docs/`, `records/`, `sample-data/`, `tests/` (validation/docs/support material without independent change or operational complexity). The benchmark request is the reviewable human-approved request; the single-candidate decomposition is the minimal reasonable choice and is recorded in the status report as an assumption.
- Feature: append design note to `docs/design-notes.md` (output format, tie-breaking, rejection), add `top_words(counts, n)` to `counter.py` (sort by count descending, ties broken alphabetically; `ValueError` for n <= 0), wire `--top` in `cli.py` (`parser.error` → exit 2), add focused tests, add CHANGELOG entry, run `bash checks/validate.sh`.

## Progress

- Setup artifacts written: `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`, `src/wordstats/as-is.json`, this narrative. Before/after path snapshot proves writes stay inside the boundary (see Validation).
- Design note appended to `docs/design-notes.md` before implementation; `top_words` added to `counter.py`, `--top` wired in `cli.py`, focused tests added to `tests/test_counter.py`, CHANGELOG entry added. One test-assertion defect (expected key order written backwards) found by validation and fixed; no production-code defect.
- `bash checks/validate.sh` passed (exit 0, 12 tests OK) with the new tests included; manual CLI checks: `--top 2` prints the 2 most frequent words with alphabetically sorted keys, `--top 0` exits 2 with a clear stderr message.

## Validation

- Setup: file-path snapshot before/after; record titles `# <name> - as-is`; root→`src/wordstats/as-is.md#design` link resolves; canonical instruction present exactly once in `AGENTS.md`; `git diff --check` unavailable (no commits in this plain copy) — whitespace checked manually.
- Feature: `bash checks/validate.sh` (compile, unit tests incl. new cases, CLI smoke check) — passed, exit 0; residual risk: no end-to-end shell-level test of exit code 2 (covered in-process instead).

## Result

- Completed: setup artifacts plus the `--top N` feature implemented, tested, and validated. No unresolved questions; one recorded assumption (see Blockers And Escalations).

## Blockers And Escalations

- None; no stop-for-direction required. Owner and scope for all touched files resolved from `records/ownership-map.md` (component scope: `records/owners/core-utility.md`; design note artifact: `records/owners/design-notes.md`). Assumption recorded: the benchmark request was treated as the reviewable human approval for the single-candidate setup decomposition.

## Recovery

- Last durable checkpoint: all acceptance conditions satisfied and validated. No incomplete work or cleanup required.

## Next Action

- None; report status to the delegating host.