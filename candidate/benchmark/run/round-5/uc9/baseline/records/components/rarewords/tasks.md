# Task

## Requirement

Implement the rare-words filter module for `wordstats count --rare N`: create `src/wordstats/rarewords.py` exposing `filter_rare_words(counts, n)` that returns a new mapping keeping only words with N or fewer occurrences, plus focused unit tests in `tests/test_rarewords.py`. The CLI wiring, `N` validation, and exit codes are integrated by the parent component and are out of scope here.

## Plan

1. Write `src/wordstats/rarewords.py` (pure function, no I/O).
2. Write `tests/test_rarewords.py` (inclusive boundary, exclusion, empty result, unknown-word absence).
3. Run `PYTHONPATH=src python3 -m unittest tests.test_rarewords -v`.
4. Update this record and the local `as-is.json` task status/evidence.

## Progress

1. Created `src/wordstats/rarewords.py` exposing `filter_rare_words(counts, n)` as a pure function returning a NEW mapping with only words whose count is <= n; the input mapping is unchanged.
2. Created `tests/test_rarewords.py` with unit tests for: inclusive boundary (count == n kept), exclusion (count > n dropped), empty result when no word qualifies, empty counts input, and input non-mutation.
3. Ran `PYTHONPATH=src python3 -m unittest tests.test_rarewords -v` and `bash checks/validate.sh` (both pass).
4. Updated this record and `as-is.json` task status/evidence. No git commands run (parent owns integration).

## Validation

- `PYTHONPATH=src python3 -m unittest tests.test_rarewords -v`: Ran 5 tests ... OK.
- `bash checks/validate.sh`: compile OK; 14 unit tests OK (counter, rarewords, topwords); CLI smoke check OK; "All checks passed."; exit code 0.

## Result

Completed. Both acceptance-relevant files exist and all tests pass. Descendants: none. No files outside `src/wordstats/rarewords.py`, `tests/test_rarewords.py`, and `records/components/rarewords/` were modified. Integration/commit is pending with the parent (no git commands executed, per constraint).

## Blockers And Escalations

(none)

## Recovery

Checkpoint: task record created before launch. Next safe action on failure: inspect child log, preserve worktree state, re-record.

## Next Action

Parent to integrate and commit the two implementation files (pending-parent-integration); no further child action required.