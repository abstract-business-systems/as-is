# Components - as-is

## Purpose

Own the repository's implementation components: focused runtime, resolution, control, validation, setup, execution, and observability responsibilities with independent source and test boundaries.

## Components

| Component | Purpose |
| --- | --- |
| [as-is setup](as-is-setup/as-is.md#design) | Detect clients and wire canonical resources without copying them. |
| [budget arithmetic](budget-control/as-is.md#design) | Historical component context for the migrated budget functionality; current implementation is under [`core/modules/task-control`](../core/modules/task-control/as-is.md#design). |
| [control plane](control-plane/as-is.md#design) | Historical component context for the migrated control-plane functionality; current implementation is under [`core/modules/task-control`](../core/modules/task-control/as-is.md#design). |
| [observability](observability/as-is.md#design) | Emit supplementary execution telemetry and bounded trace evidence. |
| [subprocess execution foundation](subprocess-execution-foundation/as-is.md#design) | Run bounded worker attempts through a detached host-neutral foundation. |
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
        Subprocess["<a href='./subprocess-execution-foundation/as-is.md#design'>subprocess execution<br/>foundation</a>"]
        Observability["<a href='./observability/as-is.md#design'>observability</a>"]

        Budget -->|supports admission in| Control
        Control -->|authorizes bounded<br/>attempts for| Subprocess
        Subprocess -->|emits supplementary<br/>events to| Observability
        Validator -->|checks records used by| Control
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Components component
    class Setup,Budget,Control,Observability,Subprocess,Validator child
```

The arrows show supported information and control relationships, not a mandatory execution sequence. Setup remains a client-wiring boundary; the other components are consumed by the host-neutral execution and context surfaces as their contracts require.

## Links

- [`../docs/component-task-record-protocol.md`](../docs/component-task-record-protocol.md) — shared component and task-record protocol.
- [`../docs/execution-contract.md`](../docs/execution-contract.md) — host-neutral execution boundary.
