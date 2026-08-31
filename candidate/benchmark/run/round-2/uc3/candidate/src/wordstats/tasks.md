# Task

## Requirement

Implement the `topwords` helper component for the parent task recorded at the project root (`/tasks.md`, `/as-is.json`). Create `src/wordstats/topwords.py` with `filter_min_count(counts, min_count)` per the owner contract in `records/owners/topwords.md`, and focused unit tests in `tests/test_topwords.py`. This is a leaf task: no delegation, no other files, no commits.

## Plan

1. Read `records/owners/topwords.md` (contract), `src/wordstats/counter.py` (house style), `tests/test_counter.py` (test style), and the design note `--min-count` entry in `docs/design-notes.md`.
2. Write `src/wordstats/topwords.py`: `filter_min_count(counts, min_count)` returns `{word: count for word, count in counts.items() if count >= min_count}`; include a module docstring and a function docstring; do not mutate the input.
3. Write `tests/test_topwords.py` (unittest style, mirroring `tests/test_counter.py`): entries at and above threshold kept, below-threshold entries omitted, empty input, empty result, input mapping not mutated, key order preserved.
4. Mark this task `active` in `src/wordstats/as-is.json` (update `task.updated`) before editing; record progress here; after writing both files, record the validation you can perform without shell access (code review against the contract) and set status `completed` with `Result` filled in.

## Progress

Completed. Wrote `src/wordstats/topwords.py` implementing `filter_min_count(counts, min_count)` as a dict comprehension returning a new mapping of entries with count >= min_count (matches owner contract and the `--min-count` design-note decision); wrote `tests/test_topwords.py` mirroring `tests/test_counter.py` unittest style with six focused tests: above-threshold, at-threshold, empty result, empty input, input-not-mutated, key-order-preserved.

## Validation

Child has no shell access; validation performed is line-by-line review of both files against `records/owners/topwords.md` (threshold semantics `>=`, no mutation, key order preserved) and the `--min-count` entry in `docs/design-notes.md`, plus style conformance with `src/wordstats/counter.py` and `tests/test_counter.py`. Test assertions verified by inspection: kept entries are exactly those with count >= min_count; input mapping compared unchanged after the call; key order asserted via `list(result)`. Full mechanical validation remains with the parent's `bash checks/validate.sh` run.

## Result

Completed: both admitted files created per contract; record pair advanced ready -> active -> completed.

## Blockers And Escalations

None. Report blockers in this section and set status `blocked` rather than improvising outside the changed-artifact boundary (`src/wordstats/topwords.py`, `tests/test_topwords.py`, this record pair).

## Recovery

If interrupted: reread this file and `src/wordstats/as-is.json`; preserve cumulative observations; resume from the last recorded checkpoint; do not touch files outside the boundary.

## Next Action

Set status `active` (done), implement the two files (done), then mark completed with validation evidence (done). No further action.