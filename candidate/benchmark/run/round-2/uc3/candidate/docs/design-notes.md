# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: count `--min-count N` option

- Request: omit words with fewer than N occurrences from `wordstats count` output (N must be a positive integer; otherwise exit 2 with a clear message).
- Decision: `wordstats count <path> --min-count N` filters the counted mapping through a new helper `src/wordstats/topwords.py::filter_min_count(counts, min_count)` (returns entries with count >= N, input unmutated, key order preserved) before JSON output; default output (no option) is unchanged. `N` is validated by the CLI: a non-positive or non-integer value is rejected by argparse with a clear message and exit code 2.
- Options considered: filtering inside `counter.py` (rejected: mixes counting with output filtering and stretches the core-utility owner's contract); post-hoc `jq`/consumer-side filtering (rejected: the request defines CLI behavior); accepting N = 0 as a no-op (rejected: the request requires positive integers only).
- Bounded change authorized: the `--min-count N` option on `count`, the `topwords.py` helper, focused unit tests for the helper and for CLI option/rejection behavior, and the supporting records (owner record, ownership-map rows, task records).