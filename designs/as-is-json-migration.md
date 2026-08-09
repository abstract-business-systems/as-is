# as-is JSON Companion Migration

## Target

The migration separates machine data from human Markdown without removing the
human-facing component map:

| Artifact | Role |
| --- | --- |
| `as-is.md` | durable human purpose, design, boundary, and explicit links; no YAML front matter |
| `as-is.json.configuration` | durable machine configuration; cascades only through the approved resolver view |
| `as-is.json.task` | local transient machine task metadata; never cascades |
| configured task Markdown file | human transient task narrative; no YAML front matter |
| `backlog.md` | human unstarted planning |
| `changelog.md` | human concise completed history |

The companion's `task` object owns status, worker, update timestamp,
constraints, and acceptance. The task Markdown file owns the explanatory
Requirement, Plan, Progress, Validation, Result, Blockers And Escalations,
Recovery, and Next Action sections. Completion removes both the task narrative
and local `task` object after concise history is retained.

## Foundation Implemented

The root companion is now the project configuration authority. The shared
`as-is-data` parser validates JSON roots and present `configuration`/`task`
objects. The resolver cascades only `configuration`; task metadata remains
local. The launcher resolves root project context, model policy, configured
task name, and tracing data from root `as-is.json`. The tracer reads JSON
configuration. The control plane reads a root JSON-backed task with a
front-matter-free narrative while retaining legacy YAML task-record compatibility
for unmigrated components.

A JSON-backed task update writes its companion and narrative separately. This
is recoverable because the companion is authoritative metadata and the
narrative is explicit durable evidence, but it is not a multi-file atomic
transaction. A later completion/migration task must add a bounded recovery rule
or transactional protocol before claiming crash-atomic task cleanup.

## Remaining Legacy Inventory

The following records still begin with YAML front matter and require migration
by their owning components; they are not authorized for bulk editing by the root
foundation task:

- `agents/as-is.md`, `agents/component-builder/as-is.md`,
  `agents/execution-advisor/as-is.md`, and `agents/worker/as-is.md`.
- `components/budget-control/as-is.md`, `components/control-plane/as-is.md`,
  `components/observability/as-is.md`,
  `components/subprocess-execution-foundation/as-is.md`, and
  `components/task-record-validator/as-is.md`.
- `designs/as-is.md` and `.pi/prompts/as-is.md`.
- `skills/as-is.md`, `skills/context-building/as-is.md`,
  `skills/exploring-execution-evidence/as-is.md`,
  `skills/implementing-component-tasks/as-is.md`,
  `skills/maintaining-components/as-is.md`, `skills/managing-backlog/as-is.md`,
  `skills/spawning-pi-subagents/as-is.md`,
  `skills/structuring-content/as-is.md`, and
  `skills/verification-discipline/as-is.md`.
- `validation-fixtures/dummy-delegation/as-is.md`,
  `validation-fixtures/increment-5-dogfood/as-is.md`,
  `validation-fixtures/increment-6-recovery-fixture/as-is.md`, and
  `validation-fixtures/opencode-mediation-dogfood/as-is.md`.

Each listed record is a known legacy compatibility source, not an exception to
the root JSON authority. Its legacy prose or front matter may still describe
former `as-is.md` configuration/task behavior until its owning component
migrates it; central consumers must not use those claims as current project
configuration authority. Each migration must preserve only active task machine
metadata in its local companion, move completed facts to its changelog, remove
front matter from Markdown, update its fixture/test expectations, and retain
independent component ownership. After this inventory is exhausted, a separately
authorized retirement task may remove YAML compatibility from the control plane
and validator.
