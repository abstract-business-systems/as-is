---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-30T16:30:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 180
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Maintain durable skills-scope task context and links.
  - Record skill catalog and entry-point authority rules.
---

# Skills

## Purpose
Maintain the durable organization and authority context for reusable skills.

## Requirement
Skill procedures live in `skills/<name>/SKILL.md`; their component records
live beside them. This scope record links the catalog and notable entry points
without duplicating skill contracts. Backlog prioritization is defined by
`managing-backlog`; task implementation and lifecycle are defined by
`implementing-component-tasks`.

## Plan
Add the skills-scope record and make the canonical context-building skill
discoverable.

## Progress
Created this durable record and added the context-building skill component.

## Validation
Root integration should validate task-record structure, links, naming, and
`git diff --check`. No runtime behavior is changed.

## Result
Completed the skills-scope documentation record and authority rule.

## Blockers And Escalations
None. Skill changes require their own bounded component record.

## Recovery
Resume from this record and the named skill component; do not duplicate
procedures in the catalog.

## Links
- `../agent-skills.md` — concise capability catalog.
- `context-building/SKILL.md` — high-priority context-building contract.
- `structuring-content/SKILL.md` — reusable organization procedure.
- `verification-discipline/SKILL.md` — validation selection procedure.
- `managing-backlog/SKILL.md` — backlog capture and prioritization.
- `implementing-component-tasks/SKILL.md` — transient task implementation and lifecycle.

## Next Action
Keep catalog entries concise and link detailed procedures from their owning
skill documents.
