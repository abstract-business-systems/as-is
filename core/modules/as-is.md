# core Modules - as-is

## Purpose

Organize approved host-neutral deterministic functionality families under `core` while preserving each family's focused APIs, tests, authority, and security boundaries.

## Components

| Component | Purpose |
| --- | --- |
| [Context Resolution](context-resolution/as-is.md#design) | Resolve configuration, instructions, and explicitly linked local context through distinct focused APIs. |

## Design

**Lineage**: [as-is](../../as-is.md#design) / [core](../as-is.md#design) / **core Modules**

### Module-family hierarchy

```mermaid
flowchart TB
    subgraph Modules["core Modules"]
        direction TB
        Context["<a href='./context-resolution/as-is.md#design'>context-resolution</a>"]
    end
```

The `modules` area groups deterministic functionality by supported responsibility and lifecycle. It does not authorize host registration, agent-facing tool admission, task transitions, or target-project writes. Each family retains focused APIs and tests. A shared family name does not imply shared trust semantics or a merged implementation.

## Relationships

- `modules` provides deterministic functionality to host-neutral consumers through explicit APIs.
- Consumer and adapter ownership remains outside this structural grouping unless a separate component record establishes otherwise.

## Links

- [`../../designs/core-modules-tools-and-skills.md`](../../designs/core-modules-tools-and-skills.md) — staged module-family migration direction.
- [`../../docs/architecture-vocabulary.md#structural-containment`](../../docs/architecture-vocabulary.md#structural-containment) — documented parent and child boundaries.
