# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Proposed count statistics summary

- Request: add a `--stats` option to `wordstats count` that appends a summary object to the output containing the minimum count, maximum count, median count, and number of unique words, implemented in a new module `src/wordstats/stats.py`.
- Decision: preserve the existing sorted count mapping by default; when `--stats` is supplied, append a `stats` object with `min_count`, `max_count`, `median_count`, and `unique_words`. The median is the middle count for an odd number of words and the arithmetic mean of the two middle counts for an even number; an empty mapping reports null extrema and median with zero unique words.
- Options considered: alter the existing mapping shape (rejected: breaks consumers); emit a separate human-readable line (rejected: weakens JSON consumption); omit statistics for empty input (rejected: unstable schema).
- Bounded change authorized: add the summary module, wire the opt-in CLI flag, and cover the summary and CLI behavior with focused tests.