# component-builder - as-is

## Purpose

The `component-builder` role builds one bounded component from its durable
context and current task authority. It owns implementation within that
component, explicit handoffs to separately owned descendants, risk-matched
validation, semantic completion, and the scoped durable handoff. It may use an
orientation snapshot for speed, but the snapshot does not replace judgment or
grant task authority.

## Design

The builder keeps durable component purpose separate from current task state:
`as-is.md` describes the component, `tasks.md` governs the active task, and
`changelog.md` records completed handoffs. It composes focused skills for task
lifecycle, validation, recovery, and committing while retaining role authority
for planning, delegation, descendant closure, and completion. A separately owned
child is not terminal until its scoped result is integrated and caller ancestry
is proved; failed or incomplete child work remains recoverable in the task record.

**Lineage**: [as-is](../../as-is.md#design) / [agents](../as-is.md#design) / **component-builder**


### Component delivery and child integration

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Task["Assigned bounded task"] --> Context["Read durable context and task authority"]
    Context --> Review["Plan and obtain attributable expert review"]
    Review --> Implement["Implement within component boundary"]
    Implement --> Child{"Separately owned descendant?"}
    Child -->|no separately owned descendant| Validate["Run acceptance checks and final diff validation"]
    Child -->|separately owned descendant| Handoff["Handoff explicit context and approved budget"]
    Handoff --> Evidence{"Committed, validated child evidence?"}
    Evidence -->|missing or unvalidated evidence| Blocker["Preserve recoverable blocker in task record"]
    Evidence -->|committed validated evidence| Integrate["Integrate child commit and prove caller ancestry"]
    Integrate --> Validate
    Validate --> Closure["Record evidence and terminal descendant closure"]
    Closure --> Commit["Write changelog and create scoped durable commit"]
```

| Concern | Rule |
| --- | --- |
| Same-component assistance | Use the host-provided in-process subagent mechanism. |
| Separately owned child | Launch through the bounded Pi subprocess procedure with explicit context and approved budget. |
| Integration | The receiving builder owns semantic integration; the launcher observes only mechanical handoff and ancestry. |
| Owned scope | The role owns its contract and durable orientation record, and may edit the assigned component plus descendants without their own `as-is.md`. |
| Child boundary | A child with its own record is separate; the builder must not edit its files or task record, and the child must not edit parent or sibling state. |
| Parent authority | Parent-level budget and status changes remain with the parent. |
| Completion evidence | Do not infer completion from process exit, downstream output, telemetry, or caller identity. |
| Recovery | Incomplete, blocked, or budget-stopped work remains recoverable in its task record. |
## Links

- [`agent.md`](agent.md) — canonical role authority, tools, and required flow.
- [`../../.agents/skills/building-components/SKILL.md`](../../.agents/skills/building-components/SKILL.md) — component build procedure.
- [`../../skills/implementing-component-tasks/SKILL.md`](../../skills/implementing-component-tasks/SKILL.md) — task lifecycle and child boundaries.
- [`../../skills/verification-discipline/SKILL.md`](../../skills/verification-discipline/SKILL.md) — validation and evidence selection.
- [`../../skills/committing-completed-work/SKILL.md`](../../skills/committing-completed-work/SKILL.md) — scoped completion commit.
- [`../../skills/spawning-pi-subagents/SKILL.md`](../../skills/spawning-pi-subagents/SKILL.md) — bounded child launch and ancestry evidence.
- [`../../docs/component-task-record-protocol.md`](../../docs/component-task-record-protocol.md) — task, budget, recovery, and completion authority.
