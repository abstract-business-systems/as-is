# Task

## Requirement

Coordinate the bounded `core` task for `task-control-first-slice`. The only implementation descendant is `core/modules`; process-adapter work is explicitly excluded.

## Plan

Verify the accepted Draft-6 identity and kick-off scope, preserve the core boundary, and hand off the explicitly allocated `core/modules` child without launching it. Keep all worker, model, capability, budget, protected-input, validation, recovery, and stop-condition facts durable in the child record.

## Progress

Task preparation authorized by the user on 2026-08-29. The record is ready and queued. The configured worker role is `component-builder`; its role file declares model setting `medium`, which resolves through current repository configuration to `@preset/abs-medium` via the configured `openrouter` provider. This is a configuration observation and not a claim about Luna's exact model identity.

## Validation

Not yet run. Before any implementation launch, validate the complete task tree, budget ceilings, delegation limits, required narrative sections, and current task-control admission facts. No provider-backed execution is authorized.

## Result

Not yet available.

## Blockers And Escalations

Exact task-control admission remains pending. The construction-time coding assignment names Luna as implementer and Terra as planner/adviser/reviewer, but no exact Luna model identity or human holder has been selected. Do not invent a substitute; record any resulting admission blocker before launch.

## Recovery

Preserve this task pair and the child task pair. If preparation is interrupted, reread the root task and accepted kick-off brief, retain cumulative observations, and do not change parent status or allocations from this child. No worker launch has occurred.

## Control Plane

- control-plane: {"event":"task-prepared","parent":".","scope":"core/modules","status":"ready","startsWork":false,"plan-digest":"ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716"}

## Next Action

Validate and admit this task and its exact child only after the root start handoff is durable; then await a separately authorized implementation transition.
