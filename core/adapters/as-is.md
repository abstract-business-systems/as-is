# core Adapters - as-is

## Purpose

Organize approved host- or transport-specific implementations that map core contracts to execution surfaces without becoming a second task authority.

## Components

| Component | Purpose |
| --- | --- |
| [Process](process/as-is.md#design) | Adapt bounded process-group execution and observation behind the host-neutral execution boundary. |

## Design

**Lineage**: [as-is](../../as-is.md#design) / [core](../as-is.md#design) / **core Adapters**

### Adapter hierarchy

The adapter hierarchy is the immediate-child structural map.

```mermaid
flowchart TB
    subgraph Adapters["core Adapters"]
        direction TB
        Process["<a href='./process/as-is.md#design'>process</a>"]
    end
```

Adapters are added only when a concrete host or transport boundary is established. The process adapter is the first approved family. Pi session and host-setup adapters remain separately bounded work.

## Links

- [`../../designs/core-modules-tools-and-skills.md`](../../designs/core-modules-tools-and-skills.md) — staged adapter direction.
