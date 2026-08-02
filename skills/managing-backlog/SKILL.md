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

## Boundaries

The backlog does not contain active status, worker checkpoints, approvals,
validation evidence, or runtime state. Those belong to the component's transient
the configured task record (default `tasks.md`) while work is active and its
`changelog.md` after completion. When a
backlog item is completed, remove it from the planning index; retain its concise
summary only in the owning component's `changelog.md`.

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
