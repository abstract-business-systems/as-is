# Task

## Requirement
Establish readiness evidence for the repository-wide no-path-emission invariant highlighted by the user: absolute filesystem paths must never be emitted directly or indirectly through logs, traces, registry events, handles, diagnostics, tool results, or other execution metadata. Inventory current emitters, define the smallest shared redaction or opaque-reference boundary, assign implementation ownership, and identify provider-free regression fixtures without implementing the cross-component changes in this readiness task.

## Plan
1. Record the exact selected identity `root:emitted-path-privacy-readiness` and preserve the two-commit task lifecycle.
2. Inventory path-bearing execution surfaces across the launcher, recovery reconciliation, observability tracer, evidence tools, process adapter, and durable documentation.
3. Define the fixed safety invariant, approved internal-only path boundary, opaque logical reference policy, and failure behavior for direct, nested, configured, and component-derived paths.
4. Assign bounded follow-up ownership to the nearest components without creating a generic privacy framework or changing runtime behavior.
5. Validate documentation, JSON, backlog, navigation, and whitespace; obtain expert review; record completion evidence and clean only the exact selected root row and task artifacts.

## Scope And Constraints
In scope: root `backlog.md`, root `as-is.json`, root `tasks.md`, `docs/execution-contract.md`, `docs/design-principles.md`, `docs/configuration.md`, `core/modules/observability/as-is.md`, `tools/evidence/as-is.md`, `skills/spawning-pi-subagents/as-is.md`, and narrowly related design or backlog records required to establish the readiness contract. Out of scope: runtime sanitization implementation, launcher/registry/trace/tool behavior changes, target writes, external services, schema redesign, task authority changes, speculative shared privacy framework, component moves, descendants, and implementation of the future path-emission controls.

Acceptance:
- The invariant prohibits absolute filesystem paths and indirectly identifying component, worktree, session, log, task-record, and configured-directory paths from emitted execution metadata.
- Current emitter inventory names the owner, emission surface, path-bearing risk, and bounded follow-up for each affected owner.
- The smallest stable boundary distinguishes internal filesystem operands from emitted opaque logical references and defines fail-closed or unavailable behavior.
- Direct, nested, configured, and component-derived path fixture requirements are assigned to focused owner tests without runtime changes.
- Task-record, backlog, JSON, content/navigation, whitespace, diagnostics, and final expert validation pass; no speculative framework or implementation is introduced.

## Progress
The user identified an unconditional safety invariant after execution-contract readiness: absolute filesystem paths must never be logged directly or indirectly, including component paths. Initial inventory found path-bearing launcher handles and registry events, recovery observations, tracer attributes/configuration, and evidence-tool results. The readiness task will establish ownership and fixture requirements only; implementation follows separately bounded component tasks.

## Validation
Pending. Required checks are root task-record validation, JSON parsing, as-is/content navigation, backlog validation, `git diff --check`, changed-document diagnostics, and final configured large expert review. No runtime behavior or implementation test changes are authorized in this task.

## Result
Pending.

## Blockers And Escalations
No blocker currently. The invariant spans launcher, recovery, observability, and evidence surfaces, so implementation must be delegated or separately selected at each owning component; this readiness task cannot mutate those owners. If a single shared sanitizer would create a new cross-component authority, escalate that design choice rather than introducing it.

## Recovery
No descendants are authorized. If ownership or contract scope cannot be reconciled without implementation, record the blocker and leave the exact backlog row and active task pair intact. Restore the prior root configuration and planning records from the task-start commit if this readiness task is interrupted.

## Next Action
Create the task-start commit, then complete the bounded emitter inventory, privacy boundary, fixture mapping, and ownership handoff.