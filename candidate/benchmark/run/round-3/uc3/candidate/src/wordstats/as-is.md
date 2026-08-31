# wordstats core - as-is

## Purpose

Owns the word-count logic and CLI surface of the wordstats utility: turning text into a lowercase word-frequency mapping and exposing it through the `wordstats count` command as sorted JSON.

## Design

- `counter.py` — `count_words(text)` returns a mapping of lowercased words to counts; punctuation is stripped from token edges and punctuation-only tokens are ignored.
- `cli.py` — `wordstats count <path>` prints the counts as a JSON object with sorted keys and 2-space indent; returns process exit code 0 on success.
- The durable owner record for this component is `records/owners/core-utility.md`, which holds the public contract.

## Relationships

- Consumed by `checks/validate.sh` (unit tests and CLI smoke check) and by the focused unit tests under `tests/`.
- Design decisions affecting user-visible behavior are recorded in `docs/design-notes.md` per the design-notes owner record.