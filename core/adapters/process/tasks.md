# Task

## Requirement
Implement the mechanical process-boundary portion of the root `execution-usage-accounting` task. Provide a bounded stdout observation for the launcher without moving task, budget, worktree, Git, handoff, completion, or accounting authority into `core/adapters/process`.

## Plan
- Apply the preserved stdout-capture WIP only to `bounded-process-supervisor.ts` and its focused tests.
- Keep process lifetime, process groups, signals, wall-clock enforcement, stdio, and exit observation owned by this boundary.
- Define explicit bounded capture and unavailable/truncation behavior; do not parse Pi usage or persist accounting here.
- Build and run focused process tests, then prepare a scoped child handoff for the root coordinator.

## Progress
- Root coordination started in `04c4966`; this child is sequential and has no descendants.
- Existing recovery WIP changes `bounded-process-supervisor.ts` by switching stdout to a pipe and returning captured text; the implementation must be hardened and tested before handoff.

## Validation
Pending implementation.

## Result
Pending.

## Blockers And Escalations
The process adapter must remain host-neutral and mechanical. Pi JSONL parsing, usage semantics, private accounting persistence, public projections, and launcher policy remain outside this child.

## Recovery
Checkpoint: child task pair is being created after the root task-start commit. If implementation fails, preserve the child record and any worktree/commit evidence; do not integrate partial process-boundary changes or apply launcher accounting changes in this child.

## Next Action
Implement and validate bounded stdout observation, then report the scoped handoff to the root coordinator.
