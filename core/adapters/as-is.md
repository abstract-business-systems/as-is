# core Adapters - as-is

## Purpose
Organize approved host- or transport-specific implementations that map core contracts to execution surfaces without becoming a second task authority.

## Components

| Component | Purpose |
| --- | --- |
| [Process](process/as-is.md#design) | Adapt bounded process-group execution and observation behind the host-neutral execution boundary. |
| [Host setup](host-setup/as-is.md#design) | Adapt persisted-client detection and canonical-resource setup without owning host-integration approval or target-project state. |
| [Pi adapter](pi/as-is.md#design) | Adapt bounded Pi subprocess delegation behind the launcher contract. |

## Design

**Lineage**: [as-is](../../as-is.md#design) / [core](../as-is.md#design) / **core Adapters**

### Adapter hierarchy

The adapter hierarchy is the immediate-child structural map.

```mermaid
flowchart TB
    subgraph Adapters["core Adapters"]
        direction TB
        Process["<a href='./process/as-is.md#design'>process</a>"]
        HostSetup["<a href='./host-setup/as-is.md#design'>host-setup</a>"]
        Pi["<a href='./pi/as-is.md#design'>pi</a>"]
        Process -.->|independent adapter boundary| HostSetup
        HostSetup -.->|independent adapter boundary| Pi
    end
```

Adapters are added only when a concrete host or transport boundary is established. The process, host-setup, and Pi adapters are approved concrete families. The Pi adapter keeps bounded delegation execution, registration, and package loading separate from task-record authority.

## Links

- [`../../designs/core-modules-tools-and-skills.md`](../../designs/core-modules-tools-and-skills.md) — staged adapter direction.
