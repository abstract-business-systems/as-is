---
name: implementing-component-tasks
description: Implements one bounded component task using durable component context, scoped delegation, validation, and changelog handoff.
---

# Implementing Component Tasks

Implement one bounded change selected from the backlog. A `tasks.md` file may
contain a `## Current Task` section and a separate `## Other Tasks` planning
section. Only `Current Task` is task authority; `Other Tasks` is non-authoritative
planning context and must not be advanced as active work.

## Ownership Contract

| Artifact | Writer | Authority | Lifetime |
| --- | --- | --- | --- |
| `as-is.md` | Component owner or builder | Component purpose, design, boundary, and links | Durable |
| `tasks.md` | Task worker under task management | Active task state and handoff evidence | Transient |
| `changelog.md` | Task worker after validation; parent orchestrator for parent integration | Concise completed-task history | Durable |
| Git commit | Completion procedure | Scoped durable handoff | Durable |

The task worker writes the completion summary after validation and before
`tasks.md` removal. Task management defines the transition and verifies the
preconditions; it does not silently invent the summary. A parent orchestrator
writes the parent summary only after child closure and parent integration.

## Method

1. Read the component's durable `as-is.md` and the selected task requirement.
2. Create or reuse transient `tasks.md`; record scope, acceptance conditions,
   worker, constraints, budget reserve, dependency/descendant plan, and
   changed-artifact expectations before editing.
3. Work only within the component boundary. If a child has its own `as-is.md`,
   delegate that child to a component-builder rather than crossing the boundary.
4. Prefer declarative procedure and deterministic scripts for repeatable policy,
   orchestration, validation, and cleanup. Preserve generative behavior only
   where it is intentional and bounded.
5. Record progress, validation, blockers, recovery, residual risk, cumulative
   budget observations, and any bubbled excess requirement in `tasks.md` under
   `Current Task`; keep future work under `Other Tasks` without active claims.
6. On completion of all tasks in the record, write a concise summary to
   `changelog.md`, then clean up and remove `tasks.md` through the completion
   procedure before creating the scoped durable
   handoff.

## Boundaries

Do not put transient task status, runtime details, or active backlog items in
`as-is.md`. Do not edit parent or sibling component state. Do not infer
completion from process exit or a private runtime artifact.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Bounded task | Explicit component scope and acceptance conditions |
| Child boundary | Configured component-builder handoff |
| Deterministic behavior | Repeatable validation where practical |
| Changelog handoff | Summary written before `tasks.md` removal |
| Completion | Scoped validation and residual risk recorded |
