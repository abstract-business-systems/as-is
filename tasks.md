---
as-is-version: 2
task:
  status: active
  worker: component-builder
  updated: 2026-08-04T02:00:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.90
    spent: 0.00
    reserve: 0.10
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 600
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Orient reads durable as-is.md plus transient tasks.md without mismatch.
  - Worker role can implement bounded changes without committing; expert role is read-only and uses large preset.
  - call_subagent permits only project-controlled worker or expert roles.
  - Component-builder requires expert validation before commit.
---
# Task

## Requirement
Align the task and backlog model: retain a transient `tasks.md` record for current work; keep `as-is.md` limited to durable component purpose, design, boundaries, constraints, and links; make backlog, changelog, and task record filenames configurable; classify work under owning component backlogs; and record the staged approach for delegation, handoff, all-in observability, and later privacy controls without implementing those backlog items yet.

## Plan
1. Preserve `as-is.md` as infrequently changed durable component context and retain the transient `tasks.md` task record.
2. Make `backlog.md`, `changelog.md`, and `tasks.md` configurable, with the current defaults explicit.
3. Keep delegation as the responsibility of the as-is agent, not the launcher/process; fix direct-session routing and parent integration before resuming delegated implementation.
4. Define parent waiting as waiting only for required descendants: children named by acceptance/dependency edges, with independent siblings parallelizable and optional diagnostics non-blocking.
5. Implement all-in observability in stages: stabilize the event model and capture path first; schedule privacy, redaction, retention, and access controls after that foundation, before raw capture is enabled broadly.
6. Keep trace-related work under `components/observability/backlog.md`; do not implement the remaining backlog items in this task.

## Progress
Root task is active. Backlog ownership is aligned and the configured `tasks.md` record is retained. The as-is agent owns delegation decisions; the launcher now rejects unauthorized component-builder launches. Parent integration, delay measurement, all-in observability, and privacy work remain planned, not implemented.

## Validation
- Pre-change protocol and task records inspected.
- Added an authorization guard to the launcher: only `as-is` may launch component-builder, and only component-builder may launch worker/expert.
- Added focused launcher dry-run tests for unauthorized and authorized component-builder callers.
- `bun test components/control-plane/control-plane.test.ts skills/as-is/scripts/orient.test.ts components/observability/tracer.test.ts` passed: 6 tests.
- `bun build --no-bundle --target bun` passed for orient.ts and control-plane.ts.
- `git diff --check` passed.
- Read-only expert validation initially failed on deterministic-skills wording and contradictory stale task handoff; both corrected.
- Final read-only expert validation passed against committed HEAD `f513a5939cc3af002b1e3a0194bff180da8e7b76`.
- `git diff --check` passed; focused orient and observability tests passed (1 and 2 tests respectively).
- Host-reported child cost unavailable; child wall-clock was observed by launcher but no cost estimate is claimed.

## Result
Completed implementation and scoped commit: durable component backlogs and root planning index are aligned without implementing remaining backlog items. The transient record is intentionally retained active per the user request.

## Blockers And Escalations
None. Expert validation passed. Child commits were integrated as scoped commits; the root policy change remains in this task's handoff.

## Recovery
Resume from the current task record and the scoped diff if commit preparation is interrupted. Child durable summaries are already committed.

## Next Action
Run the focused launcher authorization tests, then define and implement the parent integration/handoff contract and delay instrumentation directly. Do not delegate remaining backlog work until these fixes are complete.
