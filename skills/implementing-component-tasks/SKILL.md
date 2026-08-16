---
name: implementing-component-tasks
description: Implements one bounded component task using durable component context, scoped delegation, validation, and changelog handoff.
---

# Implementing Component Tasks

Use this procedure when an authorized worker implements one bounded change selected from the backlog. Inputs are the assigned component context, selected requirement, current task authority, and effective constraints. A `tasks.md` file may
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

The authorized task worker writes the completion summary after validation and before
`tasks.md` removal. Task management defines and verifies the transition
preconditions; this procedure does not grant transition authority or silently
invent the summary. A parent orchestrator
writes the parent summary only after child closure and parent integration.

## Method

1. Read the component's durable `as-is.md` and the selected task requirement.
2. Have authorized task management create or reuse transient `tasks.md`;
   record scope, acceptance conditions, worker, constraints, budget reserve,
   dependency/descendant plan, and changed-artifact expectations before editing.
3. Work only within the component boundary. If a child has its own `as-is.md`,
   delegate that child to a component-builder rather than crossing the boundary.
4. Prefer declarative procedure and deterministic scripts for repeatable policy,
   orchestration, validation, and cleanup. Preserve generative behavior only
   where it is intentional and bounded.
5. Record progress, validation, blockers, recovery, residual risk, cumulative
   budget observations, and any bubbled excess requirement in `tasks.md` under
   `Current Task`; keep future work under `Other Tasks` without active claims.
6. Run the required acceptance validation and record its evidence, residual
   risk, and recovery state in `tasks.md`. Do not treat process exit or a
   private runtime result as completion.
7. Have the authorized task worker or orchestrator verify that every
   implementation descendant is terminal and accounted for in the task result.
   A non-terminal, failed, or unaccounted descendant keeps the task incomplete;
   a task with no authorized descendants records vacuous terminal closure.
8. Only after acceptance validation passes and descendant closure is verified,
   authorized task management marks the task `completed` and the worker writes
   its concise summary to `changelog.md`. Task management then invokes
   `committing-completed-work` for the second completion commit,
   containing the changelog summary, exact evidence-gated backlog-row removal,
   configured task metadata/narrative cleanup, and the declared durable
   handoff. The task-start commit already contains the selected backlog status
   and active task artifacts; the completion procedure must keep the two
   commits distinguishable and must not create a standalone task-deletion or
   backlog-clearance commit. Changelog writing and task/backlog cleanup are
   completion steps, never progress steps.

## Outputs And Stopping

Outputs are the recorded task evidence, validated result or blocker, durable changelog handoff when eligible, and explicit recovery next action. The procedure stops when acceptance evidence and descendant closure are recorded or when a failed gate, blocker, or recovery condition prevents completion; it does not infer completion from process exit or private runtime state.

## Boundaries

Do not put transient task status, runtime details, or active backlog items in
`as-is.md`. Do not edit parent or sibling component state. Do not infer
completion from process exit or a private runtime artifact.

## Backlog Completion Handoff

A selected backlog row is not cleared by changing its status or by process
exit. After the authorized task manager verifies the terminal task record and prepares the completion patch, it invokes the deterministic cleanup in the owning repository with the exact selected identity so its one-row result can be staged in the second commit:

```bash
bun skills/managing-backlog/scripts/query.ts --cleanup=component:id .
```

Replace `component:id` with the exact selected backlog identity. The cleanup result must be checked against that exact selected `component:id`.
The owning changelog must name that ID on a completion-evidence line before
cleanup eligibility is evaluated. Failed, blocked, cancelled, or otherwise
unreconciled work receives no completion changelog evidence and remains in its
backlog. If cleanup reports additional rows, task management must review them
separately rather than attributing them to the current task. A cleanup result must never be committed separately from the changelog and
task-artifact cleanup; an interrupted completion restores the active task,
unreconciled backlog row, and task artifacts before retry.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Bounded task | Explicit component scope and acceptance conditions |
| Child boundary | Configured component-builder handoff |
| Deterministic behavior | Repeatable validation where practical |
| Changelog handoff | Acceptance validation and terminal descendant closure recorded before the summary is written; the summary is staged with exact backlog cleanup and task-artifact cleanup for the second commit |
| Completion | The first commit records selection and active task artifacts; the second commit contains changelog, exact backlog removal, task cleanup, and the scoped durable handoff |
