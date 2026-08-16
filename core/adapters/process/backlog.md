# Process Adapter Backlog

Planning index for the `core/adapters/process` component. Active work belongs to this component's configured task record; completed items are removed after their concise summary is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| bounded-stdout-observation | selected | 2 | 3 | Capture bounded worker stdout for host-owned accounting | Extend only the mechanical bounded-process boundary to capture a bounded stdout observation while preserving detached process groups, wall-clock enforcement, logging, inherited output, exit observation, and all task/authority semantics. | designs:execution-accounting-design | Provider-free tests prove bounded capture, truncation/unavailable behavior, log preservation, inherited output, and unchanged budget/exit behavior; the module and tests build cleanly without launcher-specific accounting logic. | Sequential child of root `root:execution-usage-accounting`; no task, Git, worktree, or handoff authority moves into the process adapter. |
