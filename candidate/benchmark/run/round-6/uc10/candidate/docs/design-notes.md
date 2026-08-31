# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## New note: count --stats summary option

- Request: add an opt-in `--stats` summary to `wordstats count`.
- Decision: preserve the existing word-count keys and append a `stats` object with `min`, `max`, `median`, and `unique`; empty counts use `null` for `min`, `max`, and `median`, while `unique` is `0`.
- Options considered: replace the count mapping with a `{counts, stats}` envelope (rejected: changes the default output shape and makes the opt-in output less directly compatible); print a second non-JSON line (rejected: breaks single-document JSON consumers); add summary fields at the top level (rejected: can collide with a word named like a summary field).
- Bounded change authorized: add `src/wordstats/stats.py`, expose `wordstats count --stats`, and add focused tests; output without `--stats` remains unchanged.