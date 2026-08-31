# wordstats - as-is

## Purpose

Map the wordstats benchmark seed project: a tiny word-count library and `count` CLI with deterministic validation. This record is durable architecture context; it does not replace the owner records under `records/owners/`.

## Components

| Component | Purpose |
| --- | --- |
| [wordstats core](src/wordstats/as-is.md#design) | Own the word-count logic and CLI surface under `src/wordstats/`. |

## Design

The project is a single small utility: `src/wordstats/` implements counting and the CLI, `tests/` holds unit tests, and `checks/validate.sh` is the deterministic check entry point (compile, unit tests, CLI smoke check). Human-facing design decisions are recorded in `docs/design-notes.md` before bounded changes that alter user-visible behavior; ownership areas are resolved through `records/ownership-map.md`.

**Lineage**: **wordstats**

Support areas (`tests/`, `checks/`, `docs/`, `records/`, `sample-data/`) are not separately documented components; they serve the core component and are covered by the ownership map.