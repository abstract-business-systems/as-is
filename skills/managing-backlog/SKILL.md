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
| `priority` | Ordered urgency/value class | Yes |
| `component` | Owning component path | Yes |
| `outcome` | Desired bounded result | Yes |
| `dependencies` | Required completed inputs | When applicable |
| `acceptance` | Observable completion signal | Yes |
| `status` | `open` or `selected` | Yes |

## Selection Contract

| Condition | Required result |
| --- | --- |
| Component context | Owning `as-is.md` exists and is understood |
| Priority | Rationale reflects authority, blockers, risk, intent, value, and budget |
| Scope | Outcome and acceptance are bounded to the owning component |
| Hierarchy | A backlog may propose work within its own component boundary, but a descendant backlog cannot authorize changes to an ancestor, sibling, or shared boundary. Work that changes a directory structure, source-tree convention, or authority beyond the owning component must be proposed and accepted in the nearest affected ancestor backlog; descendant backlogs may be referenced as bounded follow-ups only after that ancestor decision |
| Dependencies | Required inputs are named and available or remain open |
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
| Priority | Observable prioritization rationale |
| Scope | Bounded dependencies and acceptance conditions |
| Completion | Completed item is removed; its summary is recorded in the owning component's `changelog.md` |
