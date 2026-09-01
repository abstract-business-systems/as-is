# component-builder - as-is

## Purpose

The `component-builder` role builds one bounded component from its durable
context and current task authority. It uses `building-context` through the
building-components procedure to assemble bounded, provenance-bearing decision
context without creating task or access authority. It owns implementation
within that component, explicit handoffs to separately owned descendants,
risk-matched validation, semantic completion, and the scoped durable handoff.
It may use an orientation snapshot for speed, but the snapshot does not replace
judgment or grant task authority.

## Design

The builder keeps durable component purpose separate from current task state:
`as-is.md` describes the component, the local `task` object in `as-is.json`
governs machine task state, the configured Markdown narrative (normally
`tasks.md`) carries human task context and evidence, and `changelog.md` records
completed handoffs. It composes focused skills for task
lifecycle, context, validation, recovery, and committing while retaining role
authority for planning, delegation, descendant closure, and completion. The
role contract keeps only the authority-bearing launch, integration, and
completion decisions that reusable procedures must not own. Component-building
and restructuring work must update the relevant durable `as-is.md` record(s)
when purpose, design, relationships, boundaries, ownership, or links change;
those record updates are part of the scoped handoff. A separately owned child is
not terminal until its scoped result is integrated and caller ancestry is
proved; failed or incomplete child work remains recoverable in the task record.

**Lineage**: [as-is](../../as-is.md#design) / [agents](../as-is.md#design) / **component-builder**


### Component delivery and child integration

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Task["Assigned bounded task"] --> Context["Read durable context and<br/>task authority"]
    Context --> Review["Plan and obtain<br/>attributable expert<br/>review"]
    Review --> Implement["Implement within<br/>component boundary"]
    Implement --> Child{"Separately owned<br/>descendant?"}
    Child -->|no separately owned<br/>descendant| Validate["Run acceptance checks<br/>and final diff<br/>validation"]
    Child -->|separately owned<br/>descendant| Handoff["Handoff explicit context<br/>and approved budget"]
    Handoff --> Evidence{"Committed, validated<br/>child evidence?"}
    Evidence -->|missing or unvalidated<br/>evidence| Blocker["Preserve recoverable<br/>blocker in task record"]
    Evidence -->|committed validated<br/>evidence| Integrate["Integrate child commit<br/>and prove caller<br/>ancestry"]
    Integrate --> Validate
    Validate --> Closure["Record evidence and<br/>terminal descendant<br/>closure"]
    Closure --> Commit["Write changelog and<br/>create scoped durable<br/>commit"]
```

| Concern | Rule |
| --- | --- |
| Same-component assistance | Use the host-provided in-process subagent mechanism. |
| Separately owned child | Launch through the bounded Pi subprocess procedure with explicit context and approved budget. |
| Integration | The receiving builder owns semantic integration; the launcher observes only mechanical handoff and ancestry. |
| Owned scope | The role owns its contract and durable orientation record, and may edit the assigned component plus descendants without their own `as-is.md`. |
| Child boundary | A child with its own record is separate; the builder must not edit its files or task record, and the child must not edit parent or sibling state. |
| Parent authority | Parent-level budget and status changes remain with the parent. |
| Completion evidence | Use the affected agent and skill behavioral tests as the primary regression anchor, and do not infer completion from process exit, downstream output, telemetry, or caller identity. |
| Durable records | Update relevant `as-is.md` records in the same handoff whenever component-building or restructuring changes purpose, design, relationships, boundaries, ownership, or links. |
| Recovery | Incomplete, blocked, or budget-stopped work remains recoverable in its task record. |
## Links

- [`agent.md`](agent.md) — canonical role authority, tools, and required flow.
- [`../../skills/reusable/building-context/SKILL.md`](../../skills/reusable/building-context/SKILL.md) — bounded context composition applied through the build procedure.
- [`../../skills/master/building-components/SKILL.md`](../../skills/master/building-components/SKILL.md) — component build procedure.
- [`../../skills/master/implementing-tasks/SKILL.md`](../../skills/master/implementing-tasks/SKILL.md) — task lifecycle and child boundaries.
- [`../../skills/reusable/validating-changes/SKILL.md`](../../skills/reusable/validating-changes/SKILL.md) — validation and evidence selection.
- [`../../skills/master/committing-completed-work/SKILL.md`](../../skills/master/committing-completed-work/SKILL.md) — scoped completion commit.
- [`../../skills/master/spawning-subagents/SKILL.md`](../../skills/master/spawning-subagents/SKILL.md) — bounded child launch and ancestry evidence (launcher runtime remains at `skills/spawning-pi-subagents/scripts/`).
- [`../../core/contracts/component-task-record-protocol.md`](../../core/contracts/component-task-record-protocol.md) — task metadata, narrative, budget, recovery, and completion authority.
