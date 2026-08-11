
# Context Building - as-is

## Purpose
Provide reusable context assembly for bounded decisions and handoffs.


## Design

[Open Skills design](../as-is.md#design)

The component is organized around the following relationships and flow.

```mermaid
flowchart TD
    A["Bounded decision"] --> B["Context assembly"]
    B --> C["Provenance-bearing handoff"]
```

Parent: [Skills](../as-is.md#design)


## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../agent-skills.md](../../agent-skills.md) — concise capability catalog entry.
