# agent tools - as-is

## Purpose

Expose bounded agent-assistance operations, currently canonical-role subagent calls, while keeping role contracts, admission, task authority, and session construction in their owners.

## Design

**Lineage**: [as-is](../../as-is.md#design) / [tools](../as-is.md#design) / **agent tools**

`subagent-tools.ts` contains the Pi-facing tool definitions and supporting adapter composition for `call_subagent`, while canonical role resolution belongs to `core/modules/agent-resolution`. The `.pi/extensions/worker-tools.ts` file is only a host registration adapter.

## Links

- [`subagent-tools.ts`](subagent-tools.ts) — bounded agent tool implementation and adapter composition.
- [`../../core/modules/agent-resolution/as-is.md`](../../core/modules/agent-resolution/as-is.md#design) — role contract resolution.
