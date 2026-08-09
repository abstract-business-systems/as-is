---
name: managing-backlog
description: Maintains and prioritizes bounded component work in the repository backlog.
---

# Managing Backlog

Maintain the repository backlog as a planning index, not as task authority.
Backlog files use one stable recording table per component. A query may derive a
separate prioritization view; derived values are not written back to backlog
files.

## Backlog Item Schema

Each backlog item is one row in this table:

| Field | Meaning | Required |
| --- | --- | --- |
| `id` | Stable concise item identifier and slug | Yes |
| `status` | `open`, `selected`, or `deferred` | Yes |
| `user preference` | Integer recording the user's urgency or value input | Yes |
| `system preference` | Integer reasoned by the system from dependencies, correctness, risk, blocking value, and budget | Yes |
| `purpose` | Why the item exists | Yes |
| `description` | Bounded proposed work and desired result | Yes |
| `dependencies` | Zero or more `component:id` backlog-item references | Yes; use `-` when empty |
| `acceptance` | Observable completion signal | Yes |
| `notes` | Supporting context, rationale, assumptions, or migration provenance | No |

The owning component is derived from the directory containing the backlog file;
it is not duplicated in the recording table. A query adds that derived
`component` field to its representation.

Dependencies must use `component:id`, not an unscoped item name or free-form
sentence. When an existing dependency cannot be mapped confidently to a
backlog item, retain its original text in `notes` and leave the structured
`dependencies` cell as `-`; do not invent an identifier.

## User And System Preferences

`user preference` is attributable to the user and must not be silently
reinterpreted as task authority. During migration from the former string
priority field, use this deterministic mapping unless the user supplies a
replacement value:

| Former priority | User preference |
| --- | ---: |
| High | 3 |
| Medium | 2 |
| Low | 1 |
| Deferred or absent | 0 |

`system preference` is a model-reasoned planning input, not a claim that work
must start. Record the reasoning in `notes` when it is not obvious from the
item's dependencies, correctness risk, blocking value, or budget. A system
preference may be changed when evidence changes; changing it does not rewrite
the user's preference.

## Query-Time Prioritization

`weight` is deliberately not stored. A stored weight would require frequent
rewrites whenever status, dependencies, or another item's preference changes.
The deterministic query computes a base score and sorts the representation in
descending order:

```text
base(item) = status value + user preference + system preference
weight(item) = base(item) + sum(weight(dependent item))
```

The status values are:

| Status | Value | Reason |
| --- | ---: | --- |
| `open` | 0 | Available proposal |
| `selected` | 4 | Explicitly selected for task-management handoff |
| `deferred` | -2 | Deliberately held back |

The dependent **sum**, rather than an average, is the default. It elevates a
prerequisite that unblocks several valuable items; an average would hide that
fan-out. The query only follows dependencies whose referenced items are loaded,
uses a stable lexical tie-break, and handles cycles deterministically without
becoming a second task authority. A future bounded task may add caps or an
average view if real backlog size demonstrates that transitive fan-out
swamps direct value; do not add that complexity speculatively.

The representation produced by a query is the complete requested view:

| weight | component | id | status | purpose | description | dependencies | notes |
| ---: | --- | --- | --- | --- | --- | --- | --- |

Use `skills/managing-backlog/scripts/query.ts` for the deterministic query and
`skills/managing-backlog/query.test.ts` for focused schema, weighting, sorting,
view-limit, cycle, cleanup-evidence, representation-column, and repository-shape
checks. The representation
omits recording-only preferences and acceptance because it is an at-a-glance
prioritization view; the source table remains authoritative for those fields.
For a request such as “Show me the backlog, please.”, run the query and return
its rendered table verbatim (apart from a short planning-only preface), showing
the top 10 items by descending weight by default. This is a view limit, not a
change to the backlog or its weighting. If the user asks for another view, honor
that explicit bounded override; use `--all` for the complete table or
`--limit=N` for a different positive limit. Do not manually reconstruct,
abbreviate, or summarize the rows into another table. The response must include
all representation columns, especially `description`, `dependencies`, and
`notes`; a shortened summary table is not a valid backlog representation.
Validate a captured response with `validateQueryRepresentation` before treating
the display as complete.

## Cleanup Of Implemented Items

Backlog cleanup is a separate, evidence-gated operation. It may remove a row
only when all of the following are true:

| Condition | Required evidence |
| --- | --- |
| Ownership | The row belongs to the backlog file's component |
| Changelog | That component has its configured `changelog.md` |
| Identity | The changelog explicitly names the exact backlog `id` |
| Completion | The same changelog evidence uses a completion term such as completed, closed, finished, implemented, validated, or removed |
| Scope | Only the evidenced row is removed; neighboring rows and changelog history remain unchanged |

