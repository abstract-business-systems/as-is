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

Task preparation was authorized by the user on 2026-08-29 and then cancelled after clarifying that candidate implementation must use the custom model-bound construction flow. The prepared `component-builder` role and current preset are retained as historical evidence only; they are not a Luna assignment. The accepted construction flow names Luna as coding implementer and Terra as planner/adviser and non-independent result reviewer, but the successor packet must make the custom bindings explicit.

## Validation

Not yet run. Required validation after implementation is authorized:

- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/plan-admission.test.ts core/modules/task-control/handoff-eligibility.test.ts`
- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/control-plane.test.ts`
- `env -u PI_BIN AS_IS_LIVE_INTEGRATION=0 bun test core/modules/task-control/component-reservation.test.ts`
- `bun core/modules/task-control/task-record-validator.ts .`
- `git diff --check`

Candidate checks must remain provider-free and separate from model advice, semantic review, process exit, and completion authority. Missing exact holder or model-route evidence, unsupported capability, a boundary contradiction, or an acceptance failure is a blocker.

## Result

Preparation cancelled; no worker or provider was launched. Do not reactivate this task unchanged.

## Blockers And Escalations

This prepared task used the current component-builder role as a prospective worker and is cancelled. A successor must select the custom construction agent, exact Luna model route, capabilities, holder, and admission facts before implementation. The current process adapter and integration-dependent fixture proof remain excluded. No descendant was authorized or launched.

## Recovery

Preserve this task pair and all current task-control files. If interrupted, reread the durable component record and accepted kick-off brief, retain cumulative observations, inspect the last bounded checkpoint, and either continue only an admitted atomic unit or clean up that unit within this component. Do not modify parent records, sibling records, process-adapter files, fixture files, target contracts, or provider configuration. No worker launch has occurred.

## Control Plane


- control-plane: {"event":"task-prepared","parent":"core/modules","scope":"core/modules/task-control","status":"ready","startsWork":false,"plan-digest":"ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716"}
- control-plane: {"checkpoint":"2026-08-29T15:19:09Z","event":"cancellation","reason":"Prepared task superseded: current component-builder/control-plane workflow is governance or benchmark evidence only; construction implementation must use the explicitly selected custom model-bound agent flow.","status-before":"ready"}
## Next Action

Await the reviewed successor construction-flow packet; preserve this cancelled task as audit evidence and do not activate or launch it.
