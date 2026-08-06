# Execution-Advisor Backlog

Planning index for the `agents/execution-advisor` role. Active work belongs to
its configured caller task record; completed items are removed after their
summary is recorded in the owning role changelog or handoff.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| live-behavioral-baseline | open | 3 | 3 | Establish an independent live behavioral baseline for execution-advisor | Add opt-in real-Pi behavioral tests using self-contained trace and readable-session fixtures. Verify bounded evidence selection, observations versus inferences and unknowns, recommendation-only behavior, no mutation, no delegation, and no completion or budget authority claims. | - | A short-budget live suite runs independently of other roles and launcher implementation details; each case owns its fixture and cleanup; assertions cover advisory behavior and non-mutation; skipped-provider and residual-risk behavior are explicit. | User-requested prerequisite for refactoring this role. Live execution is opt-in and may consume provider quota. |
| independent-behavior-contract | open | 3 | 3 | Make execution-advisor behavior and tests independent of other agent identities | Refactor the execution-advisor contract and behavioral tests so the role relies only on its declared evidence scope and authority, not a fixed delegation chain, named caller behavior, or another role's output. Preserve read-only diagnosis and durable approval boundaries. | agents/execution-advisor:live-behavioral-baseline | The live baseline passes before and after the refactor; each behavioral case can run alone with local fixtures; no test requires as-is, component-builder, worker, or expert output; focused deterministic checks and diff-check pass. | Refactor follows the live characterization baseline one bounded role at a time. |
