# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: `count --top N` (top-N output)

- Request: add a `--top N` option to `wordstats count` that prints only the `N` most frequent words as a JSON object, keeping the default full-frequency output unchanged.
- Decision: with `--top N`, the CLI prints only the `N` highest-count words as a JSON object, keys still sorted alphabetically with 2-space indent. Words are ranked by count descending; ties are broken alphabetically, so when counts are equal the alphabetically first words win the remaining slots. If `N` exceeds the number of distinct words, all words are printed. `N` must be a positive integer: a zero, negative, or non-integer `N` is rejected with exit code 2 and a clear message on stderr (`--top must be a positive integer`), and no JSON is printed. The default output without `--top` is unchanged.
- Options considered: stable insertion order for ties (rejected: undocumented and non-deterministic across implementations); `--top 0` meaning "all" (rejected: surprising; the request requires rejecting non-positive values); a separate `top` subcommand (rejected: the request specifies an option on `count`).
- Bounded change authorized: a `top_words(counts, n)` helper and the `--top` option in the `wordstats` package only, per `records/owners/core-utility.md`.