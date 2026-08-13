
# Task-Record Validator - as-is

## Purpose

Make task-record invariants mechanically checkable without host-specific
runtime enforcement.


## Design

The component is organized around the following relationships and flow.

[as-is](../../as-is.md#design) / [Components](../as-is.md#design) / **Task-Record Validator**

```mermaid
flowchart TD
    A["Task record"] --> B["Invariant validator"]
    B --> C["Mechanical validation result"]
```

- Validate task-record invariants independently of host-specific runtime
  enforcement.
- Keep validation ownership here without becoming task authority or runtime
  enforcement.
