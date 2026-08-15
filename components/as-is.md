# Components - as-is

## Purpose

Own the repository's remaining implementation components and historical migration records that have not moved to `core/modules/` or `core/adapters/`.

## Components

| Component | Purpose |
| --- | --- |
| [as-is setup](as-is-setup/as-is.md#design) | Detect clients and wire canonical resources without copying them. |
| [budget arithmetic](budget-control/as-is.md#design) | Historical component context for the migrated budget functionality; current implementation is under [`core/modules/task-control`](../core/modules/task-control/as-is.md#design). |
| [control plane](control-plane/as-is.md#design) | Historical component context for the migrated control-plane functionality; current implementation is under [`core/modules/task-control`](../core/modules/task-control/as-is.md#design). |
| [task-record validator](task-record-validator/as-is.md#design) | Check task-record invariants mechanically. |

## Design

The Components area groups implementation boundaries by responsibility rather than by execution order. Each child owns its source, focused tests, durable record, and component-specific history.

**Lineage**: [as-is](../as-is.md#design) / **Components**

### Component relationship map


```mermaid
---
config:
  layout: elk
---
%%{init: {"securityLevel": "loose"}}%%
flowchart TB
    subgraph Components["Components"]
        direction TB
        Setup["<a href='./as-is-setup/as-is.md#design'>as-is setup</a>"]
        Budget["<a href='./budget-control/as-is.md#design'>budget arithmetic</a>"]
        Validator["<a href='./task-record-validator/as-is.md#design'>task-record validator</a>"]
        Control["<a href='./control-plane/as-is.md#design'>control plane</a>"]
        Budget -->|supports admission in| Control
        Validator -->|checks records used by| Control
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Components component
    class Setup,Budget,Control,Validator child
```

The arrows show supported information and control relationships, not a mandatory execution sequence. Setup remains a client-wiring boundary; the historical budget and control records point to their current task-control family, while process and observability implementation now have durable owners under `core/adapters/` and `core/modules/`.

## Links

- [`../docs/component-task-record-protocol.md`](../docs/component-task-record-protocol.md) — shared component and task-record protocol.
- [`../docs/execution-contract.md`](../docs/execution-contract.md) — host-neutral execution boundary.
