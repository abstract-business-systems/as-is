# Sol consultation — process-adapter boundary and first-slice scope

## Consultation identity

- Consultant: Sol, construction-time architecture consultation.
- Model identity observation: `openai/gpt-5.6-sol` through OpenRouter. This is provenance only, not permanent configuration or authority.
- Scope: determine whether the process-adapter ownership question is critical to the accepted coding/application plan's next implementation slice.
- Inputs: accepted coding/application flow-plan Draft 2, accepted agents/skills flow-plan Draft 2, current `core/adapters/process/as-is.md`, current adapter boundaries, and the user's direction that adapters currently supervise processes and deterministic wall-clock limits, not Git/worktree application.
- This consultation did not edit files, create tasks, launch workers, decide Human Review, or authorize implementation.

## Finding

The process-adapter ownership decision is **not a prerequisite for the accepted coding/application plan as a planning basis or for an unaffected task-control implementation slice**. It is required only before preparing the conditional `core/adapters/process` child-result application task and before claiming the complete integration-dependent candidate proof.

The accepted plan already has a fail-closed branch rule. The user's direction indicates that Git/worktree application is outside the process adapter's present supervision responsibility. No replacement owner should be inferred.

## Scope impact

A first slice can remain limited to `core/modules/task-control`:

- plan readiness and admission;
- atomic component reservations and recovery;
- dependency classification and invalidation facts; and
- fail-closed parent-closure evaluation using integration evidence as an input, without implementing or fabricating that evidence.

Exclude the `core/adapters/process` child-result integration branch from that slice. Defer the integration-dependent `dummy-delegation` candidate harness and end-to-end proof; their accepted prerequisites cannot pass without the blocked integration branch. Existing process and fixture tests remain baseline regression evidence only.

No new process-supervision implementation is presently justified: deterministic wall-clock enforcement already exists in `bounded-process-supervisor.ts`, and the accepted plan requests only regression coverage for it.

## Recommended disposition

Defer the broader capability-placement question. Preserve current `as-is.md` authority, current parent-side integration, and existing process supervision unchanged.

Select only the unaffected task-control slice if a separately authorized kick-off later does so. Do not assign Git/worktree application to `core/adapters/process`, invent another owner, or claim completion of the accepted plan's full candidate proof.

## Required record/update

Before task preparation, the accountable parent planning owner should record:

- child-result mechanical application is excluded or blocked for the selected first slice;
- the `core/adapters` → `core/adapters/process` implementation branch is omitted;
- integration-dependent fixture scenarios and full candidate-proof claims remain deferred;
- broader capability ownership remains unresolved for later review; and
- current process-adapter and parent-side integration behavior remains authoritative.

No `core/adapters/process/as-is.md` change is required for the unaffected slice.

## Residual risk

The reduced slice cannot prove child-result application, stale-base/conflict recovery, integration locking, or the complete candidate fixture flow. Parent closure must therefore remain fail-closed when required integration evidence is absent. The possible mismatch between current adapter wording and the user's narrower responsibility direction remains a later architecture question, not grounds to expand this implementation slice.

`startsWork: false`
