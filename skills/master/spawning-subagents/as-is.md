# Spawning Subagents - as-is

## Purpose
Launch, observe, recover, and hand off bounded delegated work under existing authority.

## Design

The skill builds a bounded handoff, launches through the approved host path, observes progress and evidence, and enforces budgets and recovery while retaining parent authority; its composition context is the delegation/observation tool-access row rather than a reusable-skill flow, so it stands alongside the other master skills as a directly selectable delegation outcome. It establishes fit, not permission: it grants no tools or authority — delegation, recovery, cancellation, and observation remain role/orchestrator authority and are never inferred from a skill reference — and it must not launch unadmitted roles, exceed budgets, or infer completion without evidence.

**Lineage**: [as-is](../../../as-is.md#design) / [Skills](../../as-is.md#design) / **Spawning Subagents**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../as-is.md](../../as-is.md) — concise capability catalog entry.