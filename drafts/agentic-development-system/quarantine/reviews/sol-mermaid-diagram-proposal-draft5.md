# Sol Mermaid diagram proposal — high-level design draft 5

This is a bounded, read-only advisory proposal requested for the human-facing presentation packet. It does not approve the design, adopt target contracts, create tasks, or authorize implementation.

## Provenance

- Packet considered: `drafts/agentic-development-system-high-level-design-draft5/`
- Existing packet predecessor: draft 4
- Reviewer role: Sol architectural design advisor
- Requested change: add proper Mermaid diagrams without creating another draft
- Renderer validation: unavailable in this environment; syntax was kept to basic Mermaid `flowchart` constructs

## Recommendation

Use three diagrams: replace the current architecture view, add a gate lifecycle, and replace the text-only escalation ladder. These diagrams restate the existing draft and do not change its substantive design direction.

## 1. Architecture diagram

Replace the Mermaid block immediately after `## 4.1 Human-readable system view` with a diagram that separates the reported current baseline from the planned target and preserves the five target planes.

```mermaid
flowchart TB
    subgraph CURRENT["Current system - reported baseline"]
        direction LR
        C1["Canonical current records"]
        C2["Deterministic task, context,<br/>budget, recovery, and handoff control"]
        C3["Configured agents, skills,<br/>and bounded tools"]
        C4["Deterministic checks and<br/>supplementary evidence paths"]
        C5["Host-neutral modules,<br/>Pi adapters, and setup"]
    end

    subgraph TARGET["Planned target - design proposal only, not realized"]
        direction TB
        H["Human intent and design plane<br/>goals, prototypes, design revisions,<br/>feedback, and decisions"]
        O["Orchestration and control plane<br/>authority, gates, admission,<br/>escalation, budgets, and recovery"]
        R["Realization plane<br/>bounded detail planning<br/>and authorized implementation"]
        A["Assurance plane<br/>deterministic checks, semantic review,<br/>integration, and evidence"]
        X["Host and consumption plane<br/>core modules, adapters, setup,<br/>project-local state, and isolation"]

        H -->|"alignment and approved design inputs"| O
        O -->|"planning after G2; implementation only after G5"| R
        R -->|"results and evidence"| A
        A -->|"human-visible status, findings, and residual risk"| H
        X -.-> O
        X -.-> R
        X -.-> A
    end

    C1 -->|"baseline for explicit current and target views"| H
    C2 -->|"retain as the control spine; extend only through approved contracts"| O
    C3 -->|"adapt purpose-based roles and skill composition through staged migration"| R
    C4 -->|"retain and strengthen assurance boundaries"| A
    C5 -->|"retain host-neutral and adapter boundaries"| X
```

## 2. Gate lifecycle diagram

Insert after the opening recommendation in `## 6.1 Recommended gate model` and before `## 6.2 Current and planned state representation`. It shows the Sol → Kimi → user → Terra → Sol → user sequence, parallel G3 work, distinct gates, and the separation between kick-off and task authorization.

