# as-is Component

## Purpose

The `.agents/agents/as-is` component owns the user-facing `as-is` router
contract. It directs user intent through durable component orchestration and
reports concise results while keeping routing cheap per turn.

## Design

The router uses durable component records as memory and delegates substantive
or multi-source work to the configured `component-builder` role. Status and
routing turns use the repository orientation snapshot rather than reconstructing
state through sequential record reads. The agent contract defines the direct-path
budget, delegation boundaries, recovery behavior, and literal **What's next?**
routing.

## Boundary

This component owns the `as-is` entrypoint contract and its local durable and
transient task records. It does not own component-domain implementation, parent
or sibling records, or the orientation script implementation. Descendants
without their own `as-is.md` are within this component boundary.

## Links

- [`agent.md`](agent.md) — user-facing routing and delegation contract.
- [`tasks.md`](tasks.md) — transient current-task record while this component is active.
- [`changelog.md`](changelog.md) — concise historical recovery and completion notes.
- [`orient.ts`](../../../skills/as-is/scripts/orient.ts) — repository orientation snapshot used by status/routing turns.

## Changelog

The historical task-form content previously embedded in this file was migrated
to the current component model using recovery evidence from commit `b3a86eae`
and the available sibling worktree. Its necessary recovery facts are retained
in `changelog.md`; the current task authority is the configured transient
`tasks.md` record, not this durable context file.
