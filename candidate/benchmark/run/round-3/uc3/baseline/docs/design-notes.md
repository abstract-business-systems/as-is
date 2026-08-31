# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Existing note: count command --rare option

- Request: keep only words that occur N or fewer times in the counted output.
- Decision: `wordstats count --rare N <path>` filters the count mapping to words whose occurrence count is at most N (inclusive). N must be a positive integer; otherwise the CLI exits with status 2 and a clear message. The filtering logic lives in a new `src/wordstats/rarewords.py` helper module (`filter_rare(counts, max_occurrences)`, non-mutating); the CLI only parses, validates, and wires it. Default (no-flag) output is unchanged.
- Options considered: filtering inline in `cli.py` (rejected: tangles validation with filtering logic); a separate `rare` subcommand (rejected: changes the command surface for what is a modifier of the existing count output).
- Bounded change authorized: the `--rare N` option on `count`, the `rarewords.py` helper, and its unit tests.