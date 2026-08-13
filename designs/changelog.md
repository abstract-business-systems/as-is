# Changelog

- 2026-08-02: Added `model-simplicity-guidance.md`; its bounded implementation item is recorded and linked in the root `backlog.md`.
- 2026-08-02: Merged the completed execution-accounting design task into this Designs component. The permanent design remains authoritative at `execution-accounting-design.md`; the task was design-only, and a future implementation requires a new bounded task under the responsible component.
  - Defined `component-path/task-revision/attempt` as durable observation identity and removed runtime JobId authority from current task context.
  - Defined private supervisor JobId-map persistence, restart reconciliation, expiry, component-path status, and diagnostic-only JobId behavior.
  - Defined cost, wall-clock, build/failure, parent/child, retry/recovery, and full-invocation versus worker-subtree ownership.
  - Preserved the OpenCode adapter/generic supervisor separation and retired systemd lineage without modifying runtime implementation.
  - Recorded design fixtures for two attempts, retry/recovery, unavailable money, measured time, parent/child delegation, build outcomes, overlapping attribution boundaries, and JobId-map restart.
  - Validation passed the task-record validator, focused supervisor and control-plane tests, reference checks, and `git diff --check`; historical measured values remained source-labelled, and unavailable values were not converted to zero.
- 2026-07-30: Resolved independent delegation's budget holder as the per-child detached supervisor and retained child self-limiting for unobservable provider cost.

## 2026-08-15 — Legacy record migration

- **Component:** Designs.
- **Result:** The per-child detached supervisor is the authoritative budget holder for independent delegation. The prior open decision is closed, with cost self-limiting explicitly retained as a host-observability limitation.
- **Validation retained:** Focused design-reference searches found no active `as-is -> orchestrator -> implementer` chain in the grouped designs after updating the remaining orchestration reference. `git diff --check` passed. No runtime files or sibling component records are changed.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.
