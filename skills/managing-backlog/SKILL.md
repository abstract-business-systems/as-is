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
| `status` | `open`, `selected`, or `completed` | Yes |
| `changelog` | Link to completed summary | When completed |

## Selection Contract

| Condition | Required result |
| --- | --- |
| Component context | Owning `as-is.md` exists and is understood |
| Priority | Rationale reflects authority, blockers, risk, intent, value, and budget |
| Scope | Outcome and acceptance are bounded |
| Dependencies | Required inputs are named and available or remain open |
| Selection | Invoke `implementing-component-tasks` with the selected item |

## Boundaries

The backlog does not contain active status, worker checkpoints, approvals,
validation evidence, or runtime state. Those belong to the component's transient
`task.md` while work is active and its `changelog.md` after completion.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Ownership | Component path or explicitly proposed new component |
| Priority | Observable prioritization rationale |
| Scope | Bounded dependencies and acceptance conditions |
| Completion | `completed` item links to its changelog summary |
