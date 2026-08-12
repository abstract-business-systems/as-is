
# Context Building - as-is

## Purpose
Provide reusable context assembly for bounded decisions and handoffs.


## Design

The component is organized around the following relationships and flow.

Parent: [Skills](../as-is.md#design)

```mermaid
flowchart TD
    A["Bounded decision"] --> B["Context assembly"]
    B --> C["Provenance-bearing handoff"]
```



## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../agent-skills.md](../../agent-skills.md) — concise capability catalog entry.
