# as-is Project

## Purpose

Own the repository-wide composition model and provide the top-level map of its
agent roles, reusable skills, implemented components, design documents, and
validation fixtures. This record is durable shared context for both human
readers and agents: humans use it to review the architecture, and agents use it
to orient within the repository. It does not replace the records owned by the
areas it maps.

## Components

The root component lists only its immediate documented component children.
Deeper descendants are linked by their immediate parent rather than by this
record.

| Component | Purpose |
| --- | --- |
| [Agents](agents/as-is.md#design) | Organize independent configured agent roles. |
| [Designs](designs/as-is.md#design) | Organize enduring architecture and execution designs. |
| [Skills](skills/as-is.md#design) | Organize reusable operational procedures. |

## Design

This is a component map, not a mandatory execution sequence. The root record
connects the repository component to its immediate documented child areas.

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart TD
    Root["as-is repository"]
    Root --> Agents["Agents"]
    Root --> Designs["Designs"]
    Root --> Skills["Skills"]

    click Agents href "./agents/as-is.md#design" "Open Agents design"
    click Designs href "./designs/as-is.md#design" "Open Designs design"
    click Skills href "./skills/as-is.md#design" "Open Skills design"
```

If the host Markdown renderer suppresses Mermaid navigation, use these
source-level links, which remain authoritative:

- [Open Agents design](agents/as-is.md#design)
- [Open Designs design](designs/as-is.md#design)
- [Open Skills design](skills/as-is.md#design)

Only areas with their own `as-is.md` are components in this record. Other
repository directories remain navigable through their own files or links but
are not listed as components here.

- The repository is composed of filesystem areas and components with durable
  `as-is.md` records.
- This root record maps immediate areas; each area owns the detailed records for
  its descendants.
- Agents are the authority-bearing composition layer; skills provide reusable
  procedures without selecting, authorizing, starting, or delegating agents.
- Explicit links provide bounded context; parent context is never ambient.
- Machine configuration belongs in `as-is.json`, and active task state belongs
  in the configured task record.

## Links

- [`docs/design-principles.md`](docs/design-principles.md) — repository-wide authority and design principles.
- [`docs/configuration.md`](docs/configuration.md) — machine-configuration boundary.
