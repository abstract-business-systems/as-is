# Task

## Requirement
Implement the bounded root task `root:implement-pi-adapter-against-execution-contract`. Validate and document only the Pi-specific host-adapter boundary behind the approved conceptual execution contract: Pi executable/package selection, exact-version preflight, explicit extension loading and registration, Pi model/session argument mapping, and host approval-flag mapping. Preserve task-control authority, process-group mechanics, host-neutral execution-contract vocabulary, emitted-path privacy, Git/worktree integration, semantic handoff, and completion authority outside the adapter. Do not create `core/adapters/pi/` unless implementation evidence independently justifies it; readiness-only completion may retain the current static `.pi` and launcher surfaces.

## Plan
1. Build authoritative context from `designs/pi-adapter-readiness.md`, `docs/execution-contract.md`, launcher/package/.pi records, exact-version and registration implementations/tests, task-control/process/observability records, and relevant architecture guidance.
2. Inventory current static registration, package-owned registration, launcher invocation/preflight, model/thinking/session mapping, approval/trust profiles, evidence-validator isolation, dependencies, package boundaries, privacy surfaces, consumers, and rollback paths.
3. Compare the current surfaces against the smallest Pi adapter boundary and provider-free fixture matrix. Implement only missing bounded Pi-specific behavior when evidence demonstrates a concrete gap; otherwise record a readiness decision without creating a speculative adapter directory or package split.
4. Run focused package, launcher, worker-tool, process, task-control, observability, content, task-record, JSON, reference, whitespace, diagnostics, and final review validation as applicable.
5. Record the terminal decision and evidence, remove exactly the selected backlog row, and clean the paired root task artifacts in one scoped completion commit.

## Progress
Task selected after the execution-contract readiness decision retained the host-neutral observation contract in documentation and preserved current owners. Existing Pi-specific evidence is substantial: the pinned package contract, explicit `--no-extensions --extension` loading, static `.pi` settings, version preflight, model/thinking resolution, package registration validation, normal approval mapping, forced expert read-only profile, and path-free dry-run/public projections. Current architecture explicitly excludes task authority, process mechanics, Git/worktree integration, semantic handoff, observability authority, and emitted-path enforcement from a future Pi adapter.

## Validation
Pending inventory and focused reruns. Required evidence includes package registration tests, launcher exact-version/loading/approval/model/session tests, worker-tool registration and host-service tests, relevant process/task-control/observability regressions, task-record validation, content/navigation, backlog, JSON, reference, whitespace, diagnostics, and final configured-large review. A successful existing implementation may support a readiness-only decision; no new adapter directory is required by the task.

## Result
Pending.

## Blockers And Escalations
No blocker currently known. Do not create `core/adapters/pi/`, split the package, activate ambient extension discovery, broaden trust or approval, transfer task/process/Git/completion authority, or weaken emitted-path privacy without concrete provider-free compatibility evidence and bounded authorization. External effects remain prohibited.

## Recovery
The task-start handoff is recorded in root `as-is.json`, `tasks.md`, and the selected root backlog row. Preserve `.pi/settings.json`, `.pi/extensions/worker-tools.ts`, the package-owned registration export, the package manifest/lockfile, launcher explicit loading, and current task/process authority if interrupted. Revert only scoped candidate changes and restore the selected task/backlog pair before retrying completion.

## Next Action
Complete the current-surface inventory and run the existing provider-free Pi/package/launcher fixtures before deciding whether any implementation or only a readiness reconciliation is justified.
