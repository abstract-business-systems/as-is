---
name: mermaid-diagram-design
description: Designs bounded Mermaid diagrams that explain complete component context, responsibilities, relationships, interactions, boundaries, flows, and outcomes for readers.
---

# Mermaid Diagram Design

Use this skill when a reader needs a visual explanation of a component's
purpose, its immediate subcomponents or neighbors, responsibility changes, or
a consequential outcome. A diagram is a communication aid: authoritative
purpose, boundaries, and decisions remain in linked prose and records.

## Inputs

- A named subject and the decision, explanation, or handoff the diagram must
  support.
- Authoritative purpose, immediate subcomponents, responsibilities,
  relationships, interactions, boundaries, actors, and outcomes.
- Audience, bounded scope, assumptions, and required repository links.

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
4. Name nodes with reader-oriented functional labels. Include only the
   subcomponents, neighbors, and edges needed for the stated scope.
5. Draw the primary path first, then add consequential alternate, rejected, or
   recovery paths. Show boundaries where responsibility or authority changes;
   explain dense detail in prose.
6. Add only resolving repository-relative links. Prose and component tables
   remain authoritative if a diagram diverges.
7. Validate syntax, link targets, supported edge meanings, readable labels,
   bounded scope, and consistency with authoritative prose.

## Output

Return or record:

- a Mermaid diagram and its subject, audience, purpose, and scope;
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
