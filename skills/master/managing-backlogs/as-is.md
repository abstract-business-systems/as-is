# Managing Backlogs - as-is

## Purpose
Maintain planning indexes and perform evidence-gated reconciliation.

## Design

The skill adds or revises bounded items in the owning backlog schema, calculates priority and dependencies, applies only authorized transitions, and removes completed rows only with exact changelog evidence; no composition table, workflow example, or tool-access row is cited for it, so it stands alongside the other master skills as a directly selectable planning outcome rather than a composition stage. It establishes fit, not permission: it grants no tools or authority, must not reconcile unauthorized transitions or remove rows on inference instead of changelog evidence, and stops when the owning schema or authorization is unresolved.

**Lineage**: [as-is](../../../as-is.md#design) / [Skills](../../as-is.md#design) / **Managing Backlogs**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../as-is.md](../../as-is.md) — concise capability catalog entry.