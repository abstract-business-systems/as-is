# as-is Agent Backlog

Planning index for the `agents/as-is` component. Active work belongs to
its configured transient task record; completed items are removed after their
summary is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| measure-linked-context-real-task-use | open | 2 | 2 | Validate linked-context mediation in a real narrow component task | Run one explicitly linked parent-design or fixture handoff through the exposed context tool and record cached input, retry duration, model calls, correctness, rework avoided, and any boundary failure before considering broader mediation. | - | A bounded real-task report covers the linked-context follow-up metrics and confirms whether the current local-only tool is sufficient; no raw-tool mediation or remote access is introduced without separate authorization. | Follow-up from `separate-as-is-configuration-and-linked-context`; original context references: `components/linked-context`, `designs/component-scoped-context-resolution.md`; remote links and raw-tool sandboxing remain intentionally deferred. |

