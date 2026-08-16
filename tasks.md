# Task

## Requirement
Establish readiness evidence for bounded task-facing agent tools and decide whether a future `tools/task/` family is justified. Inventory current task-control APIs, agent-facing tool registration, role declarations, context/evidence tool boundaries, admission and output limits, mutation routing, denied/unavailable behavior, and the fixed no-emitted-filesystem-path requirement. Define the smallest bounded status/control tool seam while preserving task-control mutation authority, role admission, task records, and completion authority; do not create `tools/task/` or change runtime behavior.

## Plan
1. Record the exact selected identity `root:task-facing-tools-readiness` and preserve the two-commit lifecycle.
2. Inventory task-control APIs and tests, current tool registration and role declarations, context/evidence tools, launcher/package adapters, and current emitted metadata boundaries.
3. Reconcile allowed task observations and explicitly authorized mutations with task-control ownership, admission, output bounds, stale revisions, approvals, cancellation, and unavailable behavior.
4. Define the smallest future task-tool boundary and provider-free fixture matrix without creating a directory, registering a tool, or changing runtime behavior.
5. Validate records and content, obtain expert review, record completion evidence, and clean only the exact selected backlog row and task artifacts.

## Scope And Constraints
In scope: root `backlog.md`, root `as-is.json`, root `tasks.md`, `docs/execution-contract.md`, `designs/aspirational-architecture-handoff.md`, `designs/pi-adapter-readiness.md`, `core/modules/task-control/as-is.md`, `core/modules/task-control/control-plane.ts`, task-control tests and API records, `tools/agent/as-is.md`, `tools/agent/subagent-tools.ts`, `tools/context/as-is.md`, `tools/evidence/as-is.md`, relevant role declarations, and narrowly related durable records required for readiness evidence. Out of scope: creating `tools/task/`; adding or registering tools; changing task-control, role admission, task schema, process, Pi, provider, path-emission, host, target, setup, browser, environment, package, or completion behavior; file moves; target writes; external services; descendants.

Acceptance:
- Current task-facing consumers and role/tool admission are inventoried with authoritative source, consumer, authority, output-bound, and recovery ownership.
- The smallest future task-tool seam distinguishes read-only status/question/blocker/budget observations from explicitly authorized control operations routed through `core/modules/task-control/`; no tool becomes task authority.
- Provider-free fixture requirements cover allowed, denied, unavailable, bounded, stale-revision, approval, cancellation, descendant, and path-private outputs, including role-declared admission and no silent role substitution.
- The future `tools/task/` decision is explicit and evidence-based; no speculative directory, registration, or runtime change is introduced.
- Existing Pi adapter/package and execution-contract boundaries remain unchanged; emitted-path privacy is an enforcement prerequisite, not claimed implementation proof.
- Task-record, backlog, JSON, content/navigation, whitespace, diagnostics, and final expert validation pass.

## Progress
Execution-contract and Pi-adapter readiness are complete. The current task-facing surface is distributed between `core/modules/task-control/`, `tools/agent/subagent-tools.ts`, `tools/context/`, `tools/evidence/`, role-declared Pi tools, and thin registration adapters. The aspirational handoff proposes `tools/task/` only if focused task operations become a real agent-facing sibling family. This task will produce ownership and fixture readiness evidence only.

## Validation
Pending. Required checks are root task-record validation, JSON parsing, as-is/content navigation, backlog validation, `git diff --check`, changed-document diagnostics, and final configured large expert review. No runtime or implementation tests are authorized to change in this readiness task.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Task-control remains the only task-transition authority. If a proposed tool seam would duplicate control-plane mutation, budget, approval, cancellation, descendant, or completion semantics, record a blocker rather than broadening this readiness task. The future `tools/task/` family is not justified by a single operation or static resemblance alone.

## Recovery
No descendants are authorized. Preserve current task-control APIs, role declarations, registration adapters, and evidence/context tool surfaces if this task is interrupted. A candidate task-tool boundary is failed when consumer, admission, output, mutation-routing, stale-revision, approval, cancellation, descendant, or path-privacy evidence is missing or contradictory; remove only candidate readiness artifacts and restore the current bounded surfaces without changing task authority.

## Next Action
Create the task-start commit, then complete the bounded task-facing ownership inventory, smallest-seam decision, fixture matrix, and recovery handoff.