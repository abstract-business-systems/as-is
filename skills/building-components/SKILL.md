---
name: building-components
description: Builds one bounded component and produces a validated, scoped durable handoff while preserving agent authority and task-record ownership.
---

# Building Components

Use this procedure when an agent must build a bounded component change. This
skill composes task implementation and completion procedures; it is not an
agent and does not, by design, select, authorize, start, or delegate another
agent. An authority-bearing agent or orchestrator may invoke its procedure
without transferring authority into the skill.

## Inputs

- The assigned component's durable `as-is.md` and current `tasks.md`.
- A bounded requirement with explicit acceptance conditions and component
  boundary.
- Named dependencies, configured worker, effective cost and wall-clock
  constraints, and any approved plan or external read-only context.

The component directory is the default read/write boundary. Read outside it
only for dependencies explicitly named by the requirement. Task state and
budget observations remain authoritative in the component task record.

## Procedure

1. Read `as-is.md`, the current task, and named dependencies. Advance the task
   to `active` and record the scope, changed-artifact expectation, constraints,
   dependencies, recovery checkpoint, and acceptance mapping.
2. Formulate a minimal implementation plan and obtain the required read-only
   expert plan review before editing. Revise the plan or record a durable
   blocker when review fails.
3. Implement only the bounded requirement. Apply
   `implementing-component-tasks` for task-record lifecycle, child boundaries,
   progress, and changelog preparation.
4. If work crosses into a descendant with its own `as-is.md`, stop at that
   boundary and delegate through the configured component-builder role. Verify
   the child record revision, available budget, and absence of an active
   attempt before launch; forward approved budgets and preserve the child
   handoff. A child owns only its own component files and record: it must not
   edit parent records, parent budgets, or parent status. Budget exhaustion is
   recorded as a child request/blocker for parent reconciliation. Skills
   provide no delegation authority.
5. Select and run the smallest relevant checks using
   `verification-discipline`. Record commands, observed results, acceptance
   mapping, residual risk, cumulative cost and wall-clock observations, and
   recovery state in `tasks.md`.
6. After checks pass, obtain a fresh read-only expert validation of the actual
   diff and evidence. The validation must explicitly say whether the change is
   safe to commit. Do not commit on a failed or unavailable required gate.
7. When the task and all descendants are terminal, write the concise durable
   summary to `changelog.md`, remove `tasks.md` through task management, and
   invoke `committing-completed-work`. Stage only the declared component
   handoff and create one scoped commit; leave unrelated work untouched.

## Outputs

A completed handoff consists of:

- the changed component artifacts and concise `changelog.md` entry;
- a removed transient task record after its completion evidence is durable;
- one scoped Git commit containing only the declared handoff; and
- task evidence covering expert plan and final-diff gates, validation,
  descendant closure, budgets, residual risk, recovery checkpoint, result, and
  next action before cleanup.

If implementation, validation, delegation, or commit fails, leave the task
non-completed with the failure and recovery action recorded. Never infer
completion from process exit or private runtime state, and never force a commit
for incomplete work.

## Authority Boundaries

| Concern | Authority |
| --- | --- |
| Component purpose, design, and links | `as-is.md` |
| Current task, acceptance, budget, and recovery | component `tasks.md` |
| Implementation lifecycle and child closure | `implementing-component-tasks` |
| Validation selection and evidence | `verification-discipline` |
| Scoped durable commit | `committing-completed-work` |
| Agent identity, launch, approval, and delegation | configured agent contract |
| Parent/child record and budget ownership | owning parent/child component contract; child cannot mutate parent |

The procedure preserves `component-builder` as the role boundary. It does not
merge agent identity into reusable skill logic, create runtime state, broaden
scope, or authorize external effects.

## Recovery

Resume from the component task record and Git state. Do not duplicate an active
attempt. Re-read the last checkpoint, account for prior observations and
retained reserve, inspect preserved uncommitted work, and use only the
configured worker or an explicitly authorized recovery decision. A child
commit remains source evidence until the owning component integrates it and
proves caller ancestry.

## Named Contracts

- `implementing-component-tasks/SKILL.md` — task lifecycle and boundaries.
- `committing-completed-work/SKILL.md` — completion eligibility and scoped
  commit procedure.
- `verification-discipline/SKILL.md` — risk-matched validation evidence.
- `../../agents/component-builder/agent.md` — role authority and expert gates.
