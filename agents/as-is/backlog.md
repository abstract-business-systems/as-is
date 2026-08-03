# as-is Agent Backlog

Planning index for the `agents/as-is` component. Active work belongs to
its configured transient task record; completed items are removed after their
summary is recorded in `changelog.md`.

| id | priority | component | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- | --- |
| bounded-reasoning-for-simple-tasks | High | `agents/as-is` | Keep simple, bounded requests on the cheapest valid path and prevent repeated expert consultation, broad repository exploration, or unnecessary blocking delegation. | Trace evidence from `.as-is/tracing.jsonl`, the current `agent.md` routing contract, and a representative mechanical documentation task. | A simple single-component documentation change is classified and completed with bounded reads/commands, no redundant delegation or retry, a hard wall-clock guard, and a focused routing regression test or fixture; substantive work still follows component authority and validation rules. The motivating example is the one-time removal of obsolete singular `task:` front matter from durable `as-is.md` files: it was expanded into repeated long-running root-agent attempts instead of being handled as a bounded mechanical migration. | open |
| whats-next-routing | High | `agents/as-is` | Route “What’s next?” and equivalent status/routing requests by first finding actionable active, blocked, or awaiting-approval tasks, then inspecting and prioritizing open backlog items only when no actionable task exists. | Current `agent.md` routing contract, `skills/as-is/scripts/orient.ts`, component task-record protocol, and backlog ownership/schema. | A routing request reports or recovers the highest-priority actionable task when one exists; otherwise it returns a justified open backlog selection. Tests or fixtures cover active-task precedence, blocked-task handling, awaiting-approval handling, and backlog fallback without treating conversation or traces as task authority. | open |
