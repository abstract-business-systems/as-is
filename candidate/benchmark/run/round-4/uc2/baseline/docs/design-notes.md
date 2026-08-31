# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Note: installation instructions correction (README)

- Request: fix the stale `## Installation` section in README.md, which instructed users to install `wordstats-tools` from PyPI even though the project publishes no package.
- Decision: document the actual usage path — no published package; users run the CLI from a repository checkout with `PYTHONPATH=src python3 -m wordstats.cli count <path>`, matching how `checks/validate.sh` invokes the CLI.
- Options considered: publishing `wordstats-tools` to PyPI (rejected: packaging and release work is outside the bounded docs fix and no packaging metadata exists in the project); documenting a bare `python -m wordstats.cli` invocation (rejected: it does not resolve from a checkout root without the `PYTHONPATH` prefix).
- Bounded change authorized: the README `## Installation` section wording only; no source, test, or validation behavior changes.