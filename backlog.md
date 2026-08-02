# Backlog

This is a planning index, not task authority. Active work is owned by the
relevant component `task.md`; durable component context remains in `as-is.md`.

## Items

| ID | Priority | Component | Status | Outcome |
| --- | --- | --- | --- | --- |
| deterministic-skills | High | `skills/` and `.agents/` | open | Build deterministic skills and scripts for existing agents and skills. |
| split-backlog-tasks | High | `skills/` | completed | Separate backlog prioritization from component-task implementation. |
| root-frontmatter-config | Medium | `docs/` and root | completed | Keep project configuration values in root `as-is.md`; document structure only in `docs/configuration.md`. |
| task-record-validator-bun | Medium | `components/task-record-validator/` | open | Translate the validator to dependency-free Bun/TypeScript with focused parity validation. |
| jaeger-support | Medium | tracing components | open | Configure and verify local Jaeger support and bounded trace queries. |
| trace-retention | Low | tracing components | open | Add local JSONL rotation, retention, and size limits. |
| trace-e2e | Low | tracing components | open | Add end-to-end tracing coverage across sessions, workers, and detached subprocesses. |
| jaeger-collector | Deferred | tracing components | open | Add a Collector only if direct export demonstrates a concrete need. |
| presentation-guidance | Medium | `skills/structuring-content/` and agent roles | open | Apply information-shaped Markdown and live-response presentation guidance to existing skills and agents. |
| building-components | High | `skills/`, `.agents/agents/component-builder/` | open | Evaluate and, if accepted, consolidate component-task implementation, completed-work committing, and reusable component-builder flow into a `building-components` skill without merging role identity into procedure logic. |

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
| Configuration | Root `as-is.md` is the sole project configuration source; `docs/configuration.md` documents its structure. |
| Presentation | `skills/structuring-content/SKILL.md` owns representation and live-response guidance; design principles state the broad preference. |
| Component building | `building-components` may own reusable build, completion, and handoff flow; `component-builder` remains the role boundary. |
