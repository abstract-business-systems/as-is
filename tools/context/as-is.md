# context tools - as-is

## Purpose

Expose bounded agent-facing context resolution while keeping linked-context implementation and trust rules in `core/modules/context-resolution`.

## Design

**Lineage**: [as-is](../../as-is.md#design) / [tools](../as-is.md#design) / **context tools**

`resolve-linked-context.ts` is a thin tool boundary. It accepts one explicit reference, obtains component context authority from the host environment, and delegates containment, task-record exclusion, provenance, size, and untrusted-content handling to the context-resolution module. It does not discover ambient context, grant component authority, or mutate files.

### Tool boundary view

```mermaid
flowchart LR
    Caller["agent"]
    ResolveLinkedContext["<a href='./resolve-linked-context.ts'>resolve-linked-<br/>context.ts</a>"]
    ContextResolution["<a href='../../core/modules/context-resolution/as-is.md#design'>context-<br/>resolution</a>"]
    Caller -->|one explicit reference| ResolveLinkedContext
    ResolveLinkedContext -->|delegates trust rules to| ContextResolution
```

## Links

- [`resolve-linked-context.ts`](resolve-linked-context.ts) — bounded tool implementation.
- [`../../core/modules/context-resolution/as-is.md`](../../core/modules/context-resolution/as-is.md#design) — host-neutral resolver authority.
