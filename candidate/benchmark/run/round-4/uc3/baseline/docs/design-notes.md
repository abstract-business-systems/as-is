# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.
## Note: --rare N option for count command

- Request: keep only words with N or fewer occurrences in `wordstats count` output.
- Decision: add an optional `--rare N` flag to the `count` subcommand. When present, the counted mapping is filtered through the new helper module `src/wordstats/rarewords.py` (`filter_rare`) to entries whose count is at most N before printing; output format is otherwise unchanged. N must be a positive integer: non-integer values are rejected by argparse and zero or negative values by an explicit parser error, both exiting 2 with a clear message and printing no count output.
- Options considered: filtering inline in `cli.py` (rejected: the request requires the filtering logic in a dedicated helper module); a separate subcommand (rejected: expands the CLI surface beyond the request); post-processing the printed JSON (rejected: bypasses the counting contract and complicates tests).
- Bounded change authorized: the `--rare N` option on `count`, the new helper module, and unit tests covering the option and its rejection behavior only.
