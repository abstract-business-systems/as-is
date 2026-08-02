# as-is Agent Backlog

Planning index for the `.agents/agents/as-is` component. Active work belongs to
its configured transient task record; completed items are removed after their
summary is recorded in `changelog.md`.

| id | priority | component | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- | --- |
| bounded-reasoning-for-simple-tasks | High | `.agents/agents/as-is` | Keep simple, bounded requests on the cheapest valid path and prevent repeated expert consultation, broad repository exploration, or unnecessary blocking delegation. | Trace evidence from `.as-is/tracing.jsonl`, the current `agent.md` routing contract, and a representative mechanical documentation task. | A simple single-component documentation change is classified and completed with bounded reads/commands, no redundant delegation or retry, a hard wall-clock guard, and a focused routing regression test or fixture; substantive work still follows component authority and validation rules. The motivating example is the one-time removal of obsolete singular `task:` front matter from durable `as-is.md` files: it was expanded into repeated long-running root-agent attempts instead of being handled as a bounded mechanical migration. | open |
