# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Existing note: deterministic validation guide

- Request: explain how the project's deterministic validation works for a new reader.
- Decision: add `docs/validation.md` describing the compile check, unit tests, and CLI smoke check, with a Mermaid sequence diagram of the validation flow; leave `checks/validate.sh` behavior unchanged.
- Options considered: extending `README.md` (rejected: the README stays a short index and the explanation needs its own page); documenting the flow as script comments (rejected: not discoverable as reader documentation).
- Bounded change authorized: the new documentation file plus an index line in `README.md` only; no validation behavior change.