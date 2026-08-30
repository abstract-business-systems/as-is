# wordstats - as-is

## Purpose

Own the seed project as a bounded whole: a tiny word-count library and CLI with deterministic validation. This record is the top-level map of the project's documented components; it does not replace the records owned by the areas it maps.

## Components

| Component | Purpose |
| --- | --- |
| [wordstats-core](src/wordstats/as-is.md#design) | Count words in text and expose them through the `count` CLI. |

## Design

This is a component map, not an execution sequence. The root record connects the project to its single documented component area.

**Lineage**: **wordstats**

Supporting material (`tests/`, `checks/`, `docs/`, `records/`, `sample-data/`) is navigable through its own files and ownership records (`records/ownership-map.md`) but is not decomposed into components: each lacks independent change or operational complexity that would justify a record.