Do not infer completion from an old status, a matching description, a commit,
process exit, or a changelog entry for a similarly named item. If evidence is
ambiguous or belongs to another component, leave the row in place and report it
for review. Cleanup is not task management: it does not create completion
status, rewrite changelogs, or replace the reconciliation requirements above.

Run the deterministic cleanup with `cleanupCompletedBacklogs` via:

```bash
bun skills/managing-backlog/scripts/query.ts --cleanup .
```

The command reports each removed `component:id` and its changelog evidence. Use
version control or a focused diff to review the removal before handoff; the
cleaned item's concise history remains in the owning changelog.

## Priority And Project Sequence

The project-level sequence is decided by the system from the backlog as a
whole. It is dependency-aware: work is sequenced only after its required
dependencies are complete or otherwise available, and an available prerequisite
takes precedence over a dependent item when needed. The system may consider
query weight, readiness, scope, risk, value, and budget while preserving the
recorded user preference as an input rather than rewriting it.

Users influence the sequence by changing `user preference` or by making an
explicit reprioritization request. A request is a planning input, not an
instruction to bypass dependencies, component ownership, acceptance, or task
management. The system evaluates the request against those constraints and
records the resulting project-level sequence and rationale; it may decline or
delay the requested order when dependencies or boundaries require it.

## Selection Contract

| Condition | Required result |
| --- | --- |
| Component context | Owning `as-is.md` exists and is understood |
| User preference | User input and rationale reflect urgency, blockers, risk, intent, value, and budget |
| System preference | Reasoned input is attributable to dependencies, correctness, risk, blocking value, or budget |
| Sequence | System-decided project-level sequence accounts for dependencies and records why a requested order is accepted, delayed, or declined |
| Scope | Description, notes, and acceptance are bounded to the owning component |
| Hierarchy | A backlog may propose work within its own component boundary, but a descendant backlog cannot authorize changes to an ancestor, sibling, or shared boundary |
| Dependencies | Required inputs are named as `component:id`; uncertain mappings remain in notes |
| Selection | Invoke `implementing-component-tasks` with the selected item |

## Completion Reconciliation

The backlog remains planning-only: it may select and prioritize work, but it
is not authoritative for task status, validation, approvals, or runtime state.
Task management owns reconciliation and removal of a selected item. After the
configured task-management procedure verifies the handoff, it may remove the
item from the planning index only when all of these inputs agree:

| Reconciliation input | Required evidence |
| --- | --- |
| Selected item identity and ownership | The exact backlog `id`, owning component path, and selected acceptance match the task record and its component boundary |
| Acceptance | The completed task record contains observable validation evidence for every selected acceptance condition; evidence is not inferred from process exit or assertion |
| Terminal task | The owning configured task record is terminal `completed`, with its result and required validation recorded |
| Descendant closure | Every descendant is terminal and the completion result accounts for each failed or cancelled descendant; active, blocked, or approval-waiting descendants prevent removal |
| Changelog handoff | The owning component `changelog.md` contains a concise summary of the completed result, written before task-record cleanup |
| Durable scoped handoff | The declared changes are within the selected owning component and the scoped durable handoff has completed successfully |

Task management performs this reconciliation, then removes the selected item;
the implementation worker does not remove it. Reconciliation must use the
current task record and owning changelog as evidence and must not invent status,
validation, ownership, or completion. If any input is missing, mismatched,
non-terminal, failed, blocked, deferred, or otherwise incomplete, leave the
backlog item in place for recovery or later selection. Open and deferred items
remain in the planning index. Removal occurs only after reconciliation
succeeds, not merely because an invocation exited successfully.

## Boundaries

The backlog does not contain active status, worker checkpoints, approvals,
validation evidence, or runtime state. Those belong to the component's
transient configured task record (default `tasks.md`) while work is active and
its `changelog.md` after completion. A completed item is removed only by the
completion reconciliation above; retain its concise summary in the owning
component's `changelog.md`.

A backlog may not make a structural or authority decision outside its own
component boundary. The same rule applies at every hierarchy level: a
descendant backlog cannot affect an ancestor, sibling, or shared boundary merely
by containing a proposal. Broader changes belong in the nearest affected
ancestor backlog or an explicitly scoped design or architecture task.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Ownership | Component is derived from the backlog path and the owning `as-is.md` exists or is explicitly proposed |
| Schema | Every item has the stable table fields, integer preferences, enum status, and structured dependency references |
| Description and notes | Description states bounded work; notes preserve supporting context and any uncertain migration text |
| Preference and sequence | User preference is attributable; system preference is reasoned; query weight is derived, dependency-aware, and not stored |
| Scope | Bounded dependencies and acceptance conditions |
| Completion | Completed item is removed only after reconciliation; its summary is recorded in the owning `changelog.md` |
