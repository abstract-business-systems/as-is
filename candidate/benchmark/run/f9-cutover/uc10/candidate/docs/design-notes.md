# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## New note: optional count statistics summary

- Request: add `--stats` to `wordstats count` with minimum count, maximum count, median count, and number of unique words.
- Decision: preserve the existing count mapping as the top-level JSON object and append a reserved `"stats"` object only when `--stats` is supplied; the summary uses the mapping's positive counts, with the median averaged for an even number of words.
- Options considered: replace the mapping with statistics (rejected: breaks existing consumers); always include the summary (rejected: changes the existing default output); expose a separate command (rejected: does not satisfy the requested option).
- Bounded change authorized: add `src/wordstats/stats.py`, wire the `wordstats count --stats` option, and add focused tests for summary values and option behavior.
