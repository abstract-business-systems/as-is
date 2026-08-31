# Task

## Requirement

Implement the `--rare N` filter module for `wordstats count` as the bounded component `records/components/rarewords/`. Design note: `docs/design-notes.md`, note "`--rare N` filter for count (2026-08-31)". Create `src/wordstats/rarewords.py` exposing a pure function that keeps only words with N or fewer occurrences from a counts mapping; N must be a positive integer and an invalid N raises a clear `ValueError`. Add module-level unit tests in `tests/test_rarewords.py`. The parent integrates the CLI wiring; do not edit `src/wordstats/cli.py`, `src/wordstats/counter.py`, `tests/test_counter.py`, or any other component's records.

## Plan

1. Write `src/wordstats/rarewords.py` with a pure selection function over a counts mapping (keep `count <= N`); validate N as a positive integer and raise `ValueError` with a clear message otherwise.
2. Write `tests/test_rarewords.py` covering basic filtering, boundary (`count == N` kept, `count == N+1` dropped), empty input, and invalid N rejection.
3. Run `PYTHONPATH=src python3 -m unittest tests.test_rarewords -v` and record the outcome in `Validation`.
4. Update this narrative's `Progress`, `Validation`, `Result`, and the local `task` object in `as-is.json` (`status`, `updated`).

## Progress

- 2026-08-31: task record created by the parent implementer; status `ready`; awaiting worker launch.
- 2026-08-31: worker implemented `src/wordstats/rarewords.py` (`select_rare(counts, n)` keeping words with count <= n, ValueError on invalid n) and `tests/test_rarewords.py` (basic filtering, boundary, empty input, n larger than vocabulary, non-mutation, rejection of 0, -1, 'x', None, 2.5, True); both validations passed; status set to `completed`.

## Validation

- 2026-08-31: `PYTHONPATH=src python3 -m unittest tests.test_rarewords -v` -> `Ran 11 tests in 0.000s`, `OK`, exit 0.
- 2026-08-31: `python3 -m compileall -q src` -> no output, exit 0.

## Result

Completed. `src/wordstats/rarewords.py` exposes the pure function `select_rare(counts, n)` returning a new mapping with only words whose count is <= n; n must be an `int` (not a `bool`) >= 1, otherwise `ValueError("N must be a positive integer")`. `tests/test_rarewords.py` covers filtering, boundary (count == n kept, count == n+1 dropped), empty input, n larger than the vocabulary, input non-mutation, and rejection of 0, -1, 'x', None, 2.5, and True. CLI wiring remains with the parent per the design note.

## Blockers And Escalations

None.

## Recovery

Last durable checkpoint: module and tests implemented and validated; task record updated to `completed`. No open recovery surface; only the parent-side CLI integration described in the design note remains outside this component's scope.

## Next Action

None for this component; the parent integrates the CLI wiring of `src/wordstats/rarewords.py` per `docs/design-notes.md`.