---
name: structuring-content
description: Structures repository content as a durable, discoverable knowledge-work artifact. Use when arranging components, folders, files, or Markdown sections.
---

# Structuring Content

Structure repository content as durable, discoverable knowledge work without
creating structure that duplicates, obscures, or outlives its value. Folders,
files, and Markdown sections are all levels of the same conceptual hierarchy.

## Method

1. Identify the repository concept or component being represented and its
   purpose, boundary, audience, authority, and expected lifetime.
2. Extract its facts, decisions, assumptions, open questions, transient status,
   interfaces, and related artifacts.
3. Choose the smallest coherent place in the repository hierarchy for that
   concept, whether a section, file, or directory.
4. Link related authoritative artifacts instead of duplicating their contents.
5. Separate settled design from proposals, active task state, and private runtime
   state.
6. Review for discoverability, semantic grouping, replacement paths, accuracy,
   and stale or superseded content.

## Placement Rules

- Put enduring cross-project behavior in `design-principles.md`.
- Put executable, reusable procedures in `skills/<skill-name>/SKILL.md`.
- Put replaceable current project policy and task context in `as-is.md`.
- Put architecture, protocols, and design rationale in subject-named documents.
- Put host-specific integration instructions in a host-specific adapter or skill.
- Keep private runtime state, credentials, caches, verbose logs, and temporary
  tool output outside authoritative project knowledge.

## Structure Rules

- Treat folders, files, and Markdown sections as a continuous lineage. A
  coherent document may later become a directory with the same subject name,
  with its former sections represented by focused documents. Preserve a clear
  entry point according to the host's linking conventions when making that
  replacement.
- Group sibling components under a type directory when the group communicates a
  meaningful shared role and improves navigation or establishes a real boundary.
  For example, place related UI components in `components/` and services in
  `services/`. A directory adds a path level, a classification decision, and an
  implied coherence claim; do not incur those costs only to mirror a neighboring
  directory or because unrelated artifacts happen to be adjacent.
- Keep a unique artifact at its current level until it has a meaningful sibling
  group or another concrete reason for its own boundary. Matching a nearby
  `components/` directory with a one-file `services/` directory does not itself
  establish that reason.
- Keep a component's purpose explicit in its task record. `Purpose` explains why
  the component exists; `Requirement` states the bounded work currently assigned
  to it.

### Creation-time grouping

- When creating the first item in a known, meaningful sibling set, create the
  type directory from the outset. Apply the same default when an established
  repository, industry, or host convention requires a semantically accurate
  type directory, even if the set is not yet populated locally. Predictable
  locations and stable paths reduce scanning, reclassification, and later
  migration.
- Before creating that directory, record evidence for the expected sibling set or
  applicable standard, the parent concept, ownership, authoritative entry point,
  and migration or replacement path. If that evidence is absent, keep the unique
  artifact at its current level and document why.
- This is a creation-time default, not an always-group rule. Do not introduce a
  type directory when it would obscure ownership or authority, cut across a
  lifecycle or component boundary, encode a speculative or generic-bucket
  boundary, or conflict with the component-task hierarchy. Preserve the
  smallest coherent boundary and the clear entry point in those cases.

## Examples

Use paired positive and negative examples when a structural rule is likely to be
misread or when an established local pattern needs a contrast. Keep examples
small, state the reason the positive example fits, and state the specific rule
the negative example violates. Do not add examples that merely repeat an
unambiguous rule or create an alternate source of truth.

- Positive: create `services/health-check.md` when the repository has a known
  set of service procedures and `services/` is its established type convention;
  the shared role, owner, entry point, and replacement path are explicit.
- Negative: do not create `services/one-off-note.md` merely because a nearby
  `components/` directory exists. With no meaningful sibling set or standard,
  the extra generic bucket adds a level without a distinct boundary.

## Quality Checks

- Prefer one authoritative home for a decision or rule.
- Preserve meaningful context, source, and rationale when compressing notes.
- Use hierarchy to group related knowledge, but do not create a level that has
  no distinct ownership or navigational purpose.
- Before creating a type directory, check and retain the expected sibling set or
  standard, parent concept, owner, authoritative entry point, and migration or
  replacement path.
- Confirm that a proposed file-to-directory expansion preserves the subject,
  discoverability, and authoritative entry point.
- Remove or clearly mark superseded material once its replacement is
  authoritative.
