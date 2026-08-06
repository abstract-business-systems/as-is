# as-is Agent Backlog

Planning index for the `agents/as-is` component. Active work belongs to
its configured transient task record; completed items are removed after their
summary is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |

| independent-behavior-contract | open | 3 | 3 | Make as-is behavior and tests independent of other agent identities | Refactor the as-is contract and behavioral tests so direct handling and routing depend on declared capability, durable task authority, and explicit admission rather than a fixed delegation chain or named downstream role output. Preserve recommendation-only behavior and self-target rejection. | agents/as-is:live-behavioral-baseline | The live baseline passes before and after the refactor; each behavioral case can run alone with local fixtures; no test requires component-builder, execution-advisor, worker, or expert output; focused deterministic checks and diff-check pass. | Refactor follows the live characterization baseline one bounded role at a time. |
