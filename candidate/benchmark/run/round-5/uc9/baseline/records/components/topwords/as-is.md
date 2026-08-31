# topwords - as-is

## Purpose

Own the top-N filtering logic for `wordstats count --top N`: keep only the N most frequent words, ties broken alphabetically.

## Design

A pure filter module `src/wordstats/topwords.py` exposing `filter_top_words(counts, n)`; it receives an already-computed counts mapping and returns a new mapping restricted to the N most frequent words, with ties broken alphabetically (a word earlier in alphabetical order wins a tie at the cutoff). It owns no I/O and no CLI parsing; the CLI validates `N` and passes the mapping in.

**Lineage**: [as-is](../../../as-is.md#design) / [wordstats-core](../../../src/wordstats/as-is.md#design) / **topwords**

## Relationships

- Consumes the counts mapping produced by `wordstats-core` (`counter.count_words`).
- Is invoked by `cli.py` when `--top N` is supplied; `N` validation and exit-code behavior stay in the CLI.

## Links

- `src/wordstats/topwords.py` → the module this component owns.
- `records/components/topwords/tasks.md` → current bounded task narrative for this component.