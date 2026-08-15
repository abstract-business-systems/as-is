
# Implementing Component Tasks - as-is

## Purpose

Provide the reusable implementation procedure for one bounded component task.


## Design

The component is organized around the following relationships and flow.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Implementing Component Tasks**

### Component task lifecycle flow


```mermaid
flowchart TD
    A["Selected backlog item"] --> Start["First commit:<br/>selected + active task"]
    Start --> B["Component task lifecycle"]
    B --> C["Validated durable<br/>handoff"]
    C --> D["Second commit:<br/>changelog + backlog + task cleanup"]
```

This skill owns task-start preparation, transient task creation, scoped
implementation, child-boundary delegation, deterministic validation, changelog
handoff, and preparation of the second completion commit. The task-start
handoff records selected backlog status and active task artifacts; the owning
completion procedure commits changelog evidence, exact backlog cleanup,
task-artifact cleanup, and the scoped durable handoff together in the second
commit.

## Links

- [SKILL.md](SKILL.md) — authoritative implementation procedure.
- [../../docs/component-task-record-protocol.md](../../docs/component-task-record-protocol.md) — task and component boundaries.
- [../managing-backlog/SKILL.md](../managing-backlog/SKILL.md) — task selection input.
