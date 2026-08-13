
# Exploring Execution Evidence - as-is

## Purpose

Provide a reusable read-only procedure for using trace-query and readable
session-analysis tools to investigate a user-mentioned execution context and
produce decision-ready evidence for debugging, process improvement, or budget
analysis.


## Design

The component is organized around the following relationships and flow.

[as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Exploring Execution Evidence**

```mermaid
flowchart TD
    A["Trace or session evidence"] --> B["Evidence exploration procedure"]
    B --> C["Source-labelled report"]
```

- Start from a supplied trace or session selector and progressively inspect
  only the evidence needed for the question.
- Report source-labelled observations with explicit uncertainty.
- Treat session IDs as opaque correlation metadata.
- Keep runtime capture, task status, budgets, and allocation outside this skill.

## Boundary

This skill owns the investigation procedure and report contract. Observability
owns tracer implementation, while the worker extension owns bounded query
surfaces. Task records and the control plane remain authoritative for status,
validation, recovery, completion, limits, and allocation.

## Links

- [`SKILL.md`](SKILL.md) — authoritative procedure and output contract.
- [`../../agent-skills.md`](../../agent-skills.md) — concise capability catalog.
- [`../../components/observability/as-is.md`](../../components/observability/as-is.md) — trace ownership and boundaries.
- [`../../components/observability/tracing-design.md`](../../components/observability/tracing-design.md) — session-reference-first and privacy policy.
- [`../context-building/SKILL.md`](../context-building/SKILL.md) — bounded context and provenance procedure.
- [`../verification-discipline/SKILL.md`](../verification-discipline/SKILL.md) — evidence and residual-risk guidance.
