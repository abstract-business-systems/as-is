# Task

## Requirement
Reconcile the selected `skills:route-as-is-updates-through-managing-skill` backlog item. Make the applicable agent and skill guidance explicitly route all `as-is.md` content, link, structure, and Mermaid-diagram record changes through `managing-as-is-document`, while preserving component ownership and the distinction between as-is record meaning and generic Mermaid mechanics. This is documentation guidance only: no existing as-is records, runtime behavior, agent authority, or implementation changes are authorized.

## Plan
1. Review the selected backlog item, Skills catalog ownership map, managing-as-is-document and designing-mermaid-diagrams contracts, applicable agent/skill instructions, and current as-is record-maintenance consumers.
2. Identify any current guidance that fails to make managing-as-is-document the entry point; apply the smallest scoped instruction changes without editing existing records or duplicating Mermaid mechanics.
3. Validate content/navigation, backlog, task-record, JSON, focused routing audit, and whitespace checks; obtain final read-only review.
4. Record completion evidence, commit the scoped documentation/task handoff, reconcile exact identity `skills:route-as-is-updates-through-managing-skill`, remove transient task artifacts, and pause.

## Scope
In scope: applicable guidance files under `skills/` and `agents/` needed to route as-is updates, `skills/as-is.md` if navigation wording requires it, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md`. Read-only context includes all existing as-is-management, Mermaid, setup/integration, role, and repository instruction records. Out of scope: edits to existing `as-is.md` records, implementation/runtime/tools/modules, root documents, host setup, and descendants.

## Acceptance
- Applicable guidance explicitly states that all `as-is.md` content, links, structure, and Mermaid diagram updates route through `managing-as-is-document`.
- Guidance identifies `designing-mermaid-diagrams` as the composed owner of reusable Mermaid mechanics without transferring record meaning, component ownership, or task authority.
- Existing component ownership and agent/skill boundaries remain consistent; no existing as-is record or runtime behavior changes.
- Content/navigation, backlog, task-record, JSON, focused routing, and whitespace checks pass; final expert review approves the handoff; no descendants are authorized.
- Exact `skills:route-as-is-updates-through-managing-skill` completion evidence is recorded and only that backlog row is reconciled.

## Progress
Started from clean committed baseline `e82a283`. The selected row is open. Current ownership mapping identifies `managing-as-is-document` as record-specific owner and `designing-mermaid-diagrams` as generic mechanics owner. Added one scoped `skills/AGENTS.md` instruction routing all `as-is.md` record changes through `managing-as-is-document` and limiting Mermaid composition to generic mechanics; no existing records or implementation changed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and the focused routing audit confirmed the exact managing-as-is entry point, all record-change categories, generic Mermaid composition, and retained ownership/authority boundaries. Final read-only expert review completed: safe to commit; no blocker.

## Result
The routing guidance now makes `managing-as-is-document` the entry point for all as-is record changes and preserves generic Mermaid composition boundaries. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Do not edit existing records or infer that every agent should carry a copied routing paragraph; prefer one reusable routing statement in the nearest skills guidance owner plus direct local references where needed.

## Recovery
If guidance ownership is ambiguous, leave the item active and record the missing owner. If validation fails, restore only this task's scoped instruction changes; preserve all existing records and implementation behavior.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:route-as-is-updates-through-managing-skill`, remove transient task artifacts, and pause.
