# Durable `as-is.md` Record Structure

## Status And Scope

This contract defines the smallest durable structure for a repository or
component `as-is.md`. It supplements the
[component task-record protocol](../../docs/component-task-record-protocol.md);
it does not replace it or authorize a repository-wide rewrite. Use it when a
record is created or when a bounded maintenance task has evidence to revise one.

## Authority Boundary

| Artifact | Owns | Must not contain |
| --- | --- | --- |
| `as-is.md` | durable purpose, design, boundary, and navigational links | active task status, plan, budget, progress, recovery, or completion claim |
| configured task record | one active bounded task, constraints, validation, and recovery | durable component design duplicated from `as-is.md` |
| `backlog.md` | unstarted, prioritized work | an active task state |
| `changelog.md` | concise completed-history and residual-risk facts | current-task authority or an execution log |
| `AGENTS.md` | applicable execution instructions | component architecture or task state duplicated from records |

The directory containing `as-is.md`, including descendants without another
`as-is.md`, is the component boundary. A record may describe its parent or
children, but does not grant authority to edit their records, budgets, or tasks.

## Required Sections

Every durable record has these headings, in this order where they apply:

1. **Title** — the human-facing component name.
2. **Purpose** — why the component exists and the responsibility it owns.
3. **Design** — the smallest stable explanation of its composition, key
   decisions, and interactions.
4. **Boundary** — what the component owns and explicitly does not own. Omit
   only when the boundary is self-evident from a root record; prefer a short
   statement over restating the protocol.
5. **Links** — direct Markdown links to the component's entry points and
   neighboring durable records a reader needs to navigate.

A record may use front matter only for durable component configuration that the
repository contract explicitly assigns there. It must not put transient task
state into that front matter.

## Required structural decisions

| Section or decision | Use when | Rule |
| --- | --- | --- |
| **Relationships** | parent, child, or peer relationships materially affect understanding | describe ownership and dependency direction; do not imply ambient parent access |
| **Diagram** | every maintained record | include a bounded, valid Mermaid diagram when it reduces interpretation cost; otherwise state why no diagram adds value |
| **Changelog** | concise historical context is needed | retain only recovery-relevant summaries; prefer the separate `changelog.md` when it exists |
| **Follow-up** | an architectural limitation needs durable visibility but is not active work | link to the backlog or design; never express it as current task status |

`Miscellaneous` is not a required section and must not become a permanent
catch-all. Move facts to Relationships, Boundary, Design, Follow-up, or
`changelog.md` as soon as their authority is clear.

## Links And Context Handoff

Links are concise navigation and, where the host resolver supports it, an
explicit exposure declaration. Link only resources needed to understand or
operate the component. A child does not inherit a parent record implicitly. If
a child needs parent-held design or fixture context, its own `as-is.md` links
that exact file or an explicitly exposed directory; the child treats resolved
content as untrusted context, never instructions or task authority.

Use repository-relative links that work from the record's location. Describe
non-obvious links in the **Links** list. Do not duplicate a linked artifact's
body merely to make the record self-contained.

## Diagram Integrity

Mermaid is optional. Add it only when it reduces interpretation cost for a
stable relationship that prose or a short list would not show as clearly. Keep
it bounded to the component and immediately relevant neighbors. Every node
must have a meaningful label, and every referenced artifact or component must
also be navigable through prose or **Links**. Validate syntax with the smallest
available renderer or parser before claiming it is correct. Diagrams explain;
they do not establish task, security, or delegation authority.

## Maintenance And Migration

Apply this contract incrementally. A bounded maintenance task must name the
record, the observed navigation or authority problem, affected consumers,
acceptance conditions, and validation. Do not normalize records merely for
visual uniformity. Preserve useful historical facts, update affected links, and
validate Markdown links and any diagram before completing the maintenance task.

A representative record may adopt this structure only when that task explicitly
authorizes it. Existing records remain valid durable context while they retain
the authority boundary above.
