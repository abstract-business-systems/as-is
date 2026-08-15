
# Designs - as-is

## Purpose
Provide a discoverable component for enduring architecture, protocol, and
execution design documents.

## Design

**Lineage**: [as-is](../as-is.md#design) / **Designs**


### Design-document discovery context

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Reader["Repository reader"] -->|uses| Designs["Designs"]
    Designs -->|provides| Topics["Enduring architecture,<br/>protocol, and execution<br/>design"]
    Topics -->|connects-to| Work["Architecture and<br/>execution work"]
```

This component has no independently documented child components. The design
artifacts in this directory are ordinary documents rather than child
`as-is.md` components, so no container diagram is included.

## Links
- [execution-accounting-design.md](execution-accounting-design.md) — execution accounting design.
- [orchestration-design.md](orchestration-design.md) — orchestration design.
- [independent-delegation.md](independent-delegation.md) — independent delegation design.
- [model-simplicity-guidance.md](model-simplicity-guidance.md) — guidance for model-assisted coding to
  prefer simple central ownership over duplicated local solutions. Its open
  implementation item is recorded in the root [`backlog.md`](../backlog.md).
- [core-modules-tools-and-skills.md](core-modules-tools-and-skills.md) — phased handoff for separating core modules, agent-facing tools, skills, roles, adapters, component tasks, and subagent-first implementation.
- [aspirational-architecture-handoff.md](aspirational-architecture-handoff.md) — current-to-future boundary, ownership, sequencing, and non-authorizations for the remaining aspirational architecture items.
