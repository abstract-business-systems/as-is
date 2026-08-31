# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: count `--stats` option

- Request: append a summary object to `wordstats count` output containing the minimum count, maximum count, median count, and number of unique words.
- Decision: `wordstats count <path> --stats` prints the counts JSON object unchanged, then appends a summary JSON object on the next line with keys `max`, `median`, `min`, `unique` (sorted keys, 2-space indent, same JSON conventions as the counts object). The summary is computed by a new helper `src/wordstats/stats.py::summarize_counts(counts)`: `unique` is the number of distinct words, `min`/`max`/`median` are the standard minimum, maximum, and median of the count values (median of an even number of values is the average of the two middle values), and `min`/`max`/`median` are `null` for empty input with `unique` 0. Default output (no option) is unchanged.
- Options considered: a single combined JSON object nesting the counts under a key (rejected: changes the default output shape and breaks existing consumers); adding the summary keys to the counts object itself (rejected: mixes word keys with summary keys in one namespace); printing the summary only (rejected: the request says append, not replace).
- Bounded change authorized: the `--stats` option on `count`, the `stats.py` helper, focused unit tests for the helper and for the CLI option, and the supporting records (owner record, ownership-map row, task records).