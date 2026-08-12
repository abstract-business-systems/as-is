# Evidence Validator - as-is

## Purpose

Perform bounded, read-only validation of supplied controlled-worktree evidence and determine whether a plan or implementation is safe to proceed or commit.

## Design

The validator inspects only the supplied task scope and bounded Git evidence, then returns a finding, observed evidence, the smallest safe next action, and residual risk. It does not edit, execute arbitrary commands, delegate, commit, or grant task authority.

Parent: [Agents](../as-is.md#design)

The role is a validation boundary rather than an implementation worker. Its fixed inspection profile keeps evidence review separate from the builder's implementation authority.

## Links

- [`agent.md`](agent.md) — canonical role contract and inspection limits.
- [`live-behavioral.test.ts`](live-behavioral.test.ts) — controlled-worktree validation coverage.
