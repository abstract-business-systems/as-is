---
name: integrate-as-is-documentation
description: Adopts as-is documentation in an existing project through reviewable component identification and bounded record creation.
---

# Integrating As-Is Documentation

Use this skill when an existing project needs the `as-is` documentation convention integrated into its current structure. It composes [`as-is-setup`](../as-is-setup/SKILL.md) for scope and setup and [`managing-as-is-document`](../managing-as-is-document/SKILL.md) for individual durable records. It is an adoption and decomposition procedure, not a replacement for either skill and not a task, backlog, configuration, or runtime authority.

## Inputs

- An existing project root or an explicitly bounded directory.
- The applicable target-local instructions and architecture or documentation conventions.
- A human-approved or reviewable request to introduce or extend `as-is` records.
- Any existing root, parent, sibling, or child `as-is.md` records relevant to the proposed decomposition.

## Scope modes

Use whole-project mode when no directory is supplied. Discover the project root from the request and inspect the root and relevant descendants within that project. Use directory-scoped mode when a directory is supplied. Treat that directory as an independent setup root and inspect or modify only it and descendants within it. Do not require, discover, or modify an enclosing project root, its instruction file, or sibling directories in directory-scoped mode.

The effective boundary is the selected target and its relevant descendants. The target root record is `<target>/as-is.md`; the applicable instruction owner is the target's `AGENTS.md` or established target-local equivalent. If no target-local instruction exists, propose creating one inside the selected boundary rather than consulting an enclosing instruction file.

## Candidate identification

Do not convert every directory, file, class, module, or test fixture into a component. Identify a candidate only when semantic evidence shows one or more of the following:

- A distinct responsibility or capability that readers need to understand independently.
- A stable ownership, authority, security, lifecycle, failure, or recovery boundary.
- A consequential relationship with another area that benefits from explicit navigation.
- Enough independent change, testing, deployment, operational, or domain complexity to justify progressive disclosure.
- A meaningful retained validation or dogfood boundary whose evidence would otherwise be difficult to find.

Directory names, file counts, implementation language, and adjacency are discovery clues only; they are not sufficient evidence. Prefer the narrowest responsibility-bearing name that follows the target's lowercase kebab-case repository grammar and established sibling vocabulary. Explain any semantic departure from local names.

For each candidate, record a reviewable disposition containing its proposed name and path, responsibility evidence, ownership or authority boundary, meaningful relationships, complexity or lifecycle evidence, confidence, unresolved assumptions, and whether it should be accepted, merged, renamed, rejected, or deferred.

## Reviewable setup plan

Before any write, produce a dry-run plan containing:

1. The selected mode and target path.
2. The effective read/write boundary.
3. The applicable instruction path and whether it will be retained, updated, or proposed.
4. The root `as-is.md` path and whether it exists, will be created, or will be preserved.
5. Every candidate path, evidence summary, confidence, assumptions, and proposed disposition.
6. The exact planned writes, including parent maps, approved child records, and the canonical-use instruction.
7. A pre-render layout plan for every planned diagram: available render-surface constraint, intended shape, visible-node/edge/label density budget, grouping and routing direction, and any supported exception or residual risk.
8. Explicitly excluded paths, including enclosing roots, siblings, runtime state, generated artifacts, and rejected candidates.

Human confirmation is required before accepting the decomposition or creating records. The human may accept, merge, rename, reject, or defer each candidate. A recommendation or backlog row is not confirmation and does not authorize a write.

## Record creation and navigation

After confirmation, update or create only the approved records inside the effective boundary. Use the strict title form `# <component-name> - as-is`. Route each individual record through `managing-as-is-document` and keep purpose, design, relationships, boundaries, and links in the durable record. A `## Links` section adds only distinct working context absent from the root-to-current breadcrumb or required Markdown fallback for a diagram-linked target; the Components table is the sole immediate-child catalog and intentionally accompanies linked structural child boxes rather than creating a separate Links entry. Do not catalog ordinary direct-child contracts in Links unless an artifact adds distinct parent-level operational or normative context. Source and test files remain omitted unless they meet the managing skill's reader-facing or indispensable-behavior exception. Keep active task state, acceptance evidence, budget, and recovery in the configured task record; follow the target project's applicable history-placement convention for completion or task history.

