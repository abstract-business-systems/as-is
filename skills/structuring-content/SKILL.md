---
name: structuring-content
description: Structures repository content as a durable, discoverable knowledge-work artifact. Use when arranging components, folders, files, or Markdown sections.
---

# Structuring Content

Structure repository content as durable, discoverable knowledge work without
creating structure that duplicates, obscures, or outlives its value. Folders,
files, and Markdown sections are all levels of the same conceptual hierarchy.
Machine-readable structures such as JSON objects and keys may also participate
in that larger conceptual tree, even when they are not part of the same
implementation or authority boundary.

## Method

1. Identify the repository concept or component being represented and its
   purpose, boundary, audience, authority, and expected lifetime.
2. Extract its facts, decisions, assumptions, open questions, transient status,
   interfaces, and related artifacts.
3. Choose the smallest coherent place in the repository hierarchy for that
   concept, whether a section, file, or directory.
4. At creation time, explicitly decide whether a known meaningful sibling set or
   established type-directory convention warrants grouping from the first item;
   retain a unique artifact at the current level when the required evidence is
   absent or an exception applies, and record the decision.
5. Link related authoritative artifacts only when they add distinct needed context or navigation; do not repeat a breadcrumb, required Markdown fallback, or ordinary direct-child contract merely as a catalog. Prefer one authoritative home for a decision or rule; do not keep the same current decision, rule, or state in two authoritative locations. Do not use a high-level link list to enumerate implementation or test files unless the exact file is a reader-facing operational interface or indispensable to understand or operate the artifact; otherwise link its stable prose contract or explain its role in prose.
6. Separate settled design from proposals, active task state, and private runtime
   state.
7. Review for discoverability, semantic grouping, replacement paths, accuracy,
   and stale or superseded content.

## Conceptual Tree

The larger conceptual tree is a way to understand context, not a requirement to
combine artifacts or implement a universal context graph. Directories, files,
Markdown sections, JSON objects, JSON keys, and links may represent related
nodes at different levels. Preserve each artifact's own audience, authority,
ownership, and lifecycle; use links and explicit relationships rather than
forcing unlike representations into one schema.

## Representation Rules

Choose the representation that matches the information shape and the reader's
task. Apply the same rule to durable Markdown artifacts and live responses. Omit an optional Markdown section when it has no durable content; do not retain an empty heading or add placeholder text merely to preserve a template shape.

| Information shape | Preferred representation |
| --- | --- |
| Stable repeated fields, comparisons, ownership, status, or prioritization | Markdown table |
| Short homogeneous collection | Bulleted list |
| Ordered procedure or state sequence | Numbered list or state table |
| Rationale, explanation, or relationship | Prose |
| Large or deeply structured data | Linked artifact or focused subsection, not an oversized table |

Tables are a preference, not an obligation. Use prose when a table would obscure
meaning, and use lists when a table would add ceremony without improving
scanning. Do not duplicate the same authoritative fact in multiple formats.

## Live Response Presentation

Live responses are presentation, not a second task record. They should expose the
smallest useful summary first and progressively disclose detail when it changes
the user's decision.

| Response need | Preferred presentation |
| --- | --- |
| Several comparable facts | Compact table |
| Short set of actions or findings | Bulleted list |
| Ordered implementation or recovery sequence | Numbered list |
| Explanation, trade-off, or qualification | Short prose |
| Detailed evidence | Summary with linked or named repository artifact |
| Completion report | Result, validation, residual risk, and next action |

A live response must preserve source and uncertainty where relevant. It must not
promote chat text, process output, or a private runtime observation into durable
task authority.

## Placement Rules

- Put enduring cross-project behavior in `docs/design-principles.md`.
- Put executable, reusable procedures in `skills/<skill-name>/SKILL.md`.
- Put current task authority in its configured task record and durable component context in its canonical record. Place historical material according to the target project's applicable record, retention, and recovery conventions; do not impose a filename, heading, or section arrangement without that authority.
- Separate timeless rationale needed to understand current architecture from dated progress, completion, or task history. Retain, relocate, or remove historical material only after assessing its consumers, recovery or audit value, authority, and replacement path.
- For a document that grows into a directory, prefer the host pattern
  `<xyz>.md` -> `<xyz>/index.md` as the entry point, then extract focused
  section files beside it and link them from the index or root entry. Keep the
  entry point authoritative and explain the relationship in a Links section.
