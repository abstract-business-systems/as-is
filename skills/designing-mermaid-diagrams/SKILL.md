---
name: designing-mermaid-diagrams
description: Designs bounded Mermaid diagrams that explain component context, responsibilities, relationships, interactions, boundaries, flows, and outcomes for readers.
---

# Designing Mermaid Diagrams

Use this skill when a reader needs a generic Mermaid visual explanation of a
subject's purpose, responsibilities, relationships, interactions, boundaries,
flows, or outcomes. It designs diagrams independently of the repository's
`as-is.md` record convention. A diagram is a communication aid: authoritative
purpose, boundaries, and decisions remain in linked prose and records.

## Inputs

- A named subject and the decision, explanation, or handoff the diagram must
  support.
- Authoritative purpose, immediate subcomponents, responsibilities,
  relationships, interactions, boundaries, actors, and outcomes.
- Audience, bounded scope, assumptions, required repository links, and any known render-surface constraints supplied by the target host or embedding context.

Do not infer missing relationships from implementation names or ambient
filesystem discovery. Record an unresolved assumption or stop when the source
context does not support a relationship.

## Functional context

Represent externally meaningful behavior:

- **Actors and goals:** who needs the outcome and why.
- **Responsibilities:** capabilities or decisions owned by the subject and
  immediate subcomponents.
- **Relationships and interactions:** how responsibilities cooperate, hand off,
  constrain, or inform one another.
- **Boundaries and authority:** where ownership, trust, scope, or authority
  changes.
- **Consequential flows and outcomes:** primary requests, decisions, rejected
  or alternate paths, recovery handoffs, and observable results.

Use functional nouns and roles rather than filenames. Do not primarily explain
process IDs, modules, deployment topology, providers, protocols, or internal
data structures; use a separate technical view when those details are needed.

## Pre-render layout plan

Before writing Mermaid, record a compact layout plan for the selected view:

- the available render-surface constraint, including any host, viewport, export,
  or embedding limit that materially affects readability;
- the intended orientation or shape, such as taller-than-wide, balanced, or
  time-ordered, and why it fits the reader question;
- a visible-node, edge, and label density budget that keeps labels legible
  without relying on rendering to reveal an overloaded view;
- grouping and routing direction, including which relationships belong inside a
  container, which cross its boundary, and whether direction conveys time,
  containment, or only presentation; and
- a supported exception or residual risk when the host renderer, diagram type,
  or stated meaning prevents the preferred shape.

Use the plan to reduce scope, split unrelated questions into separate views, or
shorten labels before rendering. Do not invent a numeric width, height, or
aspect ratio unless the target host supplies one; the plan records constraints
and reader intent, not a generic display contract.

## Method

1. State the subject, audience, purpose, scope, and bounded outcome.
2. Extract supported actors, goals, the subject, immediate subcomponents,
   responsibilities, relationships, interactions, boundaries, flows, and
   outcomes. Label assumptions and unknowns.
3. Select the smallest useful Mermaid view:
   - **flowchart** for responsibilities, boundaries, and an outcome journey;
   - **sequence diagram** for time-ordered interactions or handoffs;
   - **state diagram** for meaningful lifecycle states and transitions;
   - **journey** for actor experience across responsibilities;
   - **context map** using a flowchart when neighboring responsibilities and
     scope matter more than chronology.
   Do not force one diagram type when a different type communicates the bounded
   decision more clearly.
4. Record the pre-render layout plan. Name nodes with reader-oriented functional
   labels. Include only the subcomponents, neighbors, and edges that fit the
   stated scope and density budget. When a host document requests an even
   relationship map, choose a balanced layout rather than implying sequence;
   the host document owns any domain-specific container or hierarchy convention.
5. Prefer a taller, narrower readable view over a wide one when the plan and
   host constraints support it. For a Mermaid flowchart that benefits from
   automatic placement, use a fence-local ELK frontmatter block (`config:
   layout: elk`) and `flowchart TB`; retain a supported non-ELK layout only
   when ELK would obscure the stated relationship, conflict with host rendering,
   or make the diagram less readable. Layout is presentation, never evidence of
   chronology unless the diagram's stated meaning says otherwise.
6. Draw the primary path first, then add consequential alternate, rejected, or
   recovery paths. Show boundaries where responsibility or authority changes;
   explain dense detail in prose.
7. Add only resolving links required by the diagram's host document. Keep repository-specific component-linking, breadcrumb navigation, and container rules in the host document's owning procedure; do not make them generic Mermaid mechanics. Prose remains authoritative if a diagram diverges. Do not infer that an adequate Markdown navigation surface replaces a host-required diagram link. When a linked Mermaid node is required by the host, use the host-supported link syntax and preserve a Markdown fallback outside the diagram. Once that fallback exists, do not repeat the target or ordinary direct-child contracts in an unrelated link list unless they add distinct working context.
8. Validate syntax, configured layout support where applicable, link targets,
   supported edge meanings, readable labels, bounded scope, and consistency
   with authoritative prose.

## Output

Return or record:

- a Mermaid diagram and its subject, audience, purpose, scope, and pre-render
  layout plan;
- a short interpretation of responsibilities, interactions, boundaries, and the
  primary and consequential alternate paths;
- source links or provenance for non-obvious relationships;
- assumptions, unknowns, omitted technical detail, validation result, and
  residual risk.

## Checks

- Subject, audience, scope, and intended outcome are explicit.
- Immediate subcomponents and their meaningful responsibilities are represented
  when they are relevant to the purpose.
- Relationships, interactions, authority boundaries, and consequential outcomes
  are understandable without implementation knowledge.
- Every edge expresses a supported functional relationship.
- The selected Mermaid type fits the question and the diagram is readable.
- A pre-render layout plan states the available render-surface constraint,
  intended shape, density budget, grouping and routing direction, and any
  supported exception or residual risk.
- A flowchart uses a taller, narrower ELK/TB layout when that preference improves readability; any exception is supported by the host or the diagram's stated meaning.
- Generic diagram guidance does not impose a host document's hierarchy, title,
  breadcrumb, or container-view rules.
- Host-specific link syntax and fallback behavior are not presented as generic
  Mermaid requirements.
- Technical architecture has not displaced functional context.
- Mermaid syntax and repository-relative links pass the smallest applicable
  deterministic check.

## Stop and escalate

Stop rather than inventing a diagram when authoritative purpose or boundary is
missing, sources contradict one another, the view would cross an unauthorized
component boundary, or it would imply an unapproved architecture or authority
decision. Propose a separate technical diagram when implementation detail is
necessary.

## Boundary

This skill designs and validates Mermaid representations. It does not own
component behavior or records, grant authority, select or launch agents,
resolve linked context, or make architectural decisions.
