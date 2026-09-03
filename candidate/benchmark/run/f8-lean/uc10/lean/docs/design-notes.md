# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## New note: optional count statistics

- Request: add `--stats` to `wordstats count` with minimum count, maximum count, median count, and unique-word count.
- Decision: when requested, emit a JSON array containing the existing sorted count mapping followed by a summary object with `minimum`, `maximum`, `median`, and `unique_words`; without the option, preserve the existing mapping output.
- Options considered: replace the mapping (rejected: removes the existing result); add summary fields to the mapping (rejected: collides with possible word keys); append a second object in an array (selected: preserves the mapping as a distinct first result while adding structured summary data).
- Bounded change authorized: add `src/wordstats/stats.py`, wire the optional CLI output, and cover summary and option behavior with focused tests.