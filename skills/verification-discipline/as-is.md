
# Verification Discipline - as-is

## Purpose

Provide a reusable method for establishing whether a bounded task satisfies its
acceptance conditions using appropriate evidence.


## Design

The component is organized around the following relationships and flow.

Parent: [Skills](../as-is.md#design)

```mermaid
flowchart TD
    A["Acceptance conditions"] --> B["Risk-matched validation"]
    B --> C["Evidence and residual risk"]
```
