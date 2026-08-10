# Managing As-Is Documents

## Purpose
Maintain durable `as-is.md` records that explain the purpose, design,
relationships, boundaries, and navigational context of repository components.
This component provides the reusable procedure for creating and maintaining
those records without turning them into task, backlog, configuration, or
runtime authorities.

## Design

The skill inspects an owned record, preserves authoritative prose, optionally
adds a reader-oriented Mermaid view, validates links and structure, and records
completed durable changes in the owning changelog.

```mermaid
flowchart LR
    AUTHOR[Component owner or maintainer] --> CONTEXT[Authoritative component context]
    CONTEXT --> RECORD[Durable as-is record]
    DIAGRAM[Mermaid diagram design] --> RECORD
    RECORD --> READER[Understandable purpose, boundaries, and relationships]
    CHECKS[Deterministic documentation checks] --> RECORD
```

## Relationships

This skill is used by agents and orchestrators that maintain component context;
it does not select, authorize, or launch them. It composes with the generic
[Mermaid diagram design skill](../functional-context-diagrams/as-is.md) for
visual representation and with
[structuring-as-is-records](../structuring-as-is-records/as-is.md) for the
canonical record shape. The existing orientation utility is a read-only
supporting script, not an authority-bearing workflow.

## Boundary

This component owns the `managing-as-is-document` procedure, its durable record,
and its existing `scripts/` utilities. It does not own component behavior,
agent authority, task lifecycle, backlog prioritization, or Mermaid diagram
semantics beyond applying the reusable diagram-design skill to `as-is.md`
records. The scripts remain in place and are not duplicated or moved.

## Links

- [SKILL.md](SKILL.md) — authoritative procedure, boundaries, outputs, and checks.
- [scripts/orient.ts](scripts/orient.ts) — compact read-only repository task snapshot.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation tests.
- [../functional-context-diagrams/as-is.md](../functional-context-diagrams/as-is.md) — Mermaid diagram-design component context.
- [../structuring-as-is-records/as-is.md](../structuring-as-is-records/as-is.md) — canonical durable record guidance.
