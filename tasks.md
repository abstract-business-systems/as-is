# Task

## Requirement
Establish readiness evidence for a future host-specific Pi adapter boundary. Inventory the static `.pi/extensions` registration surface, the package-owned extension boundary, launcher loading and exact Pi-version behavior, trust and approval controls, dependency and distribution assumptions, compatibility and rollback paths, and the fixed no-emitted-filesystem-path invariant. Define the smallest host-adapter ownership boundary without creating `core/adapters/pi/` or changing runtime behavior.

## Plan
1. Record the exact selected identity `root:pi-adapter-readiness` and preserve the two-commit task lifecycle.
2. Inventory `.pi/extensions/`, `skills/spawning-pi-subagents/extensions/`, package manifest/lockfile, launcher loading, Pi-version preflight, trust/approval, and evidence-validator isolation.
3. Reconcile the future adapter boundary with `docs/execution-contract.md`, the aspirational handoff, package-owned records, and current process/task-control ownership.
4. Define provider-free fixture requirements for loading, exact version compatibility, trust/approval, package self-containment assumptions, rollback, and emitted-path privacy without changing implementation.
5. Validate records and content, obtain expert review, record completion evidence, and clean only the exact selected backlog row and task artifacts.

## Scope And Constraints
In scope: root `backlog.md`, root `as-is.json`, root `tasks.md`, `docs/execution-contract.md`, `designs/aspirational-architecture-handoff.md`, `skills/spawning-pi-subagents/as-is.md`, `skills/spawning-pi-subagents/SKILL.md`, package manifest and lockfile, `.pi` registration records, and narrowly related durable records required for readiness evidence. Out of scope: creating `core/adapters/pi/`; moving or renaming files; changing launcher, Pi, provider, package, registration, trust, approval, task, process, host, path-emission, target, or runtime behavior; package splitting; target writes; external services; descendants.

Acceptance:
- Current Pi registration, package, launcher-loading, exact version, dependency, trust/approval, and evidence-validator boundaries are inventoried with authoritative sources and consumers.
- The smallest future Pi adapter boundary is explicit and remains host-specific, while task-control, process mechanics, execution-contract vocabulary, path-emission safety, and completion authority remain outside it.
- Provider-free fixture requirements cover supported loading, exact version mismatch/unavailability, trust/approval behavior, package/self-containment assumptions, rollback, and emitted-path privacy without adding implementation.
- Compatibility and recovery preserve the static `.pi` adapter and current package path until replacement evidence passes; no speculative directory or package split is authorized.
- Task-record, backlog, JSON, content/navigation, whitespace, diagnostics, and final expert validation pass.

## Progress
The execution-contract readiness task is complete. The aspirational handoff identifies a future `core/adapters/pi/` boundary, while the current implementation remains split between `.pi/extensions/worker-tools.ts`, the package-owned `skills/spawning-pi-subagents/extensions/worker-tools.ts`, and the launcher. The exact Pi `0.84.0` contract, package dependencies, explicit `--no-extensions` loading, project trust flags, fixed expert profile, and path-emission invariant are existing evidence. This task will document readiness and fixture requirements only.

## Validation
Pending. Required checks are root task-record validation, JSON parsing, as-is/content navigation, backlog validation, `git diff --check`, changed-document diagnostics, and final configured large expert review. No runtime or implementation tests are authorized to change in this readiness task.

## Result
Pending.

## Blockers And Escalations
No blocker currently. Independent installed-package worker semantics remain out of scope and lower-preference. If adapter ownership would require moving task authority, process lifetime, provider policy, package services, or emitted-path enforcement into the adapter, record a blocker rather than broadening this readiness task.

## Recovery
No descendants are authorized. Preserve the static `.pi` registration path, package export, launcher loading route, and current task records if this task is interrupted. Restore the selected backlog row and task pair from the task-start commit before retrying completion.

## Next Action
Create the task-start commit, then complete the bounded Pi adapter ownership inventory, fixture mapping, and recovery handoff.