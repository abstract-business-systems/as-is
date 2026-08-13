---
name: managing-as-is-document
description: Defines and maintains durable as-is.md component records with clear purpose, hierarchy, boundaries, contextual links, and reader-oriented diagrams.
---

# Managing As-Is Documents

This skill defines the durable record contract for an individual `as-is.md` component record. It applies when a record for an approved component boundary is created, maintained, aligned with implementation evidence, or structurally reconciled; project adoption and component identification remain the concerns of `as-is-setup` and `integrate-as-is-documentation`. It does not create task, backlog, configuration, runtime, or agent authority.

## Scope And Authority

- The owning directory and its `as-is.md` define the default component boundary. Context outside that boundary is limited to applicable instructions, explicitly declared links, named dependencies, and sibling naming evidence needed for a changed label.
- The record's durable inputs are authoritative purpose, immediate documented children, design, relationships, direct navigation context, applicable instructions, bounded requirement, audience, assumptions, and acceptance conditions.
- `as-is.md` owns durable purpose, design, relationships, diagrams, and navigational links. The configured task record owns transient status, progress, budget, acceptance evidence, and recovery; configured backlog records own unstarted proposals.
- A record describes parent and child relationships without granting permission to edit another component's records, budgets, or tasks. Parent context is explicit rather than ambient.
- This skill owns record-specific structure, diagram meaning, and navigation. [Designing Mermaid diagrams](../designing-mermaid-diagrams/SKILL.md) owns reusable Mermaid mechanics, view selection, functional framing, labels, readability, and technical-detail limits.
- Existing scripts may provide deterministic orientation or validation, but they do not own record meaning, task authority, or agent selection.

## Record Model

An `as-is.md` holds stable component context for readers. It contains no active task state, runtime observation, budget, or temporary recovery details. Its title is `# <component-name> - as-is`, using the component's actual name rather than a generic placeholder.

| Section | Applicability | Durable content |
| --- | --- | --- |
| `## Purpose` | Required | Why the component exists and the responsibility it owns. |
| `## Components` | Only for immediate documented children | Direct child `as-is.md#design` links and concise child purposes; no grandchildren. |
| `## Design` | Required | A concise orientation, stable composition and responsibility facts, a resolving nearby parent link, and one or more applicable diagrams. |
| `### <diagram name>` | One per Mermaid diagram | A descriptive heading naming the view, followed by the Mermaid fence it introduces. |
| `## Relationships` | When direction or dependency matters | Parent, peer, dependency, authority, or collaboration facts not already clear in Design. |
| Focused ownership section | Only when needed | A non-repetitive ownership or authority limit. |
| `## Links` | When distinct direct working context is needed beyond nearby navigation; otherwise omit | Resolving repository-relative links needed to understand or operate within the component; omit duplicate navigation, changelogs, and other historical-summary artifacts. |

A parent component has one or more immediate child components with their own `as-is.md` records. Its Design starts with a structural container view of the actual parent and only those children. Every record has at least one reader-oriented diagram: a parent uses its structural container view, while a non-parent uses the smallest supported view of its own responsibility, interaction, boundary, lifecycle, or outcome. A one-node placeholder and a heatmap are not acceptable substitutes.

Links are direct, resolving repository-relative context needed to understand or operate within the component or its immediate children that is not already supplied by nearby navigation. A `Components` table is the required Markdown fallback for each immediate child target rendered as a linked structural-container node; the intentional diagram-link and Markdown-fallback pair is not a duplicated `## Links` catalog. A nearby `Parent:` link or approved breadcrumb, and the Markdown fallback for any separately linked diagram target, also already provide navigation; do not repeat the target in `## Links` merely as a catalog. A Mermaid-only target still needs the host-required Markdown fallback. Link normative protocols and reader-facing operational documentation when they materially support that work. Source and test files are omitted by default; link one only when it is a stable reader-facing operational interface or its exact behavior is indispensable to understand or operate the component and no existing prose or documentation provides equivalent context. Do not link changelogs, task narratives, backlogs, runtime artifacts, or host projections merely as historical summaries; a link never duplicates the authority of its target. Omit `## Links` when no qualifying direct context exists; never retain an empty Links section or add a placeholder statement.

## Diagram And Navigation Model

