---
name: managing-as-is-document
description: Creates and maintains durable as-is.md component records with clear purpose, design, boundaries, links, and reader-oriented diagrams.
---

# Managing As-Is Documents

Use this skill when a repository or component needs a durable `as-is.md`
record created, maintained, or structurally reconciled. The record explains
what a component is responsible for and how readers should navigate its
context; it is not a task record, backlog, configuration store, or runtime log.

## Inputs

- The owning directory and its current `as-is.md`, or an explicitly authorized
  request to create the record.
- Authoritative purpose, immediate child components, design, relationships,
  boundary, and direct links needed for navigation.
- Applicable parent instructions, bounded requirement, audience, assumptions,
  and acceptance conditions.
- The generic [Mermaid diagram design](../mermaid-diagram-design/SKILL.md)
  skill when a visual context view materially reduces interpretation cost.

The component directory is the default scope. Read outside it only for named
instructions, dependencies, or links required to understand the record. Do not
infer architecture from ambient filesystem discovery.

## Authority and boundaries

- `as-is.md` owns durable purpose, design, relationships, boundaries, diagrams,
  and navigational links.
- `tasks.md` and `as-is.json.task` own transient task status, progress, budget,
  acceptance evidence, and recovery.
- `backlog.md` owns unstarted proposals; `changelog.md` owns concise completed
  history.
- Existing scripts may provide deterministic orientation or validation, but
  they do not own record meaning, task authority, or agent selection.
- A record may describe parent and child relationships but never grants
  permission to edit another component's files or state.

## Procedure

1. Identify the owning component from the directory containing `as-is.md` and
   read its parent instructions, current record, direct links, backlog, and
   changelog as applicable.
2. State the structural or navigation problem, affected readers, bounded scope,
   acceptance conditions, and recovery path before editing. Preserve supported
   facts and flag contradictions or assumptions.
3. Create or revise only the required sections in this order: `Purpose`,
   optional immediate-child `Components`, `Design`, optional `Relationships`,
   optional `Boundary`, and `Links`. Keep prose authoritative and concise.
4. Add a Mermaid diagram when prose and links alone leave a meaningful reader
   question about the component's context, responsibility changes, interactions,
   or consequential outcome. Apply the Mermaid diagram-design skill to select
   the smallest useful type. The `as-is.md` view must communicate, at the
   requested scope, the component's purpose, actors or users, one or more
   meaningful immediate subcomponents when present, their responsibilities,
   relationships, interactions, boundaries, authority changes, consequential
   primary flows, and observable outcomes. Add alternate, rejected, or recovery
   paths only when they materially affect understanding. Use functional labels
   that do not require implementation knowledge; omit implementation detail
   unless a separate technical view is explicitly requested.
5. Link only direct, resolving repository-relative context. Describe why each
   non-obvious link matters. Preserve existing scripts and link them when they
   are relevant; do not duplicate or move them speculatively.
6. Validate headings, authority separation, diagram semantics and Mermaid
   syntax when present, and all changed Markdown links. Confirm every node and
   edge has supported meaning, boundaries and consequential paths are visible,
   and the diagram agrees with authoritative prose. Record assumptions,
   unknowns, omitted detail, and residual risk rather than inferring context.
   Run the smallest relevant deterministic checks and `git diff --check`.
7. Record completed durable changes in the owning `changelog.md`. Stop before
   claiming completion if required evidence, links, boundaries, or authority
   are ambiguous.

## Outputs

- A durable `as-is.md` with purpose, design, relationships, boundary, and
  navigable links appropriate to the component.
- A concise changelog entry after validation.
- Validation evidence covering structure, links, diagrams when present, and
  whitespace; residual risk and assumptions are explicit.

## Checks

- The record has a clear purpose and does not contain transient task state.
- Immediate child components are linked only when they have their own
  `as-is.md`; grandchildren are not duplicated.
- Design explains responsibility and relationships without duplicating linked
  artifacts.
- Links resolve from the record's location and scripts remain in their existing
  location.
- Diagrams, when present, are bounded, reader-oriented, consistent with prose,
  and use the appropriate Mermaid type.
- `git diff --check` and the smallest applicable documentation/link checks pass.

## Stop and escalate

Stop when ownership is unclear, sources contradict one another, a requested
change crosses a component boundary, a link target cannot be established, or a
diagram would imply an unapproved architecture or authority decision. Request
an explicitly bounded parent or architecture task rather than editing outside
scope.

## Links

- [as-is.md](as-is.md) — durable record for this skill component.
- [scripts/orient.ts](scripts/orient.ts) — read-only orientation snapshot utility.
- [scripts/orient.test.ts](scripts/orient.test.ts) — focused orientation checks.
- [../mermaid-diagram-design/SKILL.md](../mermaid-diagram-design/SKILL.md) — reusable Mermaid diagram design.
- [../structuring-as-is-records/SKILL.md](../structuring-as-is-records/SKILL.md) — durable record structure and link integrity.
