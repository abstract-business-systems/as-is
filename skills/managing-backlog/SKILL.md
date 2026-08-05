---
name: managing-backlog
description: Maintains and prioritizes bounded component work in the repository backlog.
---

# Managing Backlog

Maintain the repository backlog as a planning index, not as task authority.

## Backlog Item Schema

| Field | Meaning | Required |
| --- | --- | --- |
| `id` | Stable concise item identifier | Yes |
| `priority` | User-provided urgency/value input | Yes |
| `component` | Owning component path | Yes |
| `description` | Bounded work proposal and desired result | Yes |
| `notes` | Supporting context, rationale, or constraints | No |
| `dependencies` | Required completed inputs | When applicable |
| `acceptance` | Observable completion signal | Yes |
| `status` | `open` or `selected` | Yes |

## Priority And Project Sequence

`priority` is supplied by the user. It records the user's urgency or value
judgment; backlog management must not silently reinterpret it as an authority
to start work. The project-level `sequence` is decided by the system from the
backlog as a whole. It is dependency-aware: work is sequenced only after its
required dependencies are complete or otherwise available, and an available
prerequisite takes precedence over a dependent item when needed. The system may
also consider readiness, scope, risk, value, and budget when producing the
sequence, while preserving the recorded user priority as an input rather than
rewriting it.

Users influence the sequence by changing an item's priority or by making an
explicit reprioritization request. A request is a planning input, not an
instruction to bypass dependencies, component ownership, acceptance, or task
management. The system evaluates the request against those constraints and
records the resulting project-level sequence and rationale; it may decline or
delay the requested order when dependencies or boundaries require it.

## Selection Contract

| Condition | Required result |
| --- | --- |
| Component context | Owning `as-is.md` exists and is understood |
| Priority | User-provided priority and its rationale reflect urgency, blockers, risk, intent, value, and budget |
| Sequence | System-decided project-level sequence accounts for dependencies and records why a requested order is accepted, delayed, or declined |
| Scope | Description, notes, and acceptance are bounded to the owning component |
| Hierarchy | A backlog may propose work within its own component boundary, but a descendant backlog cannot authorize changes to an ancestor, sibling, or shared boundary. Work that changes a directory structure, source-tree convention, or authority beyond the owning component must be proposed and accepted in the nearest affected ancestor backlog; descendant backlogs may be referenced as bounded follow-ups only after that ancestor decision |
| Dependencies | Required inputs are named; their availability is reflected in the system-decided sequence or remains open |
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
remain in the planning index. Removal occurs only after reconciliation succeeds,
not merely because an invocation exited successfully.

## Boundaries

The backlog does not contain active status, worker checkpoints, approvals,
validation evidence, or runtime state. Those belong to the component's transient
configured task record (default `tasks.md`) while work is active and its
`changelog.md` after completion. A completed item is removed only by the
completion reconciliation above; retain its concise summary in the owning
component's `changelog.md`.

A backlog may not make a structural or authority decision outside its own
component boundary. The same rule applies at every hierarchy level, not only at
the repository root: a descendant backlog cannot affect an ancestor, sibling, or
shared boundary merely by containing a proposal. Introducing, removing, or
relocating a directory outside the component; changing an authoritative
source-tree convention; or creating cross-component authority belongs in the
nearest affected ancestor backlog or an explicitly scoped design/architecture
task. An ancestor backlog may link to or reference descendant backlog items,
but the descendant item alone is not sufficient authorization for the broader
change. After the ancestor decision is recorded, each affected descendant may
carry only its bounded implementation or compatibility follow-up.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Ownership | Component path or explicitly proposed new component |
| Description and notes | Description states the bounded proposal; notes preserve relevant supporting context without becoming task authority |
| Priority and sequence | Priority is attributable to the user; project-level sequence is system-decided, dependency-aware, and responsive to priority changes or explicit reprioritization requests |
| Scope | Bounded dependencies and acceptance conditions |
| Completion | Completed item is removed; its summary is recorded in the owning component's `changelog.md` |
