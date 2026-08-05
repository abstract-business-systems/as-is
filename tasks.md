---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-08-03T16:30:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.25
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds
  delegation:
    maximum-depth: 1
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 30
      source: host-observed
  external-effects: prohibited
acceptance:
  - Update relevant AGENTS.md guidance and root as-is.md with the authority/composition model: agents utilize skills; skills never call agents; subagents support flows beyond jobs.
  - Add root planning-only backlog entries and retain the root backlog as a planning index, not task authority.
  - Create a phased root migration orchestration record covering inventory/contract mapping, root orchestration skill extraction, building-components skill extraction, generalized subagent runtime flows, composition/authority validation, and documentation/reconciliation.
  - Record explicit dependencies, acceptance signals, and next action for every phase; tasks.md remains the sole current root task authority.
  - Make no new skills, prompt extraction, runtime changes, or backlog-item implementation.
  - Validate changed documentation and commit one clean scoped handoff.
---
# Task

## Requirement
Create durable planning artifacts for the approved skills/agents separation proposal. Documentation and planning only; do not implement migration work.

## Plan
A component-builder will update the root component boundary only, using the existing design documents and repository contracts. The result must distinguish agent authority from reusable skill composition and describe generalized subagent flows without changing runtime behavior.

| Phase | Bounded outcome | Dependencies | Acceptance signal |
| --- | --- | --- | --- |
| 1. Inventory and contract map | Inventory canonical skills, agent roles, host projections, and current authority/composition contracts; identify contradictions and migration boundaries. | Existing `agent-skills.md`, `AGENTS.md`, role prompts, design specs, and component records. | A reviewed map names each source of authority, each consumer, and unresolved compatibility risk. |
| 2. Root orchestration skill extraction | Define the proposed extraction boundary for root orchestration flow, inputs, outputs, authority, and validation without creating or editing a skill. | Phase 1 map; root `as-is.md`; task-record protocol. | Plan names the future skill boundary and proves agent-only launch/approval authority is preserved. |
| 3. Building-components skill extraction | Define the proposed reusable building-components procedure and its component boundary without implementation or prompt extraction. | Phase 1 map; Phase 2 composition contract; component-builder role contract. | Plan maps procedure, inputs, handoffs, and acceptance checks to the future skill while keeping role authority explicit. |
| 4. Generalized subagent runtime flows | Specify implementation, research, review, planning, and recovery flow variants, lifecycle handles, observation, budgets, and failure recovery; do not change runtime. | Phases 1–3; independent delegation and execution contracts. | Each flow has launch authority, durable record authority, terminal evidence, budget ownership, and recovery behavior. |
| 5. Composition and authority validation | Define static/documentation checks and focused runtime-test requirements for “agents utilize skills; skills never call agents” and generalized subagent use. | Phases 1–4; validator and existing launcher evidence. | Checks reject skill-to-agent authority inversion and accept approved agent-to-skill composition across supported flows. |
| 6. Documentation and reconciliation | Enumerate affected AGENTS.md, root/component records, designs, adapter docs, backlogs, and changelogs; define terminology and contradiction cleanup. | Phases 1–5 and migration approval. | Reconciliation matrix has owner, dependency, acceptance evidence, and explicit non-goals; no implementation is implied by this plan. |

## Progress
Attempt 1 authorized and active. Delegation is required because the request spans multiple authoritative documents and requires synthesis beyond the direct-path budget. No child implementation descendants are authorized; the assigned component-builder owns the bounded root documentation/planning handoff.

## Validation
Documentation-only review completed: the phase table names all six requested migration concerns with dependencies and acceptance signals; the authority model is present in root and applicable AGENTS.md guidance; backlog entries are explicitly planning/deferred; and no new skill, prompt extraction, runtime, or implementation artifact was added. `git diff --check` passed. Changed set is limited to root `AGENTS.md`, `.agents/AGENTS.md`, `skills/AGENTS.md`, root `as-is.md`, root `backlog.md`, and root `tasks.md`.

## Result
Planning handoff complete. Migration remains unimplemented and unauthorized by this record; the root backlog is an index only, while this `tasks.md` is the current root orchestration authority.

## Blockers And Escalations
No blocker. External effects and migration implementation were prohibited and were not performed.

## Recovery
If interrupted, preserve the current root `tasks.md` and inspect the worktree diff. Resume only with the same component-builder authority and scope; do not create migration skills or runtime changes.

## Next Action
Obtain approval for the deferred migration item before opening implementation tasks. Start with Phase 1 inventory/contract mapping; do not create skills, extract prompts, or alter runtime until the phase dependencies and acceptance evidence are approved.
