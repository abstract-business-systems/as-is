# Repository-wide as-is JSON Migration

## Purpose

Complete the approved migration of all remaining legacy YAML-front-matter
component records to front-matter-free `as-is.md` durable context and colocated
`as-is.json` machine data.

## Requirement

Migrate every remaining inventory entry in
[`designs/as-is-json-migration.md`](designs/as-is-json-migration.md), including
owned agents, components, skills, designs, and validation fixtures. Preserve
human durable context, migrate any genuinely active task to local JSON metadata
and the configured front-matter-free narrative, remove completed task narratives
from durable records after retaining concise history, update direct consumers,
and retire YAML-front-matter runtime compatibility only when the inventory is
empty.

## Plan

1. Classify legacy records as durable-only, active-task, or fixture input.
2. Migrate durable-only records and fixture representations in bounded groups.
3. Update task-record validation and control-plane compatibility removal after
   all runtime/fixture consumers use the JSON companion contract.
4. Run the relevant deterministic, build, and live checks; record any recovery
   rule needed for multi-file task cleanup.

## Progress

Completed the repository-wide migration. All durable `as-is.md` records and
configured task narratives are front-matter-free; runtime task authority is in
`as-is.json.task`; the control plane, supervisor, launcher status join, task
validator, and repository-owned fixtures use the JSON companion contract.
Legacy YAML task inputs are rejected rather than interpreted.

## Validation

- All 162 first-party Bun tests ran: 141 passed, 21 provider-backed live tests
  were explicitly skipped, and 0 failed (734 assertions).
- `python3 -m unittest -v components/task-record-validator/test_task_record_validator.py`
  passed all 6 tests.
- `python3 components/task-record-validator/task_record_validator.py .` returned
  `VALID` against the active repository task tree.
- Bun no-output builds passed for the control plane and subprocess supervisor.
- Inventory scans found no YAML delimiter in `as-is.md` or task narratives and
  no remaining `as-is-version: 2` fixture literal outside deliberate rejection
  coverage. `git diff --check` passed.
- Provider-backed behavioral tests remain opt-in and were not run in the final
  deterministic suite; their fixture construction was compiled and exercised
  by Bun test discovery.

## Result

The approved companion-record migration is complete. JSON is the sole machine
task/configuration authority, durable Markdown contains component context only,
completed transient narratives were summarized in colocated changelogs, and
partial companion/narrative writes have a documented fail-closed recovery rule.

## Blockers And Escalations

None known. Stop only for a material schema, authority, compatibility, or
recovery decision that cannot be resolved from the approved target.

## Recovery

The root JSON foundation commit, migration design inventory, and each scoped
commit are recovery boundaries. Legacy compatibility must remain only until all
inventory entries and their test fixtures are migrated.

## Next Action

Record the completion summary, remove this transient task narrative and local
`as-is.json.task`, and commit the validated migration handoff.
