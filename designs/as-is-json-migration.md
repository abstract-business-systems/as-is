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
configuration. The control plane and task-record validator read JSON-backed tasks with a
front-matter-free narrative. Legacy YAML task records are rejected rather than
silently interpreted.

A JSON-backed task update writes its companion and narrative separately. The
companion is authoritative machine metadata and the narrative is explicit
human evidence, but this remains a recoverable—not crash-atomic—multi-file
operation. A missing narrative with a present `task` is an invalid task state
that blocks control-plane execution until a worker restores the narrative from
Git/history or records a new bounded task; a narrative without `task` is
non-authoritative stray text and must not be executed. Completion cleanup has
the same recovery rule in reverse: retain the companion/task or restore the
narrative before claiming completion. No implementation claims multi-file
atomic cleanup.

## Migration Completion Gate

All repository durable `as-is.md` records are front-matter-free. Central runtime
consumers reject legacy YAML task records, and repository-owned behavioral,
integration, supervisor, launcher, validator, and delegation fixtures use JSON
companions with front-matter-free task narratives. Legacy YAML compatibility is
retired; deliberate rejection tests remain as regression coverage.
