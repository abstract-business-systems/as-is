# Task

## Requirement

Prepare and admit the explicitly authorized `task-control-first-slice` task hierarchy. The implementation boundary is limited to `core/modules/task-control`; this parent task coordinates the root, `core`, `core/modules`, and task-control records without implementing child files.

## Plan

1. Preserve the accepted executable realization plan Draft-6 identity and the separate kick-off authorization.
2. Record the exact root → core → core/modules → core/modules/task-control task hierarchy with bounded budgets, protected inputs, dependencies, workers, capabilities, acceptance, recovery, and stop conditions.
3. Validate each task pair and parent allocation before any worker launch.
4. Obtain current task-control admission evidence for every prepared task, then stop and await a later implementation authorization.

## Progress

The user authorized preparation of the bounded first task-control slice on 2026-08-29. The four task pairs are prepared in `ready` state. No worker has been launched, no task has been activated, and no implementation file has been changed.

The configured root role is `as-is` with current default model setting `small` resolving to `@preset/abs-small` through the configured `openrouter` provider. The child coordinator role is `component-builder` with role model setting `medium` resolving to `@preset/abs-medium`. These are current configuration observations, not claims about Luna's exact model identity. The accepted coding construction flow names Terra as planner/adviser and Luna as coding implementer; exact human holders and any exact Luna model route remain unresolved gate-time facts.

## Validation

Not yet run. Before task-control admission, run:

- `bun core/modules/task-control/task-record-validator.ts .`
- `git diff --check`
- a read-only inspection of every prepared task pair, direct-child budget allocation, delegation depth/child limits, protected inputs, exact accepted-plan digest, worker/capability facts, acceptance, recovery, and stop conditions.

Admission must use current task-control authority and must not be inferred from file creation, process exit, telemetry, or this parent record. No provider-backed execution is authorized.

## Result

Not yet available.

## Blockers And Escalations

Implementation remains unauthorized. Exact human holders, exact Luna model identity/provider route, and final capability evidence are not selected. Any unavailable or contradictory gate-time fact must remain a durable blocker; no substitute, provider execution, implementation, benchmark, migration, adoption, retirement, commit, or merge is authorized by this task preparation.

## Recovery

Preserve all four task pairs and the selected backlog row. If preparation or admission is interrupted, recover from the latest durable records and Git checkpoint without deleting partial task artifacts or resetting budgets. Restore a missing task narrative or JSON companion before proceeding. Do not activate or launch a task until the complete hierarchy is valid and the exact admission evidence is recorded.

## Control Plane

- control-plane: {"event":"kick-off-authorized","decision":"prepare-and-admit-only","scope":"root/core/core-modules/core-modules-task-control","status":"ready","startsWork":false,"plan-digest":"ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716"}
- control-plane: {"event":"task-hierarchy-prepared","children":["core","core/modules"],"leaf":"core/modules/task-control","status":"ready","startsWork":false}

## Next Action

Validate the prepared hierarchy and obtain exact task-control admission. After admission, stop for a separate implementation authorization; do not activate or launch a worker from this task.
