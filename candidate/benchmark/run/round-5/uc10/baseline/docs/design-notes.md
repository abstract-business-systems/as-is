# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.
## Note: count --stats summary option

- Request: add a `--stats` option to `wordstats count` that appends a summary object to the output containing the minimum count, maximum count, median count, and number of unique words, implemented in a new module `src/wordstats/stats.py`.
- Decision: `wordstats count <path> --stats` prints a JSON array `[<counts object>, <summary object>]` with 2-space indent and sorted keys. The summary object has exactly the keys `min`, `max`, `median`, and `unique`: `unique` is the number of distinct words; `min` and `max` are the smallest and largest counts; `median` is computed over the multiset of counts, using the mean of the two middle values for an even number of values (may be fractional). For empty input the summary is `{"max": 0, "median": 0, "min": 0, "unique": 0}`. Output without `--stats` is unchanged.
- Options considered: wrapping output as `{"counts": ..., "summary": ...}` (rejected: changes the existing top-level shape for consumers of the counts mapping); adding a reserved summary key inside the counts object (rejected: collides with the sorted word-key contract and a word could shadow it); appending plain-text summary lines (rejected: inconsistent with the JSON contract recorded in the initial-seed note).
- Bounded change authorized: the `--stats` option on `count`, the new `src/wordstats/stats.py` module implementing the summary computation, and focused unit tests for the summary values and the option; no other CLI behavior changes.