- Put architecture, protocols, and design rationale in subject-named documents.
- Put host-specific integration instructions in a host-specific adapter or skill.
- Keep private runtime state, credentials, caches, verbose logs, and temporary
  tool output outside authoritative project knowledge.
- This skill owns the reusable procedure and decision criteria; design
  principles own broad cross-project values; component task records own
  current-task evidence and decisions; each skill or agent document owns its
  detailed contract; [`skills/as-is.md`](../as-is.md) is the concise linked
  capability catalog. The former root [`agent-skills.md`](../../agent-skills.md)
  is migration context, not a second catalog authority.

## Structure Rules

- Treat folders, files, and Markdown sections as a continuous lineage. A
  coherent document may later become a directory with the same subject name,
  with its former sections represented by focused documents. Preserve a clear
  entry point according to the host's linking conventions when making that
  replacement.
- When a document is replaced by a directory, prefer the host pattern
  `<xyz>.md` -> `<xyz>/index.md` for the entry point, and place extracted
  section files beside it under the same directory so links remain stable.
  The index or root entry should link to the extracted section files and
  explain their authority relationship.
- Group sibling components under a type directory when the group communicates a
  meaningful shared role and improves navigation or establishes a real
  boundary. For example, place related UI components in `components/` and
  services in `services/`. A directory adds a path level, a classification
  decision, and an implied coherence claim; do not incur those costs only to
  mirror a neighboring directory or because unrelated artifacts happen to be
  adjacent.
- Keep a unique artifact at its current level until it has a meaningful sibling
  group or another concrete reason for its own boundary. Matching a nearby
  `components/` directory with a one-file `services/` directory does not itself
  establish that reason.
- Keep a component's purpose explicit in its task record. `Purpose` explains why
  the component exists; `Requirement` states the bounded work currently assigned
  to it.
- Larger files are acceptable when they are the smallest coherent authoritative
  home. Split only when there is a concrete navigational or authority benefit,
  such as a clear extracted-section boundary, a new entry point, or a stronger
  ownership split.

### Creation-time grouping

- When creating the first item in a known, meaningful sibling set, create the
  type directory from the outset. Apply the same default when an established
  repository, industry, or host convention requires a semantically accurate
  type directory, even if the set is not yet populated locally. Predictable
  locations and stable paths reduce scanning, reclassification, and later
  migration.
- Before creating that directory, record evidence for the expected sibling set
  or applicable standard, the parent concept, ownership, authoritative entry
  point, and migration or replacement path. If that evidence is absent, keep the
  unique artifact at its current level and document why.
- This is a creation-time default, not an always-group rule. Do not introduce a
  type directory when it would obscure ownership or authority, cut across a
  lifecycle or component boundary, encode a speculative or generic-bucket
  boundary, or conflict with the component-task hierarchy. Preserve the
  smallest coherent boundary and the clear entry point in those cases.

### Maintenance-time restructuring

- Creation-time organization decides the initial location of a new artifact.
  Maintenance-time restructuring is a separate evaluation of existing items;
  creation-time policy is not a blanket exemption for legacy content.
- Evaluate existing items only when an explicit restructuring request or an
  evidence-based maintenance signal demonstrates a navigation or cognitive
  benefit. Before moving or reparenting anything, create a bounded maintenance
  task record naming the maintenance signal, target grouping or parent concept,
  ownership, authority, and lifecycle checks, affected consumers and references,
  authoritative entry point, migration or replacement path, acceptance
  conditions, and audit and lineage considerations.
- When those acceptance conditions justify change, apply the smallest safe
  retroactive grouping. Otherwise record why existing paths are deliberately
  retained; do not silently leave known similar items ungrouped merely because
  they predate the rule.
- A directory move changes component and task lineage. Therefore define the
  explicit scope, update affected references, preserve or replace the entry
  point, and validate the result in the maintenance record before treating the
  move as complete.
- Preserve these boundaries: do not cross component or authority boundaries;
  do not perform destructive or irreversible migration without authorization;
  do not create speculative or generic buckets; and do not cross lifecycle,
  ownership, authority, component, or component-task hierarchy boundaries.
  Retain existing paths when migration cost or risk outweighs the demonstrated
  navigation or cognitive benefit.

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

- Prefer one authoritative home for a decision or rule; do not maintain two
  sources of truth for the same current decision or task state.
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
