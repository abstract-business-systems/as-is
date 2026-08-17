# Changelog

- 2026-08-24: Completed the documentation-ownership reconciliation in one atomic local change. Established `core/contracts/` as the normative contract collection, moved repository-wide design principles to `design-principles.md`, moved OpenCode material to draft `opencode-adapter-readiness.md`, consolidated host-integration planning into this aspirational handoff, disbanded the former `docs/`, `host-integration/`, and root `agent-skills.md` artifacts, and retained implementation ownership in existing modules, adapters, skills, and roles. Validation passed: task-record `VALID`, as-is/content validation (48 records, 46 diagrams), focused owner suites, `git diff --check`, and diagnostics for new records.

- Completion evidence: `root:aspirational-architecture-handoff` completed. Added a durable current-to-future architecture handoff covering execution-contract, Pi adapter, task-facing tools, setup replacement, host integration, browser capability, environment inventory, package-host boundaries, standalone worker hosting, and broader tools/modules regrouping. Each item has proposed ownership, bounded responsibility, sequencing/readiness gates, a distinct recovery boundary, and explicit non-authorizations. Reconciled the dissolved `components/` wording and clarified that workflows are runtime outcomes rather than a repository directory. Validation passed: task-record `VALID`; as-is/content navigation (49 records, 47 diagrams); backlog content; JSON; reference and Mermaid source checks; `git diff --check`; and final configured large expert review. No runtime, host, target, package, browser, environment, schema, authority, or physical migration behavior changed.

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
