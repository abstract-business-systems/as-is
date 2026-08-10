# `as-is.md` Diagram Design

This document defines how the structural component diagram in an `as-is.md`
record is authored and maintained. It is a sibling procedure to the
`structuring-as-is-records` skill and is informed by the broader
[`hierarchical-component-documentation-design`](../../hierarchical-component-documentation-design.md)
design.

## Required component diagram

Every `as-is.md` record with a diagram in its `## Design` section must begin
that section's diagrams with a bounded component-to-component diagram. The
component diagram is required before any optional key-flow, data-flow,
sequence, state, decision, or recovery diagrams; those additional diagrams may
follow it when needed but do not replace the structural view. A genuinely small
record may omit diagrams altogether when prose and links are sufficient.

The structural view shows the record's component and its immediate documented
children only. Children are nested inside the parent; containment is not a
`contains` edge. Every other relationship has an explicit arrow and semantic
label. Hidden providers, distant descendants, and unrelated infrastructure do
not appear in a child view.

## Navigation links

Where supported by the diagram format and renderer, every displayed component
name is a link to the target component's `as-is.md#design` section, not merely
to the target directory or document root. Rendered SVG must preserve these
links. This gives readers and agents direct parent-to-child navigation.

A child diagram should also include a parent link when the parent is known and
showing it does not violate the child view boundary. The parent link targets
the parent's `as-is.md#design` section and provides reverse navigation. The
Markdown component table remains authoritative if a renderer cannot preserve a
link.

## Layout and flows

Use top-to-bottom layout by default. Sequence diagrams are the intentional
exception. Document key or complex flows explicitly, including consequential
decisions, failures, retries, cancellation, recovery, or outcomes. Ordinary
standard behavior may remain implicit under an abstraction or component.

## Validation

Check that the diagram has the correct two-level scope, meaningful labels,
explicit non-containment arrows, resolving `#design` links, preserved SVG
hyperlinks where supported, and agreement with the surrounding prose. Run the
smallest available Mermaid/rendering and Markdown-link checks plus
`git diff --check`.
