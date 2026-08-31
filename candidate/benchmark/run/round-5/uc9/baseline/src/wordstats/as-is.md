# wordstats-core - as-is

## Purpose

Own the word-count library and `count` CLI surface for the wordstats project: turn UTF-8 text into lowercased word-frequency JSON.

## Design

A single Python package `wordstats` under `src/` with `counter.py` (tokenization and counting) and `cli.py` (argparse CLI, JSON output with sorted keys).

**Lineage**: [as-is](../../as-is.md#design) / **wordstats-core**

<Stable composition, responsibility, and consequential design facts.>

## Relationships

- `counter.count_words(text)` is the sole counting implementation; `cli.count` is its only caller and prints `json.dumps(counts, indent=2, sort_keys=True)`.

## Links

- `src/wordstats/` → implementation root for this component.
- `tests/test_counter.py` → unit tests for `count_words`.
- `records/owners/core-utility.md` → owner record defining the public contract.