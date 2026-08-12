
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

```mermaid
flowchart TD
    A["Assigned bounded task"] --> B["Read durable component context and task authority"]
    B --> C["Plan and obtain attributable expert review"]
    C --> D["Implement within component boundary"]
    D --> E{"Separately owned descendant?"}
    E -- "No" --> H["Run acceptance checks and final diff validation"]
    E -- "Yes" --> F["Handoff explicit context and approved budget"]
    F --> G{"Child returns committed, validated evidence?"}
    G -- "No" --> R["Preserve recoverable blocker in task record"]
    G -- "Yes" --> I["Integrate child commit and prove caller ancestry"]
    I --> H
    H --> J["Record evidence and terminal descendant closure"]
    J --> K["Write changelog and create scoped durable commit"]
```

Parent: [Agents](../as-is.md#design)

Same-component assistance and expert reviews use the host-provided in-process
subagent mechanism. A separately owned child is launched through the bounded
Pi subprocess procedure with an explicit context handoff and approved budget.
The receiving builder owns semantic integration; the launcher only observes
mechanical handoff and ancestry.

## Boundary

This component owns the `component-builder` role contract and its durable
orientation record. It may edit the assigned component and descendants that do
not have their own `as-is.md`. A child with its own record is a separate
boundary: the builder must not edit its files or task record, and the child
must not edit parent or sibling state. Parent-level budget and status changes
remain with the parent.

The role does not own reusable skill definitions, control-plane admission,
launcher implementation, runtime state, or another component's integration.
It does not infer completion from process exit, downstream output, telemetry,
or caller identity. Incomplete, blocked, or budget-stopped work remains
recoverable in its task record rather than being committed as complete.

## Parent navigation

[Open Agents design](../as-is.md#design)

## Links

- [`agent.md`](agent.md) — canonical role authority, tools, and required flow.
- [`../../.agents/skills/building-components/SKILL.md`](../../.agents/skills/building-components/SKILL.md) — component build procedure.
- [`../../skills/implementing-component-tasks/SKILL.md`](../../skills/implementing-component-tasks/SKILL.md) — task lifecycle and child boundaries.
- [`../../skills/verification-discipline/SKILL.md`](../../skills/verification-discipline/SKILL.md) — validation and evidence selection.
- [`../../skills/committing-completed-work/SKILL.md`](../../skills/committing-completed-work/SKILL.md) — scoped completion commit.
- [`../../skills/spawning-pi-subagents/SKILL.md`](../../skills/spawning-pi-subagents/SKILL.md) — bounded child launch and ancestry evidence.
- [`../../docs/component-task-record-protocol.md`](../../docs/component-task-record-protocol.md) — task, budget, recovery, and completion authority.
