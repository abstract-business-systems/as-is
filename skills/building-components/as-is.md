# Building Components - as-is

## Purpose

Provide the reusable procedure for building one bounded component and producing a validated, scoped durable handoff while preserving agent authority and task-record ownership.

## Design

The skill composes task implementation, validation, recovery, and completion procedures. It guides a builder through context, expert review, bounded implementation, child handoff, acceptance evidence, descendant closure, and durable handoff without selecting or launching agents itself. Behavioral tests of affected agent and skill contracts are the primary regression anchor for component-building and restructuring work. When a build or restructuring change alters a component's purpose, design, relationships, boundary, ownership, or links, the relevant durable `as-is.md` record is updated in the same handoff.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Building Components**


### Bounded build handoff

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Builder["Component builder"] -->|uses| Procedure["Bounded build procedure"]
    Procedure -->|validates| Work["Component work"]
    Work -->|provides| Handoff["Scoped durable handoff"]
```

The skill is reusable procedure, not authority. The configured agent remains responsible for component selection, delegation, parent integration, completion decisions, and any required approvals.

## Links

- [`SKILL.md`](SKILL.md) — authoritative build procedure.
- [`../context-building/SKILL.md`](../context-building/SKILL.md) — bounded context composition used before implementation and relevant handoffs.
- [`../../docs/architecture-vocabulary.md#component-boundary`](../../docs/architecture-vocabulary.md#component-boundary) — current-system boundary and ownership definitions used by the build procedure.
- [`../../agents/component-builder/agent.md`](../../agents/component-builder/agent.md) — role that retains build authority.
- [`../implementing-component-tasks/SKILL.md`](../implementing-component-tasks/SKILL.md) — task lifecycle.
- [`../verification-discipline/SKILL.md`](../verification-discipline/SKILL.md) — validation evidence.
- [`../../agents/component-builder/live-behavioral.test.ts`](../../agents/component-builder/live-behavioral.test.ts) — live behavioral contract checks for component-builder behavior when the live integration gate is enabled.
