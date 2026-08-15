# Task

## Requirement
Establish readiness evidence for a future host-neutral execution-contract owner. Inventory current execution responsibilities across `docs/execution-contract.md`, `core/adapters/process/`, the Pi launcher, and `core/modules/task-control/`; reconcile overlaps and gaps; define the smallest stable host-neutral request/observation boundary; add provider-free request, observation, failure, cancellation or recovery, stale-revision, and unavailable-host fixtures in existing owners; and record whether a future `core/modules/execution-contract/` family is justified without creating it.

## Plan
1. Review the authoritative execution contract, process-adapter and task-control records and implementations, launcher behavior, existing focused tests, architecture handoff, task protocol, and naming/ownership guidance.
2. Record the exact selected identity `root:execution-contract-readiness` and establish this task from the clean post-handoff baseline.
3. Build a responsibility and consumer inventory, separating host-neutral concepts, process mechanics, Pi behavior, task authority, budget arithmetic, observability, worktree/Git mechanics, and handoff interpretation.
4. Define the smallest stable request/result and observation boundary in the existing durable execution-contract record and affected owner records, without creating `core/modules/execution-contract/` or moving implementation.
5. Add the smallest provider-free focused fixtures in existing owners for admission, observation, failure, cancellation/recovery, stale revision, and unavailable host evidence; preserve current authority and behavior.
6. Run focused existing-owner tests, task-record/content/backlog/JSON/reference/whitespace checks, obtain configured final read-only expert review, record completion evidence, remove only the exact selected backlog row, clean task artifacts, and create the second completion commit.

## Scope
In scope: root backlog row `root:execution-contract-readiness`; `docs/execution-contract.md`; the durable `as-is.md` records for `core/adapters/process`, `core/modules/task-control`, and `skills/spawning-pi-subagents`; the existing process supervisor, launcher, and task-control tests and narrowly related fixture helpers; root `as-is.json`; and root `tasks.md`. Out of scope: creating `core/modules/execution-contract/`; moving or renaming implementation; changing task-record schema or task-transition, budget, cancellation, provider, Pi, process, worktree, Git, observability, host, target, setup, browser, environment, package, or completion authority; creating `core/adapters/pi/` or `tools/task/`; setup replacement; host projection or target writes; and descendants.

## Acceptance
- A responsibility/consumer inventory distinguishes the host-neutral execution concepts from process mechanics, Pi/session behavior, task-control authority, budget arithmetic, observability, worktree/Git mechanics, and handoff interpretation; it records current owner, evidence, gap/overlap, and recovery boundary.
- The smallest stable request/result and durable-versus-host-observation boundary is recorded in the existing authoritative execution-contract documentation and affected durable owner records without introducing a duplicate authority or speculative directory.
- Provider-free focused fixtures cover launch admission, observation, failure, cancellation or recovery, stale revision, and unavailable host evidence using existing owners; they preserve task-record authority and source-labelled unavailable values.
- Existing focused process, task-control, launcher, and affected behavioral tests pass; task-record validation, content/navigation, backlog, JSON, reference, whitespace, and diagnostics checks pass; final configured large expert review passes.
- Exact selected identity `root:execution-contract-readiness` is recorded and removed only after changelog evidence; one task-start commit and one completion commit are created; no descendants are authorized.
- No runtime, schema, authority, provider, Pi, process, host, target, package, browser, environment, setup, physical-layout, or completion behavior changes.

## Progress
Task selected from the root planning backlog after the aspirational architecture handoff. Current evidence shows that `docs/execution-contract.md` is the host-neutral conceptual authority, `core/adapters/process/supervisor.ts` owns a broad existing process-backed mapping, `core/adapters/process/bounded-process-supervisor.ts` owns only mechanical process lifetime, `core/modules/task-control` owns durable task mutation and budget arithmetic, and the Pi launcher owns Pi invocation, worktree/Git mechanics, registry projection, tracing, and handoff observation. This task will produce readiness evidence and focused fixtures, not a new execution-contract module or relocation.

## Validation
Pending. Required focused checks are process-adapter supervisor tests, task-control tests, launcher provider-free tests, relevant agent/skill behavioral tests, task-record validation, content/navigation, backlog, JSON, reference, whitespace, and diagnostics checks, followed by final configured large expert review.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Stop if defining the boundary requires changing runtime semantics, task-record schema, authority ownership, provider or Pi behavior, host integration, or physical layout; record the ambiguity instead of inventing a module or abstraction.

## Recovery
If the current ownership split cannot be reconciled without duplicating authority, preserve the inventory and record the unresolved overlap as a blocker; do not create a speculative directory. If fixture changes fail, revert only the new fixture/documentation changes while preserving the selected backlog row and task pair. If validation or finalization fails, retain this task and its selected backlog row; do not create standalone cleanup.

## Next Action
Create the task-start commit, then build the bounded responsibility inventory and smallest execution-contract readiness evidence in existing owners.
