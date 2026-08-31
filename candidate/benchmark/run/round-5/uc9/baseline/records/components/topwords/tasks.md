# Task

## Requirement

Implement the top-N filter module for `wordstats count --top N`: create `src/wordstats/topwords.py` exposing `filter_top_words(counts, n)` that returns a new mapping keeping only the N most frequent words, ties broken alphabetically (a word earlier in alphabetical order wins a tie at the cutoff), plus focused unit tests in `tests/test_topwords.py`. The CLI wiring, `N` validation, and exit codes are integrated by the parent component and are out of scope here.

## Plan

1. Write `src/wordstats/topwords.py` (pure function, no I/O).
2. Write `tests/test_topwords.py` (ranking, alphabetical tie at the cutoff, n exceeding vocabulary size, empty input).
3. Run `PYTHONPATH=src python3 -m unittest tests.test_topwords -v`.
4. Update this record and the local `as-is.json` task status/evidence.

## Progress

Done 2026-08-31T20:41:00Z. Created `src/wordstats/topwords.py` exposing pure `filter_top_words(counts, n)` (sorts by `(-count, word)` so cutoff ties resolve alphabetically; returns a new mapping, input untouched, `n <= 0` yields empty). Created `tests/test_topwords.py` with the four required cases plus an input-immutability check. No other files touched; no git commands run; no delegation.

## Validation

- `PYTHONPATH=src python3 -m unittest tests.test_topwords -v` → Ran 5 tests, OK (2026-08-31T20:41:00Z).
- `bash checks/validate.sh` → compile OK, full suite 14 tests OK, CLI smoke check OK; exit 0.
- Scope audit: only `src/wordstats/topwords.py`, `tests/test_topwords.py`, and `records/components/topwords/` modified; `src/wordstats/cli.py` and all other existing files untouched.

## Result

Completed. `filter_top_words(counts, n)` returns a new mapping of the n most frequent words with alphabetical tie-breaking at the cutoff; all acceptance conditions in `as-is.json` are met. Parent owns CLI wiring and integration/commit.

## Blockers And Escalations

(none)

## Recovery

Checkpoint: task record created before launch. Next safe action on failure: inspect child log, preserve state, re-record.

## Next Action

None — task complete; parent integrates and commits.