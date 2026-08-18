# Task

## Requirement
Implement `core/modules/observability:provider-correlation-contract` under option 1: preserve actual Pi/provider behavior. Define task-derived session names as bounded correlation labels, local Pi session UUIDs as independent local identities, provider request identity as explicitly unavailable unless an adapter exposes it, and readable Pi sessions as the provider/model evidence source. Do not implement provider-request mapping, forks, or runtime behavior beyond provider-free contract fixtures.

## Plan
1. Read the observability record, tracing design, tracer implementation, and selected launcher coordination row.
2. Define the smallest typed contract and fail-closed projection helpers in the observability boundary.
3. Add provider-free fixtures for retry, absent, malformed, unavailable, source-labelled evidence, and privacy cases.
4. Run focused tests, task-record validation, and diff checks; obtain final expert review before completion.

## Progress
Task-start pair created in `as-is.json` and this narrative. Implementation has not begun. The plan review found the provider request identity is not exposed by the current adapter and must remain explicitly unavailable; no provider behavior will be inferred.

## Validation
Pending.

## Result
Not yet available.

## Blockers And Escalations
None. The user selected option 1. The selected backlog row remains `core/modules/observability:provider-correlation-contract`.

## Recovery
If interrupted, reread the task pair and preserve any uncommitted component changes. Do not begin the dependent launcher, trace-envelope, or evidence-query tasks until this contract is validated and integrated.

## Next Action
Implement the provider-correlation contract and provider-free tests within this component only.
