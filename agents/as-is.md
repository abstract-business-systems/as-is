---
as-is-version: 2
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
Maintain the durable task context and organization for independent configured agent roles.

## Requirement
Keep the agents folder's record authoritative for its bounded documentation
organization. Agent definitions are canonically maintained under top-level `agents/`;
`../.agents/agents/` is a host projection location only and must not contain
 duplicate tracked role source files. Agent roles are independent: no role is
intrinsically bound to another, and an authorized agent may delegate to any
suitable target, including the generalized worker. This record tracks
cross-agent organization decisions without duplicating role contracts.

## Plan
Add the agents-scope record, link entry points, and preserve a bounded backlog
for improving overly specific or generic existing agents.

## Progress
Created the durable agents-scope record. Existing independent role definitions
remain in place pending a separately authorized, evidence-based maintenance
assessment.

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

The organization-level planning index is [`backlog.md`](backlog.md). It owns
cross-agent maintenance proposals; role-specific work belongs in the backlog
of the corresponding agent component.

## Links
- `as-is/agent.md` — canonical primary role contract.
- `component-builder/agent.md` — canonical recursive builder role contract.
- `expert/agent.md` — canonical read-only general consultation contract.
- `evidence-validator/agent.md` — canonical read-only repository evidence validator contract.
- `worker/agent.md` — canonical bounded implementation contract; any authorized
  agent may select it when its description fits the task.
- `../.agents/agents/` — host projection only; no duplicate tracked role source is maintained.

## Next Action
Schedule the backlog assessment only as an explicitly bounded maintenance task.
