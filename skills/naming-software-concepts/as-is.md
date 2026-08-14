# Naming Software Concepts - as-is

## Purpose

Choose names for repository concepts that accurately communicate their role,
scope, responsibility, and lifecycle.

## Design

This is a leaf skill component; no independently documented child components
are currently defined. The reusable procedure covers skills, agents, files,
directories, APIs, configuration, and domain concepts while preserving
host-required names such as `AGENTS.md` and `SKILL.md`.

[as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Naming Software Concepts**

- Pre-render layout plan: use the repository Markdown render surface without assuming fixed dimensions; arrange three short-labeled nodes and two directed edges as a taller-than-wide TB/ELK-style progression from concept through naming method to accurate repository name. Keep one ungrouped route; renderer geometry remains untested.

### Concept naming method

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Concept["Software concept"] -->|uses| Method["Naming method"]
    Method -->|provides| Name["Accurate repository name"]
```

## Links

- [SKILL.md](SKILL.md) — naming method, repository grammar, and quality checks.
- [Design Principles](../../docs/design-principles.md) — project-wide naming and
  minimal-change principles.
