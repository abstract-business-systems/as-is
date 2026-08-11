# Managing As-Is Documents

## Purpose

Maintain durable `as-is.md` records that explain the purpose, design,
relationships, boundaries, hierarchy, and navigational context of repository
components. This component provides the reusable procedure for creating,
structuring, and maintaining those records without turning them into task,
backlog, configuration, or runtime authorities.

## Design

The skill inspects an owned record, preserves authoritative prose, applies the
canonical record shape, and defines what an `as-is.md` diagram must communicate:
what the component does, its actors, meaningful immediate children,
responsibilities, relationships, interactions, boundaries, authority changes,
consequential flows, and outcomes. It invokes the generic Mermaid diagram
design skill for Mermaid mechanics, functional framing, clear labels,
readability, and technical-detail limits. It validates links and structure
before recording completed durable changes in the owning changelog.

```mermaid
flowchart LR
    AUTHOR[Component owner or maintainer] --> CONTEXT[Authoritative component context]
    CONTEXT --> RECORD[Durable as-is record]
    DIAGRAM[Mermaid diagram design] --> VIEW[Reader-oriented context view]
    VIEW --> RECORD
    RECORD --> READER[Understandable purpose, hierarchy, boundaries, and relationships]
    CHECKS[Deterministic documentation checks] --> RECORD
```

The record shape uses Purpose, optional immediate Components, Design, optional
Relationships, and Links. A component boundary is the directory containing
`as-is.md`; child records are explicit components, while ordinary directories
and grandchildren are not promoted into the record. Parent context is never
ambient: declare exact durable links needed for a bounded child handoff.

This skill is used by agents and orchestrators that maintain component context;
it does not select, authorize, or launch them. The existing orientation utility
is read-only supporting infrastructure, not an authority-bearing workflow.

## Links

- [SKILL.md](SKILL.md) — authoritative record lifecycle, structure, boundaries, and checks.
- [../mermaid-diagram-design/SKILL.md](../mermaid-diagram-design/SKILL.md) — reusable Mermaid representation mechanics.
- [scripts/orient.ts](scripts/orient.ts) — compact read-only repository task snapshot.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation tests.
- [../mermaid-diagram-design/as-is.md](../mermaid-diagram-design/as-is.md) — Mermaid diagram-design component context.
