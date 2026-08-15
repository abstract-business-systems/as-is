# as-is - as-is

## Purpose

Own the repository-wide composition model and provide the top-level map of its
agent roles, reusable skills, implemented components, design documents, and
validation fixtures. This record is durable shared context for both human
readers and agents: humans use it to review the architecture, and agents use it
to orient within the repository. It does not replace the records owned by the
areas it maps.

## Components

The root component lists only its immediate documented component children.
Deeper descendants are linked by their immediate parent rather than by this
record.

| Component | Purpose |
| --- | --- |
| [Agents](agents/as-is.md#design) | Organize independent configured agent roles. |
| [Designs](designs/as-is.md#design) | Organize enduring architecture and execution designs. |
| [Skills](skills/as-is.md#design) | Organize reusable operational procedures. |
| [Components](components/as-is.md#design) | Organize implementation boundaries and their focused tests. |
| [Documentation](docs/as-is.md#design) | Organize normative repository protocols and guidance. |
| [Validation Fixtures](validation-fixtures/as-is.md#design) | Organize retained delegation, adapter, and recovery evidence. |
| [Host Integration](host-integration/as-is.md#design) | Define the future installed-host integration boundary and its approval gates. |

## Design

This is a component map, not a mandatory execution sequence. The root record
connects the repository component to its immediate documented child areas.

**Lineage**: **as-is**

The repository's composition model separates authority-bearing agents and workflows from reusable skills. Agents and workflows compose the child areas; explicit links and each area's Design section provide the bounded context for their relationships.


### Repository child relationship map

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    subgraph Root["as-is"]
        direction LR
        Agents["<a href='./agents/as-is.md#design'>Agents</a>"]
        Designs["<a href='./designs/as-is.md#design'>Designs</a>"]
        Skills["<a href='./skills/as-is.md#design'>Skills</a>"]
        Components["<a href='./components/as-is.md#design'>Components</a>"]
        Documentation["<a href='./docs/as-is.md#design'>Documentation</a>"]
        Fixtures["<a href='./validation-fixtures/as-is.md#design'>Validation Fixtures</a>"]
        HostIntegration["<a href='./host-integration/as-is.md#design'>Host Integration</a>"]
        Agents -->|uses procedures from| Skills
        Components -->|follows protocols from| Documentation
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Root component
    class Agents,Designs,Skills,Components,Documentation,Fixtures,HostIntegration child
```

The Components table is the required Markdown and renderer fallback for the linked immediate-child boxes.

Only areas with their own `as-is.md` are components in this record. Other repository directories remain navigable through their own files or links but are not listed as components here. `docs/` is a documented collection rather than a set of child components. `.pi/` remains a projected bundle artifact; the new `host-integration/` record provides durable context for its future installed-host boundary without making `.pi/` canonical or granting projection authority. `.opencode/`, `scripts/`, `temp/`, and `.agents/` also remain ordinary or projected artifacts without independent records.

- The repository is composed of filesystem areas and components with durable
  `as-is.md` records.
- This root record maps immediate areas; each area owns the detailed records for
  its descendants.
- The `.pi/` directory remains a projected bundle artifact rather than a canonical resource component; `host-integration/` owns only the future installed-host integration boundary and its approval gates.
- Explicit links provide bounded context; parent context is never ambient.
- Machine configuration belongs in `as-is.json`, and active task state belongs
  in the configured task record.

## Links

- [`docs/design-principles.md`](docs/design-principles.md) — repository-wide authority and design principles.
- [`docs/architecture-vocabulary.md`](docs/architecture-vocabulary.md#scope-and-authority) — shared current-system architecture definitions and authority boundary.
- [`docs/configuration.md`](docs/configuration.md) — machine-configuration boundary.
