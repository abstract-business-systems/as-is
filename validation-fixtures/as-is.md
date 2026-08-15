# Validation Fixtures - as-is

## Purpose

Retain harmless, bounded fixtures for validating delegation, host mediation, recovery, and task-record behavior without changing product components or contacting external services.

## Components

| Component | Purpose |
| --- | --- |
| [dummy delegation](dummy-delegation/as-is.md#design) | Rehearse one bounded local delegation, durable registry evidence, and scoped parent integration. |
| [increment 5 dogfood](increment-5-dogfood/as-is.md#design) | Retain completed local dogfood evidence for the Increment 5 OpenCode subprocess adapter. |
| [increment 6 recovery fixture](increment-6-recovery-fixture/as-is.md#design) | Retain completed record-only recovery evidence after private runtime state is unavailable. |
| [OpenCode mediation dogfood](opencode-mediation-dogfood/as-is.md#design) | Retain completed explicit primary-agent mediation evidence for the configured implementer. |
| [Task-record validator reference](task-record-validator-reference/as-is.md#design) | Retain non-runtime Python validator compatibility evidence for the canonical task-control validator. |

## Design

Validation fixtures are independent evidence boundaries. They retain deterministic local rehearsal or concise completed-evidence context for delegation, adapter, recovery, and mediation behavior; they do not become runtime components or product dependencies.

**Lineage**: [as-is](../as-is.md#design) / **Validation Fixtures**


### Fixture containment map

```mermaid
---
config:
  layout: elk
---
%%{init: {"securityLevel": "loose"}}%%
flowchart TB
    subgraph Fixtures["Validation Fixtures"]
        direction TB
        Dummy["<a href='./dummy-delegation/as-is.md#design'>dummy delegation</a>"]
        Increment5["<a href='./increment-5-dogfood/as-is.md#design'>increment 5 dogfood</a>"]
        Increment6["<a href='./increment-6-recovery-fixture/as-is.md#design'>increment 6 recovery<br/>fixture</a>"]
        OpenCode["<a href='./opencode-mediation-dogfood/as-is.md#design'>OpenCode mediation<br/>dogfood</a>"]
        ValidatorReference["<a href='./task-record-validator-reference/as-is.md#design'>task-record validator<br/>reference</a>"]

        Dummy -->|rehearses bounded<br/>delegation and<br/>integration evidence| Increment5
        Increment5 -->|retains completed<br/>adapter evidence<br/>alongside| OpenCode
        Increment6 -->|retains completed<br/>recovery evidence<br/>alongside| Dummy
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Fixtures component
    class Dummy,Increment5,Increment6,OpenCode child
```

The fixture relationships describe shared validation concerns, not production dependencies. Each linked child box targets the same record as its Components-table entry; that table is the required Markdown and renderer fallback, not a replacement for interactive diagram navigation. This parent's Links retain only distinct fixture-wide context. This parent does not interpret child implementation, tests, task narratives, transcripts, or grandchildren.

## Links

- [`README.md`](README.md) — fixture navigation and retention rationale.
- [`../docs/component-task-record-protocol.md`](../docs/component-task-record-protocol.md) — task-record behavior exercised by the fixtures.
