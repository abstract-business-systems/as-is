
# Context Building

## Purpose
Provide reusable context assembly for bounded decisions and handoffs.


## Design

[Open Skills design](../as-is.md#design)

The component is organized around the following relationships and flow.

```mermaid
flowchart TD
    Parent["Skills"] --> A["Bounded decision"] --> B["Context assembly"]
    B --> C["Provenance-bearing handoff"]

    click Parent href "../as-is.md#design" "Open Skills design"
```


## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../agent-skills.md](../../agent-skills.md) — concise capability catalog entry.
