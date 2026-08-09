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

Active repository-wide migration authorized by the user. The root JSON
foundation is complete in `5e2ee52`; observability completed its owner-scoped
migration in `1853e0f`.

## Validation

Pending final inventory-empty scan and full relevant regression suite.

## Blockers And Escalations

None known. Stop only for a material schema, authority, compatibility, or
recovery decision that cannot be resolved from the approved target.

## Recovery

The root JSON foundation commit, migration design inventory, and each scoped
commit are recovery boundaries. Legacy compatibility must remain only until all
inventory entries and their test fixtures are migrated.

## Next Action

Classify and migrate the remaining legacy records and their direct consumers.
