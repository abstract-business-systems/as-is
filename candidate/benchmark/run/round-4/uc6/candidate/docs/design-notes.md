# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: count command total

- Request: the `wordstats count` output should also report a `"total"` key holding the sum of all word counts, alongside the per-word counts.
- Decision: `wordstats count` adds a `"total"` key to the same JSON object, holding the sum of all per-word counts; per-word keys, alphabetical sorting, and 2-space indentation are unchanged, and the mapping returned by `count_words` stays word-counts-only.
- Options considered: a nested `{"counts": ..., "total": ...}` object (rejected: a larger public-contract change than requested); a separate total line outside the JSON object (rejected: breaks the single-JSON-object output contract).
- Bounded change authorized: the `count` CLI output only, plus the matching smoke-check expectation in `checks/expected-count.json` and a changelog entry. Known edge behavior: text containing the literal word "total" has that word's per-word count replaced by the sum (the total overwrites the key); accepted for this bounded change.