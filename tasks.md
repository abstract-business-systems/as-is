# Task

## Current Task

### Requirement
Implement the selected root task `root:organize-tools-and-modules-by-capability` as a readiness-only inventory and staged migration proposal. Review existing implementation and registration surfaces across `core/modules/**`, `core/adapters/**`, `tools/**`, `.pi/extensions/**`, the package-owned spawning extensions and manifest/lock, launcher scripts, direct imports, static settings, and focused tests. Map each surface to canonical owner, responsibility, consumers, execution surface, host-neutral or host-specific classification, authority boundary, duplicate or competing path, compatibility constraint, and recovery path. Reconcile the established canonical grouping and nominate at most one smallest physical migration candidate only if its ownership, consumers, compatibility, regression, and rollback evidence are clear. Do not move files, rewrite imports, change runtime or registration behavior, split packages, create capabilities, alter task authority, write to hosts or targets, or create speculative execution-contract, Pi-adapter, task-facing-tool, browser, environment, setup, or standalone-host components.

### Context and Sequence
The completed execution-contract readiness and Pi-adapter readiness tasks satisfy the existing dependency and establish that current owners remain distinct. The repository's committed migration handoff defines the broader tools/modules organization as a later phase after those readiness decisions. Existing approved families include `core/modules/context-resolution`, `core/modules/task-control`, `core/modules/agent-resolution`, `core/modules/observability`, `core/adapters/process`, bounded `tools/agent`, `tools/context`, and `tools/evidence`, plus thin `.pi/extensions` registration and package-owned extension paths. This task must not imply that a shared execution-contract runtime API or `core/adapters/pi/` now exists.

### Acceptance
- A traceable inventory maps every in-scope implementation and registration surface to owner, responsibility, consumers, execution surface, authority, host classification, compatibility constraint, and recovery path.
- The inventory distinguishes host-neutral modules from host adapters; Pi registration from semantic tools; role declarations from tool implementations and admission; and package registration from repository host-services composition.
- Duplicate or ambiguous ownership is identified without treating static resemblance as proof that a path is removable.
- A recommended canonical grouping is recorded and at most one smallest follow-up physical migration candidate is nominated only if evidence supports it; otherwise physical migration is explicitly deferred.
- No source relocation, import rewrite, runtime or registration behavior change, package split, host write, task-authority change, or new capability occurs.
- Focused current-owner behavioral suites and structural/content, JSON, reference, whitespace, diagnostics, task-record, and final review checks pass.

### Constraints
- Worker: component-builder; root-owned coordination only.
- Wall-clock budget: 300 seconds with 60-second reserve; cost budget: USD 0.5 with USD 0.1 reserve; external effects prohibited.
- Maximum delegation depth: 0; maximum descendants: 0. Descendant closure is vacuously terminal.
- Preserve all current paths, imports, registrations, package pins, task authority, emitted-path privacy, and rollback surfaces until a separately authorized implementation task proves a move safe.

## Plan
1. Build authoritative context from the root/core/tools/launcher/Pi records, migration handoff, package metadata, direct imports, settings, and focused tests.
2. Inventory all in-scope implementation, registration, package, launcher, and test surfaces and classify ownership, consumers, execution, authority, compatibility, and recovery.
3. Reconcile the canonical grouping against current records and identify duplicate/ambiguous paths without deleting or moving anything.
4. Nominate at most one smallest physical follow-up only if the evidence is complete; otherwise record a bounded deferment.
5. Run focused behavioral and structural checks, obtain final read-only review, record completion evidence, and perform exact backlog/task cleanup.

## Progress
Task selected from the root planning index after completion of the execution-contract and Pi-adapter readiness boundaries. No implementation or registration changes are authorized. Initial review confirms established target families and that `.pi/extensions/` remains a thin Pi registration surface rather than a semantic tool owner.

## Validation
Pending inventory, focused current-owner regression checks, and final review.

## Result
Pending.

## Blockers And Escalations
No blocker currently known. If an unproven dynamic, generated, projected, external, or package consumer appears, retain current paths and registrations, record the evidence gap, and defer physical migration. Do not create new adapter/module/tool/capability surfaces to resolve an inventory gap.

## Recovery
The selection commit records the selected root row and this task record. Preserve current paths and registrations throughout. If inventory evidence is incomplete or contradictory, leave the task active or blocked with the latest durable findings; do not nominate a physical move. If the readiness-only reconciliation is abandoned, revert only the scoped inventory/proposal and record changes.

## Next Action
Complete the bounded inventory and record its result in the root changelog before exact backlog cleanup and task-artifact removal.
