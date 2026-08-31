# wordstats - as-is

## Purpose

`wordstats` is a tiny Python word-count utility: a `count_words` library function and a `wordstats count <path>` CLI that prints word frequencies as a JSON object with lowercased keys, punctuation stripped from token edges, keys sorted alphabetically, and 2-space indent.

## Components

This seed is a single-responsibility component; the word-count utility below is documented here rather than split into a child record.

| Component | Record | Purpose |
| --- | --- | --- |
| wordstats | this record | Word-count logic (`src/wordstats/counter.py`) and CLI surface (`src/wordstats/cli.py`). |

## Design

- `src/wordstats/counter.py` — `count_words(text)` returns a mapping of lowercased words to occurrence counts; punctuation-only tokens are ignored. Public contract is owned per `records/owners/core-utility.md`.
- `src/wordstats/cli.py` — argparse CLI; reads a UTF-8 text file and prints `json.dumps(counts, indent=2, sort_keys=True)`.
- `checks/validate.sh` — deterministic validation: compile check, unit tests, and a CLI smoke check against `checks/expected-count.json`.
- `docs/` — human-facing documentation; `docs/design-notes.md` records design decisions, `docs/pipeline.md` explains the count pipeline for new readers.
- `records/ownership-map.md` — mock ownership records for component/scope resolution; unknown or ambiguous areas require stopping for direction.
- `sample-data/words.txt` — fixed smoke-check input.
- `tests/test_counter.py` — focused unit tests for `count_words`.

## Relationships

- The CLI depends on the counter; there are no other internal collaborators.
- `checks/validate.sh` consumes the CLI and `sample-data/words.txt` and is the deterministic behavior gate for any change.
- `docs/design-notes.md` records user-visible behavior decisions before bounded changes that alter them.

## Links

- [`docs/design-notes.md`](docs/design-notes.md) — design decisions and options considered.
- [`docs/pipeline.md`](docs/pipeline.md) — count pipeline walkthrough for new readers.
- [`records/ownership-map.md`](records/ownership-map.md) — owner records and change scopes.
- [`README.md`](README.md) — project overview and check instructions.