```mermaid
flowchart TB
    S["Design agent - Sol assignment<br/>freezes a high-level design revision"]
    S --> G0["G0 - Draft ready<br/>permits exact-packet review only"]
    G0 --> K["Alternate-family reviewer - Kimi assignment<br/>admitted read-only review of the exact frozen packet"]
    K --> D["Sol dispositions every supported finding"]
    D --> R{"Review stopping condition"}

    R -->|"No supported checklist-scoped repair remains"| G1["G1 - Independent review bounded<br/>permits user review only"]
    R -->|"Repair remains and fewer than ten rounds completed"| S2["Sol freezes a successor revision"]
    S2 --> G0
    R -->|"Ten rounds completed"| P["Preserve disagreements and material unknowns<br/>in a user-decision packet"]
    P --> G1

    G1 --> U2{"User aligns the high-level direction?"}
    U2 -->|"Request changes or defer"| S
    U2 -->|"Align"| G2["G2 - High-level direction aligned<br/>permits detailed design, not implementation"]

    G2 --> T["Detail planner - Terra assignment<br/>prepares one bounded detail chunk"]
    T --> SR["Design reviewer - Sol assignment<br/>reviews traceability, scope,<br/>validation, recovery, and non-goals"]
    SR -->|"Reviewed and ready"| C["Sol-reviewed detail chunk"]
    SR -->|"Repair needed and successor unused"| T2["Terra prepares the one permitted repair successor"]
    T2 --> SR
    SR -->|"New design question, unresolved disagreement,<br/>or further repair needed"| UQ["User decision<br/>return to design as needed"]
    UQ --> S

    G2 --> B["Complete and freeze the exact base-record inventory<br/>and all listed base target records"]
    B --> U3{"User approves the exact inventory<br/>and every listed record revision?"}
    U3 -->|"Request revision"| B
    U3 -->|"Approve"| G3["G3 - Base design complete<br/>completes the design phase only"]

    C --> J["G3 and the reviewed detail chunk<br/>are both required"]
    G3 --> J
    J --> G4["G4 - Bounded unit ready<br/>permits a user kick-off decision only"]

    G4 --> U4{"User authorizes kick-off<br/>for the named slice?"}
    U4 -->|"No or defer"| STOP["No implementation authority"]
    U4 -->|"Yes"| A5["Admit the exact task, holder, tools, budget,<br/>acceptance, and recovery"]
    A5 --> G5["G5 - Task authorized<br/>permits implementation of that task only"]

    G5 --> I["Bounded implementation"]
    I --> A["Deterministic checks, semantic review,<br/>integration, and revalidation"]
    A --> G6["G6 - Result acceptable<br/>completion handoff, not automatic release"]

    G6 --> F["Classify post-implementation feedback"]
    F --> G7["G7 - Feedback resolved"]
    G7 -->|"Design change or new request"| S
    G7 -->|"Defect within approved design"| CTRL["Return to control<br/>no automatic retry or new authority"]
    G7 -->|"No action or resolved"| CLOSE["Closure"]
```

## 3. Authority and escalation diagram

Replace only the fenced text block in `## 7.2 Escalation` beginning with `task implementer` and ending with `user or required human domain expert`.

```mermaid
flowchart TB
    U["User<br/>goal and feature intent, G2 alignment,<br/>G3 approval, G4 kick-off,<br/>and consequential decisions"]
    P["Project orchestrator - as-is<br/>root lifecycle, user interaction,<br/>status synthesis, and routing"]
    C["Component builder<br/>bounded decomposition, delegation,<br/>review, integration, and recovery"]
    T["Task implementer<br/>one G5-authorized task only"]

    U -->|"bounded direction and authorization"| P
    P -->|"delegated component scope"| C
    C -->|"delegation only after recorded G5 admission"| T

    T -->|"stop, preserve state and evidence,<br/>and escalate a bounded question"| C
    C -->|"escalate beyond component authority"| P
    P -->|"escalate consequential decision"| U

    H["Required human domain expert<br/>qualified judgment where required"]
    P -->|"escalate specialist concern"| H
    H -.->|"bounded specialist judgment"| P

    D["Design agent<br/>authors proposals;<br/>cannot approve or authorize"]
    D -.->|"design proposal only"| P

    V["Validator or specialist reviewer<br/>advisory unless a separate project contract<br/>establishes an explicit gate"]
    V -.->|"findings and evidence"| C

    M["Task-control module<br/>enforces transitions, budgets, recovery, and handoff;<br/>does not create implementation authority"]
    M -->|"admit or reject against recorded authority"| T

    N["Skills, tools, and observability<br/>procedures, bounded operations, or supplementary evidence;<br/>no role, task, gate, or completion authority"]
    N -.-> P
    N -.-> C
    N -.-> T
```

No implementation authority is implied by these diagrams. They are presentation aids for the existing proposal.