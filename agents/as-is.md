
# Agents - as-is

[Open repository design](../as-is.md#design)

## Purpose
Maintain the durable task context and organization for independent configured agent roles.

## Capability contract
Canonical role files declare ordinary Pi tools in front matter. Launcher
admission validates and forwards those declarations without injecting tools by
agent identity; the owning Pi host/package supplies executable implementations.
Unsupported, unavailable, or unauthorized tools fail closed before launch.
Read-only roles may still receive explicit host safety caps.

## Components

| Component | Purpose |
| --- | --- |
| [as-is router](as-is/as-is.md#design) | Interpret user-facing requests and route substantive work. |
| [component-builder](component-builder/as-is.md#design) | Build bounded components and maintain their records. |
| [execution-advisor](execution-advisor/as-is.md#design) | Analyze execution traces and readable local session data. |
| [worker](worker/as-is.md#design) | Provide bounded read-only in-process assistance. |

## Design

This is the container view for the documented agent components owned by the
Agents component. The container diagram uses the actual Agents component name and linked child
boxes. Reverse navigation to the parent is kept as a nearby Markdown link.

Parent: [as-is](../as-is.md#design)

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    subgraph Agents["Agents"]
        direction LR
        AsIsRouter["<a href='./as-is/as-is.md#design'>as-is router</a>"]
        ComponentBuilder["<a href='./component-builder/as-is.md#design'>component-builder</a>"]
        ExecutionAdvisor["<a href='./execution-advisor/as-is.md#design'>execution-advisor</a>"]
        Worker["<a href='./worker/as-is.md#design'>worker</a>"]

        AsIsRouter -->|routes work to| ComponentBuilder
        ComponentBuilder -->|requests evidence from| ExecutionAdvisor
        ComponentBuilder -->|requests bounded assistance from| Worker
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Agents component
    class AsIsRouter,ComponentBuilder,ExecutionAdvisor,Worker child
```

The diagram shows only the immediate documented children; other role files are
linked below but are not separate component nodes until they have their own
component records.

## Links

- [as-is/agent.md](as-is/agent.md) — canonical primary role contract.
- [component-builder/agent.md](component-builder/agent.md) — canonical recursive builder role contract.
- [expert/agent.md](expert/agent.md) — canonical read-only general consultation contract.
- [evidence-validator/agent.md](evidence-validator/agent.md) — canonical read-only repository evidence validator contract.
- [worker/agent.md](worker/agent.md) — canonical bounded implementation contract.
- [spawning-pi-subagents](../skills/spawning-pi-subagents/SKILL.md) — host/package admission contract.
