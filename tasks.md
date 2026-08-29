# Task

## Requirement

Prepare and admit the explicitly authorized `task-control-first-slice` task hierarchy. The implementation boundary is limited to `core/modules/task-control`; this parent task coordinates the root, `core`, `core/modules`, and task-control records without implementing child files.

## Plan

1. Preserve the accepted executable realization plan Draft-6 identity and the separate kick-off authorization.
2. Record the exact root → core → core/modules → core/modules/task-control task hierarchy with bounded budgets, protected inputs, dependencies, workers, capabilities, acceptance, recovery, and stop conditions.
3. Validate each task pair and parent allocation before any worker launch.
4. Obtain current task-control admission evidence for every prepared task, then stop and await a later implementation authorization.

## Progress

The user authorized preparation of the bounded first task-control slice on 2026-08-29. Four task pairs were prepared, then cancelled after the user clarified that candidate implementation must use the custom model-bound construction flow rather than the current component-builder/control-plane workflow. No worker was launched, no task was activated, and no implementation file was changed.

The configured root role is `as-is` with current default model setting `small` resolving to `@preset/abs-small` through the configured `openrouter` provider. The child coordinator role is `component-builder` with role model setting `medium` resolving to `@preset/abs-medium`. These are current configuration observations, not claims about Luna's exact model identity. The accepted coding construction flow names Terra as planner/adviser and Luna as coding implementer; exact human holders and any exact Luna model route remain unresolved gate-time facts.

## Validation

- `bun core/modules/task-control/task-record-validator.ts .`: `VALID`.
- `git diff --check`: passed before the task-start checkpoint.
- Read-only current control-plane launch-budget preflight passed for root, `core`, `core/modules`, and `core/modules/task-control`, with effective wall-clock limits of 780, 660, 540, and 180 seconds respectively; no status or budget mutation occurred.
- `bun core/modules/task-control/control-plane.ts status .`: no active task; all four prepared records remain `ready`.
- Full exact admission remains blocked because the current launch-budget operation does not establish candidate plan, reservation, dependency, protected-input, capability, holder, or model facts. Evidence is recorded in `reviews/agentic-development-system/first-task-control-slice-admission-preflight.md`.

Admission must use current task-control authority and must not be inferred from file creation, process exit, telemetry, or this parent record. No provider-backed execution is authorized.

## Result

Task preparation was cancelled and retained as recovery/audit evidence. The task must not be reactivated unchanged. A successor construction-flow packet is required before reselection.

## Blockers And Escalations

The prepared task hierarchy is cancelled because its worker interpretation used the current component-builder/control-plane path rather than the custom model-bound construction flow. Exact custom-agent definitions, human holders, Luna model identity/provider route, capabilities, and successor admission facts remain unresolved. Do not reactivate these records, invent a substitute, or authorize provider execution, implementation, benchmark, migration, adoption, retirement, or merge.

## Recovery

Preserve all four task pairs and the selected backlog row. If preparation or admission is interrupted, recover from the latest durable records and Git checkpoint without deleting partial task artifacts or resetting budgets. Restore a missing task narrative or JSON companion before proceeding. Do not activate or launch a task until the complete hierarchy is valid and the exact admission evidence is recorded.

## Control Plane


- control-plane: {"event":"kick-off-authorized","decision":"prepare-and-admit-only","scope":"root/core/core-modules/core-modules-task-control","status":"ready","startsWork":false,"plan-digest":"ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716"}
- control-plane: {"event":"task-hierarchy-prepared","children":["core","core/modules"],"leaf":"core/modules/task-control","status":"ready","startsWork":false}
- control-plane: {"event":"admission-preflight","result":"blocked","reason":"exact-holder-model-capability-and-candidate-admission-facts-unavailable","status":"ready","startsWork":false}
- control-plane: {"checkpoint":"2026-08-29T15:19:09Z","event":"cancellation","reason":"Prepared task superseded: current component-builder/control-plane workflow is governance or benchmark evidence only; construction implementation must use the explicitly selected custom model-bound agent flow.","status-before":"ready"}
## Next Action

Prepare and review a successor construction-flow packet that explicitly binds the custom agents to selected models and separates candidate implementation from later current-workflow benchmarking. Keep this cancelled task evidence and `startsWork: false`.
