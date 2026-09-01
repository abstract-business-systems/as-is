# Delegating Bounded Work - as-is

## Purpose
Prepare a bounded child handoff without transferring authority implicitly.

## Design

The skill defines the child outcome, scope, budget, context, acceptance, changed-artifact boundary, recovery checkpoint, and return contract while the parent retains authority and ownership boundaries. It is a delegation sibling under the Skills catalog, distinct from the launch-and-observe procedure that runs child processes: this skill governs the handoff contract, not the child's execution. The skill establishes fit only and grants no tools or authority; it never delegates parent authority or sibling files, and it records the delegation rather than expanding the child's scope.

**Lineage**: [as-is](../../../as-is.md#design) / [Skills](../../as-is.md#design) / **Delegating Bounded Work**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../as-is.md](../../as-is.md) — concise capability catalog entry.