# Task

## Purpose
Bring the repository's physical implementation layout toward the approved structure in `designs/core-modules-tools-and-skills.md` through a prudent, ownership-preserving migration of families whose boundaries and consumers are sufficiently established.

## Requirement
Restructure the approved implementation families toward `agents/`, `skills/`, `core/modules/`, `core/adapters/`, and `tools/` without changing task authority, host setup, target writes, or runtime semantics. Move agent-resolution functionality into `core/modules/agent-resolution/`, observability implementation into `core/modules/observability/`, the detached process boundary into `core/adapters/process/`, and bounded agent-facing tool implementations into `tools/` with thin `.pi/extensions/` registration adapters preserved where host entry points require them. Keep execution-contract, host-setup, browser, environment inventory, package-owned extension, and speculative broad regrouping separate unless the evidence shows the smallest safe move in this task.

## Plan
1. Inventory current tracked paths, proven imports, package/host entry points, component records, and target naming conventions.
2. Create the task-start commit with selected backlog state, active task artifacts, and the bounded migration contract.
3. Move the established agent-resolution, observability, process-supervisor, and worker-tool implementation families with history-preserving paths; update proven imports, package/host entry points, tests, and durable navigation atomically.
4. Validate focused tests/builds, task records, content/navigation, JSON, stale-path searches, and whitespace; obtain expert review.
5. Record owning changelog evidence, remove the exact backlog row, delete task artifacts, and create the second completion commit.

## Scope
In scope: the proven agent-resolution implementation and tests; the tracer implementation and focused tests/design record; the bounded process adapter implementation and tests; the bounded worker-tool implementations and tests; `.pi` host registration adapters/settings where required; affected component, skill, agent, core, tools, adapter, architecture, changelog, and root navigation records; root task and backlog lifecycle artifacts.

Out of scope: task schema or task authority changes; execution-contract abstraction; setup replacement; host integration implementation; browser capability; environment inventory; target writes or installation; package-owned extension relocation; broad component removal; speculative `tools/` subfamilies without a bounded owner; runtime semantic changes.

## Acceptance
- The approved physical families are represented under `core/modules/agent-resolution/`, `core/modules/observability/`, `core/adapters/process/`, and bounded `tools/` subdirectories with focused tests and durable ownership records.
- `.pi/extensions/` remains only as a host registration/compatibility surface where required; its implementation delegates to the new owners.
- Proven imports, package scripts, Pi settings, tests, links, and durable records are updated; stale executable paths are absent except for explicitly recorded historical evidence.
- Focused agent-resolution, tracer, process-supervisor, worker-tool, launcher, linked-context, task-control, orientation, and relevant behavioral tests/builds pass or known unrelated baseline failures are explicitly recorded.
- Task-record validation, content/navigation, JSON, structural/reference, and whitespace checks pass; expert review approves the scoped migration; no descendants are authorized; final worktree is clean.

## Progress
Task selected from the user's explicit request. The repository currently has `core/modules/context-resolution/` and `core/modules/task-control/`, while agent resolution, observability, process supervision, and agent-facing tools remain under skill/component/`.pi` locations. The design document records the target families but also contains historical readiness language; this task will reconcile current durable records as part of the physical migration.

## Validation
Pending task-start commit, physical moves, focused regression checks, durable-record reconciliation, expert review, and completion commit.

## Result
Pending.

## Blockers And Escalations
Do not cross an ownership boundary merely to fill the target tree. If execution-contract ownership, host adapter ownership, package entry-point compatibility, or tool subfamily boundaries cannot be established within scope, preserve the current path and record the residual risk rather than creating speculative structure.

## Recovery
Before each move, retain the tracked-path inventory and verify the destination is absent or explicitly approved. If an interrupted move or validation failure occurs, restore the prior paths and proven imports from the same task state before retrying. Preserve `.pi` entry-point compatibility and do not delete legacy artifacts until the new owner and host adapter validate. If completion finalization fails, restore the active task, task artifacts, and exact backlog row before retry.

## Next Action
Inspect and record the current consumer map, then make the first task-start commit before physical relocation.
