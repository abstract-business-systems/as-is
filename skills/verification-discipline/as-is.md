
# Verification Discipline

## Purpose

Provide a reusable method for establishing whether a bounded task satisfies its
acceptance conditions using appropriate evidence.


## Design

[Open Skills design](../as-is.md#design)

The component is organized around the following relationships and flow.

```mermaid
flowchart TD
    Parent["Skills"] --> A["Acceptance conditions"] --> B["Risk-matched validation"]
    B --> C["Evidence and residual risk"]

    click Parent href "../as-is.md#design" "Open Skills design"
```


## Links
