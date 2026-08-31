# wordstats - as-is

wordstats is a tiny Python word-count utility: a library that counts lowercased word frequencies in text and a `count` CLI that reports them as sorted JSON. It exists as a benchmark seed fixture, not as a live or promoted artifact.

## Design

The library (`src/wordstats/counter.py`) lowercases tokens, strips punctuation from token edges, ignores punctuation-only tokens, and returns a count mapping. The CLI (`src/wordstats/cli.py`) reads a UTF-8 text file and prints the counts as a JSON object with alphabetically sorted keys and 2-space indent. The public contract is recorded in the owner record `records/owners/core-utility.md`; design decisions are recorded in `docs/design-notes.md`, and ownership areas are mapped in `records/ownership-map.md`.

## Components

- [wordstats core](src/wordstats/as-is.md#design) — the counting library and CLI surface in `src/wordstats/`.

## Checks

Deterministic validation lives in `checks/validate.sh` (compile check, unit tests, CLI smoke check against `checks/expected-count.json`); run it with `bash checks/validate.sh`.