- Structural and temporal views answer different reader questions. A structural container view represents stable ownership and immediate children; a flow, sequence, state, decision, recovery, data, context, or journey view represents a separately scoped consequential behavior.
- Every Design contains one or more diagrams. Introduce each Mermaid fence with a descriptive `### <diagram name>` heading that names the view for navigation, such as `### Local delegation rehearsal`; do not use a literal `### Relevant diagrams` heading or a separate caption line. A record with several views uses one named subsection per view.
- Every Design has a resolving nearby Markdown `Parent:` link, including the root self-link. When a Design contains diagrams, place that link immediately before the first named diagram subsection; it is nearby Markdown navigation, never a synthetic diagram node or edge.
- A view includes only the purpose, actors or users, immediate responsibilities, relationships, interactions, boundaries, authority changes, consequential paths, and outcomes needed for its stated reader question. Routine standard behavior remains abstract unless an exception changes interpretation.
- A structural container is a box-oriented Mermaid `flowchart` whose subgraph title is the actual parent component. Child components are nested labeled boxes whose names target their `as-is.md#design` sections using the host-supported link syntax; the corresponding `Components` table provides the required Markdown and renderer fallback. Containment is nesting, not a synthetic parent node or a `contains` edge.
- Parent child boxes are balanced relationship-map elements rather than an implied top-to-bottom runtime sequence. Explicit sibling arrows have supported labels and remain readable; lightweight styling is used only when it improves scanability.
- The relationship vocabulary is `provides`, `uses`, `calls`, `delegates-to`, `publishes`, `subscribes-to`, `reads`, `writes`, `validates`, `observes`, `authorizes`, and `connects-to`. Abstract capability labels are preferred unless provider identity materially changes trust, security, ownership, deployment, cost, compliance, availability, or performance interpretation.
- Diagram layout follows the generic Mermaid skill: prefer a taller, narrower ELK/TB flowchart when it improves readability, while preserving a supported exception where host rendering or stated diagram meaning requires it.
- Authoritative prose and links define durable purpose, boundaries, relationships, and decisions. A diagram communicates the selected architecture view and neither contradicts the prose nor invents an unapproved relationship. Component tables provide required Markdown fallback for linked structural-container children when a renderer suppresses diagram navigation; this intentional pair is not duplicated in `## Links`. Markdown links remain the fallback for any separately linked diagram target; do not repeat a fallback target in `## Links` unless it adds distinct working context.

The [diagram examples](diagram-examples.md) start with the structural-container example for parent containment, sibling relationships, parent navigation, and renderer fallback, then illustrate separately scoped non-container views. These references occur with the rules they support; a trailing Links catalog in this procedure would duplicate that context and is intentionally omitted.

## Example Structure

The optional Components, Relationships, and Links sections appear below to show their placement. Leaf records omit Components, and any section without durable content is omitted rather than replaced by filler.

`````markdown
# <component-name> - as-is

## Purpose

<Stable responsibility and reader outcome.>

## Components

| Component | Purpose |
| --- | --- |
| [`<immediate child>`](<child-path>/as-is.md#design) | <Child responsibility.> |

## Design

<One-sentence orientation.>

Parent: [`<parent component>`](<parent-relative-path>/as-is.md#design)

### Structural container

```mermaid
---
config:
  layout: elk
---
flowchart TB
    subgraph <component-name>["<component-name>"]
        direction TB
        CHILD["<a href='<child-path>/as-is.md#design'><immediate child></a>"]
    end
```

<Stable composition, responsibility, and consequential design facts.>

## Relationships

<Only material parent, peer, dependency, or authority relationships.>

## Links

- `<distinct direct working context>` → `<repository-relative-path>` — <Why this context matters beyond nearby navigation.>
`````

## Creation, Alignment, And Replacement Model

| Situation | Record treatment |
| --- | --- |
| Approved component boundary without an `as-is.md` | An initial record contains supported durable purpose, design, relationships, and direct context. Component identification and approval remain owned by `as-is-setup` or `integrate-as-is-documentation`. A child record contains only its own context and direct parent navigation; applicable parent maps and container views remain parent-owned. |
| Implementation evidence changes reader-relevant context | Alignment is semantic rather than file-by-file. It covers purpose, boundary, immediate composition, material relationship or authority, and consequential lifecycle, failure, or recovery behavior; private helpers, generated artifacts, routine control flow, and non-material refactoring detail remain outside the record. |
| Record and implementation conflict | Implementation is evidence rather than automatic record authority. An intended or approved behavior change makes the record stale; unexpected implementation divergence remains an implementation or escalation concern; unresolved ambiguity leaves the record unchanged. |
| Material reorganization with unchanged component identity and boundary | In-place revision is the default. A controlled replacement is justified only when incremental revision cannot retain coherent purpose, structure, or navigation and preservation needs have been assessed. |
| Changed component identity or boundary | The change is a migration or retirement decision rather than ordinary alignment; its owner, consumers, direct-link disposition, recovery or audit value, and replacement path require explicit resolution before relocation or removal. |

## Applying The Model

1. Before a durable revision is treated as complete, its bounded reader problem, owning record, applicable instructions, direct links, sibling vocabulary, implementation evidence when alignment is in scope, acceptance conditions, assumptions, contradictions, and recovery path are explicit.
2. Supported durable facts reside in their named section: composition in Design, material parent, peer, or dependency direction in Relationships, and deferred limitations in a linked follow-up. Linked material remains reference context rather than inherited instructions or authority.
3. The applicable creation, alignment, or replacement treatment is limited to affected sections and views. Component labels align with the target parent's established sibling vocabulary unless semantic evidence supports a documented departure; child records do not expose hidden providers or distant descendants, and a parent mediates external and sibling connections.
4. Completion requires heading and authority separation, record shape, resolving changed links, omission of `## Links` when no qualifying distinct context exists, no duplicate navigation links, no source or test link without the stated exception, at least one named diagram subsection and a nearby parent link, diagram syntax and configured layout support where applicable, supported nodes and edges, consistency between diagrams and prose, and the stated acceptance conditions. Assumptions, unknowns, omitted detail, residual risk, and the smallest relevant deterministic checks, including `git diff --check`, are recorded. Unclear ownership, contradictory sources, an unresolved link target, or an unauthorized boundary crossing is a blocker rather than a reason to infer architecture or broaden scope.

## Outputs

- A durable `as-is.md` whose applicable sections provide purpose, design, relationships, and navigable context through an initial record, semantic alignment, or controlled replacement.
- A bounded diagram only where it materially reduces interpretation cost, with prose and links remaining authoritative.
