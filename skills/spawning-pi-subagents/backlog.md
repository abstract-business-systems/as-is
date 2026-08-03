# Spawning-Pi-Subagents Backlog

Planning index for the `skills/spawning-pi-subagents` component. Active work
belongs to its configured task record; completed items are removed after their
summary is recorded in the component changelog.

| id | priority | component | outcome | dependencies | acceptance | status |
| --- | --- | --- | --- | --- | --- | --- |
| non-blocking-observation | High | `skills/spawning-pi-subagents` | Make delegation non-blocking and observable. | Current launcher contract and lifecycle telemetry. | Detached delegation exposes bounded status and completion evidence without changing task authority. | open |
| recovery-digest | Medium | `skills/spawning-pi-subagents` | Forward a compact recovery digest instead of re-deriving the same context at every delegation tier. | Durable task records and current launcher handoff format. | Parent/supervisor produces the digest once; descendants consume it read-only and tests cover nested/restarted handoff. | open |
| incremental-log-observation | Medium | `skills/spawning-pi-subagents` | Replace blind full-log waiting with cursor-based incremental observation. | Existing child log handling. | Observation tracks byte/line cursors and reads only new content without adding task authority or launch semantics. | open |
| detached-watchdog | High | `skills/spawning-pi-subagents` | Add a detached watchdog supervisor for child wall-clock enforcement. | Launcher lifecycle events and configured budgets. | Over-budget children are detected and recorded deterministically without silent retries. | open |
| restart-reconciliation | High | `skills/spawning-pi-subagents` | Reconcile dead processes with non-terminal durable child records. | Child registry, lifecycle records, and existing recovery path/backoff. | Dead-PID records become explicit recovery candidates with reason and observation; subtree cancellation remains out of scope. | open |
| adaptive-session-budgeting | Medium | `skills/spawning-pi-subagents` | Define budget-aware checkpoint, analysis, and resume/fork lifecycle for long-running subagents. | Durable Pi sessions, task-record recovery, detached supervisor, cumulative budget accounting. | A reviewed design defines soft allocations, hard safety ceilings, checkpoint-and-exit pause, authorized resume/fork, session analysis boundaries, and cumulative budget evidence without making session content or telemetry authoritative. | open |
