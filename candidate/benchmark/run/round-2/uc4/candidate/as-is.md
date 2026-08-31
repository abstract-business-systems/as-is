# wordstats - as-is

## Purpose

Own the wordstats benchmark seed project: a tiny word-count library and `count` CLI with deterministic validation. This record is the durable component map and navigational context for the project; it was created during agent-workflow adoption because the seed intentionally ships none.

## Components

The project is a single-component utility; its filesystem areas and their owner records are mapped below. Deeper detail lives in the linked owner records rather than here.

| Area | Purpose | Owner record |
| --- | --- | --- |
| [src/wordstats](records/owners/core-utility.md) | Word-count library and `count` CLI (JSON output, sorted keys). | core-utility |
| [docs](records/owners/design-notes.md) | Reader-facing documentation: design notes and the count pipeline explanation. | design-notes |
| [tests](records/owners/core-utility.md) | Focused unit tests for the library. | core-utility |
| [checks](records/owners/core-utility.md) | Deterministic validation: `bash checks/validate.sh`. | core-utility |
| [records](records/ownership-map.md) | Ownership map and per-area owner records supporting scope resolution. | ownership-map |
| [sample-data](records/owners/core-utility.md) | Fixed input for the CLI smoke check. | core-utility |

## Design

The count pipeline is a single flow: the CLI reads a UTF-8 text file, the counter lowercases tokens, strips punctuation from token edges, ignores punctuation-only tokens, and aggregates counts, and the CLI prints the result as 2-space-indented JSON with alphabetically sorted keys. The reader-oriented explanation, including the CLI → counter → JSON output flowchart, lives in [docs/pipeline.md](docs/pipeline.md). The public contract is owned by [core-utility](records/owners/core-utility.md); user-visible behavior decisions are recorded in [docs/design-notes.md](docs/design-notes.md) before bounded changes.

## Links

- [`records/ownership-map.md`](records/ownership-map.md) — ownership map; unknown or ambiguous areas have no owner record and stop for direction.
- [`docs/design-notes.md`](docs/design-notes.md) — human-facing design decisions.
- [`docs/pipeline.md`](docs/pipeline.md) — count pipeline explanation for new readers.
- [`CHANGELOG.md`](CHANGELOG.md) — durable change history.
- [`checks/validate.sh`](checks/validate.sh) — deterministic validation entry point.
- [`as-is.json`](as-is.json) — machine configuration and local task metadata.