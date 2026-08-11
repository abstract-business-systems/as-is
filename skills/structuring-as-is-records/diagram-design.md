# `as-is.md` Diagram Design

This document defines how the structural component diagram in an `as-is.md`
record is authored and maintained. It is a sibling procedure to the
`structuring-as-is-records` skill and is informed by the broader
[`hierarchical-component-documentation-design`](../../hierarchical-component-documentation-design.md)
design.

## Required component diagram

A record is **structurally applicable** when its `as-is.md` has an immediate
`## Components` section containing documented child components. A structurally
applicable record that uses a diagram must begin `## Design` with one bounded
component-to-component diagram. A record without documented children may omit a
structural diagram; if it needs a visual, its first diagram is the smallest
useful local view and the prose must still state the component's purpose and
boundary. This avoids turning every leaf record into a meaningless one-node
placeholder.

The component diagram is required before any optional key-flow, data-flow,
sequence, state, decision, or recovery diagrams. Those additional diagrams may
follow it when needed but do not replace the structural view. A genuinely small
record may omit diagrams altogether when prose and links are sufficient.

The structural view shows the record's component and its immediate documented
children only. Children are nested inside the parent; containment is not a
`contains` edge. Every other relationship has an explicit arrow and semantic
label. Hidden providers, distant descendants, and unrelated infrastructure do
not appear in a child view. Use `flowchart TD` by default; a different layout
requires a local rationale because direction must not silently imply a runtime
sequence.

### Authoring procedure

1. Read the record's Purpose, Components table, Relationships, and Links.
2. Determine whether the record is structurally applicable from its immediate
   documented children, not from filesystem directories or implementation
   names.
3. Add or revise the first Design diagram to show exactly the record and those
   children. Use nested containment for the hierarchy and labeled arrows only
   for supported non-containment relationships.
4. Add a later flow diagram only when a consequential interaction, decision,
   failure, retry, cancellation, recovery, or outcome would otherwise be hard
   to understand. Keep that flow's scope separate from the structural view.
5. Keep the surrounding prose authoritative: it explains purpose, constraints,
   and omitted detail without duplicating a second relationship model.
6. Validate scope, direction, links, Mermaid fences, and prose agreement before
   handoff. If a renderer cannot preserve hyperlinks, retain resolving Markdown
   and Components links and record the renderer limitation.

## Navigation links

Where supported by the diagram format and renderer, every displayed component
name is a link to the target component's `as-is.md#design` section, not merely
to the target directory or document root. Mermaid links require a renderer
configuration that permits navigation (for example, `securityLevel: loose`);
without that configuration, the diagram may appear clickable while navigation
is disabled or sanitized. Rendered SVG must preserve these links. This gives
readers and agents direct parent-to-child navigation.

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
