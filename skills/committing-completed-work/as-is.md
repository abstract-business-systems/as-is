# Committing Completed Work - as-is

## Purpose

Provide the reusable completion procedure for creating one scoped Git handoff from validated, descendant-closed component work without staging unrelated changes.

## Design

The skill is the completion-half of a two-commit lifecycle. The task-start
handoff records selected backlog status and active task artifacts; this skill
stages the declared durable handoff together with the owning changelog summary,
exact evidence-gated backlog-row removal, and configured task-artifact cleanup,
validates the complete completion patch, creates the second concise commit, and
preserves unrelated work. It does not authorize partial or unvalidated commits
or separate task-deletion/backlog-clearance commits. The changelog evidence is
written before backlog cleanup eligibility is evaluated, and all completion
artifacts become durable together at the second Git commit boundary.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Committing Completed Work**


### Scoped commit handoff

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Start["Task-start commit:<br/>selected + active task"] --> Evidence["Validated,<br/>descendant-closed work"]
    Evidence -->|authorizes| Scope["Declared durable handoff"]
    Scope -->|prepares| Finalization["Changelog + exact backlog<br/>cleanup + task cleanup"]
    Finalization -->|validates| Patch["Staged completion<br/>patch"]
    Patch -->|provides| Commit["Second Git commit"]
```

The completion procedure is downstream of task authority and validation. The owning agent decides semantic completion; the skill supplies mechanical scope and evidence gates.

## Links

- [`SKILL.md`](SKILL.md) — authoritative scoped-commit procedure.
- [`../implementing-component-tasks/SKILL.md`](../implementing-component-tasks/SKILL.md) — task completion preconditions.
- [`../managing-backlog/SKILL.md`](../managing-backlog/SKILL.md) — evidence-gated backlog reconciliation.
