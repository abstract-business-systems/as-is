# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Existing note: count pipeline documentation (workflow adoption)

- Request: explain the wordstats count pipeline for a new reader.
- Decision: `docs/pipeline.md` gives a reader-oriented walkthrough of the count pipeline with a Mermaid flowchart of the CLI → counter → JSON output flow, and links to the owner contract, design notes, and validation entry point.
- Options considered: extending this design-notes file (rejected: notes record decisions, not reader explanations); a section in `README.md` (rejected: README is a project index, not a pipeline walkthrough).
- Bounded change authorized: the new documentation artifact and aligned record updates only; no code behavior change.