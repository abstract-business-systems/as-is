# Skills Backlog

This is the planning index for the `skills/` component, not task authority.
Active work belongs to the owning component's configured task record (default
`tasks.md`); completed items are
removed after their concise summary is recorded in the owning `changelog.md`.

## Items

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| deterministic-skills | open | 3 | 3 | Introduce evidence-based determinism where appropriate in LLM workflows | Inspect existing implementations and, when available, traces or other execution evidence to identify repeatable, bounded flows that can be made more deterministic. Add correctly owned backlog items, or bounded tasks when explicitly requested, while preserving generative judgment where it is valuable. | - | The skill has a bounded procedure for inspecting implementations and optional traces, distinguishing deterministic candidates from intentional model judgment, selecting the correct component owner, and recording backlog items or authorized tasks with acceptance and residual risk; focused procedure validation passes and no behavior is changed without explicit authorization. | Reframed per user direction: this is a reusable skill for introducing determinism, not a one-time migration proposal. |
| presentation-guidance | open | 2 | 1 | Specify reusable information-shaped presentation guidance | Specify information-shaped Markdown and live-response presentation guidance for reusable skills, leaving role-specific presentation decisions with their owning agent contracts. | - | Guidance is declarative, discoverable from the owning skill, and distinguishes reusable representation rules from agent-role behavior; focused documentation validation passes. | Original dependency text: Review of `skills/structuring-content/` and applicable design principles. |
| context-building-canonical-name | open | 3 | 2 | Retain context-building as the canonical skill name | Retain context-building as the canonical skill name and link it from the concise capability catalog. | - | Canonical naming and catalog links are validated without introducing duplicate skill authority. | Original dependency text: Current skill record and capability catalog. |
| maintaining-components-audit | open | 2 | 1 | Audit a bounded component for confirmed structural misalignments | Audit a user-specified component, or the full component set if later directed, for misalignments against repository-prescribed structure and conventions, and fix confirmed misalignments. | - | Confirmed misalignments are fixed with focused validation; no unapproved broad audit or unrelated cleanup is performed. | Original dependency text: Explicitly bounded component scope and applicable repository conventions. |
| building-components-consolidation | open | 3 | 2 | Explore combining component maintenance and task implementation into `building-components` | Evaluate whether `maintaining-components` and `implementing-component-tasks` should be combined into the existing `building-components` skill, preserving clear ownership for maintenance assessment, task lifecycle, validation, delegation, recovery, and completion. Compare current contracts, identify what should be merged or remain separate, and propose the smallest safe migration without implementing it as part of this exploration item. | - | A bounded comparison records the rationale, alternatives, retained boundaries, naming decision, migration risks, affected links and consumers, and a recommendation on whether and how to consolidate; no authority or skill implementation changes occur without a separately authorized task. | User-requested exploration. The proposed canonical name is `building-components`; existing `skills/building-components/SKILL.md` is evidence to assess, not authorization to rewrite the other skills. |
| align-skill-directories-with-frontmatter-names | open | 3 | 2 | Align skill component directories with their canonical SKILL.md names | Rename `skills/as-is/` to `skills/managing-as-is-document/` and `skills/functional-context-diagrams/` to `skills/mermaid-diagram-design/`, preserving component ownership, scripts, history, and durable records while updating all repository-relative links, catalogs, tests, dependencies, and applicable references. Audit consumers before the move and verify that each renamed directory contains the same skill whose YAML frontmatter `name` is the directory name. | - | Both directories match their `SKILL.md` frontmatter names; all repository references and links resolve; existing scripts and tests continue to work from the new paths; component records and backlog/changelog ownership remain coherent; focused repository validation and `git diff --check` pass; no unrelated content is changed. | User requested explicit naming alignment after the two skill implementations. This is a repository-level coordination item because it changes two child component paths. Preserve Git history where possible, inspect tracked/untracked/ignored contents and consumers before any move, and do not implement until selected. |

## Prioritization

High items address authority, delegation, or recovery correctness; the Medium
item improves explicit user-facing guidance without blocking control-plane work.

## Ownership And Boundaries

These entries are skills-component planning proposals only. They are not active
tasks and do not authorize implementation. Work crossing into a child component
with its own `as-is.md` requires delegation to that component's configured
worker. Root backlog policy remains authoritative for repository-wide planning.
