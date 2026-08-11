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

## Required record shape

Use these sections in this order when applicable:

1. `# <Component> ...` — a clear human-facing title.
2. `## Purpose` — why the component exists and what responsibility it owns.
3. `## Components` — only when immediate child components have their own
   `as-is.md`; link each child directly to `as-is.md#design`, state its purpose,
   and omit grandchildren.
4. `## Design` — one concise orientation sentence, an optional bounded diagram,
   and concise design details.
5. `## Relationships` — parent, peer, or dependency direction when it matters.
6. The smallest relevant section for ownership or authority limits when these
   are not already clear; do not create a repetitive Boundary section.
7. `## Links` — only direct repository-relative context links needed to
   understand or operate within the component.

For a record with immediate documented children, a diagram in `## Design`, when
present, begins with a structural view of the record and those children.
Additional behavioral, sequence, state, decision, data-flow, or recovery views
must be separately scoped. Leaf records may omit diagrams when prose and links
are sufficient; never add a meaningless one-node placeholder.

## Procedure

1. Identify the owning component and read its parent instructions, current
   record, direct links, backlog, and changelog as applicable. State the
   structural or navigation problem, affected readers, bounded scope,
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
4. Add a diagram only when it reduces interpretation cost. Define the
   as-is-specific content first: purpose, actors or users, meaningful immediate
   subcomponents and responsibilities, relationships, interactions, boundaries,
   authority changes, consequential primary flows, and observable outcomes.
   Then compose with the Mermaid skill for representation mechanics. Do not
   invent relationships or imply unapproved architecture.
5. Link only direct, resolving repository-relative context. Component names in
   tables and diagrams should target the child `as-is.md#design` section.
   Prose, component tables, and Markdown links remain authoritative if a host
   renderer suppresses SVG navigation. Where parent context is known and
   showing it does not violate the bounded child view, a child diagram may also
   link back to the parent's `as-is.md#design`. Do not link routine task,
   backlog, changelog, runtime, or host-projection artifacts unless they
   provide needed architectural context.
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
- Design explains responsibilities and relationships without duplicating linked
  artifacts.
- Parent-to-child context is explicit and bounded.
- Diagrams are reader-oriented, bounded, readable, and consistent with prose.
- Markdown links, Mermaid syntax where applicable, and `git diff --check` pass.

## Links

- [as-is.md](as-is.md) — durable record for this skill component.
- [scripts/orient.ts](scripts/orient.ts) — read-only orientation snapshot utility.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation checks.
- [../designing-mermaid-diagrams/SKILL.md](../designing-mermaid-diagrams/SKILL.md) — reusable Designing Mermaid diagrams.
- [../backlog.md](../backlog.md) — skills-component planning index.
