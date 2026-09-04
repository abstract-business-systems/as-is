# Validating Changes - as-is

## Purpose
Map observable evidence to acceptance conditions and residual risk.

## Design

The skill builds an acceptance-to-evidence matrix from the actual diff and test results, marks each condition passed, failed, blocked, or untested, separates observations from inferences, and records residual risk, recovery, and commit readiness.

It is a reusable sibling under the skills catalog: it consumes evidence recorded by recording-evidence and observations returned by running-tests, and its residual-risk and readiness record feeds completion handoffs such as committing-completed-work.

It grants no tools, permissions, or authority; unsupported claims must not be marked passed, and residual risk remains explicitly recorded rather than absorbed into a completion claim.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Validating Changes**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../as-is.md](../../as-is.md) — concise capability catalog entry.