Every record has at least one reader-oriented Mermaid diagram. A parent record lists only immediate children that have their own `as-is.md`; its `Components` table links to each child's `as-is.md#design`, while its `Design` begins with a bounded box-oriented container diagram using the actual parent name as the container title and child boxes that link to the same targets using host-supported syntax. The Components table is the required Markdown fallback if a renderer suppresses diagram navigation. A non-parent record uses the smallest supported view of its own responsibility, interaction, boundary, lifecycle, or outcome. Introduce each Mermaid fence with a descriptive `### <diagram name>` heading, not a literal `### Relevant diagrams` heading or a separate caption line. Do not add a synthetic parent node, a `contains` edge, or a one-node placeholder. Use balanced child placement and explicit labeled arrows only for supported sibling or dependency relationships. Before rendering, retain the planned diagram's available render-surface constraint, intended shape, visible-node/edge/label density budget, grouping and routing direction, and any supported exception or residual risk in the reviewable plan or nearby Design prose. Prefer a taller, narrower ELK/TB flowchart when that improves readability; the Components table and nearby Markdown links remain authoritative navigation in every renderer.

Immediately above the first diagram, add one resolving trimmed root-to-current breadcrumb: link each documented ancestor from the selected setup root through the immediate parent in order, omit filesystem levels without a canonical record, and end with the current component title in bold. A setup-root record uses only its bold current title and never a self-link. Use the smallest suitable non-parent view; a structural container view is not a flow. Use a key or complex flow view for consequential decisions, failures, retries, cancellation, recovery, authority changes, or outcomes; leave routine standard behavior under its abstraction and record the omission rationale when the distinction matters. Do not invent relationships to fill a diagram.

Add the canonical architecture instruction exactly once to the applicable target-local instruction file, without replacing existing guidance:

`- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.`

## Outputs

- A reviewable setup plan with the selected mode, target, effective boundary,
  instruction and root-record dispositions, candidate evidence, planned writes,
  one pre-render layout plan per planned diagram, and excluded paths.
- Approved records and required target-local instruction updates only after
  human confirmation and only within the effective boundary.

## Validation

Validate the selected plan and resulting records with the smallest relevant deterministic checks:

- Every created title uses `# <component-name> - as-is`.
- Components tables list immediate approved children only and link to resolving `as-is.md#design` anchors.
- Every record has a named diagram subsection and no literal `### Relevant diagrams`, empty diagram subsection, or placeholder diagram.
- Parent diagrams use nested containment, resolving linked child-box targets with matching Components-table Markdown fallback, balanced child boxes, supported labeled relationships, and no synthetic parent node or containment edge.
- Every record has one resolving trimmed root-to-current breadcrumb before its first diagram or remaining Design content.
- Record placement distinguishes current architecture context, active task authority, and historical material according to the target project's applicable conventions.
- Each `## Links` section contains only distinct working context not already navigable through Components, the breadcrumb, or required Markdown diagram fallback; it does not catalog ordinary direct-child contracts, and any source or test target meets the explicit exception.
- Each planned diagram has a pre-render layout plan covering render-surface constraint, intended shape, density budget, grouping and routing direction, and any supported exception or residual risk; it does not invent numeric dimensions without host authority.
- Applicable flowcharts prefer a taller, narrower ELK/TB layout.
- Markdown links, Mermaid syntax and configured layout support where available, canonical instruction uniqueness, and `git diff --check` pass.
- A before/after path comparison proves that all writes remain inside the effective boundary; directory-scoped mode also proves enclosing and sibling paths are unchanged.

Record assumptions, omitted standard-flow detail, renderer limitations, and residual risk. Do not infer architectural truth from syntax validation alone.

## Boundaries and recovery

This skill may propose or orchestrate record creation but does not select, authorize, start, delegate, observe, recover, or cancel agents. An authority-bearing agent or orchestrator owns those decisions. A child component owns only its own files and task record; parent maps and parent-level policy remain with the parent. If a candidate boundary, name, instruction owner, existing record, or relationship is materially ambiguous, stop before writing and request human disposition.

If setup is interrupted, recover from the reviewable plan, current Git state, and durable records. Preserve uncommitted necessary facts before removal because Git history does not preserve them. Resume only after rereading the target record and confirming the approved scope; do not recreate records from directory mechanics or infer completion from process exit.

## Links

- [`../as-is-setup/SKILL.md`](../as-is-setup/SKILL.md) — project and directory-scoped setup.
- [`../managing-as-is-document/SKILL.md`](../managing-as-is-document/SKILL.md) — individual record lifecycle and as-is-specific structure.
- [`../designing-mermaid-diagrams/SKILL.md`](../designing-mermaid-diagrams/SKILL.md) — reusable Mermaid representation mechanics.
- [`../naming-software-concepts/SKILL.md`](../naming-software-concepts/SKILL.md) — semantic naming procedure.
- [`../../AGENTS.md`](../../AGENTS.md) — repository guardrails.
