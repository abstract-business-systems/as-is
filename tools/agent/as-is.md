# agent tools - as-is

## Purpose

Expose bounded agent-assistance operations, currently canonical-role subagent calls, while keeping role contracts, admission, task authority, and session construction in their owners.

## Design

**Lineage**: [as-is](../../as-is.md#design) / [tools](../as-is.md#design) / **agent tools**

`subagent-tools.ts` contains the repository-owned Pi-facing tool definitions and supporting host-service composition for `call_subagent`, while canonical role resolution belongs to `core/modules/agent-resolution`. The package-owned `skills/spawning-pi-subagents/extensions/worker-tools.ts` provides only a versioned registration boundary; `.pi/extensions/worker-tools.ts` statically injects the repository tools into that boundary.

## Links

- [`subagent-tools.ts`](subagent-tools.ts) — bounded agent tool implementation and repository host adapter composition.
- [`../../skills/spawning-pi-subagents/extensions/worker-tools.ts`](../../skills/spawning-pi-subagents/extensions/worker-tools.ts) — package-owned versioned registration boundary.
- [`../../core/modules/agent-resolution/as-is.md`](../../core/modules/agent-resolution/as-is.md#design) — role contract resolution.
