# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: --rare N filter for count (2026-08-31)

- Request: keep only words with N or fewer occurrences in `wordstats count` output, behind an optional `--rare N` flag.
- Decision: `wordstats count <path> --rare N` first counts words as usual, then keeps only words whose count is N or fewer; N must be a positive integer, otherwise the CLI exits 2 with a clear message on stderr. The filtering logic lives in a new module `src/wordstats/rarewords.py`, implemented as its own bounded child component with a delegated child worker; the CLI composes the module after counting.
- Options considered: filtering inside `counter.py` (rejected: mixes counting with output shaping and crosses the core-utility owner boundary); a separate subcommand (rejected: changes the existing `count` surface users already consume); post-count filtering in `cli.py` only (rejected: hides filter logic from tests and reuse).
- Bounded change authorized: new module `src/wordstats/rarewords.py`, the optional `--rare` argument and its wiring in `cli.py`, unit tests for the filter and its rejection behavior, and the records updates this note serves.

## Note: --top N filter for count (2026-08-31)

- Request: keep only the N most frequent words in `wordstats count` output, behind an optional `--top N` flag.
- Decision: `wordstats count <path> --top N` keeps the N most frequent words, ties broken alphabetically (words are ordered by descending count, then ascending word, and the first N are kept); N must be a positive integer, otherwise the CLI exits 2 with a clear message on stderr. The ordering and truncation logic lives in a new module `src/wordstats/topwords.py`, implemented as its own bounded child task; the CLI composes the module after counting. Output keys remain alphabetically sorted JSON.
- Options considered: sorting inside `counter.py` (rejected: the counting contract stays mapping-shaped); breaking ties by first appearance (rejected: deterministic alphabetical tie-breaking is the requested behavior); separate subcommand (rejected for the same reason as `--rare`).
- Bounded change authorized: new module `src/wordstats/topwords.py`, the optional `--top` argument and its wiring in `cli.py`, unit tests for the filter and its rejection behavior, and the records updates this note serves.

Combining `--rare` and `--top` in one invocation is authorized as sequential composition: rare-filter first, then top-selection on the rare-filtered counts. The two children must not edit each other's modules, the CLI, or shared test files; the parent integrates both modules.