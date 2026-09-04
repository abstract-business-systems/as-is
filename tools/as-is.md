# tools - as-is

## Purpose
Organize bounded agent-facing tool implementations separately from host registration adapters, deterministic modules, and authority-bearing roles.

## Components

| Component | Purpose |
| --- | --- |
| [Agent](agent/as-is.md#design) | Expose bounded subagent assistance while preserving role admission and task authority outside the tool. |
| [Context](context/as-is.md#design) | Expose explicitly linked component context through the host-neutral resolver. |
| [Evidence](evidence/as-is.md#design) | Expose bounded session and trace evidence queries. |
| [As-is validators](as-is-validators/as-is.md#design) | Run repository-wide dogfood validators for records, navigation, diagrams, and related content. |
| [Backlog query](backlog-query/as-is.md#design) | Query backlog records and walk their component schema. |
| [Mermaid renderer](mermaid-renderer/as-is.md#design) | Provide Mermaid rendering and rendered-navigation support. |

## Design

**Lineage**: [as-is](../as-is.md#design) / **tools**

```mermaid
flowchart TB
    subgraph Tools["tools"]
        direction TB
        Agent["<a href='./agent/as-is.md#design'>agent</a>"]
        Context["<a href='./context/as-is.md#design'>context</a>"]
        Evidence["<a href='./evidence/as-is.md#design'>evidence</a>"]
        AsIsValidators["<a href='./as-is-validators/as-is.md#design'>as-is-validators</a>"]
        BacklogQuery["<a href='./backlog-query/as-is.md#design'>backlog-query</a>"]
        MermaidRenderer["<a href='./mermaid-renderer/as-is.md#design'>mermaid-renderer</a>"]
        Agent -->|uses| Context
        Agent -->|uses| Evidence
    end
```

Tools expose bounded functionality to agents. They do not select roles, authorize task transitions, mutate task records, grant component ownership, or replace host adapters. The `.pi/extensions/` files remain thin Pi registration entry points for these implementations. Repository validation utilities are explicitly covered here by `tools/as-is-validators`, including `content-test.ts` and its focused scripts; they are repository-wide dogfood infrastructure rather than a skill or a task authority.

## Links

- [`../designs/core-modules-tools-and-skills.md`](../designs/core-modules-tools-and-skills.md) — target tool families and boundaries.
