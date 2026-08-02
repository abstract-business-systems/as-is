---
as-is-version: 2
constraints:
  cost:
    currency: USD
    allocated: 0.10
    spent: 0.00
    reserve: 0.02
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
      spent-seconds: 0
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add the correctly named high-priority context-building skill and durable record.
  - Keep the procedure concise and documentation-only.
---

# Context Building

## Purpose
Provide reusable context assembly for bounded decisions and handoffs.

## Requirement
Create `skills/context-building/SKILL.md` with a minimal input/output,
procedure, validation, and escalation contract. The canonical spelling is `context-building`; do not introduce a misspelled
variant.

## Plan
Add the skill and record its backlog origin and authority relationship.

## Progress
Added the correctly named skill with a five-step procedure and explicit
contract. No runtime behavior changed and no descendants were delegated.

## Validation
Confirmed the canonical skill name and front matter, documentation-only scope,
and `git diff --check` as the required final check.

## Result
Completed; the reusable context-building procedure is available at the skill
entry point.

## Blockers And Escalations
None. Residual risk: repository-wide catalog links still require root
integration validation.

## Recovery
Resume from this record and `SKILL.md`; do not create an archive or duplicate
source of truth.

## Links
- `SKILL.md` — authoritative procedure and contract.
- `backlog.md` — planning index for this skill's open work.
- `../../agent-skills.md` — concise capability catalog entry.

## Next Action
Root integration should validate catalog and cross-document links.
