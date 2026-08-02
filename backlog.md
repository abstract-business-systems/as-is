# Backlog

This is a planning index, not task authority. Active work is owned by the
relevant component `task.md`; durable component context remains in `as-is.md`.
Completed items are removed after their concise summary is recorded in the
owning component's `changelog.md`; this index retains only open or deferred
items. Record filenames default to `backlog.md`, `changelog.md`, and `task.md`
and are configurable through `config.records.filenames` in root `as-is.md`.

## Items

The following items are now owned by component backlogs and are intentionally
not repeated here:

- Skills: `skills/backlog.md` (`deterministic-skills`, `presentation-guidance`,
  `building-components`, `as-is-routed-current-session-delegation`).
- Task-record validator: `components/task-record-validator/backlog.md`
  (`task-record-validator-bun`).
- Observability: `components/observability/backlog.md` (Jaeger, tracing,
  Collector, all-in design, and richer observability items).

Remaining root-owned planning items:

| ID | Priority | Component | Status | Outcome | Approach |
| --- | --- | --- | --- | --- | --- |
| parent-integration-handoff | High | root/as-is flow | open | Define and validate an explicit parent integration/handoff step for delegated component commits, including scoped commit attribution and durable child-record evidence before parent completion. | First map current launcher, task protocol, and commit procedure; specify the handoff evidence contract; add focused fixture/checks; then validate a delegated child integration without changing unrelated components. |

## Prioritization

| Priority | Selection rule |
| --- | --- |
| High | Required by authority, blocks work, or addresses material correctness/recovery risk. |
| Medium | Explicit user intent or meaningful value with bounded dependencies. |
| Low | Useful improvement that does not block higher-priority work. |
| Deferred | Not selected until stated evidence exists. |

## Decisions And Boundaries

| Decision | Rule |
| --- | --- |
| Authority | This file is a planning index; active state belongs to component `task.md`. |
| Context | Component purpose and design belong to component `as-is.md`. |
| History | Completed summaries belong to component `changelog.md`. |
| Tracing | Telemetry is supplementary and never replaces task records, validation, recovery, or completion authority. |
| Configuration | Root `as-is.md` is the sole project configuration source; `docs/configuration.md` documents its structure. Record filenames are configured at `config.records.filenames`. |
| Completion | Remove completed items from the owning component backlog after recording their concise summary in the owning component's `changelog.md`. |
