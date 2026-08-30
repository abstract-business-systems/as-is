# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Design note: `--top N` option for `count` (2026-08-30)

- Request: add a `--top N` option to `wordstats count` that prints only the `N` most frequent words, keeping the default full-frequency output unchanged.
- Decision: `wordstats count <path> --top N` prints a JSON object (same 2-space indent, keys sorted alphabetically as the default output) containing only the `N` highest-count words. Words are ranked by descending count; words with equal counts are ranked alphabetically, so ties near the cutoff are filled alphabetically first. `N` must be a positive integer; `N <= 0` or a non-integer value is rejected with a nonzero exit and a clear message on stderr. Without `--top`, the full-frequency output is byte-identical to the existing behavior.
- Options considered: ranking ties by first appearance order (rejected: nondeterministic across input orderings and harder to document); printing a JSON array of `[word, count]` pairs for `--top` (rejected: would change the output type consumers already parse); validating `N` manually in the command body (rejected in favor of an argparse argument type so every rejection path gets a consistent nonzero exit and message).
- Bounded change authorized: the `--top N` option on the `count` command only (component scope per `records/ownership-map.md`); no change to the default output or the `count_words` contract.