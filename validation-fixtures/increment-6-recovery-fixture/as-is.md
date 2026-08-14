# Increment 6 Recovery Fixture - as-is

## Purpose

Retain a harmless completed fixture that validates recovery from a durable record after private worker runtime state is unavailable.

## Design

This component preserves concise evidence for a completed record-only recovery rehearsal. Git history retains details that recovery preserved the configured worker, cumulative attempt and budget history, a bounded backoff/attempt policy, replacement approval, descendant closure, and cleanup after a local interruption removed private runtime state. It has no descendants and does not expose a current runtime recovery service or product dependency.

[as-is](../../as-is.md#design) / [Validation Fixtures](../as-is.md#design) / **Increment 6 Recovery Fixture**

### Record-only recovery rehearsal

- Pre-render layout plan: repository Markdown consumers with no fixed dimensions or configured renderer; narrow top-to-bottom recovery progression; three visible nodes, two unlabeled transition edges, and concise labels; route interruption through durable recovery to bounded evidence as temporal progression; renderer-specific geometry remains untested.

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Interruption["Private runtime state unavailable"] --> Recovery["Durable record-only recovery"]
    Recovery --> Outcome["Bounded completed fixture evidence"]
```
