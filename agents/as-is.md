
# Agents - as-is

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
| [evidence-validator](evidence-validator/as-is.md#design) | Validate bounded controlled-worktree evidence. |
| [expert](expert/as-is.md#design) | Provide read-only cross-domain consultation and review. |
| [thinking-companion](thinking-companion/as-is.md#design) | Help humans examine questions and ideas. |
| [worker](worker/as-is.md#design) | Provide bounded read-only in-process assistance. |

## Design

This is the container view for the documented agent components owned by the Agents component. The diagram shows supported routing relationships between independent roles, not a mandatory delegation chain. Reverse navigation to the parent is kept as a nearby Markdown link.

Parent: [as-is](../as-is.md#design)

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    subgraph Agents["Agents"]
        direction LR
        AsIsRouter["<a href='./as-is/as-is.md#design'>as-is router</a>"]
        ComponentBuilder["<a href='./component-builder/as-is.md#design'>component-builder</a>"]
        ExecutionAdvisor["<a href='./execution-advisor/as-is.md#design'>execution-advisor</a>"]
        EvidenceValidator["<a href='./evidence-validator/as-is.md#design'>evidence-validator</a>"]
        Expert["<a href='./expert/as-is.md#design'>expert</a>"]
        ThinkingCompanion["<a href='./thinking-companion/as-is.md#design'>thinking-companion</a>"]
        Worker["<a href='./worker/as-is.md#design'>worker</a>"]

        AsIsRouter -->|routes component work to| ComponentBuilder
        AsIsRouter -->|routes evidence analysis to| ExecutionAdvisor
        AsIsRouter -->|routes bounded validation to| EvidenceValidator
        AsIsRouter -->|routes consultation to| Expert
        AsIsRouter -->|routes human discussion to| ThinkingCompanion
        AsIsRouter -->|routes bounded report-only advice to| Worker
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Agents component
    class AsIsRouter,ComponentBuilder,ExecutionAdvisor,EvidenceValidator,Expert,ThinkingCompanion,Worker child
```

The arrows show supported routing relationships, not a fixed execution sequence. Roles remain independently selectable; reusable skills, host admission, and durable task records provide procedures, capabilities, and current authority without becoming child components of Agents. An agent role combines reusable skills with permissions, tools, model settings, and bounded responsibility. Agents and orchestrators retain authority to select, authorize, start, observe, recover, cancel, and delegate; a mechanical adapter invoked from a skill does not transfer that authority. Subagents are generalized independent workers for bounded implementation, research, review, planning, recovery, or other approved flows. Delegation uses a bounded input, expected output, and verification boundary, and its result is preserved in repository context before dependent work proceeds. Independent review or validation is used when risk, authority, or change breadth warrants it; an implementing agent's report is evidence, not the sole completion gate. The component-builder owns validation and integration for component work, while evidence-validator and expert provide bounded read-only review and worker assistance is report-only. The diagram shows the documented immediate role components; role files without records remain linked below rather than promoted into this map.

## Links

- [as-is/agent.md](as-is/agent.md) — canonical primary role contract.
- [component-builder/agent.md](component-builder/agent.md) — canonical recursive builder role contract.
- [expert/agent.md](expert/agent.md) — canonical read-only consultation contract.
- [evidence-validator/agent.md](evidence-validator/agent.md) — canonical read-only repository evidence validator contract.
- [thinking-companion/agent.md](thinking-companion/agent.md) — canonical human-facing consultation contract.
- [worker/agent.md](worker/agent.md) — canonical bounded implementation contract.
- [spawning-pi-subagents](../skills/spawning-pi-subagents/SKILL.md) — host/package admission contract.
