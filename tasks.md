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
Task selected after completion of the masked runtime-reference policy and process-adapter emitted-path enforcement. The conceptual specification identifies an observation contract as the smallest candidate boundary. Current owner records and focused fixtures show that task-control, process, launcher, observability, budget, and Git/worktree concerns remain materially distinct, and no second independent host adapter currently exists to validate a shared runtime API. The bounded implementation decision is therefore to retain the contract in `docs/execution-contract.md` and preserve current owners without creating `core/modules/execution-contract/`.

## Validation
- Existing process-adapter fixtures cover role/admission checks, accepted detached launch, observation, failure, cancellation, bounded recovery, stale-revision rejection, unavailable worker/host evidence, and durable task-record authority.
- Existing task-control fixtures cover durable launch admission, retained-reserve handling, record mutation, questions/approvals, descendant closure, validator behavior, budget arithmetic, and handoff eligibility.
- Existing launcher fixtures cover Pi version/preflight, explicit extension loading, model/thinking forwarding, detached observation, bounded stop, recovery candidates, and handoff facts.
- Existing observability fixtures cover supplementary lifecycle tracing, sink failure, opaque session references, and path-free projection.
- Focused process/task-control/observability suites were run. After the first timing-sensitive malformed-budget timeout, the rerun passed 21 tests with 229 expectations for process and bounded-process coverage. Task-control and observability passed together with 47 tests and 196 expectations. The launcher rerun with `--timeout 20000` passed 51 tests with 322 expectations; the earlier two timeout/environment failures were superseded by this successful rerun.
- Final configured-large read-only review approved retaining the deferment and found no remaining scoped blocker. It required reconciling the superseded first-run failures before completion; that reconciliation is recorded above.
- Task-record validation passed after restoring the prior completed process narrative needed by the repository validator.

## Result
Completed the bounded readiness task by retaining the smallest justified execution-contract boundary as a documented observation contract rather than creating a new module or runtime API. The decision preserves task-control as durable authority, process as the process-backed lifecycle mapper, the Pi launcher as the Pi/repository adapter, observability as supplementary evidence, and current recovery boundaries. A future extraction requires an additional independent host adapter or concrete compatibility need plus new provider-free evidence. No descendants were authorized; descendant closure is vacuously terminal.

## Blockers And Escalations
No scoped blocker remains. The first process and launcher runs exposed timing-sensitive failures, but the configured-timeout reruns passed and the final review accepted the reconciled evidence. Residual risk remains that a future independent host adapter may expose a compatibility need requiring a different seam; that is separate work. Do not create `core/modules/execution-contract/`, move lifecycle ownership, add a generic task-profile framework, or alter Pi/process/host behavior without a new concrete compatibility need and explicit bounded scope. External effects remain prohibited.

## Recovery
The task-start handoff is recorded in root `as-is.json`, `tasks.md`, and the selected root backlog row. Preserve existing owners and revert only scoped changes if evidence fails; leave the task active or blocked with the latest durable findings rather than claiming readiness from documentation alone.

## Next Action
Record concise completion evidence in the root changelog, remove exactly `root:implement-execution-contract-readiness-boundary` from the root backlog, and remove the paired root task artifacts in one scoped completion commit. Leave the Pi adapter and tools/modules reorganization tasks subject to their own acceptance gates.
