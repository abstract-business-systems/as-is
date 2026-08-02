# Backlog

This is a planning index, not task authority. Active work is owned by the
relevant component `task.md`; durable component context remains in `as-is.md`.
Completed items are removed after their concise summary is recorded in the
owning component's `changelog.md`; this index retains only open or selected
planning items.

## Items

| ID | Priority | Component | Status | Outcome |
| --- | --- | --- | --- | --- |
| deterministic-skills | High | `skills/` and `.agents/` | open | Build deterministic skills and scripts for existing agents and skills. |
| task-record-validator-bun | Medium | `components/task-record-validator/` | open | Translate the validator to dependency-free Bun/TypeScript with focused parity validation. |
| jaeger-support | Medium | tracing components | open | Configure and verify local Jaeger support and bounded trace queries. |
| trace-retention | Low | tracing components | open | Add local JSONL rotation, retention, and size limits. |
| trace-e2e | Low | tracing components | open | Add end-to-end tracing coverage across sessions, workers, and detached subprocesses. |
| jaeger-collector | Deferred | tracing components | open | Add a Collector only if direct export demonstrates a concrete need. |
| presentation-guidance | Medium | `skills/structuring-content/` and agent roles | open | Apply information-shaped Markdown and live-response presentation guidance to existing skills and agents. |
| building-components | High | `skills/`, `.agents/agents/component-builder/` | open | Evaluate and, if accepted, consolidate component-task implementation, completed-work committing, and reusable component-builder flow into a `building-components` skill without merging role identity into procedure logic. |
| parent-integration-handoff | High | root/as-is flow | open | Define and validate an explicit parent integration/handoff step for delegated component commits, including scoped commit attribution and durable child-record evidence before parent completion. |
| as-is-routed-current-session-delegation | High | `.agents/agents/as-is/`, `skills/as-is/` | open | Prevent direct current-session delegation: route all substantive delegation through the as-is flow, with authority, configured-role, budget, and repository-boundary checks recorded before launch. |
| all-in-tracing-design | High | tracing components and `designs/` | open | Design an all-in execution trace model covering useful lifecycle, task, job, worker, supervisor, and outcome information while preserving task/job authority distinctions; explicitly define privacy, security, redaction, retention, access, and failure-mode controls before implementation. |
| richer-trace-observability | Medium | tracing components | open | Extend trace observability to expose complete useful execution context and bounded queries only after the all-in design and privacy/security/retention/redaction acceptance criteria are approved; do not treat current best-effort event emission as full capture. |

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
| Tracing | Telemetry is supplementary and never replaces task records, validation, recovery, or completion authority. All-in tracing is a design direction/backlog item, not an implementation claim; task paths remain authoritative and runtime JobIds remain diagnostic aliases. |
| Delegation and handoff | Substantive current-session delegation is routed through as-is; parent integration requires durable child evidence and scoped commit attribution before completion. |
| Trace safety | Future all-in capture must explicitly address privacy, security, redaction, retention, access control, and failure behavior; no sensitive or unbounded session content is implied by the backlog item. |
| Configuration | Root `as-is.md` is the sole project configuration source; `docs/configuration.md` documents its structure. |
| Presentation | `skills/structuring-content/SKILL.md` owns representation and live-response guidance; design principles state the broad preference. |
| Component building | `building-components` may own reusable build, completion, and handoff flow; `component-builder` remains the role boundary. |
| Completion | Remove completed items from this index after recording their concise summary in the owning component's `changelog.md`. |
