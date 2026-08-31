# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: `count --min-count` filtering option (2026-08-30)

- Request: add a `--min-count N` option to `wordstats count` that omits words with fewer than N occurrences; N must be a positive integer, otherwise the CLI exits 2 with a clear message.
- Decision: add an integer `--min-count` option to the `count` subcommand. Filtering logic lives in a new helper module `src/wordstats/topwords.py` as `filter_min_counts(counts, min_count)`, which validates N and raises `ValueError` for zero, negative, or non-integer values; `cli.py` maps that rejection to exit code 2 with a clear message. Default output without the option is unchanged (JSON, sorted keys, 2-space indent).
- Options considered: inline filtering in `cli.py` (rejected: the request places the logic in a helper module, and this matches the existing counter/CLI separation); filtering inside `counter.count_words` (rejected: changes the library contract and all existing callers for a CLI-shaped need); treating N=0 or negative as a no-op (rejected: the request requires positive integers only, with exit 2 otherwise).
- Bounded change authorized: the new helper module, the CLI option wiring and exit-2 rejection, and unit tests for the option behavior and its rejection behavior; no change to `count_words` semantics or the default output.