---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: host-reported
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 180
      spent-seconds: 0
      reserve-seconds: 30
      source: host-reported
  external-effects: require-current-turn-user-approval
acceptance:
  - Provide a discoverable bounded procedure for exploring local trace evidence and authorized Pi session metadata.
  - Support debugging, process-improvement, and budget-analysis questions without granting task, job, validation, recovery, completion, or budget-allocation authority.
  - Preserve session-reference-first privacy boundaries, durable approval requirements, and distinguish observations, inferences, unknowns, recommendations, and residual risk.
---

# Exploring Execution Evidence

## Purpose

Provide a reusable read-only procedure for using bounded trace-query and
explicitly authorized session-analysis tools to investigate a user-mentioned
execution context and produce decision-ready evidence for debugging, process
improvement, or budget analysis.

## Design

The skill starts from a supplied trace or session selector, progressively
queries local trace summaries, events, and metadata-only session analysis, and
reports source-labelled observations with explicit uncertainty. It treats
session IDs and session-store references as opaque correlation metadata. It
does not inspect raw session content, add runtime capture, or replace durable
task and budget records.

## Boundaries

This skill owns the investigation procedure and report contract. The
observability component owns tracer implementation; the project worker
extension owns bounded query and session-analysis tools. Task records and the
control plane remain authoritative for status, validation, recovery, completion,
budget limits, and allocation. Session metadata analysis remains exact-ID,
project-local, metadata-only, and durably authorized.

## Links

- [`SKILL.md`](SKILL.md) — authoritative procedure and output contract.
- [`../../agent-skills.md`](../../agent-skills.md) — concise capability catalog.
- [`../../components/observability/as-is.md`](../../components/observability/as-is.md) — trace ownership and boundaries.
- [`../../components/observability/tracing-design.md`](../../components/observability/tracing-design.md) — session-reference-first and privacy policy.
- [`../context-building/SKILL.md`](../context-building/SKILL.md) — bounded context and provenance procedure.
- [`../verification-discipline/SKILL.md`](../verification-discipline/SKILL.md) — evidence and residual-risk guidance.

## Changelog

- 2026-08-11: Renamed and broadened the bounded execution-evidence skill to cover metadata-only, durably authorized Pi session analysis alongside local traces. No raw session content became normal trace payload or task authority.
