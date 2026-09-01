# Durable `as-is.md` Record Structure — historical companion

## Status And Scope

This file retains the earlier planning context for durable `as-is.md` records. The current operational authority is [`managing-as-is-records`](../../skills/master/managing-as-is-records/SKILL.md); this file does not define a parallel record contract or authorize a repository-wide rewrite.

## Superseded Decisions

- The directory containing `as-is.md` supplies the default component boundary; a separate `## Boundary` heading is not mandatory. Record material ownership or authority distinctions in `Design` or `Relationships` only when doing so improves clarity.
- Durable `as-is.md` records own stable component purpose, design, relationships, diagrams, and navigation. They do not own active task status, plan, budget, progress, recovery, or completion claims.
- The local `task` object in `as-is.json` and the configured Markdown task narrative form the transient task-authority pair. The task-record protocol owns their metadata, lifecycle, recovery, and completion rules.
- Backlogs own unstarted proposals, and changelogs own concise completed history. Neither is a component architecture record or active task authority.

## Historical Context

Earlier drafts explored explicit `Boundary`, `Miscellaneous`, optional diagram, and embedded task-record sections. Those alternatives were not adopted as repository-wide requirements. Their useful facts are retained above; current record creation and maintenance must follow the managing skill, applicable repository instructions, and the task-record protocol.

## Authority And Recovery

This historical companion is not linked as the current record-management procedure. Its retained rationale remains recoverable through this file and Git history; current readers should follow the linked managing skill and its owner-specific changelog rather than infer requirements from this document.
