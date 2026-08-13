# evidence-validator - as-is

## Purpose

Perform bounded, read-only validation of supplied controlled-worktree evidence and determine whether a plan or implementation is safe to proceed or commit.

## Design

The validator inspects only the supplied task scope and bounded Git evidence, then returns a finding, observed evidence, the smallest safe next action, and residual risk. It does not edit, execute arbitrary commands, delegate, commit, or grant task authority.

[as-is](../../as-is.md#design) / [agents](../as-is.md#design) / **evidence-validator**

### Controlled-worktree validation boundary

```mermaid
---
config:
  layout: elk
---
flowchart TB
    Validator["Evidence validator"] -->|reads| Scope["Supplied task scope"]
    Validator -->|validates| Evidence["Controlled-worktree evidence"]
    Validator -->|provides| Report["Finding, evidence, recommendation, and residual risk"]
```

The role is a validation boundary rather than an implementation worker. Its fixed inspection profile keeps evidence review separate from the builder's implementation authority.

## Links

- [`agent.md`](agent.md) — canonical role contract and inspection limits.
