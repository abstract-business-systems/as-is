# worker - as-is

## Purpose

Perform one authorized, bounded component implementation without committing,
delegating, launching subprocesses, using credentials, or communicating
externally.

## Design

The worker is a leaf role for one authorized, bounded component implementation. It uses the assigned scope, task requirements, and acceptance conditions as its behavioral authority, may inspect and edit only the assigned component scope, returns a structured report, and does not acquire authority through caller identity, delegation ancestry, telemetry, commits, subprocesses, credentials, or external communication.

**Lineage**: [as-is](../../as-is.md#design) / [agents](../as-is.md#design) / **worker**

### Bounded worker assistance


```mermaid
---
config:
  layout: elk
---
flowchart TB
    Caller["Authorized caller"] --> Request["Bounded task scope, requirements, and acceptance"]

    subgraph WorkerBoundary["Worker agent boundary"]
        Request --> Boundary{"Within worker boundary?"}
        Boundary -->|authorized bounded work| Inspect["Inspect assigned component and task context"]
        Inspect --> Work["Perform only authorized bounded work"]
        Work --> Report["Return finding, evidence, recommendation, and residual risk"]
        Boundary -->|forbidden capability or out-of-scope work| Refuse["Report limitation and take no outside action"]
    end

    Authority["Assigned task and acceptance conditions"] -.-> Request
    Scope["Assigned component scope"] -.-> Work
    Report --> Caller
    Refuse --> Caller
```

The primary path is bounded inspection, implementation within assigned component scope, and evidence reporting. The alternate path preserves the boundary by returning a limitation instead of committing, delegating, launching a subprocess, using credentials, communicating externally, or editing outside assigned scope. The caller remains responsible for integration, downstream validation, and task completion.

## Links

- [`agent.md`](agent.md) — canonical worker role authority and report contract.
- [`../../docs/component-task-record-protocol.md`](../../docs/component-task-record-protocol.md) — durable task and acceptance authority.
