# Design notes

Human-facing design notes are recorded in this directory, one note per design decision, newest last. Format: request summary, decision, options considered, and the bounded change the decision authorizes.

## Existing note: count command output (initial seed)

- Request: report word frequencies for a text file.
- Decision: `wordstats count <path>` prints a JSON object mapping lowercased words to counts, keys sorted alphabetically, 2-space indent.
- Options considered: plain text columns (rejected: harder to consume programmatically); CSV (rejected: quoting complexity for a tiny utility).
- Bounded change authorized: the initial `count` command only.

## Existing note: documented usage command (README correction)

- Request: the README `## Usage` section showed `python -m wordstats sample-data/words.txt`, which fails because the package has no `__main__` module and omits the `count` subcommand.
- Decision: document the working invocation `PYTHONPATH=src python -m wordstats.cli count sample-data/words.txt`, matching the CLI smoke check in `checks/validate.sh`.
- Options considered: adding a `__main__.py` so `python -m wordstats` works (rejected: expands the CLI surface beyond the corrected-documentation scope); `pip install -e` setup (rejected: no packaging exists in this seed).
- Bounded change authorized: README `## Usage` correction only; no code behavior change.