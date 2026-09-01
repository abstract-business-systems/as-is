# Committing completed work - as-is

## Purpose
Verify completion gates and prepare scoped durable handoffs.

## Design

The skill confirms acceptance and descendant closure, stages only the changelog, exact backlog cleanup, task cleanup, and declared handoff, then verifies and commits once. It is the terminal completion step that compositions such as `building-components` reach after validation and changelog work, and its tool-access row states that staging and commit access requires completion gates and scoped ownership. The skill grants no tools or authority: a composition cannot grant commit authority, and unrelated work is left untouched.

**Lineage**: [as-is](../../../as-is.md#design) / [Skills](../../as-is.md#design) / **Committing completed work**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../as-is.md](../../as-is.md) — concise capability catalog entry.