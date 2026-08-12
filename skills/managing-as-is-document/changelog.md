# Changelog

- 2026-08-12: Corrected the first-diagram parent-navigation update by removing redundant `Open ... design` and `Parent navigation` links from the affected records. The single `Parent:` link remains immediately before each first Mermaid fence; duplicate-link and target checks passed.

- 2026-08-23: Moved each affected component-to-parent `Parent:` link to the top of its first diagram view, immediately before the Mermaid fence, and made that placement an explicit record-maintenance invariant. Audited all repository `as-is.md` records with diagrams; link-target and whitespace checks passed. Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-22: Updated record maintenance to inspect parent and sibling records
  as the primary naming evidence, aligning new labels with established local
  vocabulary unless a documented semantic departure is needed. Removed the
  direct naming-skill dependency from this as-is procedure.

- 2026-08-22: Added resolving nearby `Parent:` navigation to every checked
  `as-is.md` Design section, including component and validation-fixture records;
  the root uses a self-link to its own Design anchor. The record-management
  checks now require this invariant. Parent-link validation passed.

- 2026-08-22: Defined strict `# <component-name> - as-is` titles, parent-only
  balanced container diagrams, explicit sibling relationship arrows, nearby
  parent navigation, and the canonical as-is architecture conventions. Added a
  reviewable container-diagram example and separated generic Mermaid mechanics
  from as-is-specific record rules. `git diff --check` passed; Mermaid rendering
  remains untested because no repository renderer is configured.

- 2026-08-22: Completed backlog item `add-parent-navigation-to-component-diagrams`. Added bounded child-to-parent Markdown and Mermaid navigation for documented agent and skill records, targeting each parent `as-is.md#design`; preserved prose/table fallback navigation and omitted unavailable parent contexts. Focused parent-link checks and `git diff --check` passed; Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-20: Completed backlog item `separate-as-is-design-guidance-from-mermaid-mechanics`. Assigned as-is-specific diagram meaning to this skill and reusable Mermaid, functional-context, clear-label, readability, and technical-boundary rules to `designing-mermaid-diagrams`; updated composition guidance without changing runtime behavior. Focused content/link checks and `git diff --check` passed.

- 2026-08-20: Completed backlog item `as-is-diagram-communication-guidance`. Defined when an `as-is.md` diagram is useful and required reader-oriented coverage of purpose, actors, subcomponents, responsibilities, relationships, interactions, boundaries, authority changes, consequential paths, and outcomes. Kept Mermaid type selection with the generic diagram-design skill and added explicit syntax, link, assumption, and omitted-detail validation. Focused documentation checks and `git diff --check` passed; no runtime behavior changed.

- 2026-08-20: Completed backlog item `establish-skill-and-component-records`. Added the discoverable `managing-as-is-document` skill and durable component record, linked the existing orientation scripts without transferring authority, documented Mermaid diagram composition, and updated the skills catalogs. Focused documentation checks and `git diff --check` passed; no runtime behavior changed.
