# Managing As-Is Documents - as-is

## Purpose

Maintain durable `as-is.md` records that explain the purpose, design,
relationships, boundaries, hierarchy, and navigational context of repository
components. This component provides the reusable procedure for creating,
structuring, and maintaining those records without turning them into task,
backlog, configuration, or runtime authorities.

## Design

[Open Skills design](../as-is.md#design)

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
    AUTHOR["Component owner or maintainer"] --> CONTEXT["Authoritative component context"]
    CONTEXT --> RECORD["Durable as-is record"]
    DIAGRAM["Designing Mermaid diagrams"] --> VIEW["Reader-oriented context view"]
    VIEW --> RECORD
    RECORD --> READER["Understandable purpose, hierarchy, boundaries, and relationships"]
    CHECKS["Deterministic documentation checks"] --> RECORD
```

Parent: [Skills](../as-is.md#design)

The record shape uses Purpose, optional immediate Components, Design, optional
Relationships, and Links. A parent record's Design begins with its box-oriented
container diagram; non-parent records do not receive container diagrams. A
component boundary is the directory containing `as-is.md`; child records are
explicit components, while ordinary directories and grandchildren are not
promoted into the record. Parent context is never ambient: declare exact
durable links needed for a bounded child handoff.

This skill is used by agents and orchestrators that maintain component context;
it does not select, authorize, or launch them. The existing orientation utility
is read-only supporting infrastructure, not an authority-bearing workflow.

## Links

- [SKILL.md](SKILL.md) — authoritative record lifecycle, structure, boundaries, and checks.
- [container-diagram-example.md](container-diagram-example.md) — proposed balanced parent container diagram and sibling-relationship treatment.
- [diagram-examples.md](diagram-examples.md) — examples for every supported as-is diagram view.
- [backlog.md](backlog.md) — pending as-is-specific vocabulary, view, and validation work.
- [../designing-mermaid-diagrams/SKILL.md](../designing-mermaid-diagrams/SKILL.md) — reusable generic Mermaid representation mechanics.
- [scripts/orient.ts](scripts/orient.ts) — compact read-only repository task snapshot.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation tests.
- [../designing-mermaid-diagrams/as-is.md](../designing-mermaid-diagrams/as-is.md) — Mermaid diagram-design component context.
