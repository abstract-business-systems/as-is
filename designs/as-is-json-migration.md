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

## Migration Completion Gate

All repository durable `as-is.md` records are now front-matter-free. Remaining
migration work is limited to runtime and test-fixture compatibility: replace
legacy YAML task fixtures and their consumers with `as-is.json.task` plus
front-matter-free configured narratives, then remove YAML task-record parsing
from the control plane and validator. That retirement must preserve deterministic
fixture coverage and define the bounded recovery behavior for separate companion
and narrative writes before claiming crash-atomic cleanup.
