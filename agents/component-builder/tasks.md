---
as-is-version: 2
task:
  status: blocked
  worker: component-builder
  revision: in-process-authority-alignment-2026-08-08-r1
  updated: 2026-08-08T00:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 2.70
    spent: 0.00
    reserve: 0.20
    source: host-reported
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 2400
      spent-seconds: 0
      reserve-seconds: 0
      source: host-enforced
    minimum-seconds:
      implementation: 600
      expert-plan: 600
      expert-final: 600
      handoff-integration: 600
  external-effects: require-current-turn-user-approval
acceptance:
  - Update only the component-builder contract and its local durable history needed to express the intended authority model.
  - Same-component implementation, expert advice, and final validation use in-process call_subagent; no subprocess worker or expert calls are used.
  - spawning-pi-subagents is reserved for separately owned component boundaries and configured component-builder children.
  - Obtain and record attributable in-process expert plan evidence before edits and fresh expert final-diff evidence after edits; each gate has a minimum 600-second allocation.
  - Run focused validation, record residual risk and host-observed wall-clock use, clean the task record only after completion, and commit the scoped handoff.
---
# Task

## Requirement
Align the `agents/component-builder` contract with the repository's intended authority model. The builder owns semantic completion within this component; it must use the in-process `call_subagent` extension for same-component implementation assistance and for expert plan/advice/final validation, while using `spawning-pi-subagents` only when a task crosses into a separately owned component boundary. Do not implement Phase 2a, migration phases, or launcher behavior.

## Plan
Inspect the local role contract and the in-process worker extension contract. Obtain an attributable read-only expert plan through `call_subagent` before editing. Make the smallest contract/documentation change within this component, validate it, then obtain a fresh attributable expert final-diff review through `call_subagent`. Record both gates and commit only after they pass.

## Progress
The sole authorized attempt stopped before implementation because the active delegated Pi process did not expose the required in-process `call_subagent` extension/tool. No implementation edits were made and no descendant implementation is permitted.

## Validation
Blocked before validation. No contract or Phase 2a/migration files changed. Required in-process expert plan/final gates were unavailable and cannot support a commit.

## Result
Blocked: authority-alignment was not implemented and no child commit exists.

## Blockers And Escalations
Durable blocker: `call_subagent` was unavailable in the active delegated Pi extension/tool path. The attempt returned without implementation, expert-plan/final evidence, or a commit. Do not substitute subprocess workers, spawning-pi-subagents, or another expert path; do not retry this revision.

## Recovery
Caller-verifiable checkpoint: no scoped files changed and no child commit was produced. Recovery requires a new revision and authorization after the in-process extension is available, with 600-second minimum implementation, expert-plan, expert-final, and handoff/integration gates.

## Next Action
Provide the required in-process `call_subagent` extension/tool, then authorize a new task revision. Do not start Phase 2a or migration work.
