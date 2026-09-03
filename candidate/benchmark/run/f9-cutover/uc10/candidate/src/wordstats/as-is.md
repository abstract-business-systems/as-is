# wordstats - as-is

## Purpose

Own normalized word counting and the `wordstats count` command, including the optional statistics summary and focused unit coverage.

## Components

This is a leaf component. Its implementation files are `counter.py`, `stats.py`, `cli.py`, and `__init__.py`; focused tests live under the project-owned `tests/` directory.

## Design

The component normalizes lowercase whitespace-delimited tokens, strips punctuation from token edges, ignores punctuation-only tokens, and returns mappings. The CLI reads UTF-8 text and emits sorted, indented JSON. With `--stats`, the count command appends a summary object containing minimum count, maximum count, median count, and number of unique words while preserving the existing count mapping.

**Lineage**: [wordstats project](../../as-is.md#design) / **wordstats**

The component boundary covers the source package. `records/ownership-map.md` identifies the core-utility owner for this component; `docs/design-notes.md` owns the user-visible output decision, and `CHANGELOG.md` owns durable history.

## Links

- [`counter.py`](counter.py) — existing word normalization and counting.
- [`cli.py`](cli.py) — command-line parsing and JSON output.
- [`stats.py`](stats.py) — statistics summary implementation introduced by the bounded feature.
- [`../../tests/`](../../tests/) — focused project tests.
- [`../../docs/design-notes.md`](../../docs/design-notes.md) — user-facing design decision.
