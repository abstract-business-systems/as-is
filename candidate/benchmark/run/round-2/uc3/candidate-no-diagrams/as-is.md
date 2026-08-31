# wordstats - as-is

## Purpose

A tiny mock Python word-count library and CLI (`wordstats`) serving as the fixed seed fixture for the round-2 benchmark arm `uc3/candidate-no-diagrams`. It exists only as benchmark fixture material, not as a live or promoted artifact.

## Components

| Component | Purpose |
| --- | --- |
| [`wordstats`](src/wordstats/as-is.md#design) | Word-count library and `count` CLI (JSON output, sorted keys). |

## Design

The project is a single Python package under `src/wordstats/` with focused unit tests under `tests/` and deterministic validation in `bash checks/validate.sh` (compile check, unit tests, and a CLI smoke check against `checks/expected-count.json`; no network access, nonzero exit on first failure). The seed intentionally shipped no agent-workflow configuration; this record set plus the task companions and changelogs is the adopted agent-workflow configuration. Mock ownership records for scope resolution live in the ownership map; human-facing design notes live in the design-notes document.

## Relationships

- The ownership map (`records/ownership-map.md`) and its owner records under `records/owners/` are the scope-resolution authority for change classification in this project.
- `docs/design-notes.md` records one note per user-visible design decision before the bounded change it authorizes.

## Links

- `records/ownership-map.md` → `records/ownership-map.md` — canonical ownership and change-scope resolution for requested changes.
- `docs/design-notes.md` → `docs/design-notes.md` — design-note convention that gates user-visible behavior changes.