# Backlog

This is a planning index, not task authority. Active root work is owned by
`tasks.md`; durable component context remains in `as-is.md`. Component task
records use the configured filename, currently `tasks.md`.
Completed items are removed after their concise summary is recorded in the
owning component's `changelog.md`; this index retains only open or deferred
items. Record filenames are configured through `config.records.filenames` in
root `as-is.md`; this repository uses `backlog.md`, `changelog.md`, and
`tasks.md`.

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

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| skills-agents-separation-migration | deferred | 2 | 2 | Establish the approved separation of reusable skills and authority-bearing agents | Implement the approved separation in bounded descendant tasks only after the planning record establishes contracts, dependencies, and acceptance evidence. Approach: Depends on `skills-agents-separation-plan`; requires explicit activation in a new root task record and component-owned child records. | - |  |  |



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
| Authority | This file is a planning index; active root state belongs to the root `tasks.md`; other components use their configured local task record. |
| Hierarchy | A descendant backlog does not authorize changes to this backlog's scope, an ancestor, a sibling, or a shared boundary. Broader structural or authority decisions must be recorded in the nearest affected ancestor backlog; descendant backlogs may hold linked bounded follow-ups only after that decision. |
| Context | Component purpose and design belong to component `as-is.md`. |
| History | Completed summaries belong to component `changelog.md`. |
| Tracing | Telemetry is supplementary and never replaces task records, validation, recovery, or completion authority. |
| Configuration | Root `as-is.md` is the sole project configuration source; `docs/configuration.md` documents its structure. Record filenames are configured at `config.records.filenames`. |
| Completion | Remove completed items from the owning component backlog after recording their concise summary in the owning component's `changelog.md`. |
| Budget and recovery | Child allocations subtract parent spent use and reserve; excess cost or wall-clock requirements bubble to a durable approval/blocker. Failed, cancelled, or budget-stopped descendants remain accounted for and do not silently trigger duplicate attempts. |
| Integration | Child commits remain recoverable source evidence; the parent consolidates related worktree commits into one scoped integration commit before merging into the original branch and records source/result SHAs. |
