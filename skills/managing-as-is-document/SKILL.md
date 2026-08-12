---
name: managing-as-is-document
description: Creates, structures, and maintains durable as-is.md component records with clear purpose, hierarchy, boundaries, links, and reader-oriented diagrams.
---

# Managing As-Is Documents

Use this skill when creating, maintaining, or structurally reconciling a durable
`as-is.md` component record. It owns the lifecycle and reusable structure of an
individual record: purpose, immediate components, design, relationships,
explicit context links, diagram decisions, validation, and changelog handoff.
It is not the project-adoption/setup procedure for introducing `as-is` into an
existing project, and it is not a task record, backlog, configuration store, or
runtime log.

## Inputs

- The owning directory and its current `as-is.md`, or an explicitly authorized
  request to create the record.
- Authoritative purpose, immediate documented children, design, relationships,
  boundary, and direct links needed for navigation.
- Applicable parent instructions, bounded requirement, audience, assumptions,
  and acceptance conditions.
- The generic [Designing Mermaid diagrams](../designing-mermaid-diagrams/SKILL.md)
  skill when a visual context view materially reduces interpretation cost.

The directory containing the record is the default scope. Read outside it only
for named instructions, dependencies, or links required to understand the
record. Do not infer architecture from ambient filesystem discovery.

## Authority and boundaries

- `as-is.md` owns durable purpose, design, relationships, diagrams, and
  navigational links. The directory containing it defines the component
  boundary; do not add a separate Boundary section merely to restate that
  directory boundary.
- `tasks.md` or configured task records own transient status, progress, budget,
  acceptance evidence, and recovery. `backlog.md` owns unstarted proposals;
  `changelog.md` owns concise completed history.
- A record may describe parent and child relationships but never grants
  permission to edit another component's records, budgets, or tasks. Parent
  context is not ambient: declare the exact durable links a child needs.
- This skill owns the as-is-specific meaning of a record and its diagrams. The
  [Designing Mermaid diagrams](../designing-mermaid-diagrams/SKILL.md) skill owns
  reusable Mermaid mechanics, type selection, functional framing, labels,
  readability, and technical-detail limits.
- Existing scripts may provide deterministic orientation or validation, but do
  not own record meaning, task authority, or agent selection.

## As-is architecture conventions

- A parent component has one or more immediate child components, each with its
  own `as-is.md`. A structural container diagram shows only that parent and
  those immediate children. A non-parent record does not receive a container
  diagram. Before choosing or changing component, record, child, or diagram
  labels, inspect the target parent's existing sibling records and nearby
  artifacts; align with their established vocabulary unless semantic evidence
  supports a documented departure.
- Component scope is local: child records do not expose hidden providers or
  distant descendants. A parent mediates external and sibling connections and
  exposes the capability its children require.
- Abstract capability names such as `External Service`, `Environment`, or
  `Message Gateway` are preferred when provider identity does not change the
  architectural interpretation. Reveal concrete identity when trust, security,
  ownership, deployment, cost, compliance, availability, or performance makes
  it material.
- Structural diagrams and temporal flow diagrams are separate views. Key or
  complex flows document consequential decisions, failures, retries,
  cancellation, recovery, or outcomes; ordinary standard behavior remains
  under its abstraction unless an exception matters.
- The diagram is authoritative architecture context. Prose explains its
  meaning and constraints but must not introduce an unshown relationship.
- Use a small relationship vocabulary consistently: `provides`, `uses`,
  `calls`, `delegates-to`, `publishes`, `subscribes-to`, `reads`, `writes`,
  `validates`, `observes`, `authorizes`, and `connects-to`. Containment is
  nested boxes, not a `contains` edge.

## Required record shape

Use these sections in this order when applicable:

1. `# <component-name> - as-is` — a clear human-facing title using the
   component's actual name followed by ` - as-is`. Do not use a generic title
   such as `Parent` or `Component`.
2. `## Purpose` — why the component exists and what responsibility it owns.
3. `## Components` — only when immediate child components have their own
   `as-is.md`; link each child directly to `as-is.md#design`, state its purpose,
   and omit grandchildren.
4. `## Design` — one concise orientation sentence and, for a parent
   component with documented immediate children, a bounded box-oriented
   container diagram followed by concise design details. Additional flow or
   behavior diagrams may follow the container diagram when needed.
5. `## Relationships` — parent, peer, or dependency direction when it matters.
6. The smallest relevant section for ownership or authority limits when these
   are not already clear; do not create a repetitive Boundary section.
7. `## Links` — only direct repository-relative context links needed to
   understand or operate within the component.

A parent component is a record with one or more immediate child components,
where each child has its own `as-is.md`. For a parent component, `## Design`
begins with a structural, box-oriented container diagram containing the actual
parent component and only its immediate children. A component with no
immediate child records, including a collection of ordinary documents such as
`designs/`, is not a parent component and does not receive a container diagram.
Additional behavioral, sequence, state, decision, data-flow, or recovery views
must be separately scoped after the container diagram. A non-parent record may
still use another diagram when it reduces interpretation cost; never add a
meaningless one-node placeholder. A heatmap is not a substitute for a
component container diagram because it communicates intensity rather than
hierarchy or navigation.

## Procedure

