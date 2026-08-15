# Committing Completed Work - as-is

## Purpose

Provide the reusable completion procedure for creating one scoped Git handoff from validated, descendant-closed component work without staging unrelated changes.

## Design

The skill checks completion preconditions, stages only declared durable artifacts, validates the staged patch, creates one concise commit, preserves unrelated work, and reconciles the exact selected backlog item after the handoff exists. It does not authorize partial or unvalidated commits.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Committing Completed Work**


### Scoped commit handoff

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Evidence["Validated, descendant-closed work"] -->|authorizes| Scope["Declared durable handoff"]
    Scope -->|validates| Patch["Staged scoped patch"]
    Patch -->|provides| Commit["One Git commit"]
```

The completion procedure is downstream of task authority and validation. The owning agent decides semantic completion; the skill supplies mechanical scope and evidence gates.

## Links

- [`SKILL.md`](SKILL.md) — authoritative scoped-commit procedure.
- [`../implementing-component-tasks/SKILL.md`](../implementing-component-tasks/SKILL.md) — task completion preconditions.
- [`../managing-backlog/SKILL.md`](../managing-backlog/SKILL.md) — evidence-gated backlog reconciliation.
