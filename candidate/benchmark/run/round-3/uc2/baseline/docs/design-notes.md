# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: README installation instructions

- Request: fix the stale `## Installation` section of `README.md`, which told users to `pip install wordstats-tools` — a package that does not exist and is not the actual way to get this tool.
- Decision: replace the section with source-tree usage: no package is published, so users run the CLI directly from a copy of the project via `PYTHONPATH=src python3 -m wordstats.cli count <path-to-text-file>`.
- Options considered: keeping a corrected package name (rejected: no package exists on any index); publishing a real package (rejected: out of scope for a benchmark seed fixture and beyond the bounded request).
- Bounded change authorized: the `## Installation` section of `README.md` only.