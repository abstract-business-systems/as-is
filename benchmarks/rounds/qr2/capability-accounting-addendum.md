## Capability accounting addendum

| Capability | Carried by instruction? | If NO: reason |
|---|---|---|
| Launching-client cwd as project-configuration origin | **PARTIAL** — “Resolve delegation configuration from the launching client's project context,” but this does not explicitly identify the launching client's cwd as the configuration origin, distinct from the child's component-root cwd. | Oversight; runtime exposes both contexts. |
| CLI identity wiring (`caller`, `parent-job-id`, `record`) | **PARTIAL** — Actor, session, parent-session, and task-state information are required, but their explicit launcher identity wiring is not. | Oversight; runtime exposes these identity fields. |
| Role-declared tools, permissions, and mode contracts | **PARTIAL** — Installed executor declarations must be inspected and writes may not contradict a role contract, but declared tools, permissions, and mode are not each explicitly honored. | Oversight; runtime exposes these role contracts. |
| Alias passthrough semantics (`models[selected] ?? selected`) | **PARTIAL** — Named aliases are consulted, but literal model IDs not present as aliases could be incorrectly treated as unresolved rather than passed through. | Oversight; runtime supports alias lookup with literal-ID passthrough. |
