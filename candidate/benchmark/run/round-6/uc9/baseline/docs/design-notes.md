# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Count command filters

- Request: add `--rare N` and `--top N` filters to `wordstats count`.
- Decision: `--rare N` retains entries occurring at most N times; `--top N` retains the N highest-frequency entries, resolving ties alphabetically. N must be a positive integer and invalid values produce argparse exit 2. When both are supplied, rare filtering runs before top selection.
- Options considered: validate in helper modules (rejected: helpers remain pure mapping transformations); leave combined options undefined (rejected: deterministic CLI behavior is preferable); rank top ties by input order (rejected: output must be reproducible independently of mapping insertion order).
- Bounded change authorized: two helper modules, CLI option parsing/composition, focused tests, and the corresponding component records only.