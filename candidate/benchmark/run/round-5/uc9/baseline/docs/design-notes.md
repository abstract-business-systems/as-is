# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: rare-word filtering option (--rare N)

- Request: let users keep only words that occur N or fewer times.
- Decision: `wordstats count <path> --rare N` filters the computed counts mapping through `src/wordstats/rarewords.py` (`filter_rare_words(counts, n)`, keeps words with count `<= n`) before printing the same sorted JSON. `N` must be a positive integer; otherwise the CLI exits with status 2 and a clear message.
- Options considered: filtering inside `counter.count_words` (rejected: mixes counting with output shaping and would grow the core module); a separate standalone command (rejected: the request names a `count` option); filtering in the CLI itself (rejected: the request places the logic in a dedicated module).
- Bounded change authorized: the `--rare N` option, its filter module, and its validation/exit-2 rejection behavior.

## Note: top-N filtering option (--top N)

- Request: let users keep only the N most frequent words.
- Decision: `wordstats count <path> --top N` filters the computed counts mapping through `src/wordstats/topwords.py` (`filter_top_words(counts, n)`, keeps the N most frequent words, ties broken alphabetically — the alphabetically earlier word wins a tie at the cutoff) before printing the same sorted JSON. `N` must be a positive integer; otherwise the CLI exits with status 2 and a clear message.
- Options considered: sorting keys alphabetically only (rejected: ignores the frequency requirement); keeping insertion order (rejected: output must stay deterministic); a separate standalone command (rejected: the request names a `count` option).
- Bounded change authorized: the `--top N` option, its filter module, and its validation/exit-2 rejection behavior.