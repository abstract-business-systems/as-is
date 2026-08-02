---
name: managing-backlog
description: Maintains and prioritizes bounded component work in the repository backlog.
---

# Managing Backlog

Maintain the repository backlog as a planning index, not as task authority.

## Naming Guidance

Name skills with capability phrases that read as real skills (for example,
`as-is-setup`), not role names or function-like names. Agent identities use
role names such as `component-builder` and `reviewer`; that agent convention
does not apply to skill names.

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
| Scope | Outcome and acceptance are bounded |
| Dependencies | Required inputs are named and available or remain open |
| Selection | Invoke `implementing-component-tasks` with the selected item |

## Boundaries

The backlog does not contain active status, worker checkpoints, approvals,
validation evidence, or runtime state. Those belong to the component's transient
`task.md` while work is active and its `changelog.md` after completion. When a
backlog item is completed, remove it from the planning index; retain its concise
summary only in the owning component's `changelog.md`.

## Quality Checks

| Check | Required evidence |
| --- | --- |
| Ownership | Component path or explicitly proposed new component |
| Priority | Observable prioritization rationale |
| Scope | Bounded dependencies and acceptance conditions |
| Completion | Completed item is removed; its summary is recorded in the owning component's `changelog.md` |
