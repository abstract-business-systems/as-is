# Increment 5 Dogfood - as-is

## Purpose

Retain a harmless local dogfood fixture for the Increment 5 OpenCode subprocess adapter without domain changes or external effects.

## Design

This component retains the durable navigation and concise history for a completed adapter-validation fixture. Its README names the fixture, while Git history retains detailed transient completion evidence. It does not expose a current runtime adapter, task, or product dependency.

[as-is](../../as-is.md#design) / [Validation Fixtures](../as-is.md#design) / **Increment 5 Dogfood**

### Adapter-dogfood evidence

- Pre-render layout plan: repository Markdown consumers with no fixed dimensions or configured renderer; compact top-to-bottom context flow; three visible nodes, two labeled edges, and short labels; route the fixture through its adapter boundary and guardrail outcome as contextual relationships rather than runtime chronology; renderer-specific geometry remains untested.

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Fixture["Increment 5 adapter dogfood"] -->|retains bounded context for| Adapter["OpenCode subprocess adapter"]
    Fixture -->|is scoped by| Guardrails["No domain changes or external effects"]
```
