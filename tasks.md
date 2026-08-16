# Task

## Requirement
Implement the bounded root task `root:implement-execution-contract-readiness-boundary`. Reconcile the conceptual host-neutral execution contract with current task-control, process-adapter, Pi launcher, observability, budget, and Git/worktree consumers. Establish only the smallest stable request/observation seam justified by provider-free evidence; if no standalone seam is justified, record that decision without creating `core/modules/execution-contract/`. Preserve task-control as durable authority, current lifecycle owners, host-neutral semantics, emitted-path privacy, and all existing runtime behavior.

## Plan
1. Build the smallest authoritative context from the execution-contract specification, architecture vocabulary, root/core/launcher/observability/task-control/process records, current implementations, tests, and migration design.
2. Inventory conceptual contract concerns against current owners, direct consumers, overlap, evidence, and recovery boundaries; record facts separately from proposed future placement.
3. Add or refine provider-free fixtures for launch admission, accepted launch observation, failure, cancellation or bounded recovery, stale-revision rejection, and unavailable-host evidence without introducing a new authority or module.
4. Determine whether a reusable observation seam is stable and minimal; implement only if evidence supports it, otherwise document the deferment and preserve current owners.
5. Run focused behavioral tests plus task-record, content/navigation, backlog, JSON, reference, diagnostics, whitespace, and final review checks; record residual risks and terminal handoff evidence.

## Progress
Task selected after completion of the masked runtime-reference policy and process-adapter emitted-path enforcement. Current conceptual specification identifies an observation contract as the smallest candidate boundary, while explicitly retaining task-control, process, launcher, observability, budget, and Git/worktree ownership until consumer and behavior evidence justify extraction.

## Validation
Pending implementation and focused evidence. Required evidence includes provider-free launch admission, accepted launch observation, failure, cancellation or bounded recovery, stale-revision rejection, unavailable-host behavior, task-record validation, content/navigation validation, backlog query validation, tracked JSON parsing, reference checks, diagnostics, whitespace checks, and final configured-large review.

## Result
Pending.

## Blockers And Escalations
No blocker currently known. Do not create `core/modules/execution-contract/`, move lifecycle ownership, add a generic task-profile framework, or alter Pi/process/host behavior without evidence and explicit bounded scope. External effects remain prohibited.

## Recovery
The task-start handoff is recorded in root `as-is.json`, `tasks.md`, and the selected root backlog row. Preserve existing owners and revert only scoped changes if evidence fails; leave the task active or blocked with the latest durable findings rather than claiming readiness from documentation alone.

## Next Action
Inspect the current execution-contract consumers and provider-free test surfaces, then produce the owner/overlap/evidence inventory before selecting any implementation seam.
