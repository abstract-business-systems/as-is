# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Frequency filters for count

- Request: add independent `--rare N` and `--top N` options to `wordstats count`.
- Decision: `--rare N` retains words occurring no more than positive integer N; `--top N` retains the N highest-frequency words, resolving ties alphabetically. Each option is implemented by a pure helper module, while the CLI owns argument validation and applies requested filters before the established sorted-key JSON serialization.
- Options considered: mutate the counter contract (rejected: existing callers receive unfiltered counts); implement filtering inline in the CLI (rejected: the two independently testable component boundaries are explicit); reject simultaneous options (rejected: the request describes independent options, so composition remains available).
- Bounded change authorized: `src/wordstats/rarewords.py`, `src/wordstats/topwords.py`, the `count` CLI option wiring, and focused tests for success and non-positive/non-integer rejection.