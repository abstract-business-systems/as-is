# Components - as-is

## Purpose

Own the repository's implementation components: focused runtime, resolution, control, validation, setup, execution, and observability responsibilities with independent source and test boundaries.

## Components

| Component | Purpose |
| --- | --- |
| [as-is data resolution](as-is-data/as-is.md#design) | Resolve distributed machine configuration and local task data. |
| [as-is setup](as-is-setup/as-is.md#design) | Detect clients and wire canonical resources without copying them. |
| [budget arithmetic](budget-control/as-is.md#design) | Provide shared budget admission and exhaustion arithmetic. |
| [control plane](control-plane/as-is.md#design) | Enforce host-neutral task lifecycle and launch authority. |
| [instruction context](instruction-context/as-is.md#design) | Resolve applicable ancestor instruction files. |
| [linked context](linked-context/as-is.md#design) | Resolve explicitly linked bounded local context. |
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
        Data["<a href='./as-is-data/as-is.md#design'>as-is data resolution</a>"]
        Setup["<a href='./as-is-setup/as-is.md#design'>as-is setup</a>"]
        Budget["<a href='./budget-control/as-is.md#design'>budget arithmetic</a>"]
        Instructions["<a href='./instruction-context/as-is.md#design'>instruction context</a>"]
        Linked["<a href='./linked-context/as-is.md#design'>linked context</a>"]
        Validator["<a href='./task-record-validator/as-is.md#design'>task-record validator</a>"]
        Control["<a href='./control-plane/as-is.md#design'>control plane</a>"]
        Subprocess["<a href='./subprocess-execution-foundation/as-is.md#design'>subprocess execution<br/>foundation</a>"]
        Observability["<a href='./observability/as-is.md#design'>observability</a>"]

        Data -->|provides configuration<br/>to| Control
        Budget -->|supports admission in| Control
        Instructions -->|supplies applicable<br/>guidance to| Control
        Control -->|authorizes bounded<br/>attempts for| Subprocess
        Subprocess -->|emits supplementary<br/>events to| Observability
        Validator -->|checks records used by| Control
        Linked -->|resolves explicit<br/>context for| Control
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Components component
    class Data,Setup,Budget,Control,Instructions,Linked,Observability,Subprocess,Validator child
```

The arrows show supported information and control relationships, not a mandatory execution sequence. Setup remains a client-wiring boundary; the other components are consumed by the host-neutral execution and context surfaces as their contracts require.

## Links

- [`../docs/component-task-record-protocol.md`](../docs/component-task-record-protocol.md) — shared component and task-record protocol.
- [`../docs/execution-contract.md`](../docs/execution-contract.md) — host-neutral execution boundary.
