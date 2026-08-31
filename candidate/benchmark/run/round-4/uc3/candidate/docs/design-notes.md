# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: `--rare N` option on count (2026-08-31)

- Request: add `--rare N` to `wordstats count` that keeps only words with N or fewer occurrences; N must be a positive integer, otherwise exit 2 with a clear message.
- Decision: `--rare N` is an option on the existing `count` subcommand, validated at argument-parse time (argparse type) so invalid values exit 2 with a clear message before any file is read. The keep-words-with-count-<=-N rule lives in a new pure helper `filter_rare(counts, limit)` in `src/wordstats/rarewords.py`, so the policy is unit-testable independently of the CLI.
- Options considered: filtering inline in `cli.py` (rejected: mixes policy with argument handling and is harder to test); a separate `rare` subcommand (rejected: the request specifies an option); post-filtering the JSON output (rejected: lossy and couples the rule to the output format).
- Bounded change authorized: the `--rare N` option on `count`, the new helper module, and unit tests for both; default output without `--rare` is unchanged.