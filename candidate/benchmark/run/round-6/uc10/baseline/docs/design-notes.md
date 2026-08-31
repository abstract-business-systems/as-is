# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## `count --stats` summary output

- Request: optionally append summary statistics to the JSON output of `wordstats count`.
- Decision: add `--stats`; when present, preserve the existing mapping under `counts` and add a `stats` object containing `minimum`, `maximum`, `median`, and `unique_words`. The default command output remains the original sorted count mapping.
- Options considered: alter the default output (rejected: breaks existing consumers); emit a separate human-readable line (rejected: makes the result harder to consume as JSON); compute statistics in the CLI (rejected: keeps reusable summary logic out of the component module).
- Bounded change authorized: add `src/wordstats/stats.py`, wire the optional CLI output, and cover summary values and the option with focused tests.