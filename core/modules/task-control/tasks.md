# Task

## Requirement

Implement the first bounded candidate task-control slice for `task-control-first-slice` within `core/modules/task-control` only. Build plan-envelope readiness/admission evaluation, dependency classification and invalidation facts, atomic component reservations with recovery, and fail-closed parent-closure evaluation. Preserve current task-record, budget, control-plane, validator, handoff, host-adapter, fixture, and target-contract boundaries.

## Plan

1. Read the task-control component record, accepted Draft-6 plan, kick-off brief, task-record protocol, execution contract, current control-plane/budget/validator/handoff implementations, and applicable design principles.
2. Define the smallest typed, deterministic, provider-free candidate structures using existing task-control and budget ownership.
3. Add focused tests for complete and incomplete plan admission, dependency ordering/invalidation, reservation races and recovery, no-partial-admission behavior, and fail-closed parent closure.
4. Run the exact focused and regression checks, record evidence and residual risk, obtain the required non-independent Terra result review, and stop if any boundary or holder fact is unresolved.

### Exact expected changed-artifact set

| Category | Paths |
| --- | --- |
| New candidate implementation | `core/modules/task-control/plan-admission.ts`, `core/modules/task-control/component-reservation.ts` |
| New focused checks | `core/modules/task-control/plan-admission.test.ts`, `core/modules/task-control/component-reservation.test.ts` |
| Existing closure owner | `core/modules/task-control/handoff-eligibility.ts`, `core/modules/task-control/handoff-eligibility.test.ts` only when required to express the accepted fail-closed closure conditions; preserve existing behavior |
| Durable component context | `core/modules/task-control/as-is.md` only if the implementation changes documented purpose, boundary, relationship, or ownership; otherwise no change |
| Task lifecycle | This `tasks.md` and `as-is.json` during the task; `changelog.md` only after validated completion |
| Forbidden changes | `control-plane.ts`, `budget.ts`, task-record protocol, execution contract, process adapter, launcher, fixture, benchmark, provider configuration, target records, or other components unless a separately authorized blocker resolution changes scope |

No implementation may begin until the task is independently admitted. No worker, provider, subprocess, external service, or fixture candidate flow may be launched by this preparation checkpoint.

## Progress

Task preparation authorized by the user on 2026-08-29. The record is ready and queued. The configured worker role is `component-builder`; its role file declares model setting `medium`, which resolves through current repository configuration to `@preset/abs-medium` via the configured `openrouter` provider. The accepted construction flow names Luna as coding implementer and Terra as planner/adviser and non-independent result reviewer; this record does not claim an exact Luna model identity or human holder.

## Validation

Not yet run. Required validation after implementation is authorized:

- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/plan-admission.test.ts core/modules/task-control/handoff-eligibility.test.ts`
- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/control-plane.test.ts`
- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/component-reservation.test.ts`
- `bun core/modules/task-control/task-record-validator.ts .`
- `git diff --check`

Candidate checks must remain provider-free and separate from model advice, semantic review, process exit, and completion authority. Missing exact holder or model-route evidence, unsupported capability, a boundary contradiction, or an acceptance failure is a blocker.

## Result

Not yet available.

## Blockers And Escalations

Exact task-control admission remains pending. The construction-time coding assignment names Luna as implementer and Terra as planner/adviser/reviewer, but no exact Luna model identity or human holder has been selected. Do not invent a substitute. The current process adapter and integration-dependent fixture proof are excluded from this task. No descendant is authorized or planned because this is the leaf task.

## Recovery

Preserve this task pair and all current task-control files. If interrupted, reread the durable component record and accepted kick-off brief, retain cumulative observations, inspect the last bounded checkpoint, and either continue only an admitted atomic unit or clean up that unit within this component. Do not modify parent records, sibling records, process-adapter files, fixture files, target contracts, or provider configuration. No worker launch has occurred.

## Control Plane

- control-plane: {"event":"task-prepared","parent":"core/modules","scope":"core/modules/task-control","status":"ready","startsWork":false,"plan-digest":"ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716"}

## Next Action

Validate the complete prepared task tree and obtain exact task-control admission. Do not activate or launch this task until admission, holder selection, capability facts, and the task-start handoff are durable.
