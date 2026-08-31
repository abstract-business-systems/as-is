# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## count --min-count option (2026-08-30)

- Request: add a `--min-count N` option to `wordstats count` that omits words with fewer than N occurrences; N must be a positive integer, otherwise exit 2 with a clear message.
- Decision: `wordstats count <path> --min-count N` filters the counts mapping to words with at least N occurrences before JSON output; keys stay sorted, formatting unchanged. N must be a positive integer; invalid values exit 2 with an explicit message (`--min-count must be a positive integer`). When the option is absent, behavior is unchanged. The filtering logic lives in the new helper module `src/wordstats/topwords.py` (`filter_min_count(counts, min_count)`); the option and its validation live in `src/wordstats/cli.py`.
- Options considered: filtering inline in the CLI body (rejected: keeps policy logic entangled with argument handling and hard to unit-test); a separate `top` subcommand (rejected: same output contract, needless surface growth); leaving filtering to callers (rejected: breaks the sorted-JSON output contract consumers rely on).
- Bounded change authorized: add `--min-count N` to the `count` subcommand only; `counter.count_words` tokenization and the output contract are unchanged.