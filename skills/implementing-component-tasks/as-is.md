
# Implementing Component Tasks - as-is

## Purpose

Provide the reusable implementation procedure for one bounded component task.


## Design

The component is organized around the following relationships and flow.

[as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Implementing Component Tasks**

```mermaid
flowchart TD
    A["Selected backlog item"] --> B["Component task lifecycle"]
    B --> C["Validated durable handoff"]
```

This skill owns transient task creation, scoped implementation, child-boundary
delegation, deterministic validation, changelog handoff, and task cleanup.

## Links

- [SKILL.md](SKILL.md) — authoritative implementation procedure.
- [../../docs/component-task-record-protocol.md](../../docs/component-task-record-protocol.md) — task and component boundaries.
- [../managing-backlog/SKILL.md](../managing-backlog/SKILL.md) — task selection input.
