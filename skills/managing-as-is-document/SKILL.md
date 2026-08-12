---
name: managing-as-is-document
description: Defines and maintains durable as-is.md component records with clear purpose, hierarchy, boundaries, contextual links, and reader-oriented diagrams.
---

# Managing As-Is Documents

This skill defines the durable record contract for an individual `as-is.md` component record. It applies when a record is created, maintained, or structurally reconciled; project adoption remains the concern of `as-is-setup` and `integrate-as-is-documentation`. It does not create task, backlog, configuration, runtime, or agent authority.

## Scope And Authority

- The owning directory and its `as-is.md` define the default component boundary. Context outside that boundary is limited to applicable instructions, explicitly declared links, named dependencies, and sibling naming evidence needed for a changed label.
- The record's durable inputs are authoritative purpose, immediate documented children, design, relationships, direct navigation context, applicable instructions, bounded requirement, audience, assumptions, and acceptance conditions.
- `as-is.md` owns durable purpose, design, relationships, diagrams, and navigational links. The configured task record owns transient status, progress, budget, acceptance evidence, and recovery; configured backlog and changelog records own proposals and concise completed history.
- A record describes parent and child relationships without granting permission to edit another component's records, budgets, or tasks. Parent context is explicit rather than ambient.
- This skill owns record-specific structure, diagram meaning, and navigation. [Designing Mermaid diagrams](../designing-mermaid-diagrams/SKILL.md) owns reusable Mermaid mechanics, view selection, functional framing, labels, readability, and technical-detail limits.
- Existing scripts may provide deterministic orientation or validation, but they do not own record meaning, task authority, or agent selection.

## Record Model

An `as-is.md` holds stable component context for readers. It contains no active task state, runtime observation, budget, or temporary recovery details. Its title is `# <component-name> - as-is`, using the component's actual name rather than a generic placeholder.

| Section | Applicability | Durable content |
| --- | --- | --- |
| `## Purpose` | Required | Why the component exists and the responsibility it owns. |
| `## Components` | Only for immediate documented children | Direct child `as-is.md#design` links and concise child purposes; no grandchildren. |
| `## Design` | Required | A concise orientation, stable composition and responsibility facts, and applicable diagrams. |
| `## Relationships` | When direction or dependency matters | Parent, peer, dependency, authority, or collaboration facts not already clear in Design. |
| Focused ownership section | Only when needed | A non-repetitive ownership or authority limit. |
| `## Links` | When direct context is needed | Resolving repository-relative links that a reader needs to understand or operate within the component. |

A parent component has one or more immediate child components with their own `as-is.md` records. Its Design starts with a structural container view of the actual parent and only those children. A record with no immediate child records, including a collection of ordinary documents, is not a parent and has no container diagram. A non-parent record may use another view only when it reduces interpretation cost; a one-node placeholder and a heatmap are not structural substitutes.

Links are direct, resolving repository-relative context needed to understand or operate within the component. Routine task, backlog, changelog, runtime, and host-projection artifacts are omitted unless they provide that needed context; a link never duplicates the authority of its target.

## Diagram And Navigation Model

- Structural and temporal views answer different reader questions. A structural container view represents stable ownership and immediate children; a flow, sequence, state, decision, recovery, data, context, or journey view represents a separately scoped consequential behavior.
- A view includes only the purpose, actors or users, immediate responsibilities, relationships, interactions, boundaries, authority changes, consequential paths, and outcomes needed for its stated reader question. Routine standard behavior remains abstract unless an exception changes interpretation.
- A structural container is a box-oriented Mermaid `flowchart` whose subgraph title is the actual parent component. Child components are nested labeled boxes whose names target their `as-is.md#design` sections when the host supports the link. Containment is nesting, not a synthetic parent node or a `contains` edge.
- Parent child boxes are balanced relationship-map elements rather than an implied top-to-bottom runtime sequence. Explicit sibling arrows have supported labels and remain readable; lightweight styling is used only when it improves scanability.
- The relationship vocabulary is `provides`, `uses`, `calls`, `delegates-to`, `publishes`, `subscribes-to`, `reads`, `writes`, `validates`, `observes`, `authorizes`, and `connects-to`. Abstract capability labels are preferred unless provider identity materially changes trust, security, ownership, deployment, cost, compliance, availability, or performance interpretation.
- Every Design section has a resolving nearby Markdown `Parent:` link, including the root self-link. When a diagram appears, that link is the final Markdown content immediately before the first Mermaid fence; it is never a synthetic diagram node or edge.
- Authoritative prose and links define durable purpose, boundaries, relationships, and decisions. A diagram communicates the selected architecture view and neither contradicts the prose nor invents an unapproved relationship. Markdown links and component tables remain the fallback when a renderer suppresses diagram navigation.

The [diagram examples](diagram-examples.md) start with the structural-container example for parent containment, sibling relationships, navigation, and renderer fallback, then illustrate separately scoped non-container views. These references occur with the rules they support; a trailing Links catalog in this procedure would duplicate that context and is intentionally omitted.

## Example Structure

The optional Components and Relationships sections appear below to show their placement. Leaf records omit Components, and any section without durable content is omitted rather than replaced by filler.

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

```mermaid
flowchart LR
    subgraph <component-name>["<component-name>"]
        direction LR
        CHILD["<immediate child>"]
    end
```

<Stable composition, responsibility, and consequential design facts.>

## Relationships

<Only material parent, peer, dependency, or authority relationships.>

## Links

- `<direct context>` → `<repository-relative-path>` — <Why this context matters.>
`````

## Applying The Model

1. Before a durable revision is treated as complete, its bounded reader problem, owning record, applicable instructions, direct links, sibling vocabulary, acceptance conditions, assumptions, contradictions, and recovery path are explicit.
2. Supported durable facts reside in their named section: composition in Design, material parent/peer/dependency direction in Relationships, deferred limitations in a linked follow-up, and completed history in the configured changelog record. Linked material remains reference context rather than inherited instructions or authority.
3. A revision changes only applicable sections and views. Component labels align with the target parent's established sibling vocabulary unless semantic evidence supports a documented departure; child records do not expose hidden providers or distant descendants, and a parent mediates external and sibling connections.
4. Completion requires heading and authority separation, record shape, resolving changed links, diagram syntax where applicable, supported nodes and edges, consistency between diagrams and prose, and the stated acceptance conditions. Assumptions, unknowns, omitted detail, residual risk, and the smallest relevant deterministic checks, including `git diff --check`, are recorded.
5. After validation, the configured changelog record holds the validated durable change. Unclear ownership, contradictory sources, an unresolved link target, or an unauthorized boundary crossing is a blocker rather than a reason to infer architecture or broaden scope.

## Outputs

- A durable `as-is.md` whose applicable sections provide purpose, design, relationships, and navigable context.
- A bounded diagram only where it materially reduces interpretation cost, with prose and links remaining authoritative.
- A concise configured-changelog entry after the revision's validation evidence, assumptions, and residual risk are durable.
