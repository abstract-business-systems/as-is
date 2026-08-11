# Balanced Component Container Diagram Example

This example is intentionally separate from the reusable Mermaid skill. It
shows the `as-is.md`-specific structural and navigation convention for a
parent component with immediate children.

## Scope

The `Checkout` component owns three documented child components. The diagram
shows only `Checkout` and those immediate children. The children have sibling
relationships, so the diagram uses a balanced relationship-map layout rather
than a top-to-bottom flow. The nearby parent link supports reverse navigation;
it is not a synthetic diagram node or edge.

Parent: [Commerce Platform](../../as-is.md#design)

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    subgraph Checkout["Checkout"]
        direction LR
        Validation["<a href='./validation/as-is.md#design'>Validation</a>"]
        Authorization["<a href='./authorization/as-is.md#design'>Authorization</a>"]
        OrderRecording["<a href='./order-recording/as-is.md#design'>Order recording</a>"]

        Validation -->|approves request for| Authorization
        Authorization -->|releases outcome to| OrderRecording
        Validation -.->|supplies accepted order data to| OrderRecording
    end

    classDef container fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef child fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Checkout container
    class Validation,Authorization,OrderRecording child
```

## Why this representation

- The subgraph title is the actual component name, not `Parent` or a synthetic
  parent node.
- Child components are boxes nested inside the parent container.
- Sibling relationships use explicit, semantically labeled arrows.
- The parent link is nearby Markdown navigation rather than a diagram edge.
- The outer `LR` layout gives the container a balanced relationship-map shape;
  it does not imply a runtime sequence.
- Child names target each child's `as-is.md#design` section.

If the renderer does not support linked HTML labels or preserve SVG links, the
Markdown `Components` table remains the authoritative fallback. Do not add a
container diagram to a record unless the children are independently documented
components with their own `as-is.md` records.
