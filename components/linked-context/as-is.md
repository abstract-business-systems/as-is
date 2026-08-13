# Linked Context - as-is

## Purpose

Provide the simple host tool that lets an agent consume one explicitly linked
local context resource without turning an `as-is.md` record into a general
filesystem reader. The implementation lives here, but the agent-facing concept
is the bounded `resolve_component_context` tool.


## Design

The component is organized around the following relationships and flow.

[as-is](../../as-is.md#design) / [Components](../as-is.md#design) / **Linked Context**

```mermaid
flowchart TD
    A["Explicit as-is link"] --> B["resolve_component_context"]
    B --> C["Bounded untrusted context"]
```

- An exact inline link exposes one file; a trailing `/` exposes a bounded,
  non-recursive directory index.
- Canonicalization rejects traversal, symlink escapes, absolute paths, URI
  schemes, unexposed directories, task records, and oversized content.
- Results include bounded UTF-8 content, provenance, hash, media type,
  diagnostics, and completion status.
- Returned text is untrusted context; the resolver follows no links and uses no
  network.
- Record-structuring skills declare links; building skills decide which links
  to consume; this tool owns neither authority.

## Follow-up

Validate the tool in a real, narrow component task that explicitly links a
parent-held design or fixture directory. Record cached token input, retry
duration, model-to-model calls, correctness, rework avoided, and any boundary
failure before considering raw-tool mediation or broader link types.

## Links

- [`resolver.ts`](resolver.ts) — bounded explicit local-link resolution.
- [`resolver.test.ts`](resolver.test.ts) — deterministic policy tests.
- [`../../designs/component-scoped-context-resolution.md`](../../designs/component-scoped-context-resolution.md) — broader context-resolution design.
