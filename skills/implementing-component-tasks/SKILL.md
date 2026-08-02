---
name: implementing-component-tasks
description: Implements one bounded component task using durable component context, scoped delegation, validation, and changelog handoff.
---

# Implementing Component Tasks

Implement one bounded change selected from the backlog.

## Ownership Contract

| Artifact | Writer | Authority | Lifetime |
| --- | --- | --- | --- |
| `as-is.md` | Component owner or builder | Component purpose, design, boundary, and links | Durable |
| `task.md` | Task worker under task management | Active task state and handoff evidence | Transient |
| `changelog.md` | Task worker after validation; parent orchestrator for parent integration | Concise completed-task history | Durable |
| Git commit | Completion procedure | Scoped durable handoff | Durable |

The task worker writes the completion summary after validation and before
`task.md` removal. Task management defines the transition and verifies the
preconditions; it does not silently invent the summary. A parent orchestrator
writes the parent summary only after child closure and parent integration.

## Method

1. Read the component's durable `as-is.md` and the selected task requirement.
2. Create or reuse transient `task.md`; record scope, acceptance conditions,
   worker, constraints, and changed-artifact expectations before editing.
3. Work only within the component boundary. If a child has its own `as-is.md`,
   delegate that child to a component-builder rather than crossing the boundary.
4. Prefer declarative procedure and deterministic scripts for repeatable policy,
   orchestration, validation, and cleanup. Preserve generative behavior only
   where it is intentional and bounded.
5. Record progress, validation, blockers, recovery, and residual risk in
   `task.md`.
6. On completion, write a concise summary to `changelog.md`, then remove
   `task.md` through the completion procedure and create the scoped durable
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
| Changelog handoff | Summary written before `task.md` removal |
| Completion | Scoped validation and residual risk recorded |
