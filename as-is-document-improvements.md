# `as-is.md` Documentation Improvements

## Purpose

This note records the additions and conventions needed to bring component
records into alignment with the hierarchical, diagram-centered documentation
design. It is a planning and migration aid, not an authoritative component
record.

It also distinguishes two concerns: the existing record-management skill helps
create and maintain individual records, while a separate setup/integration
skill should introduce the convention into an existing project and identify
initial component candidates. The setup skill should invoke or link to the
record-management and record-structuring skills rather than replace them.

## Component boundary

An `as-is.md` record does not need a separate `## Boundary` section merely to
define the component. The component is defined by the directory containing the
record. Descendants remain within that component until a descendant has its own
`as-is.md` record.

Boundary prose is still appropriate when it explains a meaningful ownership,
access, trust, or authority distinction that cannot be understood from the
directory, purpose, components, or design. It should be placed in the smallest
relevant existing section rather than added as repetitive template content.

## Required improvements for component records

For each record, add only the sections that materially improve navigation and
understanding:

- **Purpose** — the enduring responsibility of the directory component.
- **Components** — immediate child components only, each linked to its own
  `as-is.md` when such a record exists.
- **Design** — the local structural view or the smallest useful overview flow.
- **Relationships** — parent, sibling, capability, or dependency relationships
  when they change interpretation.
- **Links** — direct implementation, design, test, or flow references needed to
  understand the component.

A leaf record should also make its leaf status clear when useful, for example:

```markdown
## Design

This is a leaf component; no independently documented child components are
currently defined.
```

Do not create child components solely because files, classes, or routines
exist. Create one when the responsibility is semantically meaningful and
sufficiently complex to benefit from its own purpose, relationships, flows,
and navigable context.

## Diagram requirements

### Structural diagrams

A structural diagram shows the component's local hierarchy. The component is
the parent container and immediate documented children are nested inside it.
Containment is expressed by the nested boxes, not by a `contains` arrow.

```mermaid
flowchart TD
    subgraph Parent[Parent Component]
        ChildA[Child A]
        ChildB[Child B]
        ChildA -->|provides| ChildB
    end
```

Do not expose hidden providers or distant descendants in a child view.
External and sibling connections belong at the nearest shared parent view.

### Key-flow diagrams

Keep detailed diagrams for key or complex flows. Standard behavior remains
hidden under its abstraction or component unless an exception, failure mode,
security implication, or other architectural consequence makes it important.

Use vertical top-to-bottom flowcharts by default. Sequence diagrams remain the
intentional exception because their participants are conventionally horizontal.
Every non-containment relationship must have an explicit, semantically labeled
arrow.

Useful view metadata includes:

```markdown
## View

- Kind: `data-flow`
- Scope: `example-component`
- Visible levels: component and immediate children
- Layout: top-to-bottom
- Arrow meaning: data or result progression
```

## Linked component names

When a component appears in a diagram, its displayed name should link to the
component's detailed diagram context, normally the `## Design` section of its
`as-is.md`, rather than only to the component directory route.

Mermaid source should use a resolvable `click` target where supported. Rendered
SVG output must preserve the hyperlink so selecting a component opens its
architecture details. Markdown component tables should use the same target.

Example intent:

```mermaid
flowchart TD
    Parent[Parent]
    Child[Child]
    Parent -->|uses| Child
    click Child "../child/as-is.md#design" "Open Child design"
```

The exact relative URL depends on the source record's directory and renderer.
A rendered SVG is a presentation artifact; the Markdown source and linked
record remain authoritative if a renderer cannot preserve a link.

## Key flows to add

A record needs a separate detailed flow when its behavior cannot be understood
from the overview diagram. Typical sections are:

- Trigger and preconditions.
- Participants at the selected hierarchy level.
- Ordered primary steps.
- Decisions and rejected paths.
- Failure, retry, cancellation, or recovery behavior when consequential.
- Completion or observable outcome.
- Assumed standard behavior hidden under components or abstractions.

Implementation details belong in linked leaf artifacts unless they affect a
visible architectural boundary or key flow.

## Candidate component identification

The integration skill should inspect an existing project semantically rather
than mechanically turning every directory, class, or module into a component.
Potential components include pieces with a distinct responsibility and enough
complexity or architectural consequence to justify independent documentation.
Evidence may include:

- A coherent user or system capability.
- A meaningful ownership or authority boundary.
- Multiple responsibilities that form a stable collaboration.
- Significant lifecycle, state, or failure behavior.
- Important external or sibling relationships.
- Independent change impact, testing scope, or operational concern.
- A key or complex flow that benefits from progressive disclosure.

The skill should record candidates and confidence or uncertainty, then create
or propose the smallest useful component record. Human design authority remains
responsible for accepting, merging, renaming, or rejecting candidates.

## Setup versus record maintenance

Project adoption should be handled by a dedicated setup/integration skill. Its
responsibilities include discovering the project root, proposing the initial
`as-is` layout, identifying semantically meaningful and sufficiently complex
components, creating an initial `components/` structure when that layout is
adopted, and producing a reviewable plan before making writes. It must preserve
existing project content and distinguish candidate discovery from architectural
approval.

The existing `components/as-is-setup` directory is an implementation component
with setup behavior; it is evidence and may support the future skill, but it is
not itself the reusable setup skill.

The record-management skill remains responsible for the lifecycle of each
individual `as-is.md`. The record-structuring skill remains responsible for
reusable record shape, hierarchy, link integrity, and diagram-navigation rules.
Whether those two skills should remain separate is recorded as a skills backlog
item for bounded comparison rather than decided here.

## Migration order

1. Add missing direct links to implementation, tests, and designs.
2. Mark whether each record is a leaf or has documented children.
3. Separate overview structure from key flows where the current diagram mixes
   them.
4. Add semantic relationship labels and explicit arrows.
5. Add component-name links to target `#design` anchors and validate rendered
   SVG hyperlinks.
6. Expand only the records whose complexity or architectural consequence
   warrants additional detail.

## Completion checks

- The directory, not a redundant section, defines component scope.
- Component diagrams are bounded to the component and immediate children.
- Containment uses nested boxes; other relationships use explicit labeled
  arrows.
- Standard flows are not repeated unnecessarily.
- Key flows include consequential outcomes and failure paths.
- Component names navigate to target diagram sections in source and rendered
  output where supported.
- Direct Markdown links resolve and `git diff --check` passes.
