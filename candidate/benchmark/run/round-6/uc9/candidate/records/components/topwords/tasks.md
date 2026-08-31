# Task

## Requirement

Implement the top-frequency helper for the `wordstats` component. Create `src/wordstats/topwords.py` with a pure function that keeps the N most frequent words, breaking equal counts alphabetically.

## Plan

Inspect the existing count mapping contract and implement the smallest dependency-free helper. Do not edit CLI parsing, rarewords, parent records, or sibling records.

## Progress

Completed 2026-09-01T00:00:00Z. Created `src/wordstats/topwords.py` exposing pure `filter_top_words(counts, n)`, which ranks entries by `(-count, word)` and returns a new mapping containing at most `n` entries. The input mapping is not modified; non-positive limits return an empty mapping. No CLI, tests, parent records, sibling records, or other files were changed.

## Validation

- Implementation evidence: `filter_top_words` sorts by descending count and alphabetical word, then returns the first `n` entries as a new mapping.
- Scope evidence: only `src/wordstats/topwords.py` and this child task pair were modified; CLI parsing, rarewords, parent records, sibling records, and tests remain untouched.
- Automated execution was unavailable in this child session, so the parent must run the repository checks and focused option tests after integration.

## Result

Completed. The pure top-frequency helper is implemented with deterministic descending-frequency ranking and alphabetical tie-breaking. No blocker remains within the child scope; automated validation is explicitly deferred to the parent.

## Blockers And Escalations

None recorded.

## Recovery

If interrupted, preserve this task pair and inspect only `src/wordstats/topwords.py` and this component's task files before resuming. Do not retry without parent authority.

## Next Action

None for the child. Parent validation and integration remain separate.
