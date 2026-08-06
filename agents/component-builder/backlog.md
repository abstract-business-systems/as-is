# Component-Builder Backlog

Planning index only; active work belongs to `tasks.md` in this component.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| independent-behavior-contract | open | 3 | 3 | Make component-builder behavior and tests independent of other agent identities | Refactor the component-builder contract and behavioral tests so bounded behavior depends on its own durable task record, declared authority, and explicit child-handoff rules rather than fixed upstream or downstream role behavior. Preserve semantic completion, validation, descendant closure, scoped commit, and parent integration ownership. | agents/component-builder:live-behavioral-baseline | The live baseline passes before and after the refactor; each behavioral case can run alone with local fixtures; no test requires as-is, worker, expert, or another component's output; focused deterministic checks and diff-check pass. | Refactor follows the live characterization baseline one bounded role at a time. |
