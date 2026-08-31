# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Existing note: rare word filtering (`--rare` option)

- Request: `wordstats count` should be able to keep only words with N or fewer occurrences.
- Decision: `wordstats count <path> --rare N` keeps only words whose count is N or fewer; N must be a positive integer, otherwise the CLI exits with status 2 and a clear error message. The filtering logic lives in a new helper module `src/wordstats/rarewords.py`; the CLI only wires the option and prints the filtered result.
- Options considered: inline filtering in `cli.py` (rejected: keeps filtering logic out of the CLI surface, making it untestable without subprocess calls); a separate subcommand (rejected: expands the CLI surface beyond the requested option).
- Bounded change authorized: the `--rare N` option on `count`, the `rarewords.py` helper module, and focused unit tests for the option and its rejection behavior.