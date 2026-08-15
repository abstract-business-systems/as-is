# Task

## Requirement
Complete the selected `skills:migrate-as-is-guidance-owners` planning task by recording a single discoverable ownership map for as-is setup/adoption, individual as-is record management, and generic Mermaid representation. Reconcile current skill contracts and links only where required to make ownership explicit. Preserve existing procedures, component boundaries, task authority, host-neutral semantics, and root design-document authority. Do not retire root documents, perform broad document dissolution, or change runtime behavior.

## Plan
1. Review the selected backlog item, current setup/integration, managing-as-is-document, designing-mermaid-diagrams, structuring, naming, and root design records; classify facts, current owners, unresolved items, and evidence.
2. Add the smallest durable ownership map in the skills architecture record/catalog, with links to authoritative procedures and explicit unresolved follow-ups where routing or root-document disposition is not yet complete.
3. Validate content/navigation, backlog, task-record, JSON, link, and whitespace contracts; obtain read-only expert review.
4. Record completion evidence, commit the scoped documentation handoff, reconcile exact identity `skills:migrate-as-is-guidance-owners`, remove transient task artifacts, and pause.

## Scope
In scope: `skills/as-is.md`, `skills/backlog.md`, `skills/changelog.md`, `skills/as-is.json`, and `skills/tasks.md`; read-only context includes `skills/as-is-setup/`, `skills/integrate-as-is-documentation/`, `skills/managing-as-is-document/`, `skills/designing-mermaid-diagrams/`, `skills/structuring-content/`, `skills/naming-software-concepts/`, `AGENTS.md`, `designs/as-is.md`, `designs/skills-agents-separation-plan.md`, and related root backlog/design records. Out of scope: broad rewrites of child procedures, runtime/source/tool changes, root document retirement, root backlog reconciliation, and descendants.

## Acceptance
- A durable `skills/as-is.md` ownership map identifies setup/adoption (`as-is-setup` and `integrate-as-is-documentation`), as-is-specific record structure/meaning (`managing-as-is-document`), and generic Mermaid mechanics (`designing-mermaid-diagrams`) with direct authoritative links.
- The map distinguishes current owners from unresolved work; it does not duplicate procedures or claim that root `AGENTS.md` temporary guidance or root design-document dissolution is complete.
- Existing skill contracts and navigation remain consistent; no runtime or authority behavior changes.
- Content/navigation, backlog, task-record, JSON, link, and whitespace checks pass; final expert review approves the scoped handoff; no descendants are authorized.
- Exact `skills:migrate-as-is-guidance-owners` completion evidence is recorded and only that backlog row is reconciled.

## Progress
Started from clean committed baseline `3bf53c6`. The selected row is open. Added a single durable ownership map to `skills/as-is.md`: setup/adoption is split between `as-is-setup` and `integrate-as-is-documentation`; as-is-specific record structure and meaning belong to `managing-as-is-document`; generic Mermaid mechanics belong to `designing-mermaid-diagrams`; and root instruction/document disposition remains explicitly unresolved root-owned work. Existing procedures and authority were not changed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and a focused ownership-map audit confirmed direct links for all three skill owners plus explicit unresolved root follow-ups. Final read-only expert review completed: safe to commit; no blocker.

## Result
The durable Skills ownership map satisfies the selected acceptance and preserves unresolved root-owned follow-ups. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. Preserve root-owned `as-is-guidance` and `dissolve-documents-into-as-is-records` as unresolved follow-ups; do not claim their completion from this skills-level map.

## Recovery
If current owners conflict, record the conflict and leave the selected item active. If validation fails, restore only this task's scoped skills documentation; do not modify child procedures or root-owned documents.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:migrate-as-is-guidance-owners`, remove transient task artifacts, and pause.
