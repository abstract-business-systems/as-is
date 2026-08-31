# Task

## Requirement

Implement the `--top N` filter module for `wordstats count` as the bounded component `records/components/topwords/`. Design note: `docs/design-notes.md`, note "`--top N` filter for count (2026-08-31)". Create `src/wordstats/topwords.py` exposing a pure function that keeps only the N most frequent words from a counts mapping, ties broken alphabetically (descending count, then ascending word); N must be a positive integer and an invalid N raises a clear `ValueError`. Add module-level unit tests in `tests/test_topwords.py`. The parent integrates the CLI wiring; do not edit `src/wordstats/cli.py`, `src/wordstats/counter.py`, `tests/test_counter.py`, or any other component's records.

## Plan

1. Write `src/wordstats/topwords.py` with a pure selection function ordering by `(-count, word)` and keeping the first N; validate N as a positive integer and raise `ValueError` with a clear message otherwise.
2. Write `tests/test_topwords.py` covering basic selection, alphabetical tie-breaking at the cut, N larger than the vocabulary, empty input, and invalid N rejection.
3. Run `PYTHONPATH=src python3 -m unittest tests.test_topwords -v` and record the outcome in `Validation`.
4. Update this narrative's `Progress`, `Validation`, `Result`, and the local `task` object in `as-is.json` (`status`, `updated`).

## Progress

- 2026-08-31: task record created by the parent implementer; status `ready`; awaiting worker launch.
- 2026-08-31: read the requirement, the design note "`--top N` filter for count (2026-08-31)" in `docs/design-notes.md`, and the local `task` object in `as-is.json`; confirmed scope covers only `src/wordstats/topwords.py`, `tests/test_topwords.py`, and this record directory.
- 2026-08-31: created `src/wordstats/topwords.py` with `select_top(counts, n)` ordering by `(-count, word)` and keeping the first n, raising `ValueError("N must be a positive integer")` for invalid n (bools rejected explicitly); created `tests/test_topwords.py` with six tests covering basic selection, alphabetical tie-breaking at the cut boundary, n larger than the vocabulary, empty input, input immutability, and rejection of invalid n (0, -1, 'x', None, 2.5, True).
- 2026-08-31: ran the required checks; both passed (see Validation). Parent CLI wiring in `src/wordstats/cli.py` remains the parent's integration step; no CLI or other component file was touched.

## Validation

- `PYTHONPATH=src python3 -m unittest tests.test_topwords -v`: exit 0, `Ran 6 tests ... OK` (all six tests pass, including tie-breaking at the cut and invalid-n rejection).
- `python3 -m compileall -q src`: exit 0, no output, no compile errors.
- Residual risk: none identified within scope; the `--top` CLI wiring and exit-2 message behavior are the parent's integration and are not exercised by these module-level tests.

## Result

Completed. `src/wordstats/topwords.py` exposes the pure function `select_top(counts, n)`: it returns a new mapping keeping only the n most frequent words, ordered by descending count then ascending word; n must be a positive integer (`int`, not `bool`, >= 1) and any invalid n raises `ValueError` with the message `N must be a positive integer`. `tests/test_topwords.py` provides passing module-level unit tests for the required cases. Task status set to `completed` in `as-is.json`. No git commit made, per constraints.

## Blockers And Escalations

None.

## Recovery

Last durable checkpoint: implementation and tests complete, required checks passed, task record updated with evidence and status `completed`. If interrupted, reread this record and the local `task` object in `as-is.json`; the only outstanding work is the parent's CLI wiring of the module, which is outside this component's scope.

## Next Action

Parent: integrate `select_top` into `src/wordstats/cli.py` behind the optional `--top N` flag per the design note, then reconcile this child task. Worker side: none; the assigned work is complete.