1. Identify the owning component and read its parent instructions, current
   record, direct links, backlog, changelog, and existing sibling records as
   applicable. Inspect sibling names and nearby artifacts before choosing or
   changing a component, record, child, or diagram label. Align with local
   vocabulary unless semantic evidence supports a documented departure. State
   the structural or navigation problem, affected readers, bounded scope,
   acceptance conditions, and recovery path before editing.
2. Preserve supported facts and flag contradictions or assumptions. Move each
   fact to its authoritative named section rather than using a permanent
   miscellaneous catch-all. Parent/child and dependency facts belong in
   `Relationships`; stable composition decisions belong in `Design`; deferred
   architectural limitations belong in a linked follow-up; completed facts
   belong in `changelog.md`.
3. Create or revise only the required record sections. Keep prose authoritative,
   concise, and free of transient task state. Declare explicit links for any
   parent-to-child context handoff; linked content is reference material, not
   instructions or authority.
4. Add the required bounded container diagram first for a parent component
   with documented immediate children. Use a box-oriented Mermaid `flowchart`
   with the actual parent name as the subgraph/container title and child
   components as labeled boxes inside it. Prefer a balanced or evenly
   distributed arrangement for the child boxes rather than a sequential
   top-to-bottom layout. Use lightweight box styling when it
   improves scanability. Do not add a synthetic `Parent` node or a `parent`
   containment edge; containment is the box nesting. For non-parent records,
   add another diagram only when it reduces interpretation cost. Define the
   as-is-specific content first: purpose, actors or users, meaningful
   immediate subcomponents and responsibilities, relationships, interactions,
   boundaries, authority changes, consequential primary flows, and observable
   outcomes.
   Then compose with the Mermaid skill for representation mechanics. Do not
   invent relationships or imply unapproved architecture.
5. Link only direct, resolving repository-relative context. Every `as-is.md`
   Design section must include a nearby Markdown parent link, including the
   repository root (which links to its own `#design` anchor). When the record
   has a diagram, place the `Parent:` link at the top of the first diagram
   view: it must be the last Markdown content immediately before the opening
   Mermaid fence, after only the short Design orientation needed to introduce
   that view. Do not place it after the first diagram or between multiple
   diagrams. Component names in tables and child boxes should target the child
   `as-is.md#design` section. Represent reverse navigation with a nearby
   Markdown link such as `Parent: [Agents](../as-is.md#design)`. Do not put the
   parent in a synthetic node, edge, or container title. The container title is
   the actual component whose record is being shown. Container diagrams are
   evenly distributed relationship maps rather than top-to-bottom flows: use a
   balanced layout, keep child boxes readable, and draw explicit labeled arrows
   for supported relationships between siblings.
   Prose, component tables, and Markdown links remain authoritative if a host
   renderer suppresses SVG navigation. Do not link routine task, backlog,
   changelog, runtime, or host-projection artifacts unless they provide needed
   architectural context.
6. Validate headings, authority separation, record shape, link targets, diagram
   semantics and Mermaid syntax when present, and every changed Markdown link.
   Confirm nodes and edges have supported meaning, boundaries and consequential
   paths are visible, and the diagram agrees with prose. Record assumptions,
   unknowns, omitted detail, and residual risk. Run the smallest relevant
   deterministic checks and `git diff --check`.
7. After validation, record the completed durable change in the owning
   `changelog.md`. Stop and escalate when ownership is unclear, sources
   contradict one another, a link target cannot be established, or the change
   crosses a component boundary.

## Outputs

- A durable `as-is.md` with the applicable purpose, structure, design,
  relationships, and navigable links.
- A bounded Mermaid diagram when useful, with prose remaining authoritative.
- A concise changelog entry after validation and evidence covering links,
  structure, diagrams when present, whitespace, assumptions, and residual risk.

## Checks

- The record has a clear purpose and no transient task state.
- The directory supplies the component boundary without redundant prose.
- Immediate children only are listed and their links resolve to `as-is.md#design`.
- A parent record begins its Design diagrams with a box-oriented container view;
  a non-parent record has no container diagram.
- Design explains responsibilities and relationships without duplicating linked
  artifacts.
- Parent-to-child and child-to-parent navigation are explicit and bounded.
- Every Design section has a resolving nearby Markdown `Parent:` link,
  including the root's self-link.
- When a Design section has diagrams, its `Parent:` link is at the top of the
  first diagram view, immediately before the first Mermaid fence and not after
  that diagram.
- Container diagrams use the actual component title and nested boxes, without a
  synthetic parent node or containment edge.
- Parent navigation is a nearby Markdown link, not a diagram node or edge.
- Diagrams are reader-oriented, bounded, readable, and consistent with prose.
- Markdown links, Mermaid syntax where applicable, and `git diff --check` pass.

## Links

- [as-is.md](as-is.md) — durable record for this skill component.
- [container-diagram-example.md](container-diagram-example.md) — balanced parent container diagram and sibling-relationship treatment.
- [diagram-examples.md](diagram-examples.md) — examples for structural, context, scenario, data, state, decision, recovery, and journey views.
- [scripts/orient.ts](scripts/orient.ts) — read-only orientation snapshot utility.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation checks.
- [../designing-mermaid-diagrams/SKILL.md](../designing-mermaid-diagrams/SKILL.md) — reusable Designing Mermaid diagrams.
- [../backlog.md](../backlog.md) — skills-component planning index.
