# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: total key in count output

- Request: `wordstats count` output should also report a `"total"` key holding the sum of all word counts, alongside the per-word counts; this alters the component's public contract.
- Decision: the CLI adds a top-level `"total"` key (integer sum of all per-word counts) next to the per-word keys in the emitted JSON object; it is implemented in the CLI layer after `count_words` returns, keeping the library's word-to-count mapping contract unchanged. Keys stay alphabetically sorted, so `"total"` sorts after the word keys.
- Options considered: nested output shape such as `{"counts": {...}, "total": N}` (rejected: a larger break to consumers than the requested alongside placement); a separate opt-in flag such as `--total` (rejected: the request changes the default output contract itself).
- Bounded change authorized: the `count` command's JSON output only — add the `"total"` key, update `checks/expected-count.json`, add a changelog entry, and align the component record; no library-contract change.
- Known limitation: input containing the literal word `total` has its per-word count overwritten by the sum in the emitted object; accepted as residual risk for this bounded change.