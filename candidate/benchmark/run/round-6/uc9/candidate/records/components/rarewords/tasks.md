# Task

## Requirement

Implement the rare-frequency helper for the `wordstats` component. Create `src/wordstats/rarewords.py` with a pure function that keeps only words with occurrence counts less than or equal to the supplied threshold.

## Plan

Inspect the existing count mapping contract and implement the smallest dependency-free helper. Do not edit CLI parsing, topwords, parent records, or sibling records.

## Progress

Implemented `filter_rare_words(counts, n)` in `src/wordstats/rarewords.py` as the bounded, dependency-free child change.

## Validation

Static contract check: the helper returns a new dictionary comprehension, retains entries with `count <= n`, preserves the original values, and performs no I/O or CLI parsing. The existing child scope has no focused test file, and the parent owns repository checks and post-integration option tests; those checks were not run here.

## Result

Completed. `src/wordstats/rarewords.py` now exposes the pure `filter_rare_words(counts, n)` helper and leaves threshold validation to its caller.

## Blockers And Escalations

None recorded.

## Recovery

If interrupted, preserve this task pair and inspect only `src/wordstats/rarewords.py` and this component's task files before resuming. Do not retry without parent authority.

## Next Action

Parent may integrate this child result and run the repository and focused option checks.
