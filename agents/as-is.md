
# Agents

## Purpose
Maintain the durable task context and organization for independent configured agent roles.

## Capability contract
Canonical role files declare ordinary Pi tools in front matter. Launcher
admission validates and forwards those declarations without injecting tools by
agent identity; the owning Pi host/package supplies executable implementations.
Unsupported, unavailable, or unauthorized tools fail closed before launch.
Read-only roles may still receive explicit host safety caps.

## Design

The agents area is the authority-bearing composition layer for configured roles.
Roles are independently selectable; reusable skills provide procedures but do
not select, authorize, start, or delegate agents. The diagram shows the
repository-facing boundaries rather than a mandatory delegation sequence.

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    User["User request"] --> Router["as-is router"]
    Router --> Selection{"Best-fit admitted role"}

    subgraph Roles["Configured agent roles"]
        Selection --> Builder["component-builder\nbounded component ownership"]
        Selection --> Advisor["execution-advisor\nread-only evidence analysis"]
        Selection --> Expert["expert\nread-only consultation"]
        Selection --> Validator["evidence-validator\nread-only repository validation"]
        Selection --> Worker["worker\nbounded in-process assistance"]
    end

    subgraph Procedures["Reusable skills"]
        Skills["Skills\nprocedures and guidance"]
    end

    Admission["Host admission\ndeclared capabilities and safety"]
    Records["Durable task records\ncurrent authority and evidence"]
    Builder -. "composes" .-> Skills
    Advisor -. "composes" .-> Skills
    Expert -. "composes" .-> Skills
    Validator -. "composes" .-> Skills
    Worker -. "uses" .-> Skills
    Roles --> Admission
    Roles --> Records
    Admission --> Outcome["Scoped result or recommendation"]
    Records --> Outcome

    click Router href "./as-is/agent.md" "Open as-is router contract"
    click Builder href "./component-builder/agent.md" "Open component-builder contract"
    click Advisor href "./execution-advisor/agent.md" "Open execution-advisor contract"
    click Expert href "./expert/agent.md" "Open expert contract"
    click Validator href "./evidence-validator/agent.md" "Open evidence-validator contract"
    click Worker href "./worker/agent.md" "Open worker contract"
```

A role owns the authority decisions and lifecycle defined by its contract;
admission supplies executable capabilities, and task records supply current
scope and evidence. The agents area does not own skill implementation, host
admission, or another role's task state.

If Mermaid navigation is unavailable, use the role contracts in the [Links](#links)
section below.

## Components

| Component | Purpose |
| --- | --- |
| [as-is router](as-is/as-is.md#design) | Interpret user-facing requests and route substantive work. |
| [component-builder](component-builder/as-is.md#design) | Build bounded components and maintain their records. |
| [execution-advisor](execution-advisor/as-is.md#design) | Analyze execution traces and readable local session data. |
| [worker](worker/as-is.md#design) | Provide bounded in-process assistance. |

## Links

- [as-is/agent.md](as-is/agent.md) — canonical primary role contract.
- [component-builder/agent.md](component-builder/agent.md) — canonical recursive builder role contract.
- [expert/agent.md](expert/agent.md) — canonical read-only general consultation contract.
- [evidence-validator/agent.md](evidence-validator/agent.md) — canonical read-only repository evidence validator contract.
- [worker/agent.md](worker/agent.md) — canonical bounded implementation contract.
- [spawning-pi-subagents](../skills/spawning-pi-subagents/SKILL.md) — host/package admission contract.
