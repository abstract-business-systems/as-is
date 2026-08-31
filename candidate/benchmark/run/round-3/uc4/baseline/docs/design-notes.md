# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Validation documentation for new readers

- Request: explain how the project's deterministic validation works for a new reader.
- Decision: add `docs/validation.md` explaining `checks/validate.sh` for a new reader: the three checks in their fixed order (compile check, unit tests, CLI smoke check), the fail-fast behavior under `set -eu`, the byte-for-byte `checks/expected-count.json` comparison, and a Mermaid sequence diagram of the validation flow.
- Options considered: expanding the README section (rejected: the README is a contents index, and a reader-facing walkthrough would grow it beyond its scope); comments inside `checks/validate.sh` (rejected: no room for reader-oriented flow explanation and no diagram surface).
- Bounded change authorized: the new reader-facing explainer only; no change to `checks/validate.sh`, `checks/expected-count.json`, or any behavior.