# rarewords - as-is

## Purpose

Own the rare-word filtering logic for `wordstats count --rare N`: keep only words with N or fewer occurrences.

## Design

A pure filter module `src/wordstats/rarewords.py` exposing `filter_rare_words(counts, n)`; it receives an already-computed counts mapping and returns a new mapping of words whose count is `<= n`. It owns no I/O and no CLI parsing; the CLI validates `N` and passes the mapping in.

**Lineage**: [as-is](../../../as-is.md#design) / [wordstats-core](../../../src/wordstats/as-is.md#design) / **rarewords**

## Relationships

- Consumes the counts mapping produced by `wordstats-core` (`counter.count_words`).
- Is invoked by `cli.py` when `--rare N` is supplied; `N` validation and exit-code behavior stay in the CLI.

## Links

- `src/wordstats/rarewords.py` → the module this component owns.
- `records/components/rarewords/tasks.md` → current bounded task narrative for this component.