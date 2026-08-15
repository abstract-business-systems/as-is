# core - as-is

## Purpose

Organize host-neutral deterministic implementation families and their focused module boundaries without becoming a host adapter, agent role, skill, or target-project integration.

## Components

| Component | Purpose |
| --- | --- |
| [Modules](modules/as-is.md#design) | Organize host-neutral deterministic functionality families. |

## Design

**Lineage**: [as-is](../as-is.md#design) / **core**

### Core module hierarchy

```mermaid
flowchart TB
    subgraph Core["core"]
        direction TB
        Modules["<a href='./modules/as-is.md#design'>modules</a>"]
    end
```

The `core` area contains approved host-neutral deterministic implementation families. It is not an agent-facing tool registry, host projection surface, setup replacement, or target-project authority. Only separately approved families receive a documented child component. Physical placement does not merge distinct security, provenance, lifecycle, or authority boundaries.

## Relationships

- `core` provides host-neutral deterministic functionality to skills, task flows, and adapters through focused APIs.
- Host adapters and agent-facing tools remain separate future categories; their creation and placement require independent ownership evidence.

## Links

- [`../designs/core-modules-tools-and-skills.md`](../designs/core-modules-tools-and-skills.md) — approved vocabulary and staged migration direction.
- [`../docs/architecture-vocabulary.md#component-boundary`](../docs/architecture-vocabulary.md#component-boundary) — component boundary meaning.
