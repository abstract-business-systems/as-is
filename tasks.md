# Task

## Requirement
Implement `normalize-nested-delegation-telemetry` across the root-coordinated agent, observability, evidence, and dummy-delegation surfaces. Make nested delegation identities runtime-owned with shared run inheritance and fresh per-call traces; correct budget observation units; use `durationMs` for in-process result elapsed time; and preserve safe malformed or unavailable observation metadata without retaining rejected values.

## Plan
1. Update the in-process delegation producer and deterministic tests for runtime-owned identity, task context observations, distinct duration and budget fields, and nested lineage.
2. Harden tracer projection and local/evidence projection for allowlisted malformed and unavailable observations, including milliseconds and USD unit mappings.
3. Extend the provider-free and gated dummy-delegation checks, then run focused tests, builds, task validation, content checks, and whitespace validation.

## Progress
Task started from the selected root backlog item after read-only expert review. Scope is limited to `tools/agent`, `core/modules/observability`, `tools/evidence`, and `validation-fixtures/dummy-delegation`; the untracked capability-probe fixture remains untouched. No descendants are authorized.

## Validation
Pending implementation.

## Result
Pending implementation.

## Blockers And Escalations
None.

## Recovery
If interrupted, preserve the root task pair and scoped changes. Do not modify the untracked `agents/agent-capability-probe/` fixture. Resume from the latest validation checkpoint; keep provider-backed validation gated and do not broaden into launcher, provider identity, Collector, or task-authority changes.

## Next Action
Implement the bounded telemetry normalization changes and validate each acceptance condition.
