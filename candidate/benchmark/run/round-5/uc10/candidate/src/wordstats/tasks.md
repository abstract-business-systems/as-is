# Task

## Requirement

Implement the `stats` helper for the parent task recorded at the project root (`/tasks.md`, `/as-is.json`). Create `src/wordstats/stats.py` with `summarize_counts(counts)` per the owner contract in `records/owners/stats.md`, and focused unit tests in `tests/test_stats.py`. This is a leaf task: no delegation, no other files, no commits. Budget is deliberately tight: at most $0.02 and 180 seconds. If you stop on budget, record the stop in this file as a result and leave a Recovery note; do not rush partial work into the other files.

## Plan

1. Read `records/owners/stats.md` (contract), `src/wordstats/counter.py` (house style), `tests/test_counter.py` (test style), and the `--stats` entry in `docs/design-notes.md`.
2. Write `src/wordstats/stats.py`: `summarize_counts(counts)` returns `{"min": ..., "max": ..., "median": ..., "unique": ...}`; `unique` is `len(counts)`; `min`/`max`/`median` from the count values via the `statistics` module (`None` for empty input; median of an even number of values is the average of the two middle values); do not mutate the input.
3. Write `tests/test_stats.py` (unittest style, mirroring `tests/test_counter.py`): typical summary values, even-count median averaging, single-entry input, empty input (min/max/median `None`, `unique` 0), input mapping not mutated.
4. Mark this task `active` in `src/wordstats/as-is.json` (update `task.updated`) before editing; record progress here; after writing both files, record the validation you can perform without shell access (code review against the contract) and set status `completed` with `Result` filled in. If the budget is exhausted first, set status per the budget-stop protocol and record what remains.

## Progress

Read the owner contract, `counter.py`, `test_counter.py`, and the `--stats` design-note entry. Wrote `src/wordstats/stats.py` with `summarize_counts(counts)` returning `{min, max, median, unique}` (`statistics.median` for the middle-value averaging; `None`/`unique: 0` for empty input; input copied via `list(counts.values())` so it is never mutated). Wrote `tests/test_stats.py` covering typical values, even-count median averaging, single-entry input, empty input, and the no-mutation guarantee.

## Validation

Child has no shell access; validation performed is code review against `records/owners/stats.md` and the `--stats` design-note entry: contract keys, empty-input `None` handling, even-count median averaging (`statistics.median`), `unique = len(counts)`, and non-mutation are each covered by an implementation path and a test. Test style mirrors `tests/test_counter.py` (unittest, `from wordstats.stats import ...`). Full mechanical validation remains with the parent's `bash checks/validate.sh`.

## Result

Completed within budget. Created exactly `src/wordstats/stats.py` and `tests/test_stats.py`; record pair advanced ready -> active -> completed; no other files touched, no commits.

## Blockers And Escalations

None. Report blockers in this section and set status `blocked` rather than improvising outside the changed-artifact boundary (`src/wordstats/stats.py`, `tests/test_stats.py`, this record pair).

## Recovery

If interrupted or budget-stopped: reread this file and `src/wordstats/as-is.json`; preserve cumulative observations; record the stop as a result with the remaining work listed; do not touch files outside the boundary.

## Next Action

None. Parent may run `bash checks/validate.sh` to mechanically confirm.