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
  - Maintain durable agents-scope task context and links.
  - Record the generic-agent specialization backlog rule.
---

# Agents

## Purpose
Maintain the durable task context and organization for configured agent roles.

## Requirement
Keep the agents folder's record authoritative for its bounded documentation
organization. Agent definitions remain in their role directories; this record
tracks cross-agent organization decisions without duplicating role contracts.

## Plan
Add the agents-scope record, link entry points, and preserve a bounded backlog
for improving overly specific or generic existing agents.

## Progress
Created the durable agents-scope record. Existing role definitions remain in
place pending a separately authorized, evidence-based maintenance assessment.

## Validation
Root integration should validate record structure, links, naming, and
`git diff --check`. No runtime behavior is changed.

## Result
Completed the agents-scope documentation record and future maintenance rule.

## Blockers And Escalations
None. Agent role changes require their own bounded component record and should
not be inferred from this catalog-level backlog.

## Recovery
Resume from this record and the relevant role directory. Do not create an
archive or duplicate role authority.

## Backlog
- **High priority:** assess existing agents and make them less specific or more
  generic where evidence shows their responsibility is unnecessarily narrow or
  host-specific. Future agents must use a bounded responsibility, reusable
  capability contract, and only the specialization justified by ownership,
  tools, permissions, and acceptance needs; record exceptions and consumers.

## Links
- `agents/as-is/agent.md` — primary role contract.
- `agents/component-builder/agent.md` — recursive builder role contract.
- `agents/as-is/as-is.md` — primary role task record.
- `agents/component-builder/as-is.md` — builder task record.

## Next Action
Schedule the backlog assessment only as an explicitly bounded maintenance task.
